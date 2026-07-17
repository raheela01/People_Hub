const db = require("../config/db");

const getDashboard = async (req, res, next) => {
  try {
    const [[{ totalEmployees }]] = await db.query(
      "SELECT COUNT(*) AS totalEmployees FROM employees",
    );
    const [[{ totalDepartments }]] = await db.query(
      "SELECT COUNT(*) AS totalDepartments FROM departments",
    );
    const [[{ activeEmployees }]] = await db.query(
      "SELECT COUNT(*) AS activeEmployees FROM employees WHERE status = 'Active'",
    );
    const [[{ inactiveEmployees }]] = await db.query(
      "SELECT COUNT(*) AS inactiveEmployees FROM employees WHERE status = 'Inactive'",
    );
    const [employeesByDepartment] = await db.query(
      `SELECT d.departmentName, COUNT(e.id) AS employeeCount
       FROM departments d
       LEFT JOIN employees e ON d.id = e.departmentId
       GROUP BY d.id, d.departmentName
       ORDER BY employeeCount DESC`,
    );

    return res.json({
      success: true,
      data: {
        totalEmployees,
        totalDepartments,
        activeEmployees,
        inactiveEmployees,
        employeesByDepartment,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
