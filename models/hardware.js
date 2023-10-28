const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HardwareSchema = new Schema({
  name: { type: String, required: [true, "Name is required."] },
  manufacturer: { type: Schema.Types.ObjectId, ref: "Manufacturer", required: [true, "Manufacturer is required."] },
  description: { type: String, required: [true, "Description is required."] },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: [true, "Category is required."] },
  price: { type: Number, required: [true, "Price is required."] },
  numberInStock: { type: Number },
  sku: { type: String, required: [true, "SKU is required."] },
  specifications: { type: Array, required: [true, "Specifications is required."] },
  locations: { type: Schema.Types.ObjectId, ref: "Location", required: [true, "Location is required."] },
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
