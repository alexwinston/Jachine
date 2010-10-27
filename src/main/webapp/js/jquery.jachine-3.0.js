jQuery.jachine = function() {
	
	// Current and initialized machine states
	var states = {};
	var currentState;
	
	var actionCallbacks = {
		started: function(state, context) {},
		execute: function(action, state, context) {},
		entered: function(state, fromState, context) {},
		exited: function(state, toState, context) {},
		stopped: function(state, context) {},
		error: function(message) {}
	};

	return {
		version : 3.0,
		callbacks : function(callbacks) {
			if (callbacks) {
				jQuery.extend(actionCallbacks, callbacks);
			}
			return this;
		},
		state : function(stateName, stateCallbacksAndActions) {
			if (!stateName)
				return currentState;
			
			// If the actions for the current state have been defined return them
			if (states[stateName])
				return states[stateName];

			if (stateCallbacksAndActions)
				states[stateName] = stateCallbacksAndActions;
			
			return jQuery.jachine;
		},
		start: function(stateName, context) {
			if (currentState)
				stop(currentState, context);
			
			if (!states[stateName].actions)
				return theCallbacks.error("No actions have been defined for the start state[" + stateName + "]");
			currentState = stateName;

			actionCallbacks.started(currentState, context);
			
			// Entered state callback 
			if (states[currentState].callbacks && states[currentState].callbacks.entered)
				states[currentState].callbacks.entered(currentState, undefined, context);
			
			return jQuery.jachine;
		},
		execute : function(actionName, context) {
			var action = actionCallbacks["_default"];
			if (states[currentState]) {
				if (states[currentState].actions["_default"])
					action = states[currentState].actions["_default"];
				if (states[currentState].actions[actionName])
					action = states[currentState].actions[actionName];
			}
			
			if (action) {
				var toState = (typeof action.transition == "function") ?
						action.transition(actionName, currentState, context) : action.transition;
				
				// Execute transition callback
				actionCallbacks.execute(actionName, currentState, context);
				if (action.execute)
					action.execute(actionName, currentState, context);
				
				// Exited state callbacks
				if (actionCallbacks.exited)
					actionCallbacks.exited(currentState, toState, context);
				if (states[currentState]) {
					if (states[currentState].callbacks && states[currentState].callbacks.exited)
						states[currentState].callbacks.exited(currentState, toState, context);
				}
				
				// Check the transition state exists
				if (!states[toState]) {
					actionCallbacks.error("The state[" + toState + "] doesn't exist'");
					
					return jQuery.jachine;
				}
				
				// Entered state callbacks
				if (actionCallbacks.entered)
					actionCallbacks.entered(toState, currentState, context);
				if (states[toState].callbacks && states[toState].callbacks.entered)
					states[toState].callbacks.entered(toState, currentState, context);

				currentState = toState;
					
				return jQuery.jachine;
			}

			actionCallbacks.error("The action[" + actionName + "] doesn't exist for state[" + currentState + "]'");
			
			return jQuery.jachine;
		},
		stop: function(context) {
			actionCallbacks.stopped(currentState, context);
			currentState = undefined;
			
			return jQuery.jachine;
		}
	};
}();
