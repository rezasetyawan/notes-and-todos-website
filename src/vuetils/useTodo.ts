import { supabase } from "../lib/supabase";
import type { AddTodo, GetTodo, UpdateTodo } from "../../global/types";
import { getTodoItems } from "./useTodoItem";

const addTodo = async (todo: AddTodo) => {
    try {
        const { data, error } = await supabase.from('todos').insert([todo]).select('id')

        if (error) {
            console.error(error.message)
            throw new Error(error.message)
        }
        return data
    } catch (error: any) {
        console.error(error)
        throw new Error(error)
    }
}

// const getTodos = async (): Promise<GetTodo[]> => {
//     try {
//         const { data: todos, error } = await supabase.from('todos').select('id, title, updated_at')

//         if (error) {
//             console.error(error.message)
//             throw new Error(error.message)
//         }
//         if (todos && todos.length) {
//             return todos
//         } else {
//             return []
//         }
//     } catch (error: any) {
//         console.log(error)
//         throw new Error(error)
//     }
// }

const getTodos = async (author: string | null): Promise<GetTodo[]> => {
    try {
        const { data: todos, error } = await supabase.from('todos').select('id, title, updated_at').eq('author', author);

        if (error) {
            console.error(error.message);
            throw new Error(error.message);
        }

        if (todos && todos.length) {
            // Get an array of promises for todo items of each todo
            const todoItemPromises = todos.map(todo => getTodoItems(todo.id));

            // Wait for all promises to resolve using Promise.all()
            const todoItemsArray = await Promise.all(todoItemPromises);

            // Combine todos and todoItems into a single result array
            const todosWithItems: GetTodo[] = todos.map((todo, index) => ({
                ...todo,
                todo_items: todoItemsArray[index]
            }));

            return todosWithItems;
        } else {
            return [];
        }
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}


const getTodoById = async (todoId: string): Promise<GetTodo | null> => {
    try {
        const { data: todos, error } = await supabase.from('todos').select('id, title, updated_at').eq('id', todoId)

        if (error) {
            console.error(error.message)
            throw new Error(error.message)
        }

        if (todos && todos.length) {
            const todoItem = await getTodoItems(todos[0].id)


            const todoWIthItems = {
                ...todos[0],
                todo_items: [...todoItem]
            }
            return todoWIthItems
        } else {
            return null
        }
    } catch (error: any) {
        console.log(error)
        throw new Error(error)
    }
}

const updateTodoById = async (todoId: string, todo: UpdateTodo) => {
    try {
        const { data, error } = await supabase.from('todos').update(todo).eq('id', todoId)

        if (error) {
            console.error(error.message)
            throw new Error(error.message)
        }
        return data
    } catch (error: any) {
        console.log(error)
        throw new Error(error)
    }
}

const deleteTodoById = async (todoId: string) => {
    try {
        const { error } = await supabase.from('todos').delete().eq('id', todoId)

        if (error) {
            console.error(error.message);
            throw new Error(error.message);
        }
        return
    } catch (error: any) {
        console.error(error)
        throw new Error(error);
    }
}

export { addTodo, getTodos, getTodoById, updateTodoById, deleteTodoById }