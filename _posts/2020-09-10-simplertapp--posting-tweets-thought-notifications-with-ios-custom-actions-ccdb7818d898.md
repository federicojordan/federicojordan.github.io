---
layout:	"post"
categories:	"blog"
title:	"SimpleRTApp: Posting tweets thought notifications with iOS custom actions"
date:	2020-09-10
thumbnail:	/img/0*BX668trR8xXqVbOz.png
author:	
---

* * *

_This article is also available on mi personal blog_

This article is part of a series that aims to build a system to send
notifications of relevant articles of Twitter, with the purpose of being
easily retweeted. [Here](https://medium.com/@federicojordn/how-to-obtain-
relevant-tweets-in-a-ios-app-with-heroku-nodejs-swift-4c0027c88a4a) is the
complete article.

I'm going to do a summary of what we've seen on previous posts.

So far now we have to:

  * Look on a data base with iOS device tokens y find its favourite hashtags.
  * Do the Twitter request so we can see the last tweet with that hashtags
  * Send the tweet conteent and tweetId by push notification
  * If the user did a tap on retweet action, open the app and retwet the content in his account automatically.

Because of that I'm going to do everything in different steps trying to be as
understandable as possible on each one.

### Requirements

This post assumes that you read previous posts related with SimpleRTApp
project, in a way you can understand the next files and the design we have
now.

Regarding technical requirements, we would need a bit of knowledge about
Node.js and Swift for the iOS app.

### Finding hashtags

The idea, at the end, is to have a script that we could run in a certain
frequency (let's say, every 6 hours for instance) and it send the selected
tweets to the users

To do that, we have to create this script so we, simply running it, it find
the tweets and send them to the users

We're going to create a new file `send_tweets.js` with the following code:

<script src="https://gist.github.com/fedejordan/82faec0c664e54e2508e674387a3d991.js"></script>

So on terminal we can run `node send_tweets.js` with the following result:

    
    
    MacBook-Pro-de-Federico-Jordan:SimpleRTAppAPI federicojordan$ node send_tweets.js   
    Connected!  
    Query completed  
    device token: f74f0d895a22249e75057c91e90543b5f5039cb5dd3880f9b4506b705680ceab hashtags: #swift #ios

 _Note: It 's important to verify with SequelPro that we have a real device
token in our data base, other way we won't be able to correctly test the
script.

As we can see, we show the device tokens and related hashtags for every one.
In my case I have just one on the database.

### Fetching tweets

Do you remeber our post about Twitter Search API with Node.js? Well, it's time
to use it. We open `relevant_tweets.js` and we change its content so it can be
used from other file:

<script src="https://gist.github.com/fedejordan/0d3b899487d740e6657093e3583ac201.js"></script>

With this we can access to these utilities from `send_tweets.js`:

<script src="https://gist.github.com/fedejordan/90298781bae66ae79a1f3d4defa6bacb.js"></script>

In console, the output will be:

    
    
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

This is the last published tweet with these hashtags.

### Sending tweet thought push notification

Now we have to send this information with a push notification, from our
server. In a similar way we did with the tweets helper, we do it with our
script `send_push.js`:

<script src="https://gist.github.com/fedejordan/2fd333858c19b1d866948db8c86c8f4d.js"></script>

We export a `sendPush` function which accepts `deviceToken` , `tweetText` and
a `tweetId`.

Something to say is that we add on the payload the `tweetId`, since we will
need it on the app to retweet it.

We add the sending pushes feature to our script `send_tweets.js` and it'll be
something like this:

<script src="https://gist.github.com/fedejordan/88b6528684d70c26d3ed63ebe25ee0d9.js"></script>

We adjust a little the callbacks, and we use the `notificationsHelper` (which
uses the functions on `send_push.js`)

Finally, we test all our logic and see if the push arrives to our device. We
run `node send_tweets.js` on terminal:

![](/img/0*BX668trR8xXqVbOz.png)

Great! We have set our script on our server.

### Reading iOS custom actions

Now we have to implement the needed logic to manage custom actions inside the
app. To do that, we create a class `PushNotificationsActionsHandler`which will
be in charge of the pushes actions related logic:

<script src="https://gist.github.com/fedejordan/8b6ae3e0687b7576a64467a367beeb6b.js"></script>

Basically it inits with a `UIWindow` object to have access to app navigation.
After that we implement a `UNUserNotificationCenterDelegate` to know when user
taps on a custom action. Finally, if it was a retweet type, we open
`RetweetViewController` with the needed data to do the automatic retweet.

To be able to use this class, we need to instantiatee it on `AppDelegate`. We
create a `PushNotificationsActionsHandler` and add the following lines on
`didFinishLaunching` method:

<script src="https://gist.github.com/fedejordan/b29770139251ec2a56adde01431e1b5a.js"></script>

Later we change a bit `RetweetViewController` to accept the new retweet logic
when it loads:

<script src="https://gist.github.com/fedejordan/a21d2937c88bdf30236c727ef07b3ecd.js"></script>

We build the app to have it update on device. It's important to be logged on
there with Twitter.

We go to treminal, run `node send_tweets.js`, receive the tweet, we tap on
retweet custom action, and we can see how it opens and does a retweet from
the sent tweet. We enter to Twitter to check the action:

![](/img/0*VTRIoPLwUT24_SSd.jpeg)

It worked! We now have our system working. It's enough to run `node
send_tweets.js` on terminal, and it will send a push notification with the
last published tweet with these topics.

You can see the final code on the tag `retweet_from_custom_action`.

The last task to do is to deploy it on some server so it can be executed
between some time. It'll be related on the next posts.

Thanks for reading!

