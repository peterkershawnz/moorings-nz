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
            const isOwner = await repository.checkOwnerExists({ auth0: 'auth0pass3' });
            if (isOwner) {
                return res.status(400).json({ message: "A user account already exists" })
            }

            // Second check that the mooring exists and no one else has claimed it.
            const mooringExists = await repository.checkMooringExists(mooring_number);
            if (mooringExists.length === 0) {
                return res.status(404).json({ Umessage: "Unable to locate a mooring with those details." })
            }

            const mooringClaimed = await repository.checkMooringIsAvailable(mooring_number);
            if (mooringClaimed) {
                return res.status(404).json({ message: "This mooring has been claimed already" })
            }

            // Third create the new owner and add in the mooring number
            const createOwner = await repository.createOwner({ mooring_number, auth0: 'auth0pass3' });
            res.status(201).json({ success: true, data: createOwner });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

});



