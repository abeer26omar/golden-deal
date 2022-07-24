export interface Register{
    data: {
        user: {
            name: string,
            gender: string,
            birth_date: string,
            phone: string,
            otp: number,
            id: string,
            image_url: string,
            cover_url: string,
            expiresIn: 60,
        },
        token: string
    }      
}
export interface Login{
    data:{
        user: {
            id: number,
            name: string,
            email: string,
            phone: string,
            image: string,
            cover: string,
            subscribed: number,
            is_admin: number,
            birth_date: string,
            gender: string,
            otp: number,
            fcm_token: null,
            email_verified_at: null,
            image_url: string,
            cover_url: string
        },
        token: string
    }
}
export interface Profile{
    data:{
            id: number,
            name: string,
            email: string,
            phone: string,
            image: string,
            cover: string,
            subscribed: number,
            is_admin: number,
            birth_date: string,
            gender: string,
            otp: number,
            fcm_token: null,
            email_verified_at: null,
            image_url: string,
            cover_url: string
    }
}