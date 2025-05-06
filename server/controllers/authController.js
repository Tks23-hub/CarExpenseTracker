const db = require("../db");
const bcrypt = require("bcrypt");

// REGISTER USER
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

// LOGIN USER
const loginUser = (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if user exists in the database
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    // Check if user was found
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the hashed password in the database
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    // Check if password matches
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  });
};

module.exports = { registerUser, loginUser };
