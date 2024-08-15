import Item from "../models/item.js";
import List from "../models/list.js";
import mongoose from "mongoose";

const createList = async (req, res) => {
  try {
    const list = await List.create(req.body);
    res.status(201).json(list);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const getLists = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query; // Destructuring query parameters: Extracts page and limit from query parameters, with default values of 1 and 10 respectively.

    const skip = (page - 1) * limit; //Calculating skip: Determines the number of documents to skip based on the current page and limit.
    const lists = await List.find().skip(skip).limit(limit); //Fetching items: Uses Item.find().skip(skip).limit(limit) to retrieve the desired page of items.
    /*
    we are using a one-to-many relationship.

    One list can have many items.
    Each item belongs to only one list (at least in this simplified model).
    if we want see the populated list on postman
     const lists = await List.find().populate('items').skip(skip).limit(limit);
    */
    const totalLists = await List.countDocuments(); //Counting total items: Calculates the total number of items for pagination information.

    res.status(200).json({ lists, totalLists, page, limit }); //Returning response: Sends a JSON response with items, total items, current page, and items per page.

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

const getList = async (req, res) => {
  try {
    const listId = await req.params.id;
    const list = await List.findById(listId);
    res.status(200).json(list);
  } catch (error) {
    /*
    This code checks for specific errors:
    ObjectId error for invalid IDs.
    CastError for cases where the ID cannot be cast to a valid MongoDB ObjectID.
    */
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid list ID" });
    } else {
      console.error(error); // Log the actual error for debugging
      return res.status(500).json({ error: "An error occurred" });
    }
  }
};

const updateList = async (req, res) => {
  try {
    const listId = await req.params.id; //This line retrieves the item ID from the request parameters (req.params).
    const updateList = await req.body; //This line retrieves the update data from the request body (req.body). The await keyword ensures the code waits for the data to be parsed completely before proceeding.
    const updatedList = await List.findByIdAndUpdate(listId, updateList, {
      new: true,
    }); //Find the item with the matching _id (from itemId). Update the item with the data provided in updateItem.
    if (updatedList) {
      res.status(200).json(updatedList); //This line sends a response back to the client with a status code of 200 (OK) and the updated item as a JSON object.
    } else {
      res.status(404).json({ message: "List not found" });
    }
  } catch (error) {
    //This block handles any errors that occur during the update process.
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid list ID" });
    } else {
      return res.status(500).json({ error: "An error occurred" });
    }
  }
};

const deleteList = async (req, res) => {
  try {
    const listId = await req.params.id;
    const deletedList = await List.deleteOne({ _id: listId });
    if (deletedList.deletedCount === 1) {
      res.status(200).json({
        message: "List deleted successfully",
      });
    } else {
      res.status(404).json({ message: "List not found" });
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid list ID" });
    } else {
      return res.status(500).json({ error: "An error occurred" });
    }
  }
};

const addItemToList = async (req, res) => {
  try {
    // Checks if both listId and itemId are valid MongoDB object IDs using mongoose.Types.ObjectId.isValid. If either is invalid, returns a 400 Bad Request response.
    // if (
    //   !mongoose.Types.ObjectId.isValid(req.params.listId) ||
    //   !mongoose.Types.ObjectId.isValid(req.body.itemId)
    // ) {
    //   return res.status(400).json({ message: "Invalid list or item ID" });
    // }

    //Retrieves the list based on the listId from the request parameters. If not found, returns a 404 Not Found response.
    const list = await List.findById(req.params.listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    //Retrieves the item based on the itemId from the request body. If not found, returns a 404 Not Found response.
    const item = await Item.findById(req.body.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Optionally checks if the item already exists in the list's items array. If found, returns a 409 Conflict response.
    if (
      list.items.some(
        (existingItem) =>
          existingItem._id.toString() === req.body.itemId.toString()
      )
    ) {
      return res
        .status(409)
        .json({ message: "Item already exists in the list" });
    }

    // generally preferred for better performance, especially when dealing with larger datasets or frequent updates.
    await list.updateOne({ $push: { items: item } }); // More efficient update
    res.json({ message: "Item added to list successfully" });
  } catch (error) {
    console.error(error);
    // Handle specific Mongoose errors or generic errors
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid list ID" });
    } else {
      res
        .status(500)
        .json({ message: "An error occurred while adding the item" });
    }
  }

  /*
  http://localhost:3000/api/v1/lists/:listId/items listId 
  on the body add {itemId: itemId}
  */
};

const removeItemFromList = async (req, res) => {
  try {
    /*
    $pull is a MongoDB update operator used 
    to remove one or more matching elements from an embedded array within a document.

    Specifies the array field within the document that we want to modify. 
    In this case, it's the items array which contains item objects.

    This is a query object that defines the criteria for removing elements from the items array. 
    It specifies that we want to remove the item with the _id matching the req.params.itemId (which is the item ID extracted from the request parameters).
    */
    const updatedList = await List.findByIdAndUpdate(
      req.params.listId,
      { $pull: { items: { _id: req.params.itemId } } },
      { new: true }
    );
    console.log(req.params);

    if (!updatedList) {
      return res.status(404).json({ message: "List or item not found" });
    }

    res.json({
      message: "Item removed from list successfully",
      items: updatedList.items,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid list ID" });
    } else {
      res
        .status(500)
        .json({ message: "An error occurred while removing the item" });
    }
  }
};


export default {
  createList,
  getList,
  getLists,
  updateList,
  deleteList,
  addItemToList,
  removeItemFromList,
};
