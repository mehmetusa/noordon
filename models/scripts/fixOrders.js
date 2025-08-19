import mongoose from "mongoose";
import shortid from "shortid";
import Order from "../Order.js"
import dbConnect from "../../util/mongo.js";

const fixOrders = async () => {
  await dbConnect();

  const orders = await Order.find({ shortId: { $exists: false } });

  for (const order of orders) {
    order.shortId = shortid.generate().slice(0, 5);
    await order.save();
    console.log(`Updated order ${order._id} with shortId ${order.shortId}`);
  }

  console.log("All missing shortId fields have been updated.");
  mongoose.connection.close();
};

fixOrders().catch((err) => {
  console.error(err);
  mongoose.connection.close();
});
