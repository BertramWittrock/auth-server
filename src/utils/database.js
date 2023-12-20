const sql = require('mssql');
const dotenv = require("dotenv");

dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function executeQuery(sqlQuery) {
    try {
        await sql.connect(config);
        console.log("Connected to the database!");
        const result = await sql.query(sqlQuery);
        console.log("Query executed successfully:", result);
        return result;
    } catch (err) {
        console.error("Error executing the query: ", err);
        throw err;
    } finally {
        await sql.close();
    }
}

async function checkIfUserExists(email) {
    const checkQuery = `SELECT * FROM Users WHERE email = '${email}';`;
    const result = await executeQuery(checkQuery);
    return result.recordset.length > 0;
}

async function createUser(id, username, hashedPassword, email) {
    const insertQuery = `
        INSERT INTO Users (id, username, password, email) 
        VALUES ('${id}', '${username}', '${hashedPassword}', '${email}');
    `;
    await executeQuery(insertQuery);
}

async function findUserByEmail(email) {
    const findQuery = `SELECT * FROM Users WHERE email = '${email}';`;
    const result = await executeQuery(findQuery);
    return result.recordset.length ? result.recordset[0] : null;
}

module.exports = {
    checkIfUserExists,
    createUser,
    findUserByEmail
};
