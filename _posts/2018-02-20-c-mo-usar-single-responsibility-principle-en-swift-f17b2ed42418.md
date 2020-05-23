---
layout:	"post"
categories:	"blog"
title:	"Cómo usar Single Responsibility Principle en Swift"
date:	2018-02-20
thumbnail:	/img/1*kSM1k05nq77ron-DjBX_FA.png
author:	
---

* * *

![](/img/1*kSM1k05nq77ron-DjBX_FA.png)

A veces, cuando estamos aprendiendo a programar, algo que nos cuesta entender
un poco es el concepto de responsabilidad de clase. Es por eso que nuestros
primeros proyectos se vuelven inmantenibles, con clases de muchas lineas de
codigo y, mucho mas critico, infinita cantidad de responsabilidades.

Una buena forma de saber realmente cual es la responsabilidad de cada clase es
pensar en la **escabilidad**.

Vamos a ver un ejemplo de como pensar de esta forma. Pero antes, quiero
introducir un poco de teoria y explicar porque es importante este concepto en
el diseño de software.

### Introduccion a Single Responsibility Principle

La idea de que cada clase tenga una unica responsabilidad en un proyecto de
software, y esa responsabilidad a su vez sea encapsulada en esa unica clase
tiene un nombre: [Single Responsibility
Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)

Este es uno de los 5 principios fundamentales de diseño de software
[SOLID,](https://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29)
donde, en programacion orientada a objetos, buscan sentar una base para
obtener un software lo mas entendible, flexible y mantenible. Estos principios
son:

  *  _Single responsibility principle_
  *  _Open/closed principle_
  *  _Liskov substitution principle_
  *  _Interface segregation principle_
  *  _Dependency inversion principle_

El autor de estos principios, [Robert C.
Martin](https://es.wikipedia.org/wiki/Robert_C._Martin) (autor de uno de los
libros mas importantes de arquitectura de software, [Clean
Code](http://blog.cleancoder.com/)) define el principio de SRP como _" Una
clase deberia tener solo una razon para cambiar"_, por lo que concluye que una
responsabilidad es una razon para cambiar.

Por ejemplo, consideremos un modulo que procesa e imprime un reporte.
Imaginemos, entonces, que este modulo podria ser modificado por dos razones.
Primero, el contenido del reporte (los datos) podria cambiar. Segundo, el
formato del reporte (la presentacion) tambien podria hacerlo. Estas dos
razones son, por diferentes causas, una sustancial y la otra cosmetica.

El principio define que estos dos aspectos son en realidad dos
responsabilidades separadas, y deberian estar en diferentes clases o modulos.
Seria un mal diseño acoplar dos cosas que pueden cambiar por diferentes
razones en diferentes tiempos.

La razon por la cual es importante mantener una clase en una simple
responsabilidad es lo que hace a la clase mas robusta. Continuando con el
ejemplo anterior, si hay un cambio al proceso de generacion de reporte, hay un
gran riesgo de que el codigo de impresion del reporte se altere si esta en la
misma clase.

### Por que es importante definir correctamente la responsabildad por clase

Si definimos nuestras clases sabiendo cual es la responsabilidad cumple en
nuestro projecto podemos:

  * Entender mas facilmente que funcionalidad realiza cada parte del codigo.
  * Modificar logica existente mucho mas rapido y prolijo.
  * Encontrar con menos problemas el origen de bugs o comportamientos no deseados.
  * Abstraer logica en diferentes clases o modulos.
  * Separar sin mayores problemas implementaciones de modo que puedan ser completamente reemplazadas posteriormente.
  * Definir tests unitarios por clase o modulo mas eficientemente, pudiendo testear una pequeña parte del codigo y no mas de lo que realmente queramos testear.

### Pensando en la escabilidad para definir responsabilidades

Como se dijo anteriormente, se puede pensar en la escabilidad de una clase
para definir responsabilidades. Esto es, simplemente, pensar si en nuestro
proyecto en algun momento se modifican los requerimientos, mirar en nuestra
arquitectura como se aplicarian esas modificaciones.

Si vemos que para un simple cambio de vista tenemos que modificar o reacomodar
logica de negocio, no estamos definiendo correctamente las responsabilidades
en nuestro proyecto, por ejemplo.

Vamos a ver un ejemplo concreto en Swift.

### Ejemplo en Swift

Supongamos que tengo una aplicacion que muestra una lista de items de
supermercado. Por ahora solo tengo un `ItemsViewController` que se encarga de
toda la logica de ese flujo, tanto la obtencion de los items, como de la
presentacion de los mismos. Ademas, se imprime un log cuando se selecciona un
item.

<script src="https://gist.github.com/fedejordan/b8554027600bbf5f9a64dd623dae2344.js"></script>![](/img/1*1Dq-bIVc5p8z3t_jLXb5Sw.png)

Pueden ver el codigo del proyecto en
[https://github.com/fedejordan/SRPExample,](https://github.com/fedejordan/SRPExample)
branch `master`.

Para ello, `ItemsViewController` utiliza un `UITableView` para mostrar los
items, en forma de lista. Tambien se utiliza una subclase de `UITableViewCell
`llamada `ItemTableViewCell` para mostrar cada elemento.

El problema radica en si queremos cambiar la vista, por ejemplo, por una
`UICollectionView`. ¿Cual es el problema en este caso?

 **El c odigo de la vista de la lista esta muy ligado a la logica de obtencion
de los items.** Es muy probable que modifiquemos la clase que se encarga de
devolver los objetos de tipo `Item` tambien.

En especifico, el problema esta en estas lineas:

    
    
    let item = items[indexPath.row]

¿Por que el problema esta aca?

Porque estamos usando el indice del `UITableView` para acceder al item
especifico en el array. Deberiamos abstraernos de alguna forma de que la vista
es un `UITableView`.

Para evitar ello, **refactorizamos** el `ItemsViewController` y movemos la
logica de obtencion de datos a otra clase llamada `ItemsInteractor`.

<script src="https://gist.github.com/fedejordan/bc73b4a65d0e58e87017e563155737e8.js"></script><script src="https://gist.github.com/fedejordan/9834e4c93d44671ec757eeef29ec2127.js"></script>
 El término Interactor tiene su origen en la arquitectura
[VIPER](https://www.objc.io/issues/13-architecture/viper/). Cómo lo dice
en su definicion, un Interactor contiene la logica de negocio para manipular
modelos de objetos (Entidades) para realizar una tarea en especifico. En este
caso, nuestro `ItemsInteractor` se encarga de devolver informaci on acerca
de algun o algunos objetos de tipo `Item`.

Esta version del codigo la pueden obtener en
<https://github.com/fedejordan/SRPExample> haciendo un `check out` al branch
`interactor_refactor`.

Como podemos ver, el `ItemsViewController` no conoce nada acerca del modelo de
datos. Simplemente pide al Interactor lo que necesita para poder renderizar la
pantalla. En un futuro podriamos cambiar el tipo de dato `Item` por otra cosa,
que solo hariamos cambios en el `ItemsInteractor`, este devolveria la misma
informacion y finalmente `ItemsViewController` puede seguir funcionando como
siempre.

Entonces, de esta forma, si queremos cambiar solo el layout de nuestra
aplicacion, simplemente cambiamos `ItemsViewController` para que use un
`UICollectionView`:

<script src="https://gist.github.com/fedejordan/584acb600bc660a2cf220a79c4c7754d.js"></script>
![](/img/1*NexoB1dLm11FnxD04W3l6Q.png)

Screenshot de ItemsViewController usando un UICollectionView

Pueden ver el resultado final en <https://github.com/fedejordan/SRPExample> en
el branch `collection_view_refactor`.

¿Cambiamos algo en el `ItemsInteractor`? Para nada. Simplemente cambiamos la
presentacion de los mismos.

Esto a su vez, nos permite testear de una forma mas modularizada. Podemos
empezar a [testear la vista](https://medium.com/@federicojordn/c%C3%B3mo-
hacer-ui-testing-en-ios-con-fbsnapshottestcase-12e9641df97) primero y despues
la logica de negocio. Claro que, para hacer tests correctamente tenemos que
hacer algo mas injectable, cosa que podamos inicializar los modulos con clases
mockeadas y dependamos de interfaces o `protocols `en Swift. Basicamente esto
se traduce en, por ejemplo, no instanciar el `ItemsInteractor` en
`ItemsViewController`, ya que es una dependencia y debe abstraerse de su
implementacion. Pero ello ya excede del proposito del articulo.

### Conclusion

A simple vista parece que no hicimos mucho trabajo. Simplemente separamos la
logica de la vista de la de obtencion de datos. ¿Nos sirvio realmente? En este
ejemplo puede que no sea muy util hacerlo, es mas, puede que simplemente se
necesite esa lista y nada mas.

Pero cuando tenemos UIs mucho mas complicadas, adaptar la misma vista a
diferentes data sources, o compartir el data source entre diferentes flujos,
aplicar este concepto nos permite reutilizar el codigo y escalar ante cambios
que haya tanto en la vista como en la logica de nuestro proyecto. Y para poder
lograr llegar a eso, es importante entender que responsabilidad debe tener
cada clase que lo conforma.

Me gustaria agregar que, en mi opinion, este concepto es condicion necesaria
para tener un buen codigo. De hecho, en cualquier codigo que estuviese mal
escrito, siempre se va a poder encontrar alguna clase con mas de una
responsabilidad. Es por eso que vimos la importancia del concepto de Single
Responsibility Principle.

Nuestro ejemplo en Swift nos permitio ver por que es tan importante definir
correctamente las responsabilidades. Como una correcta arquitectura
modularizada puede incidir significativamente en la escabilidad de nuestro
proyecto, simplemente por querer hacer un cambio de layout en una pantalla.

A modo de resumen me gustaria concluir que, mirando siempre en la
**escabilidad** de nuestro proyecto, podemos ver si estamos definiendo
correctamente las responsabilidades de nuestras clases o m odulos.

¡Muchas gracias por leer el post!

Espero que les haya gustado. Cualquier agradecimiento o sugerencia de los
temas que trate pueden hacerlo en los comentarios, o tambien comunicandose a
mi mail: fedejordan99@gmail.com

