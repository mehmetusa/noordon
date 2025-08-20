import dbConnect from "../../../util/mongo";
import Product from "../../../models/Product";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  await dbConnect();

  // Get session token (NextAuth JWT)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (method === "GET") {
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(product);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching product", error: err.message });
    }
  }

  if (method === "PUT") {
    if (!token || token.role !== "admin") {
      return res.status(401).json({ message: "Not authenticated!" });
    }
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(updatedProduct);
    } catch (err) {
      return res.status(500).json({ message: "Error updating product", error: err.message });
    }
  }

  if (method === "DELETE") {
    if (!token || token.role !== "admin") {
      return res.status(401).json({ message: "Not authenticated!" });
    }
    try {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({ message: "The product has been deleted!" });
    } catch (err) {
      return res.status(500).json({ message: "Error deleting product", error: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
