import {User, Product, Color} from "../models";
import bcrypt from "bcryptjs";
import {createError} from "../utils/error";
import jwt from "jsonwebtoken";

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  }
  return jwt.sign(payload, process.env.JWT, {expiresIn: '24h'})
}

export const register = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    let data = await User.findOne({where: {email: req.body.email}})
    if (data) {
      res.status(200).json({message: "user is already created"});
    } else {
      let user = await User.create({
        ...req.body,
        password: hash,
      });
      const {password, ...otherDetails} = user._previousDataValues
      res.status(200).json({details: {...otherDetails}})
    }
  } catch (err) {
    throw err
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne(
      {
        where: {email: req.body.email},
        // include: {
        //   model: Product,
        //   include: {
        //     model: Color,
        //     as: 'products'
        //   }
        // }
      });

    if (!user) return res.status(401).json({message: "username not found"});
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      console.log('123132')
      return res.status(401).json({'message': "Wrong password or username"})
    } else {
      const token = generateAccessToken(user.id, user.roles, {isAdmin: user.isAdmin},)
      const {password, isAdmin, ...otherDetails} = user._previousDataValues

      console.log('token', token)

      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({details: {...otherDetails}, isAdmin, token});
    }
      // return next(createError(401, "Wrong password or username"));

  } catch (err) {
    return res.status(500).json(err)
  }
};