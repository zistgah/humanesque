import crypto from "node:crypto";

export function stampArtifact(content, meta = {}) {
  const bytes = Buffer.from(String(content), "utf8");
  const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  return {
    kind: "PANINI.ArtifactStamp",
    sha256,
    bytes: bytes.length,
    ots: {
      protocol: "OpenTimestamps",
      status: "PENDING_CALENDAR",
      note: "GitHub Pages has no stamper. Download this receipt and submit to a public OTS calendar.",
      digest: sha256,
    },
    misty: {
      doi_field: meta.doi || null,
      status: meta.doi ? "BOUND" : "UNBOUND",
    },
    epistemic_status: "PROPOSED",
    created_at: new Date().toISOString(),
    meta,
  };
}
