import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("zikanime");

    const anime = await db.collection("anime").find({}).toArray();
    res.status(200).json(anime);
}
