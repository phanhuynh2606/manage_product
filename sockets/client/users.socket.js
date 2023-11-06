const User = require("../../models/user.model");

module.exports = (res) => {
  // Socket IO
  _io.once("connection", (socket) => {
    // Chức năng gửi yêu cầu
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // console.log(userId); // Id cua B
      // console.log(myUserId); // Id cua A

      // Thêm id của A vào acceptFriends của B
      const existAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (!existAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: {
              acceptFriends: myUserId,
            },
          }
        );
      }
      // Thêm id của B vào requestFriends của A
      const existBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (!existBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: {
              requestFriends: userId,
            },
          }
        );
      }
    });
    // Hết chức năng gửi yêu cầu

    // Chức năng hủy gửi yêu cầu
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // console.log(userId); // Id cua B
      // console.log(myUserId); // Id cua A

      // Xóa id của A trong acceptFriends của B
      const existAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (existAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: {
              acceptFriends: myUserId,
            },
          }
        );
      }
      // Xóa id của B trong requestFriends của A
      const existBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (existBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: {
              requestFriends: userId,
            },
          }
        );
      }
    });
    // Hết chức năng hủy gửi yêu cầu

    // Chức năng từ chối kết bạn
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // console.log(userId); // Id cua A
      // console.log(myUserId); // Id cua B

      // Xóa id của A trong acceptFriends của B
      const existIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (existIdAinB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: {
              acceptFriends: userId,
            },
          }
        );
      }
      // Xóa id của B trong requestFriends của A
      const existBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (existBinA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: {
              requestFriends: myUserId,
            },
          }
        );
      }
    });
    // Hết chức năng từ chối kết bạn

    // Chức năng chấp nhận kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // console.log(userId); // Id cua A
      // console.log(myUserId); // Id cua B

      // Thêm {user_id, room_chat_id} của A vào friendList của B
      // Xóa id của A trong acceptFriends của B
      const existIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (existIdAinB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: {
              friendList: {
                user_id: userId,
                room_chat_id: "",
              },
            },
            $pull: {
              acceptFriends: userId,
            },
          }
        );
      }
      // Thêm {user_id, room_chat_id} của B vào friendList của A
      // Xóa id của B trong requestFriends của A
      const existBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (existBinA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: {
              friendList: {
                user_id: myUserId,
                room_chat_id: "",
              },
            },
            $pull: {
              requestFriends: myUserId,
            },
          }
        );
      }
    });
    // Hết chức năng chấp nhận kết bạn
  });
};
