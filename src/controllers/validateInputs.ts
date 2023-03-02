import { NextFunction, Request, Response } from "express"

type InputValues = {
    country: string
}

export default function validateInputs (req: Request, res: Response, next: NextFunction){
    const { country }: InputValues = req.body
    if(!country) return res.send({ status: false, message: "Country shouldn't be empty!" });
    next();
}