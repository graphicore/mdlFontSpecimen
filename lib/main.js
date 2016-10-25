define([
    'specimenTools/glyphTable/GlyphTables'
  , 'specimenTools/loadFonts'
  , 'specimenTools/PubSub'
  , 'specimenTools/fontControl/FamilyControlInterface'
  , 'specimenTools/fontData/FontsData'
  , 'specimenTools/fontData/GenericFontDataWidget'
], function(
    GlyphTables
  , loadFonts
  , PubSub
  , FamilyControlInterface
  , FontsData
  , GenericFontDataWidget
) {
    "use strict";

    function main(document, fontFiles) {
        var options = {
                glyphTables: {
                    glyphTable: {
                        glyphClass: 'mdlfs-glyph-table__glyph'
                    }
                }
              , familyControlInterface: {
                    italicSwitchContainerClasses: ['mdl-switch', 'mdl-js-switch', 'mdl-js-ripple-effect', 'mdlfs-family-switcher__italic-switch']
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
              , FontData: {}
            }
          , pubsub = new PubSub()
          , factories, i, l , container, Constructor, instance, className, args
          , j, ll, containersForClass
          , containers = []
          , fontsData = new FontsData(pubsub, {useLaxDetection: true})
          ;

        factories = [
            ['mdlfs-family-switcher', FamilyControlInterface, options.familyControlInterface]
          , ['mdlfs-glyph-table', GlyphTables, options.glyphTables]
          , ['mdlfs-font-data', GenericFontDataWidget, fontsData,  options.FontData]
        ];



        for(i=0,l=factories.length;i<l;i++) {
            className = factories[i][0];
            containersForClass = document.getElementsByClassName(className);
            if(!containersForClass.length)
                continue;
            Constructor = factories[i][1];
            for(j=0,ll=containersForClass.length;j<ll;j++) {
                container = containersForClass[j];
                containers.push(container);
                args = [container, pubsub];
                Array.prototype.push.apply(args, factories[i].slice(2));
                // this way we can call the Constructor with a
                // dynamic arguments list, i.e. by circumvent the `new`
                // keyword via Object.create.
                instance = Object.create(Constructor.prototype);
                Constructor.apply(instance, args);
            }
        }

        pubsub.subscribe('allFontsLoaded', function() {
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
