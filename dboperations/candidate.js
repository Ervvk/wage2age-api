const config = require("./dbconfig");
const sql = require("mssql");

const getCandidatesApps = async (candidateID) => {
  try {
    if (candidateID === "undefined") throw new Error("Undefined candidate");
    let pool = await sql.connect(config);
    let users = await pool
      .request()
      .input("CandidateID", candidateID)
      .query("SELECT * FROM getCandidatesApps WHERE CandidateID=@CandidateID");

    return users.recordset;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getCandidatesApps: getCandidatesApps };
