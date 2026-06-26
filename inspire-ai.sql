-- ======================================
-- INSPIRE AI DATABASE
-- ======================================

CREATE DATABASE IF NOT EXISTS inspire CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE inspire;

-- ======================================
-- USUÁRIOS
-- ======================================

CREATE TABLE users (

id INT AUTO_INCREMENT PRIMARY KEY,

name VARCHAR(120) NOT NULL,

email VARCHAR(150) UNIQUE NOT NULL,

password VARCHAR(255) NOT NULL,

avatar VARCHAR(255) DEFAULT 'default.png',

bio TEXT,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ======================================
-- CONVERSAS
-- ======================================

CREATE TABLE ai_chats (

id INT AUTO_INCREMENT PRIMARY KEY,

user_id INT NOT NULL,

title VARCHAR(255) DEFAULT 'Nova conversa',

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (user_id)

REFERENCES users(id)

ON DELETE CASCADE

);

-- ======================================
-- MENSAGENS
-- ======================================

CREATE TABLE ai_messages (

id INT AUTO_INCREMENT PRIMARY KEY,

chat_id INT NOT NULL,

role ENUM(

'user',

'assistant'

) NOT NULL,

message LONGTEXT,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (chat_id)

REFERENCES ai_chats(id)

ON DELETE CASCADE

);

-- ======================================
-- FAVORITOS
-- ======================================

CREATE TABLE ai_favorites (

id INT AUTO_INCREMENT PRIMARY KEY,

user_id INT,

chat_id INT,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (user_id)

REFERENCES users(id)

ON DELETE CASCADE,

FOREIGN KEY (chat_id)

REFERENCES ai_chats(id)

ON DELETE CASCADE

);

-- ======================================
-- CONFIGURAÇÕES
-- ======================================

CREATE TABLE ai_settings (

id INT AUTO_INCREMENT PRIMARY KEY,

user_id INT UNIQUE,

theme ENUM(

'light',

'dark'

)

DEFAULT 'light',

language VARCHAR(20)

DEFAULT 'pt-BR',

notifications BOOLEAN

DEFAULT TRUE,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (user_id)

REFERENCES users(id)

ON DELETE CASCADE

);

-- ======================================
-- PROMPTS SALVOS
-- ======================================

CREATE TABLE ai_prompts (

id INT AUTO_INCREMENT PRIMARY KEY,

user_id INT,

title VARCHAR(255),

prompt LONGTEXT,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(user_id)

REFERENCES users(id)

ON DELETE CASCADE

);

-- ======================================
-- LOGS
-- ======================================

CREATE TABLE ai_logs (

id INT AUTO_INCREMENT PRIMARY KEY,

user_id INT,

action VARCHAR(150),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(user_id)

REFERENCES users(id)

ON DELETE CASCADE

);

-- ======================================
-- EXEMPLO
-- ======================================

INSERT INTO users

(

name,

email,

password

)

VALUES

(

'Administrador',

'admin@inspire.com',

'$2b$10$123456789012345678901uP7Yv'

);

INSERT INTO ai_chats

(

user_id,

title

)

VALUES

(

1,

'Bem-vindo à Inspire AI'

);

INSERT INTO ai_messages

(

chat_id,

role,

message

)

VALUES

(

1,

'assistant',

'Olá! Eu sou a Inspire AI. Estou pronta para ajudar você com programação, artes, filmes, música e muito mais.'

);