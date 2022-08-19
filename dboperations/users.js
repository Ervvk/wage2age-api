const config = require("./dbconfig");
const sql = require("mssql");

const getUsers = async () => {
  try {
    let pool = await sql.connect(config);
    let users = await pool.request().query("SELECT * FROM Users");

    return users.recordset;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUsers: getUsers,
};
