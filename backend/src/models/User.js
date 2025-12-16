import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,

    // 🌍 Location-based personalization
    location: {
      country: { type: String, required: true },
      state: { type: String },
      city: { type: String },
    },

    // 🎯 Conference preferences
    interests: [
      {
        type: String,
        enum: [
          "Business and Economics",
          "Education",
          "Health and Medicine",
          "Interdisciplinary",
          "Law",
          "Engineering Topics",
          "Engineering and Technology",
          "Mathematics and Statistics",
          "Social Sciences and Humanities",
          "Regional Studies",
          "Physical and Life Sciences",
          "Sports Science",
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
