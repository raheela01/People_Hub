const Department = require("../models/departmentModel");

const createDepartment = async (req, res, next) => {
  try {
    const { departmentName } = req.body;

    if (!departmentName || !departmentName.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Department name is required" });
    }

    const existing = await Department.findByName(departmentName.trim());
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Department already exists" });
    }

    const result = await Department.create(departmentName.trim());
    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: { id: result.insertId, departmentName: departmentName.trim() },
    });
  } catch (err) {
    next(err);
  }
};

const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.findAll();
    return res.json({ success: true, data: departments });
  } catch (err) {
    next(err);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { departmentName } = req.body;

    if (!departmentName || !departmentName.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Department name is required" });
    }

    const dept = await Department.findById(id);
    if (!dept) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    const duplicate = await Department.findByName(departmentName.trim());
    if (duplicate && duplicate.id !== parseInt(id)) {
      return res
        .status(409)
        .json({ success: false, message: "Department name already in use" });
    }

    await Department.update(id, departmentName.trim());
    return res.json({
      success: true,
      message: "Department updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dept = await Department.findById(id);
    if (!dept) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    const occupied = await Department.hasEmployees(id);
    if (occupied) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete department – employees are assigned to it",
      });
    }

    await Department.remove(id);
    return res.json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
};
