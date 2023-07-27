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

export type { AddNote, UpdateNote, GetNote }