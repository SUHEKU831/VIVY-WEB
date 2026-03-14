const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const multer = require("multer")

const app = express()

app.use(express.urlencoded({extended:true}))
app.use("/public",express.static("public"))
app.use("/uploads",express.static("uploads"))

const db = new sqlite3.Database("database.db")

db.run(`CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT,
password TEXT
)`)

db.run(`INSERT INTO users(username,password) VALUES('admin','secret')`)

const upload = multer({dest:"uploads/"})

app.get("/",(req,res)=>{
res.sendFile(__dirname+"/views/index.html")
})

/* SQL LAB */

app.get("/sql1",(req,res)=>{
res.sendFile(__dirname+"/views/sql1.html")
})

app.get("/sql2",(req,res)=>{
res.sendFile(__dirname+"/views/sql2.html")
})

app.get("/sql3",(req,res)=>{
res.sendFile(__dirname+"/views/sql3.html")
})

app.post("/login1",(req,res)=>{

let user=req.body.username
let pass=req.body.password

let query=`SELECT * FROM users WHERE username='${user}' AND password='${pass}'`

db.all(query,(err,rows)=>{

if(rows.length>0){

res.send(`
<h2>Level 1 Solved</h2>
<p>Fragment Flag</p>
<b>{aaaajahsh</b>
<br><br>
<a href="/sql2">Next Level</a>
`)

}else{

res.send("Login Failed")

}

})

})

app.post("/login2",(req,res)=>{

let user=req.body.username

let query=`SELECT * FROM users WHERE username='${user}'`

db.all(query,(err,rows)=>{

if(rows.length>0){

res.send(`
<h2>Level 2 Solved</h2>
<p>Fragment Flag</p>
<b>_aayhjhsh_</b>
<br><br>
<a href="/sql3">Next Level</a>
`)

}else{

res.send("Try again")

}

})

})

app.post("/login3",(req,res)=>{

let user=req.body.username
let pass=req.body.password

let query=`SELECT * FROM users WHERE username='${user}' AND password='${pass}'`

db.all(query,(err,rows)=>{

if(rows.length>0){

res.send(`
<h2>Level 3 Solved</h2>
<p>Final Fragment</p>
<b>easy_7999}</b>
<h3>Combine the fragments</h3>
`)

}else{

res.send("Login Failed")

}

})

})

/* FILE UPLOAD LAB */

app.get("/upload1",(req,res)=>{
res.sendFile(__dirname+"/views/upload1.html")
})

app.get("/upload2",(req,res)=>{
res.sendFile(__dirname+"/views/upload2.html")
})

app.get("/upload3",(req,res)=>{
res.sendFile(__dirname+"/views/upload3.html")
})

app.post("/upload1",upload.single("file"),(req,res)=>{

res.send(`
<h2>Level 1 Solved</h2>
<b>{aaaajahsh</b>
<br>
<a href="/upload2">Next Level</a>
`)

})

app.post("/upload2",upload.single("file"),(req,res)=>{

if(req.file.originalname.endsWith(".jpg")){

res.send(`
<h2>Level 2 Solved</h2>
<b>_aayhjhsh_</b>
<br>
<a href="/upload3">Next Level</a>
`)

}else{

res.send("Only jpg allowed")

}

})

app.post("/upload3",upload.single("file"),(req,res)=>{

res.send(`
<h2>Level 3 Solved</h2>
<b>easy_7999}</b>
`)

})

/* SOURCE CODE LAB */

app.get("/source1",(req,res)=>{
res.sendFile(__dirname+"/views/source1.html")
})

app.get("/source2",(req,res)=>{
res.sendFile(__dirname+"/views/source2.html")
})

app.get("/source3",(req,res)=>{
res.sendFile(__dirname+"/views/source3.html")
})

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
console.log("Server running")
})
