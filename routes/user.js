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
router.get("/test",auth, (req,res)=>{
    res.json({
        success: true,
        message: "You are a valid Tester 👨‍💻"
    })
})
//protected routes
router.get('/student', auth, isStudent, (req,res)=>{
    res.json({
        success: true,
        message: "You are a valid Student 🧑‍🎓"
    })
})

router.get('/admin', auth, isAdmin, (req,res)=>{
    res.json({
        success: true,
        message: "You are a valid Admin 😎"
    })
})

router.get('/encrypt', auth,isStudent, (req,res)=>{
    const {message} = req.body
    const user = decodeJwt(req.token)
    console.log(user)
    const encrypted = encrypt(message,user.keys)
    return res.status(200).json({
        success: true,
        encrypted: encrypted
    })
})

router.get('/decrypt', auth,isStudent, (req,res)=>{
    const {encrypted} = req.body
    const user = decodeJwt(req.token)
    console.log(user)
    const decrypted = decrypt(encrypted,user.keys)
    return res.status(200).json({
        success: true,
        decrypted: decrypted
    })
})

module.exports = router