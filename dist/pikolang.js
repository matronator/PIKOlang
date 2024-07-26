var U = Object.defineProperty;
var B = (n) => {
  throw TypeError(n);
};
var W = (n, t, e) => t in n ? U(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var u = (n, t, e) => W(n, typeof t != "symbol" ? t + "" : t, e), j = (n, t, e) => t.has(n) || B("Cannot " + e);
var Q = (n, t, e) => t.has(n) ? B("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(n) : t.set(n, e);
var m = (n, t, e) => (j(n, t, "access private method"), e);
var o;
((n) => {
  ((t) => {
    t.Noop = " ", t.Pointer = "#", t.Plus = "+", t.Minus = "-", t.Multiply = "*", t.Divide = "/", t.Underscore = "_", t.Equals = "=", t.LessThan = "<", t.GreaterThan = ">", t.QuestionMark = "?", t.ExclamationMark = "!", t.Semicolon = ";", t.Colon = ":", t.Ampersand = "&", t.Tilde = "~", t.SingleQuote = "'", t.DoubleQuote = '"';
  })(n.Tokens || (n.Tokens = {})), ((t) => {
    t.RightArrow = ">", t.LeftArrow = "<", t.UpArrow = "^", t.DownArrow = "v";
  })(n.DirectionModifiers || (n.DirectionModifiers = {}));
})(o || (o = {}));
var T;
((n) => {
  function t(c) {
    return c === "#";
  }
  n.isPointer = t;
  function e(c) {
    return RegExp("^[a-zA-Z0-9]$").test(c);
  }
  n.isAlphaNum = e;
  function r(c) {
    return RegExp("^[0-9]$").test(c);
  }
  n.isDigit = r;
  function i(c) {
    return ["=", "<", ">", "!"].includes(c);
  }
  n.isComparisonOperator = i;
  function l(c) {
    return ["+", "-", "*", "/", "_"].includes(c);
  }
  n.isMathOperator = l;
})(T || (T = {}));
class G {
  constructor(t, e, r = "right") {
    u(this, "x");
    u(this, "y");
    u(this, "direction");
    u(this, "currentCell", " ");
    u(this, "stringMode", !1);
    u(this, "conditionMode", !1);
    u(this, "comparator");
    u(this, "comparisonOperator");
    u(this, "operator");
    u(this, "stack", 0);
    u(this, "stringStack", []);
    u(this, "outputStack", null);
    u(this, "stringModeInitializer");
    this.x = t, this.y = e, this.direction = r;
  }
}
var p, I, z, L, H, x;
class q {
  constructor(t) {
    Q(this, p);
    u(this, "program");
    u(this, "width");
    u(this, "height");
    u(this, "grid", []);
    u(this, "visualGrid", []);
    u(this, "pointer");
    u(this, "currentPoint", { x: 0, y: 0 });
    u(this, "outputRegister", null);
    this.program = t;
    let e = this.program.split(`
`);
    this.height = e.length, this.width = e.reduce((h, g) => Math.max(h, g.length), 0), e = e.map((h) => h.length < this.width ? h + " ".repeat(this.width - h.length) : h);
    const r = e;
    let i = 0, l = 0, c = 0, y = 0, k = !1;
    for (let h of r) {
      const g = [...h], M = [];
      for (let E of g) {
        if (T.isPointer(E)) {
          if (k)
            throw new SyntaxError("Multiple pointers found");
          k = !0, c = i, y = l;
          const D = { x: i, y: l, token: " " };
          M[i] = D, i++;
          continue;
        }
        const A = { x: i, y: l, token: E };
        M[i] = A, i++;
      }
      this.grid[l] = M, l++, i = 0;
    }
    this.visualGrid = this.grid.map((h) => h.map((g) => ({ ...g }))), this.pointer = new G(c, y, "right"), this.currentPoint = { x: c, y };
  }
  run() {
    let t = { done: !1, output: null };
    for (; !t.done; )
      t = this.step(t);
    console.log(t.output);
  }
  step(t) {
    if (t.done === !0) return t;
    this.move();
    const e = this.grid[this.pointer.y][this.pointer.x];
    let r = m(this, p, I).call(this, e);
    if (r || (r = m(this, p, z).call(this, e), r))
      return t;
    switch (e.token) {
      case o.Tokens.Semicolon:
        t.done = !0;
        break;
      case o.Tokens.Ampersand:
        this.outputRegister === null && (this.outputRegister = ""), this.pointer.stringStack.forEach((i) => {
          this.outputRegister += i;
        }), this.pointer.stringStack = [];
        break;
      case o.Tokens.Colon:
        console.log(this.outputRegister), this.outputRegister = null;
        break;
      case o.Tokens.Tilde:
        this.pointer.stringStack.length > 0 && (this.outputRegister === null && (this.outputRegister = ""), this.outputRegister += this.pointer.stringStack.pop());
        break;
      case o.Tokens.ExclamationMark:
        this.pointer.stack = 0, this.pointer.stringStack = [], this.outputRegister = null;
        break;
      case o.Tokens.SingleQuote:
      case o.Tokens.DoubleQuote:
        m(this, p, I).call(this, e);
        break;
      case o.DirectionModifiers.DownArrow:
        this.pointer.direction = "down";
        break;
      case o.DirectionModifiers.UpArrow:
        this.pointer.direction = "up";
        break;
      case o.DirectionModifiers.LeftArrow:
        this.pointer.direction = "left";
        break;
      case o.DirectionModifiers.RightArrow:
        this.pointer.direction = "right";
        break;
      case o.Tokens.Equals:
        console.log(this.pointer.stack);
        break;
      case o.Tokens.QuestionMark:
        this.pointer.conditionMode = !0;
        break;
      case o.Tokens.Plus:
      case o.Tokens.Minus:
      case o.Tokens.Multiply:
      case o.Tokens.Divide:
        this.pointer.operator ? m(this, p, H).call(this, e) : this.pointer.operator = e.token;
        break;
      case o.Tokens.Underscore:
        this.pointer.stack = Math.floor(this.pointer.stack);
        break;
      case o.Tokens.Noop:
        break;
      default:
        m(this, p, H).call(this, e);
        break;
    }
    return t.output = this.outputRegister ?? this.pointer.stack, t;
  }
  move() {
    const t = this.pointer.x, e = this.pointer.y;
    let r = this.pointer.currentCell;
    switch (this.visualGrid[e][t].token = r, this.pointer.direction) {
      case "up":
        this.pointer.y--, this.pointer.y < 0 && (this.pointer.y = this.height - 1);
        break;
      case "down":
        this.pointer.y++, this.pointer.y >= this.height && (this.pointer.y = 0);
        break;
      case "left":
        this.pointer.x--, this.pointer.x < 0 && (this.pointer.x = this.width - 1);
        break;
      case "right":
        this.pointer.x++, this.pointer.x >= this.width && (this.pointer.x = 0);
        break;
    }
    this.pointer.currentCell = this.grid[this.pointer.y][this.pointer.x].token, this.visualGrid[this.pointer.y][this.pointer.x].token = o.Tokens.Pointer, this.currentPoint = { x: this.pointer.x, y: this.pointer.y };
  }
}
p = new WeakSet(), I = function(t) {
  return this.pointer.stringMode ? t.token !== this.pointer.stringModeInitializer ? (this.pointer.stringStack.push(t.token), !0) : (this.pointer.stringMode = !1, this.pointer.stringModeInitializer = void 0, !0) : t.token === o.Tokens.SingleQuote || t.token === o.Tokens.DoubleQuote ? (this.pointer.stringMode = !0, this.pointer.stringModeInitializer = t.token, !0) : !1;
}, z = function(t) {
  return this.pointer.conditionMode ? T.isComparisonOperator(t.token) && !this.pointer.comparisonOperator ? (this.pointer.comparisonOperator = t.token, !0) : t.token === o.Tokens.QuestionMark && this.pointer.comparisonOperator ? (this.pointer.comparator || (this.pointer.comparator = 0), this.pointer.comparisonOperator === o.Tokens.Equals ? this.pointer.stack !== this.pointer.comparator && (this.pointer.direction = m(this, p, L).call(this, !1)) : this.pointer.comparisonOperator === o.Tokens.LessThan ? this.pointer.stack >= this.pointer.comparator && (this.pointer.direction = m(this, p, L).call(this, !0)) : this.pointer.comparisonOperator === o.Tokens.GreaterThan ? this.pointer.stack <= this.pointer.comparator && (this.pointer.direction = m(this, p, L).call(this, !1)) : this.pointer.comparisonOperator === o.Tokens.ExclamationMark && this.pointer.stack === this.pointer.comparator && (this.pointer.direction = m(this, p, L).call(this, !0)), this.pointer.conditionMode = !1, this.pointer.comparisonOperator = void 0, this.pointer.comparator = void 0, !0) : (T.isDigit(t.token) ? this.pointer.comparator = Number(t.token) : t.token !== o.Tokens.Noop && (this.pointer.comparator = t.token.charCodeAt(0)), !0) : !1;
}, L = function(t) {
  const e = ["up", "right", "down", "left"], r = this.pointer.direction, i = e.indexOf(r), l = t ? i - 1 : i + 1;
  return l < 0 ? e[3] : l > 3 ? e[0] : e[l];
}, H = function(t) {
  if (this.pointer.operator) {
    switch (this.pointer.operator) {
      case o.Tokens.Plus:
        this.pointer.stack += m(this, p, x).call(this, t);
        break;
      case o.Tokens.Minus:
        this.pointer.stack -= m(this, p, x).call(this, t);
        break;
      case o.Tokens.Multiply:
        this.pointer.stack *= m(this, p, x).call(this, t);
        break;
      case o.Tokens.Divide:
        this.pointer.stack /= m(this, p, x).call(this, t);
        break;
    }
    return this.pointer.operator = void 0, !0;
  }
  return this.pointer.stack = m(this, p, x).call(this, t), !0;
}, x = function(t) {
  return T.isDigit(t.token) ? Number(t.token) : t.token.charCodeAt(0);
};
class X {
  constructor(t = "console-output") {
    if (console.log.toDiv)
      return;
    function e(s) {
      return typeof s == "string" ? s : JSON.stringify(s);
    }
    const r = console.log.bind(console), i = console.error.bind(console), l = console.warn.bind(console), c = console.table ? console.table.bind(console) : null, y = "console-outer";
    function k(s) {
      const a = document.getElementById(t);
      let f = document.getElementById(s);
      return f || (f = document.createElement("fieldset"), f.id = s, a.appendChild(f)), f.style, f;
    }
    const h = function() {
      const a = k(y), f = document.createTextNode("Console Output"), S = document.createElement("div");
      S.id = "console-legend", S.appendChild(f), a.appendChild(S);
      const b = document.createElement("div");
      return b.id = "console-log-text", a.appendChild(b), b;
    }();
    function g() {
      const s = Array.prototype.slice.call(arguments, 0).map(e).join(" "), a = document.createElement("div");
      a.classList.add("log-row"), a.textContent = s, h.appendChild(a);
    }
    function M() {
      const s = document.getElementById(y);
      A(s), r.apply(null, arguments), g.apply(null, arguments);
    }
    console.log = M, console.log.toDiv = !0, console.error = function() {
      i.apply(null, arguments);
      const a = Array.prototype.slice.call(arguments, 0);
      a.unshift("ERROR:"), g.apply(null, a);
    }, console.warn = function() {
      l.apply(null, arguments);
      const a = Array.prototype.slice.call(arguments, 0);
      a.unshift("WARNING:"), g.apply(null, a);
    };
    function E(s, a) {
      const f = a.length, S = s.length, b = document.createElement("table");
      b.style.width = "100%", b.setAttribute("border", "1");
      const P = document.createElement("thead");
      let v = document.createElement("td");
      v.innerHTML = "Index", P.appendChild(v);
      for (let w = 0; w < f; w++)
        v = document.createElement("td"), v.innerHTML = a[w], P.appendChild(v);
      b.appendChild(P);
      for (let w = 0; w < S; w++) {
        const N = document.createElement("tr");
        v = document.createElement("td"), v.innerHTML = w, N.appendChild(v);
        for (let $ = 0; $ < f; $++)
          v = document.createElement("td"), v.innerHTML = s[w][a[$]], N.appendChild(v);
        b.appendChild(N);
      }
      document.getElementById("console-log-text").appendChild(b);
    }
    console.table = function() {
      typeof c == "function" && c.apply(null, arguments);
      const a = arguments[0];
      let f;
      typeof a[0] < "u" && (f = Object.keys(a[0])), E(a, f);
    }, window.addEventListener("error", function(s) {
      g("EXCEPTION:", s.message + `
  ` + s.filename, s.lineno + ":" + s.colno);
    });
    function A(s) {
      const a = window.getComputedStyle(s, null).backgroundColor;
      D(a) ? s.style.color = "rgba(255,255,255,1)" : s.style.color = "rgba(0,0,0,.61)";
    }
    function D(s) {
      const a = /rgb(?!a)?\((\d+).*?(\d+).*?(\d+)(?!.+?)?\)/.exec(s);
      return parseFloat(a[1]) + parseFloat(a[2]) + parseFloat(a[3]) < 3 * 256 / 2;
    }
  }
}
function Y() {
  const n = document.querySelectorAll("[data-dropdown]");
  n.forEach((t) => {
    const e = document.querySelector(`[data-dropdown-content=${t.dataset.dropdown}]`);
    t.addEventListener("click", () => {
      e.classList.toggle("hidden");
    }), e.querySelectorAll(".dropdown-item").forEach((i) => {
      i.addEventListener("click", () => {
        e.classList.add("hidden");
      });
    });
  }), document.body.addEventListener("click", (t) => {
    t.target.dataset.dropdown || n.forEach((e) => {
      document.querySelector(`[data-dropdown-content=${e.dataset.dropdown}]`).classList.add("hidden");
    });
  });
}
function _(...n) {
  const t = {};
  return n.forEach((e) => {
    const r = document.getElementById(e);
    r && (t[e] = r);
  }), t;
}
const J = [
  {
    name: "Hello, World!",
    code: `#  v

v  <
          >  "Helllo!"&;


>         ^  `
  },
  {
    name: "Conditions",
    code: `#  v

v  <
       >       >  "Helllo!"&;


>  8?>9?       ^  `
  },
  {
    name: "Math Operations",
    code: `#  v

v  <
        >      >  "Helllo!"&;


> 2+3?>4?      ^  `
  },
  {
    name: "Loop to 10",
    code: ` >?>9?;
     =
#1=  v
 +
 ^   <
`
  }
];
let d = {}, C, O = !1, R = !1;
document.addEventListener("DOMContentLoaded", () => {
  new X("console"), d = _("output", "outputOverlay", "input", "executeBtn", "runBtn", "debugBtn", "restartBtn", "speedRange", "speedText", "samples", "register", "stringRegister", "outputRegister", "direction", "stringMode", "conditionMode", "gridSize", "mathOperator"), Y();
  const n = d.output, t = d.outputOverlay, e = d.input;
  if (!n || !e || !t) return;
  const r = d.executeBtn, i = d.runBtn, l = d.speedRange, c = d.speedText, y = d.samples;
  J.forEach((g, M) => {
    const E = document.createElement("div");
    E.classList.add("dropdown-item"), E.textContent = `${M + 1}. ${g.name}`, E.addEventListener("click", () => {
      O = !1, R = !1, e.value = g.code, e.dispatchEvent(new Event("input"));
    }), y.appendChild(E);
  }), e.addEventListener("input", () => {
    n.textContent = e.value.replace(o.Tokens.Pointer, " "), t.textContent = e.value.replace(new RegExp(`[^${o.Tokens.Pointer}]`, "g"), " ");
  }), l == null || l.addEventListener("input", () => {
    c.value = l.value;
  }), ["input", "change", "blur"].forEach((g) => {
    c.addEventListener(g, () => {
      Number(c.value) >= Number(c.min) && Number(c.value) <= Number(c.max) && (l.value = c.value);
    });
  }), r == null || r.addEventListener("click", () => {
    new q(e.value).run();
  });
  let k, h;
  i == null || i.addEventListener("click", () => {
    O ? (clearTimeout(C), O = !1, i.textContent = R ? "▶️ Continue" : "🕐 Run") : (R || (k = new q(e.value), h = { done: !1, output: "" }, R = !0), C && clearTimeout(C), C = setTimeout(() => {
      h = F(h, k, Number(l.value)), Number(l.value);
    }), O = !0, i.textContent = "⏸️ Pause");
  });
});
function F(n, t, e) {
  var r;
  if (n = t.step(n), d.direction.innerHTML = `&${t.pointer.direction.charAt(0)}arr;`, d.stringMode.textContent = t.pointer.stringMode ? "ON" : "OFF", d.conditionMode.textContent = V(t), d.gridSize.textContent = `${t.width} x ${t.height}`, d.mathOperator.textContent = t.pointer.operator ?? "NULL", n.done)
    return clearTimeout(C), console.log(n.output), d.runBtn.textContent = "🕐 Run", R = !1, O = !1, n;
  {
    const i = d.outputOverlay;
    if (!i || !(i instanceof HTMLElement)) return n;
    i.innerHTML = "";
    for (let k = 0; k <= t.currentPoint.y; k++)
      k === t.currentPoint.y ? (i.innerHTML += " ".repeat(Math.max(t.currentPoint.x, 0)), i.innerHTML += `<span class="pointer pointer-${t.pointer.direction}">${o.Tokens.Pointer}</span>`) : i.textContent += `
`;
    const l = d.register, c = d.stringRegister, y = d.outputRegister;
    return l.textContent = t.pointer.stack.toString(), c.textContent = "[" + t.pointer.stringStack.join(", ") + "]", y.textContent = ((r = t.outputRegister) == null ? void 0 : r.toString()) ?? "NULL", C && clearTimeout(C), C = setTimeout(() => F(n, t, e), e), n;
  }
}
function V(n) {
  if (!n.pointer.conditionMode) return "OFF";
  const t = n.pointer.stack ?? "?", e = n.pointer.comparator ?? "?", r = n.pointer.comparisonOperator ?? "=";
  return `${t} ${r} ${e}`;
}
