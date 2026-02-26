import mongoose, { Schema, Document } from "mongoose";

export interface IHistory extends Document {
    userId: mongoose.Types.ObjectId;
    animeId: string;
    animeTitle: string;
    episode: number;
    image: string;
    watchedAt: Date;
}

const HistorySchema = new Schema<IHistory>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    animeId: { type: String, required: true },
    animeTitle: { type: String, required: true },
    episode: { type: Number, required: true },
    image: { type: String, default: "" },
    watchedAt: { type: Date, default: Date.now }
});

export default mongoose.models.History ||
    mongoose.model<IHistory>("History", HistorySchema);
