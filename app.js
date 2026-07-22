(() => {
  const COMMON = new Set([
    "password",
    "password1",
    "password123",
    "123456",
    "12345678",
    "123456789",
    "1234567890",
    "qwerty",
    "qwerty123",
    "abc123",
    "abcdef",
    "letmein",
    "welcome",
    "admin",
    "admin123",
    "login",
    "master",
    "dragon",
    "iloveyou",
    "monkey",
    "football",
    "baseball",
    "sunshine",
    "princess",
    "football1",
    "passw0rd",
    "p@ssw0rd",
    "p@ssword",
    "changeme",
    "trustno1",
    "shadow",
    "superman",
    "michael",
    "jennifer",
    "hunter2",
  ]);

  const SEQUENCES = [
    "abcdefghijklmnopqrstuvwxyz",
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm",
    "0123456789",
  ];

  const LEVELS = ["weak", "fair", "good", "strong"];
  const LABELS = {
    empty: "—",
    weak: "Weak",
    fair: "Fair",
    good: "Good",
    strong: "Strong",
  };

  const input = document.getElementById("password");
  const toggle = document.getElementById("toggle");
  const meterFill = document.getElementById("meter-fill");
  const strengthLabel = document.getElementById("strength-label");
  const tipEl = document.getElementById("tip");
  const checklist = document.getElementById("checklist");
  const ruleEls = {
    length: checklist.querySelector('[data-rule="length"]'),
    lower: checklist.querySelector('[data-rule="lower"]'),
    upper: checklist.querySelector('[data-rule="upper"]'),
    digit: checklist.querySelector('[data-rule="digit"]'),
    symbol: checklist.querySelector('[data-rule="symbol"]'),
  };

  function charLength(password) {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      return [...new Intl.Segmenter().segment(password)].length;
    }
    return Array.from(password).length;
  }

  function hasSequence(password) {
    const lower = password.toLowerCase();
    for (const seq of SEQUENCES) {
      for (let i = 0; i <= seq.length - 3; i++) {
        const chunk = seq.slice(i, i + 3);
        const rev = chunk.split("").reverse().join("");
        if (lower.includes(chunk) || lower.includes(rev)) return true;
      }
    }
    return false;
  }

  function hasRepeat(password) {
    const chars = Array.from(password);
    for (let i = 0; i < chars.length - 2; i++) {
      if (chars[i] === chars[i + 1] && chars[i] === chars[i + 2]) return true;
    }
    return false;
  }

  function analyze(password) {
    const length = charLength(password);
    const rules = {
      length: length >= 8,
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      digit: /\d/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    };

    if (!password) {
      return { level: "empty", tip: "", rules };
    }

    let score = 0;

    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;

    const variety =
      Number(rules.lower) +
      Number(rules.upper) +
      Number(rules.digit) +
      Number(rules.symbol);
    score += Math.max(0, variety - 1);

    const lower = password.toLowerCase();
    const common = COMMON.has(lower);
    const sequential = hasSequence(password);
    const repeated = hasRepeat(password);

    if (common) score -= 3;
    if (sequential) score -= 1;
    if (repeated) score -= 1;
    if (length < 8) score = Math.min(score, 0);
    if (length < 12) score = Math.min(score, 2);

    score = Math.max(0, Math.min(3, score));
    const level = LEVELS[score];

    let tip = "";
    if (common) {
      tip = "This is a commonly used password. Choose something unique.";
    } else if (length < 8) {
      tip = "Use at least 8 characters.";
    } else if (variety < 3) {
      tip = "Mix uppercase, lowercase, numbers, and symbols.";
    } else if (sequential || repeated) {
      tip = "Avoid sequences and repeated characters.";
    } else if (level === "fair" || level === "good") {
      tip = "Longer passwords are harder to crack.";
    }

    return { level, tip, rules };
  }

  function render(result) {
    const { level, tip, rules } = result;

    meterFill.dataset.level = level;
    strengthLabel.dataset.level = level === "empty" ? "" : level;
    strengthLabel.textContent = LABELS[level];
    tipEl.textContent = tip;

    for (const [key, el] of Object.entries(ruleEls)) {
      el.classList.toggle("met", Boolean(rules[key]));
    }
  }

  function onInput() {
    render(analyze(input.value));
  }

  toggle.addEventListener("click", () => {
    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    toggle.textContent = showing ? "Show" : "Hide";
    toggle.setAttribute("aria-pressed", String(!showing));
    toggle.setAttribute(
      "aria-label",
      showing ? "Show password" : "Hide password"
    );
    input.focus();
  });

  input.addEventListener("input", onInput);
  render(analyze(""));
})();
