import type { NextApiRequest, NextApiResponse } from "next";

import { updateCar, removeCar } from '@/lib/server/controllers/cars.controller'


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
      return updateCar(req, res)
    case "DELETE":
      return removeCar(req, res);
    default:
      res.status(400).send(`Method ${req.method} not supported for ${new URL(req.url!).pathname}`);
  }
}
