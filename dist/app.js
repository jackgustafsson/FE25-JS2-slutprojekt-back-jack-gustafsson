"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const memberRoutes_1 = require("./routes/memberRoutes");
const assignmentRoutes_1 = require("./routes/assignmentRoutes");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
exports.app.use("/members", memberRoutes_1.memberRouter);
exports.app.use("/assignments", assignmentRoutes_1.assignmentRouter);
exports.app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
exports.app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Server error" });
});
