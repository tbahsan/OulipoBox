import presetsData from './data/presets.json';
import {
  ConstraintConfig,
  Preset,
  ValidationResult,
  Violation,
  validateText,
} from './engine/index';
import { DraftStore } from './storage/draft-store';

const presets: Preset[] = presetsData as Preset[];
let activePreset: Preset = presets[0];
let currentConfig: ConstraintConfig = JSON.parse(JSON.stringify(activePreset.config));

// DOM Elements
const editorInput = document.getElementById('editor-input') as HTMLTextAreaElement;
const editorHighlights = document.getElementById('editor-highlights') as HTMLElement;
const statusBanner = document.getElementById('status-banner') as HTMLElement;
const statusMessage = document.getElementById('status-message') as HTMLElement;
const statusBadge = document.getElementById('status-badge') as HTMLElement;
const presetsContainer = document.getElementById('presets-container') as HTMLElement;
const activeConstraintName = document.getElementById('active-constraint-name') as HTMLElement;
const activeConstraintDesc = document.getElementById('active-constraint-desc') as HTMLElement;
const dynamicControls = document.getElementById('dynamic-controls') as HTMLElement;
const statWords = document.getElementById('stat-words') as HTMLElement;
const statChars = document.getElementById('stat-chars') as HTMLElement;
const statLines = document.getElementById('stat-lines') as HTMLElement;
const violationsList = document.getElementById('violations-list') as HTMLElement;
const violationCountBadge = document.getElementById('violation-count-badge') as HTMLElement;
const letterFreq = document.getElementById('letter-freq') as HTMLElement;
const loadSampleBtn = document.getElementById('load-sample-btn') as HTMLButtonElement;
const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;
const downloadTxtBtn = document.getElementById('download-txt-btn') as HTMLButtonElement;
const clearBtn = document.getElementById('clear-btn') as HTMLButtonElement;
const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement;
const themeIcon = document.getElementById('theme-icon') as HTMLElement;
const themeText = document.getElementById('theme-text') as HTMLElement;
const optInStorage = document.getElementById('opt-in-storage') as HTMLInputElement;
const clearDraftBtn = document.getElementById('clear-draft-btn') as HTMLButtonElement;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Builds the HTML for the synchronized highlight backdrop.
 */
function renderHighlights(text: string, violations: Violation[]): void {
  if (!text) {
    editorHighlights.innerHTML = '';
    return;
  }

  if (violations.length === 0) {
    // Append newline to prevent scroll misalignment
    editorHighlights.innerHTML = escapeHtml(text) + '\n';
    return;
  }

  // Sort violations by start ascending
  const sorted = [...violations].sort((a, b) => a.start - b.start);
  let html = '';
  let lastIndex = 0;

  for (const v of sorted) {
    // Prevent overlapping index errors
    if (v.start < lastIndex) continue;

    // Normal text before violation
    html += escapeHtml(text.slice(lastIndex, v.start));

    // Violating text marked
    const violText = text.slice(v.start, v.end);
    const cls = v.severity === 'warning' ? 'violation-mark warning' : 'violation-mark';
    html += `<mark class="${cls}">${escapeHtml(violText)}</mark>`;

    lastIndex = v.end;
  }

  // Remainder
  html += escapeHtml(text.slice(lastIndex));
  // Trailing newline for textarea height parity
  editorHighlights.innerHTML = html + '\n';
}

/**
 * Updates the diagnostics drawer (violations list & letter frequency chart).
 */
function updateDiagnostics(result: ValidationResult): void {
  const count = result.violations.length;
  violationCountBadge.textContent = String(count);

  if (count === 0) {
    violationCountBadge.style.background = 'var(--success)';
    violationsList.innerHTML = `<p style="color: var(--success); font-size: 0.85rem">✓ No rule violations detected. Flawless constraint compliance!</p>`;
  } else {
    violationCountBadge.style.background = 'var(--error)';
    violationsList.innerHTML = result.violations
      .slice(0, 30) // Cap display at 30 items for smooth DOM performance
      .map(
        (v) => `
        <div class="violation-item ${v.severity === 'warning' ? 'warning' : ''}">
          <span><strong>Line ${v.line ?? 1}:</strong> ${escapeHtml(v.message)}</span>
          ${v.char ? `<code>${escapeHtml(v.char)}</code>` : ''}
        </div>
      `,
      )
      .join('');

    if (count > 30) {
      violationsList.innerHTML += `<p style="color: var(--text-muted); font-size: 0.8rem; text-align: center; margin-top: 0.25rem">+ ${count - 30} more violations</p>`;
    }
  }

  // Letter & Vowel Frequency
  const vowels = ['a', 'e', 'i', 'o', 'u', 'y'] as const;
  const maxVowelCount = Math.max(1, ...Object.values(result.stats.vowelCounts));

  const vowelBarsHtml = vowels
    .map((v) => {
      const c = result.stats.vowelCounts[v];
      const pct = Math.round((c / maxVowelCount) * 100);
      return `
        <div class="freq-row">
          <span style="width: 1.5rem">${v.toUpperCase()}:</span>
          <div class="freq-bar-bg">
            <div class="freq-bar-fill" style="width: ${pct}%"></div>
          </div>
          <span style="width: 2rem; text-align: right">${c}</span>
        </div>
      `;
    })
    .join('');

  letterFreq.innerHTML = `
    <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.35rem">Vowel Distribution:</div>
    ${vowelBarsHtml}
  `;
}

/**
 * Main validation loop triggered on text input or constraint change.
 */
function runValidation(): void {
  const text = editorInput.value;
  const result = validateText(text, currentConfig);

  // Synchronize highlights
  renderHighlights(text, result.violations);

  // Status banner
  if (result.valid) {
    statusBanner.className = 'status-banner valid';
    statusMessage.textContent = result.summary;
    statusBadge.textContent = 'Compliant';
  } else {
    statusBanner.className = 'status-banner invalid';
    statusMessage.textContent = result.summary;
    statusBadge.textContent = `${result.violations.length} Issues`;
  }

  // Statistics
  statWords.textContent = String(result.stats.wordCount);
  statChars.textContent = String(result.stats.charCount);
  statLines.textContent = String(result.stats.lineCount);

  // Diagnostics
  updateDiagnostics(result);

  // Auto-save if opted-in
  if (DraftStore.getSettings().optInStorage) {
    DraftStore.saveDraft({
      text,
      constraint: currentConfig,
      presetId: activePreset.id,
      savedAt: new Date().toISOString(),
    });
  }
}

/**
 * Render dynamic constraint controls based on currentConfig.
 */
function renderControls(): void {
  activeConstraintName.textContent = activePreset.name;
  activeConstraintDesc.textContent = activePreset.description;

  switch (currentConfig.type) {
    case 'lipogram': {
      const forbidden = currentConfig.config.forbiddenLetters.join(', ');
      dynamicControls.innerHTML = `
        <div class="input-group">
          <label for="ctrl-forbidden">Forbidden Letters (comma-separated):</label>
          <input type="text" id="ctrl-forbidden" value="${escapeHtml(forbidden)}" style="width: 8rem;" />
        </div>
      `;
      const input = document.getElementById('ctrl-forbidden') as HTMLInputElement;
      input.addEventListener('input', () => {
        const letters = input.value
          .split(',')
          .map((s) => s.trim().toLowerCase())
          .filter((s) => s.length === 1);
        if (currentConfig.type === 'lipogram') {
          currentConfig.config.forbiddenLetters = letters.length > 0 ? letters : ['e'];
          runValidation();
        }
      });
      break;
    }

    case 'univocalic': {
      const allowed = currentConfig.config.allowedVowel;
      const treatY = currentConfig.config.treatYAsVowel ?? false;
      dynamicControls.innerHTML = `
        <div class="input-group">
          <label for="ctrl-vowel">Allowed Vowel:</label>
          <select id="ctrl-vowel">
            <option value="a" ${allowed === 'a' ? 'selected' : ''}>A</option>
            <option value="e" ${allowed === 'e' ? 'selected' : ''}>E</option>
            <option value="i" ${allowed === 'i' ? 'selected' : ''}>I</option>
            <option value="o" ${allowed === 'o' ? 'selected' : ''}>O</option>
            <option value="u" ${allowed === 'u' ? 'selected' : ''}>U</option>
          </select>
        </div>
        <div class="input-group">
          <label>
            <input type="checkbox" id="ctrl-treat-y" ${treatY ? 'checked' : ''} />
            Treat 'Y' as vowel (Default: Consonant)
          </label>
        </div>
      `;
      const select = document.getElementById('ctrl-vowel') as HTMLSelectElement;
      select.addEventListener('change', () => {
        if (currentConfig.type === 'univocalic') {
          currentConfig.config.allowedVowel = select.value as 'a' | 'e' | 'i' | 'o' | 'u';
          runValidation();
        }
      });
      const check = document.getElementById('ctrl-treat-y') as HTMLInputElement;
      check.addEventListener('change', () => {
        if (currentConfig.type === 'univocalic') {
          currentConfig.config.treatYAsVowel = check.checked;
          runValidation();
        }
      });
      break;
    }

    case 'acrostic': {
      const target = currentConfig.config.targetWord;
      dynamicControls.innerHTML = `
        <div class="input-group">
          <label for="ctrl-target-word">Target Acrostic Word:</label>
          <input type="text" id="ctrl-target-word" value="${escapeHtml(target)}" style="text-transform: uppercase; width: 10rem;" />
        </div>
      `;
      const input = document.getElementById('ctrl-target-word') as HTMLInputElement;
      input.addEventListener('input', () => {
        if (currentConfig.type === 'acrostic') {
          currentConfig.config.targetWord = input.value.trim().toUpperCase() || 'AUTUMN';
          runValidation();
        }
      });
      break;
    }

    case 'wordcount': {
      const target = currentConfig.config.target;
      dynamicControls.innerHTML = `
        <div class="input-group">
          <label for="ctrl-word-target">Exact Word Limit:</label>
          <input type="number" id="ctrl-word-target" value="${target}" min="1" max="1000" style="width: 6rem;" />
        </div>
      `;
      const input = document.getElementById('ctrl-word-target') as HTMLInputElement;
      input.addEventListener('input', () => {
        if (currentConfig.type === 'wordcount') {
          currentConfig.config.target = parseInt(input.value, 10) || 50;
          runValidation();
        }
      });
      break;
    }

    case 'alliteration': {
      const target = currentConfig.config.targetLetter.toUpperCase();
      dynamicControls.innerHTML = `
        <div class="input-group">
          <label for="ctrl-alliteration">Target Starting Letter:</label>
          <input type="text" id="ctrl-alliteration" value="${escapeHtml(target)}" maxlength="1" style="width: 4rem; text-transform: uppercase;" />
        </div>
      `;
      const input = document.getElementById('ctrl-alliteration') as HTMLInputElement;
      input.addEventListener('input', () => {
        if (currentConfig.type === 'alliteration') {
          currentConfig.config.targetLetter = input.value.trim().toLowerCase() || 'p';
          runValidation();
        }
      });
      break;
    }

    case 'monosyllabic': {
      dynamicControls.innerHTML = `
        <div style="font-size: 0.88rem; color: var(--text-muted)">
          Formal phonotactic constraint: Every word must have exactly one syllable.
        </div>
      `;
      break;
    }
  }
}

/**
 * Initialize Preset Pills.
 */
function initPresets(): void {
  presetsContainer.innerHTML = presets
    .map(
      (p) => `
      <button
        class="preset-pill ${p.id === activePreset.id ? 'active' : ''}"
        data-preset-id="${p.id}"
        role="tab"
        aria-selected="${p.id === activePreset.id}"
      >
        ${escapeHtml(p.name)}
      </button>
    `,
    )
    .join('');

  presetsContainer.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('.preset-pill') as HTMLElement | null;
    if (!target) return;

    const id = target.getAttribute('data-preset-id');
    const selected = presets.find((p) => p.id === id);
    if (!selected) return;

    activePreset = selected;
    currentConfig = JSON.parse(JSON.stringify(selected.config));

    // Update pill styles
    document.querySelectorAll('.preset-pill').forEach((pill) => {
      pill.classList.remove('active');
      pill.setAttribute('aria-selected', 'false');
    });
    target.classList.add('active');
    target.setAttribute('aria-selected', 'true');

    renderControls();
    runValidation();
  });
}

/**
 * Setup event listeners and storage.
 */
function setupEvents(): void {
  // Input sync
  editorInput.addEventListener('input', runValidation);

  // Synchronize scrolling between editor textarea and backdrop highlights
  editorInput.addEventListener('scroll', () => {
    const backdrop = document.querySelector('.editor-backdrop') as HTMLElement;
    if (backdrop) {
      backdrop.scrollTop = editorInput.scrollTop;
      backdrop.scrollLeft = editorInput.scrollLeft;
    }
  });

  // Load sample text button
  loadSampleBtn.addEventListener('click', () => {
    editorInput.value = activePreset.sampleText;
    runValidation();
  });

  // Copy button
  copyBtn.addEventListener('click', async () => {
    const text = editorInput.value;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      const original = copyBtn.textContent;
      copyBtn.textContent = '✓ Copied!';
      setTimeout(() => {
        copyBtn.textContent = original;
      }, 1500);
    } catch {
      // Fallback
      editorInput.select();
      document.execCommand('copy');
    }
  });

  // Download TXT button
  downloadTxtBtn.addEventListener('click', () => {
    const text = editorInput.value;
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oulipobox-${activePreset.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Clear button
  clearBtn.addEventListener('click', () => {
    if (editorInput.value && confirm('Are you sure you want to clear the editor?')) {
      editorInput.value = '';
      runValidation();
    }
  });

  // Theme toggle
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    themeText.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
  });

  // Storage
  const settings = DraftStore.getSettings();
  optInStorage.checked = settings.optInStorage;

  optInStorage.addEventListener('change', () => {
    DraftStore.setOptIn(optInStorage.checked);
    if (optInStorage.checked) {
      runValidation();
    }
  });

  clearDraftBtn.addEventListener('click', () => {
    DraftStore.clearDraft();
    alert('Local draft cleared from this browser.');
  });

  // Restore saved draft if available
  const saved = DraftStore.loadDraft();
  if (saved && saved.text) {
    editorInput.value = saved.text;
    if (saved.presetId) {
      const found = presets.find((p) => p.id === saved.presetId);
      if (found) {
        activePreset = found;
        currentConfig = saved.constraint;
      }
    }
  } else {
    // Default to active preset sample text
    editorInput.value = activePreset.sampleText;
  }
}

// Boot
initPresets();
renderControls();
setupEvents();
runValidation();
