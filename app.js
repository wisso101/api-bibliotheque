const express = require("express")
const mongoose = require("mongoose")
const Livre = require("./models/Livre")

const app = express()

app.use(express.json())

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/bibliotheque"

mongoose.connect(MONGO_URI)
.then(()=> console.log("MongoDB connecté"))
.catch(err => console.log(err))

app.post("/livres", async (req, res) => {
 const livre = new Livre(req.body)
 await livre.save()
 res.status(201).json(livre)
})

app.get("/livres", async (req, res) => {
 const livres = await Livre.find()
 res.json(livres)
})

app.put("/livres/:id", async (req, res) => {
 const livre = await Livre.findByIdAndUpdate(
   req.params.id,
   req.body,
   { new: true }
 )
 res.json(livre)
})

app.delete("/livres/:id", async (req, res) => {
 await Livre.findByIdAndDelete(req.params.id)
 res.json({ message: "Livre supprimé" })
})

app.get("/health", (req,res)=>{
 res.json({
  status:"ok",
  db:"connected"
 })
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
 console.log("Serveur démarré sur le port " + PORT)
})