const bcrypt = require('bcrypt')
const user = require("../models/user")
const jwt = require('jsonwebtoken')
const { authenticator } = require('otplib');
const { getTotp, verifyTotp } = require('./totp');
const { generateKeys } = require('./../chiper/elgamal');

require('dotenv').config()
//signup handle
exports.signup = async (req, res) => {
    try {
        //get input data
        const { name, email, password, role } = req.body

        // Check if All Details are there or not
        if (!name ||
            !email ||
            !password 
        ) {
            return res.status(403).send({
                success: false,
                message: "All Fields are required",
            });
        }

        //check if use already exists?
        const existingUser = await user.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        //secure password
        let hashedPassword
        try {
            hashedPassword = await bcrypt.hash(password, 10)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: `Hashing pasword error for ${password}: ` + error.message
            })
        }

        const secret = authenticator.generateSecret();
        console.log(secret);

        const keys =await generateKeys()
        console.log(keys);
        const User = await user.create({
            name, email, password: hashedPassword, role,
            secret,
            keys: {
                p: keys.p.toString(),
                g: keys.g.toString(),
                y: keys.y.toString(),
                x: keys.x.toString()
            }
        })

        return res.status(200).json({
            success: true,
            User,
            message: "user created successfully ✅"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "User registration failed"
        })
    }
}

exports.totp = async (req, res) => {
    const { secret } = req.body
    if (!secret) {
        return res.status(400).json({
            success: false,
            message: "Plz fill all the details carefully"
        })
    }
    const totp = getTotp(secret)
    return res.status(200).json({
        success: true,
        totp: totp
    })
}

exports.login = async (req, res) => {

    try {
        //data fetch
        const { email, password, totp } = req.body
        //validation on email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Plz fill all the details carefully"
            })
        }

        //check for registered User
        let User = await user.findOne({ email })
        //if user not registered or not found in database
        if (!User) {
            return res.status(401).json({
                success: false,
                message: "You have to Signup First"
            })
        }

        const payload = {
            email: User.email,
            id: User._id,
            role: User.role,
            keys: User.keys
        }
        //verify password and generate a JWt token 🔎
        if (await bcrypt.compare(password, User.password) && verifyTotp(User.secret,totp)) {
            //if password matched
            //now lets create a JWT token
            let token = jwt.sign(payload,
                process.env.JWT_SECRET,
                { expiresIn: "2h" }
            )
            User = User.toObject()
            User.token = token

            User.password = undefined
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true  //It will make cookie not accessible on clinet side -> good way to keep hackers away

            }
            res.cookie(
                "token",
                token,
                options
            ).status(200).json({
                success: true,
                token,
                User,
                message: "Logged in Successfully✅"

            })

        } else {
            //password donot matched
            return res.status(403).json({
                success: false,
                message: "Password incorrects⚠️"
            })
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Login failure⚠️ :" + error
        })
    }

}