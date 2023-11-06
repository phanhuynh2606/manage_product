const Chat = require("../../models/chat.model");

const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports = (res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  // Socket IO
  _io.once("connection", (socket) => {
    console.log("connect" + socket.id);
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      let images = [];

      for (const imageBuffer of data.images) {
        const link = await uploadToCloudinary(imageBuffer);
        images.push(link);
      }

      // Lưu vào dtbase
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images,
      });
      await chat.save();

      // Trả data vè client
      _io.emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: images,
      });
    });
    //Typing
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      });
    });
    //End Typing
  });
};
