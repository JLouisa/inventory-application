const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ManufacturerSchema = new Schema({
  name: { type: String, required: true },
  joinedDate: { type: Date, required: true },
  address: { type: String, required: true },
  warranties: {
    // Object with dynamic category keys and warranty values
    type: Object,
    of: String,
  },
});

// Virtual for manufacturer's URL
ManufacturerSchema.virtual("url").get(function () {
  return `/manufacturer/${this._id}`;
});

ManufacturerSchema.virtual("theWarranties").get(function () {
  const arr = [];
  const keys = Object.keys(this.warranties);
  keys.forEach((key) => {
    const value = this.warranties[key];
    arr.push(`${key}: ${value}`);
  });
  return arr;
});

module.exports = mongoose.model("Manufacturer", ManufacturerSchema);
