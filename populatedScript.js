#! /usr/bin/env node
console.log("This script populates some test hardware, manufacturer, category and location to your database.");

const Manufacturer = require("./models/manufacturer");
const Category = require("./models/category");
const Hardware = require("./models/hardware");
const Location = require("./models/locations");
const dotenv = require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

//! MongoDB Setup
const cluster = process.env.MONGODB_CLUSTER;
const host = process.env.MONGODB_HOST;
const user = encodeURIComponent(process.env.MONGODB_USER);
const pass = encodeURIComponent(process.env.MONGODB_PASS);
const mongoDB = `mongodb+srv://${user}:${pass}@${cluster}${host}`;

const categories = [];
const hardwares = [];
const locations = [];
const manufacturers = [];

main().catch((err) => console.log(err));

//! Generate the data
async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await popCategory();
  await popManufacturer();
  await popLocation();
  await popHardware();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

//! Category
// Create category function
async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  if (description != false) category.description = description;
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

// Populate the categories
async function popCategory() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Processors", "High-performance CPUs for fast and efficient computing."),
    categoryCreate(1, "Graphics Cards", "Powerful GPUs for exceptional gaming and graphics rendering."),
    categoryCreate(2, "Motherboards", "Mainboards with advanced features for building PCs."),
    categoryCreate(3, "RAM", "High-capacity memory modules for smooth multitasking."),
    categoryCreate(4, "Storage Drives", "Fast and reliable storage solutions for data and applications."),
    categoryCreate(5, "Power Supplies", "Efficient PSUs for consistent and stable power delivery to your PC."),
  ]);
}

//! Manufacturer
// Create manufacturer function
async function manufacturerCreate(index, _name, _joinedDate, _address, _warranties) {
  const manufacturerdetail = { name: _name, joinedDate: _joinedDate, address: _address, warranties: _warranties };
  if (_warranties != false) manufacturerdetail.warranties = _warranties;

  const manufacturer = new Manufacturer(manufacturerdetail);

  await manufacturer.save();
  manufacturers[index] = manufacturer;
  console.log(`Added manufacturer: ${_name}`);
}

// Populate the manufacturer
async function popManufacturer() {
  console.log("Adding manufacturer");
  await Promise.all([
    manufacturerCreate(0, "Advanced Micro Devices, Inc", "2020-01-02", "Santa Clara, California, United States", {
      Processors: "3-year warranty for optimal performance.",
      "Graphics Cards": "2-year warranty for high-quality graphics.",
    }),
    manufacturerCreate(1, "Nvidia Corporation", "2002-11-8", "Santa Clara, California, United States", {
      Motherboards: "7-year warranty for reliable connectivity and stability.",
    }),
    manufacturerCreate(2, "Intel Corporation", "1992-04-06", "Mountain View, California, United States", {
      Processors: "1-year warranty for optimal performance.",
      "Graphics Cards": "3-year warranty for high-quality graphics.",
    }),
    manufacturerCreate(3, "ASUSTeK Computer Inc.", "2010-12-12", "Beitou District, Taipei, Taiwan", {
      "Graphics Cards": "1-year warranty for high-quality graphics.",
      Motherboards: "5-year warranty for reliable connectivity and stability.",
      RAM: "Lifetime warranty for seamless multitasking.",
      "Power Supplies": "4-year warranty for consistent power delivery.",
    }),
    manufacturerCreate(4, "be quiet!", "2012-01-16", "Glinde, Schleswig-Holstein, Germany", {
      RAM: "Lifetime warranty for seamless multitasking.",
      "Power Supplies": "4-year warranty for consistent power delivery.",
    }),
    manufacturerCreate(5, "Corsair Gaming, Inc.", "2023-05-05", "Fremont, California, United States", {
      "Graphics Cards": "1-year warranty for high-quality graphics.",
      Motherboards: "5-year warranty for reliable connectivity and stability.",
      RAM: "Lifetime warranty for seamless multitasking.",
      "Power Supplies": "4-year warranty for consistent power delivery.",
      "Power Supplies": "4-year warranty for consistent power delivery.",
    }),
    manufacturerCreate(6, "Samsung Group", "2016-2-2", "Suwon-si, South Korea", {
      RAM: "Lifetime warranty for seamless multitasking.",
      "Power Supplies": "2-year warranty for consistent power delivery.",
    }),
    manufacturerCreate(7, "Gigabyte Technology", "2022-3-4", "New Taipei City, Taiwan", {
      "Graphics Cards": "1-year warranty for high-quality graphics.",
      Motherboards: "3-year warranty for reliable connectivity and stability.",
      RAM: "6-year warranty for high-quality RAM Sticks",
      "Power Supplies": "7-year warranty for consistent power delivery.",
    }),
    manufacturerCreate(8, "Micron Technology, Inc.", "2008-1-11", "Boise, Idaho, United States", {
      RAM: "Lifetime warranty for seamless multitasking.",
    }),
    manufacturerCreate(9, "Micro-Star International Co. Ltd.", "2020-12-1", "Zhonghe District, Taipei, Taiwan", {
      "Graphics Cards": "1-year warranty for high-quality graphics.",
      Motherboards: "5-year warranty for reliable connectivity and stability.",
      "Power Supplies": "4-year warranty for consistent power delivery.",
    }),
    manufacturerCreate(10, "EVGA Corporation", "2012-12-12", "Brea, California, United States", {
      "Graphics Cards": "1-year warranty for high-quality graphics.",
      Motherboards: "5-year warranty for reliable connectivity and stability.",
      RAM: "Lifetime warranty for seamless multitasking.",
      "Power Supplies": "4-year warranty for consistent power delivery.",
    }),
    manufacturerCreate(11, "ASRock Inc.", "2011-11-11", "Taipei City, Taipei, Taiwan", {
      "Graphics Cards": "1-year warranty for high-quality graphics.",
      Motherboards: "5-year warranty for reliable connectivity and stability.",
    }),
    manufacturerCreate(
      12,
      "Kingston Technology Corporation",
      "2017-6-4",
      "Fountain Valley, California, United States",
      {
        RAM: "Lifetime warranty for seamless multitasking.",
      }
    ),
  ]);
}

//! Locations
// Create locations function
async function locationCreate(index, name, address, capacity) {
  const location = new Location({ name: name, address: address, capacity: capacity });
  if (capacity != false) location.capacity = capacity;
  await location.save();
  locations[index] = location;
  console.log(`Added location: ${name}`);
}

// Populate the locations
async function popLocation() {
  console.log("Adding locations");
  await Promise.all([
    locationCreate(0, "TechHub Warehouse", "1234 Tech Street, Techville, TX 12345", 5000),
    locationCreate(1, "Silicon Valley Storage Facility", "5678 Data Drive, Silicon City, CA 54321", 12000),
    locationCreate(2, "East Coast Distribution Center", "9876 Server Road, Data Beach, NY 67890", 7900),
  ]);
}

//! Hardwares
// Create hardwares function
async function hardwareCreate(
  index,
  name,
  manufacturer,
  description,
  category,
  price,
  numberInStock,
  sku,
  specifications,
  locations
) {
  const hardware = new Hardware({
    name: name,
    manufacturer: manufacturer,
    description: description,
    category: category,
    price: price,
    sku: sku,
    specifications: specifications,
    locations: locations,
  });
  if (numberInStock != false) hardware.numberInStock = numberInStock;
  await hardware.save();
  hardwares[index] = hardware;
  console.log(`Added hardware: ${name}`);
}

// Populate the hardwares
async function popHardware() {
  console.log("Adding hardwares");
  await Promise.all([
    hardwareCreate(
      0,
      "AMD Radeon RX 7900 XTX",
      manufacturers[0],
      "The Most Advanced Graphics for Gamers & Creators.",
      categories[1],
      1139,
      233,
      uuidv4(),
      [
        "Compute Units: 96",
        "Ray Accelerators: 96",
        "Game Frequency: 2300 MHz",
        "AMD Infinity Cache Technology: 96 MB",
        "Max Memory Size: 24 GB",
        "Memory Type: GDDR6",
      ],
      locations[0]
    ),
    // Hardware Variation 1
    hardwareCreate(
      1,
      "Intel Core i9-12900K",
      manufacturers[2],
      "High-performance desktop processor for gaming and content creation.",
      categories[0],
      599,
      123,
      uuidv4(),
      ["Cores: 16", "Threads: 24", "Base Clock: 3.2 GHz", "Max Turbo Boost: 5.2 GHz", "Cache: 30MB", "TDP: 125W"],
      locations[0]
    ),
    // Hardware Variation 2
    hardwareCreate(
      2,
      "NVIDIA GeForce RTX 3080",
      manufacturers[1],
      "Powerful graphics card for gaming and ray tracing.",
      categories[1],
      899,
      78,
      uuidv4(),
      ["CUDA Cores: 8704", "Boost Clock: 1710 MHz", "Memory: 10GB GDDR6X", "Ray Tracing Cores: 68", "TDP: 320W"],
      locations[1]
    ),
    // Hardware Variation 3
    hardwareCreate(
      3,
      "ASUS ROG Strix B550-F",
      manufacturers[3],
      "ATX motherboard with support for AMD Ryzen processors.",
      categories[2],
      169,
      45,
      uuidv4(),
      [
        "Form Factor: ATX",
        "CPU Socket: AM4",
        "Memory Support: DDR4, up to 5100 MHz",
        "Expansion Slots: 1x PCIe 4.0 x16",
      ],
      locations[2]
    ),
    // Hardware Variation 4
    hardwareCreate(
      4,
      "Corsair Vengeance LPX 16GB DDR4",
      manufacturers[5],
      "High-performance RAM for gaming and multitasking.",
      categories[3],
      89,
      345,
      uuidv4(),
      ["Capacity: 16GB (2 x 8GB)", "Speed: 3200 MHz", "CAS Latency: 16", "Voltage: 1.35V"],
      locations[0]
    ),
    // Hardware Variation 5
    hardwareCreate(
      5,
      "Samsung 970 EVO 1TB NVMe SSD",
      manufacturers[6],
      "Fast NVMe SSD for storage and data transfer.",
      categories[4],
      149,
      23,
      uuidv4(),
      ["Capacity: 1TB", "Read Speed: up to 3500 MB/s", "Write Speed: up to 2500 MB/s", "Interface: M.2 PCIe 3.0 x4"],
      locations[1]
    ),
    // Hardware Variation 6
    hardwareCreate(
      6,
      "AMD Ryzen 7 5800X",
      manufacturers[0],
      "High-performance desktop processor for gaming and multitasking.",
      categories[0],
      449,
      112233,
      uuidv4(),
      ["Cores: 8", "Threads: 16", "Base Clock: 3.8 GHz", "Max Turbo Boost: 4.7 GHz", "Cache: 36MB", "TDP: 105W"],
      locations[2]
    ),
    // Hardware Variation 7
    hardwareCreate(
      7,
      "NVIDIA GeForce GTX 1660 Super",
      manufacturers[1],
      "Mid-range graphics card for gaming and content creation.",
      categories[1],
      239,
      334,
      uuidv4(),
      ["CUDA Cores: 1408", "Boost Clock: 1785 MHz", "Memory: 6GB GDDR5", "TDP: 125W"],
      locations[0]
    ),
    // Hardware Variation 8
    hardwareCreate(
      8,
      "Gigabyte B450M DS3H",
      manufacturers[7],
      "Micro ATX motherboard with support for AMD Ryzen processors.",
      categories[2],
      79,
      223,
      uuidv4(),
      [
        "Form Factor: Micro ATX",
        "CPU Socket: AM4",
        "Memory Support: DDR4, up to 3200 MHz",
        "Expansion Slots: 1x PCIe 3.0 x16",
      ],
      locations[1]
    ),
    // Hardware Variation 9
    hardwareCreate(
      9,
      "Crucial Ballistix 32GB DDR4",
      manufacturers[4],
      "High-capacity RAM kit for gaming and content creation.",
      categories[3],
      149,
      111,
      uuidv4(),
      ["Capacity: 32GB (2 x 16GB)", "Speed: 3600 MHz", "CAS Latency: 16", "Voltage: 1.35V"],
      locations[2]
    ),
    // Hardware Variation 10
    hardwareCreate(
      10,
      "Samsung 970 EVO 2TB NVMe SSD",
      manufacturers[6],
      "High-capacity NVMe SSD for storage and high-speed data transfer.",
      categories[4],
      249,
      55,
      uuidv4(),
      ["Capacity: 2TB", "Read Speed: up to 3500 MB/s", "Write Speed: up to 2500 MB/s", "Interface: M.2 PCIe 3.0 x4"],
      locations[0]
    ),
    // Hardware Variation 11
    hardwareCreate(
      11,
      "Intel Core i7-11700K",
      manufacturers[2],
      "Desktop processor with overclocking capabilities for gaming and productivity.",
      categories[0],
      399,
      667,
      uuidv4(),
      ["Cores: 8", "Threads: 16", "Base Clock: 3.6 GHz", "Max Turbo Boost: 5.0 GHz", "Cache: 16MB", "TDP: 125W"],
      locations[1]
    ),
    // Hardware Variation 12
    hardwareCreate(
      12,
      "AMD Radeon RX 6600 XT",
      manufacturers[0],
      "Mid-range graphics card with high frame rates for gaming.",
      categories[2],
      299,
      777,
      uuidv4(),
      ["Compute Units: 32", "Boost Clock: 2589 MHz", "Memory: 8GB GDDR6", "TDP: 160W"],
      locations[2]
    ),
    // Hardware Variation 13
    hardwareCreate(
      13,
      "MSI MPG B550 Gaming Edge WiFi",
      manufacturers[9],
      "ATX motherboard with Wi-Fi 6 support for gaming and streaming.",
      categories[2],
      179,
      88,
      uuidv4(),
      [
        "Form Factor: ATX",
        "CPU Socket: AM4",
        "Memory Support: DDR4, up to 5100 MHz",
        "Expansion Slots: 2x PCIe 4.0 x16",
      ],
      locations[0]
    ),
    // Hardware Variation 14
    hardwareCreate(
      14,
      "Crucial P5 Plus 2TB NVMe SSD",
      manufacturers[8],
      "High-capacity NVMe SSD with PCIe Gen4 for fast storage.",
      categories[4],
      299,
      99,
      uuidv4(),
      ["Capacity: 2TB", "Read Speed: up to 6600 MB/s", "Write Speed: up to 5000 MB/s", "Interface: M.2 PCIe 4.0 x4"],
      locations[1]
    ),
    // Hardware Variation 15
    hardwareCreate(
      15,
      "EVGA 600 W1, 80+ WHITE 600W",
      manufacturers[10],
      "Entry-level power supply for basic PC builds.",
      categories[5],
      44,
      121,
      uuidv4(),
      ["Wattage: 600W", "80+ White Certified", "Cable Length: 48cm", "Connectors: 2x PCIe 8-pin, 3x SATA"],
      locations[2]
    ),
    // Hardware Variation 16
    hardwareCreate(
      16,
      "NVIDIA Quadro RTX 4000",
      manufacturers[1],
      "Professional graphics card for 3D rendering and workstation tasks.",
      categories[1],
      899,
      567,
      uuidv4(),
      ["CUDA Cores: 2304", "Boost Clock: 1605 MHz", "Memory: 8GB GDDR6", "TDP: 160W"],
      locations[0]
    ),
    // Hardware Variation 17
    hardwareCreate(
      17,
      "ASRock B460M-HDV",
      manufacturers[11],
      "Micro ATX motherboard with support for Intel 10th Gen processors.",
      categories[2],
      79,
      333,
      uuidv4(),
      [
        "Form Factor: Micro ATX",
        "CPU Socket: LGA 1200",
        "Memory Support: DDR4, up to 2933 MHz",
        "Expansion Slots: 1x PCIe 3.0 x16",
      ],
      locations[1]
    ),
    // Hardware Variation 18
    hardwareCreate(
      18,
      "Kingston HyperX Fury 32GB DDR4",
      manufacturers[12],
      "High-capacity and high-speed RAM kit for gaming and multitasking.",
      categories[3],
      159,
      222,
      uuidv4(),
      ["Capacity: 32GB (2 x 16GB)", "Speed: 3200 MHz", "CAS Latency: 16", "Voltage: 1.35V"],
      locations[2]
    ),
    // Hardware Variation 19
    hardwareCreate(
      19,
      "Samsung 1TB SSD",
      manufacturers[6],
      "Solid-state drive for fast and reliable storage.",
      categories[4],
      99,
      111,
      uuidv4(),
      ["Capacity: 1TB", "Read Speed: up to 560 MB/s", "Write Speed: up to 530 MB/s", "Interface: SATA 6Gb/s"],
      locations[0]
    ),
    // Hardware Variation 20
    hardwareCreate(
      20,
      "Corsair CV550, 80+ BRONZE 550W",
      manufacturers[5],
      "Efficient power supply with 80+ Bronze certification for mainstream PCs.",
      categories[5],
      54,
      777,
      uuidv4(),
      ["Wattage: 550W", "80+ Bronze Certified", "Cable Length: 48cm", "Connectors: 2x PCIe 8-pin, 6x SATA"],
      locations[1]
    ),
    // Hardware Variation 21
    hardwareCreate(
      21,
      "MSI GeForce RTX 3090 GAMING X TRIO",
      manufacturers[9],
      "High-end gaming graphics card for 4K gaming and content creation.",
      categories[1],
      1599,
      98,
      uuidv4(),
      ["CUDA Cores: 10496", "Boost Clock: 1785 MHz", "Memory: 24GB GDDR6X", "TDP: 350W"],
      locations[2]
    ),
    // Hardware Variation 22
    hardwareCreate(
      22,
      "ASUS ROG Strix Z590-E Gaming",
      manufacturers[3],
      "ATX motherboard with support for Intel 10th and 11th Gen processors.",
      categories[2],
      299,
      222,
      uuidv4(),
      [
        "Form Factor: ATX",
        "CPU Socket: LGA 1200",
        "Memory Support: DDR4, up to 5333 MHz",
        "Expansion Slots: 3x PCIe 4.0 x16",
      ],
      locations[0]
    ),
    // Hardware Variation 23
    hardwareCreate(
      23,
      "Corsair Vengeance RGB Pro 32GB DDR4",
      manufacturers[5],
      "High-capacity and RGB RAM kit for gaming and RGB enthusiasts.",
      categories[3],
      179,
      884,
      uuidv4(),
      ["Capacity: 32GB (2 x 16GB)", "Speed: 3600 MHz", "CAS Latency: 18", "Voltage: 1.35V"],
      locations[1]
    ),
    // Hardware Variation 24
    hardwareCreate(
      24,
      "Samsung 980 PRO 1TB NVMe SSD",
      manufacturers[6],
      "High-speed NVMe SSD with PCIe Gen4 for fast data transfer.",
      categories[4],
      129,
      187,
      uuidv4(),
      ["Capacity: 1TB", "Read Speed: up to 7000 MB/s", "Write Speed: up to 5000 MB/s", "Interface: M.2 PCIe 4.0 x4"],
      locations[2]
    ),
    console.log("Added all hardwares"),
  ]);
}
