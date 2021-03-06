/* eslint-env node, es6 */

'use strict';

const
  DOC_ROOT = __dirname,
  PORT = 8080,

  MODULE_PACKAGES = [
    'jasmine-core',
    'test-page-loader'
  ],

  logger = (() => {
    const log4js = require('log4js');
    log4js.configure({
      appenders: {
        out: {
          type: 'console',
          layout: {
            type: 'pattern',
            pattern: '%[[%r]%] %m' // Super simple format
          }
        }
      },
      categories: {default: {appenders: ['out'], level: 'info'}}
    });
    return log4js.getLogger('node-static-alias');
  })(),

  filelist = require('stats-filelist'),
  path = require('path'),
  fs = require('fs'),

  EXT_DIR = path.resolve(__dirname, '../../test-ext'),

  SLOW_RESPONSE = 10000,

  staticAlias = new (require('node-static-alias')).Server(DOC_ROOT, {
    cache: false,
    headers: {'Cache-Control': 'no-cache, must-revalidate'},
    alias:
      MODULE_PACKAGES.map(packageName =>
        ({ // node_modules
          match: new RegExp(`^/${packageName}/.+`),
          serve: `${require.resolve(packageName).replace(
            // Include `packageName` for nested `node_modules`
            new RegExp(`^(.*[/\\\\]node_modules)[/\\\\]${packageName}[/\\\\].*$`), '$1')}<% reqPath %>`,
          allowOutside: true
        })
      ).concat([
        // limited-function script
        {
          match: /^\/plain-modal\.js$/,
          serve: params =>
            (/\bLIMIT=true\b/.test(params.cookie)
              ? params.absPath.replace(/\.js$/, '-limit.js') : params.absPath)
        },

        // test-ext
        {
          match: /^\/ext\/.+/,
          serve: params => params.reqPath.replace(/^\/ext/, EXT_DIR),
          allowOutside: true
        },
        // test-ext index
        {
          match: /^\/ext\/?$/,
          serve: () => {
            const indexPath = path.join(EXT_DIR, '.index.html');
            fs.writeFileSync(indexPath,
              `<html><head><meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"></head><body><ul>${
                filelist.getSync(EXT_DIR, {
                  filter: stats => /^[^.].*\.html$/.test(stats.name),
                  listOf: 'fullPath'
                }).sort().map(fullPath => { // abs URL for '/ext' (no trailing slash)
                  const htmlPath = `/ext/${path.relative(EXT_DIR, fullPath).replace(/\\/g, '/')}`;
                  return `<li><a href="${htmlPath}">${htmlPath}</a></li>`;
                }).join('')
              }</ul></body></html>`);
            return indexPath;
          },
          allowOutside: true
        }
      ]),
    logger
  });

require('http').createServer((request, response) => {
  request.addListener('end', () => {
    function serve() {
      staticAlias.serve(request, response, error => {
        if (error) {
          response.writeHead(error.status, error.headers);
          logger.error('(%s) %s', request.url, response.statusCode);
          if (error.status === 404) {
            response.end('Not Found');
          }
        } else {
          logger.info('(%s) %s', request.url, response.statusCode);
        }
      });
    }

    if (/^\/slow\.gif/.test(request.url)) { // slow response
      logger.info('(%s) SLOW RESPONSE %dms', request.url, SLOW_RESPONSE);
      setTimeout(serve, SLOW_RESPONSE);
    } else {
      serve();
    }
  }).resume();
}).listen(PORT);

console.log(`START: http://localhost:${PORT}/\nROOT: ${DOC_ROOT}`);
console.log('(^C to stop)');
