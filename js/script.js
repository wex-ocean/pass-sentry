const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const togglePasswordBtn = document.getElementById("togglePassword");

const reqLength = document.getElementById("req-length");
const reqLower = document.getElementById("req-lower");
const reqUpper = document.getElementById("req-upper");
const reqNumber = document.getElementById("req-number");
const reqSpecial = document.getElementById("req-special");
const reqNoSpaces = document.getElementById("req-no-spaces");
const reqLong = document.getElementById("req-long");

const generateBtn = document.getElementById("generatePassword");
const copyBtn = document.getElementById("copyPassword");

const crackTimeEl = document.getElementById("crackTime");
const tipsEl = document.getElementById("tips");
const commonWarningEl = document.getElementById("commonWarning");

// Regex patterns
const lowerRegex = /[a-z]/;
const upperRegex = /[A-Z]/;
const numberRegex = /[0-9]/;
const specialRegex = /[!@#$%^&*]/;
const spaceRegex = /\s/;

// Small list of common passwords for warning
const commonPasswords = new Set([
  "123456",
  "123456789",
  "password",
  "12345",
  "12345678",
  "qwerty",
  "1234567",
  "111111",
  "123123",
  "abc123",
  "password1",
  "iloveyou",
  "admin",
  "welcome",
  "letmein"
]);

function setRequirementState(element, isMet) {
  if (!element) return;
  element.classList.toggle("met", isMet);
  element.classList.toggle("unmet", !isMet);
  const iconSpan = element.querySelector(".icon");
  if (iconSpan) {
    iconSpan.textContent = isMet ? "✔" : "✖";
  }
}

function updateStrength(password) {
  const length = password.length;

  const hasLower = lowerRegex.test(password);
  const hasUpper = upperRegex.test(password);
  const hasNumber = numberRegex.test(password);
  const hasSpecial = specialRegex.test(password);
  const hasSpace = spaceRegex.test(password);
  const hasMinLength = length >= 8;
  const hasLongBonus = length >= 12;

  // Score calculation (0–6)
  let score = 0;
  if (hasMinLength) score += 1;
  if (hasLongBonus) score += 1;
  if (hasLower) score += 1;
  if (hasUpper) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecial) score += 1;

  // Requirements checklist
  setRequirementState(reqLength, hasMinLength);
  setRequirementState(reqLower, hasLower);
  setRequirementState(reqUpper, hasUpper);
  setRequirementState(reqNumber, hasNumber);
  setRequirementState(reqSpecial, hasSpecial);
  setRequirementState(reqNoSpaces, !hasSpace);
  setRequirementState(reqLong, hasLongBonus);

  // Strength meter mapping
  let label = "Very Weak";
  let width = 0;
  let color = "#ef4444"; // red

  if (!password) {
    label = "-";
    width = 0;
    color = "#374151";
  } else if (score <= 1) {
    label = "Very Weak";
    width = 20;
    color = "#ef4444"; // red
  } else if (score === 2) {
    label = "Weak";
    width = 40;
    color = "#f97316"; // orange
  } else if (score === 3) {
    label = "Fair";
    width = 60;
    color = "#eab308"; // yellow
  } else if (score === 4) {
    label = "Strong";
    width = 80;
    color = "#4ade80"; // light green
  } else {
    label = "Very Strong";
    width = 100;
    color = "#22c55e"; // bright green
  }

  strengthBar.style.width = `${width}%`;
  strengthBar.style.backgroundColor = color;
  strengthText.textContent = `Strength: ${label}`;

  updateCrackTime(label, password);
  updateCommonWarning(password);
  updateTips({
    password,
    hasMinLength,
    hasLongBonus,
    hasLower,
    hasUpper,
    hasNumber,
    hasSpecial,
    hasSpace
  });
}

function updateCrackTime(strengthLabel, password) {
  let estimate;
  if (!password) {
    estimate = "N/A";
  } else {
    // Approximate based on strength label (simple mapping)
    switch (strengthLabel) {
      case "Very Weak":
        estimate = "Instantly";
        break;
      case "Weak":
        estimate = "A few seconds";
        break;
      case "Fair":
        estimate = "Minutes to hours";
        break;
      case "Strong":
        estimate = "Days to years";
        break;
      case "Very Strong":
        estimate = "Centuries or longer (in theory)";
        break;
      default:
        estimate = "N/A";
    }
  }
  crackTimeEl.textContent = `Estimated crack time: ${estimate}`;
}

function updateCommonWarning(password) {
  if (!password) {
    commonWarningEl.textContent = "";
    commonWarningEl.style.display = "none";
    return;
  }

  const normalized = password.toLowerCase().trim();
  if (commonPasswords.has(normalized)) {
    commonWarningEl.textContent =
      "This password is very common and easy to guess. Please choose something more unique.";
    commonWarningEl.style.display = "block";
  } else {
    commonWarningEl.textContent = "";
    commonWarningEl.style.display = "none";
  }
}

function updateTips(flags) {
  const {
    password,
    hasMinLength,
    hasLongBonus,
    hasLower,
    hasUpper,
    hasNumber,
    hasSpecial,
    hasSpace
  } = flags;

  if (!password) {
    tipsEl.textContent =
      "Tip: Use at least 12 characters with a mix of upper and lowercase letters, numbers, and special symbols.";
    return;
  }

  const suggestions = [];

  if (!hasMinLength) {
    suggestions.push("Use at least 8 characters.");
  } else if (!hasLongBonus) {
    suggestions.push("Use 12 or more characters for extra strength.");
  }

  if (!hasLower) suggestions.push("Add at least one lowercase letter (a–z).");
  if (!hasUpper) suggestions.push("Add at least one uppercase letter (A–Z).");
  if (!hasNumber) suggestions.push("Include at least one number (0–9).");
  if (!hasSpecial)
    suggestions.push("Include at least one special character (! @ # $ % ^ & *).");
  if (hasSpace) suggestions.push("Remove spaces from your password.");

  if (!suggestions.length) {
    tipsEl.textContent = "Nice! Your password meets all recommended criteria.";
  } else {
    tipsEl.textContent = "Tips: " + suggestions.join(" ");
  }
}

// Toggle password visibility
togglePasswordBtn.addEventListener("click", () => {
  const isPassword = passwordInput.getAttribute("type") === "password";
  passwordInput.setAttribute("type", isPassword ? "text" : "password");
  togglePasswordBtn.classList.toggle("visible", isPassword);
  togglePasswordBtn.setAttribute("aria-pressed", isPassword ? "true" : "false");
  togglePasswordBtn.setAttribute(
    "aria-label",
    isPassword ? "Hide password" : "Show password"
  );
});

// Real-time strength checking
passwordInput.addEventListener("input", () => {
  const value = passwordInput.value;
  updateStrength(value);
  copyBtn.disabled = value.length === 0;
});

// Password generator
function generateStrongPassword() {
  const length = 14; // default generated length
  const lowers = "abcdefghijklmnopqrstuvwxyz";
  const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specials = "!@#$%^&*";

  const allChars = lowers + uppers + numbers + specials;

  let passwordChars = [];

  // Ensure at least one of each category
  passwordChars.push(lowers[Math.floor(Math.random() * lowers.length)]);
  passwordChars.push(uppers[Math.floor(Math.random() * uppers.length)]);
  passwordChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
  passwordChars.push(specials[Math.floor(Math.random() * specials.length)]);

  // Fill remaining characters
  for (let i = passwordChars.length; i < length; i++) {
    passwordChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Shuffle characters (Fisher–Yates)
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join("");
}

generateBtn.addEventListener("click", () => {
  const generated = generateStrongPassword();
  passwordInput.value = generated;
  if (passwordInput.getAttribute("type") !== "password") {
    // Keep visible state consistent
    togglePasswordBtn.classList.add("visible");
    togglePasswordBtn.setAttribute("aria-pressed", "true");
    togglePasswordBtn.setAttribute("aria-label", "Hide password");
  }
  updateStrength(generated);
  copyBtn.disabled = false;
});

// Copy to clipboard
copyBtn.addEventListener("click", async () => {
  const value = passwordInput.value;
  if (!value) return;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      // Fallback for older browsers
      passwordInput.select();
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
    }

    const originalText = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    copyBtn.classList.add("copied");
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.classList.remove("copied");
    }, 1800);
  } catch (err) {
    console.error("Failed to copy password:", err);
  }
});