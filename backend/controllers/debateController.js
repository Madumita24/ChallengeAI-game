const { clients } = require('../openai/client');
const db = require('../firebase');

const AGENT_PROFILES = [
  { name: 'Blue', profile: 'a pragmatic, realism-focused official', model: 'gpt-4', clientIndex: 0 },
  { name: 'Green', profile: 'an equity-focused community advocate', model: 'gpt-4', clientIndex: 1 },
  { name: 'Red', profile: 'a data-driven policy analyst', model: 'gpt-3.5-turbo', clientIndex: 2 },
  { name: 'Yellow', profile: 'a budget-conscious education planner', model: 'gpt-3.5-turbo', clientIndex: 3 }
];

const optionDescriptions = {
  "Access to Education": [
    "Limit access to education for refugees, allowing only a small percentage to enroll in mainstream schools.",
    "Establish separate schools or learning centers specifically for refugee education.",
    "Provide equal access to education for all, and integrate refugee students into mainstream schools."
  ],
  "Language Instruction": [
    "Teach only Teanish in schools, excluding other languages.",
    "Provide primary Teanish language courses to refugees.",
    "Implement bilingual education programs in both Teanish and the refugees' mother tongues."
  ],
  "Teacher Training": [
    "Provide minimal or no specific training for teachers regarding refugee education.",
    "Offer basic training sessions for teachers to familiarize them with the challenges and needs of refugee students.",
    "Implement comprehensive and ongoing training programs for teachers to support and educate refugee students effectively."
  ],
  "Curriculum Adaptation": [
    "Maintain the existing national curriculum without modifications.",
    "Introduce supplementary materials acknowledging refugee experiences within the current curriculum.",
    "Adapt the national curriculum to include diverse perspectives, histories, and cultural elements relevant to all."
  ],
  "Psychosocial Support": [
    "Provide limited or no specific psychosocial support for refugee students.",
    "Establish basic support services such as counseling and peer support programs.",
    "Develop comprehensive and specialized psychosocial support programs for refugee students and their families."
  ],
  "Financial Support": [
    "Allocate minimal funds to support refugee education.",
    "Increase financial support for refugee education, but may still fall short of full needs.",
    "Allocate significant financial resources to ensure adequate funding and comprehensive support."
  ],
  "Certification/Accreditation": [
    "Only recognize education obtained within the Republic of Bean, disregarding prior learning.",
    "Establish a universal evaluation process to accredit refugees’ prior education.",
    "Combine recognition of previous education with additional training to meet national standards."
  ]
};

async function getAgentReplies(sessionId, category, userSpeech) {
  const replies = await Promise.all(
    AGENT_PROFILES.map(async ({ profile, model, clientIndex }, index) => {
      const client = clients[clientIndex];

      const prompt = `
You are ${profile}, participating in a high-stakes refugee education policy debate for the Republic of Bean. 
Your role is to bring a thoughtful, ideologically grounded perspective to each decision.

User said: "${userSpeech}"

Category under discussion: "${category}"

Available policy options:
1️⃣ ${optionDescriptions[category][0]}
2️⃣ ${optionDescriptions[category][1]}
3️⃣ ${optionDescriptions[category][2]}

Instructions:
- Respond with a clear, nuanced policy justification in 2–3 sentences.
- Reflect your values, but do not automatically select the most expensive or ambitious option.
- Consider the national budget constraint: only 14 total points can be used across all 7 categories.
- Only 1, 2, or 3 points can be spent in this category. You must vote with awareness of tradeoffs.
- Responses must be reflective, ethically grounded, and avoid harmful stereotypes or tokenism.

Use this format:

 [Your short argument from your policy lens]
Vote: [1 | 2 | 3]
`.trim();

      try {
        console.log(`🔵 Prompt for Agent ${index + 1} (${profile}):\n${prompt}`);

        const completion = await client.chat.completions.create({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.9
        });

        const fullReply = completion.choices[0]?.message?.content?.trim() || "[No response received]";
        const voteMatch = fullReply.match(/Vote:\s*([1-3])/);
        const vote = voteMatch ? voteMatch[1] : "1"; // Fallback to 1 if not parsed

        console.log(`✅ Agent ${index + 1} reply: ${fullReply}`);
        console.log(`🗳️ Parsed vote: ${vote}`);

        return {
          fullReply,
          vote
        };
      } catch (error) {
        console.error(`❌ Agent ${index + 1} (${profile}) failed to respond:`, error);
        return {
          fullReply: `⚠️ I encountered an error while generating my response.`,
          vote: "1"
        };
      }
    })
  );

  const formattedReplies = replies.map(r => r.fullReply);
  const agentVotes = replies.map(r => r.vote);

  // 🔥 Save discussion to Firestore
  try {
    await db.collection('debates').add({
      sessionId,
      category,
      userSpeech,
      agentReplies: formattedReplies,
      agentVotes,
      timestamp: new Date()
    });
    console.log(`✅ Debate stored successfully for session ${sessionId}`);
  } catch (error) {
    console.error('❌ Error saving debate to Firestore:', error);
  }

  return { agentReplies: formattedReplies, agentVotes };
}


module.exports = { getAgentReplies };
