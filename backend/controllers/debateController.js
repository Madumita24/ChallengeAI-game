// // const { openai } = require('../openai/client');
// const { clients } = require('../openai/client');


// const AGENT_PROFILES = [
//   {
//     name: 'Blue',
//     profile: 'a pragmatic, realism-focused official',
//     model: 'gpt-4',
//     clientIndex: 0
//   },
//   {
//     name: 'Green',
//     profile: 'an equity-focused community advocate',
//     model: 'gpt-4',
//     clientIndex: 1
//   },
//   {
//     name: 'Red',
//     profile: 'a data-driven policy analyst',
//     model: 'gpt-3.5-turbo',
//     clientIndex: 2
//   },
//   {
//     name: 'Yellow',
//     profile: 'a budget-conscious education planner',
//     model: 'gpt-3.5-turbo',
//     clientIndex: 3
//   }
// ];

// async function getAgentReplies(category, userSpeech) {
//   const replies = await Promise.all(
//     AGENT_PROFILES.map(async ({ profile, model, clientIndex }) => {
//       const client = clients[clientIndex];
//       const prompt = `You are ${profile}. The current refugee education policy category is "${category}". A user said: "${userSpeech}". Respond from your perspective in 2–3 sentences.`;

//       const completion = await client.chat.completions.create({
//         model,
//         messages: [{ role: 'user', content: prompt }],
//         temperature: 0.8,
//       });

//       return completion.choices[0].message.content.trim();
//     })
//   );

//   return replies;
// }

// module.exports = { getAgentReplies };

const { clients } = require('../openai/client');

const AGENT_PROFILES = [
  { name: 'Blue', profile: 'a pragmatic, realism-focused official', model: 'gpt-4', clientIndex: 0 },
  { name: 'Green', profile: 'an equity-focused community advocate', model: 'gpt-4', clientIndex: 1 },
  { name: 'Red', profile: 'a data-driven policy analyst', model: 'gpt-3.5-turbo', clientIndex: 2 },
  { name: 'Yellow', profile: 'a budget-conscious education planner', model: 'gpt-3.5-turbo', clientIndex: 3 }
];

async function getAgentReplies(category, userSpeech) {
  const replies = await Promise.all(
    AGENT_PROFILES.map(async ({ profile, model, clientIndex }) => {
      const client = clients[clientIndex];

      const prompt = `
You are ${profile}, participating in a high-stakes refugee education policy debate.
Do not agree blindly with the user. Instead, analyze their statement and respond from your distinct policy perspective.

User said: "${userSpeech}"

- Provide a strong, reasoned argument in 2–3 sentences.
- Either support with justification or politely challenge their point.
- Stay in character and speak like a confident expert.

Category under discussion: "${category}"
`.trim();

      console.log(`Prompt for ${profile}:\n`, prompt);

      const completion = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9
      });

      return completion.choices[0]?.message?.content?.trim() || "[No response received]";
    })
  );

  return replies;
}

module.exports = { getAgentReplies };

