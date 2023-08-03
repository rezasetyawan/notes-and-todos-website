import { Session } from "@supabase/supabase-js";
import { User } from "../../global/types";
import { supabase } from "../lib/supabase";

// const userSession = ref<Session | null>(null)

const getUserSession =  async ():Promise<Session | null> => {
    try {
        const {data, error} = await supabase.auth.getSession()
        if (error) {
            console.error(error.message);
            throw new Error(error.message);
        }
        return data.session
    } catch (error: any) {
        console.error(error)
        throw new Error(error);
    }
}

const signUpUser = async ({ email, password }: User) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })
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

const signInUser = async ({ email, password }: User) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
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

const signOutUser = async () => {
    try {
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error(error.message);
            throw new Error(error.message);
        }

    } catch (error: any) {
        console.error(error)
        throw new Error(error);
    }
}

export { getUserSession, signUpUser, signInUser, signOutUser }