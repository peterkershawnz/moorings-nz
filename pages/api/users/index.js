import dbConnect from "../../../lib/dbConnect";
import repository from "../repository";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import Joi from "joi";
import validate from "../../../lib/middlewares/validation";

const schema = Joi.object({
    name: Joi.string().required()
});

export default (validate({ body: schema }, async function handler(req, res) {
    const {
        method,
    } = req;
    // const { user } = getSession(req, res);

    await dbConnect();

    if (method === "POST") {

        try {
            const createUser = await repository.createUser({ ...req.body, auth0: "test" });
            res.status(201).json({ success: true, data: createUser });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}));



