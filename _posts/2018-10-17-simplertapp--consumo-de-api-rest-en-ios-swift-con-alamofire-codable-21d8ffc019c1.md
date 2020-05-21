---
layout:	"post"
categories:	"blog"
title:	"SimpleRTApp: Consumo de API REST en iOS Swift con Alamofire+Codable"
date:	2018-10-17
thumbnail:	
author:	
---

* * *

Este articulo forma parte de una serie que pretende construir un sistema para
enviar notificaciones de articulos relevantes de Twitter, con el objetivo de
que sean retuiteados facilmente. [Aca](https://medium.com/@federicojordn/c%C3
%B3mo-obtener-twitts-relevantes-en-una-app-de-ios-con-heroku-nodejs-swift-
4c4aca1f42b2) se encuentra el articulo completo.

En esta ocasion, construiremos la capa de networking necesaria en la app iOS
para poder consumir nuestra API REST, realizada en [articulos
anteriores](https://medium.com/@federicojordn/simplertapp-estructura-b%C3
%A1sica-de-una-api-rest-en-node-js-64b4c413c85c). Para ello, nos valdremos de
dos herramientas: Alamofire y el protocolo Codable, de Apple.

#### Requerimientos

Es necesario tener conocimiento de lenguaje Swift y herramientas basicas de
desarrollo iOS. Ademas, tambien se requiere conocer el protocolo REST para
consumo de APIs.

#### Acerca de Alamofire y Codable

[Alamofire](https://github.com/Alamofire/Alamofire) es una biblioteca creada
por [@mattt](https://twitter.com/mattt) con el objetivo de facilitar la
interaccion de una App iOS con servicios HTTP. Esta escrita en Swift y es la
mas utilizada hoy en dia en la plataforma.

Lo elegimos por su extenso uso por la comunidad, su valoracion en GitHub
(actualmente tiene un poco mas de 29000 estrellas) y su adaptabilidad a
diferentes requisitos. ademas de su gran frecuencia de actualizacion.

Por su parte,
[Codable](https://developer.apple.com/documentation/swift/codable) es una
herramienta nativa de Apple para permitir que nuestros tipos de datos sean
encodeables o decodeables para la compatilibidad con datos externos, como
podria ser JSON.

### Construccion de nuestro primer request

Vamos a ver los pasos para construir una networking layer basica para
cualquier aplicacion. Es importante tener en cuenta, que siempre se puede
profundizar el concepto, por lo que para este articulo se priorizara explicar
el funcionamiento de la biblioteca y tener una networking funcional.

 _Es importante que deshabilitemos Transport Security en nuestro Info.plist,
ya que por ahora no usaremos conexiones seguras (no HTTPS)._[ _M as
informacion_](https://stackoverflow.com/questions/31254725/transport-security-
has-blocked-a-cleartext-http)

  1. Instalamos Alamofire agregando en nuestro Podfile `pod 'Alamofire', '~> 4.7'`, luego procedemos a hacer `pod install` en la terminal.
  2. Abrimos el workspace y creamos un archivo llamado `TweetRequest.swift` con el siguiente contenido:
  
  {% gist cdc4b5d4339252b523de285209109b91 %}

Este sera el objeto que obtendremos de nuestra request. Usando el protocolo
`Codable` y especificando cada `CodingKey` podremos indicar de que campos del
JSON queremos obtener cada variable.

3\. Creamos una clase llamada `NetworkManager`, la cual tendra el siguiente
contenido:

{% gist 7b7219c0fef250cbfc36f0c88d237d27 %}

En este caso, definimos un metodo llamado `getTweetRequest(byId id: String,
completion: (TweetRequest?) -> Void)` el cual hara el request correspondiente
a nuestro entorno local `localhost` y, si ese `TweetRequest` para ese `id`
esta disponible, obtendremos sus datos. En caso contrario, el metodo llamara
al bloque `completion` con el valor `nil`.

4\. A modo de prueba, realizamos el request en `ApplicationDelegate.swift` en
el metodo `didFinishLaunching` de la siguiente forma:

    
    
    let networkManager = NetworkManager()  
    networkManager.getTweetRequest(byId: "4") { (tweetRequest) in  
        print(tweetRequest)  
    }

Esto nos deberia imprimir en consola el siguiente log:

    
    
    Optional(SimpleRTApp.TweetRequest(tweetRequestId: Optional(4), deviceToken: Optional("ExampleDeviceToken"), hashtags: Optional("#Example #hashtags")))

Con esto ya hemos creado nuestro primer request GET con Alamofire y Codable :)

### Full networking layer para SimpleRTApp

Con los pasos anteriores, ya tenemos el `GET /tweetRequest/:id` que nos
permitira ver los hashtags actuales para el usuario. Nos falta entonces, crear
los request para los siguientes endpoints:

  * `POST /tweetRequest` para indicarle al backend acerca que hashtags quiero tener notificaciones
  * `DELETE /tweetRequest/:id` para eliminar las notificaciones para ciertos hashtag
  * `POST /postwedTweet` para indicarle al backend que tweet fue posteado (y no lo sugiera posteriormente)

Ordenando un poco los endpoints y los parametros necesarios, nuestra clase
`NetworkManager` entonces podria quedar de la siguiente forma:

{% gist bbad7be142eb20b12d8894dcaf50188a %}

Algunos puntos a destacar:

  * Agregamos un enum llamado `NetworkPath`, mediante el cual obtenemos la URL completa para cada path que podamos utilizar. De esta forma tenemos en un solo lugar todas las url que usa el proyecto. Algo que se podria haber hecho es incluir y reemplazar el id (tanto de `TweetRequest` o de `PostedTweet`) pero decidi hacerlo basico por el momento
  * Agregamos un struct llamado `NetworkParameter`, en el cual tendremos todos los parametros utilizados por algun request. Tambien se podria haber utilizado un enum, y de alguna forma restringir los parametros que podamos aceptar (hacer alguna magia para que solo podamos usar algun valor de ese enum) pero decidi mantenerlo simple tambien.
  * Como los otros metodos no son de tipo GET, que es el metodo por defecto, tenemos que aclararlo en el parametro `method` de `Alamofire.request`. Aclaramos que son tanto de tipo `.post` como `.delete`.
  * En el caso de los request de tipo POST se tienen que agregar tambien los parametros que requiere (el body de la request). Esto se hace especificando un dictionary de tipo `[String: Any]` al parametro `parameters` de `Alamofire.request`.
  * Por ultimo, como los requests que nos faltaban no devuelven nada en el response, simplemente informamos el estado de `response.result.isSuccess` a traves del `completion`, en caso que se requiera tomar una accion si el request fallo.

Si bien no lo requerimos, tambien podemos crear el struct de `PostedTweet`, el
otro modelo que nos faltaba agregar:

{% gist 7a31dc829bd8e1ce39aaafbe651b5c68 %}

Nos quedara como tarea realizar la debida implementacion de estos requests.
Pueden ver el codigo final en <https://github.com/fedejordan/SimpleRTApp>, tag
`basic_networking`.

Es importante aclarar que el server debe estar andando en nuestra maquina
local (`node server.js` en terminal). [Mas informacion
aca](https://medium.com/@federicojordn/simplertapp-estructura-b%C3%A1sica-de-
una-api-rest-en-node-js-64b4c413c85c)

#### Mejoras

Nuestra capa de networking basica se puede mejorar sustancialmente. En
principio, acoplar todas las llamadas en la misma clase no es escalable. Una
mejor solucion podria ser tener clases por cada tipo de request y tener ya
definidos en su metodo `init` que parametros acepta. De esta forma, si nuestra
request cambia solo tendremos que modificar los parametros de dicha clase.

Ademas, si queremos testear nuestra implementacion, deberiamos
[mockear](https://es.wikipedia.org/wiki/Objeto_simulado) las respuestas de
alguna forma. De momento, no es posible con la solucion actual.

En otro articulo mas adelante, voy a realizar la implementacion de una capa de
networking mucho mas completa, escalable y testeable. En este articulo solo
quise cubrir el uso basico de la biblioteca.

### Conclusiones

Aprendimos como usar capaz el framework mas utilizado para networking de iOS,
Alamofire. Tambien, como combinarlo con el protocolo Codeable de Apple para
parsear nuestros datos de la forma mas eficiente. Definimos nuestros objetos
para poder parsearlos correctamente, y podamos acceder a sus propiedades en la
app sin mucho problema.

Nuestra capa de networking basica nos sirve para separar la logica de APIs en
nuestra app en un modulo aparte, y tener un poco mas organizada nuestra
arquitectura de proyecto.

¡Muchas gracias por leer el articulo!

#### Fuentes

  * <https://medium.com/xcblog/painless-json-parsing-with-swift-codable-2c0beaeb21c1>
  * <https://github.com/Alamofire/Alamofire>
  * <https://github.com/Alamofire/Alamofire/blob/master/Documentation/Usage.md#making-a-request>

