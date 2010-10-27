Jachine: jQuery State Machine
=============================

Jachine is a simple jQuery finite state machine. Samples are provided in the src/main/webapp directory.

Example
-------
<html>
<head>
	<script src="http://code.jquery.com/jquery-1.4.3.min.js"></script>
	<script src="js/jquery.jachine-3.0.js"></script>
	<script>
		$(document).ready(function() {
			// http://en.wikipedia.org/wiki/Deterministic_finite-state_machine
			$.jachine
				.callbacks({
					started: function(state, context) { $("#result").text("yes"); },
					executing: function(action, state, context) { },
					executed: function(action, state, context) { },
					stopped: function(state, context) { },
					error: function(message) { }})
				.state("s1", {
					callbacks: {
						entered: function(state, fromState, context) { $("#result").text("yes"); },
						exited: function(state, toState, contxt) { }},
					actions: {
						0: { transition: "s2"},
						"1": { transition: "s1"}}})
				.state("s2", {
					callbacks: {
						entered: function(state, fromState, context) { $("#result").text("no"); }},
					actions: {
						"0": { transition: "s1"},
						"1": { transition: "s2"}}})
				.start("s1");
			
			$("#one").click(function () { $.jachine.execute("1"); });
			$("#zero").click(function () { $.jachine.execute("0"); });
			$("#reset").click(function () { $.jachine.start("s1"); });
		});
	</script>
</head> 
<body> 
	<div>
		<input id="one" type="button" value="One">
		<input id="zero" type="button" value="Zero">
		<input id="reset" type="button" value="Reset">
		<span id="result">yes</span>
	</div>
</body>
</html>
