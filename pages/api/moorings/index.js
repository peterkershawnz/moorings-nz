import dbConnect from "../../lib/dbConnect";
import Mooring from "../../models/Mooring";

export default async function handler(req, res) {
  const {
    method,
    query: { lat = 174.199461, lng = -35.226427, date, available },
  } = req;

  await dbConnect();

  if (method === "GET") {

    const pipeline = [
      {
        '$geoNear': {
          'near': {
            'type': 'Point',
            'coordinates': [
              parseFloat(lat), parseFloat(lng)
            ]
          },
          'key': 'geometry.coordinates',
          'maxDistance': 1000,
          'distanceField': 'dist.calculated',
          'includeLocs': 'dist.location'
        }
      }, {
        '$lookup': {
          'from': 'bookings',
          'localField': '_id',
          'foreignField': 'mooring_id',
          'as': 'bookings'
        }
      }, {
        '$limit': 1000
      }
    ];

    try {
      const moorings = await Mooring.aggregate(pipeline);
      res.status(200).json({ success: true, data: moorings });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
