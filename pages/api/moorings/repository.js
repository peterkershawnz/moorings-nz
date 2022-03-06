import Mooring from "../../../models/Mooring";


const getMooringsByLocation = async (lat, lng) => {

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
        return moorings;
    } catch (error) {
        throw new Error(error)
    }
}

const getMooringsByLocationAndDates = async (lat, lng, from, to) => {
    // to be completed
    return "lots of moorings";
}

module.exports = {
    getMooringsByLocation,
    getMooringsByLocationAndDates
}