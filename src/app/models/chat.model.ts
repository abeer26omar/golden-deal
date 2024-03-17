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
    chat_code: string
    created_at: string,
    id: number,
    message: string,
    receiver: number,
    receiver_avatar: string,
    receiver_name: string,
    sender: number,
    sender_avatar: string,
    sender_name: string,
    seen_at: number
}
// export interface APIResponse6<T>{
// }
export interface Messages{
    message: string,
    receiver_avatar: string,
    receiver_id: number,
    receiver_name: string,
    seen_at: number
    sender_avatar: string,
    sender_id: number,
    sender_name: string,
    type: number
}
export interface APIResponse7<T>{
    data: Array<T>
}