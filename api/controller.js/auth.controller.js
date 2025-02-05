import bcrypt from "bcrypt"
import prisma from "../lib/prisma.js";
import JWT from "jsonwebtoken"
import { PrismaClient } from '@prisma/client';



export const register =async(req,res)=>{
    
    const{username,email,password} =req.body;
    try{
    const hashedPassword =await bcrypt.hash(password, 10)

    console.log(hashedPassword)

    // create a new user  and save  to Db
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password:hashedPassword,
        }
});

console.log(newUser) 
res.status(201).json({message:"user created successfully"});

}catch(err){
console.log(err)
res.status(500).json({message:"failed to create user!"})
}
};



export const login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { username },
      });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials!" });
      }
  
      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials!" });
      }
  
      // Generate token
      const age = 1000 * 60 * 60 * 24 * 7; // 1 week
      const token = JWT.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET_KEY,
        
         
        
        {
          expiresIn: age,
        }
      );
  
      // Remove password from user object before sending response
      const { password: userPassword, ...userInfo } = user;
  
      // Set cookie with the token
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: age,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      });
  
      // Respond with user info
      res.status(200).json(userInfo);
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to login" });
    }
  };
  


export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};


