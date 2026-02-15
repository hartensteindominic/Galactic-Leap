const year = document.getElementById('year');
const wakeButton = document.getElementById('wake-agent');
const statusPanel = document.getElementById('agent-status');
const missionForm = document.getElementById('mission-form');
const missionOutput = document.getElementById('mission-output');
const runtimeEl = document.getElementById('runtime');
const taskRateEl = document.getElementById('task-rate');
const learnScoreEl = document.getElementById('learn-score');

year.textContent = String(new Date().getFullYear());

let runtimeSeconds = 0;
let tasksClosed = 18;
let confidence = 87;

const updateMetrics = () => {
  runtimeSeconds += 1;
  const minutes = String(Math.floor(runtimeSeconds / 60)).padStart(2, '0');
  const seconds = String(runtimeSeconds % 60).padStart(2, '0');
  runtimeEl.textContent = `${minutes}:${seconds}`;

  if (runtimeSeconds % 12 === 0) {
    tasksClosed += 1;
    confidence = Math.min(99, confidence + 1);
    taskRateEl.textContent = String(tasksClosed);
    learnScoreEl.textContent = `${confidence}%`;
  }
};

setInterval(updateMetrics, 1000);
taskRateEl.textContent = String(tasksClosed);
learnScoreEl.textContent = `${confidence}%`;

wakeButton.addEventListener('click', () => {
  statusPanel.innerHTML = `
    <h2>Agent status: <span>Fully autonomous</span></h2>
    <p>Perception active · Planner generating options · Reflective learning engaged</p>
  `;
});

missionForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const mission = document.getElementById('mission').value.trim();
  const risk = document.getElementById('risk-level').value;

  const strictness = {
    low: 'Maximum guardrails; only low-risk actions approved.',
    balanced: 'Adaptive guardrails; confidence and impact must align.',
    high: 'Aggressive exploration; high-value opportunities prioritized.'
  };

  const confidenceScore = Math.min(
    98,
    Math.max(80, Math.floor(Math.random() * 15) + (risk === 'high' ? 82 : 85))
  );

  missionOutput.innerHTML = `
    <p>> Objective received: ${mission}</p>
    <p>> Planning engine: generated 3 candidate strategies</p>
    <p>> Self-approval policy: ${strictness[risk]}</p>
    <p>> Approved route: Strategy B (highest expected utility)</p>
    <p>> Reflective note: add retrieval memory on task completion to boost future precision.</p>
    <p>> Learning confidence: ${confidenceScore}%</p>
    <p>> Cycle complete ✔</p>
  `;

  tasksClosed += 1;
  confidence = Math.min(99, Math.round((confidence + confidenceScore) / 2));
  taskRateEl.textContent = String(tasksClosed);
  learnScoreEl.textContent = `${confidence}%`;
});
