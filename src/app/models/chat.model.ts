export interface Support{
    data: {
        id: number,
        name: string,
        image: string,
        image_url: string,
        cover_url: string,
        support_messages: [{
            id: number,
            user_id: number,
            message: string,
            status: string
        }]
    }
}
export interface MessagesList{
    avatar: string
    last_message_date: string,
    message: string,
    userid: number,
    username: string
}
// export interface APIResponse6<T>{
// }
export interface Messages{
            id: number,
            sender: {
                id: number,
                name: string,
                image_url: string,
                cover_url: string
            },
            receiver: {
                id: number,
                name: string,
                image_url: string,
                cover_url: string
            },
            message: string,
            seen_at: number,
            created_at: string,
            updated_at: string
}
export interface APIResponse7<T>{
    data: Array<T>
}