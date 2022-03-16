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

const updateMooringOwnership = async (mooring_id, owners_id) => {
    try {
        const mooring = await Mooring.findByIdAndUpdate(mooring_id, { 'properties.owner.id': owners_id });
        return mooring;
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

const checkUserExists = async ({ auth0 }) => {
    try {
        const user = await User.find({ auth0: auth0 });
        return user;
    } catch (error) {
        throw new Error(error)
    }
}

const createUser = async (userData) => {
    try {
        const user = await User.create({ ...userData, created_date: new Date() });
        return user;
    } catch (error) {
        throw new Error(error)
    }
}

const getUserById = async (id) => {

    const pipeline = [
        {
            '$match': {
                '_id': ObjectId(id)
            }
        },
        {
            '$lookup': {
                'from': 'bookings',
                'localField': 'auth0',
                'foreignField': 'auth0',
                'as': 'user_bookings'
            }
        }, {
            '$project': {
                'auth0': 1,
                'name': 1,
                'created_date': 1,
                'user_bookings': {
                    '$filter': {
                        'input': '$user_bookings',
                        'as': 'bookings',
                        'cond': {
                            '$gt': [
                                '$$bookings.from', new Date()
                            ]
                        }
                    }
                }
            }
        }
    ];
    try {
        const user = await User.aggregate(pipeline);
        return user;
    } catch (error) {
        throw new Error(error)
    }
}

const deleteUserById = async (id) => {
    try {
        const deleteUser = await User.deleteOne({ '_id': ObjectId(id) });
        return deleteUser;
    } catch (error) {
        throw new Error(error)
    }
}

const checkMooringIsAvailable = async (mooring_number) => {
    const pipeline = [
        {
            '$unwind': {
                'path': '$mooring_number',
                'includeArrayIndex': 'mooring',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$match': {
                'mooring_number': mooring_number
            }
        }
    ];
    try {
        const checkMooringAvailable = await Owner.aggregate(pipeline);
        return checkMooringAvailable
    } catch (error) {
        throw new Error(error)
    }

}

const checkMooringOwnershipById = async (id, mooring_number) => {
    const pipeline = [
        {
            '$match': {
                'properties.number': mooring_number
            }
        }, {
            '$project': {
                'mooringExists': {
                    '$cond': {
                        'if': {
                            '$eq': [
                                '$properties.number', mooring_number
                            ]
                        },
                        'then': true,
                        'else': false
                    }
                },
                'hasBeenClaimed': {
                    '$cond': { 'if': { '$eq': ['$properties.owner.id', null] }, 'then': false, 'else': true }
                },
                'belongsToOwner': {
                    '$cond': {
                        'if': {
                            '$eq': [
                                '$properties.owner.id', id
                            ]
                        },
                        'then': true,
                        'else': false
                    }
                }
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

const checkMooringOwnership = async (mooring_number) => {
    const pipeline = [
        {
            '$match': {
                'properties.number': mooring_number
            }
        }, {
            '$project': {
                'mooringExists': {
                    '$cond': {
                        'if': {
                            '$eq': [
                                '$properties.number', mooring_number
                            ]
                        },
                        'then': true,
                        'else': false
                    }
                },
                'hasBeenClaimed': {
                    '$cond': { 'if': { '$eq': ['$properties.owner.id', null] }, 'then': false, 'else': true }
                }
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
const checkOwnerExists = async ({ auth0 }) => {
    // need to update with auth0
    const pipeline = [
        {
            '$match': {
                'auth0': auth0
            }
        }
    ];

    try {
        const checkOwnerExists = await Owner.aggregate(pipeline);
        return checkOwnerExists[0]
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
        }, {
            '$lookup': {
                'from': 'bookings',
                'localField': 'mooring_number',
                'foreignField': 'mooring.number',
                'as': 'mooring_bookings'
            }
        }, {
            '$project': {
                'auth0': 1,
                'created_date': 1,
                'mooring_number': 1,
                'owner_moorings': 1,
                'mooring_bookings': {
                    '$filter': {
                        'input': '$mooring_bookings',
                        'as': 'moorings',
                        'cond': {
                            '$gt': [
                                '$$moorings.from', new Date('Tue, 15 Mar 2022 02:19:06 GMT')
                            ]
                        }
                    }
                }
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
    console.log(id)
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
    updateMooringOwnership,
    createBooking,
    checkUserExists,
    createUser,
    getUserById,
    deleteUserById,
    createOwner,
    getOwnerById,
    checkOwnerExists,
    getOwnerByAuth0,
    updateOwnerById,
    deleteOwnerById,
    checkMooringIsAvailable,
    checkMooringOwnership,
    checkMooringOwnershipById
}