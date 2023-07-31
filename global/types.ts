interface AddNote {
    id: string,
    title: string,
    text: string,
    created_at: string,
    updated_at: string
}

interface UpdateNote {
    title?: string,
    text: string,
    updated_at: string
}
interface GetNote {
    id: string,
    title?: string;
    text: string;
    updated_at: string;
}


interface TodoData {
    id:string,
    title?:string,
    created_at: string,
    updated_at:string,
    todo_items: AddTodoItem[]
}

interface AddTodo {
    id:string,
    title?:string,
    created_at: string,
    updated_at:string,
}

interface UpdateTodo {
    title?:string,
    updated_at: string
}

interface GetTodo {
    id:string,
    title?:string,
    updated_at:string,
    todo_items: GetTodoItem[]
}

interface AddTodoItem {
    id: string,
    text: string,
    isActive: boolean,
    todo_id:string
}

interface UpdateTodoItem {
    text?: string,
    isActive: boolean
}

interface GetTodoItem {
    id: string,
    text: string,
    isActive: boolean,
    
}

export type { AddNote, UpdateNote, GetNote, TodoData,AddTodo,  UpdateTodo, GetTodo, AddTodoItem, UpdateTodoItem, GetTodoItem}