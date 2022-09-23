import {Color, Product} from '../models'

export const createColor = async (req, res) => {
  try {
    let color = await Color.create(req.body);
    const colorToBeAssignProducts = await Color.findAll({
      where: {
        id: color.id,
      },
      through: {attributes: []},
      // include: {
      //   model: Product,
      //   as: 'colors'
      // },
      truncate: false
    })
    // await colorToBeAssignProducts.addColors(req.body.products, {through: 'ProductColors'})
    return res.status(200).json({message: "color!", data: color})
  } catch (err) {
    console.log("error ", err)
    return res.status(500).json({message: 'Something went wrong!'})
  }
}

export const updateColor = async (req, res) => {
  console.log('req.params.id',req.params.id)
  try {
    await Color.update(req.body, {
      where: {id: req.params.id}
    })
    console.log('req.body', req.body)

    return res.status(201).json({message: "color is updated"})
  } catch (err) {
    console.log("err", err)
  }
}

export const deleteColor = async (req, res) => {
  try {
    let x = await Color.destroy({where: {id: req.params.id}})
    return res.status(200).json({message: "color is deleted"})
  } catch (err) {
    console.log("error", err)
  }
}

export const getColors = async (req, res) => {
  try {
    let color = await Color.findAll();
    res.status(200).json({data: color})
  } catch (err) {
    console.log("error", err)
  }
}