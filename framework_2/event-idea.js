// https://www.youtube.com/watch?v=X-AhceP6jpA&ab_channel=StephenGrider

class EventEmitter {
  constructor() {
    this.events = {};
  }

  // Eventname - name of the event
  // Callback - function that will be called later
  // Registrering event
  on(eventName, callback) {
    // kui see event on juba regated
    if (this.events[eventName]) {
      // Adding the callback
      this.events[eventName].push(callback);
    } else {
      this.events[eventName] = [callback];
    }
  }

  // rest meaning other arguments
  trigger(eventName, ...rest) {
    if (this.events[eventName]) {
      // Arguments to each callback
      this.events[eventName].forEach((cb) => cb.apply(null, rest));
    }
  }
}


const ee = new EventEmitter();

// Registering an event
ee.on('change', () => {
    console.log("Hello there")
})

ee.trigger('change')