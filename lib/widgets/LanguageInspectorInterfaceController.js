define([
    'specimenTools/widgets/InterfaceController'
  , 'specimenTools/services/dom-tool'
], function(
    Parent
  , dom
) {
    "use strict";

    /* jshint esnext:true*/


    /**
     * This adds a lifecycle: widgets can be created and destroyed.
     */
    function LanguageInspectorInterfaceController(container, pubSub, factories
                                , componentHandler , templatesNode, options) {
        Parent.call(this, container, pubSub, factories, componentHandler
                                                    , templatesNode, options);

        //setTimeout(function(){this._createWidget('test')}.bind(this), 5000);
    }
    var _p = LanguageInspectorInterfaceController.prototype = Object.create(Parent.prototype);
    _p.constructor = LanguageInspectorInterfaceController;

    LanguageInspectorInterfaceController.defaultOptions = {};
    Object.assign(LanguageInspectorInterfaceController.defaultOptions
      , Parent.defaultOptions, {

        });
    return LanguageInspectorInterfaceController;
});
