const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use("/public", express.static("public"))
app.use("/uploads", express.static("uploads"))

/* =========================
DATABASE
========================= */

const db = new sqlite3.Database("database.db")

db.serialize(() => {

db.run(`CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT,
password TEXT
)`)

const hash = crypto.createHash("md5").update("secret").digest("hex")

db.run(`INSERT INTO users(username,password) VALUES('admin','${hash}')`)

})

/* =========================
UPLOAD CONFIG
========================= */

const upload = multer({
dest: "uploads/"
})

/* =========================
HOME
========================= */

app.get("/", (req, res) => {
res.sendFile(__dirname + "/views/index.html")
})

/* =========================
SQL LAB
========================= */

app.get("/sql1", (req, res) => {
res.sendFile(__dirname + "/views/sql1.html")
})

app.get("/sql2", (req, res) => {
res.sendFile(__dirname + "/views/sql2.html")
})

app.get("/sql3", (req, res) => {
res.sendFile(__dirname + "/views/sql3.html")
})

/* LEVEL 1 */

app.post("/login1", (req, res) => {

let user = req.body.username
let pass = req.body.password

let query = `SELECT * FROM users WHERE username='${user}' AND password='${pass}'`

db.all(query, (err, rows) => {

if (rows && rows.length > 0) {

res.send(`
<h2>Level 1 Solved</h2>
<p>Fragment Flag</p>
<b>{SQL_</b>
<br><br>
<a href="/sql2">Next Level</a>
`)

} else {

res.send("Login Failed")

}

})

})

/* LEVEL 2 */

app.post("/login2", (req, res) => {

let user = req.body.username

let query = `SELECT * FROM users WHERE username='${user}'`

db.all(query, (err, rows) => {

if (rows && rows.length > 0) {

res.send(`
<h2>Level 2 Solved</h2>
<p>Fragment Flag</p>
<b>Mungking</b>
<br><br>
<a href="/sql3">Next Level</a>
`)

} else {

res.send("Try again")

}

})

})

/* LEVEL 3 (HARDER SQLI) */

app.post("/login3", (req, res) => {

let user = req.body.username
let pass = req.body.password

/* simple filter */

if (
user.includes("'") ||
user.includes("--") ||
user.includes(";") ||
user.includes("/*")
) {

return res.send("blocked")

}

/* password hash */

let hash = crypto.createHash("md5").update(pass).digest("hex")

let query =
`SELECT * FROM users WHERE username LIKE '%${user}%' AND password='${hash}'`

db.all(query, (err, rows) => {

if (rows && rows.length > 0) {

res.send(`
<h2>Level 3 Solved</h2>
<p>Final Fragment</p>
<b>_easy_kan?}</b>
<h3>Combine the fragments</h3>
`)

} else {

res.send("Invalid login")

}

})

})

/* =========================
UPLOAD LAB
========================= */

app.get("/upload1", (req, res) => {
res.sendFile(__dirname + "/views/upload1.html")
})

app.get("/upload2", (req, res) => {
res.sendFile(__dirname + "/views/upload2.html")
})

app.get("/upload3", (req, res) => {
res.sendFile(__dirname + "/views/upload3.html")
})

/* UPLOAD LEVEL 1 */

app.post("/upload1", upload.single("file"), (req, res) => {

if(!req.file){
return res.send("No file uploaded")
}

let ext = path.extname(req.file.originalname).toLowerCase()

/* hanya boleh php */

if(ext !== ".php"){
return res.send("Exploit failed. Upload PHP file.")
}

res.send(`
<h2>Level 1 Solved</h2>
<b>{Jangan_</b>
<br>
<a href="/upload2">Next Level</a>
`)

})

/* UPLOAD LEVEL 2 (HARDER VALIDATION) */

app.post("/upload2", upload.single("file"), (req, res) => {

let ext = path.extname(req.file.originalname).toLowerCase()

/* extension check */

if (ext !== ".jpg" && ext !== ".jpeg") {

fs.unlinkSync(req.file.path)

return res.send("Only JPG allowed")

}

/* MIME type check */

if (req.file.mimetype !== "image/jpeg") {

fs.unlinkSync(req.file.path)

return res.send("Invalid MIME type")

}

/* magic byte check */

let buffer = fs.readFileSync(req.file.path)

if (buffer.toString("hex", 0, 2) !== "ffd8") {

fs.unlinkSync(req.file.path)

return res.send("Fake JPG detected")

}

res.send(`
<h2>Level 2 Solved</h2>
<b>Lupa_Cek</b>
<br>
<a href="/upload3">Next Level</a>
`)

})

/* UPLOAD LEVEL 3 */

app.post("/upload3", upload.single("file"), (req, res) => {

let randomName = crypto.randomBytes(8).toString("hex") + ".jpg"

let newPath = "uploads/" + randomName

fs.renameSync(req.file.path, newPath)

res.send(`
<h2>Level 3 Solved</h2>
<p>File stored as: ${randomName}</p>
<b>Filter}</b>
`)

})

/* =========================
SOURCE CODE LAB
========================= */

app.get("/source1", (req, res) => {
res.sendFile(__dirname + "/views/source1.html")
})

app.get("/source2", (req, res) => {
res.sendFile(__dirname + "/views/source2.html")
})

app.get("/source3", (req, res) => {
res.sendFile(__dirname + "/views/source3.html")
})

/* =========================
SERVER START
========================= */

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {

console.log("VIVY Exploit running on port " + PORT)

})
