import {Color} from '../models'

export const createColor = async (req, res) => {
  try {
    let color = await Color.create(req.body);
    const colorToBeAssignProducts = await Color.findAll({
      where: {
        id: color.id,
      },
      through: {attributes: []},
      truncate: false
    })
    // await colorToBeAssignProducts.addColors(req.body.products, {through: 'ProductColors'})
    return res.status(200).json({message: "color!", data: color})
  } catch (err) {
    return res.status(500).json({message: 'Something went wrong!'})
  }
}

export const updateColor = async (req, res) => {
  try {
    await Color.update(req.body, {
      where: {id: req.params.id}
    })
    return res.status(201).json({message: "color is updated"})
  } catch (err) {
    throw err
  }
}

export const deleteColor = async (req, res) => {
  try {
    await Color.destroy({where: {id: req.params.id}})
    return res.status(200).json({message: "color is deleted"})
  } catch (err) {
    throw err
  }
}

export const getColors = async (req, res) => {
  try {
    let color = await Color.findAll();
    res.status(200).json({data: color})
  } catch (err) {
    throw err
  }
}