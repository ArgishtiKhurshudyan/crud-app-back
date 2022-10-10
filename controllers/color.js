import {Color, Product} from '../models'

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
    await colorToBeAssignProducts.addColors(req.body.products, {through: 'ProductColors'})
    return res.status(200).json({message: "color!", data: color})
  } catch (err) {
    return res.status(500).json({message: 'Something went wrong!'})
  }
}

export const updateColor = async (req, res) => {
  try {
    const {id} = req.params;


    await Color.update(req.body, {
      where: {id: id}
    })
    const color = await Color.findOne({
      where: {id:id},
    })
   return res.status(200).json({message: "color is updated", data:color})
  } catch (err) {
    throw err
  }
}

export const deleteColor = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedColor =  await Color.findOne({
      where: {
        id: id
      },
    });
    await Color.destroy({where: {id: id}})
    return res.status(200).json({message: "color is deleted", data:deletedColor})
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

export const findOneColor = async (req, res) => {
  try {
    const {id} = req.params
    const color = await Color.findByPk(id);
    if (!color) {
      res.status(400).json({message: "color is not found!"})
    }
    return res.status(200).json({color})
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong!'
    })
  }
}