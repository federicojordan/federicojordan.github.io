---
layout:	"post"
categories:	"blog"
title:	"Cómo hacer UI testing en iOS con FBSnapshotTestCase"
date:	2018-02-16
thumbnail:	/img/1*1Y6LwJByA-FLJs4ho7bFRw.jpeg
author:	
---

* * *

![](/img/1*1Y6LwJByA-FLJs4ho7bFRw.jpeg)

¿Cuantas veces nos paso de cambiar algun codigo en un View Controller y que al
probar la app en produccion la vista haya cambiado magicamente? ¿No deberiamos
tener alguna forma de asegurarnos que la vista no cambie si no es lo deseado?

 **Es por eso que es importante hacer UI testing**. De esta forma, nos
aseguramos que, si no queremos cambiar la UI, la app va a mantener la
apariencia que siempre tuvo.

En este articulo vamos a centrarnos en el uso de
[FBSnapshotTestCase](https://github.com/uber/ios-snapshot-test-case) para
integrar tests de UI a un proyecto muy simple.

#### Historia de FBSnapshotTestCase

Inicialmente, FBSnapshotTestCase fue creado por el equipo de
[Facebook](https://github.com/facebookarchive/ios-snapshot-test-case). Una
herramienta muy util, que permitia una sencilla implementacion con solo
integrar la biblioteca al proyecto e instanciar el View Controller que se
quiera testear.

Al parecer, no hubo actualizaciones del SDK en el ultimo año. Segun parece,
Facebook habria creado otra herramienta mas ligada a su uso interno (supongo,
algun codigo mas ligado a su propia CI/CD) y es por eso que depreco el
mantenimiento de esta herramienta.

Afortunadamente para nosotros, **Uber decidi o hacer un fork del proyecto y lo
mantiene hoy en dia.**

### Diferencia con Fastlane Snapshot

FBSnapshotTestCase son en realidad tests unitarios que permiten comparar una
imagen de referencia de un UIViewController (podria ser tambien una UIView,
pero por lo general se hace por pantalla completa) con la imagen actual que
nos daria el proyecto. De esta forma, si hay inconsistencias (diferencias
entre la primera y segunda imagen) se genera una tercer imagen con las
diferencias marcadas en una escala de grises. Si se genera esta tercer imagen,
es decir, si hay diferencias entre la imagen de referencia y la actual del
proyecto, se genera un error en ese test unitario y los tests fallan.

Fastlane nos provee una herramienta parecida, [Fastlane Snapshot
](https://docs.fastlane.tools/actions/snapshot/)([repositorio](https://github.com/fastlane/fastlane/tree/master/snapshot))
la cual permite realizar capturas de pantalla en los UI tests de Xcode. Cuando
terminan todos los tests de UI, si fueron satisfactorios, se genera un HTML
con todas las capturas de pantalla. Tambien nos permite por defecto setear los
devices y lenguajes que queramos. Esto puede ser bastante util para probar
todas las combinaciones (si tenes 3 lenguajes, 10 pantallas en la app, y
soportas 5 dispositivos, te genera 3 x 10 x 5 = ¡150 capturas!). El problema
es que es solo una captura de pantalla, no nos brinda informacion de si la
imagen es la deseada para el producto.

En resumen, FBSnapshotTestCase nos permite comparar y decirnos si tenemos
algun error, Fastlane Snapshot solo nos brinda capturas de pantallas en
nuestros UI tests de Xcode.

### Lista de temas

Vamos a abarcar los siguientes temas, tratando de aprovechar lo mas posible el
poder que nos da esta herramienta:

  * Como integrar FBSnapshotTestCase
  * Refactorizar codigo con SnapKit y uso de FBSnapshotCase
  * Creacion de un script para la generacion de pantallas con diferentes resoluciones.

### Como integrar FBSnapshotTestCase

Para poder empezar el tutorial, vamos a descargar el siguiente projecto de
ejemplo en el branch `master`
[https://github.com/fedejordan/FBSnapshotTestCaseExample](https://github.com/fedejordan/FBSnapshotTestCaseExample.git)

Vamos a compilar el proyecto en el simulador (yo use iPhone 8) y vamos a ver
la siguiente pantalla:

![](/img/1*CeGmQXrrbzgnEK7dUfkgdg.png)

Pantalla del codigo de ejemplo

Un simple View Controller que podria ser la primer pantalla de cualquier
aplicacion, con los botones de login y register.

Para poder integrar el SDK de FBSnapshotTestCase yo use
[CocoaPods](https://cocoapods.org/). No deberia haber problema integrando el
SDK con Cartage o directamente copiando la biblioteca al proyecto. Pueden ver
los pasos en [la guia del repositorio](https://github.com/uber/ios-snapshot-
test-case). De todas formas, los transcribo a continuacion:

  1. En la terminal hacemos `pod init` para crear nuestro podfile
  2. En el podfile ponemos` pod 'iOSSnapshotTestCase'`
  3. Hacemos `pod install` en la terminal

La version que estoy usando para este proyecto es la 2.1.6

Una vez ya integrado a nuestro proyecto, abrimos el xcworkspace generado por
CocoaPods y compilamos el proyecto para ver que todo este bien.

Como dice en [la guia oficial de FBSnapshotTestCase,](https://github.com/uber
/ios-snapshot-test-case) vamos a `Edit Scheme -> Run configuration`, para
setear correctamente los directorios de las imagenes de referencia y las
imagenes de los tests fallidos (las que tienen las diferencias con las
imagenes de referencia). Seteamos las correspondientes variables de entorno:

![](/img/1*7PJMEw7UiATPgTiU3-c-aw.png)

Ahora si, vamos a crear nuestro primer test unitario con FBSnapshotTestsCase.
Para eso, hacemos lo siguiente:

  1. Creamos un nuevo test de unidad y subclaseamos `FBSnapshotTestCase` en vez de `XCTestCase`.
  2. Desde el test, usamos `FBSnapshotVerifyView` para indicar la vista que queramos capturar. Para ello instanciamos la clase ViewController desde el Storyboard.
  3. Correr el test una vez con `self.recordMode = YES;` en el metodo `-setUp` de la clase del test. Esto crea las imagenes de referencia en disco. Se hace cada vez que se quiera hacer un cambio intencionado en una pantalla.
  4. Remover la linea que habilita el modo de grabacion y correr el test nuevamente.

Nuestro codigo deberia quedarnos muy parecido al siguiente:

Ejemplo de primer snapshot test

Si vamos al Finder a buscar la carpeta `Tests/ReferenceImages` vamos a ver la
imagen guardada de nuestro View Controller en un iPhone 8:

![](/img/1*KNE8hna1ItjfDHWYHiI_GQ.png)

Imagen de FBSnapshotTestCase guardada en disco

Esta imagen es la que se usara para comparar con las siguientes imagenes que
genere nuestro proyecto a medida que vayamos agregando o modificando cosas.

Si quieren ver el resultado de implementar el test, pueden hacer un `check
out` al branch `first_snapshot_test` en el repo del cual bajamos el proyecto
de ejemplo.

### Refactorizacion del codigo de la vista

Vamos a ver un uso practico que nos puede dar esta herramienta.

Digamos que empiezo a trabajar en equipo y decido que los Storyboards no son
algo escalable, por lo que decido migrar toda la creacion de la UI de mi
proyecto a codigo. Investigue un poco, y me gusto una herramienta llamada
[SnapKit](https://github.com/SnapKit/SnapKit).

No voy a centrarme en detalles de como usar esta biblioteca. Asi que voy a
mostrar directamente el codigo que resulta de crear la misma pantalla creada
anteriormente con Storyboard, esta vez con Snapkit.

Para ello, fue necesario eliminar el Storyboard e instanciar el View
Controller desde el AppDelegate. En el test usamos `let viewController =
ViewController()`para instanciar la clase `ViewController`.

{% gist 1feebeb9a08bc909a863b5389264f98a %}

Ahora vamos a probar si refactorizamos correctamente la vista con
FBSnapshotTestCase, para ellos hacemos Cmd+U.

Finalizado, vemos que obtenemos un error:

![](/img/1*0fgAp8yvTmPxATtfI-4f6w.png)

Error al testear el refactor con SnapKit

Vamos a la carpeta `FailureDiffs` y vemos que paso:

![](/img/1*GIFWnuCfUksxpZfs6ewZSA.png)

Diferencia de la imagen actual con la de referencia

 **Al parecer, pusimos mal las contraints para la imagen.** Como se ve, es el
unico objeto que parece estar diferente en la UI.

Vamos al codigo y cambiamos:

    
    
    make.top.equalTo(titleLabel.snp.bottom).offset(100)

Por esto:

    
    
    make.top.equalTo(titleLabel.snp.bottom).offset(60)

Probamos con Cmd+U de nuevo, y el test nos deberia dar bien.

![](/img/1*kRZnH6wvmYH9lIvfvAN33Q.png)

Refactor approved :)

Pueden bajar el refactor final con SnapKit haciendo un `checkout` del branch
`snapkit_refactor`del git del proyecto de ejemplo.

### Generacion de las pantallas con diferentes resoluciones

En el ejemplo anterior, vimos como usar la herramienta para un iPhone 8. ¿Pero
que pasa si queremos testear en todos los dispositivos?

Tendriamos que configurar los tests para hacerlo en los diferentes simuladores
cada vez que queramos. Algo no muy practico a simple vista.

Es por eso que me tome el trabajo de crear un script que haga los tests en los
dispositivos que se deseen. Algo parecido a la configuracion de Fastlane
Snapshot, pero sin soporte para varios lenguajes.

Para poder usar el script es necesario que en el metodo `setUp()` de la clase
de test indiquen `self.isDeviceAgnostic = true` asi se agrega el nombre del
dispositivo al archivo de imagen.

El script es publico y lo pueden ver a continuacion. Solamente tienen que
cambiar el nombre del `workspace` y el `scheme`:

{% gist fc8013096ed6313e8c6d137ed8331100 %}

Genera como salida los screenshots de todos los dispositivos que se indiquen.
Para ver si hubo algun error en alguna captura, basta con ver la salida que
genera.

En el ejemplo, solo inclui los dispositivos de tipo iPhone, pero se pueden
incluir tambien otros que soporte el proyecto.

Mas adelante voy a intentar hacer el mismo script adaptandolo a diferentes
lenguajes tambien, con la generacion de una web page que muestre todos los
resultados. Mas parecido a como trabaja Fastlane Snapshot.

### Resumen

Aprendimos a como usar una herramienta simple pero poderosa, que nos permite
chequear si accidentalmente metimos algun cambio no deseado en nuestra UI.

Vimos un ejemplo de como refactorizar una vista desde un Storyboard a usar
SnapKit, y como FBSnapshotTestCase nos permite corroborar que hicimos las
cosas bien.

Por ultimo, comparti un script que permite la creacion de screenshots en
tantos dispositivos se le indiquen. Útil cuando tenemos diseños que requieren
especial cuidado en todas las pantallas.

Si te gusto el articulo o ves algun error que podrias corregir no dudes en
comentarlo o mandarme un mail a fedejordan99@gmail.com

¡Muchas gracias! :D

