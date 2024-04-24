export interface SplashScreen{
    data: {
        ads: Array<Adds>,
        categories: Array<Category>,
        products: APIResponse<Products>
    }
}
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
        category_id: number,
        negotiable: number,
        price: number,
        activated_at: string,
        product_fav: boolean,
        properties: Array<Product_Properties>,
        activated_since: string,
        category_slug: string,    
        region_name: string,
        status: string,
        product_favorite_count: number,
        pinned: number
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
export interface APIResponse<T>{
    data: Array<T>,
    links: {
        self: string,
        first: string,
        last: string,
        prev: string,
        next: string
    },
    meta: {
        current_page: number,
        from: number,
        last_page: number,
        links: [
            {
                url: string,
                label: string,
                active: boolean
            }
        ],
        path: string,
        per_page: number,
        to: number,
        total: number
    }
}
export interface Product{
    data: {
        id: number,
        name: string,
        desc: string,
        materials: string,
        about_seller: string,
        delivery_notes: string,
        admin_details:{
            cover_url: string,
            id: number,
            image: string,
            image_url: string,
            name: string,
            phone: string
        }
        owner_id: number,
        category_id: number,
        seller_phone: string,
        price: string,
        status: string,
        active: string,
        created_since: string,
        default_image: string,
        ownership_image_url: string,
        owner: {
            id: number,
            name: string,
            subscribed: number,
            image_url: string,
            cover_url: string,
            phone: string
        },
        product_images: Array<productImages>,
        owner_ratings: Array<ownerRatings>,
        negotiable: number,
        order_code: string,
        properties: Array<Product_Properties>,
        region_name: string,
        region_id: number,
        category_slug: string,
        product_fav: boolean,
        product_favorite_count: number
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
    slug: string,
    image: ''
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
        region_id: number,
        delivery_notes: string,
        owner_id: number,
        category_id: number,
        seller_phone: number,
        price: number,
        negotiable: number,
        status: string,
        active: number,
        sold_to: null,
        created_since: string,
        activated_since: number,
        region_name: string,
        default_image: string,
        category_slug: string,
        owner_area: string,
        ownership_image_url: string,
        product_images: [
            {
                id: number,
                product_id: number,
                image_key: string,
                image: string,
                image_url: string
            }
        ],
        properties: Array<Product_Properties>
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
export interface Category_Filter{
    data: {
        filters: {
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
            filter_options: [
                {
                    id: number,
                    filter_id: number,
                    name: string,
                    sort: number,
                    logo: string,
                    image: string,
                    sub_filter: []
                }
            ]
        }
    }
}