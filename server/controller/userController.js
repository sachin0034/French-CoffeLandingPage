const userModel = require("../modal/userModal");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    const userExist = await userModel.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(201).send({
        message: "User already Exist",
        success: false,
        statusCode: 201,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;
    const newUser = new userModel(req.body);

    await newUser.save();
    res.status(200).send({
      message: "USer created successfully",
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    res.status(401).send({
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
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({ message: 'Server error while deleting user' });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await userModel.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUser:", error);
    return res.status(500).json({ message: 'Server error while fetching users' });
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
  validateToken,
  deleteUser,
  getUser
};
