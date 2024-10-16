
import root from '../root.svelte';
import { set_building, set_prerendering } from '__sveltekit/environment';
import { set_assets } from '__sveltekit/paths';
import { set_manifest, set_read_implementation } from '__sveltekit/server';
import { set_private_env, set_public_env, set_safe_public_env } from '../../../node_modules/@sveltejs/kit/src/runtime/shared-server.js';

export const options = {
	app_dir: "_app",
	app_template_contains_nonce: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	env_private_prefix: '',
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!doctype html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<link rel=\"icon\" href=\"" + assets + "/favicon.png\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\t    " + head + "\n\n\t\t<link href=\"https://cdn.jsdelivr.net/npm/beercss@3.7.10/dist/cdn/beer.min.css\" rel=\"stylesheet\">\n\t\t<script type=\"module\" src=\"https://cdn.jsdelivr.net/npm/beercss@3.7.10/dist/cdn/beer.min.js\"></script>\n\t\t<script type=\"module\" src=\"https://cdn.jsdelivr.net/npm/material-dynamic-colors@1.1.2/dist/cdn/material-dynamic-colors.min.js\"></script>\n\t\t<style> /* Custom BeerCSS theme */\n\t\t@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');\n\t\t:root {\n\t\t\t/* To use your custom font */\n\t\t\t--font: \"Nunito\";\n\t\t}\n\n\t\t:root,\n\t\tbody.light { \n\t\t\t--primary:#0047FF;\n\t\t\t--on-primary:#ffffff;\n\t\t\t--primary-container:#d1e4ff;\n\t\t\t--on-primary-container:#001d36;\n\t\t\t--secondary:#535f70;\n\t\t\t--on-secondary:#ffffff;\n\t\t\t--secondary-container:#d7e3f7;\n\t\t\t--on-secondary-container:#101c2b;\n\t\t\t--tertiary:#6b5778;\n\t\t\t--on-tertiary:#ffffff;\n\t\t\t--tertiary-container:#f2daff;\n\t\t\t--on-tertiary-container:#251431;\n\t\t\t--error:#ba1a1a;\n\t\t\t--on-error:#ffffff;\n\t\t\t--error-container:#ffdad6;\n\t\t\t--on-error-container:#410002;\n\t\t\t--background:#fdfcff;\n\t\t\t--on-background:#1a1c1e;\n\t\t\t--surface:#faf9fc;\n\t\t\t--on-surface:#1a1c1e;\n\t\t\t--surface-variant:#dfe2eb;\n\t\t\t--on-surface-variant:#43474e;\n\t\t\t--outline:#73777f;\n\t\t\t--outline-variant:#c3c7cf;\n\t\t\t--shadow:#000000;\n\t\t\t--scrim:#000000;\n\t\t\t--inverse-surface:#2f3033;\n\t\t\t--inverse-on-surface:#f1f0f4;\n\t\t\t--inverse-primary:#9ecaff;\n\t\t\t--surface-dim:#dadadd;\n\t\t\t--surface-bright:#faf9fc;\n\t\t\t--surface-container-lowest:#ffffff;\n\t\t\t--surface-container-low:#f4f3f7;\n\t\t\t--surface-container:#eeedf1;\n\t\t\t--surface-container-high:#e8e8eb;\n\t\t\t--surface-container-highest:#e2e2e6;\n\t\t}\n\n\t\tbody.dark {\n\t\t\t--primary:#0047FF;\n\t\t\t--on-primary:#003258;\n\t\t\t--primary-container:#00497d;\n\t\t\t--on-primary-container:#d1e4ff;\n\t\t\t--secondary:#bbc7db;\n\t\t\t--on-secondary:#253140;\n\t\t\t--secondary-container:#3b4858;\n\t\t\t--on-secondary-container:#d7e3f7;\n\t\t\t--tertiary:#d6bee4;\n\t\t\t--on-tertiary:#3b2948;\n\t\t\t--tertiary-container:#523f5f;\n\t\t\t--on-tertiary-container:#f2daff;\n\t\t\t--error:#ffb4ab;\n\t\t\t--on-error:#690005;\n\t\t\t--error-container:#93000a;\n\t\t\t--on-error-container:#ffb4ab;\n\t\t\t--background:#1a1c1e;\n\t\t\t--on-background:#e2e2e6;\n\t\t\t--surface:#121316;\n\t\t\t--on-surface:#e2e2e6;\n\t\t\t--surface-variant:#43474e;\n\t\t\t--on-surface-variant:#c3c7cf;\n\t\t\t--outline:#8d9199;\n\t\t\t--outline-variant:#43474e;\n\t\t\t--shadow:#000000;\n\t\t\t--scrim:#000000;\n\t\t\t--inverse-surface:#e2e2e6;\n\t\t\t--inverse-on-surface:#2f3033;\n\t\t\t--inverse-primary:#0061a4;\n\t\t\t--surface-dim:#121316;\n\t\t\t--surface-bright:#38393c;\n\t\t\t--surface-container-lowest:#0d0e11;\n\t\t\t--surface-container-low:#1a1c1e;\n\t\t\t--surface-container:#1e2022;\n\t\t\t--surface-container-high:#282a2d;\n\t\t\t--surface-container-highest:#333538;\n\t\t}\n\n\t\t.underline {\n\t\t\ttext-decoration: none;\n\t\t\tborder-bottom: 3px solid black;\n\t\t}\n\t\t</style>\n\t</head>\n\t<body data-sveltekit-preload-data=\"hover\" class=\"light\">\n\t\t<div style=\"display: contents\">" + body + "</div>\n\t</body>\n</html>\n",
		error: ({ status, message }) => "<!doctype html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>" + message + "</title>\n\n\t\t<style>\n\t\t\tbody {\n\t\t\t\t--bg: white;\n\t\t\t\t--fg: #222;\n\t\t\t\t--divider: #ccc;\n\t\t\t\tbackground: var(--bg);\n\t\t\t\tcolor: var(--fg);\n\t\t\t\tfont-family:\n\t\t\t\t\tsystem-ui,\n\t\t\t\t\t-apple-system,\n\t\t\t\t\tBlinkMacSystemFont,\n\t\t\t\t\t'Segoe UI',\n\t\t\t\t\tRoboto,\n\t\t\t\t\tOxygen,\n\t\t\t\t\tUbuntu,\n\t\t\t\t\tCantarell,\n\t\t\t\t\t'Open Sans',\n\t\t\t\t\t'Helvetica Neue',\n\t\t\t\t\tsans-serif;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\theight: 100vh;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tmax-width: 32rem;\n\t\t\t\tmargin: 0 1rem;\n\t\t\t}\n\n\t\t\t.status {\n\t\t\t\tfont-weight: 200;\n\t\t\t\tfont-size: 3rem;\n\t\t\t\tline-height: 1;\n\t\t\t\tposition: relative;\n\t\t\t\ttop: -0.05rem;\n\t\t\t}\n\n\t\t\t.message {\n\t\t\t\tborder-left: 1px solid var(--divider);\n\t\t\t\tpadding: 0 0 0 1rem;\n\t\t\t\tmargin: 0 0 0 1rem;\n\t\t\t\tmin-height: 2.5rem;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t}\n\n\t\t\t.message h1 {\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 1em;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t@media (prefers-color-scheme: dark) {\n\t\t\t\tbody {\n\t\t\t\t\t--bg: #222;\n\t\t\t\t\t--fg: #ddd;\n\t\t\t\t\t--divider: #666;\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body>\n\t\t<div class=\"error\">\n\t\t\t<span class=\"status\">" + status + "</span>\n\t\t\t<div class=\"message\">\n\t\t\t\t<h1>" + message + "</h1>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n"
	},
	version_hash: "w2ow28"
};

export async function get_hooks() {
	return {
		
		
	};
}

export { set_assets, set_building, set_manifest, set_prerendering, set_private_env, set_public_env, set_read_implementation, set_safe_public_env };
