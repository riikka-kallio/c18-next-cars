import { useContext } from "react";
import Layout from "@/components/layout";
import CarForm from "@/components/forms/car_form";

import { CarsContext } from "@/components/contexts/car.context";

const Cars = () => {
  const { addCar } = useContext(CarsContext);
  return (
    <Layout>
      <h1>Add a Car</h1>
      <CarForm addCar={addCar} />
    </Layout>
  );
};

export default Cars;
