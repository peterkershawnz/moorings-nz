import dbConnect from "../../../lib/dbConnect";
import repository from "./repository";


export default async function handler(req, res) {
  const {
    method,
    query: { lat = 174.199461, lng = -35.226427, from, to },
  } = req;

  await dbConnect();

  if (method === "GET") {

    if (from && !to || !from && to) {
      res.status(400).json({ success: false, message: "Bad request" })
    }

    if (from && to) {
      try {
        const moorings = await repository.getMooringsByLocationAndDates(lat, lng, from, to);
        res.status(200).json({ success: true, data: moorings });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }

    try {
      const moorings = await repository.getMooringsByLocation(location);
      res.status(200).json({ success: true, data: moorings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
