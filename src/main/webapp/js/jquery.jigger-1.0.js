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
		version : 1.0,
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
					theCallbacks.triggering(trigger, theState, theStateFrom, context);

					if (theTriggers[theState][trigger]) {
						theTriggers[theState][trigger].trigger(theStateFrom);

						theCallbacks.triggered(trigger, theState, theStateFrom, context);
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
