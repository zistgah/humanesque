#!/usr/bin/env node
import { createVfs } from "../runtime/vfs.js";
import { createShell } from "../runtime/shell.js";
const sh = createShell(createVfs());
let n = 0, fail = 0;
function check(name, got, expect) {
  n++;
  const g = String(got).trim();
  const e = String(expect).trim();
  if (g !== e) { fail++; console.log("FAIL", name, JSON.stringify(g), "!=", JSON.stringify(e)); }
  else console.log("ok  ", name);
}
sh.bash("cd /home/panini");
check("pwd", sh.bash("pwd"), "/home/panini");
check("ls has readme", sh.bash("ls").includes("readme.txt"), "true");
check("echo redirect", (sh.bash('echo "नमस्ते" > /tmp/a.txt'), sh.bash("cat /tmp/a.txt")), "नमस्ते");
check("cd missing", sh.bash("cd /no/such"), "bash: cd: /no/such: No such file or directory");
check("unknown", sh.bash("frobnicate"), "frobnicate: command not found");
check("whoami", sh.bash("whoami"), "panini");
console.log(fail ? `FAILED ${fail}/${n}` : `PASSED ${n}/${n}`);
process.exit(fail ? 1 : 0);
