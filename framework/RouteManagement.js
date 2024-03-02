export class Router {
  constructor(routes, defaultPath) {
    this.routes = routes;
    this.defaultPath = defaultPath;
    this._loadInitialRoute();
    window.addEventListener("hashchange", this._onHashChange.bind(this));
  }

  // Getting the page's current url from hash
  _getCurrentURL() {

    return window.location.hash;
  }

  // Matching URL to routes
  _matchUrlToRoute(urlSegs) {
    const matchedRoute = this.routes.find((route) => route.path === urlSegs);

    return matchedRoute;
  }

  // Loading the initial route
  _loadInitialRoute() {
    const url = this._getCurrentURL();
    this.loadRoute(url);
  }

  // // Loading specified route
  loadRoute(url) {
    const matchedRoute = this._matchUrlToRoute(url);
    if (!matchedRoute) {
      if (this.defaultPath === null) {
        throw new Error("Route not found");
      }
      // Route not found, navigate to default route
      this.navigateTo(this.defaultPath);
      return; // Exit the method
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
