import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });


// models/scripts/addCategories.js
import dbConnect from "../../util/dbConnect.js";
import Category from "../Category.js";

const categories = [
  { name: "Bakery" },
  { name: "Cakes" },
  { name: "Desserts" },
  { name: "Salads" },
  { name: "Salties" },
  { name: "Cookies" }
];

async function addCategories() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");

    for (const category of categories) {
      const exists = await Category.findOne({ name: category.name });
      if (!exists) {
        await Category.create(category);
        console.log(`Added category: ${category.name}`);
      } else {
        console.log(`Category already exists: ${category.name}`);
      }
    }

    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error("Error adding categories:", err);
    process.exit(1);
  }
}

addCategories();
