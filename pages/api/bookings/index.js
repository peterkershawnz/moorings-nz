import dbConnect from "../../../lib/dbConnect";
import repository from "../repository";
import validateId from '../../../utils/validateId';
import Joi from "joi";
import validate from "../../../lib/middlewares/validation";

const schema = Joi.object({
    from: Joi.date().min('now').required(),
    to: Joi.date().greater(Joi.ref('from')).required(),
    user_id: Joi.string().required(),
    mooring: Joi.object().keys({ id: Joi.string().required(), number: Joi.string().required(), owner_id: Joi.string().required() }).required(),
});

export default validate({ body: schema }, async function handler(req, res) {
    const {
        method,
        body: { user_id, mooring }
    } = req;

    await dbConnect();

    if (method === "POST") {

        if (!validateId(user_id) || !validateId(mooring.id)) {
            return res.status(400).json({ success: false, message: "Bad request" })
        }

        try {
            const booking = await repository.createBooking(req.body);
            res.status(201).json({ success: true, data: booking });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
});



