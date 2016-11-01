# Font Specimen Widgets for Material Design Lite

These are HTML5 widgets to create interactive font specimen in a (Material Design Lite)[]
environment.
Technically though this is just a layer of configuration or a "skin", the
widgets are defined in [specimentTools](https://github.com/graphicore/specimenTools).

## Build `dist/mdl-font-specimen.js`

The `npm install` is only needed to run the build script. See also [Install for Development](#install_dev)
for a development setup.

```
~$ git clone git@github.com:graphicore/mdlFontSpecimen.git
~$ cd mdlFontSpecimen
~/mdlFontSpecimen$ npm install
~/mdlFontSpecimen$ bower install
~/mdlFontSpecimen$ ./bin/build lib/ dist/mdl-font-specimen.js
```


## <a name="install_dev">Install for Development</a>

Especially if you are going to contribute to [specimentTools](https://github.com/graphicore/specimenTools)
and want to use `mdlFontSpecimen` for testing (as I did). There's a great
feature in `bower link`, linking a module directory with a symbolic link
into a dependent project.

Also, you don't need to do the `npm install` for this.

```
~$ git clone git@github.com:graphicore/specimenTools.git
~$ cd specimenTools
~/specimenTools$ bower link
~/specimenTools$ cd ..
~/ git clone git@github.com:graphicore/mdlFontSpecimen.git
~$ cd mdlFontSpecimen
~/mdlFontSpecimen$ bower link specimenTools
~/mdlFontSpecimen$ bower install
# now start a http-server to serve from ~/mdlFontSpecimen
# e.g. python3 -m http.server 8000
# visit: http://localhost:8000/html/development.html
```

