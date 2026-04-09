import { corsHeaders as supabaseCorsHeaders } from "@supabase/supabase-js/cors";

// Extend Supabase's default CORS headers with extra headers the browser sends:
// - `user-agent`: Firefox includes it in preflight requests and strictly validates
// - `sentry-trace`, `baggage`: injected by @sentry/react browserTracingIntegration
export const corsHeaders: Record<string, string> = {
  ...supabaseCorsHeaders,
  "Access-Control-Allow-Headers": `${supabaseCorsHeaders["Access-Control-Allow-Headers"]}, user-agent, sentry-trace, baggage`,
};

/** Return 200 OK with CORS headers for OPTIONS preflight requests. */
export function corsPreflight(): Response {
  return new Response("ok", { headers: corsHeaders });
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function errorResponse(message: string, status = 400): Response {
  return json({ error: message }, status);
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

type Params = Record<string, string | undefined>;
type RouteHandler = (req: Request, url: URL, params: Params) => Response | Promise<Response>;
type AuthRouteHandler<T> = (
  ctx: T,
  req: Request,
  url: URL,
  params: Params,
) => Response | Promise<Response>;

interface Route {
  method: string;
  pattern: URLPattern;
  handler: RouteHandler;
}

function buildRouterCore(functionName: string) {
  const routes: Array<Route> = [];
  const prefixes = [`/functions/v1/${functionName}`, `/${functionName}`];

  function addRoute(method: string, pathname: string, handler: RouteHandler) {
    routes.push({ method, pattern: new URLPattern({ pathname }), handler });
  }

  function stripPrefix(pathname: string): string {
    for (const prefix of prefixes) {
      if (pathname.startsWith(prefix)) {
        return pathname.slice(prefix.length) || "/";
      }
    }
    return pathname;
  }

  async function dispatch(req: Request): Promise<Response> {
    if (req.method === "OPTIONS") return corsPreflight();

    const url = new URL(req.url);
    const pathname = stripPrefix(url.pathname);

    for (const { method, pattern, handler } of routes) {
      if (req.method !== method) continue;
      const match = pattern.exec({ pathname });
      if (match) {
        try {
          return await handler(req, url, match.pathname.groups as Params);
        } catch (err) {
          console.error(err);
          const message = err instanceof Error ? err.message : "Unknown error";
          return errorResponse(message, 500);
        }
      }
    }

    return errorResponse("Not found", 404);
  }

  return { addRoute, dispatch };
}

/**
 * Create a router for a Supabase Edge Function.
 * Handles CORS preflight, function-name prefix stripping, and URLPattern matching.
 */
export function createRouter(functionName: string) {
  const { addRoute, dispatch } = buildRouterCore(functionName);

  return {
    get(path: string, handler: RouteHandler) {
      addRoute("GET", path, handler);
    },
    post(path: string, handler: RouteHandler) {
      addRoute("POST", path, handler);
    },
    put(path: string, handler: RouteHandler) {
      addRoute("PUT", path, handler);
    },
    delete(path: string, handler: RouteHandler) {
      addRoute("DELETE", path, handler);
    },
    patch(path: string, handler: RouteHandler) {
      addRoute("PATCH", path, handler);
    },
    handle: dispatch,
  };
}

/**
 * Create a router that runs a context factory after route matching.
 * Use for authenticated routes — the factory can return a Response (e.g. 401)
 * to short-circuit, or a context value passed to every handler as the first arg.
 */
export function createAuthRouter<T>(
  functionName: string,
  contextFactory: (req: Request) => Promise<T | Response>,
) {
  const { addRoute, dispatch } = buildRouterCore(functionName);

  function wrapHandler(handler: AuthRouteHandler<T>): RouteHandler {
    return async (req, url, params) => {
      const result = await contextFactory(req);
      if (result instanceof Response) return result;
      return handler(result, req, url, params);
    };
  }

  return {
    get(path: string, handler: AuthRouteHandler<T>) {
      addRoute("GET", path, wrapHandler(handler));
    },
    post(path: string, handler: AuthRouteHandler<T>) {
      addRoute("POST", path, wrapHandler(handler));
    },
    put(path: string, handler: AuthRouteHandler<T>) {
      addRoute("PUT", path, wrapHandler(handler));
    },
    delete(path: string, handler: AuthRouteHandler<T>) {
      addRoute("DELETE", path, wrapHandler(handler));
    },
    patch(path: string, handler: AuthRouteHandler<T>) {
      addRoute("PATCH", path, wrapHandler(handler));
    },
    handle: dispatch,
  };
}
