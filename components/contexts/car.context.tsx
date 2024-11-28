import React, { createContext, useState, useCallback } from "react";
import type Car from "@/types/Car";
// import { useToasts } from "react-toast-notifications";
// import cloneDeep from 'lodash.cloneDeep' <-- use if your objects get complex

interface updateFormData {
  name?: string;
  bhp?: number;
  avatar_url?: string;
}

interface addFormData {
  name: string;
  bhp: number;
  avatar_url?: string;
}

interface CarsContextInterface {
  fetchCars: () => void;
  addCar: (formData: addFormData) => Promise<void>;
  updateCar: (id: string, formData: updateFormData) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
  loaded: boolean;
  loading: boolean;
  // isInitialLoad: boolean;
  error: null | Error;
  cars: Car[];
}

const defaultValues: CarsContextInterface = {
  fetchCars: () => [],
  addCar: () => new Promise(() => {}),
  updateCar: () => new Promise(() => {}),
  deleteCar: () => new Promise(() => {}),
  loaded: false,
  loading: false,
  // isInitialLoad: true,
  error: null,
  cars: [],
};

let CARS_ENDPOINT = `/api/v1/cars`;

if (typeof window === 'undefined') {
  CARS_ENDPOINT = process.env.NEXT_PUBLIC_CARS_ENDPOINT!;
} else {
  CARS_ENDPOINT = `${window.location.origin}/api/v1/cars`
}


// https://nextjs-fullstack-rest-demo.vercel.app
export const CarsContext = createContext<CarsContextInterface>(defaultValues);

type CarsProviderProps = {
  children?: React.ReactNode;
  startingData: Car[];
};

export const CarsProvider = ({children, startingData=[]}: CarsProviderProps) => {
  // console.log('rendered provider');
  const [cars, setCars] = useState<Car[]>(Array.isArray(startingData)? startingData : [startingData]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  // const [isInitialLoad, setisInitialLoad] = useState<boolean>(true);
  // const [search, setSearch] = useState("");
  // const { addToast } = useToasts();

  const fetchCars = useCallback(async () => {
    // console.log('loading', loading);
    // console.log('error', error);
    if (loading || loaded || error) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(CARS_ENDPOINT);
      if (response.status !== 200) {
        throw response;
      }
      const data = await response.json();
      // if (typeof window !== "undefined") {
      //   localStorage.setItem("cars", JSON.stringify(data));
      // }
      // console.log('data', data);
      setCars(data);
    } catch (err:any) {
      setError(err.message || err.statusText);
    } finally {
      setLoaded(true);
      setLoading(false);
    }
  }, [error, loaded, loading]);

  const addCar = useCallback(
    async (formData: addFormData) => {
      console.log("about to add", formData);
      try {
        const response = await fetch(CARS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(formData),
        });
        if (response.status !== 201) {
          throw response;
        }
        const savedCar = await response.json();
        console.log("got data", savedCar);
        const newCars = [...cars, savedCar];
        if (typeof window !== "undefined") {
          localStorage.setItem("cars", JSON.stringify(newCars));
        }
        setCars(newCars);
        // addToast(`Saved ${savedCar.name}`, {
        //   appearance: "success",
        // });
      } catch (err) {
        console.log("🚀 ~ file: car.context.tsx ~ line 121 ~ err", err);

        // addToast(`Error ${err.message || err.statusText}`, {
        //   appearance: "error",
        // });
      }
    },
    [cars]
  );

  const updateCar = useCallback(
    async (id: string, formData: updateFormData) => {
      console.log("updating", id, formData);
      let updatedCar = null;
      // Get index
      const index = cars.findIndex((car) => car._id === id);
      console.log("index", index);
      if (index === -1) throw new Error(`Car with index ${id} not found`);
      // Get actual car
      const oldCar:Car = cars[index];
      console.log("oldCar", oldCar);

      // Send the differences, not the whole update
      const updates = {};

      for (const key of Object.keys(oldCar)) {
        if (key === "_id") continue;
        //@ts-ignore
        if (oldCar[key] !== formData[key]) {
          //@ts-ignore
          updates[key] = formData[key];
        }
      }

      try {
        const response = await fetch(`${CARS_ENDPOINT}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(updates),
        });

        if (response.status !== 200) {
          throw response;
        }

        // Merge with formData
        updatedCar = {
          ...oldCar,
          ...formData, // order here is important for the override!!
        };
        console.log("updatedCar", updatedCar);
        // recreate the cars array
        const updatedCars = [
          ...cars.slice(0, index),
          updatedCar,
          ...cars.slice(index + 1),
        ];
        if (typeof window !== "undefined") {
          localStorage.setItem("cars", JSON.stringify(updatedCars));
        }
        // addToast(`Updated ${updatedCar.name}`, {
        //   appearance: "success",
        // });
        setCars(updatedCars);
      } catch (err) {
        console.log("🚀 ~ file: car.context.tsx ~ line 187 ~ err", err);
      }
    },
    [cars]
  );

  const deleteCar = useCallback(
    async (id: string) => {
      let deletedCar = null;
      try {
        const response = await fetch(`${CARS_ENDPOINT}/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        if (response.status !== 204) {
          throw response;
        }
        // Get index
        const index = cars.findIndex((car) => car._id === id);
        deletedCar = cars[index];
        // recreate the cars array without that car
        const updatedCars = [...cars.slice(0, index), ...cars.slice(index + 1)];
        if (typeof window !== "undefined") {
          localStorage.setItem("cars", JSON.stringify(updatedCars));
        }
        setCars(updatedCars);
        console.log(`Deleted ${deletedCar.name}`);
        // addToast(`Deleted ${deletedCar.name}`, {
        //   appearance: "success",
        // });
      } catch (err) {
        console.log("🚀 ~ file: car.context.tsx ~ line 222 ~ err", err);
      }
    },
    [cars]
  );

  return (
    <CarsContext.Provider
      value={{
        cars,
        loading,
        error,
        loaded,
        fetchCars,
        addCar,
        updateCar,
        deleteCar,
      }}
    >
      {children}
    </CarsContext.Provider>
  );
};

// export const useCars = useContext(CarsContext);
