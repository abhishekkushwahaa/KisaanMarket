import pool from "@/config/db";

export const getAllCropsService = async () => {
    const result = await pool.query("SELECT * FROM crops");
    return result.rows;
};

export const addCropService = async (name, price, userID) => {
  const result = await pool.query(
      "INSERT INTO crops (name, price, userid) VALUES ($1, $2, $3) RETURNING *",
      [name, price, userID]
  );
  return result.rows[0];
};

export const updateByIDCropService = async (name, price, userID, id) => {
  const result = await pool.query(
        "UPDATE crops SET name = $1, price = $2, userid = $3 WHERE id = $4 RETURNING *",
        [name, price, userID, id]
  );
  return result.rows[0];
};

export const deleteByIDCropService = async (id) => {
    const result = await pool.query(
        "DELETE FROM crops WHERE id = $1 RETURNING *",
        [id]
    );
};