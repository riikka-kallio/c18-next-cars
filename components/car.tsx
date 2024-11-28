import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import type Car from "@/types/Car";

type CarProps = {
  car: Car;
};

import { CarsContext } from "@/components/contexts/car.context";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const CarItem = ({ car: { _id, name, bhp, avatar_url } }: CarProps) => {
  const { deleteCar } = useContext(CarsContext);
  const router = useRouter();
  return (
    <>
      {/* <img src={avatar_url} alt="" width="200" /> */}
      <Image
        alt=""
        src={avatar_url!}
        width={200}
        height={200}
        // layout="responsive"
      />

      <Box component="dl">
        <Box sx={{ display: "flex" }}>
          <Box component="dt">Name</Box>
          <Box component="dd">{name}</Box>
        </Box>

        <Box sx={{ display: "flex" }}>
          <Box component="dt">BHP</Box>
          <Box component="dd">{bhp}</Box>
        </Box>
      </Box>
      {/* <Link href={`/${_id}`}>View Car</Link> */}
      <Link href={`/update/${_id}`}>Update</Link>

      <Button
        onClick={async () => {
          await deleteCar(_id);
          router.push("/");
        }}
      >
        delete
      </Button>
    </>
  );
};

export default CarItem;
