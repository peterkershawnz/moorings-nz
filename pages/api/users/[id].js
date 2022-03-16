import dbConnect from '../../../lib/dbConnect';
import repository from "../repository";


export default async function handler(req, res) {
    const {
        query: { id },
        body: { },
        method,
    } = req

    await dbConnect()

    if (method === "GET") {
        try {
            const user = await repository.getUserById(id);
            if (!user) {
                return res.status(404).json({ success: false, message: "No user found" })
            }
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    if (method === "DELETE") {
        try {

            const user = await repository.deleteUserById(id);
            if (user.deletedCount === 0) {
                return res.status(404).json({ success: false, message: "No user found" })
            }
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
