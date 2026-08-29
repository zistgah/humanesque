# CONFIG.md — the zistgah/dome configuration schema

Configuration arrives from two places and **deep-merges** (file wins, key by key):

1. `window.ZISTGAH_DOME = {…}` — a JS object defined **before** `dome.js` loads.
   This is where **functions** live (`display`, `displays[].onPick`, `displays[].tip`).
2. `dome.config.json` beside the page — fetched **before boot**. Data only.
   Set `window.ZISTGAH_DOME.configUrl` to another path, or `false` to skip the fetch.

Unconfigured, the dome is the zistgah.org landing, byte-for-byte in intent.

## Keys

### Content (below the fold; the dome scrolls out to it)
```jsonc
"domains": [["Title","Paragraph"], …],
"marks":   { "key": "<svg path fragments>", … },      // merged over the defaults
"art":     [["Card title","markKey","Caption"], …],   // exhibit cards with ⟡ Seed AI
"threads": [["Title","Paragraph",[["link text","url"],…]], …]
```

### Hall furniture
```jsonc
"pillars":      ["THREE","RIM","INSCRIPTIONS"],
"exhibitNames": ["Four","Pedestal","Sculpture","Names"],
"exhibitSubs":  { "Name": "hover-card caption", … }
```

### Flight
```jsonc
"flight": { "spawn": { "zone": "space",        // "dome" | "space" | any world id
                       "pos":  [0, 20, 26],     // cinematic start at a distance
                       "yaw":  3.14159 } },
"flightPatch": { "rate": 2.2, "drag": 0.62 }    // shallow-merged over ZP.flight
```
Sensitivities and gravity are **user settings** (⚙ → Flight), persisted under the shared
`zistgah-scene` key — see `FLIGHT.md`.

### Worlds (see WORLDS.md)
```jsonc
"worlds": {
  "patch": [ { "id": "mars", "gravity": 0.38 } ],           // amend canon in place
  "add":   [ { "id": "ceres", "label": "…", "r": 8, "at": [-150,92,60],
               "gravity": 0.029, "tint": 9411237, "atmo": 3162202,
               "habitat": { "domeR": 4.5, "embodiment": "lander" } },
             { "id": "station-a1", "kind": "station", "r": 6, "at": [64,112,-44],
               "gravity": 0, "habitat": { "domeR": 3.4, "embodiment": "lander" } } ]
}
```
`worlds` may also be a plain array, replacing the canon outright. Colours are decimal
ints (JSON has no hex literals). `kind:"station"` renders a torus-and-spokes body
instead of a planet; its habitat floor sits at `0.30·r`.

### Displays
```jsonc
"displays": [ { "type": "pointcloud",
                "data": { "families":[…], "layers":[…], "nodes":[…] },  // or supply from JS
                "yBase": 4.3, "ySpan": 2.1,    // the cluster band under the oculus
                "size": 0.055, "pick": 0.075,  // point size · raycast threshold
                "axis": true } ]
```
`onPick(node, layerId)` and `tip(meta, lineageString)` are functions → JS side only.
The point-cloud data schema is exactly FAKIR's `data/lattice.json`: `families[{id,label,
hue,counts,levels}]`, `layers[{id,name}]`, `nodes[{f,code,name,level,parent}]`. Leaves are
the deepest level per family; every leaf × layer becomes one individually scattered,
individually floating, individually clickable point (the ilm.codes/explore technique).
Picking is **window-level** — `#gl` is `pointer-events:none` by design.

### Viewer's gallery (floor) and video screens (wall)
```jsonc
"gallery": { "title": "…", "images": ["a.png", …], "slots": 5,
             "intervalS": 18, "radius": 7.4, "y": 1.35 },
"videos":  { "items": [ { "id": "YOUTUBE_ID", "title": "…" } ], "radius": 8.5, "y": 3.3 }
```
Gallery frames stand on the floor and rotate through `images` round-robin. Video
screens show the thumbnail in-scene; clicking opens an overlay player
(`youtube-nocookie.com` embed) above the dome — WebGL cannot texture a cross-origin
iframe, so playback is an overlay by design. Same-origin gallery images texture
directly; cross-origin images need CORS.

### Misc
```jsonc
"drone":     { "id": "abhishek-1" },   // stamped into the 10 Hz emitter (API.md)
"configUrl": "path/or/false"
```
© 1993–2026 Abhishek Choudhary · AyeAI.
