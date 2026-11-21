export function workflowEventParams(event = {}) {
  const payload = event?.payload;
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return payload;
  }
  if (typeof payload === "string") {
    try {
      const parsed = JSON.parse(payload);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}
