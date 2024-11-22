const userModel = require("../modal/userModal");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(201)
        .send({ message: "User don't exist", success: false, statusCode: 201 });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(202).send({
        message: "Incorrect Password",
        success: false,
        statusCode: 202,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).send({
      message: "Login Successfully",
      userId: user._id,
      token: token,
      success: true,
      statusCode: 200,
      isAdmin: user.isAdmin,
      user: user,
    });
  } catch (error) {
    return res
      .status(401)
      .send({ message: "Internal Server Error", success: true });
  }
};

const signup = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res
        .status(400)
        .send({
          message: "Email, Name, and Password are required.",
          success: false,
        });
    }

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(201).send({
        message: "User already exists",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ ...req.body, password: hashPassword });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetLink = `http://localhost:3000/add-new-password?token=${resetToken}&email=${email}`;

    newUser.resetToken = resetToken;
    newUser.tokenExpiry = Date.now() + 3600000;
    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "arijitghosh1203@gmail.com",
        pass: "sbkz nlun jawd ykki",
      },
    });

    await transporter.sendMail({
      from: '"French-Coffee" <arijitghosh1203@gmail.com>',
      to: email,
      subject: "Welcome to French-Coffee",
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Your account has been successfully created.</p>
        <p>Click <a href="${resetLink}">here</a> to set your password.</p>
      `,
    });

    res.status(200).send({
      message: "User created successfully. Email sent.",
      success: true,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

// Reset Password Function
const resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { password } = req.body;

    const user = await userModel.findOne({
      resetToken: token,
      tokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({
        message: "Invalid or expired token",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = undefined;
    user.tokenExpiry = undefined;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "arijitghosh1203@gmail.com",
        pass: "sbkz nlun jawd ykki",
      },
    });

    await transporter.sendMail({
      from: '"French-Coffeee" <arijitghosh1203@gmail.com>',
      to: user.email,
      subject: "Password Updated",
      html: `
        <h1>Password Updated Successfully</h1>
        <p>Your password has been updated.</p>
      `,
    });

    res.status(200).send({
      message: "Password reset successfully. Confirmation email sent.",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res
      .status(500)
      .json({ message: "Server error while deleting user" });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await userModel.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUser:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching users" });
  }
};

const validateToken = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ isValid: false, message: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ isValid: false, message: "Invalid token" });
    }
    return res.status(200).json({ isValid: true, message: "Token is valid" });
  });
};

module.exports = {
  login,
  signup,
  resetPassword,
  validateToken,
  deleteUser,
  getUser,
};
