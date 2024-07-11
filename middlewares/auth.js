const jwt = require('jsonwebtoken');
const decryptToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    // Check if the authorization header is present
    if (!authHeader) {
        return res.status(401).send('User unauthorized');
    } 
    // Split the header value by space to separate the 'Bearer' keyword from the token
    const [Bearer, token] = authHeader.split(' ');
    try {
        console.log("Id token:", token);
        const decodedUserInfo = jwt.decode(token);
        console.log("currentUser", decodedUserInfo);
        req['current-user'] = decodedUserInfo;
    } catch (err) {
        return res.status(500).send('Failed to decrypt user information');
    }
    next();
}

module.exports = {
    decryptToken
};