import { useContext, useEffect } from "react";
import Layout from "@/components/layout";
import Image from "next/image";
// import CarItem from "@/components/car";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import { CarsContext } from "@/components/contexts/car.context";
import Link from "next/link";

import type Car from "@/types/Car";

const Cars = ({ serverData }: { serverData: Array<Car> }) => {
  const { loading, error, cars, fetchCars, deleteCar } =
    useContext(CarsContext);
  console.log("context cars", cars);

  let data = cars;
  // add a bit for SSR (will cause hydration error)
  if (typeof window === "undefined") {
    console.log("SSR cars", serverData);
    data = serverData;
  }

  console.log('final cars', data);

  // Rehydrate on Client-side
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  let component = null;

  if(loading) {
    component = (<Typography>Loading...</Typography>)
  } else if (error) {
    component = (<Typography>{error.message}</Typography>)
  } else if (!Array.isArray(data)) {
    // @ts-ignore
    console.error(`'data' must be an array. Instead received ${data.toJSON ? data.toJSON() : data} of type ${data}`)
    component = (<Typography>Wrong data format. Please check console</Typography>)
  } else if (data.length === 0) {
    component = (<Typography>You have no cars</Typography>)

  } else {
    component = (<List>
      {data.map(({ name, bhp, avatar_url, _id }) => (
        <ListItem key={_id}>
          <ListItemAvatar>
            <Avatar>
            <Image
                alt=""
                src={avatar_url!}
                width={2250}
                height={1390}
                layout="responsive"
            />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            {name} (BHP: {bhp})
          </ListItemText>
          <IconButton
            aria-label="view"
            href={`/${_id}`}
            component={Link}
            passHref
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            aria-label="update"
            href={`/update/${_id}`}
            component={Link}
            passHref
          >
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => deleteCar(_id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>)

  }

  return (
    <Layout>
      <Typography component="h1" variant="h3">List</Typography>
      {component}
    </Layout>
  );
};

export default Cars;

/****************************************************************
 * Static Site Generation
 ****************************************************************/
import { getCarsQuery as getCars } from "@/lib/cars/queries";

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
// export async function getStaticProps() {
//   const cars = await getCars();
//   return {
//     props: {
//       serverData: JSON.parse(JSON.stringify(cars)),
//     },
//   };
// }

export async function getServerSideProps() {
  const cars = await getCars();
  return {
    props: {
      serverData: JSON.parse(JSON.stringify(cars)),
    },
  };
}
