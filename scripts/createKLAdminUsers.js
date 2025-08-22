// scripts/createKLAdminUsers.js - Script untuk membuat user admin K/L
const mongoose = require("mongoose");
const User = require("../models/User");

const klUsers = [
  {
    username: "admin_bps",
    email: "admin.bps@paudhi.kemenko.go.id",
    password: "bps123",
    fullName: "Administrator BPS",
    role: "admin_kl",
    klId: "BPS",
    klName: "BPS",
    isActive: true,
  },
  {
    username: "admin_kemenkes",
    email: "admin.kemenkes@paudhi.kemenko.go.id",
    password: "kemenkes123",
    fullName: "Administrator Kemenkes",
    role: "admin_kl",
    klId: "KEMENKES",
    klName: "Kemenkes",
    isActive: true,
  },
  {
    username: "admin_kemendikdasmen",
    email: "admin.kemendikdasmen@paudhi.kemenko.go.id",
    password: "kemendikdasmen123",
    fullName: "Administrator Kemendikdasmen",
    role: "admin_kl",
    klId: "KEMENDIKDASMEN",
    klName: "Kemendikdasmen",
    isActive: true,
  },
  {
    username: "admin_kemenag",
    email: "admin.kemenag@paudhi.kemenko.go.id",
    password: "kemenag123",
    fullName: "Administrator Kemenag",
    role: "admin_kl",
    klId: "KEMENAG",
    klName: "Kemenag",
    isActive: true,
  },
  {
    username: "admin_kemendes_pdt",
    email: "admin.kemendes@paudhi.kemenko.go.id",
    password: "kemendes123",
    fullName: "Administrator Kemendes PDT",
    role: "admin_kl",
    klId: "KEMENDES_PDT",
    klName: "Kemendes PDT",
    isActive: true,
  },
  {
    username: "admin_bkkbn",
    email: "admin.bkkbn@paudhi.kemenko.go.id",
    password: "bkkbn123",
    fullName: "Administrator BKKBN",
    role: "admin_kl",
    klId: "BKKBN",
    klName: "BKKBN",
    isActive: true,
  },
  {
    username: "admin_kemensos",
    email: "admin.kemensos@paudhi.kemenko.go.id",
    password: "kemensos123",
    fullName: "Administrator Kemensos",
    role: "admin_kl",
    klId: "KEMENSOS",
    klName: "Kemensos",
    isActive: true,
  },
  {
    username: "admin_kpppa",
    email: "admin.kpppa@paudhi.kemenko.go.id",
    password: "kpppa123",
    fullName: "Administrator KPPPA",
    role: "admin_kl",
    klId: "KPPPA",
    klName: "KPPPA",
    isActive: true,
  },
  {
    username: "admin_kemendagri",
    email: "admin.kemendagri@paudhi.kemenko.go.id",
    password: "kemendagri123",
    fullName: "Administrator Kemendagri",
    role: "admin_kl",
    klId: "KEMENDAGRI",
    klName: "Kemendagri",
    isActive: true,
  },
  {
    username: "admin_bappenas",
    email: "admin.bappenas@paudhi.kemenko.go.id",
    password: "bappenas123",
    fullName: "Administrator Bappenas",
    role: "admin_kl",
    klId: "BAPPENAS",
    klName: "Bappenas",
    isActive: true,
  },
];

async function createKLAdminUsers() {
  try {
    console.log("🔧 Connecting to MongoDB...");
    await mongoose.connect("mongodb://localhost:27017/paudhi", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    console.log("📝 Creating K/L admin users...");

    for (const userData of klUsers) {
      // Cek apakah user sudah ada
      const existingUser = await User.findOne({ 
        $or: [
          { email: userData.email },
          { username: userData.username }
        ]
      });

      if (existingUser) {
        console.log(`⚠️ User ${userData.username} sudah ada, skip...`);
        continue;
      }

      // Buat user baru
      const user = new User(userData);
      await user.save();

      console.log(`✅ Created user: ${userData.username} (${userData.klName})`);
    }

    console.log("\n🎉 K/L admin users creation completed!");
    console.log("\n📧 Login Credentials:");
    console.log("BPS: admin.bps@paudhi.kemenko.go.id / bps123");
    console.log("Kemenkes: admin.kemenkes@paudhi.kemenko.go.id / kemenkes123");
    console.log("Kemendikdasmen: admin.kemendikdasmen@paudhi.kemenko.go.id / kemendikdasmen123");
    console.log("Kemenag: admin.kemenag@paudhi.kemenko.go.id / kemenag123");
    console.log("Kemendes PDT: admin.kemendes@paudhi.kemenko.go.id / kemendes123");
    console.log("BKKBN: admin.bkkbn@paudhi.kemenko.go.id / bkkbn123");
    console.log("Kemensos: admin.kemensos@paudhi.kemenko.go.id / kemensos123");
    console.log("KPPPA: admin.kpppa@paudhi.kemenko.go.id / kpppa123");
    console.log("Kemendagri: admin.kemendagri@paudhi.kemenko.go.id / kemendagri123");
    console.log("Bappenas: admin.bappenas@paudhi.kemenko.go.id / bappenas123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating K/L admin users:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  createKLAdminUsers();
} 