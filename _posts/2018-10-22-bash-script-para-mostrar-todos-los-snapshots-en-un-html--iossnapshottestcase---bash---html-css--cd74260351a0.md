---
layout:	"post"
categories:	"blog"
title:	"Bash script para mostrar todos los snapshots en un HTML (iOSSnapshotTestCase + Bash + HTML/CSS)"
date:	2018-10-22
thumbnail:	/img/1*sA-U55DRna_xhYzUUbiOlQ.png
author:	
tags: ui-testing snapshots bash script ios swift html spanish
---

* * *

![](/img/1*sA-U55DRna_xhYzUUbiOlQ.png)

Photographer robot

### Introduccion

Siempre es bueno automatizar. Y si lo combinamos con herramientas que ya nos
ayudan en el dia a dia podemos ahorrrarnos mucho trabajo y facilitar la vida
de los demas.

En este post vamos a ver como generar un archivo HTML con todos los snapshots
de un proyecto iOS. Los mismos van a ser generados con
[iOSSnapshotTestCase](https://github.com/uber/ios-snapshot-test-case).

### Requerimientos

  1. Tener un proyecto iOS con [iOSSnapshotTestCase integrado y funcionando.](https://medium.com/@federicojordn/c%C3%B3mo-hacer-ui-testing-en-ios-con-fbsnapshottestcase-12e9641df97) Escribi un articulo sobre como usarlo, [mas informacion aca](https://medium.com/@federicojordn/c%C3%B3mo-hacer-ui-testing-en-ios-con-fbsnapshottestcase-12e9641df97).
  2. Tener conocimientos minimos de [Bash scripting](https://ryanstutorials.net/bash-scripting-tutorial/bash-script.php)

### Procedimiento

#### Descargando el proyecto de ejemplo

Como es un requisito tener el proyecto ya integrado con snapshots, vamos a
usar un proyecto de ejemplo que yo mismo cree. Para ello hacemos:

`git clone https://github.com/fedejordan/SnapshotsHTMLExample`

Podemos ver que los pods ya estan descargados (los subi al proyecto para
descargarlos mas rapido) y ademas tenemos algunos snapshots generados para los
siguientes devices: iPhone SE, iPhone 8, iPhone 8 Plus, iPhone XR y iPhone XS
y iPhone XS Max.

![](/img/1*GWhstAjtcGeqwG_jM2_iwA.png)

Snapshots ya generados

Algo para recordar, para tener diferentes snapshots, en el metodo `setUp()`
esta puesta la siguiente linea:

`agnosticOptions = FBSnapshotTestCaseAgnosticOption.screenSize`

Esto genero archivos PNG con la resolucion dentro del filename.

#### Creando el archivo de script

Primero creamos un archivo llamado `create_snapshots_html.sh` dentro de la
misma carpeta donde se encuentra el .xcworkspace, con el siguiente contenido:

<script src="https://gist.github.com/fedejordan/537a3a072fbd47c07a2b5d8ae0397c28.js"></script>
Guardamos, y en la aplicacion de la terminal ejecutamos el siguiente comando:

`sh create_snapshots_html.sh`

Lo que imprimira el siguiente resultado:

    
    
    federico$ sh create_snapshots_html.sh   
    Hello, I'm a script!

Basicamente, el comando `echo` lo que hace es imprimir una cadena de
caracteres.

#### Tareas a ejecutar en el script

Vamos a repasar la lista de tareas que tenemos que hacer para poder generar el
archivo HTML:

  1. Obtener todos los subdirectorios donde hay archivos de snapshot. En nuestro caso va a ser solo uno, `SnapshotsHTMLExampleTests.SnapshotsHTMLExampleTests.`Esto es asi ya que el formato es [Target].[NombreArchivoDeTests]
  2. Crear el archivo HTML, con sus correspondientes HTML tags
  3. Iterar sobre la lista de subdirectorios obtenidas en el paso 1 y obtener una lista de todos los archivos PNGs que contiene
  4. Iterar sobre esa lista de archivos PNG y crear el codigo HTML correspondiente para mostrar un tag `<img>` con el source del filepath completo. Agregar ese codigo HTML parcial al archivo HTML creado anteriormente.
  5. Una vez ya iteradas todas las imagenes, cerramos el HTML asi queda listo para ser visto en el browser.
  6. Abrir el archivo HTML generado.

Vamos a ver paso a paso viendo la salida que genera cada uno.

#### Obtener subdirectorios

Cambiamos el contenido de `create_snapshots_html.sh` por el siguiente:

<script src="https://gist.github.com/fedejordan/d0bf094d3630884729568410aa5f79cc.js"></script>
  1. Creamos dos variables `SNAPSHOTS_DIR` y `TEST_TARGET` con la ruta de las imagenes y el nombre del test target respectivamente.
  2. Abajo, agregamos un comentario indicando que es lo que vamos a hacer e imprimimos un texto indicando lo que se esta haciendo.
  3. En la variable `SNAPSHOT_SUBDIRECTORIES` usamos los comandos `find`, `sort` y `awk` para buscar, ordenar y filtrar las carpetas de cada archivo de test que tengamos (en nuestro caso, seria una sola: `SnapshotsHTMLExampleTests.SnapshotsHTMLExampleTests`)
  4. Por ultimo, iteramos sobre `$SNAPSHOT_SUBDIRECTORIES` para obtener una lista con las carpetas (en nuestro caso, tendriamos un unico valor, `SnapshotsHTMLExampleTests`). Esto lo hacemos para poder separar el archivo HTML en secciones posteriormente.

Podemos probar la salida que generamos agregando `echo $subdirectories` al
final del for:

    
    
    federico$ sh create_snapshots_html.sh   
    Getting subdirectories…
    
    
    SnapshotsHTMLExampleTests

#### Creando el archivo HTML

A lo anterior, le agregamos lo siguiente:

<script src="https://gist.github.com/fedejordan/b97604a0a5e6473a0a93b395f2c74c2a.js"></script>
  1. Imprimimos en consola que estamos creando el archivo HTML
  2. Creamos el archivo `snapshots_preview.html`
  3. Le agregamos el tag `<html>` y el `<body>`. Lo vamos a cerrar mas adelante

Podemos comprobar en la carpeta del proyecto que se creo el archivo. Por
ahora, no es un HTML valido.

Si ejecutamos `sh create_snapshots_html.sh` en este momento obtenemos:

    
    
    federico$ sh create_snapshots_html.sh   
    Getting subdirectories…  
    Creating HTML file…

#### Obtener PNGs

Agregamos mas abajo el siguiente codigo (desde Obtaining PNG files):

<script src="https://gist.github.com/fedejordan/94945d3e88fcb0ff7300c136c019861b.js"></script>
  1. Imprimimos en pantalla que vamos a iterar sobre los subdirectorios obtenidos anteriormente
  2. Iteramos sobre el array `subdirectories`
  3. Obtenemos el completePath para todos los archivos PNG dados un `SNAPSHOTS_DIR` y un `TEST_TARGET`. Imprimos en pantalla el resultado
  4. Iteramos por cada archivo de snapshot en ese array obtenido.
  5. Obtenemos el filename, con ayuda del comando `cut`, para luego usar como title en el archivo HTML. Lo imprimimos en pantalla.

Si ejecutamos `sh create_snapshot_html.sh` deberiamos obtener una salida
parecida a esta (adjunto imagen para verlo mejor):

![](/img/1*cl0Ev1UzW0cGItqImpB-pw.png)

Salida con los archivos PNG obtenidos

#### Crear tag `<img>` por cada PNG encontrado

Reemplazamos desde el primer `for` hasta el ultimo `done` con el siguiente
codigo:

<script src="https://gist.github.com/fedejordan/bc1b1b21f79b51588b64dd481ffe0c0d.js"></script>
  1. Por cada subdirectorio encontrado, agregamos un titulo con el tag `<h1>` con el nombre del subdirectorio. Esto nos sirve para agrupar los PNG en sus diferentes grupos de tests (archivos swift de test). Ademas seteamos el estilo del `<div>` de seccion.
  2. Habiendo encontrado el filepath completo de cada PNG, agregamos un `<div>` con un `<p>` con el filename y un `<img>` con source el filepath de la imagen. Agregamos bordes en los estilos para separar un poco mas prolijo todo.
  3. Cerramos el tag de seccion.
  4. Cerramos el archivo HTML.

Si ejecutamos el script nuevamente, nos deberia generar el HTML completo:

![](/img/1*5zXzGDJ91ufuSKHJS6UF7A.png)

snapshots_preview.html

#### Abrir el archivo HTML creado

Simplemente agregamos lo siguiente al final del archivo:

    
    
    # Open HTML file  
    echo "Opening HTML…"  
    open snapshots_preview.html

Imprimimos en pantalla que vamos a abrir el archivo y mediante el comando
`open` lo abrimos en nuestro browser predeterminado.

#### Resultados

El script completo quedaria de la siguiente forma:

<script src="https://gist.github.com/fedejordan/edf9c767f3beb43929ec7293ac16afcc.js"></script>
Como vemos, no es necesario ser expertos en Bash ni en HTML, con menos de 50
lineas podemos generar un HTML bastante util si tenemos integrados snapshots
en nuestro proyecto.

#### Desafios

  * Hacer mas lindo el HTML :P
  * Iterar sobre subdirectorios (¿Que pasa si agregamos subcarpetas en los tests?)
  * Agregar contenido dinamico al HTML. Si tenemos 10000 snapshots, va a ser un poco dificil encontrar el que queramos ver.
  * Automatizar para que se envie un mail con el HTML file despues de generarlo
  * Integrarlo a [fastlane,](https://fastlane.tools/) podria ser el ultimo paso de `fastlane scan`

¡Gracias por leer el articulo!

Seguime en twitter para mas articulos :D

<https://twitter.com/FedeJordan90>

#### Sources

  * <https://www.tldp.org/LDP/abs/html/>
  * <https://github.com/uber/ios-snapshot-test-case>
  * <https://ryanstutorials.net/bash-scripting-tutorial/bash-script.php>

