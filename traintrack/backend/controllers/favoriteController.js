const User = require('../models/User');

exports.addFavorite = async (req, res) => {
  try {
    const { trainId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(trainId)) {
      user.favorites.push(trainId);
      await user.save();
    }
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { trainId } = req.params;
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(id => id !== trainId);
    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
