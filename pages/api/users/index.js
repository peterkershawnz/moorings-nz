import dbConnect from "../../../lib/dbConnect";
import repository from "../repository";
import Joi from "joi";
import validate from "../../../lib/middlewares/validation";

const schema = Joi.object({
    auth0: Joi.string().required(),
    name: Joi.string().required()
});
// validate aut0 id is correct
export default validate({ body: schema }, async function handler(req, res) {
    const {
        method,
    } = req;

    await dbConnect();

    if (method === "POST") {
        try {
            const user = await repository.createUser(req.body);
            res.status(201).json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
});



