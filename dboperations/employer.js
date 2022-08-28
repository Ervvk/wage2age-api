const config = require("./dbconfig");
const sql = require("mssql");

const getCompanyOffers = async (companyID) => {
  try {
    let pool = await sql.connect(config);
    let offers = await pool
      .request()
      .input("CompanyID", companyID)
      .query(`SELECT * FROM getActiveOffers WHERE CompanyID=@CompanyID`);

    return offers.recordset;
  } catch (error) {
    console.log(error);
  }
};

const getOfferCandidates = async (offerID) => {
  try {
    let pool = await sql.connect(config);
    let offers = await pool
      .request()
      .input("OfferID", offerID)
      .query(`SELECT * FROM getOfferCandidates WHERE OfferID=@OfferID`);

    return offers.recordset;
  } catch (error) {
    console.log(error);
  }
};

const updateJobAppState = async ({ appID, stateID }) => {
  try {
    let pool = await sql.connect(config);

    //implement check if record exists
    await pool
      .request()
      .input("JobAppStateID", stateID)
      .input("JobApplicationID", appID)
      .query(
        `UPDATE JobApplications SET JobAppStateID=@JobAppStateID WHERE JobApplicationID=@JobApplicationID`
      );
    return true;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getCompanyOffers: getCompanyOffers,
  getOfferCandidates: getOfferCandidates,
  updateJobAppState: updateJobAppState,
};
