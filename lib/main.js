define([
    'specimenTools/glyphTable/GlyphTables'
  , 'specimenTools/loadFonts'
  , 'specimenTools/PubSub'
  , 'specimenTools/fontControl/FamilyControlInterface'
  , 'specimenTools/fontData/FontsData'
  , 'specimenTools/fontData/GenericFontDataWidget'
  , 'specimenTools/fontData/WebfontProvider'
  , 'specimenTools/fontData/CurrentWebFontWidget'
  , 'specimenTools/fontControl/TypeTesterWidget'
], function(
    GlyphTables
  , loadFonts
  , PubSub
  , FamilyControlInterface
  , FontsData
  , GenericFontDataWidget
  , WebFontProvider
  , CurrentWebFontWidget
  , TypeTesterWidget
) {
    "use strict";

    function main(document, fontFiles) {
        var options = {
                glyphTables: {
                    glyphTable: {
                        glyphClass: 'mdlfs-glyph-table__glyph'
                      , glyphActiveClass: 'mdlfs-glyph-table__glyph_active'
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
              , typeTesterWidget: {
                      fontSizeControlsClass: 'mdlfs-type-tester__font-size'
                    , fontSizeIndicatorClass: 'mdlfs-type-tester__font-size-indicator'
                    , optionalFeaturesControlsClass: 'mdlfs-type-tester__features--optional'
                    , defaultFeaturesControlsClass: 'mdlfs-type-tester__features--default'
                    , contentContainerClass: 'mdlfs-type-tester__content'
                    , fontSizeRangeInputClasses: 'mdl-slider mdl-js-slider'
                    , setFontSizeToInput: function(input, value) {
                            if('MaterialSlider' in input)
                                input.MaterialSlider.change(value);
                            else
                                input.value = value;
                      }

                     , optionalFeatureButtonClasses:  'mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdlfs-type-tester__feature-button'
                     , defaultFeatureButtonClasses: 'mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdlfs-type-tester__feature-button'
                     , featureButtonActiveClass: 'mdl-button--colored'

                }
              , FontData: {}
            }
          , pubsub = new PubSub()
          , factories, i, l , container, Constructor, instance, className, args
          , j, ll, containersForClass
          , containers = []
          , fontsData = new FontsData(pubsub, {useLaxDetection: true})
          , webFontProvider = new WebFontProvider(window, pubsub, fontsData)
          ;

        factories = [
            ['mdlfs-family-switcher', FamilyControlInterface, fontsData, options.familyControlInterface]
          , ['mdlfs-glyph-table', GlyphTables, options.glyphTables]
          , ['mdlfs-font-data', GenericFontDataWidget, fontsData,  options.FontData]
          , ['mdlfs-current-font', CurrentWebFontWidget, webFontProvider]
          , ['mdlfs-type-tester', TypeTesterWidget, fontsData, options.typeTesterWidget]
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
