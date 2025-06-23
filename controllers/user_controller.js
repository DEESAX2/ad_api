import {sendOtpEmail } from "../config/mail.js";
import { secret } from "../config/env.js";
import { User } from "../models/user_model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { signUpSchema } from "../schema/user_schema.js";



const otpGenerator = (length = 5) => {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10)
    }
    return otp;
};

export const signUp = async (req, res) => {
    const { firstName, lastName, email, password,confirmPassword, role, otp} = req.body;

    const {error, value} = signUpSchema.validate(req.body);
    if(error){
        return res.status(400).json({error})
    }

    // // validate the password and confirmpassword
    // if (req.body.password !== req.body.confirmPassword){
    //     return res.status(400).json({message: "Confirm password should match the password"})
    // };

    // console.log('userData', firstName, lastName, email, password,confirmPassword, role)
    // finds if the user already exist by using the email
    const findUser = await User.findOne({email});
    console.log(findUser, "found")

    // if user found just say user exist if not hash the password and continue to save it.
    if (findUser) {
        return res.status(200).json({ message: `User already exist` });
    } else {
        const hashPassword = await bcrypt.hash(password, 12);
        console.log("hashPassword", hashPassword)

        // generate an otp of 4 numbers for the user
        const otp = otpGenerator(4);
        // show otp in console.log
        console.log("otp", otp);

        // save the new user details in the database using the format below.
        // const saveUserData = await User.create({
        //     firstName,
        //     lastName,
        //     email,
        //     password: hashPassword,
        //     role: role,
        //     otp: otp,
        //     otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000)
        // });

        const saveUserData = await User.create({
            ...value,
            password:hashPassword
        });

        // show the saved user details in the console
        console.log("savedata", saveUserData)

        // send otp to email
        await sendOtpEmail(email,otp)
        console.log("otp sent to email", email)

        // secrete key with jwt
        console.log(`Secret key: ${secret}`)

        // generate a token with user id and role, and the secret key is embedded in it after the signup....this will last for 2 hours
        const token = jwt.sign(
            { id: saveUserData.id, role: saveUserData.role },
            secret,
            { expiresIn: "1h" }
        )
        console.log("token", token);
        return res.status(201).json({ user: saveUserData, token: token });

    };
};


export const loginUser = async (req, res) => {
    try {
        // validates if the email from the user exist in the database
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).json({ message: 'Incorrect email or password' });

        // compares the password from the user to the one in the database
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword)
            return res.status(401).json({ message: 'Incorrect email or password' });

        // if both password and email are valid, generate a JWT token to be use for authentication. here the user's id and role, secret key with an expiring period of 1hr is embedded in the token.
        const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in user' });
    }
};