import config from "../../app/config";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// const register = async (payload: IUser) => {
//     const hashedPassword = await bcrypt.hash(payload.password, 10);
//     const user = await User.create({ ...payload, password: hashedPassword });
//     return user;
// };

const register = async( payload: IUser) => {
    const result = await User.create(payload)
    return result
}

const getAllUsers = async () => {  
    const users = await User.find();
    return users;
};

const login = async (payload: { email: string; password: string }) => {
    const user = await User.findOne({ email: payload?.email }).select("+password");
    if (!user) {
        throw new Error("This user is not found !");
    }

    const isPasswordMatched = await bcrypt.compare(payload?.password, user?.password);
    // console.log(isPasswordMatched, payload?.password, user?.password)
    if (!isPasswordMatched) {
        throw new Error("Wrong password!!!");
    }

    const jwtPayload = {
        email: user?.email,
        role: user?.role,
    };

    const token = jwt.sign(jwtPayload, config.jwt.access_secret, { expiresIn: "15d" });

    return { 
        token, 
        user: { 
            _id: user._id, 
            name: user.name,
            email: user.email,
            role: user.role,
        }
    };
};

export const AuthService = {
    register,
    getAllUsers,
    login,
};
