import * as universal from '../entries/pages/benchmark/_layout.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/benchmark/+layout.ts";
export const imports = ["_app/immutable/nodes/2.B6ZOCjx_.js","_app/immutable/chunks/scheduler.CN4FEajw.js","_app/immutable/chunks/index.DJqeu6aJ.js"];
export const stylesheets = [];
export const fonts = [];
