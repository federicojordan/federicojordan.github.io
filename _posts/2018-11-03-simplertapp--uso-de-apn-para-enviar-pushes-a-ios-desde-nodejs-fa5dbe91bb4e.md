---
layout:	"post"
categories:	"blog"
title:	"SimpleRTApp: Uso de APN para enviar pushes a iOS desde NodeJS"
date:	2018-11-03
thumbnail:	/img/0*JPCUlkVRVTMUvSSv.png
author:	
tags: apn ios swift simple-rt-app nodejs npm push-notifications spanish
---

* * *

Este articulo es parte de una serie que intenta crear una aplicacion que
muestre tweets de interes para el usuario. Pueden ver la guia con la lista
principal [aca](https://medium.com/@federicojordn/c%C3%B3mo-obtener-twitts-
relevantes-en-una-app-de-ios-con-heroku-nodejs-swift-4c4aca1f42b2).

En esta ocasion vamos a ver como mandar push notifications desde Node.js a un
dispostivo iOS. Para ello, vamos a usar el paquete `apn`.

#### Requisitos

Para poder seguir con el tutorial, es necesario disponer de lo siguiente:

  * un dispositivo iOS, ya que las push notifications no funcionan en simulador
  * una cuenta de _Apple Developer Program Membership_. Si bien sin una cuenta de desarrollador de Apple se puede compilar en el dispositivo, para poder configurar las push notifications si es necesario disponer de una, ya que se necesitar a crear un _Push Notification Certificate_.

#### Apple Push Notification Service

 _Apple Push Notification service_ (APNs) es la pieza central en la
funcionalidad de notificaciones remotas. Es un servicio robusto, seguro y muy
eficiente que permite a desarrolladores propagar informaci on a iOS (como
tambien indirectamente a watchOS), tvOS, y dispositivos macOS.

Cuando una aplicacion iOS se inicia en un dispositivo, el sistema
automaticamente establece una acreditada, encriptada y persistente conexion IP
entre la app y APNs. Esta conexion permite a la app configurar y habilitar al
dispositivo para recibir notificaciones. Esto esta explicado en mas detalla en
[Configuring Remote Notification
Support](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/HandlingRemoteNotifications.html#//apple_ref/doc/uid/TP40008194-CH6-SW1).

La otra parte de la conexion para enviar notificaciones (el persistente y
seguro canal entre un servidor proveedor y APNs) requiere configuracion en [la
cuenta de desarrollador](https://developer.apple.com/account) y el uso de
certificados provistos por Apple. El proveedor es un servidor, que el
desarrollador implementa y gestiona, para trabajar con APNs.

![](/img/0*JPCUlkVRVTMUvSSv.png)

Entregando una notificacion desde un servidor a un dispositivo

Mas informacion sobre APNs en [la documentacion oficial de
Apple](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html).

#### Acerca del paquete apn

Para poder comunicarnos con APNs vamos a necesitar realizar todas las
conexiones y configuraciones necesarias desde Node.js. Para ello, disponemos
del paquete `apn` , que es un modulo de Node.js para facilitar el envio de
notificaciones via APN service. Esta listo para usar en produccion e incluye
funcionalidades que hacen mas facil a los desarrolladores implementar
notificaciones rapidamente. Entre sus caracteristicas se destacan:

  * Esta basado en una API de proveedor en HTTP/2
  * Mantiene una conexion con el servidor para maximizar el procesamiento y envio de notificaciones
  * Envia automaticamente notificaciones no enviadas si ocurrio un error.

Pueden ver el repo oficial en este link: <https://github.com/node-apn/node-
apn>

### Creacion de certificados

Para poder enviar notificaciones desde nuestro servidor, necesitamos indicar a
APN que tenemos permisos de hacerlo para nuestra app. Es por eso que
necesitamos crear un certificado SSL para establecer una conexion segura con
APNs. Tendremos que realizar lo siguiente:

  1. Desde Xcode, vamos a nuestro proyecto y seleccionando el Target, vamos a la pestaña de Capabilities. Ahi mismo, habilitamos el switch que dice Push notifications. Esperamos un poco a que se realice la configuracion automatica.

![](/img/1*TALMHVU7LfHO4mf2LAXKWw.png)

2\. Una vez habilitado, vamos al [Developer
Center,](https://developer.apple.com/account) ingresamos nuestra cuenta,
Certificates, Identifiers & Profiles, Identifiers, App IDs y buscamos nuestra
app (en nuestro caso, SimpleRTApp). Vamos a Edit.

3\. En esta pantalla, vamos a la parte de Push Notifications, y donde dice
Development SSL Certificate, vamos a Create Certificate…

![](/img/1*72uOFsVWuGkTGa75dq7UWw.png)

Ahi mismo nos dice los pasos que debemos realizar, pero igualmente voy a
transcribirlos aca para que les sea mas facil.

4\. Abrimos la aplicacion Keychain Access en nuestra Mac, y hacemos click en
el menu Keychain Access -> Certificate Assistant -> Request a Certificate from
a Certificate Authority. Ahi mismo le damos a Se guarda en disco, y guardamos
en un lugar seguro el archivo "CertificateSigningRequest.certSigningRequest".

5\. Habiendo creado este archivo, volvemos a la pagina de Developer Center, y
le damos a Continuar. Seleccionamos el archivo `.certSigningRequest` y hacemos
click en Continuar nuevamente. Deberiamos estar en la siguiente pantalla:

![](/img/1*SweXhfNVtDEQFuxCgAiuKA.png)

Ya tenemos listo nuestro archivo `aps_development.cer` para descargar.

6\. Desde el Finder, le damos doble click al archivo descargado y vemos como
se nos abre la app de Keychain Access, con el certificado ya agregado a la
lista. Seleccionamos de la lista el certificado y la clave privada, para
exportar un archivo P12:

![](/img/1*QJPLVDR_SgRPLwg48EP7CA.png)

Nos aseguramos de que exportemos como archivo P12, nos va a pedir una
contraseña, escribimos una y guardamos el archivo en disco.

![](/img/1*NzVBM2kXbK39xJWOCirTkQ.png)

Con esto ya generamos el archivo P12 necesario para poder realizar la
comunicacion segura entre nuestro server y APNs.

Es importante no olvidar la contraseña, ya que es requerida por Apple para
poder enviar push notifications.

### Obtener device token en iOS

Para poder testear nuestras notificaciones, vamos a necesitar un device token
de algun dispositivo.

Podemos encontrar facilmente el nuestro, simplemente solicitando permisos de
push notificaciones en nuestra app SimpleRTApp. Para ello, agregamos los
siguientes metodos en nuestro `AppDelegate.swift` :

<script src="https://gist.github.com/fedejordan/9eda97e5d7b895cdb239ada430f13cab.js"></script>


A destacar:

  * Mediante el SDK de `UserNotifications`, hacemos `UNUserNotificationCenter.current().requestAuthorization()` para pedirle permisos al usuario.
  * Una vez que obtuvimos los permisos, registramos mediante `UIApplication.shared.registerForRemoteNotifications()`
  * Si la app pudo registrarse correctamente, se va a llamar a `application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data)`, en el cual imprimiremos en consola el valor del device token.

Con esta implementacion, la app ya estara lista para recibir push
notifications y obtendremos el device token de prueba para usar desde el
server.

Pueden ver el codigo final de la app iOS en
<https://github.com/fedejordan/SimpleRTApp>, tag `push_notifications_setup`

### Creacion de script en Node.js

Con lo anterior, obtuvimos entonces:

  * El archivo p12, que nos servira para poder conectarnos de forma segura con APNs
  * El device token, que nos servira para enviar push notifications a ese dispositivo fisico

Por lo que ya estamos listos para crear nuestro programa en Node.js para que
envie push notifications:

  1. Vamos a la app de Terminal y hacemos `npm install apn`. Esto nos instalara la biblioteca encargada de manejar todos los temas relacionados con la conexion a APNs.
  2. Copiamos el archivo p12 (en mi caso se llama `simpleapprt-certificates.p12`) a la misma carpeta de nuestro script en Node.js
  3. Creamos el script con el siguiente contenido:
  
<script src="https://gist.github.com/fedejordan/89cb4fd33a57d18441469748255b1ec6.js"></script>

Donde reemplazaremos `<device-token>` y `<p12-password>` por nuestro propio
device token y la contraseña que habiamos puesto en el archivo p12
respectivamente.

Basicamente en el script seteamos las opciones para establecer la conexion (en
nuestro caso va a ser con certificados, por eso seteamos la ruta de nuestro
archivo p12 y el passphrase), instanciamos el objeto `Provider`, creamos el
objeto de tipo `Notification` y lo enviamos a traves del metodo `send()`.
Cuando obtenemos la respuesta (ya sea error o no), finalizamos la ejecucion.

Para probar todo esto vamos a la terminal, hacemos `node send_push.js` y
esperamos a que la push llegue a nuestro celular:

![](/img/1*lL_11PIlKWDvvbL0Q4B8NQ.png)

¡Felicidades! Ya hicimos llegar nuestra primera push notification a un
dispositivo iOS :)

Pueden ver el script finalmente creado en
[https://github.com/fedejordan/SimpleRTAppAPI,](https://github.com/fedejordan/SimpleRTAppAPI)
tag `send_push_script`.

### Uso de custom actions

Para nuestro proyecto SimpleRTApp, dijimos que queriamos tener la opcion de
retuitear desde la push notification. Esto lo podemos hacer posible enviando
tambien la informacion para que se muestre una custom action

¿Que es una custom action? Son acciones que el usuario tiene disponible para
hacer en una determinada push notification. En nuestro caso vamos a enviar una
accion con el nombre "Retuitear".

Para hacerlo, vamos a tener que enviar mas informacion en la push
notification. A nuestro script `send_push.js` agregamos entonces lo siguiente
cuando seteamos el objeto `notification` :

    
    
    notification.category = "RETWEET";

De esta forma indicamos que queremos que se muestre un custom action con el
category Id `RETWEET`.

Para poder mostrar la accion en la push notification, tenemos que indicarselo
a la app iOS que es una accion permitida. Vamos a tener que registrar la
accion de esta forma:

    
    
    let retweetAction = UNNotificationAction(identifier: "retweet_action_identifier", title: "Retweet", options: [.foreground])  
       
     let retweetCategory = UNNotificationCategory(identifier: "RETWEET", actions: [retweetAction], intentIdentifiers: [], options: [])  
       
     UNUserNotificationCenter.current().setNotificationCategories([retweetCategory])

Instanciamos un `UNNotificationAction` llamado `retweetAction`, elcual nos
servira mas adelante para saber que hacer si el usuario toco la accion. Esta
accion la tenemos que asociar a un tipo `UNNotificationCategory`, el cual
tendra un identifier que tiene que coincidir con el que enviamos desde el
server. Por ultimo, le indicamos a `UNUserNotificationCenter` las categorias
que son permitidas por las pushes (pueden ser mas de una).

El codigo en la app iOS nos quedaria de la siguiente forma, para nuestro
`AppDelegate.swift`:

<script src="https://gist.github.com/fedejordan/ac531f44360152bafb550aab0d885585.js"></script>
Hacemos `node send_push.js` en la terminal y comprobamos si se envia una push
con una custom action:

![](/img/1*W-7-SXbskN2VPXwDwmyIsQ.jpeg)

Con esto, logramos enviar custom actions en nuestras push notifications :)

Pueden ver el codigo final de la app iOS en
[https://github.com/fedejordan/SimpleRTApp,](https://github.com/fedejordan/SimpleRTAppAPI)
tag `apn_custom_actions`.

### Conclusiones

El post se me hizo un poco largo, pero hicimos todo el setup necesario para
enviar push notifications desde una app en Node.js y la configuracion que se
necesita en la app iOS, asi como tambien todo lo necesario para generar los
certificados con el APN server.

En el siguiente post voy a ordenar un poco este codigo (tanto server como
iOS), y realizar finalmente el script que permita recorrer los device tokens,
realizar el request de los tweets, y enviar push notifications. Ademas, voy a
implementar la logica en la app iOS para poder retuitear si el usuario hace
tap en la accion de la push.

¡Gracias por leer! Cualquier comentario, sugerencia pueden enviarlo a
fedejordan99@gmail.com

### Fuentes

  * <https://github.com/node-apn/node-apn>
  * <https://www.raywenderlich.com/156966/push-notifications-tutorial-getting-started>
  * <https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html>

