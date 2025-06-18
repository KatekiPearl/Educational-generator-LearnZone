/* ---------- prompt templates ---------- */
const TEMPLATES = {
  lesson: `Generate a comprehensive lesson plan for GRADE students on SUBJECT focusing on TOPIC. Include clear learning objectives, required materials, step‑by‑step activities, assessment methods, and differentiation strategies.`,
  study : `Create a detailed study guide for GRADE level students in SUBJECT covering TOPIC. Include key concepts, definitions, examples, practice questions, and summary points.`,
  blooms: `Design a complete set of Bloom's taxonomy activities for GRADE students in SUBJECT about TOPIC. Include questions and tasks for each level: remembering, understanding, applying, analyzing, evaluating, and creating.`,
  exam  : `Prepare a thorough exam revision sheet for GRADE students in SUBJECT covering TOPIC. Include key concepts, common question types, worked examples, exam tips, and practice problems with solutions.`,
  diff  : `Develop a differentiated instruction plan for a diverse classroom of GRADE students learning about TOPIC in SUBJECT. Include tiered activities, learning‑style adaptations, scaffolding strategies, and assessment modifications for varying ability levels.`
};

/* ---------- DOM refs ---------- */
const form           = document.getElementById('contentForm');
const output         = document.getElementById('output');
const performanceEl  = document.getElementById('performance');
const errorEl        = document.getElementById('error');
const resultsSection = document.getElementById('results');
const submitBtn      = document.getElementById('submitBtn');
const buttonText     = submitBtn.querySelector('.button-text');
const spinner        = submitBtn.querySelector('.spinner');

/* ---------- state ---------- */
let isGenerating = false;

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (!form) {
    showError('Critical error: form not found!');
    return;
  }
  form.addEventListener('submit', handleFormSubmit);
  document.getElementById('copyBtn').addEventListener('click', handleCopy);
  document.getElementById('downloadBtn').addEventListener('click', handleDownload);
});

/* ---------- handlers ---------- */
async function handleFormSubmit(e) {
  e.preventDefault();
  if (isGenerating) return;

  clearResults();
  hideError();

  if (!validateForm()) return;

  const formData = {
    level   : form.elements.level.value.trim(),
    subject : form.elements.subject.value.trim(),
    topic   : form.elements.topic.value.trim(),
    template: form.elements.template.value
  };

  try {
    setLoadingState(true);

    /* Build prompt for *display* (we still send raw fields to backend) */
    const promptPreview = buildPrompt(
      formData.level,
      formData.subject,
      formData.topic,
      formData.template
    );

    /* ⬇ fetch from our Node server */
    const generatedContent = await generateContent(formData);

    /* combine prompt + response if you like */
    displayResults(generatedContent);
  } catch (err) {
    showError(`Failed to generate content: ${err.message}`);
    console.error(err);
  } finally {
    setLoadingState(false);
  }
}

/* ---------- validation ---------- */
function validateForm() {
  const { level, subject, topic, template } = form.elements;
  if (!level.value.trim() || !subject.value.trim() ||
      !topic.value.trim() || !template.value) {
    showError('Please fill in all fields.');
    return false;
  }
  return true;
}

/* ---------- prompt builder (for preview) ---------- */
function buildPrompt(level, subject, topic, templateType) {
  const base = TEMPLATES[templateType];
  if (!base) throw new Error('Invalid template type');
  return base
    .replace(/GRADE/g,   level)
    .replace(/SUBJECT/g, subject)
    .replace(/TOPIC/g,   topic);
}

/* ---------- API call to Express ---------- */
async function generateContent({ level, subject, topic }) {
  const start = performance.now();

  const res = await fetch('/api/generate', {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({
      stream : level,
      option : subject,
      search : topic
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error ${res.status}`);
  }

  const data = await res.json();
  const end  = performance.now();

  displayPerformanceMetrics(end - start);
  if (!data.content) throw new Error('No content returned from API');
  return data.content.trim();
}

/* ---------- UI helpers ---------- */
function displayPerformanceMetrics(ms) {
  performanceEl.textContent = `Generated in ${Math.round(ms)} ms`;
}

function displayResults(text) {
  output.textContent = text;
  resultsSection.classList.remove('hidden');
}

function clearResults() {
  output.textContent = '';
  performanceEl.textContent = '';
  resultsSection.classList.add('hidden');
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove('hidden');
}

function hideError() {
  errorEl.classList.add('hidden');
  errorEl.textContent = '';
}

function setLoadingState(on) {
  isGenerating       = on;
  submitBtn.disabled = on;
  buttonText.textContent = on ? 'Generating…' : 'Generate';
  spinner.classList.toggle('hidden', !on);
}

/* ---------- copy / download ---------- */
async function handleCopy() {
  try {
    await navigator.clipboard.writeText(output.textContent);
    showTemporaryMessage('Copied to clipboard!');
  } catch (err) {
    showError('Copy failed. Try again.');
    console.error(err);
  }
}

function handleDownload() {
  if (!output.textContent) {
    showError('No content to download.');
    return;
  }
  const blob = new Blob([output.textContent], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `educational-content-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showTemporaryMessage('Download started!');
}

/* ---------- transient toast ---------- */
function showTemporaryMessage(msg) {
  const el = document.createElement('div');
  el.className = 'temp-message';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => {
    el.classList.add('fade-out');
    setTimeout(() => el.remove(), 500);
  }, 2500);
}
