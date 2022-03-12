import Mooring from "../../models/Mooring";
import Booking from "../../models/Booking";
import User from "../../models/User";
import Owner from "../../models/Owner";
import { ObjectId } from 'mongodb'

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

const getMooringByNumber = async (number) => {
    const pipeline = [
        {
            '$match': {
                'properties.number': number
            }
        }, {
            '$lookup': {
                'from': 'owners',
                'localField': 'properties.number',
                'foreignField': 'mooring_number',
                'as': 'mooring_owners'
            }
        }
    ];

    try {
        const mooring = await Mooring.aggregate(pipeline);
        return mooring[0];
    } catch (error) {
        throw new Error(error)
    }
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

const createOwner = async ({ mooring_number, auth0 }) => {
    try {
        const owner = await Owner.create({ mooring_number, auth0, created_date: new Date() });
        return owner;
    } catch (error) {
        throw new Error(error)
    }
}

const getOwnerById = async (id) => {
    const pipeline = [
        {
            '$match': {
                '_id': ObjectId(id)
            }
        }, {
            '$lookup': {
                'from': 'moorings',
                'localField': 'mooring_number',
                'foreignField': 'properties.number',
                'as': 'owner_moorings'
            }
        }
    ];
    try {
        const owner = await Owner.aggregate(pipeline);
        return owner;
    } catch (error) {
        throw new Error(error)
    }
}

const getOwnerByAuth0 = async ({ auth0 }) => {
    try {
        const owner = await Owner.findOne({ 'auth0': auth0 });
        return owner;
    } catch (error) {
        throw new Error(error)
    }
}

const updateOwnerById = async (id, mooring_number) => {
    try {
        const owner = await Owner.updateOne({ _id: ObjectId(id) }, { '$push': { 'mooring_number': mooring_number } });
        return owner;
    } catch (error) {
        throw new Error(error)
    }
}

const deleteOwnerById = async (id) => {
    try {
        const deleteOwner = await Owner.deleteOne({ '_id': ObjectId(id) });
        return deleteOwner;
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    getMooringsByLocation,
    getMooringsByLocationAndDates,
    getMooringByNumber,
    createBooking,
    createUser,
    createOwner,
    getOwnerById,
    getOwnerByAuth0,
    updateOwnerById,
    deleteOwnerById
}