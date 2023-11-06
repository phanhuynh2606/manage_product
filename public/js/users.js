// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if(listBtnAddFriend.length > 0){
   listBtnAddFriend.forEach(button => {
      button.addEventListener("click", (e) =>{
         const userId = button.getAttribute("btn-add-friend");
         button.closest(".box-user").classList.add("add");
         // console.log(userId);

         socket.emit("CLIENT_ADD_FRIEND", userId);
      });
   });
}
// Hết chức năng gửi yêu cầu

// Chức năng hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", (e) => {
      const userId = button.getAttribute("btn-cancel-friend");
      button.closest(".box-user").classList.remove("add");
      // console.log(userId);

      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
// Hết chức năng hủy gửi yêu cầu

// Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    button.addEventListener("click", (e) => {
      const userId = button.getAttribute("btn-refuse-friend");
      button.closest(".box-user").classList.add("refuse");
      // console.log(userId);

      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}
// Hết chức năng từ chối kết bạn

// Chức năng chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    button.addEventListener("click", (e) => {
      const userId = button.getAttribute("btn-accept-friend");
      button.closest(".box-user").classList.add("accepted");
      // console.log(userId);

      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  });
}
// Hết chức năng chấp nhận kết bạn
