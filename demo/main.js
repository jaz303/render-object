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