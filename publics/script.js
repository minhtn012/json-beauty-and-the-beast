// ===========================================
// THEME MANAGEMENT
// ===========================================
const THEMES = {
    NINTENDO: 'nintendo',
    MODERN: 'modern'
};

const THEME_CONFIG = {
    nintendo: {
        css: 'publics/styles-nintendo.css',
        icon: '🎮',
        name: 'NINTENDO',
        tab1: '1P - JSON PARSER',
        tab2: '2P - JSON COMPARE',
        typewriter: true
    },
    modern: {
        css: 'publics/styles-modern.css',
        icon: '📱',
        name: 'MODERN',
        tab1: 'JSON Viewer',
        tab2: 'JSON Diff',
        typewriter: false
    }
};

// Get saved theme or default to Nintendo
let currentTheme = localStorage.getItem('theme') || THEMES.NINTENDO;

function toggleTheme() {
    // Toggle theme
    currentTheme = currentTheme === THEMES.NINTENDO ? THEMES.MODERN : THEMES.NINTENDO;

    // Save to localStorage
    localStorage.setItem('theme', currentTheme);

    // Apply theme
    applyTheme(currentTheme);
}

function startTypewriter() {
    const typewriterText = "JSON Parser - Beauty and the Beast";
    let typewriterIndex = 0;
    const typewriterSpeed = 60;

    const element = document.getElementById('typewriter-text');
    if (!element) return;

    // Clear existing text
    element.textContent = '';

    function typeWriter() {
        if (typewriterIndex < typewriterText.length) {
            element.textContent += typewriterText.charAt(typewriterIndex);
            typewriterIndex++;
            setTimeout(typeWriter, typewriterSpeed);
        }
    }

    // Start typewriter effect after a short delay
    setTimeout(typeWriter, 300);
}

function applyTheme(theme) {
    const config = THEME_CONFIG[theme];

    // Update CSS file
    const stylesheet = document.getElementById('theme-stylesheet');
    stylesheet.href = config.css;

    // Update button
    const button = document.getElementById('themeToggle');
    const icon = button.querySelector('.theme-icon');
    const name = button.querySelector('.theme-name');
    icon.textContent = config.icon;
    name.textContent = config.name;

    // Update tab names
    const tabs = document.querySelectorAll('.tab-button');
    if (tabs[0]) tabs[0].textContent = config.tab1;
    if (tabs[1]) tabs[1].textContent = config.tab2;

    // Handle typewriter effect
    const typewriterContainer = document.getElementById('typewriter-text');
    const cursor = document.querySelector('.typing-cursor');

    if (config.typewriter) {
        // Nintendo: typewriter effect
        typewriterContainer.textContent = '';
        if (cursor) cursor.style.display = 'inline';
        startTypewriter();
    } else {
        // Modern: show full text immediately
        typewriterContainer.textContent = 'JSON Parser - Beauty and the Beast';
        if (cursor) cursor.style.display = 'none';
    }
}

// ===========================================
// LOCALSTORAGE MANAGEMENT
// ===========================================
const STORAGE_KEYS = {
    JSON_INPUT: 'jsonParser_jsonInput',
    JSON_INPUT_A: 'jsonParser_jsonInputA',
    JSON_INPUT_B: 'jsonParser_jsonInputB'
};

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.warn('Failed to save to localStorage:', e);
    }
}

function loadFromStorage(key) {
    try {
        return localStorage.getItem(key) || '';
    } catch (e) {
        console.warn('Failed to load from localStorage:', e);
        return '';
    }
}

function clearStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.warn('Failed to clear localStorage:', e);
    }
}

// Debounce function to avoid saving too frequently
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===========================================
// TAB SWITCHING FUNCTION
// ===========================================
function switchTab(tabName) {
    // Hide all tabs
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.classList.remove('active'));

    // Deactivate all tab buttons
    const allButtons = document.querySelectorAll('.tab-button');
    allButtons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    document.getElementById('tab-' + tabName).classList.add('active');

    // Activate clicked button
    event.target.classList.add('active');
}

// ===========================================
// SYNC SCROLL TOGGLE FUNCTION
// ===========================================
function toggleSync(checkboxId, button) {
    const checkbox = document.getElementById(checkboxId);
    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
        button.classList.add('active');
        button.textContent = 'SYNC: ON';
    } else {
        button.classList.remove('active');
        button.textContent = 'SYNC: OFF';
    }
}

// ===========================================
// FULLSCREEN TOGGLE FUNCTION
// ===========================================
function toggleFullscreen(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const isFullscreen = container.classList.contains('fullscreen-mode');

    if (isFullscreen) {
        // Exit fullscreen
        container.classList.remove('fullscreen-mode');
        document.body.style.overflow = '';

        // Update icon based on container
        updateFullscreenIcon(containerId, false);
    } else {
        // Enter fullscreen
        container.classList.add('fullscreen-mode');
        document.body.style.overflow = 'hidden';

        // Update icon
        updateFullscreenIcon(containerId, true);
    }
}

function updateFullscreenIcon(containerId, isFullscreen) {
    // No longer needed - buttons don't change text
    // Kept for compatibility
}

// ESC key to exit fullscreen
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.fullscreen-mode').forEach(container => {
            container.classList.remove('fullscreen-mode');
            document.body.style.overflow = '';
            updateFullscreenIcon(container.id, false);
        });
    }
});

// ===========================================
// SYNCHRONIZED SCROLL FUNCTION
// ===========================================
function setupSyncScroll(elem1Id, elem2Id, toggleId) {
    const elem1 = document.getElementById(elem1Id);
    const elem2 = document.getElementById(elem2Id);
    const toggle = document.getElementById(toggleId);

    if (!elem1 || !elem2 || !toggle) return;

    let isSyncing = false;

    function syncScroll(source, target) {
        if (isSyncing) return;
        isSyncing = true;

        const sourceScrollHeight = source.scrollHeight - source.clientHeight;
        const targetScrollHeight = target.scrollHeight - target.clientHeight;

        if (sourceScrollHeight > 0 && targetScrollHeight > 0) {
            const scrollPercentage = source.scrollTop / sourceScrollHeight;
            target.scrollTop = scrollPercentage * targetScrollHeight;
        }

        setTimeout(() => { isSyncing = false; }, 10);
    }

    function onElem1Scroll() {
        if (toggle.checked) syncScroll(elem1, elem2);
    }

    function onElem2Scroll() {
        if (toggle.checked) syncScroll(elem2, elem1);
    }

    elem1.addEventListener('scroll', onElem1Scroll);
    elem2.addEventListener('scroll', onElem2Scroll);
}

// ===========================================
// CLEAR INPUT FUNCTION
// ===========================================
function clearInput(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.value = '';
        element.focus();

        // Update line numbers after clearing
        updateLineNumbers(elementId, 'lineNumbers-' + elementId);

        // Clear from localStorage
        if (elementId === 'jsonInput') {
            clearStorage(STORAGE_KEYS.JSON_INPUT);
        } else if (elementId === 'jsonInputA') {
            clearStorage(STORAGE_KEYS.JSON_INPUT_A);
        } else if (elementId === 'jsonInputB') {
            clearStorage(STORAGE_KEYS.JSON_INPUT_B);
        }
    }
}

// ===========================================
// COPY TO CLIPBOARD FUNCTION
// ===========================================
function copyToClipboard(elementId, button) {
    const element = document.getElementById(elementId);

    if (!element) return;

    // Clone element to manipulate
    const clone = element.cloneNode(true);

    // Remove all toggle and collapsed elements from clone
    const toggles = clone.querySelectorAll('.json-toggle');
    const collapsed = clone.querySelectorAll('.json-collapsed');

    toggles.forEach(toggle => toggle.remove());
    collapsed.forEach(col => col.remove());

    const text = clone.textContent || clone.innerText;

    if (!text || text.trim() === '') {
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        // Change button state
        const originalIcon = button.innerHTML;
        button.innerHTML = '✓';
        button.classList.add('success');

        // Reset after 1.5 seconds
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.classList.remove('success');
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
}

// ===========================================
// EXPORT TO FILE FUNCTION
// ===========================================
function exportToFile(elementId, filename) {
    const element = document.getElementById(elementId);

    if (!element) {
        alert('Element not found!');
        return;
    }

    // Clone element to manipulate
    const clone = element.cloneNode(true);

    // Remove all toggle and collapsed elements from clone
    const toggles = clone.querySelectorAll('.json-toggle');
    const collapsed = clone.querySelectorAll('.json-collapsed');

    toggles.forEach(toggle => toggle.remove());
    collapsed.forEach(col => col.remove());

    const text = clone.textContent || clone.innerText;

    if (!text || text.trim() === '') {
        alert('Nothing to export!');
        return;
    }

    // Create blob and download
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ===========================================
// HÀM CHUNG: PARSE JSON LỒNG NHAU
// ===========================================
function parseNestedJson(obj) {
    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        const value = obj[key];
        if (typeof value === 'string') {
            try {
                const parsedValue = JSON.parse(value);
                if (parsedValue && typeof parsedValue === 'object') {
                    obj[key] = parsedValue;
                    parseNestedJson(obj[key]);
                }
            } catch (e) { /* Bỏ qua */ }
        } else if (typeof value === 'object' && value !== null) {
            parseNestedJson(value);
        }
    }
}

// ===========================================
// SYNTAX HIGHLIGHTING WITH COLLAPSIBLE NODES
// ===========================================
function highlightJSON(obj, indent = 0, path = '') {
    const INDENT = '  ';
    let html = '';

    if (obj === null) {
        return `<span class="json-null">null</span>`;
    }

    if (typeof obj === 'boolean') {
        return `<span class="json-boolean">${obj}</span>`;
    }

    if (typeof obj === 'number') {
        return `<span class="json-number">${obj}</span>`;
    }

    if (typeof obj === 'string') {
        return `<span class="json-string">"${escapeHtml(obj)}"</span>`;
    }

    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return '[]';
        }

        const currentPath = path;
        html += `<span class="json-collapsible" data-path="${currentPath}">`;
        html += `<span class="json-toggle">▼</span>[`;
        html += `<span class="json-content">\n`;

        obj.forEach((item, index) => {
            const itemPath = `${currentPath}[${index}]`;
            html += INDENT.repeat(indent + 1);
            html += highlightJSON(item, indent + 1, itemPath);
            if (index < obj.length - 1) {
                html += ',';
            }
            html += '\n';
        });

        html += INDENT.repeat(indent) + ']';
        html += '</span>';
        html += `<span class="json-collapsed" style="display:none;">...</span>`;
        html += '</span>';
        return html;
    }

    if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.length === 0) {
            return '{}';
        }

        const currentPath = path;
        html += `<span class="json-collapsible" data-path="${currentPath}">`;
        html += `<span class="json-toggle">▼</span>{`;
        html += `<span class="json-content">\n`;

        keys.forEach((key, index) => {
            const keyPath = path ? `${path}.${key}` : key;
            html += INDENT.repeat(indent + 1);
            html += `<span class="json-key">"${escapeHtml(key)}"</span>: `;
            html += highlightJSON(obj[key], indent + 1, keyPath);
            if (index < keys.length - 1) {
                html += ',';
            }
            html += '\n';
        });

        html += INDENT.repeat(indent) + '}';
        html += '</span>';
        html += `<span class="json-collapsed" style="display:none;">...</span>`;
        html += '</span>';
        return html;
    }

    return String(obj);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===========================================
// TOGGLE COLLAPSE/EXPAND HANDLER
// ===========================================
function setupCollapseToggle(containerId, pairedContainerId, syncToggleId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Event delegation for toggle clicks
    container.addEventListener('click', (e) => {
        const toggle = e.target.closest('.json-toggle');
        if (!toggle) return;

        const collapsible = toggle.parentElement;
        const content = collapsible.querySelector('.json-content');
        const collapsed = collapsible.querySelector('.json-collapsed');
        const path = collapsible.getAttribute('data-path');

        // Toggle current element
        const isCollapsed = content.style.display === 'none';

        if (isCollapsed) {
            // Expand
            content.style.display = '';
            collapsed.style.display = 'none';
            toggle.textContent = '▼';
        } else {
            // Collapse
            content.style.display = 'none';
            collapsed.style.display = '';
            toggle.textContent = '▶';
        }

        // Update line numbers after collapse/expand
        updateLineNumbers(containerId, 'lineNumbers-' + containerId);

        // Sync to paired container if sync is ON
        if (pairedContainerId && syncToggleId) {
            const syncToggle = document.getElementById(syncToggleId);
            if (syncToggle && syncToggle.checked) {
                syncCollapseState(pairedContainerId, path, !isCollapsed);
            }
        }
    });
}

function syncCollapseState(containerId, path, shouldCollapse) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Find element with same path
    const targetElement = container.querySelector(`[data-path="${path}"]`);
    if (!targetElement) return;

    const toggle = targetElement.querySelector('.json-toggle');
    const content = targetElement.querySelector('.json-content');
    const collapsed = targetElement.querySelector('.json-collapsed');

    if (!toggle || !content || !collapsed) return;

    if (shouldCollapse) {
        // Collapse
        content.style.display = 'none';
        collapsed.style.display = '';
        toggle.textContent = '▶';
    } else {
        // Expand
        content.style.display = '';
        collapsed.style.display = 'none';
        toggle.textContent = '▼';
    }

    // Update line numbers after syncing collapse state
    updateLineNumbers(containerId, 'lineNumbers-' + containerId);
}

// ===========================================
// LINE NUMBERS FUNCTIONALITY
// ===========================================
function updateLineNumbers(contentId, lineNumbersId) {
    const contentElement = document.getElementById(contentId);
    const lineNumbersElement = document.getElementById(lineNumbersId);

    if (!contentElement || !lineNumbersElement) return;

    let lineCount;

    // For textarea elements
    if (contentElement.tagName === 'TEXTAREA') {
        const text = contentElement.value;
        lineCount = text ? text.split('\n').length : 1;
    }
    // For pre elements - use innerText to respect CSS display:none (collapsed nodes)
    else {
        const text = contentElement.innerText || contentElement.textContent;
        lineCount = text ? text.split('\n').length : 1;
    }

    // Generate line numbers
    let lineNumbers = '';
    for (let i = 1; i <= lineCount; i++) {
        lineNumbers += i + '\n';
    }

    lineNumbersElement.textContent = lineNumbers;
}

function setupLineNumberSync(contentId, lineNumbersId) {
    const contentElement = document.getElementById(contentId);
    const lineNumbersElement = document.getElementById(lineNumbersId);

    if (!contentElement || !lineNumbersElement) return;

    let isSyncing = false;

    // Sync scroll from content to line numbers
    contentElement.addEventListener('scroll', () => {
        if (isSyncing) return;
        isSyncing = true;
        lineNumbersElement.scrollTop = contentElement.scrollTop;
        setTimeout(() => { isSyncing = false; }, 10);
    });

    // Sync scroll from line numbers to content
    lineNumbersElement.addEventListener('scroll', () => {
        if (isSyncing) return;
        isSyncing = true;
        contentElement.scrollTop = lineNumbersElement.scrollTop;
        setTimeout(() => { isSyncing = false; }, 10);
    });
}


// ===========================================
// LOGIC CHO PHẦN 1: JSON PARSER
// ===========================================
const jsonInput = document.getElementById('jsonInput');
const jsonOutput = document.getElementById('jsonOutput');
const parseButton = document.getElementById('parseButton');
const errorDisplayParser = document.getElementById('errorDisplayParser');

jsonInput.placeholder = `Example: "{\\"key\\": \\"value\\", \\"nested\\": \\"{\\\\\\"a\\\\\\": 1}\\"}"`;  // Ví dụ

parseButton.addEventListener('click', () => {
    errorDisplayParser.textContent = '';
    jsonOutput.innerHTML = '';
    const inputText = jsonInput.value;

    if (!inputText) {
        errorDisplayParser.textContent = 'Input is empty!';
        return;
    }

    try {
        let data = JSON.parse(inputText);
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        parseNestedJson(data);
        jsonOutput.innerHTML = highlightJSON(data);

        // Update line numbers for output
        updateLineNumbers('jsonOutput', 'lineNumbers-jsonOutput');
    } catch (error) {
        errorDisplayParser.textContent = `Invalid JSON: ${error.message}`;
    }
});


// ===========================================
// LOGIC CHO PHẦN 2: JSON DIFF
// ===========================================
const jsonInputA = document.getElementById('jsonInputA');
const jsonInputB = document.getElementById('jsonInputB');
const compareButton = document.getElementById('compareButton');
const errorDisplayDiff = document.getElementById('errorDisplayDiff');

const jsonParsedA = document.getElementById('jsonParsedA');
const jsonParsedB = document.getElementById('jsonParsedB');
const jsonDiffOutput = document.getElementById('jsonDiffOutput');

// Gán data mẫu cho phần Diff để test (dùng placeholder thay vì value)
jsonInputA.placeholder = `Example: {"id": 123, "name": "John", "active": true, "roles": ["user"], "prefs": "{\\"theme\\": \\"dark\\"}"}`;
jsonInputB.placeholder = `Example: {"id": 123, "name": "Jane", "active": true, "roles": ["user", "admin"], "new_key": "hello", "prefs": "{\\"theme\\": \\"light\\"}"}`;

/**
 * Format diff output with HTML styling
 */
function formatDiffLine(line) {
    if (line.startsWith('[+]')) {
        return `<span class="diff-added">${line}</span>`;
    } else if (line.startsWith('[-]')) {
        return `<span class="diff-removed">${line}</span>`;
    } else if (line.startsWith('[~]')) {
        return `<span class="diff-changed">${line}</span>`;
    }
    return line;
}

/**
 * Recursive function to find differences
 */
function findDifferences(objA, objB, path = '') {
    let diffs = [];
    const allKeys = new Set([...Object.keys(objA), ...Object.keys(objB)]);

    allKeys.forEach(key => {
        const currentPath = path ? `${path}.${key}` : key;
        const valA = objA[key];
        const valB = objB[key];

        if (key in objB && !(key in objA)) {
            diffs.push(`[+] Added: ${currentPath} = ${JSON.stringify(valB)}`);
        }
        else if (key in objA && !(key in objB)) {
            diffs.push(`[-] Removed: ${currentPath} (old value: ${JSON.stringify(valA)})`);
        }
        else if (key in objA && key in objB) {
            if (typeof valA !== typeof valB) {
                diffs.push(`[~] Type changed: ${currentPath} (from ${typeof valA} to ${typeof valB})`);
            }
            else if (typeof valA === 'object' && valA !== null && !Array.isArray(valA) && typeof valB === 'object' && valB !== null && !Array.isArray(valB)) {
                diffs.push(...findDifferences(valA, valB, currentPath));
            }
            else if (Array.isArray(valA) && Array.isArray(valB)) {
                if (JSON.stringify(valA) !== JSON.stringify(valB)) {
                    diffs.push(`[~] Array changed: ${currentPath}\n    A: ${JSON.stringify(valA)}\n    B: ${JSON.stringify(valB)}`);
                }
            }
            else if (valA !== valB) {
                diffs.push(`[~] Value changed: ${currentPath} (from ${JSON.stringify(valA)} to ${JSON.stringify(valB)})`);
            }
        }
    });
    return diffs;
}

compareButton.addEventListener('click', () => {
    errorDisplayDiff.textContent = '';
    jsonParsedA.innerHTML = '';
    jsonParsedB.innerHTML = '';
    jsonDiffOutput.innerHTML = '';

    const textA = jsonInputA.value;
    const textB = jsonInputB.value;

    if (!textA || !textB) {
        errorDisplayDiff.textContent = 'Both JSON A and B fields must contain data!';
        return;
    }

    try {
        let objA = JSON.parse(textA);
        let objB = JSON.parse(textB);

        if (typeof objA === 'string') {
            objA = JSON.parse(objA);
        }
        if (typeof objB === 'string') {
            objB = JSON.parse(objB);
        }

        parseNestedJson(objA);
        parseNestedJson(objB);

        jsonParsedA.innerHTML = highlightJSON(objA);
        jsonParsedB.innerHTML = highlightJSON(objB);

        // Update line numbers for parsed outputs
        updateLineNumbers('jsonParsedA', 'lineNumbers-jsonParsedA');
        updateLineNumbers('jsonParsedB', 'lineNumbers-jsonParsedB');

        const diffs = findDifferences(objA, objB);

        if (diffs.length === 0) {
            jsonDiffOutput.innerHTML = '<div class="success-display">No differences found. The two JSON objects are identical (after nested parsing).</div>';
        } else {
            const formattedDiffs = diffs.map(formatDiffLine).join('\n');
            jsonDiffOutput.innerHTML = formattedDiffs;
        }

        // Auto-scroll to results after successful comparison
        setTimeout(() => {
            const outputsContainer = document.getElementById('jsonDiffOutputsContainer');
            if (outputsContainer) {
                outputsContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);

    } catch (error) {
        errorDisplayDiff.textContent = `Invalid JSON: ${error.message}`;
    }
});


// ===========================================
// SETUP AUTO-SAVE TO LOCALSTORAGE
// ===========================================
function setupAutoSave(elementId, storageKey) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Create debounced save function
    const debouncedSave = debounce((value) => {
        saveToStorage(storageKey, value);
    }, 500);

    // Add input event listener
    element.addEventListener('input', (e) => {
        debouncedSave(e.target.value);
    });
}

// ===========================================
// INITIALIZE SYNC SCROLL ON PAGE LOAD
// ===========================================
window.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    applyTheme(currentTheme);

    // Setup sync scroll for JSON Viewer (jsonInput and jsonOutput)
    setupSyncScroll('jsonInput', 'jsonOutput', 'syncToggleViewer');

    // Setup sync scroll for inputs (jsonInputA and jsonInputB)
    setupSyncScroll('jsonInputA', 'jsonInputB', 'syncToggleInputs');

    // Setup sync scroll for outputs (jsonParsedA and jsonParsedB)
    setupSyncScroll('jsonParsedA', 'jsonParsedB', 'syncToggleOutputs');

    // Setup collapse toggle for JSON outputs
    // jsonOutput: no paired element (jsonInput is textarea)
    setupCollapseToggle('jsonOutput', null, null);

    // jsonParsedA ↔ jsonParsedB: sync collapse when syncToggleOutputs is ON
    setupCollapseToggle('jsonParsedA', 'jsonParsedB', 'syncToggleOutputs');
    setupCollapseToggle('jsonParsedB', 'jsonParsedA', 'syncToggleOutputs');

    // Setup line number sync for all elements
    setupLineNumberSync('jsonInput', 'lineNumbers-jsonInput');
    setupLineNumberSync('jsonOutput', 'lineNumbers-jsonOutput');
    setupLineNumberSync('jsonInputA', 'lineNumbers-jsonInputA');
    setupLineNumberSync('jsonInputB', 'lineNumbers-jsonInputB');
    setupLineNumberSync('jsonParsedA', 'lineNumbers-jsonParsedA');
    setupLineNumberSync('jsonParsedB', 'lineNumbers-jsonParsedB');

    // Add input event listeners for textareas to update line numbers
    const jsonInputElement = document.getElementById('jsonInput');
    const jsonInputAElement = document.getElementById('jsonInputA');
    const jsonInputBElement = document.getElementById('jsonInputB');

    if (jsonInputElement) {
        jsonInputElement.addEventListener('input', () => {
            updateLineNumbers('jsonInput', 'lineNumbers-jsonInput');
        });
    }

    if (jsonInputAElement) {
        jsonInputAElement.addEventListener('input', () => {
            updateLineNumbers('jsonInputA', 'lineNumbers-jsonInputA');
        });
    }

    if (jsonInputBElement) {
        jsonInputBElement.addEventListener('input', () => {
            updateLineNumbers('jsonInputB', 'lineNumbers-jsonInputB');
        });
    }

    // Load saved data from localStorage
    const savedJsonInput = loadFromStorage(STORAGE_KEYS.JSON_INPUT);
    const savedJsonInputA = loadFromStorage(STORAGE_KEYS.JSON_INPUT_A);
    const savedJsonInputB = loadFromStorage(STORAGE_KEYS.JSON_INPUT_B);

    if (savedJsonInput) {
        document.getElementById('jsonInput').value = savedJsonInput;
    }
    if (savedJsonInputA) {
        document.getElementById('jsonInputA').value = savedJsonInputA;
    }
    if (savedJsonInputB) {
        document.getElementById('jsonInputB').value = savedJsonInputB;
    }

    // Initialize line numbers for all elements
    updateLineNumbers('jsonInput', 'lineNumbers-jsonInput');
    updateLineNumbers('jsonOutput', 'lineNumbers-jsonOutput');
    updateLineNumbers('jsonInputA', 'lineNumbers-jsonInputA');
    updateLineNumbers('jsonInputB', 'lineNumbers-jsonInputB');
    updateLineNumbers('jsonParsedA', 'lineNumbers-jsonParsedA');
    updateLineNumbers('jsonParsedB', 'lineNumbers-jsonParsedB');

    // Setup auto-save for all inputs
    setupAutoSave('jsonInput', STORAGE_KEYS.JSON_INPUT);
    setupAutoSave('jsonInputA', STORAGE_KEYS.JSON_INPUT_A);
    setupAutoSave('jsonInputB', STORAGE_KEYS.JSON_INPUT_B);
});
