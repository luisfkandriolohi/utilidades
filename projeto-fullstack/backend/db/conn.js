const mongoose = require('mongoose')

async function main() {
  const uri = 'mongodb+srv://luisfkandriolo:Luisw88@q77#@cluster0.7kew9.mongodb.net/?retryWrites=true&w=majority'
  await mongoose.connect(
    uri, { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Mongoose connected")
  )
}

main().catch((err) => console.log(err))

module.exports = mongoose