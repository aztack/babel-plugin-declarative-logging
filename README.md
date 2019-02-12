# babel-plugin-declarative-logging
A Babel plugin that transform labels into class/object method calls

```js
/**
 * labels inside functions won't be transformed
 */
function f () {
  log: "hehe", 13, Math.PI
}

/**
 * only labels inside class method and object method wil be transformed into method call
 */

class Log {
  log (...args) {
    console.log(...args)
  }
}

class A extends Log{
  m () {
    // last decorative underscore will be removed
    __log: 1, 2, __
  }
}

const B = {
  m () {
    // object literal should be wrapped with parenthesis
    __warn: ({name:"a"}), __;
  },
  warn (...args) {
    console.warn(...args);
  }
}
```
will be transformed into

```js
/**
 * labels inside functions won't be transformed
 */
function f() {
  log: "hehe", 13, Math.PI;
}
/**
 * only labels inside class method and object method wil be transformed into method call
 */


class Log {
  log(...args) {
    console.log(...args);
  }

}

class A extends Log {
  m() {
    // last decorative underscore will be removed
    this.log(1, 2);
  }

}

const B = {
  m() {
    // object literal should be wrapped with parenthesis
    this.warn({
      name: "a"
    });
  },

  warn(...args) {
    console.warn(...args);
  }

};
```