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
            // First check that the mooring exists
            const mooringExists = await repository.checkMooringExists(mooring_number);
            if (mooringExists.length === 0) {
                return res.status(404).json({ Umessage: "Unable to locate a mooring with those details." })
            }

            // Second check if claimeded by this owner
            const mooringClaimed = await repository.checkMooringIsAvailable(mooring_number);
            if (mooringClaimed.auth0 === 'auth0pass1') {
                return res.status(400).json({ message: "You have already claimed this mooring" })
            }
            if (mooringClaimed) {
                return res.status(404).json({ message: "This mooring has been claimed already" })
            }

            // Third check if the owner id is correct and exists
            const updateOwner = await repository.updateOwnerById(id, mooring_number);
            if (!updateOwner) {
                return res.status(404).json({ success: false, message: "No owner found" })
            }

            // Checks that the update happened
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
