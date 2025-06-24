import {sendOtpEmail } from "../config/mail.js";
import { secret } from "../config/env.js";
import { User } from "../models/user_model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { signUpSchema } from "../schema/user_schema.js";
import { Advert } from "../models/advert_model.js";



const otpGenerator = (length = 5) => {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10)
    }
    return otp;
};



export const signUp = async (req, res) => {
    const { firstName, lastName, email, password,confirmPassword, role} = req.body;

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

        // const image = req.file
        const saveUserData = await User.create({
            ...value,
            password:hashPassword,
            // image: image.path
        });

        // show the saved user details in the console
        console.log("savedata", saveUserData)

        // send otp to email
        await sendOtpEmail(email,otp)
        console.log("otp sent to email", email)

        // secret key with jwt
        console.log(`Secret key: ${secret}`)

    
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

// // this is to update a user's details 
// export const patchUser = async (req, res) => {
//   const id = req.params.id;
//   try {
//     res.status(200).json(await User.findByIdAndUpdate(id, req.body, { new: true }));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // assumes authMiddleware adds this
    const updates = req.body;

    delete updates.password
    delete updates.confirmPassword
    delete updates.user

    updates.user = req.user.id;

    // If a new profile image is uploaded
    if (req.file) {
      updates.image = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};
