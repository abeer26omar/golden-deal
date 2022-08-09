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
    userid: number,
    username: string,
    avatar: string,
    message: string,
    last_message_date: string
}
export interface APIResponse6<T>{
    data: Array<T>
}