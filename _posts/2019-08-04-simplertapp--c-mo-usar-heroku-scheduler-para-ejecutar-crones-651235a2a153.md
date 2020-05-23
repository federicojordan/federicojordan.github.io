---
layout:	"post"
categories:	"blog"
title:	"SimpleRTApp: Cómo usar Heroku Scheduler para ejecutar crones"
date:	2019-08-04
thumbnail:	/img/1*WHsq_q7tA5nLYDTInm-k2Q.png
author:	
tags: nodejs javascript heroku heroku-scheduler simple-rt-app spanish
---

* * *

Este articulo es el ultimo de una serie que explica como obtener
notificaciones en un dispositivo iOS de los tweets mas relevantes para el
usuario. Mas informacion en este [link](https://medium.com/@federicojordn/c%C3
%B3mo-obtener-twitts-relevantes-en-una-app-de-ios-con-heroku-nodejs-swift-
4c4aca1f42b2).

En esta ocasion vamos a crear un trabajo en Heroku, que se ejecute cada
determinado tiempo y ejecute el script que busca y notifica de los tweets a
los usuarios.

#### Requisitos

Es necesario tener una cuenta en Heroku, con una aplicacion subida.

En nuestro tutorial vamos a continuar con la ultima parte del proyecto
SimpleRTApp.

### ¿Que es Heroku Scheduler?

Heroku Scheduler es un plugin para una aplicacion de Heroku. Simplemente nos
permite definir un comando a ser ejecutado en un determinado intervalo de
tiempo. Este puede ser diario, por hora, o cada 10 minutos.

### Configuracion

Para poder agregar Heroku Scheduler a nuestra app tendremos que ir a nuestro
dashboard en Heroku. Vamos a Resources y en la parte de Add-ons buscamos
"Heroku Scheduler":

![](/img/1*WHsq_q7tA5nLYDTInm-k2Q.png)

Es posible que se nos indique validar nuestra cuenta ingresando nuestra
tarjeta de credito. En caso de que lo pida, no se nos cobrara ningun cargo, a
menos que elijamos algun plan de servicios pago.

Una vez agregado el plugin, entramos a su configuracion. En nuestro caso,
queremos queremos que ejecute el comando `node send_tweets.js` cada una hora.
Para ello, agregamos un nuevo job:

![](/img/1*dak2mg8plO4ePGRAZU-gnA.png)

Completamos los datos y le damos click a Save. Se nos dira cuando sera la
proxima vez que el job va a ser ejecutado en el campo NEXT DUE:

![](/img/1*oUtxqOFsNn_NuQEwiLnA6A.png)

¡Listo! Solo nos queda esperar a que sea la hora que indica la pagina.

Asi como con los dynos, tenemos la posibildad de ver los logs para los jobs.
Para ello vamos a View logs, en el menu de More, a la izquierda en el
dashboard de Heroku.

Podemos ver el resultado del cron en la siguiente imagen:

![](/img/1*nqgvvIw3nxqWg9v0VzjYgA@2x.jpeg)

### Conclusiones

Vimos como crear un cron en Heroku, simplemente con la ayuda del plugin de
Heroku Scheduler. Simplemente se nos preguntara por que comando se va a
ejecutar y la frecuencia del mismo.

Con esto termina la serie de tutoriales, con un sistema que comprende desde el
desarrollo de la app en iOS, el desarrollo del backend, configuracion de la
base de datos y la configuracion del Cloud Service, en este caso Heroku.

¡Muchas gracias por leer los articulos!

#### Fuentes

  * <https://devcenter.heroku.com/articles/scheduler>

