import mongoose from "mongoose";

const generateUniqueShortId = async (Model) => {
  let id;
  let exists = true;
  while (exists) {
    id = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit number
    exists = await Model.findOne({ shortId: id });
  }
  return id;
};

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 60 },
    desc: { type: String, required: true, maxlength: 200 },
    imgs: { type: [String], required: true }, // multiple images
    prices: { type: [Number], required: true },
    extraOptions: [
      {
        text: { type: String },
        price: { type: Number },
      },
    ],
    category: { type: String, required: true },
    shortId: { type: String, unique: true },
  },
  { timestamps: true }
);

// Pre-save hook to generate unique shortId
ProductSchema.pre("save", async function (next) {
  if (!this.shortId) {
    this.shortId = await generateUniqueShortId(mongoose.model("Product"));
  }
  next();
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
