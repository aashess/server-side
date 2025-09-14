import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import dotenv from "dotenv";

import { authMiddleware } from "../middleware/authMiddleware.js";
dotenv.config();

const router = express.Router();



const data = [];

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  // save admin@gmail.com || password: 123456789
  console.log(username, password);
  // hash a password
  const hashPassword = bcrypt.hashSync(password);

  // save the new user and hashed password to db.
  try {
    const insertUser = db.prepare(
      `INSERT INTO user (username, password) VALUES (?,?)`
    ); // quary-execution.

    const result = insertUser.run(username, hashPassword); // username - password passed.

    // create a by default to-do to every user that register for first time.
    const defaultTodo = `HELLO :) Add your first ToDo!`;
    const insertTodo = db.prepare(
      `INSERT INTO todo (user_id,task) VALUES (? , ?)`
    );
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    // console.log(result);

    // create a token
    const token = jwt.sign(
      { id: result.lastInsertRowid, username: username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    console.log("Successfully Registerd.");
    
                                  // cookies applied...
    //         res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: false, // true if https
    //   maxAge: 24 * 60 * 60 * 1000,
    //   sameSite: "none"
    // });
    res.json({ key: token });
  } catch (err) {
    console.log(err.message);
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ message: "Username already exists." });
    }

    res.status(500).json({ message: "Service unavailable" }); // Changed to 500 and added a message
  }
});


router.post("/login",(req, res) => {
  const { username, password } = req.body;
  // save admin@gmail.com || password: 123456789
  console.log(username, password);


  try {
    const getUser = db.prepare("SELECT * FROM user WHERE username = ?");
    const user = getUser.get(username);
    // checks weather user exist or not.
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }


    const passwordIsValid = bcrypt.compareSync(password, user.password);
    // check weather password is valid or not
    if (!passwordIsValid) {
      return res.status(401).send({ message: "invalid password" });
    }

    console.log(user);

    // after successful authentication
    // token generate and send
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, );
   
      res.cookie('token', token);

    res.json({ key: token });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});




export default router;
