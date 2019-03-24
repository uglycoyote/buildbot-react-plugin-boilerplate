# buildbot-react-plugin-boilerplate

Boilerplate setup for a buildbot plugin using React, Webpack and Plain JS or Typescript

## Synopsis

install:

```
npm install
pip install -e .  # this should run webpack automatically
```

iterate:

```npm run watch```

## Why?

The tech used for the Buildbot 9 web UI is already starting to show its age.  Currently it is using:

* **gulp** as a build system
* **coffeescript** as an alternative to javascript
* **AngularJS** which has been superceded by Angular 2, which is nearly a full rewrite

The idea behind this repo is to establish a way to use newer web tech for your buildbot plugin, even though buildbot is (for now at least) sticking with these older technologies.  It's totally possible to mix the new and the old.

In my own case, I was driven in this direction by performance issues with Angular that I could not find any good way to get past, besides just not using Angular.

This plugin sample is using:

* **Webpack** as the building/bundling solution
* **React** cooperating together with the existing **Angular** setup
* **Typescript** to provide additional compile time type checking and IDE assistance, though you can easily write in plain JS if you like

## Developing A Buildbot Plugin Locally

You *could* develop your new plugin directly on your buildbot server, but you may not want to for various reasons.  Fortunately there's a good workflow where you can develop locally using data from a remote server.

In my case, I'm developing my plugin on a Windows machine for deployment to a buildbot server that's running Ubuntu, so it's possible to develop in whatever OS environment you are comfortable.

These notes are somewhat based on [Pierre Tardy's tutorial](https://medium.com/buildbot/buildbot-ui-plugin-for-python-developer-ef9dcfdedac0), also on [Running buildbot with VirtualEnv](http://trac.buildbot.net/wiki/RunningBuildbotWithVirtualEnv)

### Requirements

install these things if you don't have them already

* [Node.js](https://nodejs.org/en/)
* NPM (node package manager)
* make (you probably already have it if you aren't on Windows, I used cygwin make)
* Python (I'm using python 3 but python 2 works as well)
  * pip [should come with python installation](https://pip.pypa.io/en/stable/installing/#do-i-need-to-install-pip)
  * [virtualenv](https://virtualenv.pypa.io/en/stable/installation/) (optional but recommended -- to avoid polluting your global python libs dir)
* yarn
  * install using ```npm install -g yarn```

### Set up Buildbot for local development

make a clone of buildbot sources

```git clone https://github.com/bb-nl/buildbot.git```

outside of that directory, make a virtualenv sandbox directory.  All ```pip install```s will install into that directory rather than the global python libs directory.

```virtualenv sandbox```

Whenever you are developing buildbot you must **activate** the sandbox

```source sandbox/bin/activate```  (or, on windows, ```sandbox\Scripts\activate```)

With the sandbox activated, ```cd``` into the ```buildbot``` directory that you cloned and install ```master``` and ```worker```

```
pip install -e master
pip install -e worker
```

Build buildbot's frontend from sources

```make frontend```

Windows-specific note: needed to ```pip install pypiwin32``` before this worked.

### Running buildbot proxy server

When developing locally, cd into ```www/base``` in the buildbot sources directory, and run

```gulp dev proxy --host nine.buildbot.net```

(replace nine.buildbot.net with your own buildbot server if you like)

browse to http://localhost:8080 and you should see buildbot's web interface running with the information from the server you are proxying.

### Setting up your new Plugin

get this repo

```git clone https://github.com/uglycoyote/buildbot-react-plugin-boilerplate.git```

change everywhere the name of this plugin occurs to whatever you want to call your new plugin.  You probably want to do this before you ```pip install``` the thing, at least the parts which are going to influence the python name of the plugin (names on the javascript side can be changed after you have it working).  The names relevant to python are

* any occurrences in setup.py
* the subdirectory ```buildbot_react_plugin_boilerplate```, containing the ```__init__.py file```
* in the ```webpack.config.js``` change the line ``` path: path.resolve(__dirname, "./buildbot_react_plugin_boilerplate/static")```

**Attention:** although the repo is named with hypens separating the words (as per javascript/npm convention), the python package names/identifiers are using underbars as separators (as per python convention)

then...

```
npm install
pip install -e .
```

Because we are using ``gulp dev proxy``, the proxy uses all the plugin available in the virtualenv to build the UI, so `pip install` is only needed to start working (and restart `gulp dev proxy`).

When running in a real buildbot, you need to change the master.cfg to configure your plugin

```python
  c['www']['plugins']['buildbot_react_plugin_boilerplate'] = {}
```
`buildbot_react_plugin_boilerplate` being the name of the `www entry_point` in `setup.py`


### Fixing up Javascript to use your own plugin name

I apologize — This step is somewhat tedious and error-prone due to the number of places where you need to change the name and the fact that different identifiers containing the plugin are following different conventions (as far as whether they use camelcase, underbars, or hyphens as word separators, or whether the word "buildbot" appears in the identifiers.).   The lack of consistency in this regard makes it a bit hard to  do a search-and-replace operation.

When trying to get the plugin running, keep your DevTools open in Chrome and watch for error messages in the console which will give you a lot of hints about what went wrong if you forgot to change a name somewhere.

On the javascript side, you'll need to rename the following

* The three classes in the Main.js:
  * The one under the comment ```//register the new module```
  * The class ending with ```Config```
    * within this class change the name under ```// name of the state```
    * change the ```caption```s under "Menu Configuration" and "Configuration"
  * The class ending with ```Controller```
  *  ```// Register new state```
    * change the URL
    * change the controller class name to match your new Controller's name
* At the end of the file, there's some lines which register those classes with Angular, which must be changed to reflect the new names of the classes.

## How React and Angular are Fitting Together

Buildbot's UI is based an Angular, but this plugin shows how it is possible have React cooperating with Angular.

The structure of other buildbot plugins is essentially

* HTML templates written in [Jade](https://naltatis.github.io/jade-syntax-docs/)/[Pug](https://pugjs.org/api/getting-started.html) syntax describe the page
* Angular directives (custom tags and looping structures) within the templates communicate with an Angular **Controller** class
* The controller class implements the view logic
* The controller class communicates with various other Angular **Service** classes, e.g. the buildbot ```dataService``` which is the main access point for the builds, changes, and other data from the JSON api

In this repo, the setup is similar, except

* rather than using HTML templates, most of the HTML is being produced by a hierarchy of **React Components**
* the top level React Component gets its data (its **props**) from the Angular Controller, which calls ```ReactDOM.render``` to invoke React to update


* We don't use a controller, but rather a custom directive, which is the way to connect with different UI framework in JS.  The directive has two roles:
  * interconnect react and angular.js
  * Get the buildbot data from the api and forward it as **props** to React.

The directive may want to massage the data a bit get it into a form that's more appropriate for the view.  Ideally the **props** should only change when you want the view to change, so if there's extra data returned by the ```dataService``` that your view doesn't need, the directive can play the role of filtering that into a more view-relevant form.

 ### Taking Advantage of Typescript

I have included a file ```BuildbotJsonInterfaces.ts``` containing a bunch of interface descriptions for the data which is available using the JSON API.  These interfaces are automatically generated by requesting URL's such as http://nine.buildbot.net/api/v2/changes?limit=10 and then using [json2ts](https://github.com/GregorBiswanger/json2ts) to convert the json into typescript interfaces.

By importing the interfaces using

```import {Change, Build} from 'BuildbotJsonInterface'```

 you will get auto-completion in Visual Studio Code or Sublime Text (or other editor's using the Typescript Language services.)



![](https://github.com/uglycoyote/buildbot-react-plugin-boilerplate/blob/master/documentation/Completion.png?raw=true)



![](https://github.com/uglycoyote/buildbot-react-plugin-boilerplate/blob/master/documentation/Error.png?raw=true)
