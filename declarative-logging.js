const DefaultMapping = {
  "__log": "log",
  "__warn": "warn",
  "__error": "error"
};

const DecorativeIds = ["_","__","___","____"];

module.exports = function(o) {
  const t = o.types;
  return {
    name: 'babel-plugin-declarative-logging',
    visitor: {
      LabeledStatement (path, state) {
        if (!state.opts || typeof state.opts !== 'object') return;
        if (!Object.keys(state.opts).length) return;

        // only handle labels inside a class method
        if (!path.parentPath) return;
        if (!path.parentPath.parent) return;

        if (!path.parentPath.parentPath) return;
        const parentType = path.parentPath.parent.type;
        const grandParentType = path.parentPath.parentPath.parent.type;
        if (parentType !== 'ClassMethod' && parentType !== 'ObjectMethod' &&
          grandParentType !== 'ClassMethod' && grandParentType !== 'ObjectMethod') return;


        const mapping = state.opts.mapping || DefaultMapping;
        // skip unsupported lables
        const name = path.node.label.name;
        if(!mapping[name]) return;

        const type = path.node.body.expression.type;
        let args = [];
        if (type === 'SequenceExpression') {
          args = path.node.body.expression.expressions;
          // remove last decorative identifiers
          let idName = args[args.length-1].name
          if ( DecorativeIds.indexOf(idName) >= 0) args.pop();
        } else {
          args = [path.node.body.expression]
        }

        // replace labels with method call
        const method = mapping[name];
        const methodCall = t.CallExpression(t.MemberExpression(t.ThisExpression(), t.Identifier(method)), args);
        path.replaceWith(methodCall);
      }
    }
  }
};