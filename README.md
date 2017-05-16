Proyecto Final Ingenieria de Software 3
=======================================

[![N|Solid](http://www.animatedimages.org/data/media/1618/animated-tux-image-0135.gif)](https://gitlab.com/godie007/proyecto_ingSoftware2)

| Integrante                 | Identificacón | Rol            |
|----------------------------|:-------------:|---------------:|
| Diego Fernando Echevery    |  1097038001   |     Master     |
| Luisa Maria Valderrama     |  1094952380   | Desarrolladora |
| cesar augusto taborda h.   |  1094925887   | Desarrolladora |

Información
===========

La Aplicacióm esta desarrollada en [Node.js](https://nodejs.org/) v4.2.6. La Aplicacióm esta desarrollada en MongoDB [MongoDB](https://www.mongodb.com/) v3.2.1.
tambien instalar Yarn https://yarnpkg.com/lang/en/docs/install/
#Comandos de instalación del aplicativo.

```sh
$ cd proyecto_ingSoftware3
$ yarn install
```
## Tecnologias

| On The Server | On The Client  | Development |
| ------------- | -------------- | ----------- |
| Express       | Bootstrap      | Grunt       |
| Jade          | Backbone.js    |             |
| Mongoose      | jQuery         |             |
| Passport      | Underscore.js  |             |
| Async         | Font-Awesome   |             |
| EmailJS       | Moment.js      |             |

## Configuaración
Acceda a la terminal mongo y use esostos comandos

## Correr en terminal MongoDB

```js
use RaJu
db.admingroups.insert({ _id: 'root', name: 'Root' });
db.admins.insert({ name: {first: 'Root', last: 'Admin', full: 'Root Admin'}, groups: ['root'] });
var rootAdmin = db.admins.findOne();
db.users.save({ username: 'root', isActive: 'yes', email: 'diegof.e3@gmail.com',"password" : "$2a$10$v3iNlSJ/EgmwSVPfbEpsbO18EcGIR9m62hCVocn7e83tcmMVAoo2W", roles: {admin: rootAdmin._id} });
var rootUser = db.users.findOne();
rootAdmin.user = { id: rootUser._id, name: rootUser.username };
db.admins.save(rootAdmin);
```
## Datos del Administrador
usuario Administrador:123
contraseña Administrador:123

## Correr el Aplicativo

```bash
$ npm start
```

 - Ir a `http://localhost:3000/login/`
Listo. Iniciar.


## Filosofia

 - Creacion de un sistema de usuario
 - Creacion de un Sistema para analizar el nivel de madurez de una empresa

## Funcionalidades
 - Crear un sistema de información simple para administrar la busqueda de empresas

## License
MIT
