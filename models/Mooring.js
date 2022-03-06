import mongoose from "mongoose";

const MooringSchema = mongoose.Schema(
  {
    number: {
      type: String,
    },
    properties: {
      number: {
        type: String,
      },
      max_vessel_length: {
        type: Number,
      },
      lower_water_depth: {
        type: Number,
      },
      type_of: {
        type: String,
      },
      last_inspection_date: {
        type: Date,
      },
      block_weight: {
        type: Number,
      },
      owner_id: {
        type: String,
      },
      price: {
        type: Number,
      },
      available: {
        type: Boolean,
      },
      location: {
        name: {
          type: String,
        },
        bay: {
          type: String,
        },
        island: {
          type: String,
        },
        region: {
          type: String,
        },
      },
      owner: {
        id: {
          type: String,
        },
        mooring_verified: {
          type: String,
        },
      },
    },
    geometry: {
      type: {
        default: "Point",
        type: String,
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
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

export default mongoose.models.Mooring ||
  mongoose.model("Mooring", MooringSchema);

// export default mongoose.model("Mooring", MooringSchema);
