define([
    'bower_components/specimenTools/lib/setup'
  , './setup'
], function(
    specimenToolsSetup
  , setup
) {
    "use strict";
    return function bootstrap(require) {
        require.config(specimenToolsSetup);
        require.config(setup);
        return require;
    };
});
