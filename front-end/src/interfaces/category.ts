import { IBook } from "./book";

export interface ICategory {
    _id: string,
    name: string,
    description: string,
    createdAt: Date,
    updatedAt: Date
    books?: IBook[]
 }
export  interface CategoryIdType {
    _id: string;
    name: string;
    description: string;
    books?: string[];
  }