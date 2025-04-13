const { OrderModel, CartModel, WishlistModel } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { APIError } = require("../../utils/app-errors");
const lodash = require("lodash");
const mongoose = require("mongoose");
//Dealing with data base operations
class ShoppingRepository {
  async Cart(customerId) {
    return CartModel.findOne({ customerId });
  }

  async ManageCart(customerId, product, qty, isRemove) {
    const cart = await CartModel.findOne({ customerId });

    if (cart) {
      if (isRemove) {
        const cartItems = lodash.filter(
          cart.items,
          (item) => item.product._id !== product._id,
        );
        cart.items = cartItems;
        // handle remove case
      } else {
        const cartIndex = lodash.findIndex(cart.items, {
          product: { _id: product._id },
        });
        if (cartIndex > -1) {
          if (cart.items[cartIndex].unit + qty === 0) {
            const cartItems = lodash.filter(
              cart.items,
              (item) => item.product._id !== product._id,
            );
            cart.items = cartItems;
          } else {
            cart.items[cartIndex].unit += qty;
          }
        } else {
          cart.items.push({ product: { ...product }, unit: qty });
        }
      }
      return await cart.save();
    } else {
      // create a new one
      return await CartModel.create({
        customerId,
        items: [{ product: { ...product }, unit: qty }],
      });
    }
  }

  async ManageWishlist(customerId, product_id, isRemove = false) {
    const wishlist = await WishlistModel.findOne({ customerId });
    if (wishlist) {
      if (isRemove) {
        const produtcs = lodash.filter(
          wishlist.products,
          (product) => product._id !== product_id,
        );
        wishlist.products = produtcs;
        // handle remove case
      } else {
        const wishlistIndex = lodash.findIndex(wishlist.products, {
          _id: product_id,
        });
        if (wishlistIndex < 0) {
          wishlist.products.push({ _id: product_id });
        }
      }
      return await wishlist.save();
    } else {
      // create a new one
      console.log("create");
      return await WishlistModel.create({
        customerId,
        products: [{ _id: product_id }],
      });
    }
  }

  async GetWishlistByCustomerId(customerId) {
    return WishlistModel.findOne({ customerId });
  }

  async Orders(customerId, orderId) {
    try {
      let data;
      if (orderId) {
        data = await OrderModel.findById(orderId);
      } else {
        data = await OrderModel.find({ customerId });
      }

      return data;
    } catch (err) {
      throw new APIError("API Error", 500, "Unable to Find Orders");
    }
  }

  async CreateNewOrder(customerId, txnId) {
    //required to verify payment through TxnId

    const cart = await CartModel.findOne({ customerId: customerId });

    if (cart) {
      let amount = 0;

      let cartItems = cart.items;

      if (cartItems.length > 0) {
        //process Order

        cartItems.map((item) => {
          amount += parseInt(item.product.price) * parseInt(item.unit);
        });

        const orderId = uuidv4();

        const order = new OrderModel({
          orderId,
          customerId,
          amount,
          status: "received",
          items: cartItems,
        });

        cart.items = [];

        const orderResult = await order.save();
        await cart.save();
        return orderResult;
      }
    }

    return {};
  }

  async deleteProfileData(customerId) {
    return Promise.all([
      CartModel.findOneAndDelete({ customerId }),
      WishlistModel.findOneAndDelete({ customerId }),
      OrderModel.deleteMany({ customerId }),
    ]);
  }
}

module.exports = ShoppingRepository;
