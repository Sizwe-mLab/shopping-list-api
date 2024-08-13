import Item from "../models/item.js";

//Defines an asynchronous function named createItem that takes two parameters:
//req: The request object containing information about the incoming HTTP request.
//res: The response object used to send a response back to the client
//try...catch block is used to handle potential errors during the item creation process.

/*
const newItem = await Item.create(req.body); creates a new item using the Item model (which is likely defined elsewhere) and the data from the request body (req.body). 
The await keyword is used because Item.create is an asynchronous operation.
res.status(201).json(newItem); sends a 201 Created status code and the newly created item as JSON data in the response body.
If an error occurs, the catch block is executed. It logs the error to the console and sends a 500 Internal Server Error response with a generic error message.

201 http status code means the request was successfully fulfilled and resulted in one or possibly multiple new resources being created.
500 http status code means the server encountered an unexpected condition that prevented it from fulfilling the request.
*/
const createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch {
    res
      .status(500)
      .json({ error: "An error occurred while creating the item" });
  }
};

export default createItem;
