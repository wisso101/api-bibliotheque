const express = require("express")
const mongoose = require("mongoose")
const Livre = require("./models/Livre")

const app = express()

// middleware
app.use(express.json())

// MongoDB URI (Azure ou local)
const MONGO_URI =
 process.env.MONGODB_URI ||
 "mongodb://localhost:27017/bibliotheque"

// connexion MongoDB
mongoose.connect(MONGO_URI)
.then(() => {
 console.log("MongoDB connecté")
})
.catch((err) => {
 console.error("Erreur MongoDB :", err)
})

// CREATE livre
app.post("/livres", async (req, res) => {
 try {
  const livre = new Livre(req.body)
  await livre.save()
  res.status(201).json(livre)
 } catch (error) {
  res.status(500).json({ error: error.message })
 }
})

// READ tous les livres
app.get("/livres", async (req, res) => {
 try {
  const livres = await Livre.find()
  res.json(livres)
 } catch (error) {
  res.status(500).json({ error: error.message })
 }
})

// UPDATE livre
app.put("/livres/:id", async (req, res) => {
 try {
  const livre = await Livre.findByIdAndUpdate(
   req.params.id,
   req.body,
   { new: true }
  )

  if (!livre) {
   return res.status(404).json({ message: "Livre non trouvé" })
  }

  res.json(livre)

 } catch (error) {
  res.status(500).json({ error: error.message })
 }
})

// DELETE livre
app.delete("/livres/:id", async (req, res) => {
 try {
  const livre = await Livre.findByIdAndDelete(req.params.id)

  if (!livre) {
   return res.status(404).json({ message: "Livre non trouvé" })
  }

  res.json({ message: "Livre supprimé" })

 } catch (error) {
  res.status(500).json({ error: error.message })
 }
})

// route health
app.get("/health", (req, res) => {
 res.json({
  status: "ok",
  db: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
 })
})

// port Azure
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
 console.log("Serveur démarré sur le port " + PORT)
})