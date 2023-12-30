const jwt = require('jsonwebtoken')
require('dotenv').config()

//auth, isSTudent, isAdmin


exports.auth = (req,res,next)=>{
    try {
        //extract JWT token
        console.log({body: req.body})
        const token = req?.body?.token || req?.cookies?.token
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token Missing"
            })
        }
        if(process.env.JWT_SECRET==undefined){
            return res.status(401).json({
                success: false,
                message: "JWT_SECRET Missing"
            })
        }

        //verify the token
        try {
            console.log({JWT_SECRET:process.env.JWT_SECRET})
            const decode = jwt.verify(token, process.env.JWT_SECRET,{
                algorithm: "HS256",
                ignoreExpiration: true,
                ignoreNotBefore: true
            })
            req.user = decode
            console.log(req.user)
        } catch (error) {
            console.error(error)
            return res.status(401).json({
                success:false,
                message: "invalid Token ⚠️"
            })
        }

        next()

    } catch (error) {
        console.error(error)
        return res.status(401).json({
            success:false,
            message: "Error Occured in Authentication ⚠️"
        })
    }
}

exports.isStudent = (req,res,next)=>{
    try {
        console.log(req.user)
        if(req.user.role !=="Student"){
            return res.status(401).json({
                success:false,
                message: "You are not authorized Student⚠️"
            })
        }

        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Something error occured⚠️: "+error
        })
    }
}

exports.isAdmin = (req,res,next)=>{
    try {
        if(req.user.role !=="Admin"){
            return res.status(401).json({
                success:false,
                message: "You are not authorized Admin⚠️"
            })
        }

        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Something error occured⚠️: "+error
        })
    }
}