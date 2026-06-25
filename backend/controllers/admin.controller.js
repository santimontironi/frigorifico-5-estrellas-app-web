import adminRepository from "../repository/admin.repository.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

class AdminController{
    async registerAdmin(req,res){
        try{
            const {username,password} = req.body

            const passwordHash = await bcrypt.hash(password, 10)
            
            await adminRepository.createAdmin({username, password:passwordHash})

            return res.status(201).json({message:"admin created"})
        }
        catch(error){
            return res.status(500).json({message:error.message})
        }
    }

    async loginAdmin(req,res){
        try{
            const {username,password} = req.body

            const admin = await adminRepository.findAdminByUsername(username)

            if(!admin){
                return res.status(404).json({message:"Admin no encontrado"})
            }

            const passwordMatch = await bcrypt.compare(password, admin.password)

            if(!passwordMatch){
                return res.status(401).json({message:"Contraseña incorrecta"})
            }

            const token = jwt.sign({adminId:admin._id, role:"admin"}, process.env.JWT_SECRET)

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production" ? true : false,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
            })

            return res.status(200).json({message:"Login exitoso", admin: true})
        }
        catch(error){
            return res.status(500).json({message:error.message})
        }
    }

    async logout(req,res){
        try{
            res.clearCookie("token",{
                httpOnly: true,
                secure: process.env.NODE_ENV === "production" ? true : false,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
            })
            return res.status(200).json({message:"Logout exitoso"})
        }
        catch(error){
            return res.status(500).json({message:error.message})
        }
    }
}

const adminController = new AdminController()
export default adminController