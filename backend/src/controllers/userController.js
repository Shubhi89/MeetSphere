import httpStatus from "http-status";
import { user } from "../models/userModel.js";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";
import { meeting } from "../models/meetingModel.js";

const signIn = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "please enter your details" });
    }

    try {
        const User = await user.findOne({ username });
        if (!User) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "user not found" });
        }

        let isPasswordCorrect = await bcrypt.compare(password, User.password);

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");

            User.token = token;
            await User.save();
            return res.status(httpStatus.OK).json({ token: token })
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
        }

    } catch (e) {
        return res.status(500).json({ message: "something went wrong", e });
    }
}


const signUp = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        const existingUser = await user.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({
            name: name,
            username: username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(httpStatus.CREATED).json({ message: "User Registered" })
    } catch (e) {
        res.json({ message: "something went wrong", e });
    }

}

const getUserHistory = async (req, res) => {
    const { token } = req.query;
    try {
        const User = await user.findOne({ token: token });
        const meetings = await meeting.find({ user_id: User.username });
        res.json(meetings);

    } catch (e) {
        return res.status(500).json({ message: "something went wrong", e });
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;
    try {
        const User = await user.findOne({ token: token });
        const newMeeting = new meeting({
            user_id: User.username,
            meetingCode: meeting_code
        })
        await newMeeting.save();
        res.status(httpStatus.CREATED).json({ message: "Meeting added to history" });
    } catch (e) {
        return res.status(500).json({ message: "something went wrong", e });
    }
}

export { signIn, signUp, getUserHistory, addToHistory };