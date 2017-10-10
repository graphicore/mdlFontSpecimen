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
  , 'specimenTools/widgets/CoverageInfo'
  , 'specimenTools/widgets/CharSetInfo'
  , 'mdlfs/widgets/LanguageInspectorInterfaceController'
  , 'mdlfs/widgets/LaxCharlist'
], function(
    loadFonts
  , initWidgets
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
  , CoverageInfo
  , CharSetInfo
  , InterfaceController
  , LaxCharlist
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
          , factories = [], containers
          , fontsData = new FontsData(pubsub, {
                  useLaxDetection: true
                , charSets: JSON.parse(googleFontsCharSetsJson)
                , languageCharSets: JSON.parse(languageCharSetsJson)
                })
          , webFontProvider = new WebFontProvider(window, pubsub, fontsData)
          , interfaceCtrlTemplatesNode = window.document
                .getElementsByClassName('mdlfs-interface-controller-templates')[0]
          , widgetsAPI = {
                init: componentHandler.upgradeElements
                // downgradeElements is not symetrical to upgradeElements
                // it does not walk the tree and downgrade the children
              , destroy: function(elements) {
                  /* globals Element, HTMLElement */
                  var i, l, element;
                  if (!Array.isArray(elements)) {
                    if (elements instanceof Element) {
                      elements = [elements];
                    } else {
                      elements = Array.prototype.slice.call(elements);
                    }
                  }
                  for (i=0,l=elements.length;i<l;i++) {
                    element = elements[i];
                    if (element instanceof HTMLElement) {
                      componentHandler.downgradeElements(element);
                      if (element.children.length > 0) {
                        componentHandler.downgradeElements(Array.prototype.slice.call(element.children));
                      }
                    }
                  }
                }
              }
          ;


        // We reference `factories` in 'mdlfs-interface-controller', thus
        // it must exist before it's defined...
        Array.prototype.push.apply(factories, [
            ['mdlfs-font-data', GenericFontData, fontsData,  options.fontData]
          , ['mdlfs-current-font', CurrentWebFont, webFontProvider]
          , ['mdlfs-fonts-drop', FilesDrop, loadFonts.fromFileInput]
          , ['mdlfs-load-progress', LoadProgressIndicator, options.loadProgressIndicator]
          , ['mdlfs-font-select', FontLister, fontsData, options.fontLister]
          , ['mdlfs-coverage-info',CoverageInfo, fontsData, widgetsAPI]
          , ['mdlfs-charset-info', CharSetInfo, fontsData, webFontProvider, widgetsAPI, options.charsetInfo]
          , ['mdlfs-lax-charlist', LaxCharlist, fontsData]
          // must be last or we must prevent it from adding widgets
          // before the initial call to initWidgets has ended.
          // These widgets would be initialized twice otherwise.
          , ['mdlfs-interface-controller', InterfaceController, fontsData, factories, widgetsAPI, interfaceCtrlTemplatesNode]
        ]);

        containers = initWidgets(window.document, factories, pubsub, [interfaceCtrlTemplatesNode]);
        pubsub.subscribe('allFontsLoaded', function() {
            // Init newly built MDL elements
            // componentHandler from material design light is expected to be loaded
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
