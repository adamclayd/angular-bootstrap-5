const fs = require('fs').promises;
const path = require('node:path');

(async () => {
    let outFile = 'build' + path.sep + 'angularjs-bootstrap-5.js';

    try {

        console.log('building library...');
        let files = await fs.readdir('src');
        let build = 'angular.module(\'ngBootstrap5\', [\n\t';

        for(let f of files) {
            let mod =  f.substring(0, f.indexOf('.js'));
            build += '\'' + mod + '\',\n\t';
        }

        build = build.substring(0, build.length - 1);

        build += ']);\n\n';

        for(let f of files) {
            let content = await fs.readFile('src' + path.sep + f, {encoding: 'utf8'});

            for(let i = content.indexOf('/**'); content.indexOf('/**', i) > -1; i = content.indexOf('/**', i)) {
                let j = content.indexOf('*/', i) + 3;

                content = content.substring(0, i) + content.substring(j, content.length);
            }

            build += content + '\n\n';
        }


        await fs.writeFile(outFile, build);

        console.log('...done building library');

    }
    catch(ex) {
        console.error(ex);
    }
})();




