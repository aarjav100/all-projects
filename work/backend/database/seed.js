const db = require('./db');
const fs = require('fs').promises;
const path = require('path');

const initialProducts = [
  {
    name: "Lumina SoundWave ANC",
    description: "Premium active noise-cancelling headphones featuring 40mm custom bio-cellulose drivers, 45-hour battery life, and exquisite tactile aluminum controls.",
    price: 299.99,
    category: "Audio",
    image: "/images/soundwave.webp",
    rating: 4.8,
    reviewCount: 142,
    stock: 15,
    features: [
      "Custom Active Noise Cancelling",
      "45 Hours Battery Life (ANC Off)",
      "Hi-Res Audio Certified",
      "Premium Alcantara Earcups"
    ]
  },
  {
    name: "AuraFlow Keyboard",
    description: "A stunning, hot-swappable 75% mechanical keyboard housed in a CNC-milled polycarbonate body with frosted RGB underglow and silent linear switches.",
    price: 189.99,
    category: "Peripherals",
    image: "/images/auraflow.webp",
    rating: 4.9,
    reviewCount: 88,
    stock: 10,
    features: [
      "CNC Polycarbonate Case",
      "Hot-Swappable Silent Linear Switches",
      "Frosted RGB Underglow & Backlighting",
      "Triple-mode (Wireless/Bluetooth/USB-C)"
    ]
  },
  {
    name: "Chronos Minimalist Watch",
    description: "An architectural minimalist quartz watch featuring a surgical-grade stainless steel casing, sapphire crystal glass, and a sleek matte-black mesh band.",
    price: 245.00,
    category: "Lifestyle",
    image: "/images/chronos.webp",
    rating: 4.7,
    reviewCount: 64,
    stock: 8,
    features: [
      "Surgical-Grade Stainless Steel",
      "Scratch-Resistant Sapphire Crystal Dome",
      "Swiss Quartz Movement",
      "5 ATM Water Resistance"
    ]
  },
  {
    name: "Nebula Ambient Lamp",
    description: "An interactive, glassmorphic ambient desk lamp that pulses colors in sync with sound or ambient lighting, controllable via standard touch slider or web API.",
    price: 129.99,
    category: "Home Tech",
    image: "/images/nebula.webp",
    rating: 4.6,
    reviewCount: 105,
    stock: 12,
    features: [
      "Multi-zone Frosted Glass Diffuser",
      "Touch-sensitive Slide Dimming",
      "Dynamic Smart Ambient Sync Mode",
      "Premium Solid Walnut Wood Base"
    ]
  },
  {
    name: "Apex RFID Cardholder",
    description: "Minimalist front-pocket leather cardholder crafted from premium full-grain Italian leather and featuring integrated aluminum RFID-blocking shield.",
    price: 59.99,
    category: "Lifestyle",
    image: "/images/apex.webp",
    rating: 4.5,
    reviewCount: 210,
    stock: 30,
    features: [
      "Premium Full-Grain Italian Leather",
      "Integrated Aluminum RFID Shielding",
      "Ergonomic Quick-Access Card Trigger",
      "Ultra-Slim Holds up to 8 Cards"
    ]
  },
  {
    name: "Veloce Wood Charger",
    description: "High-speed 15W Qi-certified wireless charging pad embedded in an elegant block of solid, hand-finished American Walnut wood with a braided nylon cord.",
    price: 79.99,
    category: "Lifestyle",
    image: "/images/veloce.webp",
    rating: 4.8,
    reviewCount: 77,
    stock: 20,
    features: [
      "Qi-certified 15W Wireless Fast Charge",
      "Solid Hand-Finished American Walnut",
      "Aircraft-Grade Anodized Aluminum Base",
      "1.5m Premium Braided USB-C Cable"
    ]
  }
];

async function seed() {
  console.log("Starting database seed script...");
  const productsPath = path.join(__dirname, 'products.json');
  
  try {
    // Clear any existing products by deleting/truncating
    await fs.writeFile(productsPath, JSON.stringify([], null, 2), 'utf8');
    
    // Seed database
    for (const prod of initialProducts) {
      await db.insert('products', prod);
      console.log(`Successfully seeded: ${prod.name}`);
    }
    
    // Seed default admin user (email: admin@luminaluxe.com, password: adminpassword)
    // We will hash passwords in the actual registration/login controllers,
    // but we can also pre-seed a test customer: customer@luminaluxe.com / customerpassword
    const usersPath = path.join(__dirname, 'users.json');
    const bcrypt = require('bcryptjs');
    
    const adminPasswordHash = await bcrypt.hash('adminpassword', 10);
    const customerPasswordHash = await bcrypt.hash('customerpassword', 10);
    
    const seedUsers = [
      {
        email: "admin@luminaluxe.com",
        password: adminPasswordHash,
        name: "Lumina Admin",
        role: "admin"
      },
      {
        email: "customer@luminaluxe.com",
        password: customerPasswordHash,
        name: "John Doe",
        role: "user"
      }
    ];
    
    await fs.writeFile(usersPath, JSON.stringify([], null, 2), 'utf8');
    for (const user of seedUsers) {
      await db.insert('users', user);
      console.log(`Successfully seeded user: ${user.email} (${user.role})`);
    }
    
    // Initialize orders file as empty array
    const ordersPath = path.join(__dirname, 'orders.json');
    await fs.writeFile(ordersPath, JSON.stringify([], null, 2), 'utf8');
    console.log("Seeding complete!");
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
