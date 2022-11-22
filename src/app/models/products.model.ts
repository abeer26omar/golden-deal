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
        admin_details:{
            cover_url: string,
            id: number,
            image: string,
            image_url: string,
            name: string,
            phone: string
        }
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
export interface CategoryFilter{
    data:{
        filters: Array<Filters>,
        price:{
            min: number,
            max: number
        }
    }
}
interface Filters{
    id: number,
    category_id: number,
    name_ar: string,
    name_en: string,
    type: string,
    required: number,
    slug_name: string,
    sort: number,
    active: number,
    has_filters: boolean,
    filter_options: Array<filter_options>
}
interface filter_options{
    id: number,
    filter_id: number,
    name: string,
    sort: number
}
export interface NewProduct{
    data:{
        order_code: number,
        msg: string
    }
}
export interface EditProduct{
    data: {
        id: number,
        parent_id: null,
        name: string,
        desc: string,
        materials: string,
        about_seller: string,
        delivery_notes: string,
        owner_id: number,
        category_id: number,
        seller_phone: number,
        price: number,
        status: string,
        active: number,
        sold_to: null,
        created_since: string,
        default_image: string,
        category_slug: string,
        ownership_image_url: string,
        product_images: [
            {
                id: number,
                product_id: number,
                image_key: string,
                image: string,
                image_url: string
            }
        ]
    }
}
export interface EditProductFilters{
    id: number,
    category_id: number,
    name_ar: string,
    name_en: string,
    type: string,
    required: number,
    slug_name: string,
    sort: number,
    active: number,
    has_filters: boolean,
    filter_options: [
        {
            id: number,
            filter_id: number,
            name: string,
            sort: number
        }
    ],
    filter_value:
        {
            id: number,
            filter_id: number,
            product_id: number,
            filter_value: string
        }
}
export interface APIResponse4<T>{
    data: Array<T>
}
export interface Update{
    data: {
        order_code: number,
        msg: string
    }
}
export interface Search{
        id: number,
        name: string,
        desc: string,
        owner_id: number,
        created_since: string,
        default_image: string,
        category_slug: string,
        ownership_image_url: string,
        owner: {
            id: number,
            name: string,
            image: string,
            image_url: string,
            cover_url: string
        }
}
export interface APIResponse5<T>{
    data: Array<T>;
}
export interface BrandFilter{
    data: {
        id: number,
        category_id: number,
        slug_name: string,
        name_ar: string,
        name_en: string,
        has_filters: boolean,
        filter_options: Array<Brands>
    }
}
interface Brands{
    id: number,
    filter_id: number,
    name: string,
    sort: number
}