define([
    'specimenTools/loadFonts'
  , 'specimenTools/initDocumentWidgets'
  , 'specimenTools/services/PubSub'
  , 'specimenTools/services/FontsData'
  , 'specimenTools/services/WebfontProvider'
  , 'specimenTools/widgets/GlyphTables'
  , 'specimenTools/widgets/FamilyChooser'
  , 'specimenTools/widgets/GenericFontData'
  , 'specimenTools/widgets/CurrentWebFont'
  , 'specimenTools/widgets/TypeTester'
], function(
    loadFonts
  , initDocumentWidgets
  , PubSub
  , FontsData
  , WebFontProvider
  , GlyphTables
  , FamilyChooser
  , GenericFontData
  , CurrentWebFont
  , TypeTester
) {
    "use strict";

    function main(window, fontFiles) {
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
                     , activateFeatureControls: function(elements) {
                        window.componentHandler.upgradeElements(elements);
                    }

                }
              , featureDisplayWidget: {
                    featureItemClasses: 'mdl-cell mdl-cell--4-col mdlfs-feature-display__item'
                }
              , FontData: {}
            }
          , pubsub = new PubSub()
          , factories, containers
          , fontsData = new FontsData(pubsub, {useLaxDetection: true})
          , webFontProvider = new WebFontProvider(window, pubsub, fontsData)
          ;

        factories = [
            ['mdlfs-family-switcher', FamilyChooser, fontsData, options.familyControlInterface]
          , ['mdlfs-glyph-table', GlyphTables, options.glyphTables]
          , ['mdlfs-font-data', GenericFontData, fontsData,  options.FontData]
          , ['mdlfs-current-font', CurrentWebFont, webFontProvider]
          , ['mdlfs-type-tester', TypeTester, fontsData, options.typeTesterWidget]
        ];

        containers = initDocumentWidgets(window.document, factories, pubsub);

        pubsub.subscribe('allFontsLoaded', function() {
            // Init newly built MDL elements
            // componentHandler from material design lit is expected to be loaded
            // by now, though, there's no guarantee for this!
            // maybe mdl has an AMD interface? or at least a callback when
            // it is loaded.
            window.componentHandler.upgradeElements(containers);
            pubsub.publish('activateFont', 0);
        });

        loadFonts(fontFiles, pubsub);
    }

    return main;
});
