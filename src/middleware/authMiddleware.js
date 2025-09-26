import jwt from "jsonwebtoken";

export async function authMiddleware(req, res, next) {
    
    try {
        const token = req.cookies.token;
        console.log(token);
        
    if(!token) {
        return res.status(401).json({message: "No, Token. Authorizaiton Denied."})
    }
        // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
console.log(decoded);

        // attach user id
    req.userId = decoded.id


        next()    
    } catch (error) {
        return res.status(401).json({message: "Invalid or Expired Token"})
    }
}

