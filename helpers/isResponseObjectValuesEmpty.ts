export function isResponseObjectValuesEmpty(obj: any): boolean {
  return Object.values(obj).every(
    (v) =>
      v === "" ||
      v === null ||
      v === undefined ||
      (typeof v === "string" && v.trim() === ""),
  );
}
