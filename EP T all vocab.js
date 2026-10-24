// ==UserScript==
// @name         Education Perfect 
// @namespace    http://tampermonkey.net/
// @version      20.0
// @description  Bypasses copy protection + advanced human biomechanics (hand alternation, delayed typos, reading scaling)
// @match        https://app.educationperfect.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    // =========================================================================
    // PART 1: UNLOCK TEXT SELECTION, COPYING & RIGHT-CLICK
    // =========================================================================

    const epStyle = document.createElement('style');
    epStyle.innerHTML = `
      * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(epStyle);

    ['copy', 'cut', 'contextmenu', 'selectstart'].forEach(eventType => {
        document.addEventListener(eventType, (e) => {
            e.stopImmediatePropagation();
        }, true);
    });

    console.log("%c [EP Biomechanics 20.0] Human Biometric Engine Active ", "background: #111; color: #00ffaa; font-weight: bold; font-size: 13px;");

    // =========================================================================
    // PART 2: KEYBOARD BIOMECHANICS & NEUROLOGICAL LATENCY ENGINE
    // =========================================================================

    let isScriptEnabled = true;
    let isTyping = false;
    let typingTimer = null;
    let lastHandledPrompt = "";
    let compiledPairs = [];

    // QWERTY hand mapping for physical travel distance modeling
    const LEFT_HAND = new Set(['q','w','e','r','t','a','s','d','f','g','z','x','c','v','b']);
    const RIGHT_HAND = new Set(['y','u','i','o','p','h','j','k','l','n','m']);

    // Adjacent physical keys on QWERTY layout
    const keyboardAdjacency = {
        'a': ['s', 'q', 'z'], 'b': ['v', 'g', 'h', 'n'], 'c': ['x', 'd', 'v'],
        'd': ['s', 'e', 'r', 'f', 'c', 'x'], 'e': ['w', 'r', 'd', 's'],
        'f': ['d', 'r', 't', 'g', 'v', 'c'], 'g': ['f', 't', 'y', 'h', 'b', 'v'],
        'h': ['g', 'y', 'u', 'j', 'n', 'b'], 'i': ['u', 'o', 'k', 'j'],
        'j': ['h', 'u', 'i', 'k', 'n', 'm'], 'k': ['j', 'i', 'o', 'l', 'm'],
        'l': ['k', 'o', 'p'], 'm': ['n', 'j', 'k'], 'n': ['b', 'h', 'j', 'm'],
        'o': ['i', 'p', 'l', 'k'], 'p': ['o', 'l'], 'q': ['w', 'a'],
        'r': ['e', 't', 'f', 'd'], 's': ['a', 'w', 'e', 'd', 'x', 'z'],
        't': ['r', 'y', 'g', 'f'], 'u': ['y', 'i', 'j', 'h'],
        'v': ['c', 'f', 'g', 'b'], 'w': ['q', 'e', 's', 'a'],
        'x': ['z', 's', 'd', 'c'], 'y': ['t', 'u', 'h', 'g'],
        'z': ['a', 's', 'x']
    };

    // Common muscle-memory rolls (digraphs)
    const fastDigraphs = new Set([
        "th", "he", "in", "er", "an", "re", "ed", "on", "es", "st", "en", "at",
        "to", "nt", "ha", "nd", "ou", "ea", "ng", "as", "or", "ti", "is", "et",
        "it", "ar", "te", "se", "hi", "of", "qu", "el", "la", "al", "de", "co"
    ]);

    // Log-Normal Latency Generator (reproduces natural human typing distributions)
    function getLogNormalLatency(median, variance) {
        const u1 = 1 - Math.random();
        const u2 = 1 - Math.random();
        const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        return Math.max(55, Math.floor(median * Math.exp(variance * randStdNormal)));
    }

    // ADVANCED HUMAN TYPING SIMULATOR
    async function humanTypeAdvanced(element, text) {
        if (isTyping) return;
        isTyping = true; // Mutex Lock

        try {
            element.focus();
            element.value = "";
            element.dispatchEvent(new Event('input', { bubbles: true }));

            // Variable pace factor per question (some questions typed slightly faster/slower)
            const sessionPace = 0.88 + Math.random() * 0.24; // 0.88x to 1.12x

            let i = 0;
            while (i < text.length) {
                const char = text[i];
                const lowerChar = char.toLowerCase();
                const prevChar = i > 0 ? text[i - 1].toLowerCase() : "";
                const bigram = prevChar + lowerChar;
                const isUpper = (char !== lowerChar && char.toUpperCase() === char);

                // 1. SHIFT KEY HESITATION (Extra time to reach for physical shift key)
                if (isUpper) {
                    await new Promise(r => setTimeout(r, Math.floor(Math.random() * 80) + 90));
                }

                // 2. SIMULATED HUMAN TYPOS (Delayed multi-backspace or instant slip)
                const canMakeTypo = i > 1 && i < text.length - 2 && keyboardAdjacency[lowerChar];
                if (canMakeTypo && Math.random() < 0.032) {
                    const adjacentKeys = keyboardAdjacency[lowerChar];
                    const typoChar = adjacentKeys[Math.floor(Math.random() * adjacentKeys.length)];

                    // Decide between instant catch vs delayed runaway typo
                    if (Math.random() < 0.45 && i < text.length - 3) {
                        // --- RUNAWAY TYPO: Slips, types 1 more letter, then notices & double-backspaces ---
                        const nextChar = text[i + 1];
                        element.value += typoChar;
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        await new Promise(r => setTimeout(r, Math.floor(Math.random() * 70) + 110));

                        // Accidental continuation letter
                        element.value += nextChar;
                        element.dispatchEvent(new Event('input', { bubbles: true }));

                        // Human reaction time: "Wait, I made a mistake" (220ms - 360ms)
                        await new Promise(r => setTimeout(r, Math.floor(Math.random() * 140) + 220));

                        // Backspace 1
                        element.value = element.value.slice(0, -1);
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        await new Promise(r => setTimeout(r, Math.floor(Math.random() * 50) + 90));

                        // Backspace 2
                        element.value = element.value.slice(0, -1);
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        await new Promise(r => setTimeout(r, Math.floor(Math.random() * 60) + 120));
                    } else {
                        // --- INSTANT TYPO: Single slip & quick correction ---
                        element.value += typoChar;
                        element.dispatchEvent(new Event('input', { bubbles: true }));

                        // Reaction time (130ms - 220ms)
                        await new Promise(r => setTimeout(r, Math.floor(Math.random() * 90) + 130));

                        // Backspace
                        element.value = element.value.slice(0, -1);
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        await new Promise(r => setTimeout(r, Math.floor(Math.random() * 60) + 90));
                    }
                }

                // 3. TYPE THE INTENDED CHARACTER
                element.value += char;
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));

                // 4. BIOMECHANICAL LATENCY CALCULATION
                let baseLatency = getLogNormalLatency(168, 0.22); // Human log-normal curve

                // Physical Hand Dynamics:
                const prevHand = LEFT_HAND.has(prevChar) ? 'L' : (RIGHT_HAND.has(prevChar) ? 'R' : null);
                const currHand = LEFT_HAND.has(lowerChar) ? 'L' : (RIGHT_HAND.has(lowerChar) ? 'R' : null);

                if (prevHand && currHand) {
                    if (prevHand === currHand) {
                        baseLatency *= 1.18; // Same hand finger-travel delay (+18%)
                    } else {
                        baseLatency *= 0.84; // Alternating hand roll speedup (-16%)
                    }
                }

                // Double letter bounce (e.g. "ll", "ee", "ss")
                if (prevChar === lowerChar && lowerChar.length > 0) {
                    baseLatency *= 0.68; // Rapid key bounce
                }

                // High-frequency muscle memory digraph acceleration
                if (fastDigraphs.has(bigram)) {
                    baseLatency *= 0.65;
                }

                // Apply session pace factor
                let finalDelay = Math.floor(baseLatency * sessionPace);

                // Word boundary pause (Spacebar thumb transition)
                if (char === " ") {
                    finalDelay += Math.floor(Math.random() * 90) + 80;
                }

                // Punctuation reading/thinking pause
                if (/[.,!?;:]/.test(char)) {
                    finalDelay += Math.floor(Math.random() * 160) + 200;
                }

                // Natural human cognitive hesitation (~2.5% chance)
                if (Math.random() < 0.025) {
                    finalDelay += Math.floor(Math.random() * 220) + 260;
                }

                await new Promise(resolve => setTimeout(resolve, finalDelay));
                i++;
            }

            console.log(`%c [EP Biometrics] Finished typing "${text}"! Press Enter.`, "color: #00ffaa; font-weight: bold;");
        } finally {
            isTyping = false; // Release lock
        }
    }

    // =========================================================================
    // PART 3: STRING NORMALIZATION & DICTIONARY PIPELINE
    // =========================================================================

    function cleanSpaces(str) {
        if (!str) return "";
        return str
            .replace(/[\u00A0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    // STRICT: Only keep the answer BEFORE the semicolon ';'
    function cleanAnswer(ans) {
        if (!ans) return "";
        let primary = ans.split(";")[0].trim();
        primary = primary.split("|")[0].trim();
        return primary.replace(/\s*\([^)]*\)/g, "").trim();
    }

    // Normalizes sentences: removes blanks (_____ or ________) and punctuation
    function normalizeSentence(str) {
        if (!str) return "";
        return cleanSpaces(str)
            .replace(/_{2,}|…|\[\.\.\.\]|\.{3,}|\[blank\]/g, " ")
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
            .trim();
    }

    function parseTwoLineFormat(rawText) {
        if (!rawText) return {};
        const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const result = {};

        for (let i = 0; i < lines.length - 1; i += 2) {
            const word = cleanSpaces(lines[i]);
            const context = cleanAnswer(lines[i + 1]);
            if (word && context) {
                result[word] = context;
            }
        }
        return result;
    }

    function compileDatabase() {
        const rawJson = GM_getValue("ep_shared_vocab", "{}");
        let vocabObj = {};
        try {
            vocabObj = JSON.parse(rawJson);
        } catch(e) {
            vocabObj = {};
        }

        const newPairs = [];
        for (const [word, context] of Object.entries(vocabObj)) {
            const cleanW = cleanAnswer(word);
            const cleanC = cleanAnswer(context);

            // Direction 1: Sentence with blank -> Word
            newPairs.push({
                isSentence: true,
                pattern: normalizeSentence(cleanC),
                answer: cleanW
            });

            // Direction 2: Word -> Sentence
            newPairs.push({
                isSentence: false,
                pattern: cleanW.toLowerCase(),
                answer: cleanC
            });
        }

        newPairs.sort((a, b) => b.pattern.length - a.pattern.length);
        compiledPairs = newPairs;
        console.log(`%c [EP Database] Compiled: ${Object.keys(vocabObj).length} words (${compiledPairs.length} active routes).`, "color: #00ffaa; font-weight: bold;");
    }

    // TAMPERMONKEY EXTENSION MENU
    if (typeof GM_registerMenuCommand !== "undefined") {
        GM_registerMenuCommand("📥 Paste / Import Vocab List", function() {
            const raw = prompt("Paste your vocabulary list below:\n(Format: Word on line 1, Sentence/Definition on line 2)");
            if (raw && raw.trim()) {
                const parsed = parseTwoLineFormat(raw);
                const count = Object.keys(parsed).length;
                if (count > 0) {
                    GM_setValue("ep_shared_vocab", JSON.stringify(parsed));
                    compileDatabase();
                    alert(`Loaded ${count} words! Ready to go.`);
                } else {
                    alert("No valid pairs detected. Check your format.");
                }
            }
        });

        GM_registerMenuCommand("📊 Check Current Word Count", function() {
            const rawJson = GM_getValue("ep_shared_vocab", "{}");
            try {
                const count = Object.keys(JSON.parse(rawJson)).length;
                alert(`You currently have ${count} words loaded in memory.`);
            } catch(e) {
                alert("No words loaded in memory.");
            }
        });

        GM_registerMenuCommand("🗑️ Clear All Words", function() {
            if (confirm("Are you sure you want to clear all loaded vocabulary?")) {
                GM_setValue("ep_shared_vocab", "{}");
                compileDatabase();
                alert("Vocabulary memory cleared.");
            }
        });
    }

    compileDatabase();

    // Silent Alt+S toggle (Pause / Resume)
    window.addEventListener('keydown', function(e) {
        if (e.altKey && (e.key === 's' || e.key === 'S')) {
            isScriptEnabled = !isScriptEnabled;
            if (typingTimer) {
                clearTimeout(typingTimer);
                typingTimer = null;
            }
            console.log(`%c [Helper] ${isScriptEnabled ? 'ENABLED' : 'PAUSED'}`, "color: yellow; font-weight: bold;");
        }
    });

    // =========================================================================
    // PART 4: SCHEDULING & READING TIME ENGINE
    // =========================================================================

    function calculateReadingDelay(promptText) {
        // Base perception latency: ~1400ms - 1900ms
        let delay = Math.floor(Math.random() * 500) + 1400;

        // Approximate reading speed (~250 words per minute ≈ 4 words/sec)
        const wordsInPrompt = promptText.split(/\s+/).filter(Boolean).length;
        delay += Math.floor(wordsInPrompt * (Math.random() * 50 + 130));

        // Safety clamping: between 1.6s (short prompt) and 4.2s (long complex sentence)
        return Math.min(4200, Math.max(1600, delay));
    }

    function scheduleTyping(targetText, matchedPattern, promptText) {
        if (!isScriptEnabled || isTyping) return;

        // Block duplicate runs on same question
        if (lastHandledPrompt === matchedPattern) return;
        lastHandledPrompt = matchedPattern;

        if (typingTimer) {
            clearTimeout(typingTimer);
            typingTimer = null;
        }

        // Dynamically scaled reading latency based on prompt complexity
        const readingDelay = calculateReadingDelay(promptText);

        typingTimer = setTimeout(async () => {
            if (isTyping) return;
            const activeEl = document.activeElement;

            // Safe human requirement: only activates when box is clicked
            if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
                if (activeEl.value.trim().toLowerCase() !== targetText.toLowerCase()) {
                    await humanTypeAdvanced(activeEl, targetText);
                }
            }
        }, readingDelay);
    }

    function checkPage() {
        if (!isScriptEnabled || isTyping || compiledPairs.length === 0) return;

        const containers = document.querySelectorAll('#question-text, .question-text, [data-automation-id="question-text"], .prompt-text, .targetLanguage, span[style*="border-bottom"]');
        let rawTexts = [];
        containers.forEach(c => {
            const t = (c.innerText || c.textContent || "").trim();
            if (t.length > 2) rawTexts.push(t);
        });

        if (rawTexts.length === 0) {
            rawTexts.push(document.body.innerText || "");
        }

        for (const fullText of rawTexts) {
            const normalizedScreen = normalizeSentence(fullText);
            const lowerScreen = fullText.toLowerCase();

            for (const item of compiledPairs) {
                if (item.isSentence) {
                    if (normalizedScreen.includes(item.pattern) || (normalizedScreen.length > 15 && item.pattern.includes(normalizedScreen))) {
                        scheduleTyping(item.answer, item.pattern, fullText);
                        return;
                    }
                } else {
                    const wordRegex = new RegExp(`(^|\\W)${item.pattern}(\\W|$)`, 'i');
                    if (wordRegex.test(lowerScreen)) {
                        scheduleTyping(item.answer, item.pattern, fullText);
                        return;
                    }
                }
            }
        }
    }

    setInterval(checkPage, 500);
})();