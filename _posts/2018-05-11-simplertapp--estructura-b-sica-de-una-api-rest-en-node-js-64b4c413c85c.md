---
layout:	"post"
categories:	"blog"
title:	"SimpleRTApp: Estructura básica de una API REST en Node.js"
date:	2018-05-11
thumbnail:	/img/1*DIBoxvx-TEHamwuGcxr8Zg.png
author:	
---

* * *

Esta es la tercer parte de una serie de articulos destinados a desarrollar un
sistema muy simple, en el cual se le envien notificaciones al usuario sobre
tweets con hashtags relevantes cada cierto tiempo definido.
[Aca](https://medium.com/@federicojordn/c%C3%B3mo-obtener-twitts-relevantes-
en-una-app-de-ios-con-heroku-nodejs-swift-4c4aca1f42b2) esta la lista
completa.

En esta oportunidad, vamos a ver como estructurar una API bastante simple en
Node.js, que dependencias necesitamos para nuestro proyecto, y que recursos
debemos de proveer a la app mobile para poder operar con una DB hecha en
MySQL.

Por mi parte, voy a tratar de ser lo mas simple posible, ya que el escribir
este articulo tambien sera un proceso de aprendizaje para mi :)

#### Conceptos

Vamos a ver lo siguiente:

  * Que es una API REST y como funciona
  * Setup basico de un server en ambiente local
  * Routing de servicios
  * Capa de controlador

### ¿Que es una API REST?

REST es un acronimo de Representational State Transfer. Es un estandar web
para arquitectura y protocolo HTTP. La arquitectura REST describe seis
restricciones que fueron originalmente comunicadas por Roy Fielding en su
tesis doctoral y define la base del estilo RESTful con lo siguiente:

  * Interfaz uniforma
  * Sin estados
  * Cacheable
  * Comunicacion cliente-servidor
  * Sistema de capas
  * Codigo en demanda (opcional)

Las aplicaciones RESTful usan requests HTTP para realizar operaciones de tipo
CRUD (C: create, R:read, U:update y D: delete). Create y/o Update se utilizan
para postear data, Read para leer o enlistar datos y Delete para eliminar.

### Setup de un server local en Node.js

  1. Creamos una carpeta donde tendremos la API. En nuestro caso sera `SimpleRTAppAPI`. Para ello hacemos `mkdir SimpleRTAppAPI` en la aplicacion de Terminal. Nos situamos en la carpeta con `cd SimpleRTAppAPI`.
  2. Creamos un archivo `package.json` con el comando `npm init`. Esto nos permitira identificar al proyecto ademas de ver las dependencias que necesita. Indicamos valores como package name (`simplertappapi`), autor, descripcion, version, archivo de entrada (sera `index.json `en nuestro caso) y demas campos.

    
    
    SimpleRTAppAPI federicojordan$ npm init  
    This utility will walk you through creating a package.json file.  
    It only covers the most common items, and tries to guess sensible defaults.
    
    
    See `npm help json` for definitive documentation on these fields  
    and exactly what they do.
    
    
    Use `npm install <pkg>` afterwards to install a package and  
    save it as a dependency in the package.json file.
    
    
    Press ^C at any time to quit.  
    package name: (simplertappapi)   
    version: (1.0.0)   
    keywords:   
    author:   
    license: (ISC)   
    About to write to /Users/federicojordan/Blog/SimpleRTAppAPI/package.json:
    
    
    {  
     "name": "simplertappapi",  
     "version": "1.0.0",  
     "description": "Simple API to trigger relevant tweets in push notifications",  
     "main": "index.js",  
     "dependencies": {  
     "dotenv": "⁵.0.0",  
     "twitter": "¹.7.1"  
     },  
     "devDependencies": {},  
     "scripts": {  
     "test": "echo \"Error: no test specified\" && exit 1"  
     },  
     "repository": {  
     "type": "git",  
     "url": "git+https://github.com/fedejordan/SimpleRTAppAPI.git"  
     },  
     "author": "",  
     "license": "ISC",  
     "bugs": {  
     "url": "https://github.com/fedejordan/SimpleRTAppAPI/issues"  
     },  
     "homepage": "https://github.com/fedejordan/SimpleRTAppAPI#readme"  
    }  
      
    
    
    
    Is this ok? (yes)

Comprobamos que los datos sean correctos y damos enter para confirmar la
creacion del archivo.

3\. Instalamos el package `express` mediante el comando `npm install express
--save`. Esta dependencia nos permitira crear el servidor y escuchar
solicitudes HTTP.

4\. Creamos un archivo `server.js` con el siguiente contenido:

{% gist a371d021941d6989cd623273ffcded93 %}

5\. Hacemos `node server.js` en la terminal y ya deberiamos ver nuestro primer
servidor haciendo escuchas en el puerto 3000. Podemos cambiar el puerto de
escucha tambien usando una variable de entorno `PORT` en nuestro archivo de
configuracion `.env`.

    
    
    SimpleRTAppAPI federicojordan$ node server.js   
    SimpleRTAppAPI server started on: 3000

### Realizacion de la API para SimpleRTApp

Vamos a comenzar a escribir los endpoints necesarios para SimpleRTApp. Como
todavia no seteamos la base de datos, vamos a usar datos en memoria con
propositos de aprendizaje. Esto significa que si nuestro server se reinicia,
se perderan todos los datos modificados desde que se lanzo.

#### Endpoints a realizar

  1.  **Consulta de hashtags para un device_token:** Es necesario tener la posibildad de saber que hashtags le corresponden a cierto device_token, en caso que el usuario abra la app nuevamente.
  2.  **Guardado de un device_token asociado a ciertos hashtags** : Cuando el usuario decide de que hashtags quiere ser informado, se llamara a este recurso para guardar en la base de datos los hashtags para su diceToken
  3.  **Eliminaci on de un device_token**: En caso de que el usuario quiera desuscribirse a las notificaciones, simplemente se debera llamar a este endpoint para remover su deviceToken de la base de datos.
  4.  **Guardado de id de tweet posteado** : Es importante tambien, guardar los tweets que fueron posteados por el usuario gracias a la app, de forma que la siguiente vez que se notifique no se repita el tweet ya posteado.

#### Routing layer

La capa de routing se refiere a como una aplicacion responde a una request de
un cliente para un determinado endpoint, es decir, para una ruta especifica y
para un metodo HTTP determinado (GET, POST, DELETE, etc).

En nuestro caso vamos a tener 4 routings, que se corresponden con el numero de
endpoints descriptos arriba.

#### Controller layer

Se encarga de realizar la logica necesaria para cumplir con el request
solicitado. La capa de controller tiene el acceso a los modelos, y puede
agregar, modificar, eliminar, consultar segun se explicite. Se accede mediante
una ruta definida en la capa de routing.

Nuestros controllers tendran la logica para guardar device_token con hashtags,
eliminar device_token, guardar el id de tweet posteado y consultar hashtags
para un device_token especifico.

Vamos a comenzar con el endpoint mas sencillo, consultar hashtags para un
device_token.

#### Primer endpoint: Consulta de hashtags

1. Creamos un archivo `tweetRequestRoutes.js` en la carpeta `api/routes` con el siguiente contenido:

{% gist 7fd4ee107dc135a4827df08f3519dcff %}

Esto nos indica que para la ruta `/tweetRequest` vamos a estar esperando una
request de tipo `GET` con un parametro de tipo `tweetRequestId`. Por su parte,
`tweetRequestController` tendra la logica de devolver el dato buscado en su
funcion `getTweetRequest`.

2\. Creamos un archivo `tweetRequestController.js` en la carpeta
`api/controllers` con el siguiente contenido:

{% gist bb102d9351d29589dcc82ef3c9b052f9 %}

En este caso exportamos la funcion `getTweetRequest` para que pueda ser usada
por el `tweetRequestRoutes.js`. Buscamos el objeto `tweetRequest` en el array
que creamos mas abajo y lo devolvemos en formato JSON.

3\. Actualizamos nuestro archivo `server.js` para que pueda manejar la ruta
necesaria y devuelva una respuesta HTTP:

{% gist f1923ec13ca4267317068bb4517984f5 %}

De esta forma configuramos el server para que acepte URL encoded y maneje
respuestas de tipo JSON. Ademas, delegamos el routing a `tweetRequestRoutes`.

4\. Hacemos `node server.j`en la carpeta root del proyecto, abrimos Postman y
probamos hacer un GET a `http://localhost:3000/tweetRequest/1`

![](/img/1*DIBoxvx-TEHamwuGcxr8Zg.png)

Si probamos con otro `tweetRequestId` deberia darnos sus campos, siempre y
cuando lo hayamos definido en el array.

Si probamos con otro id, o cambiamos el metodo HTTP (por un POST, por
ejemplo), o cambiamos la ruta deberia darnos error. Mas adelante deberiamos
definir devolver HTTP error codes para que el cliente pueda manejar el error
correctamente.

### Codigo final

Una vez que entendimos a grandes rasgos como funciona el proceso, podemos
lanzarnos a hacer los otros endpoints.

Nuestro codigo deberia quedar mas o menos parecido a lo siguiente:

{% gist e44af6e869ba43ffbba4322d98bda3f1 %}

En `server.js` agregamos otro archivo de routing para la entidad
`PostedTweet`, la cual nos indicara si un tweet ya fue posteado por parte de
un usuario.

{% gist 19e7c39006c9561906aff91325f74a08 %}

Agregamos la posibilidad de crear `TweetRequest` mediante el metodo `POST` y
creando una funcion `createTweetRequest` en `tweetRequestController.js`.
Ademas, hicimos el endpoint de borrar `TweetRequest`s mediante el metodo
`DELETE`, el cual el routing redirecciona a la funcion `deleteTweetRequest`.

{% gist a588b01005a1e507af9b92e9478be2dc %}

En `tweetRequestController.js` agregamos las siguientes funciones:

  * `createTweetRequest`: Se obtiene el maximo valor de `id` en el array `tweetRequests`, se crea el objeto JSON con ese valor incrementado, los valores de `req.body.device_token` y `req.body.hashtags` y se agrega al array en memoria.
  * `deleteTweetRequest`: se elimina el `TweetRequest` con la funcion `filter` y se obtiene como respuesta el total del array.

Agregamos ademas dos archivos: `postedTweetRoutes.js` y
`postedTweetController.js`:

{% gist b80d932f592d608d3976537b0dd311e9 %}

Creamos un metodo POST el cual estara asociado a la funcion
`createdPostedTweet` de `postedTweetController`. Esto nos servira para indicar
que tweet ya han sido posteados por el usuario.

{% gist 49a9c2490468cd0d107c1dea77824660 %}

En el caso del controller la funcion `createdPostedTweet` crea los
`PostedTweet` a partir del ultimo `id` que encuentra en el array
`postedTweets` (si no encuentra usa 1 como primer `id`) y usa los valores
`req.body.tweet_request_id` y `req.body.tweet_id` para crear objeto de tipo
JSON e insertarlo en el array. Como respuesta devuelve todo el array para
asegurarnos de que fue insertado.

Recomiendo probar los diferentes endpoints con Postman para asegurar de que
todo funciona segun lo esperado.

Pueden encontrar el codigo completo en
[https://github.com/fedejordan/SimpleRTAppAPI,](https://github.com/fedejordan/SimpleRTAppAPI)
tag `rest_api`.

### Conclusiones

Aprendimos que es una API REST y como nos puede ser util en nuestro proyecto,
como una correcta definicion de los servicios web es la pieza fundamental para
entender la arquitectura de nuestro sistema.

Creamos un server basico para ver cuales son los pasos minimos de instalacion
y que dependencias necesita.

Tuvimos que ver que entidades usamos, que recursos necesitamos, y como
separamos la logica en las capas de routing y controllers.

Espero que hayan disfrutado el articulo. Seguramente no sera lo mas
performante del mundo, pero creo que es un primer paso para enteder como
funciona la estructura de una API minima.

En el siguiente articulo vamos a ver como interactuar realmente con una base
de datos MySQL y hacer el setup necesario en ambiente local de la misma.

Cualquier consulta, sugerencia o duda pueden dejar un comentario o enviarme un
mail a fedejordan99@gmail.com

¡Muchas gracias!

#### Fuentes

  * <https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd>
  * <http://thejackalofjavascript.com/architecting-a-restful-node-js-app/>
  * <http://expressjs.com/en/api.html>
  * <https://www.w3schools.com/jsref/jsref_tostring_number.asp>

