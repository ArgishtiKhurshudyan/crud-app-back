import {User} from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  }
  return jwt.sign(payload, process.env.JWT, {expiresIn: '24h'})
}

const signUpSchema = Joi.object({
  firstName: Joi.string().min(3).max(10).required().messages({
    'string.min': 'First name length must be at least 3 characters long!',
    'string.max': 'First name length must be less than or equal to 10 characters long!'
  }),
  lastName: Joi.string().min(3).max(10).required().messages({
    'string.min': 'Last name length must be at least 3 characters long!',
    'string.max': 'Last name length must be less than or equal to 10 characters long!'
  }),
  email: Joi.string().email().required().messages({'string.email': 'Email must be valid email'}),
  password: Joi.string().min(3).max(10).required().messages({
    'string.min': 'Password length must be at least 3 characters long!',
    'string.max': 'Password length must be less than or equal to 10 characters long!'
  }),
  confirmPassword: Joi.valid(Joi.ref("password")).error(() => new Error('Confirm password must match password!')),
})

const signInSchema = Joi.object({
  email: Joi.string().email().required().messages({'string.email': 'Email must be valid email'}),
  password: Joi.string().min(3).max(10).required().messages({
    'string.min': 'Password length must be at least 3 characters long!',
    'string.max': 'Password length must be less than or equal to 10 characters long!'
  })
})


export const register = async (req, res) => {
  try {
    const {error} = await signUpSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        message: error.details ? error.details[0].message : error.message
      })
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    let data = await User.findOne({where: {email: req.body.email}})
    if (data) {
      res.status(401).json({message: "user is already created"});
    } else {
      let user = await User.create({
        ...req.body,
        password: hash,
        confirmPassword:hash
      });
      const {password, ...otherDetails} = user._previousDataValues
      res.status(200).json({details: {...otherDetails}})
    }

  } catch (err) {
    throw err
  }
};

export const login = async (req, res, next) => {
  const {error} = signInSchema.validate(req.body)
  if (error) {
    return res.status(400).json({
      message: error.details ? error.details[0].message : error.message
    })
  }
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