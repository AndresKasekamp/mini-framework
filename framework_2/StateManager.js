export class State {
  state = {};
  onStateChange = null;

  constructor(initialState) {
    this.state = initialState;
    //this.onStateChange = null;
  }

  setState(newState) {
    this.state = newState;
    if (typeof this.onStateChange === "function") {
      this.onStateChange(this.state);
    }
  }
  setOnStateChange(callback) {
    this.onStateChange = callback;
  }
}
