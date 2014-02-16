require.config({
	map: {
		'*': {
			'$$': '../../$$'
		}
	}
});

define(['test'], function (Test) {

	var $body = $("body");
	var $input = $("<input>", {type: "button", value: "go"});
	$input.click(function () {
		var t1 = new Date().getTime();
		for (var i=0; i<50000; ++i) {

			var m1 = new Test();
			var m2 = new Test();

			m1.create($body);
			m2.create($body);

			m1.setText("hi");
			m2.setText("hello");

			m1.setBold(true);
			m1.destroy();
			m2.destroy();
		}
		var t2 = new Date().getTime();
		$body.append($("<div>", {text: "time: " + (t2 - t1)}));
	});

	$input.appendTo($body);

});