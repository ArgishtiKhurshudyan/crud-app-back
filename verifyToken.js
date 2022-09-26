import jwt from "jsonwebtoken";
import {User, Color, Product} from './models';

export const verifyToken = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization || req.headers["x-access-token"];

    if (!bearerToken) {
      return res.status(401).json({message: "user not authorized"})
    }
    const token = bearerToken.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({message: "user not authorized"})
    }


    jwt.verify(token, process.env.JWT, async (err, decodedData) => {
      if (err) {
        return res.status(401).json({message: "Invalid token."})
      }

      const {id, iat} = decodedData;
      if (!decodedData) {
        return res.status(401).json({message: "user not authorized"})
      }

      const user = await User.findByPk(id)

      if (!user) {
        return res.status(401).json({message: "Not enough permission to perform the request!"})
      }else{
        req.user = user
        next()
      }
    });


  } catch (e) {
    console.log("error", e)
    return res.status(500).json({message: "Something went w wrong!"})
  }
}
// export const verifyAdmin = (req, res, next) => {
//   verifyToken(req, res, next, () => {
//     if (req.user.isAdmin) {
//       next();
//     } else {
//       return res.status(401)("You are not authorized!")
//     }
//   });
// };