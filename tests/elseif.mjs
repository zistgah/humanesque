#!/usr/bin/env node
import { runSource } from "../runtime/interpreter.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let n = 0, fail = 0;
async function check(name, src, expect) {
  n++;
  const r = await runSource(src, name + ".pni");
  const v = r.result?.value ?? r.result;
  if (v !== expect) { fail++; console.log("FAIL", name, v); }
  else console.log("ok  ", name);
}

await check("ELSEIF keyword", `
FUNCTION grade(n)
    IF n >= 90
        RETURN "A"
    ELSEIF n >= 50
        RETURN "B"
    ELSE
        RETURN "C"
    END
END
FUNCTION main()
    RETURN grade(50)
END
`, "B");

await check("nested ELSE IF (selfhost shape)", `
FUNCTION lex(ch)
    IF ch == " "
        RETURN "space"
    ELSE
        IF ch >= "0"
            RETURN "digit"
        ELSE
            RETURN "other"
        END
    END
END
FUNCTION main()
    RETURN lex("4")
END
`, "digit");

const self = fs.readFileSync(path.join(root, "examples/selfhost_lexer.pni"), "utf8");
n++;
try {
  const r = await runSource(self, "selfhost_lexer.pni");
  const v = r.result?.value ?? r.result;
  if (!(v > 0) || !r.interpreter.runtime.prints.includes("FUNCTION")) {
    fail++; console.log("FAIL selfhost", v, r.interpreter.runtime.prints);
  } else console.log("ok   selfhost_lexer", v);
} catch (e) {
  fail++; console.log("FAIL selfhost exception", e.message);
}

console.log(fail ? `FAILED ${fail}/${n}` : `PASSED ${n}/${n}`);
process.exit(fail ? 1 : 0);
