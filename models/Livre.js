const mongoose = require("mongoose")

const LivreSchema = new mongoose.Schema({
  titre: String,
  auteur: String,
  prix: Number
})

module.exports = mongoose.model("Livre", LivreSchema)