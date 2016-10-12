var techs = {
        fileProvider : require('enb/techs/file-provider'),
        fileMerge    : require('enb/techs/file-merge'),
        borschik     : require('enb-borschik/techs/borschik'),
        stylus       : require('enb-stylus/techs/stylus'),
        browserJs    : require('enb-diverse-js/techs/browser-js'),
        bemtree      : require('enb-bemxjst/techs/bemtree'),
        bemhtml      : require('enb-bemxjst/techs/bemhtml')
    },
    enbBemTechs = require('enb-bem-techs'),
    levels = [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/desktop.blocks', check: false },
        { path: 'libs/bem-components/common.blocks', check: false },
        { path: 'libs/bem-components/design/common.blocks', check: false },
        { path: 'libs/bem-components/desktop.blocks', check: false },
        { path: 'libs/bem-components/design/desktop.blocks', check: false },
        'common.blocks',
        'desktop.blocks'
    ],
    borschikTech = require('enb-borschik/techs/borschik'); 

module.exports = function (config) {
    var isProd = process.env.NODE_ENV === 'production';

    config.nodes('*.bundles/*', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels : levels }],
            [techs.fileProvider, { target: '?.bemdecl.js' }],
            [enbBemTechs.deps],
            [enbBemTechs.files],
            [techs.stylus, {
                target: '?.css',
                autoprefixer: {
                    browsers: ['ie >= 10', 'last 2 versions', 'opera 12.1', '> 2%']
                }
            }],
            // bemtree
            [techs.bemtree, {
                sourceSuffixes : ['bemtree', 'bemtree.js'],
                devMode        : process.env.BEMTREE_ENV === 'development',
                compact        : true
            }],
            // node.js
            [require('enb-diverse-js/techs/node-js'), { target: '?.pre.node.js' }],
            [require('enb-modules/techs/prepend-modules'), {
                source: '?.pre.node.js',
                target: '?.node.js'
            }],
            // browser.js
            [require('enb-diverse-js/techs/browser-js'), { target: '?.browser.js' }],
            [require('enb/techs/file-merge'), {
                target: '?.pre.js',
                sources: ['?.browser.bemhtml.js', '?.browser.js']
            }],
            [require('enb-modules/techs/prepend-modules'), {
                source: '?.pre.js',
                target: '?.js'
            }],
            // bemhtml
            [techs.bemhtml, {
                sourceSuffixes : ['bemhtml', 'bemhtml.js'],
                devMode        : process.env.BEMHTML_ENV === 'development',
                compact        : true
            }],
            // client bemhtml
            [enbBemTechs.depsByTechToBemdecl, {
                target: '?.bemhtml.bemdecl.js',
                sourceTech: 'js',
                destTech: 'bemhtml'
            }],
            [enbBemTechs.deps, {
                target: '?.bemhtml.deps.js',
                bemdeclFile: '?.bemhtml.bemdecl.js'
            }],
            [enbBemTechs.files, {
                depsFile: '?.bemhtml.deps.js',
                filesTarget: '?.bemhtml.files',
                dirsTarget: '?.bemhtml.dirs'
            }],
            [techs.bemhtml, {
                target: '?.browser.bemhtml.js',
                filesTarget: '?.bemhtml.files',
                sourceSuffixes: ['bemhtml', 'bemhtml.js'],
                devMode: process.env.BEMHTML_ENV === 'development',
                compact: true
            }],
            // borschik
            [borschikTech, { sourceTarget: '?.css', destTarget: '?.min.css', tech: 'cleancss', freeze: true, minify: isProd }],
            [borschikTech, { sourceTarget: '?.bemtree.js', destTarget: '?.min.bemtree.js', freeze: true, minify: isProd }],
            [borschikTech, { sourceTarget: '?.node.js', destTarget: '?.min.node.js', freeze: true, minify: isProd }],
            [borschikTech, { sourceTarget: '?.js', destTarget: '?.min.js', freeze: true, minify: isProd }],
            [borschikTech, { sourceTarget: '?.bemhtml.js', destTarget: '?.min.bemhtml.js', freeze: true, minify: isProd }]
        ]);

        nodeConfig.addTargets([
            '?.min.css',
            '?.min.bemtree.js',
            '?.min.node.js',
            '?.min.js',
            '?.min.bemhtml.js'
        ]);
    });
};


