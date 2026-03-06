"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const fileoperations_1 = require("../fileoperations");
const memberRouter = (0, express_1.Router)();
exports.memberRouter = memberRouter;
const memberValidations = [
    (0, express_validator_1.body)("name").exists().isString().withMessage("Name must be a string"),
    (0, express_validator_1.body)("category").exists().isIn(["ux", "dev frontend", "dev backend"]).withMessage("Invalid category")
];
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        console.error(errorMessages);
        return res.status(400).json({ message: errorMessages });
    }
    next();
};
memberRouter.get("/", async (req, res, next) => {
    try {
        const data = await (0, fileoperations_1.readMembers)();
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
memberRouter.post("/", memberValidations, validate, async (req, res, next) => {
    try {
        const newMember = await (0, fileoperations_1.addMember)(req.body);
        res.json(newMember);
    }
    catch (error) {
        next(error);
    }
});
