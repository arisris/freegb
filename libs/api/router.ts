// import { NextApiRequest, NextApiResponse } from "next";

// export interface NextApiRouteRequest extends NextApiRequest {
//   params?: Record<string, any>;
//   locals?: Record<string, any>;
// }
// export type NextApiRouteHandler = (
//   req: NextApiRouteRequest,
//   res: NextApiResponse
// ) => void | Promise<void>;
// export type NextApiRouteExtraHandler = (
//   pathNameOrPattern: string,
//   ...nextApiHandlers: NextApiRouteHandler[]
// ) => NextApiRouteMethodProxyType;
// // maybe its posible method exposed to proxy useful for autocomplete
// // but all method still posible
// export type NextApiRouteMaybePosibleMethod =
//   | "get"
//   | "post"
//   | "put"
//   | "patch"
//   | "delete"
//   | "options"
//   | "connect"
//   | "all"
//   | "handle";
// export type NextApiRouteMethodProxyType = {
//   [key in NextApiRouteMaybePosibleMethod]: NextApiRouteExtraHandler;
// } & { handle: NextApiRouteHandler };

// export class NextapiRouteTimeoutError extends Error {}
// export class NextapiRouteNotFoundError extends Error {}
// export type NextapiRouteOnErrorCallback = (
//   error: Error,
//   req: NextApiRouteRequest,
//   res: NextApiResponse
// ) => void;
// export type NextapiRouteOptions = {
//   key?: string;
//   timeout?: number;
//   onError?: NextapiRouteOnErrorCallback;
// };

// export function NextApiRoute(options?: NextapiRouteOptions) {
//   let timeOut: NodeJS.Timeout;
//   let { key, timeout, onError } = Object.assign(
//       {
//         key: "any",
//         timeout: 10000,
//         onError: (e: Error, _: NextApiRouteRequest, res: NextApiResponse) => {
//           let msg = e.message,
//             code = 500;
//           if (e instanceof NextapiRouteTimeoutError) {
//             code = 408;
//             msg = "Timeout Error";
//           }
//           if (e instanceof NextapiRouteNotFoundError) {
//             code = 404;
//             msg = "404 Page Not Found";
//           } else {
//             msg = "Internal Server Error";
//           }
//           let body = JSON.stringify({ code, msg });
//           res
//             .writeHead(code, {
//               "Content-Length": Buffer.byteLength(body),
//               "Content-Type": "application/json"
//             })
//             .end(body);
//         }
//       },
//       options
//     ),
//     routes = [],
//     handle: NextApiRouteHandler = async (req, res) => {
//       try {
//         let q = req.query[key];
//         let baseUrl = req.url
//           .split("/")
//           .filter((u) =>
//             q && Array.isArray(q) ? !q.some((i) => i === u) : !q.includes(u)
//           )
//           .join("/");
//         delete req.query[key];
//         // Regex its taken from original itty-router package. Not Modified
//         // Maybe in future fixed with support of caching pattern
//         // for now i use this
//         let regex = (u: string) =>
//             RegExp(
//               `^${(baseUrl + u)
//                 .replace(/(\/?)\*/g, "($1.*)?")
//                 .replace(/\/$/, "")
//                 .replace(/:(\w+)(\?)?(\.)?/g, "$2(?<$1>[^/]+)$2$3")
//                 .replace(/\.(?=[\w(])/, "\\.")
//                 .replace(/\)\.\?\(([^\[]+)\[\^/g, "?)\\.?($1(?<=\\.)[^\\.")}/*$`
//             ),
//           next: any;

//         if (timeout) {
//           timeOut = setTimeout(() => {
//             clearTimeout(timeOut);
//             onError(new NextapiRouteTimeoutError("Request timeout"), req, res);
//           }, timeout);
//         }
//         req.locals = {};
//         let notFound = new NextapiRouteNotFoundError("404 Page Not Found");
//         let arrr = routes
//           .filter(([m]) => m === req.method || m === "ALL")
//           .map(([a, b, c]) => [a, regex(b).exec(req.url), c])
//           .filter(([_, p]) => p);

//         if (arrr.length === 0) throw notFound;

//         for (let [_, rgx, handlers] of arrr) {
//           if (!rgx) throw notFound;
//           req.params = rgx.groups;

//           for (let handler of handlers) {
//             next = await handler(req, res);
//             if (res.writableFinished) {
//               if (timeOut) clearTimeout(timeOut);
//               break;
//             }
//             if (next) continue;
//           }
//         }
//       } catch (e) {
//         if (timeOut) clearTimeout(timeOut);
//         return onError(e, req, res);
//       }
//     },
//     get = (obj: { handle: NextApiRouteHandler }, prop: string, c: any) =>
//       prop === "handle"
//         ? obj.handle.bind(obj)
//         : (url: string, ...handlers: any) =>
//             routes.push([prop.toUpperCase(), url, handlers]) && c;
//   return new Proxy<NextApiRouteMethodProxyType>(
//     {
//       // @ts-ignore
//       handle
//     },
//     { get }
//   );
// }

// export default NextApiRoute;
