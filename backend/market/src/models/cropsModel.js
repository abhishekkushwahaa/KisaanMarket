import pool from "../config/db.js";

export const getAllCropsService = async () => {
  const result = await pool.query(
    "SELECT * FROM crops ORDER BY created_at DESC"
  );
  return result.rows;
};

export const getCropByIDService = async (id) => {
  const result = await pool.query("SELECT * FROM crops WHERE id = $1", [id]);
  return result.rows[0];
};

export const addCropService = async (name, price, userID, imageUrl) => {
  const result = await pool.query(
    "INSERT INTO crops (name, price, userid, image) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, price, userID, imageUrl]
  );
  return result.rows[0];
};

export const updateByIDCropService = async (
  name,
  price,
  imageUrl,
  id,
  userID
) => {
  const result = await pool.query(
    "UPDATE crops SET name = $1, price = $2, image = $3 WHERE id = $4 AND userid = $5 RETURNING *",
    [name, price, imageUrl, id, userID]
  );
  return result.rows[0];
};

export const deleteByIDCropService = async (id) => {
  await pool.query("DELETE FROM crops WHERE id = $1", [id]);
};
