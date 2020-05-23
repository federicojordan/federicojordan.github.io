---
layout:	"post"
categories:	"blog"
title:	"Bash script to show all snapshots in a HTML file (iOSSnapshotTestCase + Bash + HTML/CSS)"
date:	2018-10-29
thumbnail:	/img/1*sA-U55DRna_xhYzUUbiOlQ.png
author:	
---

* * *

![](/img/1*sA-U55DRna_xhYzUUbiOlQ.png)

Photographer robot

### Introduction

Automatize is always good. And if we also combine that with tools that are
already helping us every day we can save a lot of work and make everyone life
easier.

In this post we're going to see how to generate a HTML file with all the
snapshots of a iOS project. These are going to be generated with
[iOSSnapshotTestCase](https://github.com/uber/ios-snapshot-test-case).

### Requirements

  1. Having a iOS project with [iOSSnapshotTestCase integrated and working](https://medium.com/@federicojordn/how-to-do-ui-testing-in-ios-with-fbsnapshottestcase-caea27e3d5f4).
  2. Having minimum knowledge about [Bash scripting](https://ryanstutorials.net/bash-scripting-tutorial/bash-script.php).

### Procedure

#### Downloading example repo

Because it's mandatory to have an already snapshots integrated project, we're
going to use an example project that I've created. We proceed doing in
terminal:

`git clone <https://github.com/fedejordan/SnapshotsHTMLExample>`

We can see that the pods are already downloaded (I've uploaded them to the
project to download them faster) and also we have some generated snapshots for
the following devices: iPhone SE, iPhone 8, iPhone 8 Plus, iPhone XR, iPhone
XS and iPhone XS Max.

![](/img/1*GWhstAjtcGeqwG_jM2_iwA.png)

Already generated napshots

Something to remember, to have different snapshots, in the `setUp()`method
there is the following line:

`agnosticOptions = FBSnapshotTestCaseAgnosticOption.screenSize`

This generated PNG files with the screen resolution inside the filename.

#### Creating script file

First we create a file called`create_snapshots_html.sh` inside the same folder
where the .xcworkspace is, with the following content:

<script src="https://gist.github.com/fedejordan/537a3a072fbd47c07a2b5d8ae0397c28.js"></script>
Save the file, and in the terminal app we run the following command:

`sh create_snapshots_html.sh`

And it'll print the result:

    
    
    federico$ sh create_snapshots_html.sh   
    Hello, I'm a script!

Basically, the`echo` command what it does is to print a string.

#### Tasks to execute in the script

We're going to list the tasks that we have to do to generate the HTML file:

  1. Obtain all the subdirectories where there are snapshot files. In our case it's going to be just on`: SnapshotsHTMLExampleTests.SnapshotsHTMLExampleTests.`This is like this because the format is [Target].[TestsFileName]
  2. Create the HTML file with all the corresponding HTML tags.
  3. Iterate over the subdirectories list obtained in first step and obtain a list of all the PNG files that it includes.
  4. Iterate over that PNGs files list and create the proper HTML code to show a `<img>`tag with the complete filepath as source. Add this partial HTML code to the HTML file created previously.
  5. Once we already iterated over all the images, we close the HTML so it's ready to be seen at the browser.
  6. Open the generated HTML file.

We're going to see step by step looking at the outpet that each one generates.

#### Obtain subdirectories

Change the `create_snapshots_html.sh` by the following:

<script src="https://gist.github.com/fedejordan/d0bf094d3630884729568410aa5f79cc.js"></script>
  1. We create two variables `SNAPSHOTS_DIR` and`TEST_TARGET`with the images route and the test target name.
  2. Below, we add a comment pointing what we are going to do and we print a string telling what we are doing currently.
  3. Inside the variable`SNAPSHOT_SUBDIRECTORIES`we use the commands `find`, `sort`and `awk` to find, sort and filter the folders of each test file that we have (in our case, it would be just one:`SnapshotsHTMLExampleTests.SnapshotsHTMLExampleTests`)
  4. Finally, we iterate over`$SNAPSHOT_SUBDIRECTORIES` to obtain a list with the folders (again, in our case we would have a single value, `SnapshotsHTMLExampleTests`). This is important to organize the HTML file in many sections later.

We can test the output that we are generating adding`echo $subdirectories` to
the end of the for clause:

    
    
    federico$ sh create_snapshots_html.sh   
    Getting subdirectories…
    
    
    SnapshotsHTMLExampleTests

#### Creating the HTML file

To the previous code, we can add the following:

<script src="https://gist.github.com/fedejordan/b97604a0a5e6473a0a93b395f2c74c2a.js"></script>
  1. We print in console that we are creating the HTML file
  2. Create the file `snapshots_preview.html`
  3. We add the tag `<html>` and the `<body>`. We're going to close them later

At this point we can check that inside the project folder we created the file.
By now, it's not a valid HTML.

If we run `sh create_snapshots_html.sh` in this moment we have:

    
    
    federico$ sh create_snapshots_html.sh   
    Getting subdirectories…  
    Creating HTML file…

#### Obtaining PNGs

We can add below the following code (since Obtaining PNG files):

<script src="https://gist.github.com/fedejordan/94945d3e88fcb0ff7300c136c019861b.js"></script>
  1. We print in the screen that we are going to iterate over the subdirectories obtained previously.
  2. Iterate over`subdirectories` array.
  3. We obtain the completePath for all the PNG files from a `SNAPSHOTS_DIR` and a `TEST_TARGET`. Print in screen the
  4. Next, we iterate for each snapshot file in that array.
  5. We got the filename, helping us with the `cut`command, and later we use that as a title in the HTML file. We print the result in screen.

If we run `sh create_snapshot_html.sh` we should see an output very sinilar to
this one (I attach an image to see it better):

![](/img/1*cl0Ev1UzW0cGItqImpB-pw.png)

Output with the obtained PNG files

#### Create `<img> `tag for each found PNG file

Let's replace since the first `for` until the last `done` with the following
code:

<script src="https://gist.github.com/fedejordan/bc1b1b21f79b51588b64dd481ffe0c0d.js"></script>
  1. For each subdirectory found, we add a title with the `<h1>` tag, with the subdirectory name. This help us to group the PNGs in their different test groups (swift test files). Also, we set the section `<div>` style.
  2. Having found the complete filepath of each PNG, we add a `<div>` with a `<p>` with the filename, and `<img>` tag with the image filepath as source. We also add borders in the styles to split everything better.
  3. We close the section tag.
  4. We close the HTML file.

If we run the script again, it should generate us the complete HTML:

![](/img/1*5zXzGDJ91ufuSKHJS6UF7A.png)

snapshots_preview.html

#### Open the created HTML file

We simply add the following to the end of the file:

    
    
    # Open HTML file  
    echo "Opening HTML…"  
    open snapshots_preview.html

With that, we print in the console that we're going to open the file, and with
the `open`command we open it in our predetermined browser.

#### Results

The complete script should be something like this:

<script src="https://gist.github.com/fedejordan/edf9c767f3beb43929ec7293ac16afcc.js"></script>
As we can see, it's not necessary to be Bash or HTML experts, with less than
50 lines we can generate a very useful HTML if we have snapshots integrated in
our project.

#### Challenges

  * Do a prettier HTML file :P
  * Iterate over subdirectories. (What happens if we add subfolders in the tests?)
  * Add dynamic content to the HTML. If we have like 10000 snapshots, it would be a bit difficult to find the one that we want to see..
  * Automate the process so it can send an email with the HTML file after generating it.
  * Integrate it to [fastlane](https://fastlane.tools/), it can be the last step of `fastlane scan`

Thanks for reading!

Follow me on twitter to see more articles :D

<https://twitter.com/FedeJordan90>

#### Sources

  * <https://www.tldp.org/LDP/abs/html/>
  * <https://github.com/uber/ios-snapshot-test-case>
  * <https://ryanstutorials.net/bash-scripting-tutorial/bash-script.php>

