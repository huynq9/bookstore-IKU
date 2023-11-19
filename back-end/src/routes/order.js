import express from "express";
import { changeOrderStatus, changeShippingAddress, createOrder, getAll, getOrder, getOrdersByUser, updateOrder, deleteOrder } from "../controllers/order";
import { checkAuthenticatedUser } from './../middlewares/checkPermission';
const routerOrder = express.Router()

routerOrder.get('/', getAll),
routerOrder.get('/list',checkAuthenticatedUser, getOrdersByUser)
routerOrder.get('/:id',getOrder ),
routerOrder.post('/add',checkAuthenticatedUser, createOrder ),
routerOrder.patch('/:orderId', updateOrder)
routerOrder.patch('/:orderId/changeAddress', changeShippingAddress)
routerOrder.patch('/:orderId/changeOrderStatus', changeOrderStatus)
routerOrder.delete('/:orderId/', deleteOrder)




export default routerOrder