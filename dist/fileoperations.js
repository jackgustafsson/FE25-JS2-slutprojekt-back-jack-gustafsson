"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAssignment = exports.updateStatus = exports.updateAssignTo = exports.addAssignment = exports.readAssignments = exports.addMember = exports.readMembers = exports.writeDatabase = exports.readDatabase = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const crypto_1 = __importDefault(require("crypto"));
const DB_PATH = './public/database.json';
const readDatabase = async () => {
    try {
        const jsonData = await promises_1.default.readFile(DB_PATH, 'utf-8');
        const data = await JSON.parse(jsonData);
        return data;
    }
    catch (error) {
        throw error;
    }
};
exports.readDatabase = readDatabase;
const writeDatabase = async (data) => {
    try {
        await promises_1.default.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    }
    catch (error) {
        throw error;
    }
};
exports.writeDatabase = writeDatabase;
const readMembers = async () => {
    try {
        const jsonData = await promises_1.default.readFile(DB_PATH, 'utf-8');
        const data = await JSON.parse(jsonData);
        return data.members;
    }
    catch (error) {
        throw error;
    }
};
exports.readMembers = readMembers;
const addMember = async (member) => {
    const db = await (0, exports.readDatabase)();
    const newMember = { id: crypto_1.default.randomUUID(), ...member };
    db.members.push(newMember);
    try {
        await (0, exports.writeDatabase)(db);
        return newMember;
    }
    catch (error) {
        throw error;
    }
};
exports.addMember = addMember;
const readAssignments = async () => {
    try {
        const jsonData = await promises_1.default.readFile(DB_PATH, 'utf-8');
        const data = await JSON.parse(jsonData);
        return data.assignments;
    }
    catch (error) {
        throw error;
    }
};
exports.readAssignments = readAssignments;
const addAssignment = async (assignment) => {
    const db = await (0, exports.readDatabase)();
    const date = new Date().toISOString();
    const newAssignment = { id: crypto_1.default.randomUUID(), ...assignment, status: "new", assignedTo: undefined, timestamp: date };
    db.assignments.push(newAssignment);
    try {
        await (0, exports.writeDatabase)(db);
        return newAssignment;
    }
    catch (error) {
        throw error;
    }
};
exports.addAssignment = addAssignment;
const updateAssignTo = async (id, assignedTo) => {
    try {
        const db = await (0, exports.readDatabase)();
        const assignment = db.assignments.find(a => a.id === id);
        if (!assignment)
            return { error: "ASSIGNMENT_NOT_FOUND" };
        const member = db.members.find(m => m.id === assignedTo);
        if (!member)
            return { error: "MEMBER_NOT_FOUND" };
        if (assignment.category !== member.category)
            return { error: "CATEGORY_MISMATCH" };
        assignment.assignedTo = assignedTo;
        assignment.status = "doing";
        await (0, exports.writeDatabase)(db);
        return assignment;
    }
    catch (error) {
        throw error;
    }
};
exports.updateAssignTo = updateAssignTo;
const updateStatus = async (id) => {
    try {
        const db = await (0, exports.readDatabase)();
        const assignment = db.assignments.find(a => a.id === id);
        if (!assignment)
            return { error: "ASSIGNMENT_NOT_FOUND" };
        if (assignment.status !== "doing")
            return { error: "INVALID_STATUS" };
        assignment.status = "done";
        await (0, exports.writeDatabase)(db);
        return assignment;
    }
    catch (error) {
        throw error;
    }
};
exports.updateStatus = updateStatus;
const deleteAssignment = async (id) => {
    try {
        const db = await (0, exports.readDatabase)();
        const index = db.assignments.findIndex(a => a.id === id);
        if (index === -1)
            return { error: "ASSIGNMENT_NOT_FOUND" };
        const assignment = db.assignments[index];
        if (assignment.status !== "done")
            return { error: "INVALID_STATUS" };
        const [deletedAssignment] = db.assignments.splice(index, 1);
        await (0, exports.writeDatabase)(db);
        return deletedAssignment;
    }
    catch (error) {
        throw error;
    }
};
exports.deleteAssignment = deleteAssignment;
