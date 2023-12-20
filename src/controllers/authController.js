const authService = require('../services/authService.js');

const createUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await authService.createUser({ email, username, password });
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

const validateToken = async (req, res) => {
    try {
        const accessToken = req.params.accessToken;
        const isValid = await authService.validateToken(accessToken);
        res.status(200).send(isValid);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    createUser,
    login,
    validateToken
};
