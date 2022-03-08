import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        auth0: {
            type: String,
        },
        name: {
            type: String,
        },
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

export default mongoose.models.User ||
    mongoose.model("User", UserSchema);
