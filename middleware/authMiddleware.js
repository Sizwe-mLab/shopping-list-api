import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protect = async (req, res, next) => {
  let token;

  //Checks if the authorization header exists and starts with "Bearer".If found, extracts the token from the header.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //bearer token
      console.log(req.headers.authorization);

      token = req.headers.authorization.split(" ")[1];

      /*
      jwt.verify: This function is imported from the jsonwebtoken library and is used to verify the integrity of a JWT.
        token: This is the JWT that you extracted from the authorization header in the previous step.
        process.env.JWT_SECRET: This is a secret key used to sign the JWT when it was created. 
        It's essential for verifying the token's authenticity.

        and how it works is that:
        Decoding the Token: The jwt.verify function attempts to decode the provided token.
        Signature Verification: It checks the token's signature against the secret key. 
        If the signature is valid, it proceeds to the next step.
        Payload Extraction: If the signature is valid, the function extracts the payload (the data encoded in the token) and returns it as a decoded object.

        The decoded object contains the information that was originally included in the JWT's payload. **refer to generate token func
      */
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      //Retrieves the user information from the database based on the decoded user ID and Excludes the password field using select("-password") for security reasons.
      req.user = await User.findById(decoded.id).select("-password");
      //is a function that passes control to the next middleware function **ref to api.js
      next();
    } catch (error) {
      /*Catches any errors during token verification or user retrieval.
Sends a 401 Unauthorized response with an error message.*/
      res.status(401).json({ error: error });
    }
  } else {
    //If no authorization header is found, sends a 401 Unauthorized response.
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

export default protect;
