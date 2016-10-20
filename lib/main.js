define([
    'specimenTools/glyphTable/GlyphTables'
  , 'specimenTools/loadFonts'
  ,  'specimenTools/fontControl/PubSub'
  , 'specimenTools/fontControl/SimpleControlInterface'
], function(
    GlyphTables
  , loadFonts
  , PubSub
  , SimpleControlInterface
) {
    "use strict";

    function main(document, fontFiles) {
        var containers = document.getElementsByClassName('mdlfs-glyph-table')
          , fontFamilySwitcherContainers = document.getElementsByClassName('mdlfs-family-switcher')
          , glyphTables, fontFamilySwitcher
          , i, l , container
          , options = {
                glyphTable: {
                    glyphClass: 'mdlfs-glyph-table__glyph'
                }
            }
          , pubsub = new PubSub()
          ;

        // next: central family switcher!
        // a) a container that relates like GlyphTables to GlyphTable
        // b) that container should not make its own switches but rather
        //    provide an interface to be switched via an external switcher
        // c) the external switcher can control many containers
        // d) the external switcher organizes the loaded fonts in blocks of
        //    families; should also understand italic as part of one family.
        // e) if it is a single family, we need no switcher.
        // g) if it is a bunch of single families, the single family elements
        //    should not look empty
        // g) the switcher must look nice!

        for(i=0,l=fontFamilySwitcherContainers.length;i<l;i++) {
            container = fontFamilySwitcherContainers[i];
            fontFamilySwitcher = new SimpleControlInterface(container, pubsub);
        }

        for(i=0,l=containers.length;i<l;i++) {
            container = containers[i];
            glyphTables = new GlyphTables(container, pubsub, fontFiles, options);
        }
        pubsub.subscribe('allFontsLoaded', function(){
            pubsub.publish('activateFont', 0);
        });
        loadFonts(fontFiles, pubsub);
    }

    return main;
});
