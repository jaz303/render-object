(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/jason/dev/projects/render-object/demo/main.js":[function(require,module,exports){
var render = require('../');

window.init = function() {
    var el = render({
        a: [1,2,3,4,{foo: 'bar', baz: 'bleem'}],
        b: 2,
        c: {
            foo: "this is a string",
            bar: true,
            'null': null,
            'void': void 0
        },
        validUsername: /^[a-z][a-z]*$/i,
        now: new Date()
    });
    console.log(el);
    document.body.appendChild(el);
}
},{"../":"/Users/jason/dev/projects/render-object/index.js"}],"/Users/jason/dev/projects/render-object/index.js":[function(require,module,exports){
var isArray = require('is-array');
var classPrefix = 'RO';

var rules = [];
var primitives = {};

module.exports = function(thing) {
    var wrapper = document.createElement('div');
    wrapper.className = classPrefix;
    wrapper.appendChild(render(thing));
    return wrapper;
}

function render(thing) {
    if (thing === null) {
        return primitives['null']();
    } else if (typeof thing !== 'object') {
        return primitives[typeof thing](thing);
    } else if (isArray(thing)) {
        return renderArray(thing);
    } else {
        for (var i = 0; i < rules.length; ++i) {
            if (rules[i].test(thing)) {
                return rules[i].render(thing);
            }
        }
        return renderObject(thing);
    }
}

function renderPrimitive(str, classSuffix) {
    var el = document.createElement('span');
    el.className = classPrefix + '-' + classSuffix;
    el.textContent = str;
    return el;
}

function renderCollapsible(header, className, items) {
    var el = document.createElement('div');
    el.className = classPrefix + '-' + className;
    var actuator = document.createElement('a');
    actuator.className = classPrefix + '-expander';
    actuator.textContent = header;
    var expanded = false;
    actuator.onclick = function() {
        expanded = !expanded;
        if (expanded) {
            el.className += ' isExpanded ';
        } else {
            el.className = el.className.replace(/\s*isExpanded\s*/g, '');
        }
    }
    items.className = classPrefix + '-' + className + 'Items';
    el.appendChild(actuator);
    el.appendChild(items);
    return el;
}

function renderArray(ary) {
    var el = document.createElement('ol');
    el.setAttribute('start', 0);
    ary.forEach(function(val) {
        var wrap = document.createElement('li');
        wrap.className = classPrefix + '-ArrayItem';
        wrap.appendChild(render(val));
        el.appendChild(wrap);
    });
    return renderCollapsible('Array (' + ary.length + ')', 'Array', el);
}

function renderObject(obj) {
    var pairs = document.createElement('dl');
    for (var k in obj) {
        var dt = document.createElement('dt');
        dt.className = classPrefix + '-ObjectKey';
        dt.textContent = k;
        var dd = document.createElement('dd');
        dd.className = classPrefix + '-ObjectValue';
        dd.appendChild(render(obj[k]));
        pairs.appendChild(dt);
        pairs.appendChild(dd);
    }
    return renderCollapsible('Object', 'Object', pairs);
}

function registerObjectRenderer(test, renderer) {
    rules.push({test: test, render: renderer});
}

function registerClassRenderer(klass, renderer) {
    registerObjectRenderer(function(thing) {
        return thing instanceof klass;
    }, renderer);
}

function registerPrimitiveRenderer(prim, renderer) {
    primitives[prim] = renderer;
}

registerClassRenderer(RegExp, function(regexp) {
    return renderPrimitive(regexp.toString(), 'RegExp');
});

registerClassRenderer(Date, function(date) {
    return renderPrimitive(date.toString(), 'Date');
});

registerPrimitiveRenderer('boolean', function(val) {
    return renderPrimitive(val ? 'true' : 'false', 'Boolean');
});

registerPrimitiveRenderer('null', function() {
    return renderPrimitive('null', 'Null');
});

registerPrimitiveRenderer('number', function(val) {
    return renderPrimitive('' + val, 'Number');
})

registerPrimitiveRenderer('string', function(val) {
    return renderPrimitive(JSON.stringify(val), 'String');
});

registerPrimitiveRenderer('undefined', function() {
    return renderPrimitive('undefined', 'Undefined');
});
},{"is-array":"/Users/jason/dev/projects/render-object/node_modules/is-array/index.js"}],"/Users/jason/dev/projects/render-object/node_modules/is-array/index.js":[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}]},{},["/Users/jason/dev/projects/render-object/demo/main.js"]);
