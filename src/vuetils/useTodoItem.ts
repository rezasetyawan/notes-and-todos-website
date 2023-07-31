import { supabase } from "../lib/supabase";
import { AddTodoItem, GetTodoItem, UpdateTodoItem } from "../../global/types";

const addTodoItem = async (todoItems: AddTodoItem[]) => {
    try {
        const { data, error } = await supabase.from('todo_items').insert([...todoItems]).select('id')

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

const getTodoItems = async (todoId: string): Promise<GetTodoItem[]> => {
    try {
        const { data: todoItems, error } = await supabase.from('todo_items').select('id, text, isActive').eq('todo_id', todoId)

        if (error) {
            console.error(error.message)
            throw new Error(error.message)
        }

        if (todoItems.length) {
            return todoItems
        } else {
            return []
        }
    } catch (error: any) {
        console.error(error)
        throw new Error(error)
    }
}

const updateTodoItemById = async (todoItemId: string, todoItem: UpdateTodoItem) => {

    try {
        const { data, error } = await supabase.from('todo_items').update(todoItem).eq('id', todoItemId)
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

const deleteTodoItemById = async (todoItemId: string) => {
    try {
        const { error } = await supabase.from('todo_items').delete().eq('id', todoItemId)
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

export { addTodoItem, getTodoItems, updateTodoItemById, deleteTodoItemById }