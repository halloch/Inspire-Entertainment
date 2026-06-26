const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*"
    }
});

app.use(cors());
app.use(express.json());
app.use("/uploads",express.static("uploads"));

/* CONFIG */

const SECRET = "INSPIRE_SECRET_KEY";

/* MYSQL */

const db = mysql.createConnection({

    host:"localhost",
    user:"root",
    password:"",
    database:"inspire"

});

db.connect((err)=>{

    if(err){

        console.log(err);
        return;

    }

    console.log("MySQL conectado");

});

/* JWT */

function auth(req,res,next){

    const token =
    req.headers.authorization;

    if(!token){

        return res
        .status(401)
        .json({
            message:"Token inválido"
        });

    }

    try{

        const decoded =
        jwt.verify(
            token,
            SECRET
        );

        req.user = decoded;

        next();

    }catch{

        return res
        .status(401)
        .json({
            message:"Token expirado"
        });

    }

}

/* CADASTRO */

app.post("/api/register",

async(req,res)=>{

const {

name,
username,
email,
password

} = req.body;

try{

const hash =
await bcrypt.hash(
password,
10
);

db.query(

`INSERT INTO users
(name,username,email,password)
VALUES(?,?,?,?)`,

[
name,
username,
email,
hash
],

(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json({

message:
"Usuário criado"

});

}

);

}catch(err){

res
.status(500)
.json(err);

}

});

/* LOGIN */

app.post("/api/login",

(req,res)=>{

const {

email,
password

}=req.body;

db.query(

"SELECT * FROM users WHERE email=?",

[email],

async(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

if(result.length===0){

return res
.status(404)
.json({

message:
"Usuário não encontrado"

});

}

const user =
result[0];

const valid =
await bcrypt.compare(
password,
user.password
);

if(!valid){

return res
.status(401)
.json({

message:
"Senha incorreta"

});

}

const token =
jwt.sign(

{

id:user.id,
email:user.email

},

SECRET,

{

expiresIn:"7d"

}

);

res.json({

token,
user

});

}

);

});

/* PERFIL */

app.get(

"/api/profile/:id",

(req,res)=>{

db.query(

"SELECT * FROM users WHERE id=?",

[
req.params.id
],

(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(
result[0]
);

}

);

});

/* POSTS */

app.post(

"/api/posts",

auth,

(req,res)=>{

const {

content

}=req.body;

db.query(

`INSERT INTO posts
(user_id,content)
VALUES(?,?)`,

[
req.user.id,
content
],

(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json({

message:
"Post criado"

});

}

);

});

/* LISTAR POSTS */

app.get(

"/api/posts",

(req,res)=>{

db.query(

`
SELECT
posts.*,
users.username
FROM posts
JOIN users
ON posts.user_id = users.id
ORDER BY posts.id DESC
`,

(err,result)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json(result);

}

);

});

/* CURTIR */

app.post(

"/api/like",

auth,

(req,res)=>{

const {

post_id

}=req.body;

db.query(

`
INSERT INTO likes
(user_id,post_id)
VALUES(?,?)
`,

[
req.user.id,
post_id
],

(err)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json({

message:
"Curtido"

});

}

);

});

/* COMENTAR */

app.post(

"/api/comment",

auth,

(req,res)=>{

const {

post_id,
comment

}=req.body;

db.query(

`
INSERT INTO comments
(user_id,post_id,comment)
VALUES(?,?,?)
`,

[
req.user.id,
post_id,
comment
],

(err)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json({

message:
"Comentário criado"

});

}

);

});

/* SEGUIR */

app.post(

"/api/follow",

auth,

(req,res)=>{

const {

following_id

}=req.body;

db.query(

`
INSERT INTO followers
(follower_id,following_id)
VALUES(?,?)
`,

[
req.user.id,
following_id
],

(err)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json({

message:
"Seguindo"

});

}

);

});

/* PROJETOS */

app.post(

"/api/projects",

auth,

(req,res)=>{

const {

title,
description

}=req.body;

db.query(

`
INSERT INTO projects
(user_id,title,description)
VALUES(?,?,?)
`,

[
req.user.id,
title,
description
],

(err)=>{

if(err){

return res
.status(500)
.json(err);

}

res.json({

message:
"Projeto criado"

});

}

);

});

/* CHAT SOCKET.IO */

io.on(

"connection",

(socket)=>{

console.log(
"Usuário conectado"
);

socket.on(

"sendMessage",

(data)=>{

io.emit(
"receiveMessage",
data
);

}

);

socket.on(

"disconnect",

()=>{

console.log(
"Usuário saiu"
);

}

);

}

);

/* SERVIDOR */

server.listen(

3000,

()=>{

console.log(
"Servidor rodando"
);

}

);
fetch("http://localhost:3000/api/posts")
// =============================
// INSPIRE AI - SERVER.JS
// =============================

require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const app = express();

// =============================
// CONFIG
// =============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended:true }));

app.use(express.static("public"));

const db = mysql.createPool({

host:process.env.DB_HOST,

user:process.env.DB_USER,

password:process.env.DB_PASSWORD,

database:process.env.DB_NAME,

connectionLimit:10

});

// =============================
// JWT
// =============================

const SECRET =
process.env.JWT_SECRET || "INSPIRE_SECRET";

// =============================
// MIDDLEWARE
// =============================

function auth(req,res,next){

const token=req.headers.authorization;

if(!token){

return res.status(401).json({

message:"Não autorizado"

});

}

try{

const decoded=jwt.verify(token,SECRET);

req.user=decoded;

next();

}catch{

return res.status(401).json({

message:"Token inválido"

});

}

}

// =============================
// CADASTRO
// =============================

app.post("/api/register",(req,res)=>{

const{

name,

email,

password

}=req.body;

bcrypt.hash(password,10,(err,hash)=>{

if(err){

return res.status(500).json(err);

}

db.query(

`INSERT INTO users
(name,email,password)
VALUES(?,?,?)`,

[

name,

email,

hash

],

(err)=>{

if(err){

return res.status(500).json(err);

}

res.json({

message:"Conta criada."

});

}

);

});

});

// =============================
// LOGIN
// =============================

app.post("/api/login",(req,res)=>{

const{

email,

password

}=req.body;

db.query(

"SELECT * FROM users WHERE email=?",

[email],

(err,result)=>{

if(err){

return res.status(500).json(err);

}

if(result.length===0){

return res.status(401).json({

message:"Usuário não encontrado."

});

}

const user=result[0];

bcrypt.compare(

password,

user.password,

(err,same)=>{

if(!same){

return res.status(401).json({

message:"Senha incorreta."

});

}

const token=jwt.sign({

id:user.id,

name:user.name

},

SECRET,

{

expiresIn:"7d"

}

);

res.json({

token,

user

});

});

});

});

// =============================
// NOVA CONVERSA
// =============================

app.post(

"/api/chat",

auth,

(req,res)=>{

const{

title

}=req.body;

db.query(

`

INSERT INTO ai_chats

(user_id,title)

VALUES(?,?)

`,

[

req.user.id,

title

],

(err,result)=>{

if(err){

return res.status(500).json(err);

}

res.json({

chatId:result.insertId

});

}

);

});

// =============================
// SALVAR MENSAGEM
// =============================

app.post(

"/api/message",

auth,

(req,res)=>{

const{

chatId,

role,

message

}=req.body;

db.query(

`

INSERT INTO ai_messages

(chat_id,role,message)

VALUES(?,?,?)

`,

[

chatId,

role,

message

],

(err)=>{

if(err){

return res.status(500).json(err);

}

res.json({

message:"Salvo."

});

}

);

});

// =============================
// LISTAR CHATS
// =============================

app.get(

"/api/chats",

auth,

(req,res)=>{

db.query(

`

SELECT *

FROM ai_chats

WHERE user_id=?

ORDER BY id DESC

`,

[

req.user.id

],

(err,result)=>{

if(err){

return res.status(500).json(err);

}

res.json(result);

}

);

});

// =============================
// LISTAR MENSAGENS
// =============================

app.get(

"/api/messages/:id",

auth,

(req,res)=>{

db.query(

`

SELECT *

FROM ai_messages

WHERE chat_id=?

ORDER BY id ASC

`,

[

req.params.id

],

(err,result)=>{

if(err){

return res.status(500).json(err);

}

res.json(result);

}

);

});

// =============================
// APAGAR CHAT
// =============================

app.delete(

"/api/chat/:id",

auth,

(req,res)=>{

db.query(

"DELETE FROM ai_messages WHERE chat_id=?",

[

req.params.id

],

()=>{

db.query(

"DELETE FROM ai_chats WHERE id=?",

[

req.params.id

],

()=>{

res.json({

message:"Conversa apagada."

});

}

);

});

});

// =============================
// IA V1
// =============================

app.post(

"/api/ask",

auth,

(req,res)=>{

const{

question

}=req.body;

let answer="";

const q=question.toLowerCase();

if(q.includes("html")){

answer="HTML estrutura uma página.";

}

else if(q.includes("css")){

answer="CSS estiliza páginas.";

}

else if(q.includes("javascript")){

answer="JavaScript adiciona interatividade.";

}

else if(q.includes("filme")){

answer="Sugestão: um filme sobre memórias vendidas.";

}

else if(q.includes("música")){

answer="Sugestão: escreva sobre esperança.";

}

else{

answer="Ainda estou aprendendo. 😊";

}

res.json({

answer

});

});

// =============================
// FRONTEND
// =============================

app.get("*",(req,res)=>{

res.sendFile(

path.join(

__dirname,

"public",

"index.html"

)

);

});

// =============================
// START
// =============================

const PORT=

process.env.PORT || 3000;

app.listen(PORT,()=>{

console.log(

"Servidor iniciado na porta",

PORT

);

});