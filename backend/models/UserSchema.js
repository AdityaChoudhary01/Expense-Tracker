import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
      },
    avatarImage: {
        type: String,
        default: "",
    },
}, { timestamps: true });

// The third argument here sets the collection name
export default mongoose.model("User", UserSchema, "khatabook-users");
