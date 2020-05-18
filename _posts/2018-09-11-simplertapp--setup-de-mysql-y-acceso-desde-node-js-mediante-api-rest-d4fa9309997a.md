---
layout:	"post"
categories:	"blog"
title:	"SimpleRTApp: Setup de MySQL y acceso desde Node.js mediante API REST"
date:	2018-09-11
thumbnail:	/img/1*CJ9uaeA3hAXH1kMbTEQXfA.png
author:	
---

* * *

Esta es la [cuarta parte](https://medium.com/@federicojordn/c%C3%B3mo-obtener-
twitts-relevantes-en-una-app-de-ios-con-heroku-nodejs-swift-4c4aca1f42b2) de
una serie de articulos que tiene como objetivo construir un sistema para
notificar tweets relevantes y la posibilidad de retuitearlos, en una app iOS.

En este caso vamos a ver como configurar la base de datos MySQL y como
realizar consultas desde Node.js.

#### ¿Que vamos a ver?

  * Instalacion y configuracion de MySQL
  * Creacion de tablas y atributos
  * Script basico en Node.js para conectarse con la BD
  * Consultas necesarias para SimpleRTApp

#### Requerimientos

Para poder seguir este articulo, es necesario tener un concepto basico sobre
tablas relacionales, consultas SQL y tener instalado Node.js en el sistema.

#### ¿Por que MySQL?

 **MySQL** , es un sistema de gestion de base de datos relacional o SGBD. Este
gestor de base de datos es multithread y multiusuario, lo que le permite ser
utilizado por varias personas al mismo tiempo, e incluso, realizar varias
consultas a la vez, lo que lo hace sumamente versatil.

Nacio como una iniciativa de **Software Libre** y a un sigue ofreciendose como
tal, para usuarios particulares. Pero si se desea utilizarlo para promover
datos en una empresa, se puede comprar una licencia, como un software
propietario, que es autoria de la empresa patrocinante (Oracle).

Voy a pasar a comentar algunas ventajas de MySQL como motor de BD:

  * Es facil de usar
  * El soporte es accesible siempre y cuando se necesite
  * Es de codigo abierto
  * Es increiblemente barato
  * Es un estandar de la industria (y sigue siendo bastante popular)

En cambio, tambien tiene sus desventajas:

  * Tiene algunos inconvenientes de estabilidad
  * Sufre de poca performance de escabilidad
  * Su desarrollo no esta dirigido por la comunidad
  * Su funcionalidad es bastante dependiente de add-ons
  * Los desarrolladores pueden encontrar algunas de sus limitaciones un poco frustrantes.

#### Otras opciones en el mercado

Si bien elegi MySQL para este proyecto, no hay nada que nos impida de usar
otras opciones existentes en el mercado. Las mas importantes son:

  * MariaDB
  * PostgreSQL
  * SQLServer
  * MongoDB

### Instalacion y configuracion de MySQL local

  1. Descargamos el paquete `.dmg` en este [link](http://dev.mysql.com/downloads/mysql/). Seguimos los pasos de la instalacion, instalando todos los componentes que vienen por defecto. Mas informacion de como instalar MySQL [aca](https://dev.mysql.com/doc/refman/5.7/en/osx-installation-pkg.html).

![](/img/1*CJ9uaeA3hAXH1kMbTEQXfA.png)

2\. Al final de la instalacion se nos proveera credenciales para la cuenta de
tipo `root`. Algo a tener en cuenta es que MySQL expira esta contraseña rapido
por cuestiones de seguridad, por lo que vamos a tener que cambiarla ni bien se
nos es dada. Mas informacion en este [link](https://dev.mysql.com/doc/mysql-
getting-started/en/#mysql-getting-started-installing).

3\. Instalamos la aplicacion [SequelPro](https://www.sequelpro.com/),
descargando el paquete en este [link](https://sequelpro.com/download#auto-
start). Esta aplicacion nos servira para interactuar y configurar nuestra base
de datos. En ella ingresamos nuestras credenciales de tipo root para poder
comenzar a operar.

4\. Creamos una base de datos nueva yendo al menu `Bases de datos -> Añadir
base de datos...`. Ponemos un nombre como `simplertapp` y le damos a Añadir.

![](/img/1*5NSI6KH1HTuY9VR2rdYS_Q.png)

Creamos una nueva base de datos

5\. Creamos una tabla yendo al boton de `+` abajo a la izquierda. Ponemos un
nombre como `tweet_request` y le damos a Añadir.

![](/img/1*etc7PBVBruuBWZy3VlwERA.png)

Creamos una nueva tabla

6\. Creamos los campos de la tabla tocando el boton `+` en la vista de campos,
el mismo se encuentra arriba de donde dice `ÍNDICES`. Por defecto se creara
con el tipo `INT`. Le pondremos de nombre `id`, ya que sera el identificador
de los `tweet_request` de los usuarios.

Siguiendo los pasos ya mencionados, creamos las siguientes tablas con sus
respectivos campos:

![](/img/1*nP86BdJZTe9yPUH2ToFo8Q.png)

![](/img/1*5B2jyt_XXqxP9phuLZ8PKg.png)

Es importante setear el tipo a `VARCHAR` y la longitud de `device_token` y
`hashtags` a un valor mas alto para poder usar estos campos.

Habiendo creado las tablas, ya tenemos la base de datos debidamente
configurada para poder realizar consultas a ella.

### Uso de Node.js para consulta, update y eliminacion

  1. Instalamos el paquete de MySQL haciendo `npm install mysql --save` a traves de la terminal.
  2. Creamos un script llamando `mysql_example.js` con el siguiente contenido:

Primero, cargamos la biblioteca para las variables de entorno e instanciamos
la requerida para trabajar con MySQL.

Luego, creamos la conexion a la base de datos, seteando los valores
necesarios:

  * `host`: Es la direccion en la cual esta hosteada nuestra DB. Por el momento tendra el valor de `127.0.0.1`
  * `user`: Es nuestro nombre de usuario. En este caso seria `root`.
  * `password`: Es la contraseña que seteamos anteriormente para usar SequelPro
  * `database`: Es el nombre de la base de datos. En nuestro caso va a ser `simplertapp`.

Para setear estos valores, yo cree un archivo `.env` para guardar estos
valores de forma mas segura. Mas informacion
[aca](https://www.npmjs.com/package/node-env-file).

Por ultimo, realizamos la siguiente consulta SQL a la base de datos:

    
    
    INSERT INTO tweet_request (device_token, hashtags) VALUES ('ExampleDeviceToken', '#Example #Hashtags')

La cual insertara los valores `ExampleDeviceToken` y `"#Example #Hashtags"`
como valores de un primer registro. El campo `id` no es necesario
especificarlo ya que es autoincremental.

Si todo salio bien, el script finalizara, en caso contrario nos mostrara en
consola el error encontrado.

3\. Ejecutamos el script haciendo `node mysql_example.js` en la terminal.

![](/img/1*2KBIS6UzChUaGXZvkg4NsA.png)

Para comprobar que el campo se inserto correctamente vamos a SequelPro,
seleccionamos la tabla `tweet_request` y en la pestaña Contenido vemos el
registro insertado:

![](/img/1*AvR__qJtgUM-Ei8mBViXLg.png)

Con esto creamos nuestro primer script en Node.js que permite insertar
registros en una base de datos MySQL.

Pueden encontrar el codigo del script en
[https://github.com/fedejordan/SimpleRTAppAPI,](https://github.com/fedejordan/SimpleRTAppAPI)
con el tag `mysql_example`. Es importante que configuren en el archivo `.env`
las propiedades correspondientes para la conexion con la base de datos.

### Uso de MySQL en SimpleRTAppApi

Como vimos en el [post de creacion de la API
REST](https://medium.com/@federicojordn/simplertapp-estructura-b%C3%A1sica-de-
una-api-rest-en-node-js-64b4c413c85c), los datos los estabamos consultando y
manipulando en memoria. La idea es poder guardar toda esa informacion en una
base de datos, para que pueda ser debidamente consultada y manipulada mediante
nuestra API hecha en Node.js.

Repasando los endpoints disponibles en nuestra API, vamos a necesitar entonces
las siguientes funcionalidades:

  * Consultar registros `tweet_request` mediante su `id`.
  * Eliminar registros `tweet_request` mediante su `id`.
  * Insertar registros `tweet_request` especificando su `device_token` y su `hashtags`.
  * Insertar registros `posted_tweet` especificando su `tweet_request_id` y su `tweet_id`.

Para ello vamos a crear un archivo de conexion con la BD llamado
`databaseHelper.js` donde se realizara la conexion principal con la base de
datos y la consulta indicada mediante un parametro `sqlQuery`.

Nota: Por propositos de simpleza, se creara una conexion a la BD por cada
request recibido. Esto en realidad **NO ES PERFORMANTE** , ya que se deberia
manejar mediante un pool de conexiones, pero no se abarcara el tema en este
articulo. Mas informacion sobre pool de conexiones
[aca](http://www.madhur.co.in/blog/2016/09/05/nodejs-connection-pooling.html).

Seguimos con la creacion de un archivo `tweetRequestDatabase.js` en la carpeta
`api/database` con el siguiente contenido:

En el mismo obtenemos la referencia al `databaseHelper`, y mediante los
parametros mandados a la funcion `insertTweetRequest` creamos la debida
consulta SQL y la ejecutamos.

Por ultimo, cambiamos nuestro `tweetRequestController.js` con lo siguiente:

Como cambios a lo que ya teniamos, obtenemos la refencia a
`tweetRequestDatabase` e insertamos el objeto `tweetRequest` construido en la
base de datos mediante
`tweetRequestDatabase.insertTweetRequest(tweetRequest)`.

Iniciamos el server en la terminal mediante `node server.js` y abrimos el
Postman para realizar `POST /tweetRequest`:

![](/img/1*tzhr_nRvGsWkZmRcxwsG-A.png)

Debido a que seguimos manteniendo el array en memoria, seguimos teniendo el
`id` 10.

Vamos a SequelPro a ver si se inserto nuestro registro:

![](/img/1*muG7NUbql68ZkDMCJZ7q2g.png)

Debimos cuantos valores insertamos previamente, el campo `id` puede ser
diferente. En mi caso borre el anterior que habiamos insertado con el script
`mysql_example.js` y reinicie el `id` autoincremental. Para hacerlo basta con
ejecutar el siguiente comando en SequelPro, en la pestaña Consulta:

    
    
    ALTER TABLE tweet_request AUTO_INCREMENT = 1

Con esto, nuestra API ya es capaz de insertar valores en la base de datos ;)

#### Ejemplo completo

Con lo visto anteriormente, podemos terminar los otros endpoints de la api.
Deberia quedarnos algo parecido a lo siguiente:

En `tweetRequestDatabase.js` agregamos las funciones para hacer el `SELECT` y
el `DELETE` correspondientes, mediante un determinado `tweetRequestId`.
Agregamos el `callback` para saber cuando se termino la operacion de lectura o
escritura.

En `tweetRequestController.js` borramos toda la logica relacionada con el
array en memoria, y hacemos uso del `callback` que nos da
`tweetRequestDatabase` para mandar el status `200` a la respuesta, y
finalizarla.

Agregamos el correspondiente `postedTweetDatabase.js` para enviar el `INSERT`
con los datos del `postedTweet` a la base de datos.

Por ultimo, tambien actualizamos `postedTweetController.js` para poder usar
`postedTweetDatabase` y si todo salio bien enviar el correspondiente status
`200`.

Con esto finalizamos todos los requisitos para que nuestra API REST consulte,
elimine e inserte registros en una base de datos MySQL :)

#### Algunas consideraciones

Debido a la simplicidad con la que se quiso explicar el tema, no se tuvieron
en cuenta diferentes cuestiones:

  * No es performante crear una conexion por cada request dado. Esto es inescalable, y requiere crear un pool de consultas. Voy a tratar este asunto en un articulo mas adelante. [Mas informacion aca](http://www.madhur.co.in/blog/2016/09/05/nodejs-connection-pooling.html).
  * No se manejan estados de error, por cada fallo que surja (por ejemplo, querer eliminar un `tweetRequest` con un `tweetRequestId` no encontrado) no se envian status de error. Esto es fundamental si queremos comunicar al cliente que fallo, y poder manejar ese error apropiadamente. Ver [manejo de errores](http://expressjs.com/es/4x/api.html).

### Conclusiones

Instalamos MySQL. Vimos como configurar una base de datos en entorno local. Lo
aprendimos de manera sencilla, simplemente usando SequelPro, con el cual
creamos tablas y campos de diferentes tipos.

Despues, vimos como interactuar con una base de datos MySQL desde Node.js.
Vimos como hacer operaciones de consulta, insercion y eliminacion de
registros. Finalmente, integramos estas operaciones a la API REST que habiamos
construido en [el articulo anterior](https://medium.com/@federicojordn
/simplertapp-estructura-b%C3%A1sica-de-una-api-rest-en-node-js-64b4c413c85c)

Si bien no todos los programadores usamos Node.js y MySQL en nuestro dia a dia
de trabajo, considero que minimamente seguir estos pasos nos dara una nocion
basica de como esta construida una API REST, y podremos tener un entendimiento
mayor a nivel completo del sistema.

En el proximo articulo vamos a configurar nuestra app iOS para poder consumir
todas estas APIs.

¡Gracias por leer el articulo!

#### Fuentes

  * <http://culturacion.com/que-es-y-para-que-sirve-mysql/>
  * <https://www.datarealm.com/blog/five-advantages-disadvantages-of-mysql/>
  * <https://blog.capterra.com/3-standout-mysql-alternatives/>
  * <https://www.slant.co/options/4216/alternatives/~mysql-alternatives>
  * <https://dev.mysql.com/doc/refman/5.7/en/osx-installation-pkg.html>
  * <https://dev.mysql.com/doc/mysql-getting-started/en/#mysql-getting-started-installing>
  * <https://www.w3schools.com/nodejs/nodejs_mysql_insert.asp>
  * <https://www.npmjs.com/package/node-env-file>

