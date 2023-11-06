const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

const chatSocket = require("../../sockets/client/chat.socket");
//GET /chat

module.exports.index = async (req, res) => {
  // Socket IO
  chatSocket(res);

  // End Socket IO

  // Lấy data từ database
  const chats = await Chat.find({
    deleted: false,
  });
  for (const chat of chats) {
    const inforUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");
    chat.inforUser = inforUser;
  };

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
  });
};
