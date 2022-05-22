/* eslint-disable no-console */

function limit(condition: () => boolean) {
  return function (target) {
    if (!condition()) {
      return;
    }
    for (const method in target.prototype) {
      target.prototype[method] = () => {};
    }
    console.log(target);
    return;
  };
}
const checkProductionBrowser = () => {
  const isBrowser = typeof window !== "undefined";
  const isProduction = process.env.NODE_ENV === "production";
  return isBrowser && isProduction;
};

// stub all functionality of this class in the production broswer;
// log statements will not ship to the users browser
@limit(checkProductionBrowser)
class ServerLogger {
  public log(...args) {
    console.log(...args);
  }
  public warn(...args) {
    console.warn(...args);
  }
  public error(...args) {
    console.error(...args);
  }
}

export const Logger = new ServerLogger();
