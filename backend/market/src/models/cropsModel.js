import pool from "../config/db.js";

// export const getAllCropsService = async () => {
//   const result = await pool.query(
//     "SELECT * FROM crops ORDER BY created_at DESC"
//   );
//   return result.rows;
// };

export const getAllCropsService = async () => {
  const result = await pool.query(
    "SELECT * FROM crops ORDER BY crop_order ASC, created_at DESC"
  );
  return result.rows;
};

export const updateCropOrder = async (id, crop_order, userID) => {
  return pool.query(
    "UPDATE crops SET crop_order = $1 WHERE id = $2 AND userid = $3",
    [crop_order, id, userID]
  );
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

// export const getAllCropsService = async (limit, offset) => {
//   const result = await pool.query(
//     "SELECT * FROM crops ORDER BY created_at DESC LIMIT $1 OFFSET $2",
//     [limit, offset]
//   );
//   return result.rows;
// };

// export const countAllCropsService = async () => {
//   const result = await pool.query("SELECT COUNT(*) FROM crops");
//   return parseInt(result.rows[0].count, 10);
// };
