---
layout:	"post"
categories:	"blog"
title:	"SimpleRTApp: Twitter Search API con Node.js"
date:	2018-04-20
thumbnail:	/img/1*LxEsarjDL_y7RWeZj5b1oA.png
author:	
tags: twitter-api nodejs authentication javascript simple-rt-app spanish
---

* * *

Esta es la segunda parte de una serie de articulos que escribi con el objetivo
de tener un sistema que me notifique tweets de mi interes, y mediante una app
pueda retuitearlos a mi gusto. Para ver la lista completa hacer click
[aca](https://medium.com/@federicojordn/c%C3%B3mo-obtener-twitts-relevantes-
en-una-app-de-ios-con-heroku-nodejs-swift-4c4aca1f42b2).

En esta ocasion vamos a ver como obtener tweets mediante la API de Twitter en
Node.js. Para ello, vamos a ver como realizar la autenticacion para una app y
ver como trabaja la Search API de Twitter para obtener esta informacion

#### Requisitos

Es necesario tener configurada una app en Twitter. En la [primer parte de este
articulo](https://medium.com/@federicojordn/simplertapp-authentication-y
-retweet-con-twitter-api-en-ios-4829d489de74) lo explico con detalles. Ademas
de tener configurado `npm` localmente.

### Application-only Authentication

Twitter ofrece la posibilidad de autenticar las consultas a su API con la
autenticacion de app. Esto significa que solo podremos realizar cosas que no
requieren la autorizacion de un usuario. Algunas funcionalidades que tendremos
disponibles son las siguientes:

  * Traer tweets de usuarios publicos
  * Acceder a los amigos y seguidores de cualquier cuenta
  * Buscar en tweets
  * Obtener cualquier informacion de algun usuario

En cambio, algunas cosas que no podremos hacer son las siguientes:

  * Postear tweets o algun otro recurso
  * Conectarse a puntos de streaming
  * Buscar por usuarios
  * Usar cualquier punto de geolocalizacion
  * Acceder a los mensajes directos o credenciales de usuarios

#### Pasos de Auth Flow

El flujo de Application-only authentication comprende los siguientes pasos:

  * Una aplicacion encodea su **Consumer Key** y su **Consumer Secret** en un conjunto especial de credenciales
  * La aplicacion hace un request al endpoint `POST Oauth2/token` para cambiar credenciales por un token de tipo **Bearer**
  * Cuando se quiera acceder a la API REST, la aplicacion usa el **Bearer token** para autenticar.

Mas informacion de estos conceptos lo pueden encontrar en [la documentacion
oficial de
Twitter](https://developer.twitter.com/en/docs/basics/authentication/overview
/application-only).

### Ejemplo de obtencion de un Bearer token

Vamos a ver un ejemplo de generacion de Bearer token y consulta de la API de
Twitter con ese token. Para ello vamos a encodear la **Consumer Key** y la
**Consumer Secret** , obtenemos el Bearer de Twitter, y comprobamos que
hicimos todo bien haciendo un request de un timeline.

#### Paso 1: Encodear Consumer Key y Consumer Secret

  1. Hacer un URL Encode a la Consumer Key y la Consumer Secret con el estandar RFC 1738. Supongamos que tenemos las siguientes claves:

    
    
    ConsumerKey: xvz1evFS4wEEPTGEFPHBog 
    
    
    ConsumerSecret L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg

Realizamos el URL encode en RFC 1738 (por ejemplo, en [esta
pagina](https://www.urldecoder.org/)) y obtenemos:

    
    
    ConsumerKey: xvz1evFS4wEEPTGEFPHBog
    
    
    ConsumerSecret L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg

Algo a notar es que en la actualidad estas claves van a mantener su valor
despues de codificarlas. Pero es importante mantener este paso en caso de que
su valor cambie en el futuro

2\. Concatenar los valores encodeados con el caracter de dos puntos (`:`) en
una unica cadena de texto. Nuestros valores quedarian de la siguiente forma:

    
    
    xvz1evFS4wEEPTGEFPHBog:L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg

3\. Encodear la string generada con el estandar **Base64**. Puede hacerse en
una p agina como [esta](https://www.base64encode.org/). Esto nos daria como
resultado:

    
    
    :: eHZ6MWV2RlM0d0VFUFRHRUZQSEJvZzpMOHFxOVBaeVJnNmllS0dFS2hab2xHQzB2SldMdzhpRUo4OERSZHlPZw==

Este valor se va a usar en las credenciales para el endpoint de generacion del
**Bearer token**.

#### Paso 2: Obtener un Bearer token

El valor obtenido anteriormente puede ser cambiado por un **Bearer token**
haciendo un request a `POST Oauth2/token`. Para ello:

  * La request debe ser HTTP de tipo POST
  * Debe incluir un header `Authorization` con el valor de `Basic <valor obtenido en paso 2>`
  * Debe incluir un header `Content-Type` con el valor de `application/x-www-form-urlencoded;charset=UTF-8`
  * El body de la request debe ser `grant_type=client_credentials`

Nuestra request entonces seria de la siguiente forma:

    
    
    POST /oauth2/token HTTP/1.1  
    Host: api.twitter.com  
    User-Agent: My Twitter App v1.0.23  
    Authorization: Basic eHZ6MWV2RlM0d0VFUFRHRUZQSEJvZzpMOHFxOVBaeVJn  
                         NmllS0dFS2hab2xHQzB2SldMdzhpRUo4OERSZHlPZw==  
    Content-Type: application/x-www-form-urlencoded;charset=UTF-8  
    Content-Length: 29  
    Accept-Encoding: gzip  
      
    grant_type=client_credentials

Comprobamos en [Postman](https://www.getpostman.com/) que nos de el Bearer:

![](/img/1*LxEsarjDL_y7RWeZj5b1oA.png)

Respuesta con el Bearer token

#### Paso 3: Autenticar una API request con el bearer token

El bearer token obtenido se puede utilizar para consultar API endpoints que
soporten Application-only authentication. Para usar este token, al momento de
contruir el request HTTP se debera incluir un header `Authorization` con el
valor `Bearer <valor generado en paso 2>`.

Request de ejemplo:

    
    
    GET /1.1/statuses/user_timeline.json?count=100&screen_name=twitterapi HTTP/1.1  
    Host: api.twitter.com  
    User-Agent: My Twitter App v1.0.23  
    Authorization: Bearer AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2FAAAAAAAAAAAA  
                          AAAAAAAA%3DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA  
    Accept-Encoding: gzip

Estos pasos fueron extraidos de [la documentacion oficial de
Twitter](https://developer.twitter.com/en/docs/basics/authentication/overview
/application-only).

### Twitter Search API en Node.js

Ya habiendo obtenido el Bearer token para poder realizar requests con nuestra
app, podemos empezar a ver que nos ofrece la API de Twitter. En concreto, lo
que queremos es tener una lista de los tweets mas recientes en base a cierta
busqueda o hastags.

Es por eso que vamos a usar el package `twitter` para Node.js. La
documentacion oficial se encuentra
[aca](https://www.npmjs.com/package/twitter).

En los siguientes pasos voy a asumir que tienen configurado Node.js
apropiadamente. Si no lo tienen, pueden echar un vistazo
[aca](https://nodejs.org/en/download/package-manager/).

Para hacer un simple script que nos muestre tweets en base a ciertos hashtags
vamos a seguir estos pasos:

  1. Vamos a la terminal y hacemos `npm install twitter`. Esto nos va a crear la carpeta `node_modules` con la biblioteca de Twitter.
  2. Ingresamos tambien `npm install dotenv` para poder usar un archivo de configuracion de variables de entorno.
  3. Creamos un archivo `.env` y agregamos el siguiente contenido:

    
    
    TWITTER_CONSUMER_KEY=<ConsumerKey>  
    TWITTER_CONSUMER_SECRET=<ConsumerSecret>  
    TWITTER_BEARER_TOKEN=<BearerToken>

Donde reemplazaremos `<ConsumerKey>`, `<ConsumerSecret>` y `<BearerToken>` por
los valores para nuestra app de Twitter.

4\. Creamos un script de JavaScript `relevant_tweets.js` con el siguiente contenido:

<script src="https://gist.github.com/fedejordan/c35d91dcb99c84f2cc6f5b6fafc215ac.js"></script>

En este script hacemos lo siguiente:

  * Instanciamos un cliente de Twitter y le indicamos las variables configuradas en `.env`.
  * Hacemos un request de tipo `GET` a `search/tweets` con parametros `q: "#ios #swift"`.
  * Mostramos el resultado en consola

5\. Corremos `node relevant_tweets.js` en la consola y vemos que nos muestra:

![](/img/1*vl1_0Y5RgoQxvb5GCQgglg.png)

Tweets con hashtags #ios #swift

Nos muestra los tweets mas relevantes que contengan los hashtags `#ios` y
`#swift`.

Pueden encontrar el proyecto finalizado en
[https://github.com/fedejordan/SimpleRTAppAPI,](https://github.com/fedejordan/SimpleRTAppAPI)
tag `relevant_tweets`.

### Conclusiones

Aprendimos como funciona la autenticacion de app de Twitter. Generamos las
credenciales necesarias para poder utilizarla, y vimos un ejemplo practico en
Node.js de como usar la Search API de Twitter, para obtener tweets con ciertos
hashtags.

Mas adelante voy a convertir este script en un cron que pueda recorrer los
hashtags relevantes para el usuario, y puedan ser enviados como push
notifications a sus dispositivos.

Cualquier consulta o sugerencia pueden hacerla comentando este post o enviando
un mail a fedejordan99@gmail.com. Tambien pueden seguirme y mandar un mensaje
privado a [mi twitter](https://twitter.com/FedeJordan90).

¡Muchas gracias por leer el articulo!

*Este artículo tambien esta disponible para ver en [Medium](https://medium.com/@federicojordn/simplertapp-twitter-search-api-con-node-js-499a124ff451)*