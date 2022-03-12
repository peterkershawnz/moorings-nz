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
            const checkOwnerExists = await repository.getOwnerByAuth0({ auth0: 'auth0pass' });
            if (checkOwnerExists) {
                return res.status(400).json({ success: false, message: "owner already exists" })
            }

            const checkMooring = await repository.getMooringByNumber(mooring_number);
            if (!checkMooring) {
                return res.status(404).json({ success: false, message: "No mooring located" });
            }

            if (checkMooring.mooring_owners.length > 0) {
                return res.status(400).json({ success: false, message: "This mooring has already been claimed, please contact us if this is incorrect" })
            }

            const createOwner = await repository.createOwner({ mooring_number, auth0: 'auth0pass' });
            res.status(201).json({ success: true, data: createOwner });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

});



