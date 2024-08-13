import express from "express";
import createItem from "../controllers/itemController.js";

//This line creates an instance of the express.Router() function.
//A router object is used to group a set of related routes in your application. It helps organize your API endpoints and keeps your code cleaner
const router = express.Router()

/*This line defines a route handler for the POST request method on the /items endpoint.
router.post specifies that this route will handle requests with the HTTP method POST.
/items defines the path for this endpoint. Any request sent to the URL with this path and the POST method will be handled by this route handler.
*/
router.post('/items', createItem)

export default router