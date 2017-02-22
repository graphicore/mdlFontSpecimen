define([
    'specimenTools/loadFonts'
  , 'specimenTools/initDocumentWidgets'
  , 'specimenTools/services/PubSub'
  , 'specimenTools/services/FontsData'
  , '!require/text!specimenTools/services/languageCharSets.json'
  , '!require/text!specimenTools/services/googleFontsCharSets.json'
  , 'specimenTools/services/WebfontProvider'
  , 'specimenTools/widgets/GenericFontData'
  , 'specimenTools/widgets/CurrentWebFont'
  , 'specimenTools/widgets/FilesDrop'
  , 'specimenTools/widgets/LoadProgressIndicator'
  , 'specimenTools/widgets/FontLister'
  , 'specimenTools/widgets/LanguageCoverageInfo'
  , 'specimenTools/widgets/CharSetInfo'
], function(
    loadFonts
  , initDocumentWidgets
  , PubSub
  , FontsData
  , languageCharSetsJson
  , googleFontsCharSetsJson
  , WebFontProvider
  , GenericFontData
  , CurrentWebFont
  , FilesDrop
  , LoadProgressIndicator
  , FontLister
  , LanguageCoverageInfo
  , CharSetInfo
  ) {
    "use strict";
    /*globals window */
    function main() {
        var fontSpecimenConfig = window.fontSpecimenConfig
          , componentHandler = window.componentHandler
          // TODO: assert fontSpecimenConfig and componentHandler are there
          , options = {
                fontData: {}
              , loadProgressIndicator: {
                    loadedClass: 'mdlfs-load-progress_loaded'
                  , loadingClass: 'mdlfs-load-progress_loading'
                  , progressBarClass: 'mdlfs-load-progress__progress-bar'
                  , setProgressBar: function(element, percent) {
                        if(element.MaterialProgress)
                        element.MaterialProgress.setProgress(percent);
                    }
                  , percentIndicatorClass: 'mdlfs-load-progress__percent'
                  , taskIndicatorClass: 'mdlfs-load-progress__task'
                }
              , fontLister: {

                }
              , charsetInfo: {
                     bluePrintNodeClass: 'mdlfs-charset-info__item-blueprint'
                   , itemContentContainerClass: 'mdlfs-charset-info__item-content-container'
                   , itemClass: 'mdlfs-charset-info__item'
                   , itemCharsetNameClass: 'mdlfs-charset-info__item__charset-name'
                   , itemLanguageClass: 'mdlfs-charset-info__item__language'
                   , itemIncludedCharsetClass: 'mdlfs-charset-info__item__included-charset'
                   , itemSampleCharClass: 'mdlfs-charset-info__item__sample-char'
                }
            }
          , pubsub = new PubSub()
          , factories, containers
          , fontsData = new FontsData(pubsub, {
                  useLaxDetection: true
                , charSets: JSON.parse(googleFontsCharSetsJson)
                , languageCharSets: JSON.parse(languageCharSetsJson)
                })
          , webFontProvider = new WebFontProvider(window, pubsub, fontsData)
          ;

        factories = [
            ['mdlfs-font-data', GenericFontData, fontsData,  options.fontData]
          , ['mdlfs-current-font', CurrentWebFont, webFontProvider]
          , ['mdlfs-fonts-drop', FilesDrop, loadFonts.fromFileInput]
          , ['mdlfs-load-progress', LoadProgressIndicator, options.loadProgressIndicator]
          , ['mdlfs-font-select', FontLister, fontsData, options.fontLister]
          , ['mdlfs-language-info', LanguageCoverageInfo, fontsData]
          , ['mdlfs-charset-info', CharSetInfo, fontsData, webFontProvider, options.charsetInfo]
        ];

        containers = initDocumentWidgets(window.document, factories, pubsub);
        pubsub.subscribe('allFontsLoaded', function() {
            // Init newly built MDL elements
            // componentHandler from material design lit is expected to be loaded
            // by now, though, there's no guarantee for this!
            // maybe mdl has an AMD interface? or at least a callback when
            // it is loaded.
            componentHandler.upgradeElements(containers);
            pubsub.publish('activateFont', 0);
        });

        if(fontSpecimenConfig.fontFiles)
            loadFonts.fromUrl(pubsub, fontSpecimenConfig.fontFiles);
        else if(fontSpecimenConfig.loadFromFileInput) {
            // pass, the document should have a FilesDrop widget or similar
        }
    }

    return main;
});
