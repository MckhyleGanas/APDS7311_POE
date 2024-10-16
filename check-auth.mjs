import jwt from "jsonwebtoken";

const checkauth = (req, res, next) => {
    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization.split(" ")[1];

        // Define RegEx for checking JWT format (3 base64 strings separated by '.')
        const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

        // Check if the token matches the JWT RegEx
        if (!jwtRegex.test(token)) {
            return res.status(401).json({
                message: "Token format invalid",
            });
        }

        // Verify the token using jsonwebtoken
        jwt.verify(token, "this_secret_should_be_longer_than_it_is");

        // If everything is fine, pass control to the next handler
        next();
    } catch (error) {
        res.status(401).json({
            message: "Token invalid",
        });
    }
};

export default checkauth;