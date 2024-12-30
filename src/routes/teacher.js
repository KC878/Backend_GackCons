const express = require("express");

const { getTeachers, searchTeacher, updateMode } = require("../controllers/teacher");
const checkAuth = require("../middlewares/auth");

const teacher = express.Router();

teacher.get("/", checkAuth, getTeachers);
teacher.get("/search", checkAuth, searchTeacher);
teacher.patch("/mode/:id", checkAuth, updateMode);
module.exports = teacher;
