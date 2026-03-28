import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from "../models/userModel.js";

export const registerUser=async (req,res) =>{
    const user =new User(req.body);
try{
    const check= await User.findOne({email: user.email});
    if(check) return res.status(400).send('User already exists');
    user.password=await bcrypt.hash(user.password,10);
    await user.save();
    res.status(201).json({ message: "User registered sucessfully" });
}
catch(error){
res.status(400).send(error);
}
};

export const loginUser = async (req, res) => {
    const user = new User(req.body);
    try {
        const check = await User.findOne({ email: user.email });
        if (check && await bcrypt.compare(user.password, check.password))
        {
            const token = jwt.sign(
                { id: check._id, username: check.username },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
            return res.json({ message: "Login successful", token: token });
        }
        res.status(401).json({ message: "Invalid credentials" });
    }
    catch (error) {
        res.status(400).send(error);
    }
};

const verifyToken =(req,res,next)=>{
const token=req.headers['authorization'];
if(!token) return res.sendStatus(403);

jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
if(err) return res.sendStatus(403);
req.user=user;
next();
});
};



export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        user.resetToken = resetToken;
        await user.save();

        res.json({ message: "Reset token generated", resetToken });
    }
    catch (error) {
        res.status(400).send(error);
    }
};



export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ resetToken: token });
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    }
    catch (error) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
};