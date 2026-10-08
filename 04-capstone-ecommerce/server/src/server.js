import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const User = mongoose.model("ShopUser", new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true,unique:true,lowercase:true},
  password:{type:String,required:true},
  role:{type:String,enum:["user","admin"],default:"user"}
},{timestamps:true}));

const Product = mongoose.model("ShopProduct", new mongoose.Schema({
  name:{type:String,required:true},
  description:{type:String,required:true},
  price:{type:Number,required:true,min:0},
  category:{type:String,default:"General"},
  image:{type:String,default:""}
},{timestamps:true}));

const Order = mongoose.model("ShopOrder", new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:"ShopUser",required:true},
  items:[{
    product:{type:mongoose.Schema.Types.ObjectId,ref:"ShopProduct",required:true},
    name:String,
    price:Number,
    qty:{type:Number,min:1,default:1}
  }],
  total:{type:Number,required:true,min:0}
},{timestamps:true}));

const auth=(req,res,next)=>{
  const header=req.headers.authorization;
  if(!header?.startsWith("Bearer ")) return res.status(401).json({message:"Authentication required"});
  try{ req.user=jwt.verify(header.split(" ")[1],process.env.JWT_SECRET); next(); }
  catch{ res.status(401).json({message:"Invalid or expired token"}); }
};

const admin=async(req,res,next)=>{
  const user=await User.findById(req.user.id);
  if(!user || user.role!=="admin") return res.status(403).json({message:"Admin access required"});
  req.currentUser=user; next();
};

const app=express();
app.use(cors());
app.use(express.json());

app.get("/api/health",(_req,res)=>res.json({status:"ok"}));

app.post("/api/auth/signup",async(req,res)=>{
  try{
    const {name,email,password}=req.body;
    if(await User.findOne({email})) return res.status(409).json({message:"Email already registered"});
    const role=email===process.env.ADMIN_EMAIL ? "admin" : "user";
    const user=await User.create({name,email,password:await bcrypt.hash(password,10),role});
    res.status(201).json({id:user._id,name:user.name,email:user.email,role:user.role});
  }catch(error){res.status(400).json({message:error.message});}
});

app.post("/api/auth/login",async(req,res)=>{
  const user=await User.findOne({email:req.body.email});
  if(!user || !(await bcrypt.compare(req.body.password,user.password))){
    return res.status(401).json({message:"Invalid email or password"});
  }
  const token=jwt.sign({id:user._id.toString()},process.env.JWT_SECRET,{expiresIn:"4h"});
  res.json({token,user:{id:user._id,name:user.name,email:user.email,role:user.role}});
});

app.get("/api/products",async(_req,res)=>res.json(await Product.find().sort({createdAt:-1})));

app.post("/api/products",auth,admin,async(req,res)=>{
  try{res.status(201).json(await Product.create(req.body));}
  catch(error){res.status(400).json({message:error.message});}
});

app.delete("/api/products/:id",auth,admin,async(req,res)=>{
  const product=await Product.findByIdAndDelete(req.params.id);
  if(!product) return res.status(404).json({message:"Product not found"});
  res.json({message:"Product deleted"});
});

app.post("/api/orders",auth,async(req,res)=>{
  const items=[];
  let total=0;
  for(const item of req.body.items||[]){
    const product=await Product.findById(item.product);
    if(!product) return res.status(400).json({message:"A product in your cart no longer exists"});
    const qty=Math.max(1,Number(item.qty)||1);
    items.push({product:product._id,name:product.name,price:product.price,qty});
    total+=product.price*qty;
  }
  if(items.length===0) return res.status(400).json({message:"Cart is empty"});
  res.status(201).json(await Order.create({user:req.user.id,items,total}));
});

app.get("/api/orders",auth,async(req,res)=>{
  res.json(await Order.find({user:req.user.id}).sort({createdAt:-1}));
});

async function seedProducts(){
  if(await Product.countDocuments()) return;
  await Product.insertMany([
    {name:"Wireless Headphones",description:"Comfortable over-ear wireless headphones.",price:2499,category:"Audio"},
    {name:"Mechanical Keyboard",description:"Tactile keyboard for coding and gaming.",price:3299,category:"Accessories"},
    {name:"Smart Watch",description:"Fitness and notification tracking on your wrist.",price:4999,category:"Wearables"},
    {name:"USB-C Hub",description:"Multi-port adapter for modern laptops.",price:1799,category:"Accessories"}
  ]);
}

const port=process.env.PORT||5204;
mongoose.connect(process.env.MONGO_URI)
  .then(async()=>{await seedProducts();app.listen(port,()=>console.log(`E-commerce API running on http://localhost:${port}`));})
  .catch(err=>{console.error(err.message);process.exit(1);});
