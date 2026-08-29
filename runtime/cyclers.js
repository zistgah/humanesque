/** Cycler / GENIE / FAKIR / CHARBAGH runtime abstractions. */

export const StageStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  APPROVED: "APPROVED",
  FAILED: "FAILED",
};

export class CyclerInstance {
  constructor(name, spec = {}) {
    this.name = name;
    this.purpose = spec.purpose || "";
    this.stages = spec.stages || [];
    this.index = 0;
    this.status = StageStatus.PENDING;
    this.log = [];
    this.checkpointName = null;
  }

  current() {
    return this.stages[this.index] || null;
  }

  advance() {
    this.log.push({ at: new Date().toISOString(), from: this.current(), action: "advance" });
    if (this.index < this.stages.length - 1) this.index += 1;
    this.status = StageStatus.ACTIVE;
    return this.current();
  }

  checkpoint(store, name) {
    this.checkpointName = name;
    store.checkpoint(name, { name: this.name, index: this.index, status: this.status });
    return name;
  }
}

export function softwareDevelopmentCycler() {
  return new CyclerInstance("SoftwareDevelopment", {
    purpose: "Take incomplete intent through verified deliverables.",
    stages: [
      "INTENT", "REQUIREMENTS", "ARCHITECTURE", "DESIGN",
      "IMPLEMENTATION", "VERIFICATION", "RELEASE",
    ],
  });
}

export const GENIE_OPERATIONS = [
  "CONCEIVE", "OBSERVE", "IMAGINE", "ASSOCIATE", "TRANSFORM",
  "COMBINE", "CONTRAST", "ABSTRACT", "CONCRETIZE", "NARRATE",
  "DRAMATIZE", "VISUALIZE", "CHARACTERIZE", "SPATIALIZE",
  "MUSICALIZE", "EMBODY", "ITERATE", "CRITIQUE", "REMIX",
  "SERIALIZE", "PUBLISH",
];

export function elevate(cycler) {
  return {
    kind: "GENIE",
    source: cycler.name,
    operations: GENIE_OPERATIONS,
    compose: (...cyclers) => ({ kind: "GENIE", sources: cyclers.map((c) => c.name) }),
  };
}

export const FAKIR = {
  kind: "CYCLER",
  name: "FAKIR",
  purpose: "Guide sovereigns through domainal reality and mission.",
  method: [
    "RETRIEVE", "READ", "INTERPRET", "CORRELATE", "VERIFY",
    "EVIDENCE", "GOVERN", "PRESERVE", "GUIDE", "TRANSFORM",
  ],
  principle: "RETRIEVE_DONT_RECONSTRUCT",
  sources: {
    ISIC: "UN economic activity domains",
    ISCO: "ILO occupation/work domains",
    ISCED: "UNESCO UIS education/learning domains",
  },
};

export const CHARBAGH = {
  kind: "CYCLER",
  name: "CHARBAGH",
  purpose: "Humanesque triage and wayfinding.",
  routes: ["EXISTING_ESTATE", "COMPOSITE_ESTATES", "DERIVE_ESTATES", "INVOKE_GENIE"],
};
