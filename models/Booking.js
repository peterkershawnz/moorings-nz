import mongoose from "mongoose";

const BookingSchema = mongoose.Schema(
  {
    from: {
      type: Date,
    },
    to: {
      type: Date,
    },
    user_id: {
      type: String,
    },
    created_date: {
      type: Date,
    },
    mooring: {
      id: {
        type: String,
      },
      number: {
        type: String,
      },
      owner_id: {
        type: String,
      },
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

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
