import Item from "../models/item.js";
/*
The provided code defines an asynchronous function named createItem that handles the creation of a new item within a Node.js Express application using MongoDB. 
It begins by attempting to create a new item based on the data received in the request body. If successful, it sends a 201 Created status code with the newly created item as a JSON response. 
However, if an error occurs, the code checks if it's a validation error, sending a 400 Bad Request response with the error message. 
For other errors, a generic 500 Internal Server Error response is sent. 
*/
const createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const getItems = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query; // Destructuring query parameters: Extracts page and limit from query parameters, with default values of 1 and 10 respectively.

    const skip = (page - 1) * limit; //Calculating skip: Determines the number of documents to skip based on the current page and limit.
    const items = await Item.find().skip(skip).limit(limit); //Fetching items: Uses Item.find().skip(skip).limit(limit) to retrieve the desired page of items.

    const totalItems = await Item.countDocuments(); //Counting total items: Calculates the total number of items for pagination information.

    res.status(200).json({ items, totalItems, page, limit }); //Returning response: Sends a JSON response with items, total items, current page, and items per page.

    /*
    User Experience: Improves user experience by allowing control over the number of items displayed per page.
    */

    /*
    We could include filtering and sorting but that's a story for another day. Another course...
    */
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching items" });
  }
};

const getItem = async (req, res) => {
  try {
    const itemId = await req.params.id;
    const item = await Item.findById(itemId);
    res.status(200).json(item);
  } catch (error) {
    /*
    This code checks for specific errors:
    ObjectId error for invalid IDs.
    CastError for cases where the ID cannot be cast to a valid MongoDB ObjectID.
    */
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid item ID" });
    } else {
      console.error(error); // Log the actual error for debugging
      return res.status(500).json({ error: "An error occurred" });
    }
  }
};

const updateItem = async (req, res) => {
  try {
    const itemId = await req.params.id; //This line retrieves the item ID from the request parameters (req.params).
    const updateItem = await req.body; //This line retrieves the update data from the request body (req.body). The await keyword ensures the code waits for the data to be parsed completely before proceeding.
    const updatedItem = await Item.findByIdAndUpdate(itemId, updateItem); //Find the item with the matching _id (from itemId). Update the item with the data provided in updateItem.
    // console.log(updatedItem);
    res.status(200).json(updatedItem); //This line sends a response back to the client with a status code of 200 (OK) and the updated item as a JSON object.
  } catch (error) {
    //This block handles any errors that occur during the update process.
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid item ID" });
    } else {
      return res.status(500).json({ error: "An error occurred" });
    }
  }
};

const deleteItem = async (req, res) => {
  try {
    const itemId = await req.params.id;
    const deletedItem = await Item.deleteOne({ _id: itemId }); // or await Item.findByIdAndDelete(req.params.id);
    if (deletedItem.deletedCount === 1) {
      res.status(200).json({
        message: "Item deleted successfully",
      });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid item ID" });
    } else {
      return res.status(500).json({ error: "An error occurred" });
    }
  }
};

export default {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
};
