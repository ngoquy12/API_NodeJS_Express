const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
// Ép kiểu dữ liệu từ JS sang Json khi sử dụng thư viện body-parser
app.use(bodyParser.json());
// cho phép express có thể sử dụng được các phương thức có sẵn của JS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/**
 * Kiểm tra những trường không được phép để trống
 * @param {*} field : Tên trường
 * @returns True nếu trường bị rỗng, false néue không bị rỗng
 */
const checkIsEmpty = (field) => {
  if (field === null || field === undefined || field === "") {
    return true;
  } else {
    return false;
  }
};

/**
 * Middleware kiểm tra dữ liệu không được phép để trống
 * @param {*} req Yêu cầu từ người dùng
 * @param {*} res Phản hồi từ server
 * @param {*} next Cho phép chạy đêns các hàm tiếp theo
 * @returns
 */
const validateData = (req, res, next) => {
  // Lấy dữ liệu từ client
  const email = req.body.email;
  const password = req.body.password;

  // Kiểm tra email không được để trống
  if (checkIsEmpty(email)) {
    return res.status(400).json({
      status: 400,
      message: "Email không được phép để trống",
    });
  }

  // Kiểm tra mật khẩu không được để trống
  if (checkIsEmpty(password)) {
    return res.status(400).json({
      status: 400,
      message: "Mật khẩu không được phép để trống",
    });
  }

  next();
};

module.exports = validateData;
