

export class Router {
  constructor(routes) {
    this.routes = routes;
    this._loadInitialRoute();
    window.addEventListener("hashchange", this._onHashChange.bind(this));
  }

  // Getting the page's current url from hash
  _getCurrentURL() {
    console.log("Current url hash", window.location.hash)
    return window.location.hash;
  }

  // Matching URL to routes
  _matchUrlToRoute(urlSegs) {
    const matchedRoute = this.routes.find((route) => route.path === urlSegs);
    console.log("Matched route", matchedRoute)
    return matchedRoute;
  }

  // Loading the initial route
  _loadInitialRoute() {
    const url = this._getCurrentURL();
    this.loadRoute(url);
  }

  // Loading specified route
  loadRoute(url) {
    const matchedRoute = this._matchUrlToRoute(url);
    if (!matchedRoute) {
      throw new Error("Route not found");
    }
    matchedRoute.callback();
  }

  // Navigating to correct path
  navigateTo(path) {
    window.location.hash = path;
  }

  // Listener for hash changes
  _onHashChange() {
    const url = this._getCurrentURL();
    this.loadRoute(url);
  }
}
