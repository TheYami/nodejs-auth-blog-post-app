import { Router } from "express";
import { db } from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้

authRouter.post("/register", async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  if (!password) {
    return res.status(400).json({
      message: "Password is required",
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      username,
      password: hashedPassword,
      firstName,
      lastName,
    };

    const collection = db.collection("users");
    await collection.insertOne(user);

    return res.json({
      message: "User has been created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while registering the user",
    });
  }
});

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
// โค้ดส่วนนี้อยู่ในไฟล์ apps/auth.js
authRouter.post("/login", async (req, res) => {
  try {
    const user = await db.collection("users").findOne({
      username: req.body.username,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Password not valid",
      });
    }

    // สร้าง token
    const token = jwt.sign(
      {
        id: user._id, //
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "900s",
      }
    );

    return res.json({ message: "Login successfully", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});

export default authRouter;
