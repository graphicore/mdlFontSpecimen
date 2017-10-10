define([
    'specimenTools/widgets/InterfaceController'
], function(
    Parent
) {
    "use strict";

    /* jshint esnext:true*/


    /**
     * This adds a lifecycle: widgets can be created and destroyed.
     */
    function LanguageInspectorInterfaceController(container, pubSub, fontsData
                        ,factories, widgetsAPI , templatesNode, options) {
        Parent.call(this, container, pubSub, factories, widgetsAPI
                                                    , templatesNode, options);
        this._fontsData = fontsData;
        this._init();
        this._update();
    }

    var _p = LanguageInspectorInterfaceController.prototype = Object.create(Parent.prototype);
    _p.constructor = LanguageInspectorInterfaceController;

    LanguageInspectorInterfaceController.defaultOptions = {};
    Object.assign(LanguageInspectorInterfaceController.defaultOptions
      , Parent.defaultOptions, {
            laxSwitchSelector: '.mdlfs-interface-controller_switch-lax'
          , isLaxClass: 'mdlfs-interface-controller-is_lax'
        });

    _p._init = function() {
        var laxSwitch = this._container.querySelector(this._options.laxSwitchSelector)
          , laxSwitchInput =  this._container.querySelector('input')
          , useLax = this._fontsData.getUseLaxDetection()
          ;
        laxSwitchInput.checked = useLax;
        if(laxSwitch.MaterialSwitch)
            laxSwitch.MaterialSwitch.checkToggleState();

        laxSwitchInput.addEventListener('change', this._changeLaxHandler.bind(this));

        this._container.classList[useLax ? 'add' : 'remove'](this._options.isLaxClass);
    };

    _p._changeLaxHandler = function(event) {
        this._setLax(event.target.checked);
    };

    _p._update = function() {
        this._recreateWidget('general-info');
        this._recreateWidget('coverage-info');
        this._recreateWidget('charset-info');
    };

    _p._setLax = function(val) {
        var useLax = !!val;
        if(useLax === this._fontsData.getUseLaxDetection())
            return;
        this._fontsData.setOption('useLaxDetection', useLax);
        this._container.classList[useLax ? 'add' : 'remove'](this._options.isLaxClass);
        this._update();
    };

    _p._prepareWidgetContainer = function(key, widgetContainer) {
        var usesLaxAttr = new Set(['coverage-info', 'charset-info'])
          , laxAttr = 'data-coverage-lax'
          ;

        if(this._fontsData.getUseLaxDetection() && usesLaxAttr.has(key))
            widgetContainer.setAttribute(laxAttr, '');
        else
            widgetContainer.removeAttribute(laxAttr);

    };

    return LanguageInspectorInterfaceController;
});
