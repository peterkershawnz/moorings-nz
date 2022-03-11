import dbConnect from "../../../lib/dbConnect";
import repository from "../repository";
import Joi from "joi";
import validate from "../../../lib/middlewares/validation";

const schema = Joi.object({
  lat: Joi.string(),
  lng: Joi.string(),
  from: Joi.date().min('now'),
  to: Joi.date().greater(Joi.ref('from')),
});

export default validate({ query: schema }, async function handler(req, res) {
  const {
    method,
    query: { lat = 174.199461, lng = -35.226427, from, to },
  } = req;

  await dbConnect();

  if (method === "GET") {

    if (from && to) {
      try {
        const moorings = await repository.getMooringsByLocationAndDates(lat, lng, from, to);
        res.status(200).json({ success: true, data: moorings });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }

    try {
      const moorings = await repository.getMooringsByLocation(lat, lng);
      res.status(200).json({ success: true, data: moorings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});
