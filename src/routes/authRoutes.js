import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import prisma from "../prisma.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
dotenv.config();

const router = express.Router();

// const data = [];
// register route.....

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  // hash a password
  const hashPassword = bcrypt.hashSync(password);

  // save the new user and hashed password to db.
  try {
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashPassword,
      },
    });

    console.log("Database Details: ", newUser);

    const defaultTodo = `HELLO :) Add your first ToDo!`;
    // database insert

    await prisma.todo.create({
      data: {
        title: defaultTodo,
        userId: newUser.id,
      },
    });
    // b.prepare(
    //   `INSERT INTO todo (user_id,task) VALUES (? , ?)`
    // );

    // insertTodo.run(result.lastInsertRowid, defaultTodo);

    // console.log(result);

    // create a token
    // const token = jwt.sign(
    //   { id: newUser.id, email: email },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "24h" }
    // );
    console.log("Successfully Registerd.");
    res.json({ message: "Succefully Registered" });

    // cookies applied...
    //         res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: false, // true if https
    //   maxAge: 24 * 60 * 60 * 1000,
    //   sameSite: "none"
    // });
  } catch (err) {
    console.log(err.message);
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Username already exists." });
    }

    res.status(500).json({ message: "Service unavailable" }); // Changed to 500 and added a message
  }
});

// login routesss----------------

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // save admin@gmail.com || password: 123456789
  console.log(email, password);

  try {
    const getUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!getUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    
    const passwordIsValid = bcrypt.compareSync(password, getUser.password);
    // check weather password is valid or not
    if (!passwordIsValid) {
      return res.status(401).send({ message: "invalid password" });
    }

    console.log(getUser);

    // after successful authentication
    // token generate and send

    const token = jwt.sign(
      { id: getUser.id, email: getUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token);

    res.json({ key: token });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503).json({ message: "Server issue" });
  }
});

export default router;
