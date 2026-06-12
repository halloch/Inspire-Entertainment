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