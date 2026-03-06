export type Category = "ux" | "dev frontend" | "dev backend";
export type Status = "new" | "doing" | "done";

export interface Assignment {
    id: `${string}-${string}-${string}-${string}-${string}`,
    title: string,
    description: string,
    category: Category,
    status: Status,
    assignedTo?: string,
    timestamp: string
}

export type NewAssignment = Omit<Assignment, "id" | "status" | "assignedTo" | "timestamp">;

export interface Member {
    id: `${string}-${string}-${string}-${string}-${string}`,
    name: string,
    category: Category
}

export type NewMember = Omit<Member, "id">;

export interface Database {
    assignments: Assignment[];
    members: Member[];
}