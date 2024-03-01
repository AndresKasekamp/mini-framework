/**
 * Represents a state object that can be updated and trigger callbacks for changes.
 *
 * The `State` class provides a simple way to manage application state with change notifications.
 * It allows setting an initial state, updating the state, and registering a callback function
 * to be notified whenever the state changes.
 *
 * @example
 * const myState = new State({ count: 0 });
 *
 * myState.setOnStateChange((newState) => {
 *   console.log("State changed:", newState);
 * });
 *
 * myState.setState({ count: myState.state.count + 1 }); // Triggers callback
 */
export class State {
  /**
   * The current state object.
   * @type {Object}
   */
  state = {};

  /**
   * Optional callback function to be called when the state changes.
   * @type {Function<Object>}
   * @private
   */
  onStateChange = null;

  /**
   * Creates a new State instance with the provided initial state.
   *
   * @param {Object} initialState The initial state object.
   */
  constructor(initialState) {
    this.state = initialState;
  }

  /**
   * Updates the state with the provided new state object.
   * Triggers the `onStateChange` callback if registered.
   *
   * @param {Object} newState The new state object.
   */
  setState(newState) {
    this.state = newState;
    if (typeof this.onStateChange === "function") {
      this.onStateChange(this.state);
    }
  }

  /**
   * Sets a callback function to be called whenever the state changes.
   *
   * @param {Function<Object>} callback The callback function to be invoked.
   */

  updateState(callback) {
    this.onStateChange = callback;
  }
}
