const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '../public/sw.js'), 'utf8');
const origin = 'https://preview.threekit.com';
const asset = `${origin}/api/optimizer/bingeom/none/sha256-test-gz?orgId=a`;
const bundle = `${origin}/api/asset-jobs/manifest/test?orgId=a`;
const good = (body = 'x'.repeat(2048), headers = {}) =>
  new Response(body, {
    headers: { 'cache-control': 'public, max-age=604800', ...headers },
  });

function worker() {
  const listeners = {},
    entries = new Map(),
    deleted = [];
  let fetches = 0,
    claimed = false,
    failStorage = false;
  let fetchImpl = async () => good();
  const cache = {
    match: async (req) => entries.get(req.url)?.clone(),
    put: async (req, res) => {
      if (failStorage) throw new Error('Quota exceeded');
      entries.set(req.url, res.clone());
    },
  };
  const context = vm.createContext({
    URL,
    Set,
    Response,
    console,
    self: {
      addEventListener: (name, fn) => {
        listeners[name] = fn;
      },
      skipWaiting: async () => {},
      clients: {
        claim: async () => {
          claimed = true;
        },
      },
    },
    caches: {
      open: async () => {
        if (failStorage) throw new Error('Storage denied');
        return cache;
      },
      keys: async () => [
        'newbalance-threekit-v0',
        'newbalance-threekit-v1',
        'other-app',
      ],
      delete: async (key) => {
        deleted.push(key);
      },
    },
    fetch: async (req) => {
      fetches++;
      return fetchImpl(req);
    },
  });
  vm.runInContext(source, context);
  function dispatch(url, options) {
    const lifetimes = [];
    let response;
    listeners.fetch({
      request: new Request(url, options),
      respondWith: (value) => {
        response = Promise.resolve(value);
      },
      waitUntil: (value) => lifetimes.push(value),
    });
    return { response, done: () => Promise.all(lifetimes) };
  }
  return {
    dispatch,
    entries,
    deleted,
    cache,
    get fetches() {
      return fetches;
    },
    get claimed() {
      return claimed;
    },
    set network(fn) {
      fetchImpl = fn;
    },
    denyStorage() {
      failStorage = true;
    },
    async activate() {
      let done;
      listeners.activate({
        waitUntil: (p) => {
          done = p;
        },
      });
      await done;
    },
    async request(url, options) {
      const e = dispatch(url, options);
      const res = await e.response;
      await e.done();
      return res;
    },
  };
}

test('immutable geometry without Content-Length is reused, including offline', async () => {
  const w = worker();
  await w.request(asset);
  w.network = async () => {
    throw new Error('offline');
  };
  assert.equal((await w.request(asset)).status, 200);
  assert.equal(w.fetches, 1);
});

test('organization/query parameters stay part of the cache key', async () => {
  const w = worker();
  await w.request(asset);
  await w.request(asset.replace('orgId=a', 'orgId=b'));
  assert.equal(w.fetches, 2);
  assert.equal(w.entries.size, 2);
});

test('only allowlisted resources and complete GET requests are intercepted', () => {
  const w = worker();
  for (const [url, options] of [
    ['http://localhost:3000/treble-app.js'],
    [`${origin}.evil.example/api/files/hash/test`],
    [`${origin}/api/cas/test`],
    [`${origin}/api/configurations/test`],
    [`${origin}/api/analytics/events`],
    [asset, { method: 'POST' }],
    [asset, { headers: { range: 'bytes=0-100' } }],
    [asset, { cache: 'no-store' }],
  ])
    assert.equal(w.dispatch(url, options).response, undefined, url);
});

test('errors, tiny immutable payloads and private responses are not cached', async () => {
  for (const response of [
    new Response('error', { status: 500 }),
    good('{}', { 'content-length': '2' }),
    good('secret', { 'cache-control': 'private' }),
    good('secret', { 'cache-control': 'no-store' }),
    new Response('partial', { status: 206 }),
  ]) {
    const w = worker();
    w.network = async () => response.clone();
    assert.equal((await w.request(asset)).status, response.status);
    assert.equal(w.entries.size, 0);
  }
});

test('publish placeholders are rejected with or without Content-Length', async () => {
  for (const headers of [
    {},
    { 'content-length': '2' },
    { 'cache-control': 'max-age=30' },
  ]) {
    const w = worker();
    w.network = async () => good('{}', headers);
    assert.equal(await (await w.request(bundle)).text(), '{}');
    assert.equal(w.entries.size, 0);
  }
});

test('SWR serves cached manifest immediately, and waitUntil keeps refresh alive', async () => {
  const w = worker();
  await w.request(bundle);
  let release;
  w.network = () =>
    new Promise((resolve) => {
      release = resolve;
    });
  const e = w.dispatch(bundle);
  assert.equal(await (await e.response).text(), 'x'.repeat(2048));
  let finished = false;
  const completion = e.done().then(() => {
    finished = true;
  });
  await Promise.resolve();
  assert.equal(finished, false);
  release(good('y'.repeat(2048)));
  await completion;
  assert.equal(await w.entries.get(bundle).text(), 'y'.repeat(2048));
});

test('placeholder refresh and offline refresh preserve a valid bundle', async () => {
  const w = worker();
  await w.request(bundle);
  w.network = async () => good('{}');
  await w.request(bundle);
  assert.equal(await w.entries.get(bundle).clone().text(), 'x'.repeat(2048));
  w.network = async () => {
    throw new Error('offline');
  };
  assert.equal((await w.request(bundle)).status, 200);
});

test('unversioned SDK revalidates; hashed textures and versioned SDK use cache-first', async () => {
  for (const [path, count] of [
    ['/app/js/threekit-player-bundle.js', 2],
    ['/app/js/threekit-player.js', 2],
    ['/app/js/threekit-player-bundle.abc123.js', 1],
    ['/api/images/texture/sha256-test', 1],
    ['/api/files/hash/sha256-test', 1],
  ]) {
    const w = worker();
    await w.request(origin + path);
    await w.request(origin + path);
    assert.equal(w.fetches, count, path);
  }
});

test('opaque assets are supported but opaque publish bundles are rejected', async () => {
  const w = worker();
  const opaque = {
    type: 'opaque',
    clone() {
      return this;
    },
  };
  w.network = async () => opaque;
  await w.request(asset);
  await w.request(bundle);
  assert.equal(w.entries.has(asset), true);
  assert.equal(w.entries.has(bundle), false);
});

test('storage denial and quota failure do not break network responses', async () => {
  const w = worker();
  w.denyStorage();
  assert.equal((await w.request(asset)).status, 200);
  const q = worker();
  q.cache.put = async () => {
    throw new Error('quota');
  };
  assert.equal((await q.request(asset)).status, 200);
});

test('activation deletes only obsolete NewBalance caches and claims clients', async () => {
  const w = worker();
  await w.activate();
  assert.deepEqual(w.deleted, ['newbalance-threekit-v0']);
  assert.equal(w.claimed, true);
});
