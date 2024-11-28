import type { NextApiRequest, NextApiResponse } from "next";

import { getCars, addCar} from '@/lib/server/controllers/cars.controller'


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getCars(req, res);
    case "POST":
      return addCar(req, res);
    default:
      res.status(400).send(`Method ${req.method} not supported for ${new URL(req.url!).pathname}`);
  }
}
