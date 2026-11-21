function normalize(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function explicitPlanningOnly(raw) {
  const withoutNegatedLabels = raw
    .replace(/\bnot (?:a |an )?read[- /]?only or planning objective\b/g, "")
    .replace(/\bnot (?:a |an )?planning or read[- /]?only objective\b/g, "")
    .replace(/\bnot (?:a |an )?(?:read[- /]?only|planning) objective\b/g, "");

  return /\bread\s*\/\s*plan only\b/.test(withoutNegatedLabels) ||
    /\bread[- ]only(?: mode)?\b(?=\s*(?:$|[:;,.]))/.test(withoutNegatedLabels) ||
    /\b(?:plan|planning) only\b/.test(withoutNegatedLabels) ||
    /\b(?:this|the) (?:task|objective|pass) is (?:a |an )?(?:read[- /]?only|plan(?:ning)?[- ]only)\b/.test(withoutNegatedLabels);
}

function blanketMutationProhibition(raw) {
  return /\b(?:do not|don't|must not|never) (?:modify|change|edit|write to|touch|append to|append|insert into|insert) (?!any other\b|other\b|unrelated\b)(?:the )?(?:repository|repo|files?|source|codebase|code)\b(?!\s+(?:modes?|authority))/.test(raw) ||
    /\bno (?:repository|file|source|code) (?:changes?|edits?|mutations?)\b/.test(raw);
}

export function objectiveAllowsMutation(rawText) {
  const raw = normalize(rawText);
  if (explicitPlanningOnly(raw) || blanketMutationProhibition(raw)) return false;
  return true;
}

export function objectiveHasConcreteChange(rawText) {
  const raw = normalize(rawText);
  if (/prepare (the )?next safe code[- ]change plan|inspect .*prepare .*plan|identify .*prepare .*plan/.test(raw)) return false;
  return /\b(add|remove|change|edit|append|insert|fix|update|replace|rename|improve|make|build|implement|execute|reconcile|hide|show|move|resize|correct|clean|simplify)\b/.test(raw);
}

export function codeChangeExecutionIntent(rawText, targetFiles = []) {
  const mutationAuthorized = objectiveAllowsMutation(rawText);
  const concreteChange = objectiveHasConcreteChange(rawText);
  const hasTargetFiles = Array.isArray(targetFiles) && targetFiles.length > 0;
  const executionReady = Boolean(mutationAuthorized && concreteChange && hasTargetFiles);
  const blocker = !mutationAuthorized
    ? "objective_explicitly_prohibits_mutation"
    : !concreteChange
      ? "objective_requests_planning_but_does_not_specify_a_concrete_change"
      : !hasTargetFiles
        ? "no_safe_target_files_identified"
        : null;

  return {
    mutation_authorized: mutationAuthorized,
    concrete_change_requested: concreteChange,
    execution_ready: executionReady,
    blocker,
    next_capability: executionReady ? "code.change.execute" : "objective.change_specify"
  };
}
