const router = require("express").Router();
const {
  createEmployee,
  getEmployees,
  exportEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  updateEmployeeStatus,
} = require("../controllers/employeeController");

router.get("/export", exportEmployees);
router.post("/", createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);
router.patch("/:id/status", updateEmployeeStatus);

module.exports = router;
