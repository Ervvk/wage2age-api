const config = require("./dbconfig");
const sql = require("mssql");

const getOffers = async () => {
  try {
    let pool = await sql.connect(config);
    let offers = await pool.request().query("SELECT * FROM getActiveOffers");

    return offers.recordset;
  } catch (error) {
    console.log(error);
  }
};

const getOfferByID = async (offerID) => {
  try {
    let pool = await sql.connect(config);
    let offer = await pool
      .request()
      .query(`SELECT * FROM getActiveOffers WHERE OfferID=${offerID}`);
    let offerDetails = await pool
      .request()
      .query(`SELECT * FROM getOfferInfos WHERE OfferID=${offerID}`);

    const offerObj = {
      overview: offer.recordset[0],
      details: offerDetails.recordset,
    };

    return offerObj;
  } catch (error) {
    console.error(error);
  }
};

const addNewOffer = async (offerData) => {
  try {
    const offerInfos = offerData?.offerInfos;

    const offerDetails = { ...offerData };
    delete offerDetails.offerInfos;

    let pool = await sql.connect(config);

    const req = pool.request();
    for (const field in offerDetails) {
      req.input(field, offerDetails[field]);
    }
    req.input("StartDate", "2/1/2022").input("EndDate", "2/1/2022");

    await req.query(`INSERT INTO Offers (CompanyID, PositionName, StartDate, EndDate, Salary, Workplace, Contract, Handicap, Education, PcSkill, Physical, Experience, Shifts, Commuting, WorkTime, Leave, Description, Active) VALUES 
    (@CompanyID, @PositionName,CONVERT(DATE,CURRENT_TIMESTAMP), @EndDate, @Salary, @Workplace, @Contract, @Handicap, @Education, @PcSkill, @Physical, @Experience, @Shifts, @Commuting, @WorkTime, @Leave, @Description, 1)`);

    const lastOfferID = await pool
      .request()
      .query(`SELECT IDENT_CURRENT('Offers') AS LastID`);

    for (const offerInfo of offerInfos) {
      let infoType = 1;

      switch (offerInfo.type) {
        case "tasks":
          infoType = 1;
          break;
        case "requirements":
          infoType = 2;
          break;
        case "benefits":
          infoType = 3;
          break;
        default:
          break;
      }

      await pool
        .request()
        .input("OfferID", lastOfferID.recordset[0].LastID)
        .input("OfferInfoTypeID", infoType)
        .input("Content", offerInfo.value)
        .query(
          `INSERT INTO OfferInfos (OfferInfoTypeID, OfferID, Content) VALUES (@OfferInfoTypeID, @OfferID, @Content)`
        );
    }
    return true;
  } catch (error) {
    console.log(error);
  }
};

const addNewJobApp = async (jobAppData) => {
  try {
    let pool = await sql.connect(config);
    console.log(jobAppData);
    let isAppUnique = await pool
      .request()
      .input("CandidateID", jobAppData.CandidateID)
      .input("OfferID", jobAppData.OfferID)
      .query(
        `SELECT JobApplicationID FROM JobApplications WHERE OfferID=@OfferID AND CandidateID=@CandidateID`
      );

    if (isAppUnique.recordset.length > 0) {
      throw new Error("Kandydat już aplikował na tę ofertę");
    }
    const req = pool.request();
    for (const field in jobAppData) {
      req.input(field, jobAppData[field]);
    }
    let offers = await req.query(
      "INSERT INTO JobApplications VALUES (@OfferID, @CandidateID, @JobAppStatusID, GETDATE())"
    );

    return true;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getOffers: getOffers,
  getOfferByID: getOfferByID,
  addNewOffer: addNewOffer,
  addNewJobApp: addNewJobApp,
};
