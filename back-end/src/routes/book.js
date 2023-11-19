import express from "express"
import { create, deleteBooks, getBook, getBooks, getBooksByCategory, getRelatedBooks, getTopSellingBooks, remove, update } from "../controllers/book.js";

const routerBook = express.Router();

routerBook.get(`/`,getBooks)
routerBook.get(`/top-selling`,getTopSellingBooks)
routerBook.get(`/:id`,getBook)
routerBook.get(`/:id/book-related`,getRelatedBooks)
routerBook.get(`/category/:categoryId`,getBooksByCategory)
routerBook.post(`/add`,create)
routerBook.patch(`/:id/edit`,update)
routerBook.delete(`/delete-books`,deleteBooks)
routerBook.delete(`/:id`,remove)





export default routerBook;