const db = require("../db");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const { username, email, phone, password } = req.body;

  if (!username || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)`;
    db.query(sql, [username, email, phone, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(409)
            .json({ message: "Email or phone already in use" });
        }
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }
      res.status(201).json({ message: "User registered successfully!" });
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
};

module.exports = { registerUser };
