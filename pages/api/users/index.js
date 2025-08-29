import dbConnect from "../../../util/dbConnect"; // your MongoDB connection helper
import User from "../../../models/user";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const users = await User.find({}, { password: 0 }); // exclude passwords
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users", error: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
