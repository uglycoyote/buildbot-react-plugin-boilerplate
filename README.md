# buildbot-react-plugin-boilerplate

Boilerplate setup for a buildbot plugin using React, Webpack and Plain JS or Typescript

## Synopsis

install:

```
npm install
webpack
pip install -e .
```

iterate:

```webpack --watch```

## Why? 

The tech used for the Buildbot 9 web UI is already starting to show its age.  Currently it is using:

* **gulp** as a build system
* **coffeescript** as an alternative to javascript
* **AngularJS** which has been superceded by Angular 2, which is nearly a full rewrite

The idea behind this repo is to establish a way to use newer web tech for your buildbot plugin, even though buildbot is (for now at least) sticking with these older technologies.  It's totally possible to mix the new and the old. 

In my own case, I was driven in this direction by performance issues with Angular that I could not find any good way to get past, besides just not using Angular.   

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

```git clone <https://github.com/bb-nl/buildbot.git>```

outside of that directory, make a virtualenv sandbox directory.  All ```pip install```s will install into that directory rather than the global python libs directory.

```virtualenv sandbox```

Whenever you are developing buildbot you must **activate** the sandbox

```sandbox\Scripts\activate```

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

**Attention:** although the repo is named with hypens separating the words (as per javascript/npm convention), the python package names/identifiers are using underbars as separators (as per python convention)

then...

```
npm install
webpack
pip install -e .
```

Once you have done the ```pip install```, buildbot should automatically start using your new plugin without you needing to do any other explicit hookup (I was a bit surprised by this as I thought it would require mentioning your new plugin in ```master.cfg``` but from my experience that's not necessary)

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


* The Controller is a bit slimmer, since more of the view logic is contained in the React components.  The controller's main role now is to get the data from the services and forward it as **props** to React.  The controller may want to massage the data a bit get it into a form that's more appropriate for the view.  Ideally the **props** should only change when you want the view to change, so if there's extra data returned by the ```dataService``` that your view doesn't need, the controller can play the role of filtering that into a more view-relevant form.