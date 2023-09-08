module.exports = {
  development: {
    username: "postgres",
    password: "root",
    database: "octilearn_dev",
    host: "127.0.0.1",
    dialect: "postgres",
    // dialectOptions: {
    //   ssl: {
    //     require: true, // This will help you. But you will see nwe error
    //     rejectUnauthorized: false, // This line will fix new error
    //   },
    // },
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DATABASE,
    host: process.env.DBHOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true, // This will help you. But you will see nwe error
        rejectUnauthorized: false, // This line will fix new error
      },
    },
  },
};
