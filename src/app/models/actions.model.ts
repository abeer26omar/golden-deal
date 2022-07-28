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
        reviews: [],
        image_url: string,
        cover_url: string,
        products: Array<Products>
    }
}
interface Products{
        id: number,
        name: string,
        desc: string,
        owner_id: number,
        status: string,
        active: number,
        price: number,
        created_since: string,
        default_image: string,
        ownership_image_url: string
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
        ownership_image_url: string
      },
      category: {
        id: number,
        title: string
      }
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
