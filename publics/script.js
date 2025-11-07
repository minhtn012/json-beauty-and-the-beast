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
    const iconMap = {
        'jsonViewerContainer': 'fullscreenIconViewer',
        'jsonDiffInputsContainer': 'fullscreenIconDiffInputs',
        'jsonDiffOutputsContainer': 'fullscreenIconDiffOutputs'
    };

    const iconId = iconMap[containerId];
    if (iconId) {
        const icon = document.getElementById(iconId);
        if (icon) {
            icon.textContent = isFullscreen ? 'fullscreen_exit' : 'fullscreen';
        }
    }
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
    const text = element.textContent || element.innerText;

    if (!text || text.trim() === '') {
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        // Change button state
        const originalIcon = button.innerHTML;
        button.innerHTML = '<span class="material-icons">check</span>';
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

    // Get text content, stripping HTML if present
    let text = element.textContent || element.innerText;

    // If element contains HTML (like diff output), extract clean text
    if (element.innerHTML !== element.textContent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = element.innerHTML;
        text = tempDiv.textContent || tempDiv.innerText;
    }

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
// LOGIC CHO PHẦN 1: JSON PARSER
// ===========================================
const jsonInput = document.getElementById('jsonInput');
const jsonOutput = document.getElementById('jsonOutput');
const parseButton = document.getElementById('parseButton');
const errorDisplayParser = document.getElementById('errorDisplayParser');

jsonInput.placeholder = `Example: "{\\"key\\": \\"value\\", \\"nested\\": \\"{\\\\\\"a\\\\\\": 1}\\"}"`;  // Ví dụ

parseButton.addEventListener('click', () => {
    errorDisplayParser.textContent = '';
    jsonOutput.textContent = '';
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
        jsonOutput.textContent = JSON.stringify(data, null, 2);
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
    jsonParsedA.textContent = '';
    jsonParsedB.textContent = '';
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

        jsonParsedA.textContent = JSON.stringify(objA, null, 2);
        jsonParsedB.textContent = JSON.stringify(objB, null, 2);

        const diffs = findDifferences(objA, objB);

        if (diffs.length === 0) {
            jsonDiffOutput.innerHTML = '<div class="success-display">No differences found. The two JSON objects are identical (after nested parsing).</div>';
        } else {
            const formattedDiffs = diffs.map(formatDiffLine).join('\n');
            jsonDiffOutput.innerHTML = formattedDiffs;
        }

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
    // Setup sync scroll for JSON Viewer (jsonInput and jsonOutput)
    setupSyncScroll('jsonInput', 'jsonOutput', 'syncToggleViewer');

    // Setup sync scroll for inputs (jsonInputA and jsonInputB)
    setupSyncScroll('jsonInputA', 'jsonInputB', 'syncToggleInputs');

    // Setup sync scroll for outputs (jsonParsedA and jsonParsedB)
    setupSyncScroll('jsonParsedA', 'jsonParsedB', 'syncToggleOutputs');

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

    // Setup auto-save for all inputs
    setupAutoSave('jsonInput', STORAGE_KEYS.JSON_INPUT);
    setupAutoSave('jsonInputA', STORAGE_KEYS.JSON_INPUT_A);
    setupAutoSave('jsonInputB', STORAGE_KEYS.JSON_INPUT_B);
});
