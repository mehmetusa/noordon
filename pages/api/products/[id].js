import dbConnect from "../../../util/mongo";
import Product from "../../../models/Product";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const { method, query: { id } } = req;

  await dbConnect();

  // Get session token (NextAuth JWT)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (method === "GET") {
    try {
      const product = await Product.findById(id).lean(); // plain JS object
      if (!product) return res.status(404).json({ message: "Product not found" });

      // convert _id to string
      product._id = product._id.toString();
      if (product.extraOptions) {
        product.extraOptions = product.extraOptions.map(opt => ({
          ...opt,
          _id: opt._id.toString(),
        }));
      }

      return res.status(200).json(product);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching product", error: err.message });
    }
  }

  if (method === "PUT" || method === "DELETE") {
    if (!token || token.role !== "admin") {
      return res.status(401).json({ message: "Not authenticated!" });
    }

    try {
      if (method === "PUT") {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true }).lean();
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

        updatedProduct._id = updatedProduct._id.toString();
        if (updatedProduct.extraOptions) {
          updatedProduct.extraOptions = updatedProduct.extraOptions.map(opt => ({
            ...opt,
            _id: opt._id.toString(),
          }));
        }

        return res.status(200).json(updatedProduct);
      }

      if (method === "DELETE") {
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ message: "The product has been deleted!" });
      }
    } catch (err) {
      return res.status(500).json({ message: `Error ${method === "PUT" ? "updating" : "deleting"} product`, error: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
