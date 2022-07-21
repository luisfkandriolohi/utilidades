const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = class UserController {

  static async register(req, res) {

    const {name, email, phone, password, confirmPassword} = req.body

    // validations
    if(!name || !email || !phone || !password || !confirmPassword) {
      res
        .status(422)
        .json({message: 'Algum dado não foi preenchido!'})
      return
    }

    if(password !== confirmPassword) {
      res
        .status(422)
        .json({message: `As senhas não se coincidem!`})
      return
    }

    // check if user exists
    const userExists = await User.findOne({email})
    if(userExists) {
      res
        .status(422)
        .json({message: `Esse cadastro já existe!`})
      return
    }

    // create a password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // create a user
    const user = new User({
      name,
      email,
      phone,
      password: passwordHash
    })

    try {
      const newUser = await user.save()
      res
        .status(200)
        .json({message: 'Usuário criado!', newUser})
    } catch(err) {
      res
        .status(500)
        .json({message: err})
    }
  }

}