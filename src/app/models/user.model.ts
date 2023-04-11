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
            region_id: string
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
            cover_url: string,
            region_id: string
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
            cover_url: string,
            region_id: number
    }
}
export interface Addresses{
    id: number,
    user_id: number,
    title: string,
    address_type: string,
    city: string,
    street: string,
    building: string,
    is_primary: number
}
export interface APIResponse<T>{
    data: Array<T>;
}
export interface Address{
    data: {
        address_type: string,
        building: string,
        city: string,
        id: number,
        is_primary: number,
        street: string,
        title: string,
        user_id: number
    }
}
export interface Purchases{
    id: number,
    name: string,
    desc: string,
    owner_id: number,
    created_since: string,
    default_image: string,
    ownership_image_url: string,
    category_slug: string,
    owner: {
        id: number,
        name: string,
        image: string,
        image_url: string,
        cover_url: string
    },
    properties: Array<Product_Properties>,
    price: string,
    owner_area: string

}
interface Product_Properties{
    id: number,
    parent_id: null,
    category_id: number,
    name_ar: string,
    name_en: string,
    type: string,
    required: number,
    slug_name: string,
    sort: number,
    active: number,
    has_filters: boolean,
    filter_options: Array<filter_options_new>,
    filter_value: {
        id: number,
        filter_id: number,
        product_id: number,
        filter_value: string
    }
}
interface filter_options_new{
    id: number,
    filter_id: number,
    name: string,
    sort: number,
    logo: string,
    image: string,
    sub_filter: []
}
export interface APIResponse2<T>{
    data: Array<T>;
}
export interface Pages{
    id: number,
    title: string,
    desc: string,
    slug: string,
}
export interface APIResponse4<T>{
    data: Array<T>;
}
export interface Verify{
    data: string;
}