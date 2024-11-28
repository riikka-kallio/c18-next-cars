import mongoose from "mongoose";
import "@/lib/db";
const { Schema } = mongoose;

export const carSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  bhp: {
    type: Number,
    required: true,
  },
  avatar_url: {
    type: String,
    default: "https://static.thenounproject.com/png/449586-200.png",
  },
});

const Car = mongoose.models.Car || mongoose.model("Car", carSchema);
export default Car;
