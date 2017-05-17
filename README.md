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
use ventas
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
1. Ingresar empresas
2. Modificar Empresas
3. Eliminar Empresas
4. Analizar nivel de la empresa
5. Ordenar la tabla al darle clic a uno de los títulos en la tabla de Empresas
6. Seleccionar cuales filas mostrar en la tabla de Empresas
7. Mostrar cuantas columnas mostrar en la tabla de Empresas
8. Buscar en tiempo real en la tabla de Empresas
9. Generar log de Sugerencias de Mejora
10. Generar grafica radial
11. Ingresar indicadores
12. Ordenar la tabla al darle clic a uno de los títulos en la tabla de Indicadores
13. Seleccionar cuales filas mostrar en la tabla de Indicadores
14. Mostrar cuantas columnas mostrar en la tabla de Indicadores
15. Buscar en tiempo real en la tabla de Indicadores
16. Modificar Indicadores
17. Eliminar Indicadores
18. Ingresar Niveles
19. Modificar Niveles
20. Eliminar Niveles
21. Ordenar la tabla al darle clic a uno de los títulos en la tabla de Niveles
22. Seleccionar cuales filas mostrar en la tabla de Niveles
23. Mostrar cuantas columnas mostrar en la tabla de Niveles
24. Buscar en tiempo real en la tabla de Niveles
25. Ingresar Cuestionarios
26. Modificar Cuestionarios
27. Eliminar Cuestionarios
28. Ordenar la tabla al darle clic a uno de los títulos en la tabla de Cuestionarios
29. Seleccionar cuales filas mostrar en la tabla de Cuestionarios
30. Mostrar cuantas columnas mostrar en la tabla de Cuestionarios
31. Buscar en tiempo real en la tabla de Cuestionarios

## License
Derechos Reservados
