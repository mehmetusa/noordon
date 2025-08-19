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

const OrderSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    address: { type: String, required: true },
    total: { type: Number, required: true },
    method: { type: Number, required: true },
    status: { type: Number, default: 0 },
    shortId: { type: String, unique: true },
  },
  { timestamps: true }
);

// Pre-save hook to generate shortId
OrderSchema.pre("save", async function (next) {
  if (!this.shortId) {
    this.shortId = await generateUniqueShortId(mongoose.model("Order"));
  }
  next();
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
