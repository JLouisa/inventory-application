import mongoose from "mongoose";
const { Schema } = mongoose;

const ManufacturerSchema = new Schema({
  name: { type: String, required: true },
  joinedDate: { type: Date, required: true },
  address: { type: String, required: true },
  warranties: {
    // Object with dynamic category keys and warranty values
    type: Map,
    of: String,
  },
});

// Virtual for manufacturer's URL
ManufacturerSchema.virtual("url").get(function () {
  return `/manufacturer/${this._id}`;
});

module.exports = mongoose.model("Manufacturer", ManufacturerSchema);
