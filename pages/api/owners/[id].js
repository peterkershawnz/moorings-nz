import dbConnect from '../../../lib/dbConnect';
import repository from "../repository";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req

    await dbConnect()

    if (method === "GET") {
        try {
            const owner = await repository.getOwner(id);
            res.status(200).json({ success: true, data: owner });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
