const Cart = require("../../models/cart.model");
module.exports.cartId = async (req, res, next) => {
//   console.log(req.cookies.cartId);
   if (!req.cookies.cartId){
      // Tạo giỏ hàng
      const cart = new Cart();
      await cart.save();


      const expiresCookie = 365*24*60*60*1000;
      res.cookie("cartId", cart.id, {
        expires: new Date(Date.now() + expiresCookie),
      });
   }else{
      //Lấy ra
      const cart = await Cart.findOne({
         _id : req.cookies.cartId
      });
       cart.totalQuantity = cart.products.reduce((sum,item) =>{
         return sum + item.quantity
      },0);
      res.locals.miniCart = cart;
   } 
   next();
};
