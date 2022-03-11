import Mooring from "../../models/Mooring";
import Booking from "../../models/Booking";
import User from "../../models/User";
import Owner from "../../models/Owner";
const { ObjectID } = require('mongodb');

const getMooringsByLocation = async (lat, lng) => {

    const pipeline = [
        {
            '$geoNear': {
                'near': {
                    'type': 'Point',
                    'coordinates': [
                        parseInt(lat), parseInt(lng)
                    ]
                },
                'key': 'geometry.coordinates',
                'maxDistance': 5000,
                'distanceField': 'dist.calculated',
                'includeLocs': 'dist.location'
            }
        }, {
            '$lookup': {
                'from': 'bookings',
                'localField': 'properties.mooring_number',
                'foreignField': 'mooring.number',
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

const createBooking = async (bookingData) => {
    // to be tested
    try {
        const booking = await Booking.create({ ...bookingData, created_date: new Date() });
        return booking;
    } catch (error) {
        throw new Error(error)
    }
}

const createUser = async (userDate) => {
    // to be tested
    try {
        const user = await User.create({ ...userDate, created_date: new Date() });
        return user;
    } catch (error) {
        throw new Error(error)
    }
}

const createOwner = async (data) => {
    try {
        const owner = await Owner.create({ ...data, created_date: new Date() });
        return owner;
    } catch (error) {
        throw new Error(error)
    }
}

const getOwner = async (id) => {
    const pipeline = [
        {
            '$match': {
                '_id': ObjectID(id)
            }
        }, {
            '$lookup': {
                'from': 'moorings',
                'localField': 'mooring_number',
                'foreignField': 'properties.number',
                'as': 'users_moorings'
            }
        }
    ];
    try {
        const owner = await Owner.aggregate(pipeline);
        // const owner = await Owner.aggregate(pipeline);
        return owner;
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    getMooringsByLocation,
    getMooringsByLocationAndDates,
    createBooking,
    createUser,
    createOwner,
    getOwner
}