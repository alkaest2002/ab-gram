import { createLikesGraph } from "../snaBase.js";
import { getSnaPlot } from "./snaPlots.js";

//////////////////////////////////////////////////////////////////////////////////
// REGENERATE
//////////////////////////////////////////////////////////////////////////////////

/**
 * Regenerate a single SNA plot from members.
 *
 * This is the entry point a Vue component uses to re-render a plot when the
 * ForceAtlas2 settings change: it rebuilds the preference graph from the
 * members (which also assigns a fresh random starting layout), then runs the
 * layout and renders the SVG with the supplied settings.
 *
 * `config` carries the preference type to plot (`typeOfPreference`, either
 * `"likes"` or `"dislikes"`) together with any ForceAtlas2 options (e.g.
 * `settings.scalingRatio`). Everything except `typeOfPreference` is forwarded
 * to the layout, so its shape matches `getSnaPlot`'s `config`.
 *
 * @param {Array<{id: string, name: string, likes: string[], dislikes: string[]}>} members - The group members.
 * @param {string} accentColor - The accent color used for nodes and edges.
 * @param {{typeOfPreference: string, iterations?: number, settings?: object}} config - The preference type to
 *   plot plus ForceAtlas2 options merged over the defaults.
 * @returns {{typeOfPreference: string, accentColor: string, svg: string}} The
 *   regenerated plot's preference type, accent color, and serialized SVG markup.
 */
export const regenerateSnaPlot = (members, accentColor, config) => {
  const { typeOfPreference, ...forceAtlas2Config } = config;

  const graph = createLikesGraph(members, typeOfPreference);

  return getSnaPlot(graph, accentColor, forceAtlas2Config)[0];
};
