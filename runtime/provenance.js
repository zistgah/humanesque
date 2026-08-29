export const EpistemicStatus = {
  RETRIEVED: "RETRIEVED",
  INFERRED: "INFERRED",
  PROPOSED: "PROPOSED",
  UNRESOLVED: "UNRESOLVED",
  VERIFIED: "VERIFIED",
  OBSERVED: "OBSERVED",
  SIMULATED: "SIMULATED",
  EXPERIMENTAL: "EXPERIMENTAL",
  FALSIFIED: "FALSIFIED",
};

export function stamp({ status, source, note } = {}) {
  return {
    status: status || EpistemicStatus.PROPOSED,
    source: source || "panini-bootstrap",
    note: note || null,
    at: new Date().toISOString(),
    implementation: "js-stage-0",
  };
}

export function canonicalizeClaim(claim) {
  if (!claim || claim.status == null) {
    return { ok: false, error: "untagged claim" };
  }
  if (!claim.provenance) {
    return { ok: false, error: "missing provenance" };
  }
  return { ok: true, value: claim };
}
