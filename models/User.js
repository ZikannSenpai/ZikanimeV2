import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String },
    passwordHash: { type: String, required: true },
    lastWatched: { type: Object, default: null }, // { animeId, title, at }
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.models.User || mongoose.model("User", UserSchema);
