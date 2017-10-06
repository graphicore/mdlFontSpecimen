define([
    'specimenTools/_BaseWidget'
  , 'specimenTools/services/dom-tool'
], function(
    Parent
  , dom
) {
    "use strict";
    /*jshint esnext:true*/

    function LaxCharlist(container, pubSub, fontData, options) {
        Parent.call(this, options);
        this._container = container;
        this._pubSub = pubSub;
        this._fontData = fontData;
        this._init();
    }

    var _p = LaxCharlist.prototype = Object.create(Parent.prototype);
    _p.constructor = LaxCharlist;

    LaxCharlist.defaultOptions = {
    };


    function _hexFromCodePoint(charCode) {
        return ' U+' + (('0000' + charCode.toString(16)).slice(-4));
    }

    function _stringFromCodePoint(charCode) {
        return String.fromCodePoint(charCode);
    }

    _p._init = function() {
        var charList = this._fontData.getLaxCharList();
        dom.appendChildren(this._container, [
              'lax codes: '
            , charList.map(_hexFromCodePoint).join(' ')
            , dom.createElement('br')
            , 'lax chars: '
            , charList.map(_stringFromCodePoint).join(' ')
        ]);
    };

    return LaxCharlist;
});
