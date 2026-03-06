//proxy.ts
export { auth as proxy } from "./auth";

export const config = {
  // Shudhu dashboard er bhetorer shob route-e auth check hobe
  matcher: ["/dashboard/:path*", "/api/tasks/:path*"],
};
