export const COUNTRY_ORIGIN_OPTIONS = [
  { value: "AT", label: "Austria" },
  { value: "DE", label: "Deutschland" },
  { value: "CN", label: "China" },
  { value: "VN", label: "VietNam" },
];
export function getCountryLabelDE(code?: string) {
  if (!code) return "-";

  return (
    COUNTRY_ORIGIN_OPTIONS.find((item) => item.value === code.toUpperCase())
      ?.label ?? code
  );
}
