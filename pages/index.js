import { verifyToken } from "../lib/auth";
import dbConnect from "../lib/db";
import User from "../models/User";
import HomePage from "../components/HomePage";

export default function Home({ user }) {
    return <HomePage user={user} />;
}

export async function getServerSideProps(context) {
    const { req } = context;
    const token = req.cookies.token || "";

    const decoded = verifyToken(token);
    if (!decoded) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        };
    }

    await dbConnect();
    const user = await User.findById(decoded.id).select("-password").lean();
    if (!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        };
    }

    user._id = user._id.toString();

    return {
        props: { user }
    };
}
