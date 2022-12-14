import Joi from "joi";

const {transporter} = require('../services/nodemailer/index')

const contacts = Joi.object({
  username: Joi.string().min(3).max(10).required().messages({
    'string.min': 'User name length must be at least 3 characters long!',
    'string.max': 'User name length must be less than or equal to 10 characters long!',
  }),
  email: Joi.string().email().required().messages({'string.email': 'Email must be valid email'}),
  message: Joi.string().min(3).max(150).required().messages({
    'string.min': 'message length must be at least 3 characters long!',
    'string.max': 'message length must be less than or equal to 10 characters long!',
  }),
})
export const createMessage = async (req, res) => {
  try {
    const {error} = await contacts.validate(req.body)
    if (error) {
      return res.status(400).json({
        message: error.details ? error.details[0].message : error.message
      })
    }
    const {email, message, username} = req.body
    const transport = await transporter()
    await transport.sendMail({
      from: `"Argishti 👻" <${email}>`, // sender address
      to: 'argishtikhurshudyan@gmail.com', // list of receivers
      subject: "Support ✔", // Subject line
      text: message, // plain text body
      html: `<b>${username}</b> <br/> <b>${message}</b> <br />  <b>Mail from ${email}</b>`, // html body
    }).then(d => console.log('Message sent success!', d))
      .catch(e => console.log('Message sent error:', e));

    return res.status(200).json({message: "your message is sending!", data: username})
  } catch (err) {
    return res.status(500).json({message: 'Something went wrong! pls try again'})
  }
}
