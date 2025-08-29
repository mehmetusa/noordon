import dbConnect from "../../../util/mongo";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { customer, address, total, method, deliveryDate, deliverySlot } =
        req.body;

      if (!deliveryDate || !deliverySlot) {
        return res
          .status(400)
          .json({ message: "Delivery date and slot are required" });
      }

      const order = await Order.create({
        customer,
        address,
        total,
        method,
        deliveryDate,
        deliverySlot,
      });

      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === "GET") {
    const orders = await Order.find();
    res.status(200).json(orders);
  }
}
