/* llama.cpp on the VFS. @wllama/wllama is llama.cpp → WASM (MIT).
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
(function (g) {
  var inst = null;
  var pending = null;
  function root() {
    var s = document.querySelector("script[src*='engine/llm.js']");
    var src = (s && s.src) || (location.href.replace(/[^/]+$/, "") + "engine/llm.js");
    return src.replace(/engine\/llm\.js(?:\?.*)?$/, "");
  }
  function getWllama() {
    if (inst) return Promise.resolve(inst);
    if (pending) return pending;
    var R = root();
    pending = import(R + "engine/wllama/index.js").then(function (mod) {
      var Wllama = mod.Wllama || mod.default;
      var w = new Wllama({
        "single-thread/wllama.wasm": R + "engine/wllama/wllama.wasm"
      }, { allowOffline: true });
      var local = R + "models/stories15M.Q4_0.gguf";
      var remote = "https://huggingface.co/ggml-org/models/resolve/main/tinyllamas/stories15M-q4_0.gguf";
      return w.loadModelFromUrl(local, { n_ctx: 128, n_batch: 64 }).catch(function () {
        return w.loadModelFromUrl(remote, { n_ctx: 128, n_batch: 64 });
      }).then(function () {
        inst = w;
        return w;
      });
    });
    return pending;
  }
  function llamaCli(argv) {
    var a = argv || [];
    if (!a.length || a[0] === "--version" || a[0] === "-h") {
      return Promise.resolve(
        "llama-cli  wllama 2.3.1  (llama.cpp WASM, single-thread)\n" +
        "model  models/stories15M.Q4_0.gguf\n" +
        "usage  llama-cli --version | llama-cli -p \"Once upon a time\" -n 16\n"
      );
    }
    var prompt = "Once upon a time", n = 16, i;
    for (i = 0; i < a.length; i++) {
      if ((a[i] === "-p" || a[i] === "--prompt") && a[i + 1]) prompt = a[++i];
      else if ((a[i] === "-n" || a[i] === "--n-predict") && a[i + 1]) n = Number(a[++i]);
    }
    return getWllama().then(function (w) {
      return w.createCompletion(prompt, { nPredict: n, sampling: { temp: 0 } });
    }).then(function (text) {
      return prompt + "\n" + String(text || "") + "\n";
    });
  }
  g.PANINI_LLM = { llamaCli: llamaCli, getWllama: getWllama };
})(typeof window !== "undefined" ? window : globalThis);
