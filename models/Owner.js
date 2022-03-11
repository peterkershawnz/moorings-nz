import mongoose from "mongoose";

const OwnerSchema = mongoose.Schema(
    {
        auth0: {
            type: String,
        },
        name: {
            type: String,
        },
        mooring_number: [
            String
        ],
        created_date: {
            type: Date,
        },

    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

export default mongoose.models.Owner ||
    mongoose.model("Owner", OwnerSchema);
