const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  capacity: { type: Number },
});

// Virtual for location's URL
LocationSchema.virtual("url").get(function () {
  return `/locations/${this._id}`;
});

module.exports = mongoose.model("Locations", LocationSchema);
