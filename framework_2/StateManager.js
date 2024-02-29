// TODO state on todolist ja tema ilmselt muutub ajas ja kutsub renderendamist
// TODO eventid on sündmused, mis on seotud konkreetse elemendiga (nende äriloogika juhtimine on weird ja keeruline, kopeerida ükshaaval)

export class State {
    constructor(initialState) {
      this.state = initialState;
      this.onStateChange = null;
    }
    
    setState(newState) {
      console.log("this.state", this.state)
      console.log("new state", newState)
      this.state = newState;
      if (typeof this.onStateChange === "function") { 
        console.log("onstatechange was function")
        this.onStateChange(this.state);
      }
    }
    setOnStateChange(callback) {
      this.onStateChange = callback;
    }
  }