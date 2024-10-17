const colors = require('ansi-colors');
const fs = require('fs');

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');


    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        filename: 'angular-bootstrap-5',
        meta: {
            modules: "angular.module('ngBootstrap5', [<%= srcModules %>]);"
        },
        concat: {
            dist: {
                options: {
                    banner: '<%= meta.banner %>\n\n<%= meta.modules %>\n\n',
                    footer: '\n\n<%= cssIncludes %>\n\n',
                    stripBanners: true,
                    separator: '\n\n',
                    process: processConcat
                },
                src: grunt.file.expand(['src/*.js', '!src/bs5.js']),
                dest: 'build/<%= filename %>.js',
            }
        },
        uglify: {
            dist: {
                options: {
                    banner: '<%= meta.banner %>\n'
                },
                src: ['build/<%= filename %>.js'],
                dest: 'build/<%= filename %>.min.js',
            }
        },
    });

    grunt.registerTask('build', 'Create the build file',  function() {
        let done = this.async();
        build().then(done, function(ex) {
            grunt.log.error(ex);
            done(false);
        });
    });

    function processConcat(src, file) {
        grunt.log.ok(file);

        let dir = /src\/(.+)\.js/.exec(file)[1];

        let tplFiles = grunt.file.expand('src/templates/bs5/' + dir + '/*.tpl.html');

        if(tplFiles.length) {

            src = src.replace(/[;\t\n ]+$/g, '') + "\n\n    .run(['$templateCache', function($templateCache) {\n";

            for (let i = 0; i < tplFiles.length; i++) {
                let htmlFile = tplFiles[i];
                let tpl = grunt.file.read(htmlFile);

                tpl = tpl.replaceAll('"', '\\"');

                let formatted = '';
                let index = 0;
                while (index > -1) {
                    let end = tpl.indexOf('\n', index);

                    if (end > -1) {
                        formatted += '            "' + tpl.substring(index, end - 1) + '\\n" +\n';
                        index = end + 1;
                    }
                    else {
                        formatted += '            "' + tpl.substring(index) + '"';
                        index = -1;
                    }
                }
                src += i > 0 ? '\n\n' : '';
                src += '        $templateCache.put("' + htmlFile.replace('src/', '').replace('.tpl', '') + '",\n' + formatted + '\n        );';
            }

            src += '\n\t}]);';
        }

        src = src.replaceAll(/\/\*\*.+?\*\/\n*/sg, '');

        return src;
    }

    async function build() {
        setBanner();
        setSrcModules();
        await setCssIncludes();
        grunt.task.run(['concat', 'uglify']);
    }

    function setBanner() {
        let banner = [
            '/*',
            ' * <%= pkg.name %>',
            ' *',
            ' * Version: <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
            ' * ',
            ' * Author: Adam Davis',
            ' * ',
            ' */'
        ].join('\n');

        let lic = grunt.file.read('LICENSE');
        lic = '\n\n/*\n * ' + lic.replaceAll('\n', '\n * ');
        banner += lic + '\n */';

        grunt.config('meta.banner', banner);
    }

    function setSrcModules() {
        let files = grunt.file.expand('src/*.js');


        let exp = /angular[ \t\n]*\.[ \t\n]*module[ \n\t]*\([ \n\t]*['"`](bs5\..+?)['"`][ \n\t]*,[ \n\t]*\[/;

        let modNames = files.map(f => {
            let src = grunt.file.read(f);

            src = src.replaceAll(/\/\*\*.*?\*\/\n/sg, '');

            let matches = exp.exec(src);

            if(matches)  {
                return matches[1];
            }
            else {
                return null;
            }
        });

        modNames = modNames.filter(x => x !== null);

        let srcModules = '';

        for(let m of modNames) {
            srcModules += `\n    '${m}',`;
        }

        srcModules = srcModules.substring(0, srcModules.length - 1);

        grunt.config('srcModules', srcModules);
    }

    async function setCssIncludes() {
        let promises = [];

        let cssSrc = grunt.file.expand(['src/css/*.css']);

        cssSrc.forEach(v => {
            grunt.log.ok(v);
            promises.push(minifyCss(grunt.file.read(v)));
        });

        let minified = await Promise.all(promises);

        grunt.config('cssIncludes', `angular.element(document).find('head').append('<style>${minified.join('')}</style>');`);
    }

    async function minifyCss(input) {
        let res = await fetch('https://www.toptal.com/developers/cssminifier/api/raw', {
            method:'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'input=' + input
        });

        return await res.text();
    }

}