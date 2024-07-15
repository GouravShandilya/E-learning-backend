const User = require("./../modals/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValidEmial = regex.test(req.body.email);
    if (!isValidEmial) {
      return res.status(400).json({ message: "email is not correct" });
    }
    let hashPassword = await bcrypt.hash(req.body.password, 10);
    let userInfo = new User({
      userName: req.body.userName,
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });
    await userInfo
      .save()
      .then(() =>
        res.status(201).json({
          message: "signup successfully",
          userId: userInfo.userId,
          token: jwt.sign({ userId: userInfo.userId }, "todo", {
            expiresIn: "24h",
          }),
        })
      )
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    let user = await User.findOne({ userName: req.body.userName });
    if (!user) return res.status(400).json({ message: "user not existed" });
    bcrypt.compare(req.body.password, user.password, (err, data) => {
      if (err) throw err;
      if (data) {
        return res.status(200).json({
          message: "password matched",
          data: {
            userName: user.userName,
            name: user.name,
            email: user.email,
            todo: user.todos,
            id: user._id,
          },
        });
      } else {
        return res.status(400).json({ message: "password not match" });
      }
    });
  } catch (error) {
    console.log(error, "err");
    res.status(400).json({ message: "login failed" });
  }
};

exports.userExist = async (req, res, next) => {
  try {
    let user = await User.findOne({ userName: req.query.userName });
    if (!user) {
      return res.status(200).json({ message: "sorry user not exist" });
    }
    return res.status(200).json({ message: "user exist" });
  } catch (error) {
    res.status(400).json({ message: "user not found" });
  }
};

exports.forgetPassword = async (req, res, next) => {
  try {
    let hashPassword = await bcrypt.hash(req.body.password, 10);
    let updateCount = await User.updateOne(
      { userName: req.query.userName },
      { $set: { password: hashPassword } }
    );
    if (updateCount.modifiedCount > 0)
      return res.status(200).json({ message: "Password change successfully" });

    return res.status(200).json({ message: "Password change failed" });
  } catch (error) {
    console.log(error, "err");
    res.status(400).json({ message: "something went wrong" });
  }
};
exports.getUser = async (req, res, next) => {
  try {
    console.log(req.body);
    let user = await User.findOne({ _id: req.query.userId });
    if (!user) return res.status(200).json({ message: "user is empty" });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
};
