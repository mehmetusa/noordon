import dbConnect from "../../../util/mongo";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  const { method, cookies } = req;

  const token = cookies.token

  dbConnect();

  if (req.method === "GET") {
    try {
      const { category } = req.query;

      let filter = {};
      console.log("mehmet filter",filter)
      console.log("mehmet category",category)

      if (category && category.toLowerCase() !== "All Products") {
        filter.category = category.toLowerCase(); // or match DB case
      }

      const products = await Product.find(filter);
      return res.status(200).json(products);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  if (method === "POST") {
    // if(!token || token !== process.env.token){
    //   return res.status(401).json("Not authenticated!")
    // }
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
