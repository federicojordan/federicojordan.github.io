---
layout:	"post"
categories:	"blog"
title:	"Cómo obtener twitts relevantes en una app de iOS con Heroku + NodeJS + Swift"
date:	2018-04-01
thumbnail:	/img/1*AA7cWU-JqkG-OjEgMxgJJg.png
author:	
---

* * *

Siempre me paso que quiero ahorrar tiempo. Y nada mejor que hacerlo
automatizandolo de alguna forma.

Desde que empece con el tema de escribir posts, siempre me imagine la tarea de
mantener una cuenta de twitter. Realmente no soy muy fan de estar en las redes
sociales interactuando constantemente (aunque reconozco que los memes muchas
veces me quitan bastante tiempo). Es por eso, que al abrir mi cuenta de
[Twitter](https://twitter.com/FedeJordan90) me imagine una forma de postear
contenido relevante sin tener que estar buscando todo el dia en la app.

Si bien la app de Twitter te provee de notificaciones, lo cierto es que yo
queria la funcionalidad de notificar por hashtags relevantes, y la app solo
provee contenido estrictamente relacionado con tu cuenta. Simplemente me
propuse automatizar de alguna forma el proceso.

Por eso es que me propuse crear un sistema que basicamente me informe del
contenido que me interesa, y me deje retuitearlo de la forma mas sencilla y
rapida posible.

Nota: seguramente en el mercado hay soluciones que te permiten hacer esto.
Ademas de que seguro mi implementacion no sea del todo eficiente. La idea es
aprender y lograr el objetivo planteado de un principio en el proceso.

Mi idea es basicamente hacer mi propia solucion, ademas de que voy aprendiendo
a utilizar Heroku y NodeJS en el camino :)

### Arquitectura utilizada

![](/img/1*AA7cWU-JqkG-OjEgMxgJJg.png)

Arquitectura para SimpleRTApp [(draw.io](https://www.draw.io/))

Lo llame **SimpleRTApp** , y basicamente consiste en un backend en NodeJS y
una app en iOS hecha en Swift. Como van a ver en los siguientes post, todo va
a ser a codigo abierto.

El concepto en si no es muy complicado. Voy a explicarlo en pasos:

  1. El usuario indica a la app en que hashtags esta interesado retwittear. Digamos por ejemplo que yo quiero ver tweets que contengan los hasthags #ios #swift #programming nada mas.
  2. La app hace una llamada a una API del backend que registra el deviceId y los hashtags asociados. El server va a estar hosteado en Heroku. Toda la data se guarda en una DB en MySQL.
  3. Hay un cron corriendo en el server que comprueba si hay que enviar alguna notificacion. Si se necesita mandar, se consulta la API de Twitter para esos hashtags. Se selecciona el mas relevante.
  4. Se envia la descripcion y el link del tweet a APNS (Apple Push Notifications Server) con el deviceId correspondiente.
  5. APN envia la push notification al device del usuario.
  6. El usuario sin abrir la app, puede seleccionar si retuitear o ignorar el tweet

#### Conceptos abarcados

Para poder realizar todo esto necesitamos comprender los siguientes conceptos
(ademas de tiempo, por supuesto :P):

  * Twitter API para iOS (Necesitamos autenticar a los usuarios, para obtener los tweets en backend y hacer retweet) [Link al articulo](https://medium.com/@federicojordn/simplertapp-authentication-y-retweet-con-twitter-api-en-ios-4829d489de74)
  * Twitter Search API para NodeJS
  * Uso basico de NodeJS para API REST
  * NodeJS + MySQL setup
  * Consumo de API REST en iOS con Alamofire+Codable
  * Uso de APN para enviar pushes desde NodeJS
  * UserNotifications SDK para iOS, con el uso de custom actions desde la push
  * Deployar nuestro backend en Heroku
  * Utilizacion de crons en Heroku

Es por eso que dividi la explicacion en 8 partes, para que sea mas sencillo de
entender.

Creo que la serie de posts abarca el contenido minimo para armar un proyecto
de punta a punta, y puede ser una buena base para programadores que solo
conocen frontend iOS. Todos en algun momento deberiamos tener alguna nocion de
como funciona una API por dentro.

No olviden comentar cualquier sugerencia o critica que tengan de la aplicacion
de estos conceptos.

¡Muchas gracias!

 _Si quieren contactarse conmigo pueden seguirme en_[
_Twitter_](http://www.twitter.com/FedeJordan90) _o tambi en mandarme un mail a
fedejordan99@gmail.com_

