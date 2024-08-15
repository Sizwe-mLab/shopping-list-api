import jwt from "jsonwebtoken";
/*
note we're not using a arrow function because arrow functions have different binding behaivor for this keyword.
if I use arrow function, this keyword will be undefined
*/
async function generateToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

export default generateToken;
