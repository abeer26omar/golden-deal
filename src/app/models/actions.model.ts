export interface Subscriptions{
    id: number,
    title: string,
    slug: string,
    desc: string,
    fees: number,
    currency_slug: string,
    currency_name: string,
    number_of_ads: number,
    active: number
}
export interface APIresponse<T>{
    data: Array<T>;
}
export interface Portfolio{
    data: {
        id: number,
        name: string,
        subscribed: number,
        image: string,
        cover: string,
        sum_of_ratings: number,
        ratings_count: number,
        reviews: Array<Reviews>,
        provider_ratings: Array<Reviews>,
        image_url: string,
        cover_url: string,
        products: Array<Products>
    }
}
export interface Products{
    id: number,
    name: string,
    desc: string,
    owner_id: number,
    status: string,
    category_id: number,
    active: number,
    price: number,
    created_since: string,
    activated_since: number,
    default_image: string,
    owner_area: string,
    category_slug: string,
    region_name: string,
    ownership_image_url: string,
    product_fav: boolean,
    negotiable: number,
    properties: Array<Product_Properties>
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
interface Reviews{
    id: number,
    user_id: number,
    provider_id: number,
    desc: string,
    value: number,
    created_since: string
} 
export interface Orders{
    id: number,
    order_code: string,
    order_type: string,
    user_id: number,
    product_id: number,
    category_id: number,
    order_status: string,
    reason: string,
    reviewed_by: number,
    product: {
        id: number,
        name: string,
        owner_id: number,
        created_since: string,
        default_image: string,
        ownership_image_url: string,
        properties: Array<Product_Properties>
      },
      category: {
        id: number,
        title: string
      },
    }
export interface APIresponse2<T>{
    data: Array<T>
}
export interface Favourites{
    data:{
        id: number,
        name: string,
        image_url: string,
        cover_url: string,
        favourites: Array<FavItem>            
    }
}
interface FavItem{
    id: number,
    user_id: number,
    product_id: number,
    product:{
        id: number,
        name: string,
        desc: string,
        price: number,
        owner_id: number,
        created_since: string,
        default_image: string,
        category_slug: string,
        ownership_image_url: string,
        region_name: string,
        status: string,
        properties: Array<Product_Properties>,
        owner: {
            id: number,
            name: string,
            image_url: string,
            cover_url: string
        }
    }
}
export interface Provider{
    data: {
        id: number,
        name: string,
        provider_ratings_count: number,
        image_url: string,
        cover_url: string,
        provider_ratings: Array<ProviderRate>
    }
}
interface ProviderRate{
    id: number,
    user_id: number,
    provider_id: number,
    desc: string,
    value: number,
    created_since: string
}
export interface ResponseSuccess{
    data: string;
}
export interface Regions{
    data: [
        {
            id: number,
            name: string,
            slug: string,
            active: number
        }
    ]
}
export interface Notifications{
    data: Array<Notification>,
    links: {
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
interface Notification{
    id: number,
    title: string,
    body: string,
    slug: string,
    user_id: number,
    created_at: string
}