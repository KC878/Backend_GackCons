const teacherQueries = require("./../db/queries/teacher");
const pool = require("./../db/pool");

const getTeachers = async (req, res) => {
  try {
    const { rows: teachers } = await pool.query(teacherQueries.getTeachers);

    res.json(teachers);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

const searchTeacher = async (req, res) => {
  try {
    // Retrieve query string from the request
    const query = req.query.q;

    // If no query is provided, return an empty array
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query string cannot be empty" });
    }

    // Call the query function to get results
    const results = await teacherQueries.searchTeacher(query.trim());
    res.json(results);
  } catch (error) {
    // Handle errors and send a response
    res.status(500).json({ error: error.message });
  }
};

const updateMode = async (req, res) => {
  const { id } = req.params;
  const { mode } = req.body;

  try {
    // Validate user ID
    if (!Number(id)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    // Validate mode
    if (!['online', 'onsite'].includes(mode)) {
      return res.status(400).json({ error: "Invalid mode. Must be 'online' or 'onsite'." });
    }

    // Map mode to mode_id
    const modeId = mode === 'online' ? 1 : 2;

    // Update the user's mode in the database
    const result = await pool.query(
      "UPDATE users SET mode_id = $1 WHERE user_id = $2 RETURNING *",
      [modeId, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "User mode updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating user mode:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  updateMode,
  getTeachers,
  searchTeacher,
};
