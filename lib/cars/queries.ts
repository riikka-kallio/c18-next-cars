import type { CarData, CarUpdateData } from "@/components/forms/car_form";
import "@/lib/db";
import CarModel from "@/lib/server/models/car.model";

export const getCarsQuery = async () => {
  return await CarModel.find({}).exec();
};

export const getCarQuery = async (id: string) => {
  return await CarModel.findById(id);
};

export const addCarQuery = async (data: CarData) => {
  const car = new CarModel(data);
  const newCar = await car.save();
  return newCar;
};

export const updateCarQuery = async (id: string, data: CarUpdateData) => {
  return await CarModel.updateOne({ _id: id }, data);
};

export const removeCarQuery = async (id: string) => {
  return await CarModel.deleteOne({ _id: id });
};
