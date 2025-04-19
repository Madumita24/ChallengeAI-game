// const OpenAI = require('openai');
// require('dotenv').config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// module.exports = { openai };
const OpenAI = require('openai');
require('dotenv').config();

const clients = [
  new OpenAI({ apiKey: process.env.OPENAI_KEY_1 }),
  new OpenAI({ apiKey: process.env.OPENAI_KEY_2 }),
  new OpenAI({ apiKey: process.env.OPENAI_KEY_3 }),
  new OpenAI({ apiKey: process.env.OPENAI_KEY_4 }),
];

module.exports = { clients };
