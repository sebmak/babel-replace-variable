'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function ({types: t, transform}) {
    return {
        visitor: {
            Identifier: function(path, state) {
                const replacement = process.env[path.node.name] || process.env[`__${path.node.name.toUpperCase()}__`] || state.opts[path.node.name];
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
