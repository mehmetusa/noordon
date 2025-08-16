import dbConnect from "../../../util/mongo";
import User from "../../../models/user";
import bcrypt from "bcryptjs";

// async function createAdmin() {
//     await dbConnect();
  
//     // const existing = await User.findOne({ username: "admin" });
//     // if (existing) return;
  
//     // const hashedPassword = await bcrypt.hash("admin", 12);
  
//     const adminUser = new User({
//       username: "admin",
//       email: "admin9990@admin.com",
//       password: "admin9990@admin.com", //hashedPassword,
//       role: "admin",
//     });
  
//     await adminUser.save();
//     console.log("Admin user created");
//   }
  
//   createAdmin();

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  res.status(201).json({ message: "User created" });
}
