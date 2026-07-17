const Employee = require("../models/employeeModel");
const Department = require("../models/departmentModel");

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isDigitsOnly = (v) => /^\d+$/.test(v);

const createEmployee = async (req, res, next) => {
  try {
    const {
      employeeCode,
      fullName,
      email,
      mobile,
      departmentId,
      designation,
      salary,
      status,
    } = req.body;

    if (!fullName || !fullName.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Full name is required" });
    }
    if (email && !isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }
    if (mobile && !isDigitsOnly(mobile)) {
      return res
        .status(400)
        .json({ success: false, message: "Mobile must contain digits only" });
    }
    if (status && !["Active", "Inactive"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Status must be Active or Inactive" });
    }
    if (employeeCode) {
      const codeExists = await Employee.findByCode(employeeCode);
      if (codeExists) {
        return res
          .status(409)
          .json({ success: false, message: "Employee code already exists" });
      }
    }
    if (email) {
      const emailExists = await Employee.findByEmail(email);
      if (emailExists) {
        return res
          .status(409)
          .json({ success: false, message: "Email already exists" });
      }
    }
    if (departmentId) {
      const dept = await Department.findById(departmentId);
      if (!dept) {
        return res
          .status(404)
          .json({ success: false, message: "Department not found" });
      }
    }

    const result = await Employee.create({
      employeeCode,
      fullName: fullName.trim(),
      email,
      mobile,
      departmentId,
      designation,
      salary,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: { id: result.insertId },
    });
  } catch (err) {
    next(err);
  }
};

const getEmployees = async (req, res, next) => {
  try {
    const { search, departmentId, status } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

    if (status && !["Active", "Inactive"].includes(status)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Status filter must be Active or Inactive",
        });
    }

    const { rows, total } = await Employee.findAll({
      search,
      departmentId,
      status,
      page,
      limit,
    });

    return res.json({
      success: true,
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

const exportEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.exportAll();

    const fields = [
      "id",
      "employeeCode",
      "fullName",
      "email",
      "mobile",
      "departmentName",
      "designation",
      "salary",
      "status",
      "createdAt",
    ];

    const escapeCsv = (val) => {
      const str = val !== null && val !== undefined ? String(val) : "";
      return `"${str.replace(/"/g, '""')}"`;
    };

    const header = fields.join(",");
    const csvRows = employees.map((emp) =>
      fields.map((f) => escapeCsv(emp[f])).join(","),
    );
    const csv = [header, ...csvRows].join("\r\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="employees.csv"',
    );
    return res.send(csv);
  } catch (err) {
    next(err);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    return res.json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      employeeCode,
      fullName,
      email,
      mobile,
      departmentId,
      designation,
      salary,
      status,
    } = req.body;

    const existing = await Employee.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    if (!fullName || !fullName.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Full name is required" });
    }
    if (email && !isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }
    if (mobile && !isDigitsOnly(mobile)) {
      return res
        .status(400)
        .json({ success: false, message: "Mobile must contain digits only" });
    }
    if (status && !["Active", "Inactive"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Status must be Active or Inactive" });
    }
    if (employeeCode) {
      const codeExists = await Employee.findByCode(employeeCode);
      if (codeExists && codeExists.id !== parseInt(id)) {
        return res
          .status(409)
          .json({ success: false, message: "Employee code already exists" });
      }
    }
    if (email) {
      const emailExists = await Employee.findByEmail(email);
      if (emailExists && emailExists.id !== parseInt(id)) {
        return res
          .status(409)
          .json({ success: false, message: "Email already exists" });
      }
    }
    if (departmentId) {
      const dept = await Department.findById(departmentId);
      if (!dept) {
        return res
          .status(404)
          .json({ success: false, message: "Department not found" });
      }
    }

    await Employee.update(id, {
      employeeCode,
      fullName: fullName.trim(),
      email,
      mobile,
      departmentId,
      designation,
      salary,
      status,
    });

    return res.json({
      success: true,
      message: "Employee updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    await Employee.remove(req.params.id);
    return res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const updateEmployeeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["Active", "Inactive"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Status must be Active or Inactive" });
    }

    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    await Employee.updateStatus(id, status);
    return res.json({
      success: true,
      message: `Employee status set to ${status}`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  exportEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  updateEmployeeStatus,
};
