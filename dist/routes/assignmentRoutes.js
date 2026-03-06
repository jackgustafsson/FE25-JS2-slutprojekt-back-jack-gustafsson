"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignmentRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const fileoperations_1 = require("../fileoperations");
const assignmentRouter = (0, express_1.Router)();
exports.assignmentRouter = assignmentRouter;
const assignmentValidations = [
    (0, express_validator_1.body)("title").exists().isString().withMessage("Title must be a string"),
    (0, express_validator_1.body)("description").exists().isString().withMessage("Description must be a string"),
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
assignmentRouter.get("/", async (req, res, next) => {
    try {
        const data = await (0, fileoperations_1.readAssignments)();
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
assignmentRouter.post("/", assignmentValidations, validate, async (req, res, next) => {
    try {
        const newAssignment = await (0, fileoperations_1.addAssignment)(req.body);
        res.json(newAssignment);
    }
    catch (error) {
        next(error);
    }
});
assignmentRouter.patch("/:id/assign", [(0, express_validator_1.param)("id").isString(), (0, express_validator_1.body)("assignedTo").exists().isString()], validate, async (req, res, next) => {
    try {
        const result = await (0, fileoperations_1.updateAssignTo)(req.params.id, req.body.assignedTo);
        if ("error" in result) {
            switch (result.error) {
                case "ASSIGNMENT_NOT_FOUND":
                    console.error("Assignment not found");
                    return res.status(404).json({ message: "Assignment not found" });
                case "MEMBER_NOT_FOUND":
                    console.error("Member not found");
                    return res.status(404).json({ message: "Member not found" });
                case "CATEGORY_MISMATCH":
                    console.error("Member and assignment category must match");
                    return res.status(404).json({ message: "Member and assignment category must match" });
            }
        }
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
assignmentRouter.patch("/:id/done", [(0, express_validator_1.param)("id").isString()], validate, async (req, res, next) => {
    try {
        const result = await (0, fileoperations_1.updateStatus)(req.params.id);
        if ("error" in result) {
            switch (result.error) {
                case "ASSIGNMENT_NOT_FOUND":
                    console.error("Assignment not found");
                    return res.status(404).json({ message: "Assignment not found" });
                case "INVALID_STATUS":
                    console.error("Only assignments with status 'doing' can be marked as done");
                    return res.status(404).json({ message: "Only assignments with status 'doing' can be marked as done" });
            }
        }
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
assignmentRouter.delete("/:id", [(0, express_validator_1.param)("id").isString()], validate, async (req, res, next) => {
    try {
        const result = await (0, fileoperations_1.deleteAssignment)(req.params.id);
        if ("error" in result) {
            switch (result.error) {
                case "ASSIGNMENT_NOT_FOUND":
                    console.error("Assignment not found");
                    return res.status(404).json({ message: "Assignment not found" });
                case "INVALID_STATUS":
                    console.error("Only assignments with status 'done' can be deleted");
                    return res.status(404).json({ message: "Only assignments with status 'done' can be deleted" });
            }
        }
        res.json({ message: "Deleted successfully", assignment: result });
    }
    catch (error) {
        next(error);
    }
});
