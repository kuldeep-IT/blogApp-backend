import User from "../model/User.js";
import bcrypt from "bcryptjs";

const getAllUser = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (error) {
        console.log("getAllUser error: ", error)
    }

    if (!users) {
        return res.status(404).json({
            message: "No user found"
        })
    }

    return res.status(200).json({
        users
    })
}

const signUp = async (req, res, next) => {
    const { name, email, password } = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({ email })
    } catch (error) {
        return console.log("signup error: ", error)
    }

    if (existingUser) {
        return res.status(400).json({
            message: "User already exists! Please login!"
        })
    }

    const hashedPassword = bcrypt.hashSync(password)

    const user = new User({
        name,
        email,
        password: hashedPassword,
        blogs: []
    })

    try {
        await user.save();
    } catch (error) {
        return console.log("signup adding user error: ", error)
    }

    return res.status(201).json({ message: `User created successfully ${user.name}`, user })
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body

    let existingUser;
    try {
        existingUser = await User.findOne({ email })
    } catch (error) {
        return console.log("login error: ", error)
    }

    if (!existingUser) {
        return res.status(404).json({
            message: "User not found! Please signup!"
        })
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)

    if (!isPasswordCorrect) {
        return res.status(400).json({
            message: "Incorrect password! Please try again!"
        })
    }

    return res.status(200).json({
        message: "Login successfull",
    })
}

export {
    getAllUser,
    signUp,
    loginUser
}