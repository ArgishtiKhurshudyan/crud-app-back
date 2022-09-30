
const {transporter} = require('../services/nodemailer/index')
export const createMessage = async (req, res) => {
  try {
    const {email, message, username} = req.body
    console.log('email', email)
    console.log('message', message)
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
    console.log("error ", err)
    return res.status(500).json({message: 'Something went wrong! pls try again'})
  }
}
