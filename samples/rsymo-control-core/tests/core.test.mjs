import test from 'node:test';
import assert from 'node:assert/strict';
import { objectiveAllowsMutation, objectiveHasConcreteChange, codeChangeExecutionIntent } from '../objective-intent.js';
import { workflowEventParams } from '../workflow-payload.js';

test('explicit planning only prevents execution eligibility', () => {
  const result = codeChangeExecutionIntent('This task is planning only: plan the edit', ['src/example.js']);
  assert.equal(result.execution_ready, false);
  assert.equal(result.blocker, 'objective_explicitly_prohibits_mutation');
});
test('explicit instruction not to edit prevents execution eligibility', () => {
  const result = codeChangeExecutionIntent('Do not modify the repository. Review it.', ['src/example.js']);
  assert.equal(result.mutation_authorized, false);
  assert.equal(result.execution_ready, false);
});
test('no source target results in a blocked classification', () => {
  const result = codeChangeExecutionIntent('Fix the login UI', []);
  assert.equal(result.execution_ready, false);
  assert.equal(result.blocker, 'no_safe_target_files_identified');
});
test('missing concrete change does not count as execution ready', () => {
  const result = codeChangeExecutionIntent('Summarize the overall project status', ['src/example.js']);
  assert.equal(result.execution_ready, false);
  assert.equal(result.blocker, 'objective_requests_planning_but_does_not_specify_a_concrete_change');
});
test('a positive concrete change with target receives the heuristic signal', () => {
  const result = codeChangeExecutionIntent('Fix the API validation', ['src/validate.js']);
  assert.equal(result.execution_ready, true);
  assert.equal(result.next_capability, 'code.change.execute');
});
test('helper catches plan only and no code changes phrasing', () => {
  assert.equal(objectiveAllowsMutation('No code changes; just think about it'), false);
  assert.equal(objectiveAllowsMutation('This task is planning only.'), false);
});
test('does not treat a speculative plan as an actual code change', () => {
  assert.equal(objectiveHasConcreteChange('Prepare the next safe code change plan'), false);
});
test('requires an array of identified files', () => {
  assert.equal(codeChangeExecutionIntent('Fix the bug', 'src/index.js').execution_ready, false);
});
test('workflow accepts a well formed object payload', () => {
  assert.deepEqual(workflowEventParams({ payload: { task_id: 'T1', value: 3 } }), { task_id: 'T1', value: 3 });
});
test('workflow parses an encoded object payload', () => {
  assert.deepEqual(workflowEventParams({ payload: '{"task_id":"T2"}' }), { task_id: 'T2' });
});
test('workflow rejects malformed and array payloads', () => {
  assert.deepEqual(workflowEventParams({ payload: '{not-json' }), {});
  assert.deepEqual(workflowEventParams({ payload: '[1,2]' }), {});
  assert.deepEqual(workflowEventParams({ payload: [1,2] }), {});
});
test('workflow missing payload and null normalize to empty objects', () => {
  assert.deepEqual(workflowEventParams({}), {});
  assert.deepEqual(workflowEventParams(null), {});
});
