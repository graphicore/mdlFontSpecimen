# Font Specimen Widgets for Material Design Lite

These are HTML5 widgets to create interactive font specimen in a [Material Design Lite](https://getmdl.io/)
environment.
Technically though this is just a layer of configuration or a "skin", the
widgets are defined in [specimentTools](https://github.com/graphicore/specimenTools).

## Usage

Say you installed this with bower: `$ bower install mdl-font-specimen`

```html
<!-- in your <HEAD> tag -->

<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="stylesheet" href="bower_components/material-design-lite/material.css">
<link rel="stylesheet" href="bower_components/mdl-font-specimen/dist/mdl-font-specimen.css">
<script defer src="bower_components/material-design-lite/material.js"></script>

<script>
fontSpecimenConfig = {}
fontSpecimenConfig.fontFiles = [
    /* add here the paths to the font files */
];
</script>
<script src="bower_components/mdl-font-specimen/dist/mdl-font-specimen.js"></script>
```

See [index.html](index.html) for an example how the widgets are configured.
Especially look at the css-classes that start with `mdlfs-` because these
guide the initialization of the widgets.

## Build `dist/mdl-font-specimen.js`

The `npm install` is only needed to run the build script. See also [Install for Development](#install_dev).

```
~$ git clone git@github.com:graphicore/mdlFontSpecimen.git
~$ cd mdlFontSpecimen
~/mdlFontSpecimen$ npm install
~/mdlFontSpecimen$ bower install
~/mdlFontSpecimen$ ./bin/build lib/main.js dist/mdl-font-specimen.js
~/mdlFontSpecimen$ ./bin/build lib/inspect-main.js dist/inspect-main.js

```

## <a name="install_dev">Install for Development</a>

Especially if you are going to contribute to [specimentTools](https://github.com/graphicore/specimenTools)
and want to use `mdlFontSpecimen` for testing (as I did). There's a great
feature, `bower link`, linking a module directory with a symbolic link
into a dependent project.

Also, you don't need to do the `npm install` for this.

```
~$ git clone git@github.com:graphicore/specimenTools.git
~$ cd specimenTools
~/specimenTools$ bower link
~/specimenTools$ cd ..
~/ git clone git@github.com:graphicore/mdlFontSpecimen.git
~$ cd mdlFontSpecimen
~/mdlFontSpecimen$ bower link specimen-tools
~/mdlFontSpecimen$ bower install
# now start a http-server to serve from ~/mdlFontSpecimen
# e.g. python3 -m http.server 8000
# visit: http://localhost:8000/html/development.html
```

