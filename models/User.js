// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    profile: {
        displayName: String,
        avatarUrl: String
    },
    lastWatched: {
        animeId: String,
        title: String,
        at: Date
    }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
