import {Product, User, Color} from '../models';
import {Op} from "sequelize";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      user_id: req.user.id,
    });

    const colors = await Color.findAll({
      where: {
        id: {
          [Op.in]: req.body.colors,
        }
      },
      attributes: ['id']
    })

    const colorIds = colors.map(i => i.id)
    const productTobeAssignColors = await Product.findOne({
      where: {
        id: product.id,
      },
      include: {
        model: Color,
        as: 'colors'
      }
    })
    await productTobeAssignColors.addColors(colorIds, {through: 'ProductColors'})
    // await productTobeAssignColors.setProducts(req.body.colors, { through: 'ProductColors' } ) // many to many update
    // await productTobeAssignColors.removeProducts(req.body.colors, { through: 'ProductColors' } ) // many to many delete
    const createdProd = await Product.findOne({
      where: {id: product.id, user_id: req.user.id},
      include: {
        model: Color,
        as: "colors"
      }
    });

    return res.status(200).json({message: "product is created!", data: createdProd})
  } catch (err) {
    console.log("error", err)
    res.status(500).json({
      message: 'Something went wrong!'
    })
  }
};

export const updateProduct = async (req, res) => {
  try {

    for (const [key, value] of Object.entries(req.body.colors || {})) {
      await Color.update({
          colorName: value
        },
        {
          where: {
            id: key
          }
        }
      )
    }
    const colors = await Color.findAll({
      where: {
        id: {
          [Op.in]: req.body.newColor,
        }
      },
      attributes: ['id']
    })

    const colorsId = colors.map((i) => i.id)

    await Product.update(req.body, {where: {id: req.params.id}})
    const product = await Product.findOne({
      where: {id: req.params.id},
      include: {
        model: Color,
        as: "colors",
      },
    })


    await product.addColors(colorsId, {through: 'ProductColors'})

    if (!product) {
      return res.status(400).json({message: "product not found"})
    }

    const updatedProduct = await Product.findOne({
      where: {id: req.params.id},
      include: {
        model: Color,
        as: "colors",
      },
    })
    return res.status(200).json({message: "product is updated!", data: updatedProduct})
  } catch (err) {
    console.log("error", err)
    res.status(500).json({
      message: 'Something went wrong!'
    })
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const {productId} = req.params;
    const product = await Product.findOne({
      where: {id: productId, user_id: req.user.id}
    })
    if (!product) {
      return res.status(400).json({message: "product not found"})
    }

    await product.destroy(req.body)
    return res.status(200).json({message: "product is deleted!"})
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong!'
    })
  }
}

export const getProduct = async (req, res) => {
  try {
    const {productId} = req.params;
    console.log("product", productId)
    const product = await Product.findOne({
      where: {id: productId, user_id: req.user.id},
      include: {
        model: Color,
        as: "colors"
      }
    });
    const users = await User.findAll({
      attributes: {
        exclude: ["password"]
      },
      where: {id: req.user.id}
    })
    if (!product) {
      res.status(400).json({message: "product is not found"})
    }

    return res.status(200).json({products: product, users})
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong!'
    })
  }
}

export const getProducts = async (req, res) => {
  try {
    console.log('req.user.id', req.user.id)
    const product = await Product.findAll({
      include: {
        model: Color,
        as: "colors",
      },
      where: {
        user_id: req.user.id
      },
    });
    if (!product) {
      res.status(400).json({message: "Product is not found!"})
    }
    return res.status(200).json({products: product})
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong!'
    })
  }
}

export const findOne = async (req, res) => {
  try {
    const {id} = req.params
    const product = await Product.findByPk(id, {
      include: {
        model: Color,
        as: "colors",
      },

    });
    if (!product) {
      res.status(400).json({message: "Product is not found!"})
    }
    return res.status(200).json({product})
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong!'
    })
  }
}