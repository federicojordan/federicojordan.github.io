---
layout:	"post"
categories:	"blog"
title:	"SimpleRTApp: Deploy de una app en Node.js a Heroku"
date:	2019-04-09
thumbnail:	/img/1*cyxsl8nTk3YpzheR7uCpEA.png
author:	
tags: nodejs javascript heroku simple-rt-app spanish
---

* * *

Este post es parte de una serie que explica como obtener tweets relevantes,
basados en hashtags, como notificaciones en un app en iOS. Pueden ver el post
principal [aca](https://medium.com/@federicojordn/c%C3%B3mo-obtener-twitts-
relevantes-en-una-app-de-ios-con-heroku-nodejs-swift-4c4aca1f42b2).

En esta ocasion, vamos a ver como subir nuestra app y base de datos local a
Heroku.

### ¿Que es Heroku?

Heroku es una plataforma de Cloud Service que nos permite deployar, ejecutar y
administrar aplicaciones escritas en Ruby, Node.js, Java, Python, Clojure,
Scala, Go y PHP.

Los Dynos son piezas fundamentales del modelo de arquitectura de Heroku, son
las unidades que proveen capacidad de computo dentro de la plataforma. Estan
basados en [Contenedores Linux](https://es.wikipedia.org/wiki/LXC "LXC").

Cada Dyno esta aislado del resto, por lo que los comandos que se ejecutan y
los archivos que se almacenan en un Dyno, no afectan a los otros. Ademas
proveen el ambiente requerido por las aplicaciones para ser ejecutadas.

### Creacion de app en Heroku

Para poder comenzar a operar con Heroku, creamos nuestra cuenta en
<https://id.heroku.com/login>. Realizamos todo el proceso de creacion de
cuenta, validamos nuestro email y nos logueamos de vuelta en la pagina.

Para poder crear una app en Heroku, vamos a tener que descargarnos el cliente
que nos permitira subir y configurar nuestra aplicacion desde la terminal. En
[este link](https://devcenter.heroku.com/articles/getting-started-with-nodejs
#set-up) se podra descargar el cliente correspondiente

![](/img/1*cyxsl8nTk3YpzheR7uCpEA.png)

Una vez descargado e instalado, vamos a la terminal y ejecutamos el comando
`heroku login`, el cual nos preguntara por nuestras credenciales.

Ya teniendo configurada nuestra cuenta en el cliente, nos paramos sobre el
directorio de nuestro proyecto SimpleRTAppApi y ejecutamos `heroku create`.
Esto nos dara la siguiente salida como resultado:

    
    
    MacBook-Pro-de-Federico-Jordan:SimpleRTAppAPI federicojordan$ heroku create  
    Creating app… done, ⬢ polar-meadow-74884  
    https://polar-meadow-74884.herokuapp.com/ | <https://git.heroku.com/polar-meadow-74884.git>

Con este comando estamos creando la app en Heroku, la cual tendra asociado un
repositorio git con nuestros cambios locales. De esta forma, siempre que
queramos deployar algun cambio a Heroku, simplemente tendremos que hacer un
push a ese branch.

Si bien Heroku nos crea un nombre aleatorio para nuestra aplicacion, en este
caso `polar-meadow-74884`, lo podremos cambiar mas tarde en el dashboard.

Si queremos comprobar que hemos creado la app satisfactoriamente, simplemente
nos dirigimos al dashboard de Heroku en <https://dashboard.heroku.com/apps>:

![](/img/1*GY1_1JBmaFRpavZtrhCzzA.png)

### Creacion de MySQL database con ClearDB

Para poder usar nuestra app, tendremos que configurar primero la base de datos
del servidor. En este caso, usaremos un plugin de Heroku llamado ClearDB.
Basicamente nos permite crear una base de datos MySQL y provee las
herramientas para poder trabajar con ella.

Vamos a nuestro dashboard en Heroku, y en la pestaña Resources, buscamos
"ClearDB" en la parte de Add-ons.

![](/img/1*918oaES2Xto6tkUEenW7Qg.png)

Seleccionamos ClearDB MYSQL y esto nos creara una base de datos como vemos en
la siguiente imagen:

![](/img/1*qs9I1Vn0-uyAptHvK_b-FQ.png)

El nombre de nuestra base de datos, sera entonces `heroku_a6fc31227d1ba03`.

Nuestros siguientes pasos seran encontrar las credenciales necesarias para
poder visualizar nuestra base de datos con SequelPro. Para ello, volvemos al
dashboard de Heroku y vamos a la pestaña de Settings:

![](/img/1*bOCR6O9aMy3iA3g4kbsVWg.png)

Le damos click adonde dice "Reveal Config Vars" y para la variable
CLEARDB_DATABASE_URL nos mostrara una url de este estilo:

    
    
    mysql://b772d56506fae3:[db73ae24@us-cdbr-iron-east-05.cleardb.net](mailto:db73ae24@us-cdbr-iron-east-05.cleardb.net)/heroku_a6fc31227d1ba03?reconnect=true

De donde podremos obtener las siguientes credenciales

Usuario: Desde `//` hasta `:`. En este caso `b772d56506fae3`.

Password: Desde `:` hasta `@`. En este caso `db73ae24`.

Host: Desde `@` hasta `/`. En este caso `us-cdbr-iron-east-05.cleardb.net`.

Database: Desde `/` hasta `?`. En este caso, es el que vimos antes:
`heroku_a6fc31227d1ba03`.

 _Importante: Si disponemos de una cuenta gratuita en Heroku, es posible que
se nos pida validar nuestra cuenta ingresando nuestros datos de tarjeta de cr
edito. No hay riesgo en subirlos, no hay costo alguno en los servicios
utilizados en este tutorial. Es solo a modo de validacion de identidad._

### Conexion y migracion mediante SequelPro

Ya obtenidas las credenciales de nuestra base de datos del servidor, abrimos
SequelPro para poder conectarnos a ella:

![](/img/1*My6TvkXoRx06GhS1UikX1g.png)

Si queremos hacemos click en Comprobar conexion para ver que esta todo bien.
Nos conectamos y nos deberia abrir la base de datos, totalmente vacia.

Como queremos subir los datos que teniamos localmente, vamos a migrarlos a la
base de datos del servidor creando un script SQL.

Para ello, abrimos nuestra base de datos local en SequelPro (como hicimos
[anteriormente](https://medium.com/@federicojordn/simplertapp-setup-de-mysql-y
-acceso-desde-node-js-mediante-api-rest-d4fa9309997a)), y vamos a Archivo ->
Exportar. Lo cual nos va a abrir la siguiente ventana:

![](/img/1*KqRv1FOVrabLjT_JA9SygA.png)

Guardamos el archivo generado, abrimos la ventana que tenia abierta nuestra
base de datos del servidor, y vamos a Archivo -> Importar, donde seleccionamos
el archivo con el script SQL:

![](/img/1*jsFmJJydBRmgsOYO9AOVaQ.png)

Dejamos que termine de procesar, y ya deberiamos ver nuestros datos en la base
de datos de Heroku.

### Usando la conexion con la base de datos del server

Ahora vamos a probar nuestra app localmente, pero con la base de datos del
servidor.

Para ello, vamos a nuestro archivo `.env`, donde teniamos guardados los datos
de la base de datos local y reemplazamos por los valores del servidor:

<script src="https://gist.github.com/fedejordan/c3345438643f6ea494dedc40d93e0b62.js"></script>
Basicamente, reemplazamos los valores de `DB_HOST`, `DB_USERNAME`,
`DB_PASSWORD`, `DB_NAME` por los vistos anteriormente.

Para testear si tenemos una conexion satisfactoria a la base de datos, vamos a
la terminal y ejecutamos nuestra app con `node server.js`.

Comprobamos con Postman haciendo un request a
`http://localhost:3000/tweetRequest/4` siendo 4 un numero de id valido para la
tabla "tweet_request".

![](/img/1*GqgGyKx64qlGFU95hIV_Jw.png)

Esto nos demuestra que nuestra app esta lista para ser deployada a Heroku.

### Deploy de la app a Heroku

Solo nos queda subir el codigo de la app al git de Heroku. Pero antes, debemos
indicarle a Heroku cual es el comando que necesita ser ejecutado para lanzar
nuestra aplicacion. Es por eso que tenemos que crear un `Procfile`.

¿Que es un Procfile? Es el archivo de texto que tendra la informacion de que
comando necesita ser ejecutado para iniciar nuestra aplicacion. Lo creamos de
la siguiente forma:

<script src="https://gist.github.com/fedejordan/dad4bf1a354fa4cd7163dc6a40d16e2d.js"></script>
Estamos definiendo un dyno llamado `web` que cuando se inicie ejecutara el
comando `node server.js`. Bastante simple, solo una linea.

Ya definido como vamos a ejecutar nuestra app, solo nos queda subirla al git
de Heroku. Hacemos

    
    
    git add .
    
    
    git commit -m "deploy to Heroku"
    
    
    git push heroku master

de esta forma, vamos a tener nuestro codigo subido y se va a ejecutar nuestra
app con el comando `node server.js`. Para poder ver la url podemos ejecutar en
terminal: `heroku open`. En mi caso la url sera

    
    
    [https://polar-meadow-74884.herokuapp.com/](https://polar-meadow-74884.herokuapp.com/tweetRequest/4)

Vamos a testear que hicimos todo bien con Postman:

![](/img/1*QVAHvjk0sOYh-xgkMqit0g.png)

¡Ya tenemos nuestra app subida!

 _Nota: Si quieren consumir la API subida desde la app de iOS que fuimos
haciendo en los anteriores posts, van a tener que cambiar la url embebida en
la app por la que nos provee Heroku._

### Que hacer si nuestro server se cae

Es posible que hagamos alguna request invalida, como solicitar un tweetRequest
que no existe en la base de datos. En estos casos, nuestra aplicacion deberia
tener la logica para entregar el error correspondiente al cliente, lo cual no
esta cubierto por esta serie de articulos.

Sea por este, o por cualquier otro caso, tenemos que tener la posibilidad de
restaurar nuestro servidor en caso de que haya alguna falla. Para poder
hacerlo vamos al dashboard de Heroku, y a la derecha, donde dice "More",
ejecutamos "Restart all dynos":

![](/img/1*W7oLyUAOzft12mxtAgVSPA.png)

De esta forma, se ejecuta de nuevo el comando `node server.js` en nuestro caso
(ya que es el especificado en nuestro Procfile para el dyno `web`)

Tambien, ante cualquier duda, podemos ver por que nuestra aplicacion dejo de
funcionar haciendo click en "View logs". Esto nos mostrara los ultimos logs y
podremos ver cual fue el error.

### Conclusiones

Con la base de una app en Node.js y una base de datos MySQL locales, vimos
como subirlo a un Cloud Service como lo es Heroku.

Aprendimos como configurar la cuenta, los comandos esenciales, migrar nuestra
base de datos al servidor y testear tanto la base de datos del servidor como
la app deployada.

¡Gracias por leer el articulo!

Mas informacion de como empezar con Heroku aca:
<https://devcenter.heroku.com/articles/getting-started-with-
nodejs#introduction>

#### Fuentes:

  * http://selimsalihovic.github.io/2016-02-07-using-mysql-on-heroku/
  * https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app
  * <https://devcenter.heroku.com/articles/how-heroku-works>
  * <https://es.wikipedia.org/wiki/Heroku>

