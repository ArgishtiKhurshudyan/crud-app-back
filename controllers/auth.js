import {User} from "../models";
import bcrypt from "bcryptjs";
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
      res.status(401).json({message: "user is already created"});
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
      });

    if (!user) return res.status(401).json({message: "username not found"});
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({'message': "Wrong password or username"})
    } else {
      const token = generateAccessToken(user.id, user.roles, {isAdmin: user.isAdmin},)
      const {password, isAdmin, ...otherDetails} = user._previousDataValues

      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({details: {...otherDetails}, isAdmin, token});
    }

  } catch (err) {
    return res.status(500).json(err)
  }
};