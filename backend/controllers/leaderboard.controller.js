const Score = require('../models/Score');

const getLeaderboard = async (req, res) => {
  try {
    const scores = await Score.find()
      .populate('userId', 'username')
      .sort({ score: -1, createdAt: -1 });

    const bestScoresByUser = new Map();

    scores.forEach((attempt) => {
      const user = attempt.userId;

      if (!user) {
        return;
      }

      const userId = user._id.toString();

      if (!bestScoresByUser.has(userId)) {
        bestScoresByUser.set(userId, {
          username: user.username,
          score: attempt.score,
          totalQuestions: attempt.totalQuestions,
          createdAt: attempt.createdAt,
        });
      }
    });

    const data = Array.from(bestScoresByUser.values()).map((attempt, index) => ({
      rank: index + 1,
      ...attempt,
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load leaderboard',
    });
  }
};

module.exports = {
  getLeaderboard,
};

