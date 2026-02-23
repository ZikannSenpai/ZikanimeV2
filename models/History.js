import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    animeId: {
        type: String,
        required: true
    },
    animeTitle: {
        type: String,
        required: true
    },
    episode: {
        type: String,
        required: true
    },
    poster: {
        type: String
    },
    watchedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.History ||
    mongoose.model("History", HistorySchema);
