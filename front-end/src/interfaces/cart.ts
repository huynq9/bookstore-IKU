import { IBook } from "./book"

export interface IAddToCartRequest{
    bookId?: string,
    quantity: number,
    price?: number
}
export interface IUpdateCartRequest{
   items: IAddToCartRequest[]
}
export interface ICartResponse{
    _id?: string,
    items: {
        _id: string,
        book:IBook,
        quantity: number
    }[],
    totalMoney: number
}
