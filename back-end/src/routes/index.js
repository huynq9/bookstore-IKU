import express from "express"
import routerBook from "./book.js"
import routerCategory from "./category.js"
import routerImages from "./upload.js"
import routerAuthor from "./author.js"
import routerAuth from "./auth.js";
import routerVoucher from "./voucher.js"
import routerCart from "./cart.js"
import routerOrder from "./order.js"

const router = express.Router()

router.use('/books', routerBook)
router.use('/categories', routerCategory)
router.use('/images', routerImages)
router.use('/authors', routerAuthor)
router.use("/auth", routerAuth);
router.use('/vouchers', routerVoucher)
router.use('/carts', routerCart)
router.use('/order', routerOrder)



// router.use('/u', routerUser)

export default router