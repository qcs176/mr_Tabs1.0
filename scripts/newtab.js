import { SEARCH_ENGINES } from "./config.js";
import { loadState, saveState } from "./storage.js";

const I18N = {
  "zh-CN": {
    searchPlaceholder: "搜索网页",
    settingsTitle: "设置",
    personalizationTitle: "个性化",
    bgTitle: "背景",
    uploadImage: "上传图片",
    clearBackground: "清除背景",
    languageTitle: "语言",
    searchAria: "搜索",
    openSettingsAria: "打开设置",
    closeSettingsAria: "关闭设置",
    themeToggleAria: "切换浅色或深色模式"
  },
  en: {
    searchPlaceholder: "Search the web",
    settingsTitle: "Settings",
    personalizationTitle: "Personalization",
    bgTitle: "Background",
    uploadImage: "Upload Image",
    clearBackground: "Clear Background",
    languageTitle: "Language",
    searchAria: "Search",
    openSettingsAria: "Open settings",
    closeSettingsAria: "Close settings",
    themeToggleAria: "Toggle light or dark mode"
  }
};

const searchForm = document.getElementById("searchForm");
const engineSelect = document.getElementById("engineSelect");
const enginePicker = document.getElementById("enginePicker");
const enginePickerButton = document.getElementById("enginePickerButton");
const enginePickerBadge = document.getElementById("enginePickerBadge");
const enginePickerLabel = document.getElementById("enginePickerLabel");
const enginePickerMenu = document.getElementById("enginePickerMenu");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const themeToggle = document.getElementById("themeToggle");
const settingsToggle = document.getElementById("settingsToggle");
const settingsPanel = document.getElementById("settingsPanel");
const settingsClose = document.getElementById("settingsClose");
const settingsResizeHandle = document.getElementById("settingsResizeHandle");
const settingsTitle = document.getElementById("settingsTitle");
const tabPersonalization = document.getElementById("tabPersonalization");
const settingsTabPersonalization = document.getElementById("settingsTabPersonalization");
const backgroundTitle = document.getElementById("backgroundTitle");
const uploadLabel = document.getElementById("uploadLabel");
const backgroundInput = document.getElementById("backgroundInput");
const clearBackground = document.getElementById("clearBackground");
const languageTitle = document.getElementById("languageTitle");
const languageSelect = document.getElementById("languageSelect");

let state;

function getLangPack(language) {
  return I18N[language] || I18N.en;
}

function getEngine(engineKey) {
  return SEARCH_ENGINES.find((item) => item.key === engineKey) || SEARCH_ENGINES[0];
}

function getEngineBadgeClass(engineKey) {
  return `engine-${engineKey}`;
}

function closeEngineMenu() {
  enginePickerMenu.classList.remove("open");
  enginePickerMenu.setAttribute("aria-hidden", "true");
  enginePickerButton.setAttribute("aria-expanded", "false");
}

function openEngineMenu() {
  enginePickerMenu.classList.add("open");
  enginePickerMenu.setAttribute("aria-hidden", "false");
  enginePickerButton.setAttribute("aria-expanded", "true");
}

function setEngineUi(engineKey) {
  const engine = getEngine(engineKey);
  engineSelect.value = engine.key;
  enginePickerBadge.className = `engine-badge ${getEngineBadgeClass(engine.key)}`;
  enginePickerBadge.textContent = engine.icon;
  enginePickerLabel.textContent = engine.name;

  const buttons = enginePickerMenu.querySelectorAll(".engine-option");
  buttons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.engineKey === engine.key);
  });
}

function renderEnginePicker(selectedKey) {
  enginePickerMenu.innerHTML = "";

  for (const engine of SEARCH_ENGINES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "engine-option";
    button.dataset.engineKey = engine.key;

    const badge = document.createElement("span");
    badge.className = `engine-badge ${getEngineBadgeClass(engine.key)}`;
    badge.textContent = engine.icon;

    const label = document.createElement("span");
    label.textContent = engine.name;

    button.appendChild(badge);
    button.appendChild(label);
    enginePickerMenu.appendChild(button);

    button.addEventListener("click", async () => {
      state = await saveState({ engine: engine.key });
      setEngineUi(state.engine);
      closeEngineMenu();
    });
  }

  setEngineUi(selectedKey);
}

function applyTheme(theme) {
  document.body.classList.toggle("theme-dark", theme === "dark");
}

function applyBackground(dataUrl) {
  document.body.style.backgroundImage = dataUrl ? `url("${dataUrl}")` : "";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
}

function applySettingsWidth(width) {
  const safeWidth = Math.min(Math.max(width || 420, 320), Math.floor(window.innerWidth * 0.76));
  settingsPanel.style.width = `${safeWidth}px`;
}

function applyTab(tab) {
  const isPersonalization = tab !== "other";
  tabPersonalization.classList.toggle("is-active", isPersonalization);
  settingsTabPersonalization.classList.toggle("is-active", isPersonalization);
}

function applyLanguage(language) {
  const lang = getLangPack(language);
  document.documentElement.lang = language === "zh-CN" ? "zh-CN" : "en";

  searchInput.placeholder = lang.searchPlaceholder;
  settingsTitle.textContent = lang.settingsTitle;
  tabPersonalization.textContent = lang.personalizationTitle;
  backgroundTitle.textContent = lang.bgTitle;
  uploadLabel.textContent = lang.uploadImage;
  clearBackground.textContent = lang.clearBackground;
  languageTitle.textContent = lang.languageTitle;

  searchBtn.setAttribute("aria-label", lang.searchAria);
  settingsToggle.setAttribute("aria-label", lang.openSettingsAria);
  settingsClose.setAttribute("aria-label", lang.closeSettingsAria);
  themeToggle.setAttribute("aria-label", lang.themeToggleAria);

  languageSelect.value = language;
}

function openSettings() {
  settingsPanel.classList.add("open");
  settingsPanel.setAttribute("aria-hidden", "false");
}

function closeSettings() {
  settingsPanel.classList.remove("open");
  settingsPanel.setAttribute("aria-hidden", "true");
  closeEngineMenu();
}

function getEngineUrl(engineKey, query) {
  const engine = getEngine(engineKey);
  return `${engine.baseUrl}${encodeURIComponent(query)}`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function registerEnginePicker() {
  enginePickerButton.addEventListener("click", () => {
    const isOpen = enginePickerMenu.classList.contains("open");
    if (isOpen) {
      closeEngineMenu();
      return;
    }

    openEngineMenu();
  });

  document.addEventListener("click", (event) => {
    if (!enginePicker.contains(event.target)) {
      closeEngineMenu();
    }
  });
}

function registerSettingsResize() {
  let startX = 0;
  let startWidth = 0;

  const onMove = (event) => {
    const delta = startX - event.clientX;
    const nextWidth = startWidth + delta;
    applySettingsWidth(nextWidth);
  };

  const onUp = async () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);

    const width = parseInt(settingsPanel.style.width || "420", 10);
    state = await saveState({ settingsWidth: width });
  };

  settingsResizeHandle.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
    startWidth = settingsPanel.getBoundingClientRect().width;

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });
}

function registerSettingsTabs() {
  tabPersonalization.addEventListener("click", async () => {
    applyTab("personalization");
    state = await saveState({ settingsTab: "personalization" });
  });
}

async function init() {
  state = await loadState();

  renderEnginePicker(state.engine);
  registerEnginePicker();
  applyTheme(state.theme);
  applyBackground(state.backgroundDataUrl);
  applyLanguage(state.language || "zh-CN");
  applyTab(state.settingsTab || "personalization");
  applySettingsWidth(state.settingsWidth || 420);
  registerSettingsResize();
  registerSettingsTabs();

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) {
      return;
    }

    window.location.href = getEngineUrl(engineSelect.value, query);
  });

  themeToggle.addEventListener("click", async () => {
    const nextTheme = state.theme === "dark" ? "light" : "dark";
    state = await saveState({ theme: nextTheme });
    applyTheme(state.theme);
  });

  settingsToggle.addEventListener("click", openSettings);
  settingsClose.addEventListener("click", closeSettings);

  languageSelect.addEventListener("change", async () => {
    state = await saveState({ language: languageSelect.value });
    applyLanguage(state.language);
  });

  backgroundInput.addEventListener("change", async () => {
    const file = backgroundInput.files?.[0];
    if (!file) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    state = await saveState({ backgroundDataUrl: dataUrl });
    applyBackground(state.backgroundDataUrl);
    backgroundInput.value = "";
  });

  clearBackground.addEventListener("click", async () => {
    state = await saveState({ backgroundDataUrl: "" });
    applyBackground(state.backgroundDataUrl);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSettings();
      closeEngineMenu();
    }
  });
}

init();

