define([
    'bower_components/specimenTools/lib/setup'
], function(
    specimenToolsSetup
) {
    "use strict";
    require.config(specimenToolsSetup);
    require.config({
        paths: {
            'specimenTools': 'bower_components/specimenTools/lib'
        }
    });
    return require;
});
