import { IBook } from "./book";
import { ICategory } from "./category";

interface IVoucher {
  _id?: string; // ID của voucher (nếu cần)
  title: string;
  type: "percent" | "value" | "promotion";
  code: string;
  quantity: number;
  discount: number;
  used: number;
  minOrderValue?: number | null; 
  validFrom: string;
  validTo: string;
  categoryIds: ICategory[]; 
  bookIds: IBook[]; 
  role: "productDiscount" | "userDiscount" | "otherRole";
}

export default IVoucher;