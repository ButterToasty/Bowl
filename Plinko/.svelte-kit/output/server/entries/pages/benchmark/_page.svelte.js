import { c as create_ssr_component, b as subscribe, p as each, e as escape, v as validate_component, a as add_attribute } from "../../../chunks/ssr.js";
import { e as rowCount, h as binProbabilities, j as binProbabilitiesByRowCount, R as RiskLevel, k as dotProduct, l as binPayouts, p as plinkoEngine, r as riskLevel, P as Plinko, g as rowCountOptions } from "../../../chunks/Plinko.js";
import "chart.js/auto";
const BinsDistribution = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let binIndexes;
  let binProbabilitiesInPercent;
  let $rowCount, $$unsubscribe_rowCount;
  let $binProbabilities, $$unsubscribe_binProbabilities;
  $$unsubscribe_rowCount = subscribe(rowCount, (value) => $rowCount = value);
  $$unsubscribe_binProbabilities = subscribe(binProbabilities, (value) => $binProbabilities = value);
  const getWeightedPayout = (rowCount2, riskLevel2, binProbabilities2) => dotProduct(binPayouts[rowCount2][riskLevel2], binProbabilities2);
  binIndexes = Object.keys($binProbabilities);
  binProbabilitiesInPercent = Object.values($binProbabilities).map((prob) => prob * 100);
  binProbabilitiesByRowCount[$rowCount].map((prob) => prob * 100);
  $$unsubscribe_rowCount();
  $$unsubscribe_binProbabilities();
  return `<h2 class="mb-3 text-xl font-semibold" data-svelte-h="svelte-kjunup">Bins Distribution</h2> <div class="h-[400px] w-[800px]"><canvas></canvas></div> <table class="my-4 text-xs"><thead><tr>${each(binIndexes, (binIndex) => {
    return `<th class="px-2 py-1 text-left">${escape(binIndex)}</th>`;
  })}</tr></thead> <tbody><tr>${each(binProbabilitiesInPercent, (probPercent) => {
    return `<td class="w-20 px-2 py-1 tabular-nums">${escape(probPercent.toFixed(4))}%</td>`;
  })}</tr></tbody></table> <table class="my-4 text-sm"><thead data-svelte-h="svelte-1irznrv"><tr><th class="px-2 py-1 text-left">Risk</th> <th class="px-2 py-1 text-left">Expected value</th> <th class="px-2 py-1 text-left">Actual value</th></tr></thead> <tbody>${each([RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH], (riskLevel2) => {
    return `<tr><td class="px-2 py-1">${escape(riskLevel2)}</td> <td class="px-2 py-1 tabular-nums">${escape(getWeightedPayout($rowCount, riskLevel2, binProbabilitiesByRowCount[$rowCount]).toFixed(5))}</td> <td class="px-2 py-1 tabular-nums">${escape(getWeightedPayout($rowCount, riskLevel2, Object.values($binProbabilities)).toFixed(5))}</td> </tr>`;
  })}</tbody></table>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_plinkoEngine;
  let $$unsubscribe_rowCount;
  let $$unsubscribe_riskLevel;
  $$unsubscribe_plinkoEngine = subscribe(plinkoEngine, (value) => value);
  $$unsubscribe_rowCount = subscribe(rowCount, (value) => value);
  $$unsubscribe_riskLevel = subscribe(riskLevel, (value) => value);
  let ballsDropped = 0;
  $$unsubscribe_plinkoEngine();
  $$unsubscribe_rowCount();
  $$unsubscribe_riskLevel();
  return `${$$result.head += `<!-- HEAD_svelte-1spg4yq_START -->${$$result.title = `<title>Plinko - Benchmark</title>`, ""}<!-- HEAD_svelte-1spg4yq_END -->`, ""} <div class="h-[570px] w-[760px]">${validate_component(Plinko, "Plinko").$$render($$result, {}, {}, {})}</div> <div class="mx-4 my-8 flex items-center gap-16"><div class="flex items-center gap-4"><label for="rowCount" data-svelte-h="svelte-1w21x60">Rows</label> <select id="rowCount" class="border border-gray-400 p-2">${each(rowCountOptions, (rows) => {
    return `<option${add_attribute("value", rows, 0)}>${escape(rows)}</option>`;
  })}</select></div> <div class="flex items-center gap-4"><label for="riskLevel" data-svelte-h="svelte-gyylum">Risk</label> <select id="riskLevel" class="border border-gray-400 p-2">${each([RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH], (riskLevel2) => {
    return `<option${add_attribute("value", riskLevel2, 0)}>${escape(riskLevel2)}</option>`;
  })}</select></div> <button class="bg-cyan-100 p-2" data-svelte-h="svelte-1yhuav9">Drop Ball</button> ${`<button class="bg-cyan-100 p-2" data-svelte-h="svelte-108jjiw">Start Auto Drop</button>`} <p>Dropped: <span>${escape(ballsDropped)}</span></p></div> <div class="mx-4 my-8">${validate_component(BinsDistribution, "BinsDistribution").$$render($$result, {}, {}, {})}</div>`;
});
export {
  Page as default
};
