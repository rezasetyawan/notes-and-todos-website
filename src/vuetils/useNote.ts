import { supabase } from "../lib/supabase";
import { AddNote, UpdateNote, GetNote } from "../../global/types";

const addNote = async (note: AddNote) => {
    try {
        const { data, error } = await supabase.from('notes').insert([note]).select()
        if (error) {
            console.error(error.message);
            throw new Error(error.message);
        }
        return data
    } catch (error: any) {
        console.error(error)
        throw new Error(error);
    }
}

const getNotes = async (): Promise<GetNote[]> => {
    try {
        const { data: notes, error } = await supabase.from('notes').select('id, title, text, updated_at')
        if (error) {
            console.error(error.message);
            throw new Error(error.message);
        }
        if (notes && notes.length > 0) {
            return notes as GetNote[]
        } else {
            return []
        }
    } catch (error: any) {
        throw new Error(error)
    }
}

const getNoteById = async (noteId: string): Promise<GetNote | null> => {
    try {
        const { data: notes, error } = await supabase
            .from('notes')
            .select('id, title, text, updated_at')
            .eq('id', noteId);

        if (error) {
            console.error(error.message);
            throw new Error(error.message);
        }

        if (notes && notes.length > 0) {
            return notes[0];
        } else {
            return null;
        }
    } catch (error: any) {
        console.error(error)
        throw new Error(error);
    }
};

const updateNoteById = async (note: UpdateNote, noteId: string) => {
    try {
        const { data, error } = await supabase.from('notes').update(note).eq('id', noteId)
        if (error) {
            console.error(error.message)
        }
        return data
    } catch (error: any) {
        console.error(error)
        throw new Error(error);
    }
}

const deleteNoteById = async (noteId: string) => {
    try {
        const { error } = await supabase.from('notes').delete().eq('id', noteId)
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

export { addNote, getNotes, getNoteById, updateNoteById, deleteNoteById }