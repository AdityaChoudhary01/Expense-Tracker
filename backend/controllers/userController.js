import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";


import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";

export const registerControllers = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Log the request body to see what data you're receiving
        console.log("Request Body:", req.body);

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            });
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({
                success: false,
                message: "User already Exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("Creating new user...");

        let newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        console.log("User created successfully:", newUser);

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            user: newUser,
        });
    } catch (err) {
        // Log the error to see the exact cause of the problem
        console.error("Error in registerControllers:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message, // Send the error message back to the client
        });
    }
};
export const loginControllers = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        // console.log(email, password);
  
        if (!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            }); 
        }
    
        const user = await User.findOne({ email });
    
        if (!user){
            return res.status(401).json({
                success: false,
                message: "User not found",
            }); 
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch){
            return res.status(401).json({
                success: false,
                message: "Incorrect Email or Password",
            }); 
        }

        delete user.password;

        return res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}`,
            user,
        });

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const setAvatarController = async (req, res, next)=> {
    try{

        const userId = req.params.id;
       
        const imageData = req.body.image;
      
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage: imageData,
        },
        { new: true });

        return res.status(200).json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
          });


    }catch(err){
        next(err);
    }
}

export const allUsers = async (req, res, next) => {
    try{
        const user = await User.find({_id: {$ne: req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);

        return res.json(user);
    }
    catch(err){
        next(err);
    }
}
