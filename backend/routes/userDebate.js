const express = require('express');
const router = express.Router();
const { getAgentReplies } = require('../controllers/debateController');

router.post('/', async (req, res) => {
  const { sessionId, category, userSpeech } = req.body;

  try {
    const { agentReplies, agentVotes } = await getAgentReplies(sessionId, category, userSpeech);
    res.json({ agentReplies, agentVotes }); // ✅ Return both replies AND votes
  } catch (error) {
    console.error('Error in /user-debate:', error);
    res.status(500).json({ error: 'Agent response generation failed' });
  }
});

module.exports = router;
