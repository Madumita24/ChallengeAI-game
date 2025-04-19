const express = require('express');
const app = express();
const userDebate = require('./routes/userDebate');

app.use(express.json());
app.use('/user-debate', userDebate);

// Add this block to start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
