/* llama.cpp on the VFS. @wllama/wllama is llama.cpp → WASM (MIT).
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
(function (g) {
  var inst = null;
  var pending = null;
  var currentId = "15M";
  var MODELS = {
    "15M": {
      name: "stories15M Q4_0",
      local: "models/stories15M.Q4_0.gguf",
      remote: "https://huggingface.co/ggml-org/models/resolve/main/tinyllamas/stories15M-q4_0.gguf"
    },
    "42M": {
      name: "stories42M Q4_0",
      local: "models/stories42M.Q4_0.gguf",
      remote: "https://huggingface.co/ggml-org/models/resolve/main/tinyllamas/stories42M-q4_0.gguf"
    },
    "110M": {
      name: "stories110M Q4_0",
      local: "models/stories110M.Q4_0.gguf",
      remote: "https://huggingface.co/ggml-org/models/resolve/main/tinyllamas/stories110M-q4_0.gguf"
    }
  };
  function root() {
    var s = document.querySelector("script[src*='engine/llm.js']");
    var src = (s && s.src) || (location.href.replace(/[^/]+$/, "") + "engine/llm.js");
    return src.replace(/engine\/llm\.js(?:\?.*)?$/, "");
  }
  function setModel(id) {
    if (!MODELS[id]) id = "15M";
    if (id !== currentId) {
      inst = null;
      pending = null;
      currentId = id;
    }
    return Promise.resolve(currentId);
  }
  function getWllama() {
    if (inst) return Promise.resolve(inst);
    if (pending) return pending;
    var R = root();
    var spec = MODELS[currentId] || MODELS["15M"];
    pending = import(R + "engine/wllama/index.js").then(function (mod) {
      var Wllama = mod.Wllama || mod.default;
      var w = new Wllama({
        "single-thread/wllama.wasm": R + "engine/wllama/wllama.wasm"
      }, { allowOffline: true });
      var local = R + spec.local;
      var remote = spec.remote;
      var opts = { n_ctx: currentId === "110M" ? 256 : 192, n_batch: 64 };
      return w.loadModelFromUrl(local, opts).catch(function () {
        return w.loadModelFromUrl(remote, opts);
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
        "models  stories15M / stories42M / stories110M  (ggml-org tinyllamas Q4_0)\n" +
        "current  " + (MODELS[currentId] && MODELS[currentId].name) + "\n" +
        "usage  llama-cli --version | llama-cli -p \"Once upon a time\" -n 16\n"
      );
    }
    var prompt = "Once upon a time", n = 16, i, modelFlag = null;
    for (i = 0; i < a.length; i++) {
      if ((a[i] === "-p" || a[i] === "--prompt") && a[i + 1]) prompt = a[++i];
      else if ((a[i] === "-n" || a[i] === "--n-predict") && a[i + 1]) n = Number(a[++i]);
      else if ((a[i] === "-m" || a[i] === "--model") && a[i + 1]) modelFlag = a[++i];
    }
    var p = Promise.resolve();
    if (modelFlag) {
      var id = "15M";
      if (/42/.test(modelFlag)) id = "42M";
      else if (/110/.test(modelFlag)) id = "110M";
      p = setModel(id);
    }
    return p.then(getWllama).then(function (w) {
      return w.createCompletion(prompt, { nPredict: n, sampling: { temp: 0.8, topK: 40 } });
    }).then(function (text) {
      return prompt + "\n" + String(text || "") + "\n";
    });
  }
  g.PANINI_LLM = { llamaCli: llamaCli, getWllama: getWllama, setModel: setModel, models: MODELS };
})(typeof window !== "undefined" ? window : globalThis);
