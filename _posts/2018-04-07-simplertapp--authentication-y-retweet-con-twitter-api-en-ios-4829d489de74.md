---
layout:	"post"
categories:	"blog"
title:	"SimpleRTApp: Authentication y retweet con Twitter API en iOS"
date:	2018-04-07
thumbnail:	/img/1*Altac86M18W11mMPafXodg.png
author:	
---

* * *

Esta es la primer parte de una serie de articulos con la idea de tener un
sistema que automatice el retweet de cualquier contenido que consideremos
interesante. Para ver la lista de temas completa, hace click
[aca](https://medium.com/@federicojordn/c%C3%B3mo-obtener-twitts-relevantes-
en-una-app-de-ios-con-heroku-nodejs-swift-4c4aca1f42b2).

En este articulo voy a buscar explicar como usar la API de Twitter para tener
una autenticacion, para poder hacer un retweet teniendo el id del tweet
correspondiente. En resumen, vamos a:

  1. Crear una app en Twitter e integrar el SDK
  2. Autenticar al usuario mediante TwitterKit
  3. Mostrar un tweet mediante su Id
  4. Retuitear ese tweet en la cuenta del usuario logueado

### Crear una app en Twitter

Twitter nos provee bastante documentacion acerca de su API. Esto lo pueden ver
en <https://developer.twitter.com/en/docs/basics/getting-started>

Para poder utilizar el servicio de Search API, primero nos piden que creemos
la app en su sitio. Como requisito necesitaremos tener una cuenta en Twitter.
Para ello creamos una app en la web:

  1. Vamos para <https://apps.twitter.com/> y le damos a **Create new app**
  2. Una vez alla, nos piden algunos datos para identificar nuestra app. En mi caso puse:

App name: _SimpleRTApp_

Description: _The app needs authorization to get permissions to use the Search
API_

Website: [_https://www.google.com.ar/_](https://www.google.com.ar/) __ (por
ahora no tenemos website)

3\. Aceptamos que leimos los terminos y condiciones y le damos a **Create your
Twitter application**. En este paso puede que nos pida agregar nuestro n umero
de telefono a la cuenta de twitter. Mas info
[aca](https://support.twitter.com/articles/110250-adding-your-mobile-number-
to-your-account-via-web).

4\. Una vez ya creada deberiamos estar en una pantalla parecida a esta:

![](/img/1*Altac86M18W11mMPafXodg.png)

SimpleRTApp creada en Twitter apps

Vamos a la pestaña de permissions y nos aseguramos que **Read and write** este
activado:

![](/img/1*Zrm1iXWkJkNBV1TAB9CFXA.png)

Read and write permissions

Esto nos permitira mas adelante hacer retweet con el consentimiento del
usuario. Mas informacion acerca de los permisos
[aca](https://developer.twitter.com/en/docs/basics/authentication/overview
/application-permission-model).

#### Instalacion de twitter-kit-ios

Una vez que ya tenemos configurada la app en Twitter, procedemos a instalar el
SDK de iOS. Para ello yo utilice [CocoaPods](https://cocoapods.org/):

  1. Hacemos `pod init` para crear el Podfile en nuestro projecto
  2. Configuramos `pod 'TwitterKit'` en nuestro Podfile y le damos a `pod install` desde la terminal.
  3. Abrimos el workspace generado y vamos al `Info.plist` para configurar las keys de la Twitter app. Agregamos lo siguiente:

    
    
    // Info.plist  
    <key>CFBundleURLTypes</key>  
    <array>  
      <dict>  
        <key>CFBundleURLSchemes</key>  
        <array>  
          <string>twitterkit-<consumerKey></string>  
        </array>  
      </dict>  
    </array>  
    <key>LSApplicationQueriesSchemes</key>  
    <array>  
        <string>twitter</string>  
        <string>twitterauth</string>  
    </array>

Donde `<consumerKey>` es la **Consumer Key** de nuestra app. La podemos
encontrar en el dashboard de Twitter en la pesta ña **Keys and Access
Tokens.**

![](/img/1*QEmNo26oa1T0GAXyENWW3g.png)

Consumer Key y Consumer Secret para configurar nuestra iOS app

4\. Vamos al `AppDelegate`, agregamos el `import TwitterKit` y la siguiente
linea en el metodo `didFinishLaunchingWithOptions` :

    
    
    TWTRTwitter.sharedInstance().start(withConsumerKey: "<consumerKey>", consumerSecret: "<consumerSecret>")

Donde reemplazamos `<consumerKey>` y `<consumerSecret>` por el **Consumer
Key** y el **Consumer Secret** de la secci on anterior.

Listo! Ya tenemos configurada nuestra app y ya podemos consumir la API de
Twitter.

Para mas informacion pueden ver la guia oficial de Twitter
[aca](https://github.com/twitter/twitter-kit-ios/wiki/Installation).

### Authentication con Twitter

Para poder usar el login con Twitter en nuestra app tenemos que realizar lo
siguiente:

  1. Vamos al `AppDelegate` e implementamos el siguiente metodo:

    
    
    func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {  
       return TWTRTwitter.sharedInstance().application(app, open: url, options: options)  
    }

Esto nos permitira handlear el log en nuestra app, para poder guardar el
authentication token.

2\. Agregar`SafariServices.framework` para poder `SFSafariViewController`, en
caso que la app de Twitter no este instalada en el dispositivo y tengamos que
usar Safari para poder lograr el login.

3\. La manera mas facil de hacer el Twitter login es agregar un boton de tipo
`TWTRLogInButton` con el cual el usuario tendra su sesion de Twitter en
nuestra app y ademas obtendremos todos los datos necesarios para poder hacer
tweets con su cuenta mas adelante.

Para ello, en nuestro ViewController agregamos `import TwitterKit` y en el
metodo `viewDidLoad()` insertamos el siguiente codigo:

    
    
    let logInButton = TWTRLogInButton(logInCompletion: { session, error in  
        if let session = session {  
                    print("signed in as \(session.userName)");  
                } else {  
                    let errorDescription = error?.localizedDescription ?? "unknown"  
                    print("error: \(errorDescription)");  
                }  
    })  
    logInButton.center = self.view.center  
    self.view.addSubview(logInButton)

Compilamos la app y deberiamos ver algo como esto:

![](/img/1*vFm4IXbrWwDagTNRPl75_g.png)

Agregamos el boton de Log in with Twitter

Nos va a pedir abrir la App de Twitter, le damos a **Conectar** y nuestra app
ya tiene los datos de sesi on del usuario.

Debuggeamos un poco y vemos la data que nos provee el login:

![](/img/1*l0750PouSENWopi2PbUKhw.png)

Datos de sesion de Twitter en nuestra app

Esto nos confirma que ya estamos logueados con Twitter en nuestra app.

El codigo final lo pueden ver
[https://github.com/fedejordan/SimpleRTApp,](https://github.com/fedejordan/SimpleRTApp)
tag `login_with_twitter`. Es importante aclarar que deberan usar sus propias
CostumerKey y CostumerSecret cuando compilen.

### Retweet con tweetId

Otra funcionalidad que queriamos hacer es, dado un tweetId, retuitearlo
automaticamente. Esto nos permitira mas adelante recibir las pushes [Link a
Articulo de pushes] con el tweetId y retuitearlo automaticamente en nuestra
app.

Para ello vamos a la documentacion de Twitter y vemos si hay alguna
funcionalidad que nos permita hacer esto. Pero primero vamos a probar un poco
la API de tweets.

Creamos un `RetweetViewController` y agregamos el siguiente codigo:

{% gist c1488c263561216e6763dd1c3b6021a0 %}

Maquetamos una pantalla simple (que presentamos cuando el login fue exitoso)
de este estilo:

![](/img/1*kwven2vCI0P2E89fC_5wBA.png)

RetweetViewController en Storyboard

Probamos poner en el text field el numero 20 y vemos que nos da como
resultado:

![](/img/1*lSW37Rp_NNAbA2WNNIs1kw.png)

Texto del tweetId 20

Mas informacion de como cargar un simple tweet en [esta
pagina](https://github.com/twitter/twitter-kit-ios/wiki/Access-Twitter%27s-
REST-API). El codigo se encuentra en el mismo repo de antes en el tag
`tweet_query`.

Ahora que vimos como trabaja la API de Twitter vemos como es la documentacion
para hacer un retweet. [Aca esta la
especificacion](https://developer.twitter.com/en/docs/tweets/post-and-engage
/api-reference/post-statuses-retweet-id).

Para ello tenemos que construir una Tweet Request de forma manual. Cambiamos
el siguiente codigo de `RetweetViewController` para usar la API:

{% gist bb403fc281b75926d8cb988515de9188 %}

Algo a destacar es que cambiamos la inicializacion de `TWRTAPIClient()` por
`TWRTAPIClient.withCurrentUser()`, ya que necesitamos que el cliente sepa las
credenciales del usuario.

Compilamos la app, ponemos el tweet id 20 y vemos que retweteamos
satisfactoriamente:

![](/img/1*WJ0GY0TnnLAoTzE_190OSA.png)

Retweet done :)

Si vemos que por algun motivo nos da el siguiente error:

    
    
    Error: Error Domain=TwitterAPIErrorDomain Code=220 "Request failed: forbidden (403)" UserInfo={NSLocalizedFailureReason=Twitter API error : Your credentials do not allow access to this resource. (code 220), TWTRNetworkingStatusCode=403, NSErrorFailingURLKey=https://api.twitter.com/1.1/statuses/retweet/20.json, NSLocalizedDescription=Request failed: forbidden (403)}

Es porque no configuramos correctamente los permisos de nuestra app (se le
necesita avisar explicitamente al usuario que la app va a hacer uso de la
funcionalidad de retweet). En ese caso, tendriamos que ir a la configuracion
de la app en Twitter y chequear que tenga permisos de **Read and Write**.

Tambien puede ser que no hayamos usado `TWRTAPIClient.withCurrentUser()` para
hacer el retweet, ya que el request tiene que ser autenticado.

El codigo final lo pueden ver como siempre en el [repo del
proyecto,](https://github.com/fedejordan/SimpleRTApp) tag `retweet`.

### Resumen

Aprendimos como crear una app en Twitter. Los pasos necesarios para
configurarla, que permisos necesitamos y que keys son importantes. Despues
vimos como instalar el SDK, autenticar al usuario, cargar un tweet mediante su
Id y finalmente hacer un retweet de ese mismo tweet con el SDK de TwitterKit.

Cualquier consulta o sugerencia estan bienvenidos a escribir un comentario en
el post o mandar un mail a fedejordan99@gmail.com. Tambien pueden mandar un
mensaje a mi [twitter](http://www.twitter.com/FedeJordan90).

¡Gracias por leer el articulo!

