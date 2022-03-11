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

            const owner = await repository.createOwner({ mooring_number, auth0: 'test' });
            res.status(201).json({ success: true, data: owner });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

});



