const express = require("express");
const router = express.Router();
const userControlers = require("./../controlers/user");

router.post("/signup", userControlers.signup);
router.post("/login", userControlers.login);
router.get("/user", userControlers.getUser);
router.post("/login/userExist", userControlers.userExist);
router.post("/login/userExist/forgetPassword", userControlers.forgetPassword);

module.exports = router;
