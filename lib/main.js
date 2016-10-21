define([
    'specimenTools/glyphTable/GlyphTables'
  , 'specimenTools/loadFonts'
  ,  'specimenTools/fontControl/PubSub'
  , 'specimenTools/fontControl/FamilyControlInterface'
], function(
    GlyphTables
  , loadFonts
  , PubSub
  , FamilyControlInterface
) {
    "use strict";

    function main(document, fontFiles) {
        var glyphTablesContainers = document.getElementsByClassName('mdlfs-glyph-table')
          , fontFamilySwitcherContainers = document.getElementsByClassName('mdlfs-family-switcher')
          , glyphTables, fontFamilySwitcher
          , i, l , container
          , options = {
                glyphTables: {
                    glyphTable: {
                        glyphClass: 'mdlfs-glyph-table__glyph'
                    }
                }
              , familyControlInterface: {
                    italicSwitchContainerClasses: ['mdl-switch', 'mdl-js-switch', 'mdl-js-ripple-effect']
                  , italicSwitchCheckboxClasses: ['mdl-switch__input']
                  , italicSwitchLabelClasses: ['mdl-switch__label']
                  , setItalicSwitch: function setItalicSwitch(italicSwitch, enabled, checked) {
                        var fallback;
                        if(!italicSwitch.container.MaterialSwitch) {
                            fallback = this.constructor.defaultOptions.setItalicSwitch;
                            fallback.call(this, italicSwitch, enabled, checked);
                            return;
                        }
                        italicSwitch.container.MaterialSwitch[enabled ? 'enable' : 'disable']();
                        italicSwitch.container.MaterialSwitch[checked ? 'on' : 'off']();
                    }
                  , weightButtonClasses: 'mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdlfs-family-switcher__button'
                  , weightButtonActiveClass: 'mdl-button--colored'
               }
            }
          , pubsub = new PubSub()
          , fontFamilySwitchers = []
          , containers  = []
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
            fontFamilySwitchers.push(new FamilyControlInterface(container, pubsub, options.familyControlInterface));
        }
        Array.prototype.push.apply(containers, fontFamilySwitcherContainers)


        for(i=0,l=glyphTablesContainers.length;i<l;i++) {
            container = glyphTablesContainers[i];
            glyphTables = new GlyphTables(container, pubsub, fontFiles, options.glyphTables);
        }
        Array.prototype.push.apply(containers, glyphTablesContainers)



        pubsub.subscribe('allFontsLoaded', function(){
            // Init newly built MDL elements
            // componentHandler from material design lit is expected to be loaded
            // by now, though, there's no guarantee for this!
            // maybe mdl has an AMD interface? or at least a callback when
            // it is loaded.
            componentHandler.upgradeElements(containers);
            pubsub.publish('activateFont', 0);
        });


        loadFonts(fontFiles, pubsub);
    }

    return main;
});
