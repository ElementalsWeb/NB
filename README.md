# Getting Started with Treble

This project boilerplate was bootstrapped with [Create Treble App](https://github.com/threekit/treble).

## Available Scripts

In the project directory, you can run:

### `npm start`

Starts the local development server, available
in your browser on [http://localhost:3000](http://localhost:3000).

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and
builds out into a single file for easy embedding.

The build is minified and has the file name `threekit-embed.js`.

The build step is optimized for use with Treble Launchpad.

## Learn More

You can learn more in the [Treble documentation]().

## Threekit Service Worker

`src/registerServiceWorker.ts` registers `/sw.js` without delaying React startup.
`public/sw.js` adapts the runtime caching approach from Daikin for NewBalance.
It works on HTTPS or localhost, in development and production. Deployment assumes
the application and worker are served from the origin root. For a script embedded
on another origin, that host must also serve the worker; an iframe served from
this application's origin can register its own worker (subject to browser storage
permissions).

| Requests on preview.threekit.com / admin-fts.threekit.com | Strategy |
| --- | --- |
| Geometry `/api/optimizer/bingeom/`, files `/api/files/hash/`, hashed textures `/api/images/texture/sha256-*`, versioned player scripts | Cache first |
| Publish/manifest `/api/asset-jobs/` responses | Cached response immediately, refresh in the background |
| Unversioned `threekit-player.js` / `threekit-player-bundle.js` | Cached response immediately, refresh in the background |
| CAS by asset ID, configurations, catalog, analytics, uploads, local JS/CSS/HTML and other requests | Normal browser/network behavior |

Full URLs, including query parameters, are retained as cache keys. Unlike the
reference worker, activation removes only outdated `newbalance-threekit-*` caches.
HTTP errors, partial responses and readable `private`/`no-store` responses are not
stored. Publish/manifest responses require at least 1 KB and a cache max-age of
at least 300 seconds, so temporary `{}` responses cannot replace a valid bundle.
Missing Content-Length is supported. Opaque responses are accepted only for
asset/player routes, because their headers and status are inaccessible.
Background refreshes use `event.waitUntil`; cache/storage failures fall back to
the network. Analytics behavior is preserved.

### Build and verification

1. Run `npm run test:sw` (Node 20+ for the built-in test runner).
2. Run `npm run build`. The `postbuild` script copies `public/sw.js` to `build/sw.js`;
   Treble 0.0.44 only copies the favicon automatically. Commit/deploy the updated
   build with the source when using the existing Dockerfile, which serves the
   checked-in build rather than building it.
3. Start `npm run serve`, or use `npm start` for development. Production serves
   `/sw.js` explicitly with JavaScript MIME type and no-store update headers.
4. In browser DevTools, check Application > Service Workers for an active worker
   and Cache Storage for `newbalance-threekit-v1` after opening a product.
5. Reload and open the same product. Cached geometry/files/textures should show
   `(ServiceWorker)` in Network. SDK and publish/manifest requests may still
   appear on the network because they refresh in the background. Keep Application
   > Service Workers > Bypass for network disabled while checking.

The initial load warms the cache after the worker takes control; registration
does not guarantee interception of requests already started. No automatic reload
is performed. Bump `CACHE_NAME` in `public/sw.js` and rebuild to invalidate this
application's cache. This is runtime asset caching, not a complete offline app.

### Findings from the supplied browser recordings

The supplied HAR contains 24 geometry/file/hashed-texture requests totaling
2,886,781 decoded bytes, one unversioned player bundle (4,600,875 decoded bytes),
two manifest requests and 118 CAS requests. CAS URLs use asset IDs and branch
parameters, so they are deliberately not treated as immutable. The SDK was
already served without network transfer in this recording; these sizes are not
measured bandwidth savings. No Static Publish bundle was observed, so the
existing player publish settings are preserved.

The trace contains five RunTask events longer than 50 ms (about 1,020 ms combined,
maximum 320 ms). A Service Worker reduces repeat resource fetching; it does not
eliminate JavaScript execution or WebGL work. The recordings are a baseline,
not a before/after performance measurement.
