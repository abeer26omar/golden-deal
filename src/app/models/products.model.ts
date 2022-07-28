export interface Products{
    
        id: number;
        name: string;
        desc: string;
        owner_id: number;
        owner_ratings_count: number;
        created_since: string;
        default_image: string;
        ownership_image_url: string;
        owner: {
            id: number;
            name: string;
            image_url: string;
            cover_url: string;
        };
    
}
export interface APIResponse<T>{
    data: Array<T>;
}
export interface Product{
    data: {
        id: number;
        name: string;
        desc: string;
        materials: string;
        about_seller: string;
        delivery_notes: string;
        owner_id: number;
        category_id: number;
        seller_phone: string;
        price: string;
        status: string;
        active: string;
        created_since: string;
        default_image: string;
        ownership_image_url: string;
        owner: {
            id: number;
            name: string;
            subscribed: number;
            image_url: string;
            cover_url: string;
        };
        product_images: Array<productImages>;
        owner_ratings: Array<ownerRatings>;
        }
}

export interface ownerRatings{
    id: number;
    user_id: number;
    provider_id: number;
    desc: string;
    value: number;
    created_since: string;
    reviewer:{
        cover_url: string;
        id: number;
        image: string;
        image_url: string;
        name: string;
    }
}
interface productImages{
    id: number;
    product_id: number;
    image: string;
    image_url: string;
}
export interface Category{
    id: number,
    title: string,
    slug: string
}
export interface APIResponse2<T>{
    data: Array<T>;
}
export interface Adds{
    id: number,
    title: string,
    link: string,
    image: string,
    active: number,
    created_at: string,
    updated_at: string,
    image_url: string
}
export interface APIResponse3<T>{
    data: Array<T>;
}