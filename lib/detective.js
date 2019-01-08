const Walker = require('node-source-walk');
const debug = require('debug')('Detective');

// const modules = new Set();

// const ast = parser.parse(code, {
//   // parse in strict mode and allow module declarations
//   sourceType: 'unambiguous',

//   plugins: [
//     // enable jsx and flow syntax
//     // 'jsx',
//     // 'flow',
//   ],
// });

// ast.program.body.map(node => {
//   // log(node.type);
//   // log(node);

//   // VariableDeclaration
//   if (node.type === 'VariableDeclaration') {
//     node.declarations.map(({ init }) => {
//       if (init.type === 'CallExpression') {
//         const { callee, arguments } = init;

//         if (callee.name === 'require') {
//           arguments.map(({ value }) => {
//             modules.add(value);
//           });
//         }
//       }
//     });
//   }

//   // ImportDeclaration
//   if (node.type === 'ImportDeclaration') {
//     modules.add(node.source.value);
//   }

//   // ExpressionStatement
//   if (node.type === 'ExpressionStatement') {
//     const { expression } = node;
//     if (expression.type === 'CallExpression') {
//       const { callee, arguments } = expression;

//       if (callee.name === 'require') {
//         arguments.map(({ value }) => {
//           modules.add(value);
//         });
//       }
//     }
//   }
// });

module.exports = src => {
  const walker = new Walker();

  const dependencies = [];

  if (typeof src === 'undefined') {
    throw new Error('src not given');
  }

  if (src === '') {
    return dependencies;
  }

  walker.walk(src, function(node) {
    switch (node.type) {
      case 'ImportDeclaration':
        debug('ImportDeclaration');
        if (node.source && node.source.value) {
          dependencies.push(node.source.value);
        }
        break;

      case 'ExportNamedDeclaration':

      case 'ExportAllDeclaration':
        debug(node.name, node.type);
        if (node.source && node.source.value) {
          dependencies.push(node.source.value);
        }
        break;

      case 'CallExpression':
        debug('CallExpression', node.callee.name, node.callee.type);
        if (node.callee.type === 'Import' && node.arguments.length) {
          dependencies.push(node.arguments[0].value);
        }
        if (node.callee.name === 'require' && node.arguments.length) {
          node.arguments.map(({ type, value }) => {
            if (type === 'StringLiteral') {
              dependencies.push(value);
            }
          });
        }

      default:
        return;
    }
  });

  return dependencies;
};
