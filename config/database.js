import mongoose from "mongoose";

//This asynchronous function is responsible for establishing the database connection.
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

//Exports the function to be used in other parts of the application.
export default connectDB;

/*
why we have database connection in a config file:
Keeps database connection details separate from application logic.
Easier to modify database settings without altering core application code.
*/