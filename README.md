### Proyecto Full-Stack - React + Node.js + PostgreSQL

### Descripción del Proyecto

Frontend: Aplicación React con componentes para gestión de productos y categorías

Backend: API REST con Node.js y Express

Base de Datos: PostgreSQL con pgAdmin para administración

Contenedores: Docker Compose para orquestación

## Requisitos

Docker (versión 20.10+)

## Instrucciones 

* Crear una carpeta Hfsolution (cualquier nombre distintivo)
* cd "carpeta creada"
* git clone https://github.com/rodolforodriguezgit/hfsolution.git
* verificar la version de Docker (docker -version)
* en a raiz del proyecto a nivel del archivo docker-compose ejecutar el comando docker-compose up --build
* se vera un mensaje de docker-compose up Compiled successfully! 

### contenedor corriendo

Frontend	http://localhost:3000	   Aplicación React
Backend	http://localhost:5000		   API REST
PostgreSQL	localhost:5432		       Base de datos
pgAdmin	http://localhost:8080		   Administración BD

### Credenciales pgAdmin:

Email: admin@hfsolucion.com

Password: supersecret

#### Configuración de servidor en pgAdmin:

Host: postgres

Port: 5432

Database: mi_base

Username: postgres

Password: postgres

#### carga de datos

en un inicio carga pobla los datos con json con los datos recibidos en el correo
