// TODO completed ja active on siin vaja ära lahendada mingi callbackiga?

export class Router {
    constructor(routes) {
      this.routes = routes || {};
      this.currentRoute = null;
      window.addEventListener("popstate", () => {
        // for back/forward buttons
        this.handleRouteChange(window.location.pathname);
      });
      this.handleRouteChange(window.location.pathname);
    }
    navigate(path) {
      window.history.pushState(null, null, path);
      this.handleRouteChange(path);
    }
    handleRouteChange() {
      const path = window.location.hash;
      // Run the function only if page has been changed
      if (this.currentRoute != path) {
        const routeHandler = this.routes[path] || this.routes["*"]; //gets value of routes value by current path
        if (routeHandler) {
          this.currentRoute = path;
          routeHandler(); // runs value as function
        } else {
          console.error(`No route found for ${path}`);
        }
      }
    }
  }

