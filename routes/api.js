import express from "express";
import itemFunctions from "../controllers/itemController.js";
import listFunctions from "../controllers/listController.js";
import userFunctions from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

//This line creates an instance of the express.Router() function.
//A router object is used to group a set of related routes in your application. It helps organize your API endpoints and keeps your code cleaner
const router = express.Router();

router.post("/users", userFunctions.registerUser);
router.post("/users/login", userFunctions.loginUser);

/*This line defines a route handler for the POST request method on the /items endpoint.
router.post specifies that this route will handle requests with the HTTP method POST.
/items defines the path for this endpoint. Any request sent to the URL with this path and the POST method will be handled by this route handler.
*/
router.post("/items", protect, itemFunctions.createItem);
router.get("/items", protect, itemFunctions.getItems);

/*
router.get: This part indicates that we're defining a route for handling HTTP GET requests.
/items/:id: This is the route path. It specifies the URL pattern that will trigger this route.
/items represents the resource (items).
:id is a dynamic parameter that will capture the value of the id in the URL.
itemFunctions.getItem: This is the function that will be executed when a GET request matches the specified route.
It's assumed that itemFunctions is an object containing various functions related to item operations, and getItem is one of them.
*/
router.get("/items/:id", protect, itemFunctions.getItem);
router.put("/items/:id", itemFunctions.updateItem);
router.delete("/items/:id", itemFunctions.deleteItem);

router.post("/lists", protect, listFunctions.createList);
router.get("/lists", protect, listFunctions.getLists);
router.get("/lists/:id", protect, listFunctions.getList);
router.put("/lists/:id", protect, listFunctions.updateList);
router.delete("/lists/:id", protect, listFunctions.deleteList);
router.post("/lists/:listId/items", protect, listFunctions.addItemToList);
router.delete(
  "/lists/:listId/items/:itemId",
  protect,
  listFunctions.removeItemFromList
);

export default router;
