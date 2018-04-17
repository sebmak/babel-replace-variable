'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

const fs = require('fs');
const path = require('path');

let ENV = {};
let path_to_check = path.normalize(__dirname);
while (path_to_check) {
  try {
    let file = null;
    //Check for either .env or .env.ENVIRONMENT files
    if (fs.statSync(path.resolve(path_to_check, `.env.${process.env.NODE_ENV||'development'}`))) {
      file = fs.readFileSync(path.resolve(path_to_check, `.env.${process.env.NODE_ENV||'development'}`), 'utf8').split('\n').filter(c=>c);
    } else if (fs.statSync(path.resolve(path_to_check, '.env'))) {
      file = fs.readFileSync(path.resolve(path_to_check, '.env'), 'utf8').split('\n').filter(c=>c);
    }

    if (!file) {
      throw "No file";
    }

    for (const str of _env) {
      const [key,val] = str.split('=');
      ENV[key]=val;
      if (!isNaN(Number(val))) {
        ENV[key] = Number(val);
      }
    }
    break;
  } catch (e) {
    path_to_check = path_to_check.split(path.sep);
    path_to_check.pop();
    path_to_check=path_to_check.join(path.sep);
  }
}

const ENV_VARIABLES = new Proxy({
    __ENVIRONMENT__: 'development'
}, {
    get: function(target, name) {
        return process.env[name] || ENV[name] || target[name];
    }
});

exports.default = function ({types: t, transform}) {
    return {
        visitor: {
            Identifier: function(path, state) {
                const replacement = process.env[path.node.name] || ENV_VARIABLES[path.node.name] || state.opts[path.node.name];
                if (path.parent.type === 'MemberExpression') {
                    return;
                }
                if (replacement !== undefined) {
                    const type = typeof replacement;
                    if (type === 'boolean') {
                        path.replaceWith(t.booleanLiteral(replacement))
                    } else if (type === 'string') {
                        const str = String(replacement);
                        path.replaceWith(t.stringLiteral(str));
                    } else if (type === 'object') {
                      const trans = transform(`${JSON.stringify(replacement)}`);
                      path.replaceWith(trans.ast.program.body[0].expression);
                    }
                }
            }
        }
    }
};
