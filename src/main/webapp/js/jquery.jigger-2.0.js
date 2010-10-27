jQuery.jigger = function() {
	var theState;
	var theStateFrom;
	var theTriggers = {};
	var theCallbacks = {
		triggering : function(trigger, to, from, context) {},
		triggered : function(trigger, to, from, context) {},
		error : function(message) {}
	};

	return {
		version : 2.0,
		callbacks : function(callbacks) {
			if (callbacks) {
				jQuery.extend(theCallbacks, callbacks);
			}
			return this;
		},
		state : function(state) {
			theState = state;
			if (theTriggers[theState])
				return theTriggers[theState];

			theTriggers[theState] = {
				triggers : function(triggers) {
					for ( var i = 0; i < triggers.length; i++) {
						var trigger = triggers[i];
						theTriggers[theState][trigger.name] = trigger;
					}
					return jQuery.jigger;
				},
				trigger : function(trigger, context) {
					theCallbacks.triggering(trigger, theState, context);

					if (theTriggers[theState][trigger]) {
						var theStateTo = theTriggers[theState][trigger].trigger(theStateFrom);

						theCallbacks.triggered(trigger, theStateTo, theState, context);
						theStateFrom = theState;

						return jQuery.jigger;
					}

					theCallbacks.error("The trigger[" + trigger + "] doesn't exist for state[" + theState + "]'");
				}
			}
			return theTriggers[theState];
		}
	}
}();
