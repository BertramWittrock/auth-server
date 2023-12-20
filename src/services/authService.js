const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const database = require("../utils/database");
const tokenManager = require("../utils/tokenManager");

const saltRounds = 10;

async function createUser({ email, username, password }) {
  try {
    // Tjek, om brugeren allerede findes
    const userExists = await database.checkIfUserExists(email);
    if (userExists) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Opret bruger
    const userId = uuidv4();
    await database.createUser(userId, username, hashedPassword, email);
    const accessToken = tokenManager.generateJWT({ email: email }); // Bruger tokenManager.generateJWT
    tokenManager.storeToken(userId, accessToken, 7200);

    return { userId, username, email, accessToken };
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error");
  }
}

async function login(email, password) {
  // Find bruger og password
  const user = await database.findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  // Tjek password
  const isMatch = await bcrypt.compare(password, user.password); // Opdateret for at referere til 'user.password'
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Generér JWT
  const accessToken = tokenManager.generateJWT({ email: email }); // Bruger tokenManager.generateJWT
  tokenManager.storeToken(user.id, accessToken, 7200);

  return { accessToken, username: user.username };
}

async function validateToken(accessToken) {
  return tokenManager.isAccessTokenExpired(accessToken);
}

module.exports = {
  createUser,
  login,
  validateToken,
};
