
import JWT from "jsonwebtoken";

export const shouldBeLoggedIn = async (req, res) => {
console.log(req.userId)
};



export const shouldBeAdmin = async (req,res, next)=>{
    try {
        const token = req.cookies.token;
    
        if (!token) {
          return res.status(401).json({ message: "Not Authenticated!" });
        }
    
        JWT.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
          if (err) 
            return res.status(403).json({ message: "Token is not valid!" });
            if(!payload.isAdmin){
                return res.status(403).json({message:"Not Authorized!"})
            req.userId = payload.id
          }
    
          // Token is valid, proceed with authenticated logic
          res.status(200).json({ message: "You are Authenticated", payload });
          next()
        });
      } catch (err) {
        // Handle unexpected errors
        res.status(500).json({ message: "Internal Server Error" });
      }


}