import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { addMember, readMembers } from '../fileoperations';

const memberRouter = Router();

const memberValidations = [
    body("name").exists().isString().withMessage("Name must be a string"),
    body("category").exists().isIn(["ux", "dev frontend", "dev backend"]).withMessage("Invalid category")
];

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        console.error(errorMessages);
        return res.status(400).json({ message: errorMessages });
    }
    next();
};

memberRouter.get("/", async (req, res, next) => {
    try {
        const data = await readMembers();
        res.json(data);
    }
    catch (error) {
        next(error);
    }
})

memberRouter.post("/", memberValidations, validate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newMember = await addMember(req.body);
        res.json(newMember);
    }
    catch (error) {
        next(error);
    }
})

export { memberRouter }