import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt"

export const getUsers =async (req,res)=>{
  
    try{
        const users = await prisma.user.findMany();
        res.status(200).json(users)   
    }catch(err){
        console.log(err)
        res.status(500).json({messsage:"failed to get users!"})
    }
}

export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get user!" });
    }
};




export const updateUser =async (req,res)=>{
    const id = req.params.id;
    const tokenUserId = req.userId;
    const {password,avatar,...inputs} =req.body;
    if(id !== tokenUserId){
        return res.status(403).json({messsage:"Not Authorized!" })
    }
    let updatedPassword = null
    try{
if (password){
    updatedPassword = await bcrypt.hash(password,10)
}

        const updatedUser  = await prisma.user.update({
            where:{ id },
            data:{
                ...inputs,
                ...(updatedPassword && {password:updatedPassword}),
                ...( avatar && {avatar})
            },
        });
        const {password:userPassword, ...rest} =updateUser

        res.status(200).json(rest);
    }catch(err){
        console.log(err)
        res.status(500).json({messsage:"failed to update user!"})
    }
}



export const savedpost=async (req,res)=>{
    const postId =req.body.postId
    const tokenUserId = req.userId;
  
    try{
        
        const savedpost = await prisma.savedPost.findUnique({
            where:{userId_postId:{
                userId:tokenUserId,
                postId:tokenUserId,postId
            }  }

        })
    if (savedpost){
        await prisma.savedPost.delete({
            where:{id:savedpost.id}
        })  
        res.status(200).json({message:"post removed from saved list"})  
    } else{
        await prisma.savedPost.create({data:{
            userId: tokenUserId,
            postId
        }})
        res.status(200).json({message:"Post saved "})  
    }
     
 
    }catch(err){
        console.log(err)
        res.status(500).json({messsage:"failed to delete user!"})
    }
}

export const propfilePosts = async(req,res)=>{
     const tokenUserId =req.params.userId
    try{
          // Fetch user posts
    const userPosts = await prisma.post.findMany({
        where: { userId: tokenUserId },
      });
        const saved = await prisma.savedPost.findMany({
            where:{userId:tokenUserId},
            include: {
                post:true
            }
        })
        const  savedPosts = saved.map((item)=>item.post)
        res.status(200).json({userPosts,savedPosts})
    
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to get profile posts"})
    }
}






export const deleteUser =async (req,res)=>{
    const id = req.params.id;
    const tokenUserId = req.userId;
    
    if(id !== tokenUserId){
        return res.status(403).json({messsage:"Not Authorized!" })
    }
  
    try{
    await prisma.user.delete({
        where:{ id } })    

 res.status(200).json({message:"user deleted!"})
 
    }catch(err){
        console.log(err)
        res.status(500).json({messsage:"failed to delete user!"})
    }
}