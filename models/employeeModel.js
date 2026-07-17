const db = require("../config/db");

const findByCode = async (code) => {
  const [rows] = await db.query(
    "SELECT * FROM employees WHERE employeeCode = ?",
    [code],
  );
  return rows[0] || null;
};

const findByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM employees WHERE email = ?", [
    email,
  ]);
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await db.query(
    `SELECT e.*, d.departmentName
     FROM employees e
     LEFT JOIN departments d ON e.departmentId = d.id
     WHERE e.id = ?`,
    [id],
  );
  return rows[0] || null;
};

const create = async (data) => {
  const {
    employeeCode,
    fullName,
    email,
    mobile,
    departmentId,
    designation,
    salary,
    status,
  } = data;
  const [result] = await db.query(
    `INSERT INTO employees
       (employeeCode, fullName, email, mobile, departmentId, designation, salary, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      employeeCode || null,
      fullName,
      email || null,
      mobile || null,
      departmentId || null,
      designation || null,
      salary || null,
      status || "Active",
    ],
  );
  return result;
};

const findAll = async ({ search, departmentId, status, page, limit }) => {
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(
      "(e.fullName LIKE ? OR e.employeeCode LIKE ? OR e.email LIKE ?)",
    );
    const s = `%${search}%`;
    params.push(s, s, s);
  }
  if (departmentId) {
    conditions.push("e.departmentId = ?");
    params.push(departmentId);
  }
  if (status) {
    conditions.push("e.status = ?");
    params.push(status);
  }

  const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM employees e ${where}`,
    params,
  );

  const [rows] = await db.query(
    `SELECT e.*, d.departmentName
     FROM employees e
     LEFT JOIN departments d ON e.departmentId = d.id
     ${where}
     ORDER BY e.createdAt DESC
     LIMIT ? OFFSET ?`,
    [...params, parseInt(limit), parseInt(offset)],
  );

  return { rows, total };
};

const update = async (id, data) => {
  const {
    employeeCode,
    fullName,
    email,
    mobile,
    departmentId,
    designation,
    salary,
    status,
  } = data;
  const [result] = await db.query(
    `UPDATE employees
     SET employeeCode=?, fullName=?, email=?, mobile=?,
         departmentId=?, designation=?, salary=?, status=?
     WHERE id=?`,
    [
      employeeCode || null,
      fullName,
      email || null,
      mobile || null,
      departmentId || null,
      designation || null,
      salary || null,
      status || "Active",
      id,
    ],
  );
  return result;
};

const remove = async (id) => {
  const [result] = await db.query("DELETE FROM employees WHERE id = ?", [id]);
  return result;
};

const updateStatus = async (id, status) => {
  const [result] = await db.query(
    "UPDATE employees SET status = ? WHERE id = ?",
    [status, id],
  );
  return result;
};

const exportAll = async () => {
  const [rows] = await db.query(
    `SELECT e.id, e.employeeCode, e.fullName, e.email, e.mobile,
            d.departmentName, e.designation, e.salary, e.status, e.createdAt
     FROM employees e
     LEFT JOIN departments d ON e.departmentId = d.id
     ORDER BY e.createdAt DESC`,
  );
  return rows;
};

module.exports = {
  findByCode,
  findByEmail,
  findById,
  create,
  findAll,
  update,
  remove,
  updateStatus,
  exportAll,
};
