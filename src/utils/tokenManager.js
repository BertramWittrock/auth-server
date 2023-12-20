const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const dotenv = require("dotenv");

dotenv.config();

const tokensPath = path.join(__dirname, '..', 'accessTokens.json');

function storeToken(userId, accessToken, expiresIn) {
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
    const newToken = { userId, accessToken, expiresAt };
  
    const tokens = readTokens();
    tokens.push(newToken);
    fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2));
    console.log('Token stored successfully.');
}

function isAccessTokenExpired(accessToken) {
    const tokens = readTokens();
    const tokenObj = tokens.find(t => t.accessToken === accessToken);
    if (!tokenObj) return true;

    const expiryTime = new Date(tokenObj.expiresAt);
    return new Date() > expiryTime;
}

function readTokens() {
    if (!fs.existsSync(tokensPath)) {
        fs.writeFileSync(tokensPath, JSON.stringify([]));
    }
    const data = fs.readFileSync(tokensPath, 'utf-8');
    return JSON.parse(data);
}

function generateJWT(user) {
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    return accessToken;
}


module.exports = {
    storeToken,
    isAccessTokenExpired,
    generateJWT,
};
