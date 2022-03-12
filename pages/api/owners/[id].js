import dbConnect from '../../../lib/dbConnect';
import repository from "../repository";


export default async function handler(req, res) {
    const {
        query: { id },
        body: { mooring_number },
        method,
    } = req

    await dbConnect()

    if (method === "GET") {
        try {

            const owner = await repository.getOwnerById(id);
            if (owner.length === 0) {
                return res.status(404).json({ success: false, message: "No owner found" })
            }
            res.status(200).json({ success: true, data: owner });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    if (method === "PATCH") {
        try {
            // continue from here. need to update the function to be a full aggregate pipeline to check if mooring already in the owners array
            const updateOwner = await repository.updateOwnerById(id, mooring_number);
            if (!updateOwner) {
                return res.status(404).json({ success: false, message: "No owner found" })
            }

            if (updateOwner.modifiedCount === 0) {
                return res.status(400).json({ success: false, message: "Unable to update" });
            }

            res.status(200).json({ success: true, data: updateOwner });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    if (method === "DELETE") {
        try {

            const owner = await repository.deleteOwnerById(id);
            if (owner.deletedCount === 0) {
                return res.status(404).json({ success: false, message: "No owner found" })
            }
            res.status(200).json({ success: true, data: owner });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
