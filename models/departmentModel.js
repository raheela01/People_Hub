const db = require("../config/db");

const findByName = async (name) => {
  const [rows] = await db.query(
    "SELECT * FROM departments WHERE departmentName = ?",
    [name],
  );
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await db.query("SELECT * FROM departments WHERE id = ?", [id]);
  return rows[0] || null;
};

const findAll = async () => {
  const [rows] = await db.query(
    "SELECT * FROM departments ORDER BY createdAt DESC",
  );
  return rows;
};

const create = async (name) => {
  const [result] = await db.query(
    "INSERT INTO departments (departmentName) VALUES (?)",
    [name],
  );
  return result;
};

const update = async (id, name) => {
  const [result] = await db.query(
    "UPDATE departments SET departmentName = ? WHERE id = ?",
    [name, id],
  );
  return result;
};

const remove = async (id) => {
  const [result] = await db.query("DELETE FROM departments WHERE id = ?", [id]);
  return result;
};

const hasEmployees = async (id) => {
  const [rows] = await db.query(
    "SELECT COUNT(*) AS cnt FROM employees WHERE departmentId = ?",
    [id],
  );
  return rows[0].cnt > 0;
};

module.exports = {
  findByName,
  findById,
  findAll,
  create,
  update,
  remove,
  hasEmployees,
};
