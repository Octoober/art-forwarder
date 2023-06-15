'use strict';
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
    merge(common, {
        entry: {
            popup: PATHS.src + '/popup.js',
            contentScript: PATHS.src + '/contentScript.js',
            background: PATHS.src + '/background.js',
            options: PATHS.src + '/options.js'
        },
        devtool: argv.mode === 'production' ? false : 'source-map',
        plugins: [
            new webpack.DefinePlugin({
                __VUE_OPTIONS_API__: true,
                __VUE_PROD_DEVTOOLS__: true,
                __IS_DEV_MODE__: argv.mode === 'development'
            }),
        ]
    });

module.exports = config;
