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

const DELIVERY_SLOTS = [
  "08:00–10:00",
  "10:00–12:00",
  "12:00–14:00",
  "14:00–16:00",
  "16:00–18:00",
  "18:00–20:00",
];

const ItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: String,
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  size: String,
});

const OrderSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    address: { type: String, required: true },
    total: { type: Number, required: true },
    method: { type: Number, required: true },
    status: { type: Number, default: 0 },
    shortId: { type: String, unique: true },
    items: [ItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    // Scheduled delivery fields (ASAP disabled)
    deliveryDate: { type: Date, required: true },
    deliverySlot: { type: String, enum: DELIVERY_SLOTS, required: true },
    deliveryStatus: {
      type: String,
      enum: ["Scheduled", "Out for delivery", "Delivered", "Failed"],
      default: "Scheduled",
    },
    customer: {
      name: String,
      phone: String,
      email: String,
      address: String,
    },
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
