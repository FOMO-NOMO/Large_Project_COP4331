const app_name = 'fomonomo.xyz'
exports.buildPath = function buildPath(route: string): string {
    if (process.env.NODE_ENV != 'development') {
        return 'http://' + app_name + ':5000/' + route;
    }
    else {
        return 'http://localhost:5000/' + route;
    }
}

