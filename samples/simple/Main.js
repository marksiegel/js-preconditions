$$ = {debug: true};

require.config({
	map: {
		'*': {
			'$$': '../../$$'
		}
	}
});

require(['Rectangle'], function (Rectangle) {
	$(document).ready(function () {
		var svg = $("#svg");

		// This will fail since setSize expects 2 positive numbers to be passed to it
		// var r = new Rectangle();
		
		var r = new Rectangle(10, 20);

		// These will fail for the same reason
		// r.setSize(-1, 1);
		// r.setSize(10);
		// r.setSize("hello", "world")

		r.setSize(40, 30);

		// These will fail because setColor expects a string
		// r.setColor(255, 255, 255);
		// r.setColor();

		r.setColor("red");

		// This will fail because destroy expects to be called after _makeSVG.  Also the _svg
		// property hasn't been set yet
		// r.destroySVG();

		r.getSVG().appendTo(svg);

		r.destroySVG();

		// This will fail because the _makeSVG method only expects to be called once
		// r.getSVG();

		// This will fail because the _svg property is now unset
		// r.destroySVG();

		// But we can create a new object and it will work just fine
		var r2 = new Rectangle(35, 45);
		r2.setColor("green");
		r2.setPosition(50, 25);
		r2.getSVG().appendTo(svg);
	});
});