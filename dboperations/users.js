const config = require("./dbconfig");
const sql = require("mssql");
var md5 = require("md5");

const getID = (lastIdentObj) => lastIdentObj.recordset[0].LastID;

const getUsers = async () => {
  try {
    let pool = await sql.connect(config);
    let users = await pool.request().query("SELECT * FROM Users");

    return users.recordset;
  } catch (error) {
    console.log(error);
  }
};

const authUser = async ({ login, password }) => {
  try {
    let pool = await sql.connect(config);

    let userWithType = await pool
      .request()
      .input("login", login)
      .input("password", md5(password))
      .query(`SELECT UserID, UserType FROM getUsersWithType   
     WHERE Login=@login AND Password=@password `);
    console.log(userWithType);

    if (userWithType.recordset.length === 0) {
      throw new Error("Not found");
    }

    let userData = {};
    const { UserID, UserType } = userWithType.recordset[0];
    if (UserType === "Candidate") {
      userData = await pool
        .request()
        .input("userID", UserID)
        .query(`SELECT * FROM Candidates WHERE userID=@userID`);
    } else if (UserType === "Employer") {
      userData = await pool
        .request()
        .input("userID", UserID)
        .query(`SELECT * FROM Employers WHERE userID=@userID`);
    }

    return { ...userData.recordset[0], UserType };
  } catch (error) {
    console.error(error);
  }
};

const addNewUser = async (userData) => {
  try {
    console.log(userData);
    const userTypeID = userData.UserType === "candidate" ? 1 : 2;
    let pool = await sql.connect(config);
    const doesUserExists = await pool
      .request()
      .input("Password", md5(userData.Password))
      .input("Login", userData.Login)
      .query(
        `SELECT UserID FROM Users WHERE Login=@Login AND Password=@Password`
      );

    if (doesUserExists.recordset.length > 0) {
      throw new Error("User o podanych danych już istnieje");
    }

    await pool
      .request()
      .input("UserTypeID", userTypeID)
      .input("Password", md5(userData.Password))
      .input("Login", userData.Login)
      .input("Email", userData.Email)
      .query(
        `INSERT INTO Users (Login, Password, UserTypeID, Email) VALUES (@Login, @Password, @UserTypeID, @Email)`
      );

    const lastUserID = await pool
      .request()
      .query(`SELECT IDENT_CURRENT('Users') AS LastID`);

    if (userTypeID === 1) {
      await pool
        .request()
        .input("UserID", getID(lastUserID))
        .input("Name", userData.Name)
        .input("Surname", userData.Surname)
        .input("Age", userData.Age)
        .input("PhoneNumber", userData.PhoneNumber)
        .input("Document", userData.Document)
        .query(
          `INSERT INTO Candidates (UserID, Name, Surname, Age, Document, PhoneNumber) 
          VALUES (@UserID, @Name, @Surname, @Age, @Document, @PhoneNumber)`
        );
    } else if (userTypeID === 2) {
      await pool
        .request()
        .input("Name", userData.CompanyName)
        .input("Street", userData.Street)
        .input("City", userData.City)
        .input("Voivodeship", userData.Voivodeship)
        .query(
          `INSERT INTO Companies (Name, Street, City, Voivodeship) 
        VALUES (@Name, @Street, @City, @Voivodeship)`
        );

      const lastCompanyID = await pool
        .request()
        .query(`SELECT IDENT_CURRENT('Companies') AS LastID`);

      await pool
        .request()
        .query(
          `INSERT INTO Employers (UserID, CompanyID) VALUES (${getID(
            lastUserID
          )},${getID(lastCompanyID)})`
        );
    }

    return 1;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUsers: getUsers,
  authUser: authUser,
  addNewUser: addNewUser,
};
