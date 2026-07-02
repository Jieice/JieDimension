const CACHE_NAME = 'likexiaCat';
const locationUrl = location.origin + location.pathname.replace('serviceWorker.js', '');
const cdn = 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-y/';
const strap = "https://petercheney.github.io/strap/";
const cdnCache = [
	strap + "strapdown.js",
	strap + "strapdown.css",
	strap + "themes/litera.min.css",
	strap + "themes/bootstrap-responsive.min.css",
];
const version = 6;

// const urlsToCache = [
// 	locationUrl,
// 	locationUrl + 'index.html',
// ];

// 白名单
const CACHE_LIST = [
	location.host,
	'petercheney.github.io',
	'fonts.gstatic.com',
	'fonts.googleapis.com',
];

// const NO_CACHE_LIST = [
// 	'server.json',
// 	'build.version.json',
// ];

self.addEventListener('install', event => {
	//self.skipWaiting();
	// 缓存cdn
	event.waitUntil(
		caches.open('cdn').then(cache => {
			return cache.addAll(cdnCache);
		}).then(() => {
			// 安装新的
			return self.skipWaiting();
		})
	);
});

self.addEventListener("activate", event => {
	event.waitUntil(
		//caches.keys().then(keys => {
			// 删除旧缓存
			//Promise.all(
			//	keys.map(key => {
			//		//if (CACHE_NAME === key) {
			//		//	return caches.delete(key);
			//		//}
			//	})
			//);
		//}).
		caches.open(CACHE_NAME).then(function(cache) {
			// 删除index.html
			return cache.delete(new Request(locationUrl + 'index.html'), {
				ignoreSearch: true,
			}).then(() => {
				// 删除首页不带index.html
				return cache.delete(new Request(locationUrl), {
					ignoreSearch: true,
				});
			});
		}).then(() => {
			caches.open('cdn').then(cache => {
				return cache.addAll(cdnCache);
			}).then(() => {
				// 删除缓存库里的所有并且装新的sw
				caches.keys().then(keys => {
					keys.map(key => {
						if ('likexiaCat' === key) {
							return caches.delete(key);
						}
					})
				}).then(() => {
					return self.skipWaiting();
				})
			});
		})
	);
});

self.addEventListener('fetch', function(event) {
	let eventRequest = event.request;
	let requestUrl = eventRequest.url;
	let objectURL = new URL(requestUrl);
	// 过滤版本号文件
	let serverJson = requestUrl.includes('server.json');
	let buildJson = requestUrl.includes('build.version.json');
	// 过滤已知其他跨域的
	let skipWorker = CACHE_LIST.indexOf(objectURL.host);
	if (skipWorker > -1) {
		// 无视url参数
		event.respondWith(
			caches.match(eventRequest, {
				ignoreSearch: buildJson || serverJson,
			}).then(function(response, reject) {
				let useCache = true;
				if (response) {
					if (buildJson) {
						//没网直接返回
						if (!navigator.onLine) {
							return response;
						}
						if (objectURL.search) {
							useCache = false;
						}
					}
					if (useCache) {
						return response;
					}
				}
				return fetch(eventRequest, {
					cache: 'no-cache',
				}).then(function(responseFetch) {
					// 404 返回build
					if (buildJson && responseFetch.status !== 200) {
						return response;
					}
					if (!responseFetch || responseFetch.status !== 200 || responseFetch.type !== 'basic') {
						return responseFetch;
					}
					// 网络获得成功，再缓存
					let responseFetchToCache = responseFetch.clone();
					caches.open(CACHE_NAME).then(function(cache) {
						return cache.delete(eventRequest, {
							ignoreSearch: true,
						}).then(() => {
							return cache.put(eventRequest, responseFetchToCache);
						});
					});
					return responseFetch;
				}).catch(() => {
					if (response) {
						return response;
					}
				});
			})
		);
	}
});

self.addEventListener('error', event => {
	console.log(event);
});
