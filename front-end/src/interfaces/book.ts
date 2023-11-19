import { AuthorIdType } from "./author";
import { CategoryIdType } from "./category";

export interface IBook {
  _id?: string;
  title: string;
  description: string;
  authorId: AuthorIdType[];
  categoryId: CategoryIdType[];
  images: { url: string; publicId: string }[];
  price: number;
  discount: number;
  stock: number;
  publishedAt: Date;
  soldCount: number;
  createdAt: Date;
  updatedAt: Date;
  averageRating: string | null;
  views: number;
  sale: number;
}
