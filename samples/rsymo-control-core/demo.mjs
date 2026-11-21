import { codeChangeExecutionIntent } from './objective-intent.js';
import { workflowEventParams } from './workflow-payload.js';

const cases = [
  { objective: 'Plan only: explain how the API could be improved', files: [] },
  { objective: 'Fix the error handling in the API module', files: [] },
  { objective: 'Fix the error handling in the API module', files: ['src/api.js'] },
  { objective: 'Do not modify the repository; review the code', files: ['src/api.js'] }
];

console.log('RSYMO Control sample: intent classification only, no code execution');
for (const example of cases) {
  console.log(JSON.stringify({ objective: example.objective, ...codeChangeExecutionIntent(example.objective, example.files) }));
}
console.log(JSON.stringify({ normalizedWorkflow: workflowEventParams({ payload: '{"mode":"example","task_id":"demo"}' }) }));
