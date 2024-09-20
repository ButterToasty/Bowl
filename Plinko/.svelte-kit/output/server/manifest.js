export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["android-chrome-192x192.png","android-chrome-512x512.png","apple-touch-icon.png","favicon-16x16.png","favicon-32x32.png","favicon.ico","site.webmanifest"]),
	mimeTypes: {".png":"image/png",".webmanifest":"application/manifest+json"},
	_: {
		client: {"start":"_app/immutable/entry/start.MJPcsxFQ.js","app":"_app/immutable/entry/app.B4PtnWhj.js","imports":["_app/immutable/entry/start.MJPcsxFQ.js","_app/immutable/chunks/entry.DHAmMizX.js","_app/immutable/chunks/scheduler.CN4FEajw.js","_app/immutable/chunks/index.8qYHx-Kq.js","_app/immutable/entry/app.B4PtnWhj.js","_app/immutable/chunks/scheduler.CN4FEajw.js","_app/immutable/chunks/index.DJqeu6aJ.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/4.js'))
		],
		routes: [
			{
				id: "/benchmark",
				pattern: /^\/benchmark\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
