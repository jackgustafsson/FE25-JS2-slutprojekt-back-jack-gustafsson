import fs from 'fs/promises';
import crypto from 'crypto';
import { Database, Member, Assignment, NewAssignment, NewMember } from './types';

const DB_PATH = './public/database.json';

export const readDatabase = async (): Promise<Database> => {
    try {
        const jsonData = await fs.readFile(DB_PATH, 'utf-8');
        const data = await JSON.parse(jsonData);
        return data;
    }
    catch (error) {
        throw error;
    }
}

export const writeDatabase = async (data: Database) => {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    }
    catch (error) {
        throw error;
    }
}

export const readMembers = async (): Promise<Member[]> => {
    try {
        const jsonData = await fs.readFile(DB_PATH, 'utf-8');
        const data = await JSON.parse(jsonData);
        return data.members;
    }
    catch (error) {
        throw error;
    }
}

export const addMember = async (member: NewMember): Promise<Member> => {
    const db = await readDatabase();
    const newMember: Member = { id: crypto.randomUUID(), ...member };
    db.members.push(newMember);

    try {
        await writeDatabase(db);
        return newMember;
    }
    catch (error) {
        throw error;
    }
}

export const readAssignments = async (): Promise<Assignment[]> => {
    try {
        const jsonData = await fs.readFile(DB_PATH, 'utf-8');
        const data = await JSON.parse(jsonData);
        return data.assignments;
    }
    catch (error) {
        throw error;
    }
}

export const addAssignment = async (assignment: NewAssignment): Promise<Assignment> => {
    const db = await readDatabase();
    const date = new Date().toISOString();
    const newAssignment: Assignment = { id: crypto.randomUUID(), ...assignment, status: "new", assignedTo: undefined, timestamp: date };
    db.assignments.push(newAssignment);

    try {
        await writeDatabase(db);
        return newAssignment;
    }
    catch (error) {
        throw error;
    }
}

export const updateAssignTo = async (id: string, assignedTo: string) => {
    try {
        const db = await readDatabase();
        const assignment = db.assignments.find(a => a.id === id);
        if (!assignment) return { error: "ASSIGNMENT_NOT_FOUND" };

        const member = db.members.find(m => m.id === assignedTo);
        if (!member) return { error: "MEMBER_NOT_FOUND" };

        if (assignment.category !== member.category) return { error: "CATEGORY_MISMATCH" };

        assignment.assignedTo = assignedTo;
        assignment.status = "doing";

        await writeDatabase(db);
        return assignment;
    }
    catch (error) {
        throw error;
    }
}

export const updateStatus = async (id: string) => {
    try {
        const db = await readDatabase();
        const assignment = db.assignments.find(a => a.id === id);
        if (!assignment) return { error: "ASSIGNMENT_NOT_FOUND" };

        if (assignment.status !== "doing") return { error: "INVALID_STATUS" };

        assignment.status = "done";
        await writeDatabase(db);
        return assignment;
    }
    catch (error) {
        throw error;
    }
}

export const deleteAssignment = async (id: string) => {
    try {
        const db = await readDatabase();

        const index = db.assignments.findIndex(a => a.id === id);
        if (index === -1) return { error: "ASSIGNMENT_NOT_FOUND" };

        const assignment = db.assignments[index];

        if (assignment.status !== "done") return { error: "INVALID_STATUS" };

        const [deletedAssignment] = db.assignments.splice(index, 1);

        await writeDatabase(db);
        return deletedAssignment;

    }
    catch (error) {
        throw error;
    }
}