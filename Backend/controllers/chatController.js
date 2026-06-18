import Chat from "../models/Chat.js";

export const saveMessage = async (req, res) => {
  try {
    const { sender, text, time } = req.body;

    const message = await Chat.create({
      patient: req.user._id,
      sender,
      text,
      time,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      patient: req.user._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const clearMyChats = async (req, res) => {
  try {
    await Chat.deleteMany({
      patient: req.user._id,
    });

    res.status(200).json({
      message: "Chat history cleared",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
