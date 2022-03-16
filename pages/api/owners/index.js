import dbConnect from "../../../lib/dbConnect";
import repository from "../repository";
import Joi from "joi";
import validate from "../../../lib/middlewares/validation";

const schema = Joi.object({
    mooring_number: Joi.string().required(),
});
// validate aut0 id is correct
export default validate({ body: schema }, async function handler(req, res) {
    const {
        method,
        body: { mooring_number }
    } = req;

    await dbConnect();

    if (method === "POST") {
        try {
            // First check if the owner account has already been created_date.
            const isOwner = await repository.checkOwnerExists({ auth0: 'auth0pass8' });
            if (isOwner) {
                return res.status(400).json({ message: "A user account already exists" })
            }

            // Second check that the mooring exists and no one else has claimed it.
            const mooring = await repository.checkMooringOwnership(mooring_number);
            if (!mooring.mooringExists) {
                return res.status(404).json({ success: false, message: "Unable to locate a mooring with those details." })
            }

            if (mooring.hasBeenClaimed) {
                return res.status(400).json({ success: false, message: "This mooring has been claimed by another person" })
            }

            // Third create the new owner and add in the mooring number
            const createOwner = await repository.createOwner({ mooring_number, auth0: 'auth0pass8' });
            if (!createOwner) {
                return res.status(400).json({ message: "Unable to create an account at this time" })
            }

            // Forth update the moorings to add the ownership status
            const updateMooring = await repository.updateMooringOwnership(mooring._id, createOwner._id);
            if (!updateMooring) {
                return res.status(400).json({ success: false, message: "Unable to update" })
            }
            res.status(201).json({ success: true, data: createOwner });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

});



