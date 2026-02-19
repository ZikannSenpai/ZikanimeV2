// models/History.js
import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    animeId: String,
    title: String,
    episode: String,
    watchedAt: { type: Date, default: Date.now }
});

export default mongoose.models.History ||
    mongoose.model("History", HistorySchema);
