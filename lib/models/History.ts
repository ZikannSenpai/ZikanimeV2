import { ObjectId } from "mongodb";

export interface History {
    _id?: ObjectId;
    userId: ObjectId;
    animeId: string;
    animeTitle: string;
    episode: string;
    episodeTitle?: string;
    image?: string;
    watchedAt: Date;
}
