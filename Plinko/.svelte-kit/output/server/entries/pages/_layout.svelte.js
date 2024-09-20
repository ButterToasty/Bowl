import { c as create_ssr_component, a as add_attribute } from "../../chunks/ssr.js";
const ogImage = "/_app/immutable/assets/og_image.PzHn9Bxz.jpg";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-o3bz1d_START -->${$$result.title = `<title>Plinko</title>`, ""}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""><link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet"><meta property="og:type" content="website"><meta property="og:title" content="Plinko"><meta property="og:url" content="https://plinko-web-game.netlify.app/"><meta property="og:image"${add_attribute("content", ogImage, 0)}><!-- HEAD_svelte-o3bz1d_END -->`, ""} ${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
