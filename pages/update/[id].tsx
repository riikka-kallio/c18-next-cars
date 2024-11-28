import { useContext } from "react";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
// import { fetchCars } from "@/lib/cars";
import CarForm from "@/components/forms/car_form";
import type Car from "@/types/Car";

import { CarsContext } from "@/components/contexts/car.context";

const UpdateCar = ({ serverData }:{ serverData:Car }) => {
  const router = useRouter();
  const { id } = router.query;
  const { updateCar, cars } = useContext(CarsContext);
  let car = null;
  if (typeof window === "undefined") {
    car = serverData;
  } else {
    car = cars.find(({ _id }) => _id === id);
  }
  console.log("🚀 ~ file: [id].tsx ~ line 23 ~ UpdateCar ~ car", car);
  if (!car) return <p>Error: Car not found!</p>;
  return (
    <Layout>
      <h1>Update Car</h1>
      <CarForm updateCar={updateCar} car={car} />
    </Layout>
  );
};

export default UpdateCar;

/****************************************************************
 * Static Site Generation
 ****************************************************************/
// import { getCarQuery as getCar } from "@/lib/cars/queries";

// This function gets called at build time
// export async function getServerSideProps({ params }:{ params: { id: string } }) {
//   const car = await getCar(params.id);
//   return {
//     props: {
//       serverData: JSON.parse(JSON.stringify(car)),
//     },
//   };
// }
