// Handles building backend API routes for dev and production
// Automatically switches between localhost and deployed domain

const app_name = 'fomonomo.xyz';

export function buildPath(route) {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000/'       // local backend
      : `http://${app_name}:5000/`;    // production backend (HTTP only for now)

  return baseUrl + route;
}
