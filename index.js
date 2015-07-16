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