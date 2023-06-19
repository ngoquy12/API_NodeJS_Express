const express = require("express");
const route = express.Router();
const bodyParser = require("body-parser");
const fs = require("fs");
// Ép kiểu dữ liệu từ JS sang Json khi sử dụng thư viện body-parser
route.use(bodyParser.json());
// cho phép express có thể sử dụng được các phương thức có sẵn của JS
route.use(bodyParser.urlencoded({ extended: true }));

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
route.post("/", (req, res) => {
  const data = req.body;
  console.log("data", data);
  // Lấy dữ liệu thông qua phần body => để sử dụng được thì phải cài thư viện được cung cấp sẵn là body-parser
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

// Cập nhật thông tin môtj bản ghi theo Id
route.put("/:id", (req, res) => {
  // Lấy id cần cập nhật
  const { id } = req.params;
  // Lấy dữ liệu cần cập nhật
  const { UserName, Email, Password } = req.body;

  console.log("id update", id);
  console.log("Data", UserName, Email, Password);
});

module.exports = route;
