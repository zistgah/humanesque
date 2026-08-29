/** Execute PANINI IR produced by src/panini (Stage 4+). */

export class IrReturn {
  constructor(value) {
    this.value = value;
  }
}

export class IrVM {
  constructor(ir, options = {}) {
    this.ir = ir;
    this.functions = new Map();
    for (const fn of ir.functions || []) this.functions.set(fn.name, fn);
    this.prints = options.prints || [];
    this.stdout = options.stdout || process.stdout;
    this.maxSteps = options.maxSteps || 20_000_000;
    this.steps = 0;
  }

  bump() {
    this.steps += 1;
    if (this.steps > this.maxSteps) throw new Error("IR VM step limit exceeded");
  }

  call(name, args = []) {
    const fn = this.functions.get(name);
    if (!fn) throw new Error(`IR function not found: ${name}`);
    const env = Object.create(null);
    (fn.params || []).forEach((p, i) => {
      env[p] = args[i];
    });
    try {
      return this.execBody(fn.body || [], env);
    } catch (e) {
      if (e instanceof IrReturn) return e.value;
      throw e;
    }
  }

  execBody(body, env) {
    let last;
    for (const stmt of body || []) last = this.exec(stmt, env);
    return last;
  }

  exec(stmt, env) {
    this.bump();
    switch (stmt.op) {
      case "return":
        throw new IrReturn(this.eval(stmt.arg, env));
      case "assign":
        this.assign(stmt.target, this.eval(stmt.value, env), env);
        return;
      case "if":
        if (truthy(this.eval(stmt.test, env))) return this.execBody(stmt.then || [], env);
        return this.execBody(stmt.else || [], env);
      case "while":
        while (truthy(this.eval(stmt.test, env))) this.execBody(stmt.body || [], env);
        return;
      case "assert":
        if (!truthy(this.eval(stmt.test, env))) throw new Error("IR ASSERT failed");
        return true;
      case "expr":
        return this.eval(stmt.value, env);
      case "def":
        return;
      default:
        throw new Error(`unknown IR stmt ${stmt.op}`);
    }
  }

  assign(target, value, env) {
    if (target.op === "load") {
      env[target.name] = value;
      return;
    }
    if (target.op === "member") {
      const obj = this.eval(target.object, env);
      obj[target.property] = value;
      return;
    }
    if (target.op === "index") {
      const obj = this.eval(target.object, env);
      const idx = this.eval(target.index, env);
      obj[idx] = value;
      return;
    }
    throw new Error("bad assign target");
  }

  eval(node, env) {
    this.bump();
    if (node == null) return null;
    switch (node.op) {
      case "const":
        return node.value;
      case "load":
        if (Object.prototype.hasOwnProperty.call(env, node.name)) return env[node.name];
        if (this.functions.has(node.name)) {
          const name = node.name;
          return (...args) => this.call(name, args);
        }
        return this.builtin(node.name);
      case "bin":
        return this.bin(node.operator, this.eval(node.left, env), node, env);
      case "un": {
        const a = this.eval(node.arg, env);
        if (node.operator === "NOT") return !truthy(a);
        if (node.operator === "-") return -Number(a);
        return a;
      }
      case "call": {
        const callee = this.eval(node.callee, env);
        const args = (node.args || []).map((a) => this.eval(a, env));
        if (typeof callee === "function") return callee(...args);
        throw new Error(`not callable: ${JSON.stringify(node.callee)} => ${typeof callee}`);
      }
      case "list":
        return (node.elements || []).map((e) => this.eval(e, env));
      case "map": {
        const o = {};
        for (const e of node.entries || []) o[e.key] = this.eval(e.value, env);
        return o;
      }
      case "member": {
        const obj = this.eval(node.object, env);
        return obj == null ? undefined : obj[node.property];
      }
      case "index": {
        const obj = this.eval(node.object, env);
        const idx = this.eval(node.index, env);
        return obj == null ? undefined : obj[idx];
      }
      default:
        throw new Error(`unknown IR expr ${node.op}`);
    }
  }

  bin(op, l, node, env) {
    if (op === "AND") return truthy(l) ? this.eval(node.right, env) : l;
    if (op === "OR") return truthy(l) ? l : this.eval(node.right, env);
    const r = this.eval(node.right, env);
    switch (op) {
      case "+":
        if (Array.isArray(l) && Array.isArray(r)) return l.concat(r);
        if (Array.isArray(l)) return l.concat([r]);
        if (typeof l === "string" || typeof r === "string") return String(l) + String(r);
        return Number(l) + Number(r);
      case "-": return Number(l) - Number(r);
      case "*": return Number(l) * Number(r);
      case "/": return Number(l) / Number(r);
      case "%": return Number(l) % Number(r);
      case "==": return l === r;
      case "!=": return l !== r;
      case "<": return l < r;
      case ">": return l > r;
      case "<=": return l <= r;
      case ">=": return l >= r;
      default: throw new Error(`bad bin ${op}`);
    }
  }

  builtin(name) {
    const self = this;
    const table = {
      LEN: (x) => (x == null ? 0 : x.length),
      INT: (x) => Number(x) | 0,
      STR: (x) => String(x),
      SLICE: (s, a, b) => s.slice(a, b == null ? undefined : b),
      APPEND: (list, item) => {
        list.push(item);
        return list;
      },
      HASKEY: (m, k) => Object.prototype.hasOwnProperty.call(m, String(k)),
      QUOTE: () => '"',
      NEWLINE: () => "\n",
      BACKSLASH: () => "\\",
      TAB: () => "\t",
      CR: () => "\r",
      PRINT: (...args) => {
        const line = args.map(String).join(" ");
        self.prints.push(line);
        self.stdout.write(line + "\n");
        return null;
      },
      TRUE: true,
      FALSE: false,
      NULL: null,
    };
    if (!(name in table)) throw new Error(`undefined ${name}`);
    return table[name];
  }
}

function truthy(v) {
  if (v == null || v === false) return false;
  if (v === 0 || v === "") return false;
  if (Array.isArray(v) && v.length === 0) return false;
  return true;
}

export function runIrCompile(ir, source) {
  const vm = new IrVM(ir);
  return { result: vm.call("compile", [source]), vm };
}
