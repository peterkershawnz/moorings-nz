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
            // First check that the mooring exists and belongs to the owner or someone else
            const mooring = await repository.checkMooringOwnershipById(id, mooring_number);

            if (!mooring.mooringExists) {
                return res.status(404).json({ success: false, message: "Unable to locate a mooring with those details" })
            }

            if (mooring.belongsToOwner) {
                return res.status(400).json({ success: false, message: "This mooring has already been claimed by you" })
            }

            if (mooring.hasBeenClaimed) {
                return res.status(400).json({ success: false, message: "This mooring has been claimed by another person" })
            }

            // Third check if the owner id is correct and exists
            const updateOwner = await repository.updateOwnerById(id, mooring_number);
            if (!updateOwner) {
                return res.status(404).json({ success: false, message: "No owner found" })
            }

            // Fouth update the moorings to add the ownership status
            const updateMooring = await repository.updateMooringOwnership(mooring._id, id);
            if (!updateMooring) {
                return res.status(400).json({ success: false, message: "Unable to update mooring" })
            }

            // Checks that the update happened
            if (updateOwner.modifiedCount === 0) {
                return res.status(400).json({ success: false, message: "Unable to update owner" });
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
