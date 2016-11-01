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
  , 'specimenTools/widgets/FeatureDisplay'
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
  , FeatureDisplay
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
              , familyChooser: {
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
              , typeTester: {
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
              , fontData: {}
              , featureDisplay: {
                    itemTagClassPrefix: 'mdlfs-feature-display__item-tag_'
                  , bluePrintNodeClass: 'mdlfs-feature-display__item-blueprint'
                  , itemBeforeClass: 'mdlfs-feature-display__item__before'
                  , itemAfterClass: 'mdlfs-feature-display__item__after'
                  , itemTagNameClass: 'mdlfs-feature-display__item__tag-name'
                  , itemFriendlyNameClass: 'mdlfs-feature-display__item__friendly-name'
                }
            }
          , pubsub = new PubSub()
          , factories, containers
          , fontsData = new FontsData(pubsub, {useLaxDetection: true})
          , webFontProvider = new WebFontProvider(window, pubsub, fontsData)
          ;

        factories = [
            ['mdlfs-family-switcher', FamilyChooser, fontsData, options.familyChooser]
          , ['mdlfs-glyph-table', GlyphTables, options.glyphTables]
          , ['mdlfs-font-data', GenericFontData, fontsData,  options.fontData]
          , ['mdlfs-current-font', CurrentWebFont, webFontProvider]
          , ['mdlfs-type-tester', TypeTester, fontsData, options.typeTester]
          , ['mdlfs-feature-display', FeatureDisplay, fontsData, webFontProvider, options.featureDisplay]
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
