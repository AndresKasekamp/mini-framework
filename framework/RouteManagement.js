// TODO completed ja active on siin vaja ära lahendada mingi callbackiga?

export class Router {
  constructor(routes) {
    this.routes = routes || {};
    this.currentRoute = null;
    window.addEventListener("popstate", () => {
      this.checkRoute(window.location.pathname);
    });
    this.checkRoute(window.location.pathname);
  }

  navigate(path) {
    window.history.pushState(null, null, path);
    this.checkRoute(path);
  }

  checkRoute() {
    const path = window.location.hash;

    if (this.currentRoute !== path) {
      const routeHandler = this.routes[path] || this.routes["*"];
      if (routeHandler) {
        this.currentRoute = path;
        routeHandler(); 
      } else {
        console.error(`No route found for ${path}`);
      }
    }
  }
}
