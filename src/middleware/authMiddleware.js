import jwt from "jsonwebtoken"


export async function authMiddleware(req,res,next) {


    try {
        const token  = req.cookies.token
    
        // const payload = await jwt.verify(token,)
        // {
        //     userid:"shdfgjsad"
        // }
        // get the user  from db
        // req.userId = id from id


        next()
        

    } catch (error) {
        console.log(error);
        
    }
    
}