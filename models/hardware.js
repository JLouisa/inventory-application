const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HardwareSchema = new Schema({
  name: { type: String, required: true },
  manufacturer: { type: Schema.Types.ObjectId, ref: "Manufacturer", required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  numberInStock: { type: Number },
  sku: { type: String, required: true },
  specifications: { type: Array, required: true },
  locations: { type: Schema.Types.ObjectId, ref: "Location", required: true },
});

// Virtual for book's URL
HardwareSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `catalog/hardware/${this._id}`;
});

// Virtual field to get warrantyInformation from the manufacturer
HardwareSchema.virtual("warrantyInformation").get(function () {
  if (this.manufacturer) {
    const keys = Object.keys(this.manufacturer.warranties);
    for (const key of keys) {
      if (key === this.category.name) {
        const value = this.manufacturer.warranties[key];
        return value;
      }
    }
  }
  return "No warranty information available";
});

// Export model
module.exports = mongoose.model("Hardware", HardwareSchema);
