import pool from "@/config/db";

export const addCropService = async () => {
  const result = await pool.query(
    "INSERT INTO crops (name, price, userID) VALUES ($1, $2, $3) RETURNING *"
  )
  return result;
}
