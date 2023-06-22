const express = require("express");
const route = express.Router();
const bodyParser = require("body-parser");
const fs = require("fs");
const validateData = require("../middleware/validateData.js");
// Ép kiểu dữ liệu từ JS sang Json khi sử dụng thư viện body-parser
route.use(bodyParser.json());
// cho phép express có thể sử dụng được các phương thức có sẵn của JS
route.use(bodyParser.urlencoded({ extended: true }));
const { v4: uuidv4 } = require("uuid");

//Định nghĩa route cho từng API
// API lấy tất cả thông tin
// Quy chuẩn của resful API: /api/v1/users
route.get("/", (req, res) => {
  try {
    // Đọc file user.json
    const users = fs.readFileSync("./dev-data/users.json").toString();
    const datas = JSON.parse(users);

    // Trả về dữ liệu cho phía client
    return res.status(200).json({
      status: 200,
      results: datas.length,
      data: datas,
    });
  } catch (error) {
    return res.status(500).json({
      // Trả về lỗi từ server
      status: 500,
      message: "Lỗi hệ thống",
      data: err,
    });
  }
});

// API lấy thông tin một bản ghi theo Id
route.get("/:id", (req, res) => {
  // Lấy id của đường dẫn
  try {
    //   const id = req.params.id; // cách 1
    // Cách 2
    const { id } = req.params;
    // Đọc file users.json
    const datas = fs.readFileSync("./dev-data/users.json").toString();
    // Ép kiểu dữ liệu
    const users = JSON.parse(datas);
    // Tìm kiếm thông tin user theo id
    const user = users.find((u) => u._id === id);
    // Kiểm tra user có tồn tại trong db hay hay không
    if (user != null) {
      return res.status(200).json({
        status: 200,
        data: user,
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "Người dùng không tồn tại trong hệ thống",
      });
    }
  } catch (error) {
    return res.status(500).json({
      // Trả về lỗi từ server
      status: 500,
      message: "Lỗi hệ thống",
      data: err,
    });
  }
});

// API thêm mới dữ liệu
route.post("/", validateData, (req, res) => {
  // Lấy dữ liệu thông qua phần body => để sử dụng được thì phải cài thư viện được cung cấp sẵn là body-parser
  // Validate dữ liệu
  // Lấy dữ liệu tử client
  const { email, name, password } = req.body;
  const _id = uuidv4();

  const newUser = {
    _id: _id,
    name: name,
    email: email,
    role: "user",
    active: true,
    photo: "",
    password: password,
  };

  try {
    // Đọc file users.json
    const users = JSON.parse(
      fs.readFileSync("./dev-data/users.json").toString()
    );
    // Push dữ liệu vào mảng
    users.push(newUser);
    // WriteFile
    fs.writeFileSync("./dev-data/users.json", JSON.stringify(users));
    return res.status(201).json({
      status: 201,
      message: "Thêm dữ liệu thành công",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error,
    });
  }
});

// API xóa thông tin một bản ghi theo ID
route.delete("/:id", (req, res) => {
  try {
    // Lấy Id
    const { id } = req.params;
    // Đọc dữ liệu từ file users.json
    const datas = fs.readFileSync("./dev-data/users.json").toString();
    // Ép kiểu dữ liệu
    const users = JSON.parse(datas);
    // Tiến hành lọc id của user theo database
    const user = users.filter((u) => u._id != id);
    // Tiến hành writeFile
    fs.writeFileSync("./dev-data/users.json", JSON.stringify(user));
    return res.status(200).json({
      status: 200,
      message: "Xóa thành công",
    });
  } catch (error) {
    return res.status(500).json({
      // Trả về lỗi từ server
      status: 500,
      message: "Lỗi hệ thống",
      data: error,
    });
  }
});

// Route cập nhật thông tin người dùng theo id
route.put("/:id", (req, res) => {
  // Lấy id cần cập nhật từ params
  const { id } = req.params;
  // Lấy dữ liệu cần cập nhật từ body
  const data = req.body;

  try {
    // Đọc dữ liệu người dùng từ tệp users.json
    const users = JSON.parse(
      fs.readFileSync("./dev-data/users.json").toString()
    );

    // Kiểm tra xem id truyền vào có tồn tại trong danh sách người dùng không
    const userIndex = users.findIndex((user) => user._id === id);
    if (userIndex === -1) {
      // Nếu không tìm thấy người dùng, trả về lỗi
      return res.status(404).json({
        status: 404,
        message: "Người dùng không tồn tại",
      });
    }

    // Cập nhật thông tin người dùng
    users[userIndex] = { ...users[userIndex], ...data };

    // Ghi đè dữ liệu mới vào tệp users.json
    fs.writeFileSync("./dev-data/users.json", JSON.stringify(users));

    // Trả về phản hồi thành công
    return res.status(200).json({
      status: 200,
      message: "Cập nhật dữ liệu thành công",
      data: users[userIndex],
    });
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
});

module.exports = route;
