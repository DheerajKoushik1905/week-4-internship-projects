import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const User = mongoose.model("Week4AuthUser", new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
}, { timestamps: true }));

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Authentication required" });
  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(409).json({ message: "Email already registered" });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "2h" });
  res.json({ token });
});

app.get("/api/auth/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

const port = process.env.PORT || 5202;
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log(`Auth API running on http://localhost:${port}`)))
  .catch(err => { console.error(err.message); process.exit(1); });
