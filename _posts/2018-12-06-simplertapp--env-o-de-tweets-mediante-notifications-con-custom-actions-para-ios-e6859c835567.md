---
layout:	"post"
categories:	"blog"
title:	"SimpleRTApp: Envío de tweets mediante notifications con custom actions para iOS"
date:	2018-12-06
thumbnail:	/img/1*Za5z0XGloxTdmGyG4VNs0w.png
author:	
tags: twitter push-notifications swift ios nodejs npm simple-rt-app custom-actions spanish
---

* * *

Este articulo es parte de una serie que intenta crear una aplicacion que
muestre tweets de interes para el usuario.

Voy a tratar de acomodar un poco lo que vinimos viendo en los anteriores
posts.

La idea ahora se trata de:

  * Recorrer una base de datos con device tokens de iOS y encontrar sus hashtags preferidos.
  * Hacer el request a twitter para que me muestre el ultimo tweet con ese hashtag
  * Enviar el contenido del tweet y el tweetId en una push notification
  * Si el usuario hizo tap en la accion de retuitear, abrir la app y retuitear el contenido en su cuenta automaticamente.

Es por eso que voy a hacer todo en diferentes pasos y tratando de ser lo mas
entendible respecto de cada uno.

#### Requisitos

Este post cuenta con que se leyeron los anteriores posts relacionados con el
proyecto SimpleRTApp, simplemente para entender como llegamos a los archivos
que tenemos y la arquitectura que planteamos.

En cuanto a requisitos tecnicos, seria necesario tener conocimiento basico de
Node.js y Swift para apps iOS.

### Encontrando los hashtags

La idea, al final del proyecto, es que haya un script que se ejecute con
cierta frecuencia (digamos una hora, o cada 6 horas por ejemplo) y se envien
los tweets de importancia a los usuarios.

Para ello, tenemos que crear este script que simplemente ejecutandolo,
encuentre los tweets y se los envie a los usuarios.

Vamos a crear, entonces un archivo llamado `send_tweets.js` con el siguiente
contenido:

<script src="https://gist.github.com/fedejordan/82faec0c664e54e2508e674387a3d991.js"></script>
Lo que en terminal haciendo `node send_tweets.js` nos produce el siguiente
resultado:

    
    
    MacBook-Pro-de-Federico-Jordan:SimpleRTAppAPI federicojordan$ node send_tweets.js   
    Connected!  
    Query completed  
    device token: f74f0d895a22249e75057c91e90543b5f5039cb5dd3880f9b4506b705680ceab hashtags: #swift #ios

 _Nota: Es importante verificar con SequelPro que tenemos un device token real
en la base de datos, sino no podremos probar correctamente el funcionamiento
del script._

Como vemos, mostramos los devices token y los hashtags de cada uno. En mi caso
tengo un solo registro en la base de datos.

### Obteniendo los tweets

¿Se acuerdan de nuestro post sobre el uso de Search API de Twitter en Node.js?
Bueno, llego el momento de usarlo. Abrimos `relevant_tweets.js` y cambiamos su
contenido para que sea accesible desde otro archivo:

<script src="https://gist.github.com/fedejordan/0d3b899487d740e6657093e3583ac201.js"></script>
Con esto, podemos acceder a estas funcionalidades desde `send_tweets.js`:

<script src="https://gist.github.com/fedejordan/90298781bae66ae79a1f3d4defa6bacb.js"></script>
Con lo que en consola tenemos:

    
    
    MacBook-Pro-de-Federico-Jordan:SimpleRTAppAPI federicojordan$ node send_tweets.js   
    Connected!  
    Query completed  
    last tweet for #swift #ios is: 【Swift】UserNotificationsの実装例と注意   
    #swift  
    #apple  
    #xcode  
    #iOS  
    #iphone  
    https://t.co/OvxHqPFxHW

Sea de calidad o no, es el ultimo tweet publicado con esos hashtags ;)

### Enviar tweet por push notification

Por ultimo, por lo menos del lado del server, tenemos que enviar esta
informacion por una push notification. De una forma parecida que hicimos con
el helper de tweets, lo hacemos con nuestro script `send_push.js`:

<script src="https://gist.github.com/fedejordan/2fd333858c19b1d866948db8c86c8f4d.js"></script>
Exportamos una funcion `sendPush` la cual acepta el `deviceToken`, un
`tweetText` y un `tweetId`.

Algo a aclarar es que agregamos en el payload el `tweetId`, ya que lo
necesitaremos en la app para poder retuitearlo.

Agregamos la funcionalidad de enviar push notifications a nuestro script
`send_tweets.js` y nos quedaria de la siguiente forma:

<script src="https://gist.github.com/fedejordan/88b6528684d70c26d3ed63ebe25ee0d9.js"></script>
Enprolijamos un poco los callbacks, y usamos el `notificationsHelper` (que usa
las funcionalidades de `send_push.js.`

Finalmente, probamos toda nuestra logica y vemos si la push llega a nuestro
device. Hacemos `node send_tweets.js` en terminal:

![](/img/1*Za5z0XGloxTdmGyG4VNs0w.png)

¡Muy bien! Ya tenemos configurado el script desde nuestro server.

### Leyendo custom actions desde iOS

Ahora tenemos que implementar la logica para manejar las custom actions en la
app. Para ello, creamos una clase llamada `PushNotificationsActionsHandler`
que se encargara de manejar la logica relacionada a las acciones de las
pushes:

<script src="https://gist.github.com/fedejordan/8b6ae3e0687b7576a64467a367beeb6b.js"></script>
Basicamente se inicializa con un objeto de tipo `UIWindow`, para tener acceso
a la navegacion de la app. Despues se implementa
`UNUserNotificationCenterDelegate` para saber cuando el usuario hizo tap en
una custom action. Por lo tanto, si lo hizo en la de tipo retweet, se abre
`RetweetViewController` con la informacion necesaria para que se haga el
retweet automatico.

Para poder usar esta clase, necesitamos instanciarla en el `AppDelegate`.
Creamos una variable de tipo `PushNotificationsActionsHandler`y agregamos
entonces las siguientes lineas en el metodo `didFinishLaunching`:

<script src="https://gist.github.com/fedejordan/b29770139251ec2a56adde01431e1b5a.js"></script>
Por ultimo, cambiamos un poco `RetweetViewController` para que acepte la nueva
logica de hacer retweet cuando se carga:

<script src="https://gist.github.com/fedejordan/a21d2937c88bdf30236c727ef07b3ecd.js"></script>
Compilamos la app para tenerla actualizada en el dispositivo. Es importante
estar logueado en ella con twitter para que funcione correctamente.

Vamos a la terminal, hacemos `node send_tweets.js`, recibimos el tweet, le
damos al custom action de Retweet, y vemos como nos abre y nos hace retweet
del tweet enviado. Comprobamos entonces, entrando a nuestro perfil de Twitter…

![](/img/1*80vMQFpCjfE4QELwOv8wHw.jpeg)

¡Funciono! Ya tenemos nuestro sistema andando. Basta con ejecutar `node
send_tweets.js` en la terminal, y nos dara un push notification con el ultimo
tweet publicado con esos temas.

Pueden ver el codigo final de la app en el tag `retweet_from_custom_action`

Solo nos falta deployarlo en algun servidor para que se ejecute cada cierto
tiempo. Eso voy a abarcar en las siguientes notas.

¡Gracias por leer el articulo!

*Este artículo tambien esta disponible para ver en [Medium](https://medium.com/@federicojordn/simplertapp-env%C3%ADo-de-tweets-mediante-notifications-con-custom-actions-para-ios-e6859c835567)*