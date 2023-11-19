import { IBook } from "./book";

export interface IOrderResponse{
    _id?: string,
    userId: string,
    fullName: string,
    email: string,
    phoneNumber: string,
    items: {
        _id?: string,
        quantity: number,
        price: number,
        bookId: IBook
    }[],
    status: number,
    paymentMethod: string,
    paymentStatus: number,
    totalPrice: number,
    discountCode: string | null,
    shippingAddress: string,
    note: string,
    createdAt: string,
    updateAt: string
}
export interface IOrderRequestAdd{
    userId: string,
    fullName: string,
    email: string,
    phoneNumber: string,
    items: {
        quantity: number,
        price: number,
        bookId: IBook
    }[],
    status: number,
    paymentMethod: string,
    paymentStatus: number,
    totalPrice: number,
    discountCode: string | null,
    shippingAddress: string,
    note: string,
}