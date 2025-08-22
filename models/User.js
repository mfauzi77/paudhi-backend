// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin_kl", "admin", "super_admin"],
      default: "admin_kl",
    },
    klId: {
      type: String,
      required: function () {
        return this.role === "admin_kl";
      },
      enum: [
        "KEMENKO_PMK",
        "KEMENDIKDASMEN",
        "KEMENAG",
        "KEMENDES_PDT",
        "KEMENKES",
        "BKKBN",
        "KEMENSOS",
        "KPPPA",
        "KEMENDAGRI",
        "BAPPENAS",
        "BPS",
      ],
    },
    klName: {
      type: String,
      required: function () {
        return this.role === "admin_kl";
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    permissions: {
      ranPaud: {
        create: { type: Boolean, default: true },
        read: { type: Boolean, default: true },
        update: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
      },
      news: {
        create: { type: Boolean, default: true },
        read: { type: Boolean, default: true },
        update: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
      },
      pembelajaran: {
        create: { type: Boolean, default: true },
        read: { type: Boolean, default: true },
        update: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
      },
      faq: {
        create: { type: Boolean, default: true },
        read: { type: Boolean, default: true },
        update: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
      },
      users: {
        create: { type: Boolean, default: false },
        read: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Add default permissions if missing
userSchema.pre("save", function (next) {
  if (!this.permissions) {
    // Set default permissions based on role
    if (this.role === "super_admin") {
      this.permissions = {
        ranPaud: { create: true, read: true, update: true, delete: true },
        news: { create: true, read: true, update: true, delete: true },
        pembelajaran: { create: true, read: true, update: true, delete: true },
        faq: { create: true, read: true, update: true, delete: true },
        users: { create: true, read: true, update: true, delete: true },
      };
    } else if (this.role === "admin") {
      this.permissions = {
        ranPaud: { create: true, read: true, update: true, delete: true },
        news: { create: true, read: true, update: true, delete: true },
        pembelajaran: { create: true, read: true, update: true, delete: true },
        faq: { create: true, read: true, update: true, delete: true },
        users: { create: false, read: false, update: false, delete: false },
      };
    } else if (this.role === "admin_kl") {
      this.permissions = {
        ranPaud: { create: true, read: true, update: true, delete: true },
        news: { create: true, read: true, update: true, delete: true },
        pembelajaran: { create: true, read: true, update: true, delete: true },
        faq: { create: true, read: true, update: true, delete: true },
        users: { create: false, read: false, update: false, delete: false },
      };
    } else {
      // Default permissions for unknown roles
      this.permissions = {
        ranPaud: { create: true, read: true, update: true, delete: true },
        news: { create: true, read: true, update: true, delete: true },
        pembelajaran: { create: true, read: true, update: true, delete: true },
        faq: { create: true, read: true, update: true, delete: true },
        users: { create: false, read: false, update: false, delete: false },
      };
    }
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get KL list for admin_kl users
userSchema.statics.getKLList = function () {
  return [
    { id: "KEMENKO_PMK", name: "Kemenko PMK" },
    { id: "KEMENDIKDASMEN", name: "Kemendikdasmen" },
    { id: "KEMENAG", name: "Kemenag" },
    { id: "KEMENDES_PDT", name: "Kemendes PDT" },
    { id: "KEMENKES", name: "Kemenkes" },
    { id: "BKKBN", name: "BKKBN" },
    { id: "KEMENSOS", name: "Kemensos" },
    { id: "KPPPA", name: "KPPPA" },
    { id: "KEMENDAGRI", name: "Kemendagri" },
    { id: "BAPPENAS", name: "Bappenas" },
    { id: "BPS", name: "BPS" },
  ];
};

// Check if user can access specific KL data
userSchema.methods.canAccessKL = function (klId) {
  if (this.role === "super_admin" || this.role === "admin") return true;
  if (this.role === "admin_kl" && this.klId === klId) return true;
  return false;
};

// Check if user has permission for specific action
userSchema.methods.hasPermission = function (module, action) {
  if (this.role === "super_admin") return true;
  return this.permissions[module]?.[action] || false;
};

// Get user's accessible KL IDs
userSchema.methods.getAccessibleKLIds = function () {
  if (this.role === "super_admin" || this.role === "admin") {
    return this.constructor.getKLList().map((kl) => kl.id);
  }
  return this.klId ? [this.klId] : [];
};

module.exports = mongoose.model("User", userSchema);
