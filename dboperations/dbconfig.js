const config = {
  user: "wage2dbserver",
  password: "wage2pass!",
  server: "wage2dbserver.database.windows.net",
  database: "wage2db",
  options: {
    trustedconnection: true,
    enableArithAort: true,
    encrypt: true,
  },
};

module.exports = config;
