import Mooring from "../../../models/Mooring";


const getMooringsByLocation = async ({ from, to, user_id, created_date, mooring }) => {


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