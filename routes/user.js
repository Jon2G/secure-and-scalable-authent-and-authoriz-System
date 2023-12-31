const express = require('express')
const router = express.Router()

//Handlers from controllers
const {login, signup,totp} = require("../controllers/auth")
const {auth, isStudent, isAdmin,decodeJwt} = require('../middlewares/authMiddle')
const {encrypt,decrypt} = require('../chiper/elgamal')
router.post('/login', login)
router.post('/signup', signup)
router.post('/totp', totp)


//testing protected route
router.post("/test",auth, (req,res)=>{
    res.json({
        success: true,
        message: "You are a valid Tester 👨‍💻"
    })
})
//protected routes
router.post('/student', auth, isStudent, (req,res)=>{
    res.json({
        success: true,
        message: "You are a valid Student 🧑‍🎓"
    })
})

router.post('/admin', auth, isAdmin, (req,res)=>{
    res.json({
        success: true,
        message: "You are a valid Admin 😎"
    })
})

router.post('/encrypt', auth,isStudent, async (req,res)=>{
    console.log('encrypt')
    const {message,token} = req.body
    const user = decodeJwt(token)
    const encrypted =await encrypt(message,user.keys)
    return res.status(200).json({
        success: true,
        encrypted: encrypted
    })
})

router.post('/decrypt', auth,isStudent, async (req,res)=>{
    console.log('decrypt')
    const {encrypted,token} = req.body
    const user = decodeJwt(token)
    const decrypted =await decrypt(encrypted,user.keys)
    return res.status(200).json({
        success: true,
        decrypted: decrypted
    })
})

module.exports = router