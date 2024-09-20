import { h as get_store_value, c as create_ssr_component, j as compute_rest_props, g as getContext, k as spread, n as escape_attribute_value, l as escape_object, e as escape, b as subscribe, q as add_styles, p as each, v as validate_component, a as add_attribute } from "./ssr.js";
import Matter from "matter-js";
import { w as writable, d as derived } from "./index.js";
import { v4 } from "uuid";
var BetMode = /* @__PURE__ */ ((BetMode2) => {
  BetMode2["MANUAL"] = "MANUAL";
  BetMode2["AUTO"] = "AUTO";
  return BetMode2;
})(BetMode || {});
var RiskLevel = /* @__PURE__ */ ((RiskLevel2) => {
  RiskLevel2["LOW"] = "LOW";
  RiskLevel2["MEDIUM"] = "MEDIUM";
  RiskLevel2["HIGH"] = "HIGH";
  return RiskLevel2;
})(RiskLevel || {});
function interpolateRgbColors(from, to, length) {
  return Array.from({ length }, (_, i) => ({
    r: Math.round(from.r + (to.r - from.r) / (length - 1) * i),
    g: Math.round(from.g + (to.g - from.g) / (length - 1) * i),
    b: Math.round(from.b + (to.b - from.b) / (length - 1) * i)
  }));
}
function getBinColors(rowCount2) {
  {
    const binCount = rowCount2 + 1;
    const isBinsEven = binCount % 2 === 0;
    const redToYellowLength = Math.ceil(binCount / 2);
    const redToYellowBg = interpolateRgbColors(
      { r: 255, g: 0, b: 63 },
      // rgb(255, 0, 63)
      { r: 255, g: 192, b: 0 },
      // rgb(255, 192, 0)
      redToYellowLength
    ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);
    const redToYellowShadow = interpolateRgbColors(
      { r: 166, g: 0, b: 4 },
      // rgb(166, 0, 4)
      { r: 171, g: 121, b: 0 },
      // rgb(171, 121, 0)
      redToYellowLength
    ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);
    return {
      background: [...redToYellowBg, ...redToYellowBg.toReversed().slice(isBinsEven ? 0 : 1)],
      shadow: [...redToYellowShadow, ...redToYellowShadow.toReversed().slice(isBinsEven ? 0 : 1)]
    };
  }
}
function computeBinProbabilities(rowCount2) {
  const p = 0.5;
  const probabilities = [];
  for (let k = 0; k <= rowCount2; k++) {
    const binomialCoefficient = factorial(rowCount2) / (factorial(k) * factorial(rowCount2 - k));
    const probability = binomialCoefficient * Math.pow(p, k) * Math.pow(1 - p, rowCount2 - k);
    probabilities.push(probability);
  }
  return probabilities;
}
function convertScale(valueA, scaleA, scaleB) {
  const [minA, maxA] = scaleA;
  const [minB, maxB] = scaleB;
  const percentage = (valueA - minA) / (maxA - minA);
  const valueB = percentage * (maxB - minB) + minB;
  return valueB;
}
function countValueOccurrences(values) {
  const result = {};
  for (const value of values) {
    result[value] = (result[value] || 0) + 1;
  }
  return result;
}
function dotProduct(a, b) {
  return a.reduce((acc, value, index) => acc + value * b[index], 0);
}
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
function formatCurrency(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency",
    currency: "USD"
  });
}
function getRandomBetween(min, max) {
  return min + Math.random() * (max - min);
}
const LOCAL_STORAGE_KEY = {
  BALANCE: "plinko_balance",
  SETTINGS: {
    ANIMATION: "plinko_settings_animation"
  }
};
const rowCountOptions = [8, 9, 10, 11, 12, 13, 14, 15, 16];
const binColorsByRowCount = rowCountOptions.reduce(
  (acc, rowCount2) => {
    acc[rowCount2] = getBinColors(rowCount2);
    return acc;
  },
  {}
);
const binProbabilitiesByRowCount = rowCountOptions.reduce(
  (acc, rowCount2) => {
    acc[rowCount2] = computeBinProbabilities(rowCount2);
    return acc;
  },
  {}
);
const binPayouts = {
  8: {
    [RiskLevel.LOW]: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
    [RiskLevel.MEDIUM]: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
    [RiskLevel.HIGH]: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29]
  },
  9: {
    [RiskLevel.LOW]: [5.6, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 5.6],
    [RiskLevel.MEDIUM]: [18, 4, 1.7, 0.9, 0.5, 0.5, 0.9, 1.7, 4, 18],
    [RiskLevel.HIGH]: [43, 7, 2, 0.6, 0.2, 0.2, 0.6, 2, 7, 43]
  },
  10: {
    [RiskLevel.LOW]: [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
    [RiskLevel.MEDIUM]: [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22],
    [RiskLevel.HIGH]: [76, 10, 3, 0.9, 0.3, 0.2, 0.3, 0.9, 3, 10, 76]
  },
  11: {
    [RiskLevel.LOW]: [8.4, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 8.4],
    [RiskLevel.MEDIUM]: [24, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 24],
    [RiskLevel.HIGH]: [120, 14, 5.2, 1.4, 0.4, 0.2, 0.2, 0.4, 1.4, 5.2, 14, 120]
  },
  12: {
    [RiskLevel.LOW]: [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
    [RiskLevel.MEDIUM]: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
    [RiskLevel.HIGH]: [170, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 2, 8.1, 24, 170]
  },
  13: {
    [RiskLevel.LOW]: [8.1, 4, 3, 1.9, 1.2, 0.9, 0.7, 0.7, 0.9, 1.2, 1.9, 3, 4, 8.1],
    [RiskLevel.MEDIUM]: [43, 13, 6, 3, 1.3, 0.7, 0.4, 0.4, 0.7, 1.3, 3, 6, 13, 43],
    [RiskLevel.HIGH]: [260, 37, 11, 4, 1, 0.2, 0.2, 0.2, 0.2, 1, 4, 11, 37, 260]
  },
  14: {
    [RiskLevel.LOW]: [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1],
    [RiskLevel.MEDIUM]: [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58],
    [RiskLevel.HIGH]: [420, 56, 18, 5, 1.9, 0.3, 0.2, 0.2, 0.2, 0.3, 1.9, 5, 18, 56, 420]
  },
  15: {
    [RiskLevel.LOW]: [15, 8, 3, 2, 1.5, 1.1, 1, 0.7, 0.7, 1, 1.1, 1.5, 2, 3, 8, 15],
    [RiskLevel.MEDIUM]: [88, 18, 11, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 11, 18, 88],
    [RiskLevel.HIGH]: [620, 83, 27, 8, 3, 0.5, 0.2, 0.2, 0.2, 0.2, 0.5, 3, 8, 27, 83, 620]
  },
  16: {
    [RiskLevel.LOW]: [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16],
    [RiskLevel.MEDIUM]: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
    [RiskLevel.HIGH]: [1e3, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1e3]
  }
};
const binColor = {
  background: {
    red: { r: 255, g: 0, b: 63 },
    // rgb(255, 0, 63)
    yellow: { r: 255, g: 192, b: 0 }
    // rgb(255, 192, 0)
  },
  shadow: {
    red: { r: 166, g: 0, b: 4 },
    // rgb(166, 0, 4)
    yellow: { r: 171, g: 121, b: 0 }
    // rgb(171, 121, 0)
  }
};
class PlinkoEngine {
  /**
   * The canvas element to render the game to.
   */
  canvas;
  /**
   * A cache value of the {@link betAmount} store for faster access.
   */
  betAmount;
  /**
   * A cache value of the {@link rowCount} store for faster access.
   */
  rowCount;
  /**
   * A cache value of the {@link riskLevel} store for faster access.
   */
  riskLevel;
  engine;
  render;
  runner;
  /**
   * Every pin of the game.
   */
  pins = [];
  /**
   * Walls are invisible, slanted "guard rails" at the left and right sides of the
   * pin triangle. It prevents balls from falling outside the pin triangle and not
   * hitting a bin.
   */
  walls = [];
  /**
   * "Sensor" is an invisible body at the bottom of the canvas. It detects whether
   * a ball arrives at the bottom and enters a bin.
   */
  sensor;
  /**
   * The x-coordinates of every pin's center in the last row. Useful for calculating
   * which bin a ball falls into.
   */
  pinsLastRowXCoords = [];
  static WIDTH = 760;
  static HEIGHT = 570;
  static PADDING_X = 52;
  static PADDING_TOP = 36;
  static PADDING_BOTTOM = 28;
  static PIN_CATEGORY = 1;
  static BALL_CATEGORY = 2;
  /**
   * Friction parameters to be applied to the ball body.
   *
   * Higher friction leads to more concentrated distribution towards the center. These numbers
   * are found by trial and error to make the actual weighted bin payout very close to the
   * expected bin payout.
   */
  static ballFrictions = {
    friction: 0.5,
    frictionAirByRowCount: {
      8: 0.0395,
      9: 0.041,
      10: 0.038,
      11: 0.0355,
      12: 0.0414,
      13: 0.0437,
      14: 0.0401,
      15: 0.0418,
      16: 0.0364
    }
  };
  /**
   * Creates the engine and the game's layout.
   *
   * @param canvas The canvas element to render the game to.
   *
   * @remarks This constructor does NOT start the rendering and physics engine.
   * Call the `start` method to start the engine.
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.betAmount = get_store_value(betAmount);
    this.rowCount = get_store_value(rowCount);
    this.riskLevel = get_store_value(riskLevel);
    betAmount.subscribe((value) => this.betAmount = value);
    rowCount.subscribe((value) => this.updateRowCount(value));
    riskLevel.subscribe((value) => this.riskLevel = value);
    this.engine = Matter.Engine.create({
      timing: {
        timeScale: 1
      }
    });
    this.render = Matter.Render.create({
      engine: this.engine,
      canvas: this.canvas,
      options: {
        width: PlinkoEngine.WIDTH,
        height: PlinkoEngine.HEIGHT,
        background: "#0f1728",
        wireframes: false
      }
    });
    this.runner = Matter.Runner.create();
    this.placePinsAndWalls();
    this.sensor = Matter.Bodies.rectangle(
      this.canvas.width / 2,
      this.canvas.height,
      this.canvas.width,
      10,
      {
        isSensor: true,
        isStatic: true,
        render: {
          visible: false
        }
      }
    );
    Matter.Composite.add(this.engine.world, [this.sensor]);
    Matter.Events.on(this.engine, "collisionStart", ({ pairs }) => {
      pairs.forEach(({ bodyA, bodyB }) => {
        if (bodyA === this.sensor) {
          this.handleBallEnterBin(bodyB);
        } else if (bodyB === this.sensor) {
          this.handleBallEnterBin(bodyA);
        }
      });
    });
  }
  /**
   * Renders the game and starts the physics engine.
   */
  start() {
    Matter.Render.run(this.render);
    Matter.Runner.run(this.runner, this.engine);
  }
  /**
   * Stops (pauses) the rendering and physics engine.
   */
  stop() {
    Matter.Render.stop(this.render);
    Matter.Runner.stop(this.runner);
  }
  /**
   * Drops a new ball from the top with a random horizontal offset, and deducts the balance.
   */
  dropBall() {
    const ballOffsetRangeX = this.pinDistanceX * 0.8;
    const ballRadius = this.pinRadius * 2;
    const { friction, frictionAirByRowCount } = PlinkoEngine.ballFrictions;
    const ball = Matter.Bodies.circle(
      getRandomBetween(
        this.canvas.width / 2 - ballOffsetRangeX,
        this.canvas.width / 2 + ballOffsetRangeX
      ),
      0,
      ballRadius,
      {
        restitution: 0.8,
        // Bounciness
        friction,
        frictionAir: frictionAirByRowCount[this.rowCount],
        collisionFilter: {
          category: PlinkoEngine.BALL_CATEGORY,
          mask: PlinkoEngine.PIN_CATEGORY
          // Collide with pins only, but not other balls
        },
        render: {
          fillStyle: "#ff0000"
        }
      }
    );
    Matter.Composite.add(this.engine.world, ball);
    betAmountOfExistingBalls.update((value) => ({ ...value, [ball.id]: this.betAmount }));
    balance.update((balance2) => balance2 - this.betAmount);
  }
  /**
   * Total width of all bins as percentage of the canvas width.
   */
  get binsWidthPercentage() {
    const lastPinX = this.pinsLastRowXCoords[this.pinsLastRowXCoords.length - 1];
    return (lastPinX - this.pinsLastRowXCoords[0]) / PlinkoEngine.WIDTH;
  }
  /**
   * Gets the horizontal distance between each pin's center point.
   */
  get pinDistanceX() {
    const lastRowPinCount = 3 + this.rowCount - 1;
    return (this.canvas.width - PlinkoEngine.PADDING_X * 2) / (lastRowPinCount - 1);
  }
  get pinRadius() {
    return (24 - this.rowCount) / 2;
  }
  /**
   * Refreshes the game with a new number of rows.
   *
   * Does nothing if the new row count equals the current count.
   */
  updateRowCount(rowCount2) {
    if (rowCount2 === this.rowCount) {
      return;
    }
    this.removeAllBalls();
    this.rowCount = rowCount2;
    this.placePinsAndWalls();
  }
  /**
   * Called when a ball hits the invisible sensor at the bottom.
   */
  handleBallEnterBin(ball) {
    const binIndex = this.pinsLastRowXCoords.findLastIndex((pinX) => pinX < ball.position.x);
    if (binIndex !== -1 && binIndex < this.pinsLastRowXCoords.length - 1) {
      const betAmount2 = get_store_value(betAmountOfExistingBalls)[ball.id] ?? 0;
      const multiplier = binPayouts[this.rowCount][this.riskLevel][binIndex];
      const payoutValue = betAmount2 * multiplier;
      const profit = payoutValue - betAmount2;
      winRecords.update((records) => [
        ...records,
        {
          id: v4(),
          betAmount: betAmount2,
          rowCount: this.rowCount,
          binIndex,
          payout: {
            multiplier,
            value: payoutValue
          },
          profit
        }
      ]);
      totalProfitHistory.update((history) => {
        const lastTotalProfit = history.slice(-1)[0];
        return [...history, lastTotalProfit + profit];
      });
      balance.update((balance2) => balance2 + payoutValue);
    }
    Matter.Composite.remove(this.engine.world, ball);
    betAmountOfExistingBalls.update((value) => {
      const newValue = { ...value };
      delete newValue[ball.id];
      return newValue;
    });
  }
  /**
   * Renders the pins and walls. Previous ones are removed before rendering new ones.
   */
  placePinsAndWalls() {
    const { PADDING_X, PADDING_TOP, PADDING_BOTTOM, PIN_CATEGORY, BALL_CATEGORY } = PlinkoEngine;
    if (this.pins.length > 0) {
      Matter.Composite.remove(this.engine.world, this.pins);
      this.pins = [];
    }
    if (this.pinsLastRowXCoords.length > 0) {
      this.pinsLastRowXCoords = [];
    }
    if (this.walls.length > 0) {
      Matter.Composite.remove(this.engine.world, this.walls);
      this.walls = [];
    }
    for (let row = 0; row < this.rowCount; ++row) {
      const rowY = PADDING_TOP + (this.canvas.height - PADDING_TOP - PADDING_BOTTOM) / (this.rowCount - 1) * row;
      const rowPaddingX = PADDING_X + (this.rowCount - 1 - row) * this.pinDistanceX / 2;
      for (let col = 0; col < 3 + row; ++col) {
        const colX = rowPaddingX + (this.canvas.width - rowPaddingX * 2) / (3 + row - 1) * col;
        const pin = Matter.Bodies.circle(colX, rowY, this.pinRadius, {
          isStatic: true,
          render: {
            fillStyle: "#ffffff"
          },
          collisionFilter: {
            category: PIN_CATEGORY,
            mask: BALL_CATEGORY
            // Collide with balls
          }
        });
        this.pins.push(pin);
        if (row === this.rowCount - 1) {
          this.pinsLastRowXCoords.push(colX);
        }
      }
    }
    Matter.Composite.add(this.engine.world, this.pins);
    const firstPinX = this.pins[0].position.x;
    const leftWallAngle = Math.atan2(
      firstPinX - this.pinsLastRowXCoords[0],
      this.canvas.height - PADDING_TOP - PADDING_BOTTOM
    );
    const leftWallX = firstPinX - (firstPinX - this.pinsLastRowXCoords[0]) / 2 - this.pinDistanceX * 0.25;
    const leftWall = Matter.Bodies.rectangle(
      leftWallX,
      this.canvas.height / 2,
      10,
      this.canvas.height,
      {
        isStatic: true,
        angle: leftWallAngle,
        render: { visible: false }
      }
    );
    const rightWall = Matter.Bodies.rectangle(
      this.canvas.width - leftWallX,
      this.canvas.height / 2,
      10,
      this.canvas.height,
      {
        isStatic: true,
        angle: -leftWallAngle,
        render: { visible: false }
      }
    );
    this.walls.push(leftWall, rightWall);
    Matter.Composite.add(this.engine.world, this.walls);
  }
  removeAllBalls() {
    Matter.Composite.allBodies(this.engine.world).forEach((body) => {
      if (body.collisionFilter.category === PlinkoEngine.BALL_CATEGORY) {
        Matter.Composite.remove(this.engine.world, body);
      }
    });
    betAmountOfExistingBalls.set({});
  }
}
const plinkoEngine = writable(null);
const betAmount = writable(1);
const betAmountOfExistingBalls = writable({});
const rowCount = writable(16);
const riskLevel = writable(RiskLevel.MEDIUM);
const winRecords = writable([]);
const totalProfitHistory = writable([0]);
const balance = writable(200);
derived(
  rowCount,
  ($rowCount) => {
    const binCount = $rowCount + 1;
    const isBinsEven = binCount % 2 === 0;
    const redToYellowLength = Math.ceil(binCount / 2);
    const redToYellowBg = interpolateRgbColors(
      binColor.background.red,
      binColor.background.yellow,
      redToYellowLength
    ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);
    const redToYellowShadow = interpolateRgbColors(
      binColor.shadow.red,
      binColor.shadow.yellow,
      redToYellowLength
    ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);
    return {
      background: [...redToYellowBg, ...redToYellowBg.toReversed().slice(isBinsEven ? 0 : 1)],
      shadow: [...redToYellowShadow, ...redToYellowShadow.toReversed().slice(isBinsEven ? 0 : 1)]
    };
  }
);
const binProbabilities = derived([winRecords, rowCount], ([$winRecords, $rowCount]) => {
  const occurrences = countValueOccurrences($winRecords.map(({ binIndex }) => binIndex));
  const probabilities = {};
  for (let i = 0; i < $rowCount + 1; ++i) {
    probabilities[i] = occurrences[i] / $winRecords.length || 0;
  }
  return probabilities;
});
const CircleNotch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["weight", "color", "size", "mirrored"]);
  const { weight: ctxWeight, color: ctxColor, size: ctxSize, mirrored: ctxMirrored, ...restCtx } = getContext("iconCtx") || {};
  let { weight = ctxWeight ?? "regular" } = $$props;
  let { color = ctxColor ?? "currentColor" } = $$props;
  let { size = ctxSize ?? "1em" } = $$props;
  let { mirrored = ctxMirrored || false } = $$props;
  if ($$props.weight === void 0 && $$bindings.weight && weight !== void 0)
    $$bindings.weight(weight);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.mirrored === void 0 && $$bindings.mirrored && mirrored !== void 0)
    $$bindings.mirrored(mirrored);
  return `  <svg${spread(
    [
      { xmlns: "http://www.w3.org/2000/svg" },
      { width: escape_attribute_value(size) },
      { height: escape_attribute_value(size) },
      { fill: escape_attribute_value(color) },
      {
        transform: escape_attribute_value(mirrored ? "scale(-1, 1)" : void 0)
      },
      { viewBox: "0 0 256 256" },
      escape_object(restCtx),
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}<rect width="256" height="256" fill="none"></rect>${weight === "bold" ? `<path d="M236,128a108,108,0,0,1-216,0c0-42.52,24.73-81.34,63-98.9A12,12,0,1,1,93,50.91C63.24,64.57,44,94.83,44,128a84,84,0,0,0,168,0c0-33.17-19.24-63.43-49-77.09A12,12,0,1,1,173,29.1C211.27,46.66,236,85.48,236,128Z"></path>` : `${weight === "duotone" ? `<path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path><path d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"></path>` : `${weight === "fill" ? `<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,176A72,72,0,0,1,92,65.64a8,8,0,0,1,8,13.85,56,56,0,1,0,56,0,8,8,0,0,1,8-13.85A72,72,0,0,1,128,200Z"></path>` : `${weight === "light" ? `<path d="M230,128a102,102,0,0,1-204,0c0-40.18,23.35-76.86,59.5-93.45a6,6,0,0,1,5,10.9C58.61,60.09,38,92.49,38,128a90,90,0,0,0,180,0c0-35.51-20.61-67.91-52.5-82.55a6,6,0,0,1,5-10.9C206.65,51.14,230,87.82,230,128Z"></path>` : `${weight === "regular" ? `<path d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"></path>` : `${weight === "thin" ? `<path d="M228,128a100,100,0,0,1-200,0c0-39.4,22.9-75.37,58.33-91.63a4,4,0,1,1,3.34,7.27C57.07,58.6,36,91.71,36,128a92,92,0,0,0,184,0c0-36.29-21.07-69.4-53.67-84.36a4,4,0,1,1,3.34-7.27C205.1,52.63,228,88.6,228,128Z"></path>` : `${escape((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`}`}`}`}`}`}</svg>`;
});
var stores = {
  local: {},
  session: {}
};
function getStorage(type) {
  return type === "local" ? localStorage : sessionStorage;
}
function persisted(key, initialValue, options) {
  var _a, _b, _c, _d, _e, _f;
  if (options == null ? void 0 : options.onError)
    console.warn("onError has been deprecated. Please use onWriteError instead");
  const serializer = (_a = options == null ? void 0 : options.serializer) != null ? _a : JSON;
  const storageType = (_b = options == null ? void 0 : options.storage) != null ? _b : "local";
  const syncTabs = (_c = options == null ? void 0 : options.syncTabs) != null ? _c : true;
  const onWriteError = (_e = (_d = options == null ? void 0 : options.onWriteError) != null ? _d : options == null ? void 0 : options.onError) != null ? _e : (e) => console.error(`Error when writing value from persisted store "${key}" to ${storageType}`, e);
  const onParseError = (_f = options == null ? void 0 : options.onParseError) != null ? _f : (newVal, e) => console.error(`Error when parsing ${newVal ? '"' + newVal + '"' : "value"} from persisted store "${key}"`, e);
  const browser = typeof window !== "undefined" && typeof document !== "undefined";
  const storage = browser ? getStorage(storageType) : null;
  function updateStorage(key2, value) {
    try {
      storage == null ? void 0 : storage.setItem(key2, serializer.stringify(value));
    } catch (e) {
      onWriteError(e);
    }
  }
  function maybeLoadInitial() {
    const json = storage == null ? void 0 : storage.getItem(key);
    if (json) {
      try {
        return serializer.parse(json);
      } catch (e) {
        onParseError(json, e);
      }
    }
    return initialValue;
  }
  if (!stores[storageType][key]) {
    const initial = maybeLoadInitial();
    const store = writable(initial, (set2) => {
      if (browser && storageType == "local" && syncTabs) {
        const handleStorage = (event) => {
          if (event.key === key) {
            let newVal;
            try {
              newVal = event.newValue ? serializer.parse(event.newValue) : null;
            } catch (e) {
              onParseError(event.newValue, e);
              return;
            }
            set2(newVal);
          }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
      }
    });
    const { subscribe: subscribe2, set } = store;
    stores[storageType][key] = {
      set(value) {
        set(value);
        updateStorage(key, value);
      },
      update(callback) {
        return store.update((last) => {
          const value = callback(last);
          updateStorage(key, value);
          return value;
        });
      },
      subscribe: subscribe2
    };
  }
  return stores[storageType][key];
}
const isAnimationOn = persisted(LOCAL_STORAGE_KEY.SETTINGS.ANIMATION, true);
const BinsRow = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isAnimationOn, $$unsubscribe_isAnimationOn;
  let $winRecords, $$unsubscribe_winRecords;
  let $plinkoEngine, $$unsubscribe_plinkoEngine;
  let $rowCount, $$unsubscribe_rowCount;
  let $riskLevel, $$unsubscribe_riskLevel;
  $$unsubscribe_isAnimationOn = subscribe(isAnimationOn, (value) => $isAnimationOn = value);
  $$unsubscribe_winRecords = subscribe(winRecords, (value) => $winRecords = value);
  $$unsubscribe_plinkoEngine = subscribe(plinkoEngine, (value) => $plinkoEngine = value);
  $$unsubscribe_rowCount = subscribe(rowCount, (value) => $rowCount = value);
  $$unsubscribe_riskLevel = subscribe(riskLevel, (value) => $riskLevel = value);
  let binAnimations = [];
  function playAnimation(binIndex) {
    if (!$isAnimationOn) {
      return;
    }
    const animation = binAnimations[binIndex];
    animation.cancel();
    animation.play();
  }
  {
    {
      if ($winRecords.length) {
        const lastWinBinIndex = $winRecords[$winRecords.length - 1].binIndex;
        playAnimation(lastWinBinIndex);
      }
    }
  }
  $$unsubscribe_isAnimationOn();
  $$unsubscribe_winRecords();
  $$unsubscribe_plinkoEngine();
  $$unsubscribe_rowCount();
  $$unsubscribe_riskLevel();
  return ` <div class="flex h-[clamp(10px,0.352px+2.609vw,16px)] w-full justify-center lg:h-7">${$plinkoEngine ? `<div class="flex gap-[1%]"${add_styles({
    "width": `${($plinkoEngine.binsWidthPercentage ?? 0) * 100}%`
  })}>${each(binPayouts[$rowCount][$riskLevel], (payout, binIndex) => {
    return ` <div class="flex min-w-0 flex-1 items-center justify-center rounded-sm text-[clamp(6px,2.784px+0.87vw,8px)] font-bold text-gray-950 shadow-[0_2px_var(--shadow-color)] lg:rounded-md lg:text-[clamp(10px,-16.944px+2.632vw,12px)] lg:shadow-[0_3px_var(--shadow-color)]"${add_styles({
      "background-color": binColorsByRowCount[$rowCount].background[binIndex],
      "--shadow-color": binColorsByRowCount[$rowCount].shadow[binIndex]
    })}>${escape(payout)}${escape(payout < 100 ? "×" : "")} </div>`;
  })}</div>` : ``}</div>`;
});
const LastWins = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let lastWins;
  let $winRecords, $$unsubscribe_winRecords;
  $$unsubscribe_winRecords = subscribe(winRecords, (value) => $winRecords = value);
  let { winCount = 4 } = $$props;
  if ($$props.winCount === void 0 && $$bindings.winCount && winCount !== void 0)
    $$bindings.winCount(winCount);
  lastWins = $winRecords.slice(-winCount).toReversed();
  $$unsubscribe_winRecords();
  return ` <div class="flex w-[clamp(1.5rem,0.893rem+2.857vw,2rem)] flex-col overflow-hidden rounded-sm text-[clamp(8px,5.568px+0.714vw,10px)] md:rounded-md lg:w-12 lg:text-sm"${add_styles({ "aspect-ratio": `1 / ${winCount}` })}>${each(lastWins, ({ binIndex, rowCount: rowCount2, payout: { multiplier } }) => {
    return `<div class="flex aspect-square items-center justify-center font-bold text-gray-950"${add_styles({
      "background-color": binColorsByRowCount[rowCount2].background[binIndex]
    })}>${escape(multiplier)}${escape(multiplier < 100 ? "×" : "")} </div>`;
  })}</div>`;
});
const Plinko = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $plinkoEngine, $$unsubscribe_plinkoEngine;
  $$unsubscribe_plinkoEngine = subscribe(plinkoEngine, (value) => $plinkoEngine = value);
  const { WIDTH, HEIGHT } = PlinkoEngine;
  $$unsubscribe_plinkoEngine();
  return `<div class="relative bg-gray-900"><div class="mx-auto flex h-full flex-col px-4 pb-4"${add_styles({ "max-width": `${WIDTH}px` })}><div class="relative w-full"${add_styles({ "aspect-ratio": `${WIDTH} / ${HEIGHT}` })}>${$plinkoEngine === null ? `<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">${validate_component(CircleNotch, "CircleNotch").$$render(
    $$result,
    {
      class: "size-20 animate-spin text-slate-600",
      weight: "bold"
    },
    {},
    {}
  )}</div>` : ``} <canvas${add_attribute("width", WIDTH, 0)}${add_attribute("height", HEIGHT, 0)} class="absolute inset-0 h-full w-full"></canvas></div> ${validate_component(BinsRow, "BinsRow").$$render($$result, {}, {}, {})}</div> <div class="absolute right-[5%] top-1/2 -translate-y-1/2">${validate_component(LastWins, "LastWins").$$render($$result, {}, {}, {})}</div></div>`;
});
export {
  BetMode as B,
  Plinko as P,
  RiskLevel as R,
  betAmount as a,
  balance as b,
  convertScale as c,
  betAmountOfExistingBalls as d,
  rowCount as e,
  formatCurrency as f,
  rowCountOptions as g,
  binProbabilities as h,
  isAnimationOn as i,
  binProbabilitiesByRowCount as j,
  dotProduct as k,
  binPayouts as l,
  plinkoEngine as p,
  riskLevel as r,
  totalProfitHistory as t,
  winRecords as w
};
