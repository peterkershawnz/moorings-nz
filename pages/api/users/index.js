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
            // First check that the user hasn't already created a account based on auth0
            const checkUserExists = await repository.checkUserExists({ auth0: 'auth0pass' });
            if (checkUserExists.length > 0) {
                return res.status(400).json({ message: "User account already exists" })
            }
            // Second create the account
            const createUser = await repository.createUser({ ...req.body, auth0: "auth0pass" });
            res.status(201).json({ success: true, data: createUser });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}));



