// Fixed choices used by admin forms (safe to import from client components).

export const MILESTONE_PHASES = ["Ausbildung", "Professional developer", "Full-stack engineer"] as const;

export const PROJECT_SIZES = [
  { value: "featured", label: "Featured case study" },
  { value: "main", label: "Main (large card)" },
  { value: "compact", label: "Compact (small card)" },
  { value: "more", label: "More on GitHub (list)" },
] as const;

export const PROJECT_STATUSES = [
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Draft" },
  { value: "HIDDEN", label: "Hidden" },
] as const;

export const EDUCATION_KINDS = [
  { value: "AUSBILDUNG", label: "Ausbildung" },
  { value: "DEGREE", label: "Degree" },
] as const;

export const CERTIFICATE_KINDS = [
  { value: "RECOGNITION", label: "Recognition (event, award)" },
  { value: "COURSE", label: "Course" },
] as const;
