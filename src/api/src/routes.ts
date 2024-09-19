import { Router } from "express";
import { handleTokenBasedAuthentication } from "./middlewares/authenticationMiddleware";
import { UserController } from "./controllers/UserController";
import { OrderItemController } from "./controllers/OrderItemController";

export const router: Router = Router();

const userController: UserController = new UserController();
const orderItemController: OrderItemController = new OrderItemController();

router.get("/", (_, res): any => {
    res.send("Hello, this is a simple webshop API.");
});

router.post("/users/register", (req, res): any => userController.register(req, res));
router.post("/users/login", (req, res): any => userController.login(req, res));

router.get("/orderItems", (_req, res): any => orderItemController.getAll(_req, res));

// NOTE: Everything after this point only works with a valid JWT token!
router.use(handleTokenBasedAuthentication as any);

router.get("/getAllUserInfo", (req, res): any => userController.getAllUserInfo(req, res));

router.get("/users/logout", (req, res): any => userController.logout(req, res));
router.get("/users/hello", (req, res): any => userController.hello(req, res));
router.get("/users/getCart", (req, res): any => userController.getCart(req, res));
router.post("/users/cart", (req, res): any => userController.addOrderItemToCart(req, res));
router.post("/users/cart/delete", (req, res): any => userController.removeOrderItemFromCart(req, res));
router.post("/users/cart/update", (req, res): any => userController.updateCartItemQuantity(req, res));
router.post("/users/emptyCart", (req, res): any => userController.emptyCart(req, res));

router.get("/users/getWishlist", (req, res): any => userController.getWishlist(req, res));
router.post("/users/wishlist", (req, res): any => userController.addItemToWishlist(req, res));
router.post("/users/delete", (req, res): any => userController.removeItemFromWishlist(req, res));

router.get("/searchproduct", (req, res): any => userController.searchProduct(req, res));

router.post("/updateNewsletterStatus", (req, res): any => userController.updateNewsletterStatus(req, res));
router.post("/users/info/update", (req, res): any => userController.changeUserData(req, res));
router.get("/getAllUsers", (req, res): any => userController.getAllUsers(req, res));
router.post("/updateRole", (req, res): any => userController.updateRole(req, res));
router.post("/deleteUser", (req, res): any => userController.deleteUser(req, res));
router.post("/users/addAddress", (req, res): any => userController.addAddress(req, res));
router.get("/users/getAddresses", (req, res): any => userController.getUserAddresses(req, res));
router.post("/deleteAddress", (req, res): any => userController.deleteAddress(req, res));
router.post("/addProduct", (req, res): any => userController.addProduct(req, res));
router.get("/products", (req, res): any => userController.getAllProducts(req, res));
router.post("/deleteProduct", (req, res): any => userController.deleteProduct(req, res));
router.post("/editProduct", (req, res): any => userController.editProduct(req, res));

router.post("/addReview", (req, res): any => userController.addReview(req, res));
router.get("/getAllReviews", (req, res): any => userController.getAllReviews(req, res));
router.get("/getAllProductReviews", (req, res): any => userController.getAllProductReviews(req, res));

router.post("/users/orderComplete", (req, res): any => userController.orderComplete(req, res));
router.get("/users/getOrders", (req, res): any => userController.getOrderItems(req, res));
