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

const validateToken = async (req, res) => {
  try {
    const checkToken = req.headers.authorization.split(" ")[1];
    const { userId } = jwt.verify(checkToken, process.env.JWT_SECRET);
    const data = await userModel.findById(userId).select("-password");
    if (!data) {
      return res.status(209).send({
        message: "Invalid Token or token Expired",
        success: false,
        statusCode: 209,
      });
    }

    return res.status(209).send({
      message: "Access granted",
      success: true,
      data: data,
      statusCode: 200,
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
      success: false,
      statusCode: 409,
    });
  }
};

module.exports = {
  login,
  signup,
  validateToken,
};
