import { SEARCH_ENGINES } from "./config.js";
import { loadState, saveState } from "./storage.js";

const I18N = {
  "zh-CN": {
    searchPlaceholder: "搜索网页",
    settingsTitle: "设置",
    personalizationTitle: "个性化",
    enginesTitle: "搜索引擎",
    bgTitle: "背景",
    uploadImage: "上传图片",
    clearBackground: "清除背景",
    languageTitle: "语言",
    engineListTitle: "当前搜索引擎",
    addEngineTitle: "添加搜索引擎",
    engineNamePlaceholder: "引擎名称",
    engineIconPlaceholder: "图标（可选，1-2字符）",
    engineUrlPlaceholder: "搜索URL模板",
    addEngineBtn: "添加搜索引擎",
    invalidEngineInput: "请填写引擎名称和包含 {query} 的URL模板。",
    duplicateEngineName: "该搜索引擎名称已存在。",
    customTag: "自定义",
    builtInTag: "内置",
    weatherLoading: "天气获取中",
    weatherUnavailable: "天气不可用",
    weatherDenied: "位置权限被拒绝",
    weatherUnsupported: "设备不支持定位",
    weatherUnknown: "未知天气",
    weatherDialogTitle: "天气详情",
    weatherForecastTitle: "未来5天天气",
    weatherChartTitle: "温度变化曲线",
    weatherCloseAria: "关闭天气详情",
    weatherOpenAria: "打开天气详情",
    weatherTrendMax: "最高",
    weatherTrendMin: "最低",
    weatherLocationUnknown: "位置未知",
    searchAria: "搜索",
    openSettingsAria: "打开设置",
    closeSettingsAria: "关闭设置",
    themeToggleAria: "切换浅色或深色模式",
    weatherAria: "当前天气"
  },
  en: {
    searchPlaceholder: "Search the web",
    settingsTitle: "Settings",
    personalizationTitle: "Personalization",
    enginesTitle: "Search Engines",
    bgTitle: "Background",
    uploadImage: "Upload Image",
    clearBackground: "Clear Background",
    languageTitle: "Language",
    engineListTitle: "Current Engines",
    addEngineTitle: "Add Engine",
    engineNamePlaceholder: "Engine name",
    engineIconPlaceholder: "Icon (optional, 1-2 chars)",
    engineUrlPlaceholder: "Search URL template",
    addEngineBtn: "Add Search Engine",
    invalidEngineInput: "Please provide engine name and URL template with {query}.",
    duplicateEngineName: "This engine name already exists.",
    customTag: "Custom",
    builtInTag: "Built-in",
    weatherLoading: "Loading weather",
    weatherUnavailable: "Weather unavailable",
    weatherDenied: "Location denied",
    weatherUnsupported: "Geolocation unavailable",
    weatherUnknown: "Unknown",
    weatherDialogTitle: "Weather Details",
    weatherForecastTitle: "Next 5 Days",
    weatherChartTitle: "Temperature Trend",
    weatherCloseAria: "Close weather details",
    weatherOpenAria: "Open weather details",
    weatherTrendMax: "High",
    weatherTrendMin: "Low",
    weatherLocationUnknown: "Unknown location",
    searchAria: "Search",
    openSettingsAria: "Open settings",
    closeSettingsAria: "Close settings",
    themeToggleAria: "Toggle light or dark mode",
    weatherAria: "Current weather"
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
const weatherSummaryTrigger = document.getElementById("weatherSummaryTrigger");
const weatherModal = document.getElementById("weatherModal");
const weatherModalBackdrop = document.getElementById("weatherModalBackdrop");
const weatherModalClose = document.getElementById("weatherModalClose");
const weatherModalTitle = document.getElementById("weatherModalTitle");
const weatherModalDate = document.getElementById("weatherModalDate");
const weatherModalIcon = document.getElementById("weatherModalIcon");
const weatherModalLocation = document.getElementById("weatherModalLocation");
const weatherModalSummary = document.getElementById("weatherModalSummary");
const weatherForecastTitle = document.getElementById("weatherForecastTitle");
const weatherForecastList = document.getElementById("weatherForecastList");
const weatherChartTitle = document.getElementById("weatherChartTitle");
const weatherChart = document.getElementById("weatherChart");
const themeToggle = document.getElementById("themeToggle");
const settingsToggle = document.getElementById("settingsToggle");
const settingsPanel = document.getElementById("settingsPanel");
const settingsClose = document.getElementById("settingsClose");
const settingsResizeHandle = document.getElementById("settingsResizeHandle");
const settingsTitle = document.getElementById("settingsTitle");
const tabPersonalization = document.getElementById("tabPersonalization");
const tabEngines = document.getElementById("tabEngines");
const settingsTabPersonalization = document.getElementById("settingsTabPersonalization");
const settingsTabEngines = document.getElementById("settingsTabEngines");
const backgroundTitle = document.getElementById("backgroundTitle");
const uploadLabel = document.getElementById("uploadLabel");
const backgroundInput = document.getElementById("backgroundInput");
const clearBackground = document.getElementById("clearBackground");
const languageTitle = document.getElementById("languageTitle");
const languageSelect = document.getElementById("languageSelect");
const engineListTitle = document.getElementById("engineListTitle");
const engineListPicker = document.getElementById("engineListPicker");
const engineListPickerButton = document.getElementById("engineListPickerButton");
const engineListPickerBadge = document.getElementById("engineListPickerBadge");
const engineListPickerLabel = document.getElementById("engineListPickerLabel");
const engineListPickerMenu = document.getElementById("engineListPickerMenu");
const addEngineTitle = document.getElementById("addEngineTitle");
const newEngineName = document.getElementById("newEngineName");
const newEngineIcon = document.getElementById("newEngineIcon");
const newEngineUrl = document.getElementById("newEngineUrl");
const addEngineBtn = document.getElementById("addEngineBtn");

let state;
let clockTimerId = null;
let weatherTimerId = null;
let lastWeather = null;
let lastPosition = null;
let lastLocationLabel = "";
let lastLocationRefreshAt = 0;

const WEATHER_REFRESH_MS = 15 * 60 * 1000;
const LOCATION_REFRESH_MS = 60 * 60 * 1000;

const WEATHER_CODE_META = {
  0: { iconDay: "☀", iconNight: "🌙", zh: "晴", en: "Clear" },
  1: { iconDay: "🌤", iconNight: "☁", zh: "晴间多云", en: "Mostly clear" },
  2: { iconDay: "⛅", iconNight: "☁", zh: "多云", en: "Partly cloudy" },
  3: { iconDay: "☁", iconNight: "☁", zh: "阴天", en: "Overcast" },
  45: { iconDay: "🌫", iconNight: "🌫", zh: "有雾", en: "Fog" },
  48: { iconDay: "🌫", iconNight: "🌫", zh: "冻雾", en: "Rime fog" },
  51: { iconDay: "🌦", iconNight: "🌦", zh: "小毛毛雨", en: "Light drizzle" },
  53: { iconDay: "🌦", iconNight: "🌦", zh: "毛毛雨", en: "Drizzle" },
  55: { iconDay: "🌧", iconNight: "🌧", zh: "大毛毛雨", en: "Dense drizzle" },
  56: { iconDay: "🌧", iconNight: "🌧", zh: "冻毛毛雨", en: "Freezing drizzle" },
  57: { iconDay: "🌧", iconNight: "🌧", zh: "强冻毛毛雨", en: "Dense freezing drizzle" },
  61: { iconDay: "🌦", iconNight: "🌦", zh: "小雨", en: "Light rain" },
  63: { iconDay: "🌧", iconNight: "🌧", zh: "中雨", en: "Rain" },
  65: { iconDay: "🌧", iconNight: "🌧", zh: "大雨", en: "Heavy rain" },
  66: { iconDay: "🌧", iconNight: "🌧", zh: "冻雨", en: "Freezing rain" },
  67: { iconDay: "🌧", iconNight: "🌧", zh: "强冻雨", en: "Heavy freezing rain" },
  71: { iconDay: "🌨", iconNight: "🌨", zh: "小雪", en: "Light snow" },
  73: { iconDay: "🌨", iconNight: "🌨", zh: "中雪", en: "Snow" },
  75: { iconDay: "❄", iconNight: "❄", zh: "大雪", en: "Heavy snow" },
  77: { iconDay: "❄", iconNight: "❄", zh: "阵雪粒", en: "Snow grains" },
  80: { iconDay: "🌦", iconNight: "🌦", zh: "小阵雨", en: "Light showers" },
  81: { iconDay: "🌧", iconNight: "🌧", zh: "阵雨", en: "Showers" },
  82: { iconDay: "⛈", iconNight: "⛈", zh: "强阵雨", en: "Heavy showers" },
  85: { iconDay: "🌨", iconNight: "🌨", zh: "小阵雪", en: "Light snow showers" },
  86: { iconDay: "❄", iconNight: "❄", zh: "强阵雪", en: "Heavy snow showers" },
  95: { iconDay: "⛈", iconNight: "⛈", zh: "雷暴", en: "Thunderstorm" },
  96: { iconDay: "⛈", iconNight: "⛈", zh: "雷暴冰雹", en: "Thunderstorm hail" },
  99: { iconDay: "⛈", iconNight: "⛈", zh: "强雷暴冰雹", en: "Severe thunderstorm hail" }
};

function getLangPack(language) {
  return I18N[language] || I18N.en;
}

function getLocale(language) {
  return language === "zh-CN" ? "zh-CN" : "en-US";
}

function formatTopTime(date, language) {
  const locale = getLocale(language);
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: language !== "zh-CN"
  }).format(date);
}

function updateDateTimeDisplay() {
  const language = state?.language || "zh-CN";
  const now = new Date();
  const timeLine = weatherSummaryTrigger.querySelector(".summary-time-line");
  if (!timeLine) {
    return;
  }
  timeLine.textContent = formatTopTime(now, language);
}

function formatModalDate(date, language) {
  const locale = getLocale(language);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: language !== "zh-CN"
  }).format(date);
}

function startClock() {
  if (clockTimerId) {
    clearInterval(clockTimerId);
  }
  updateDateTimeDisplay();
  clockTimerId = window.setInterval(updateDateTimeDisplay, 1000);
}

function getWeatherMeta(code) {
  return WEATHER_CODE_META[code] || null;
}

function formatForecastDayLabel(dateText, language) {
  const date = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }
  return new Intl.DateTimeFormat(getLocale(language), {
    weekday: "short",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function buildTemperatureChart(days, language) {
  if (!days.length) {
    weatherChart.innerHTML = "";
    return;
  }
  const lang = getLangPack(language);

  const width = 640;
  const height = 220;
  const padding = { top: 24, right: 24, bottom: 34, left: 24 };
  const values = days.flatMap((day) => [day.max, day.min]);
  const minTemp = Math.min(...values) - 2;
  const maxTemp = Math.max(...values) + 2;
  const span = Math.max(maxTemp - minTemp, 1);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const stepX = days.length > 1 ? plotWidth / (days.length - 1) : 0;

  const toX = (index) => padding.left + index * stepX;
  const toY = (temp) => padding.top + ((maxTemp - temp) / span) * plotHeight;

  const highPoints = days.map((day, index) => `${toX(index)},${toY(day.max)}`).join(" ");
  const lowPoints = days.map((day, index) => `${toX(index)},${toY(day.min)}`).join(" ");

  const yTicks = 4;
  const gridLines = Array.from({ length: yTicks + 1 }, (_, index) => {
    const y = padding.top + (plotHeight / yTicks) * index;
    return `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" class="chart-grid-line" />`;
  }).join("");

  const labels = days.map((day, index) => {
    const x = toX(index);
    const y = height - 12;
    return `<text x="${x}" y="${y}" text-anchor="middle" class="chart-day-label">${formatForecastDayLabel(day.date, language)}</text>`;
  }).join("");

  const highDots = days.map((day, index) => {
    const x = toX(index);
    const y = toY(day.max);
    return `<circle cx="${x}" cy="${y}" r="3.6" class="chart-dot chart-dot-high" />`;
  }).join("");

  const lowDots = days.map((day, index) => {
    const x = toX(index);
    const y = toY(day.min);
    return `<circle cx="${x}" cy="${y}" r="3.6" class="chart-dot chart-dot-low" />`;
  }).join("");

  weatherChart.innerHTML = `
    ${gridLines}
    <polyline points="${highPoints}" class="chart-line chart-line-high" />
    <polyline points="${lowPoints}" class="chart-line chart-line-low" />
    ${highDots}
    ${lowDots}
    <text x="26" y="16" class="chart-legend-high">${lang.weatherTrendMax}</text>
    <text x="76" y="16" class="chart-legend-low">${lang.weatherTrendMin}</text>
    ${labels}
  `;
}

function renderWeatherModal() {
  const language = state?.language || "zh-CN";
  const lang = getLangPack(language);
  weatherModalDate.textContent = formatModalDate(new Date(), language);
  weatherModalLocation.textContent = lastLocationLabel || lang.weatherLocationUnknown;

  if (!lastWeather || lastWeather.error) {
    weatherModalIcon.textContent = "!";
    const errorText = lastWeather?.errorKey ? lang[lastWeather.errorKey] : (lastWeather?.error || lang.weatherLoading);
    weatherModalSummary.textContent = errorText;
    weatherForecastList.innerHTML = "";
    weatherChart.innerHTML = "";
    return;
  }

  const meta = getWeatherMeta(lastWeather.weatherCode);
  const currentText = meta ? (language === "zh-CN" ? meta.zh : meta.en) : lang.weatherUnknown;
  const currentIcon = meta ? (lastWeather.isDay ? meta.iconDay : meta.iconNight) : "?";
  weatherModalIcon.textContent = currentIcon;
  weatherModalSummary.textContent = `${Math.round(lastWeather.temperature)}°C ${currentText}`;

  const forecastDays = (lastWeather.daily || []).slice(0, 6);
  weatherForecastList.innerHTML = forecastDays.map((day) => {
    const dayMeta = getWeatherMeta(day.weatherCode);
    const icon = dayMeta ? dayMeta.iconDay : "?";
    const label = formatForecastDayLabel(day.date, language);
    return `
      <article class="weather-day-card">
        <div class="weather-day-name">${label}</div>
        <div class="weather-day-icon">${icon}</div>
        <div class="weather-day-temp">${Math.round(day.min)}°C / ${Math.round(day.max)}°C</div>
      </article>
    `;
  }).join("");

  buildTemperatureChart(forecastDays, language);
}

function renderWeather() {
  if (!weatherSummaryTrigger) {
    return;
  }

  const lang = getLangPack(state?.language || "zh-CN");
  const iconEl = weatherSummaryTrigger.querySelector(".weather-icon");
  const textEl = weatherSummaryTrigger.querySelector(".weather-text");
  if (!iconEl || !textEl) {
    return;
  }

  if (!lastWeather) {
    iconEl.textContent = "?";
    textEl.textContent = lang.weatherLoading;
    weatherSummaryTrigger.setAttribute("aria-label", `${lang.weatherAria}: ${lang.weatherLoading}`);
    return;
  }

  if (lastWeather.error) {
    iconEl.textContent = "!";
    const errorText = lastWeather.errorKey ? lang[lastWeather.errorKey] : lastWeather.error;
    textEl.textContent = errorText;
    weatherSummaryTrigger.setAttribute("aria-label", `${lang.weatherAria}: ${errorText}`);
    return;
  }

  const meta = getWeatherMeta(lastWeather.weatherCode);
  const weatherText = meta ? (state?.language === "zh-CN" ? meta.zh : meta.en) : lang.weatherUnknown;
  const weatherIcon = meta ? (lastWeather.isDay ? meta.iconDay : meta.iconNight) : "?";
  const temperature = `${Math.round(lastWeather.temperature)}°C`;
  iconEl.textContent = weatherIcon;
  textEl.textContent = `${temperature} ${weatherText}`;
  weatherSummaryTrigger.setAttribute("aria-label", `${lang.weatherAria}: ${temperature}, ${weatherText}`);
}

async function fetchCurrentWeather(latitude, longitude) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "temperature_2m,weather_code,is_day");
  url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min");
  url.searchParams.set("forecast_days", "6");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Weather request failed: ${response.status}`);
  }

  const data = await response.json();
  const current = data?.current;
  const daily = data?.daily;
  if (!current || typeof current.temperature_2m !== "number" || typeof current.weather_code !== "number") {
    throw new Error("Invalid weather payload");
  }

  const dailyDays = Array.isArray(daily?.time) ? daily.time.map((date, index) => ({
    date,
    weatherCode: Number(daily.weather_code?.[index] ?? 0),
    max: Number(daily.temperature_2m_max?.[index] ?? current.temperature_2m),
    min: Number(daily.temperature_2m_min?.[index] ?? current.temperature_2m)
  })) : [];

  return {
    temperature: current.temperature_2m,
    weatherCode: current.weather_code,
    isDay: current.is_day === 1,
    daily: dailyDays
  };
}

async function fetchLocationLabel(latitude, longitude, language) {
  const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("localityLanguage", language === "zh-CN" ? "zh" : "en");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Location request failed: ${response.status}`);
  }

  const data = await response.json();
  const area = data.locality || data.city || "";
  const city = data.city || data.principalSubdivision || "";
  if (area && city && area !== city) {
    return `${city} ${area}`;
  }
  return area || city || data.countryName || "";
}

async function refreshLocationLabel(force = false) {
  if (!lastPosition) {
    return;
  }
  const now = Date.now();
  if (!force && lastLocationLabel && now - lastLocationRefreshAt < LOCATION_REFRESH_MS) {
    return;
  }

  try {
    const nextLabel = await fetchLocationLabel(lastPosition.latitude, lastPosition.longitude, state?.language || "zh-CN");
    if (nextLabel) {
      lastLocationLabel = nextLabel;
      lastLocationRefreshAt = now;
    }
  } catch {
    // Non-blocking: weather should still render even if reverse geocoding fails.
  }
}

function requestCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("geolocation_unsupported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 10 * 60 * 1000
    });
  });
}

async function refreshWeather() {
  const lang = getLangPack(state?.language || "zh-CN");
  try {
    const position = await requestCurrentPosition();
    lastPosition = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    await refreshLocationLabel();
    const weather = await fetchCurrentWeather(position.coords.latitude, position.coords.longitude);
    lastWeather = weather;
  } catch (error) {
    const code = error?.code;
    if (error?.message === "geolocation_unsupported") {
      lastWeather = { errorKey: "weatherUnsupported", error: lang.weatherUnsupported };
    } else if (code === 1) {
      lastWeather = { errorKey: "weatherDenied", error: lang.weatherDenied };
    } else {
      lastWeather = { errorKey: "weatherUnavailable", error: lang.weatherUnavailable };
    }
  }

  renderWeather();
  renderWeatherModal();
}

function startWeatherUpdates() {
  if (weatherTimerId) {
    clearInterval(weatherTimerId);
  }
  lastWeather = null;
  renderWeather();
  renderWeatherModal();
  refreshWeather();
  weatherTimerId = window.setInterval(refreshWeather, WEATHER_REFRESH_MS);
}

async function openWeatherModal() {
  weatherModal.hidden = false;
  weatherModal.setAttribute("aria-hidden", "false");
  await refreshLocationLabel(true);
  renderWeatherModal();
}

function closeWeatherModal() {
  weatherModal.hidden = true;
  weatherModal.setAttribute("aria-hidden", "true");
}

function registerWeatherModal() {
  weatherSummaryTrigger.addEventListener("click", () => {
    openWeatherModal();
    if (!lastWeather || lastWeather.error) {
      refreshWeather();
    }
  });
  weatherModalBackdrop.addEventListener("click", closeWeatherModal);
  weatherModalClose.addEventListener("click", closeWeatherModal);
}

function getAllEngines() {
  return [...SEARCH_ENGINES, ...(state.customEngines || [])];
}

function getEngine(engineKey) {
  return getAllEngines().find((item) => item.key === engineKey) || SEARCH_ENGINES[0];
}

function getEngineBadgeClass(engineKey) {
  const isBuiltIn = SEARCH_ENGINES.some((item) => item.key === engineKey);
  return isBuiltIn ? `engine-${engineKey}` : "engine-custom";
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

function closeCurrentEngineMenu() {
  engineListPickerMenu.classList.remove("open");
  engineListPickerMenu.setAttribute("aria-hidden", "true");
  engineListPickerButton.setAttribute("aria-expanded", "false");
}

function openCurrentEngineMenu() {
  engineListPickerMenu.classList.add("open");
  engineListPickerMenu.setAttribute("aria-hidden", "false");
  engineListPickerButton.setAttribute("aria-expanded", "true");
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

function setCurrentEngineUi(engineKey) {
  const engine = getEngine(engineKey);
  engineListPickerBadge.className = `engine-badge ${getEngineBadgeClass(engine.key)}`;
  engineListPickerBadge.textContent = engine.icon;
  engineListPickerLabel.textContent = engine.name;

  const buttons = engineListPickerMenu.querySelectorAll(".engine-option");
  buttons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.engineKey === engine.key);
  });
}

function renderEnginePicker(selectedKey) {
  enginePickerMenu.innerHTML = "";

  for (const engine of getAllEngines()) {
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
      setCurrentEngineUi(state.engine);
      closeEngineMenu();
    });
  }

  setEngineUi(selectedKey);
}

function renderEngineListSelect() {
  engineListPickerMenu.innerHTML = "";

  for (const engine of getAllEngines()) {
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
    engineListPickerMenu.appendChild(button);

    button.addEventListener("click", async () => {
      state = await saveState({ engine: engine.key });
      setEngineUi(state.engine);
      setCurrentEngineUi(state.engine);
      closeCurrentEngineMenu();
    });
  }

  setCurrentEngineUi(state.engine);
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
  const active = tab === "engines" ? "engines" : "personalization";
  tabPersonalization.classList.toggle("is-active", active === "personalization");
  tabEngines.classList.toggle("is-active", active === "engines");
  settingsTabPersonalization.classList.toggle("is-active", active === "personalization");
  settingsTabEngines.classList.toggle("is-active", active === "engines");
}

function applyLanguage(language) {
  const lang = getLangPack(language);
  document.documentElement.lang = language === "zh-CN" ? "zh-CN" : "en";

  searchInput.placeholder = lang.searchPlaceholder;
  settingsTitle.textContent = lang.settingsTitle;
  tabPersonalization.textContent = lang.personalizationTitle;
  tabEngines.textContent = lang.enginesTitle;
  backgroundTitle.textContent = lang.bgTitle;
  uploadLabel.textContent = lang.uploadImage;
  clearBackground.textContent = lang.clearBackground;
  languageTitle.textContent = lang.languageTitle;
  engineListTitle.textContent = lang.engineListTitle;
  addEngineTitle.textContent = lang.addEngineTitle;
  newEngineName.placeholder = lang.engineNamePlaceholder;
  newEngineIcon.placeholder = lang.engineIconPlaceholder;
  newEngineUrl.placeholder = lang.engineUrlPlaceholder;
  addEngineBtn.textContent = lang.addEngineBtn;

  searchBtn.setAttribute("aria-label", lang.searchAria);
  settingsToggle.setAttribute("aria-label", lang.openSettingsAria);
  settingsClose.setAttribute("aria-label", lang.closeSettingsAria);
  themeToggle.setAttribute("aria-label", lang.themeToggleAria);
  weatherSummaryTrigger.setAttribute("title", lang.weatherOpenAria);
  weatherSummaryTrigger.setAttribute("aria-label", `${lang.weatherAria}: ${lang.weatherLoading}`);
  weatherModalClose.setAttribute("aria-label", lang.weatherCloseAria);
  weatherModalTitle.textContent = lang.weatherDialogTitle;
  weatherForecastTitle.textContent = lang.weatherForecastTitle;
  weatherChartTitle.textContent = lang.weatherChartTitle;

  languageSelect.value = language;
  updateDateTimeDisplay();
  renderWeather();
  renderWeatherModal();
  renderEngineListSelect();
  refreshLocationLabel(true).then(renderWeatherModal);
}

function openSettings() {
  settingsPanel.classList.add("open");
  settingsPanel.setAttribute("aria-hidden", "false");
}

function closeSettings() {
  settingsPanel.classList.remove("open");
  settingsPanel.setAttribute("aria-hidden", "true");
  closeEngineMenu();
  closeCurrentEngineMenu();
}

function getEngineUrl(engineKey, query) {
  const engine = getEngine(engineKey);
  if (engine.baseUrl.includes("{query}")) {
    return engine.baseUrl.replace("{query}", encodeURIComponent(query));
  }
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
    if (!engineListPicker.contains(event.target)) {
      closeCurrentEngineMenu();
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

  tabEngines.addEventListener("click", async () => {
    applyTab("engines");
    state = await saveState({ settingsTab: "engines" });
  });
}

function registerEngineManager() {
  engineListPickerButton.addEventListener("click", () => {
    const isOpen = engineListPickerMenu.classList.contains("open");
    if (isOpen) {
      closeCurrentEngineMenu();
      return;
    }
    openCurrentEngineMenu();
  });

  addEngineBtn.addEventListener("click", async () => {
    const lang = getLangPack(state.language || "zh-CN");
    const name = newEngineName.value.trim();
    const icon = (newEngineIcon.value.trim() || name.slice(0, 1) || "E").slice(0, 2);
    const urlTemplate = newEngineUrl.value.trim();

    if (!name || !urlTemplate || !urlTemplate.includes("{query}")) {
      alert(lang.invalidEngineInput);
      return;
    }

    const duplicate = getAllEngines().some((item) => item.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
      alert(lang.duplicateEngineName);
      return;
    }

    const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const key = `custom-${safeName || "engine"}-${Date.now()}`;
    const customEngine = { key, name, icon, baseUrl: urlTemplate };
    const nextCustom = [...(state.customEngines || []), customEngine];

    state = await saveState({ customEngines: nextCustom });
    renderEnginePicker(state.engine);
    renderEngineListSelect();

    newEngineName.value = "";
    newEngineIcon.value = "";
    newEngineUrl.value = "";
  });
}

async function init() {
  state = await loadState();

  renderEnginePicker(state.engine);
  renderEngineListSelect();
  registerEnginePicker();
  registerEngineManager();
  registerWeatherModal();
  applyTheme(state.theme);
  applyBackground(state.backgroundDataUrl);
  applyLanguage(state.language || "zh-CN");
  applyTab(state.settingsTab || "personalization");
  applySettingsWidth(state.settingsWidth || 420);
  registerSettingsResize();
  registerSettingsTabs();
  startClock();
  startWeatherUpdates();

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
      closeCurrentEngineMenu();
      closeWeatherModal();
    }
  });
}

init();
