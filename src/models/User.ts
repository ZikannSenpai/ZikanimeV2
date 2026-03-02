import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String },
    passwordHash: { type: String },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    vipUntil: { type: Date, default: null },
    avatar: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

export default (mongoose.models.User as mongoose.Model<any>) ||
    mongoose.model("User", UserSchema);
