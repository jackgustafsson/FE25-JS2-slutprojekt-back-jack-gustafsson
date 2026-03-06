import { Router, Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { addAssignment, deleteAssignment, readAssignments, updateAssignTo, updateStatus } from '../fileoperations';

const assignmentRouter = Router();

const assignmentValidations = [
    body("title").exists().isString().withMessage("Title must be a string"),
    body("description").exists().isString().withMessage("Description must be a string"),
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

assignmentRouter.get("/", async (req, res, next) => {
    try {
        const data = await readAssignments();
        res.json(data);
    }
    catch (error) {
        next(error);
    }

})

assignmentRouter.post("/", assignmentValidations, validate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newAssignment = await addAssignment(req.body);
        res.json(newAssignment);
    }
    catch (error) {
        next(error);
    }

})

assignmentRouter.patch("/:id/assign", [param("id").isString(), body("assignedTo").exists().isString()], validate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await updateAssignTo(req.params.id as string, req.body.assignedTo);

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

assignmentRouter.patch("/:id/done", [param("id").isString()], validate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await updateStatus(req.params.id as string);

        if ("error" in result) {
            switch (result.error) {
                case "ASSIGNMENT_NOT_FOUND":
                    console.error("Assignment not found");
                    return res.status(404).json({ message: "Assignment not found" })

                case "INVALID_STATUS":
                    console.error("Only assignments with status 'doing' can be marked as done")
                    return res.status(404).json({ message: "Only assignments with status 'doing' can be marked as done" });
            }
        }

        res.json(result);
    }
    catch (error) {
        next(error);
    }
})

assignmentRouter.delete("/:id", [param("id").isString()], validate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await deleteAssignment(req.params.id as string);

        if ("error" in result) {
            switch (result.error) {
                case "ASSIGNMENT_NOT_FOUND":
                    console.error("Assignment not found");
                    return res.status(404).json({ message: "Assignment not found" });

                case "INVALID_STATUS":
                    console.error("Only assignments with status 'done' can be deleted");
                    return res.status(404).json({ message: "Only assignments with status 'done' can be deleted" })
            }
        }

        res.json({ message: "Deleted successfully", assignment: result })
    }
    catch (error) {
        next(error);
    }
})

export { assignmentRouter }