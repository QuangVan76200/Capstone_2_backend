
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (request, response, next) => {
    const autHeader = request.header('Authorization');//'' null undefine 
    const token = autHeader && autHeader.split(' ')[1]; //Bearer jdbhdfgbdìhỉuthủihffhighfdibgeihừ
    if (!token)
        return response.json({
            sucess: false,
            messege: 'Access token not found'
        });
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        request._id = decoded._id;
        next();
    } catch (error) {
        console.log(error);
        response.json({
            success: false,
            messege: 'Invalid Token'
        });
    }
}

module.exports = verifyToken;