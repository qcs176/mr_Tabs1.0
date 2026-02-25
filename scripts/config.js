export const SEARCH_ENGINES = [
  { key: "google", name: "Google", icon: "G", baseUrl: "https://www.google.com/search?q=" },
  { key: "bing", name: "Bing", icon: "b", baseUrl: "https://www.bing.com/search?q=" },
  { key: "baidu", name: "Baidu", icon: "D", baseUrl: "https://www.baidu.com/s?wd=" },
  { key: "yandex", name: "Yandex", icon: "Y", baseUrl: "https://yandex.com/search/?text=" }
];

export const DEFAULT_STATE = {
  engine: "google",
  theme: "light",
  backgroundDataUrl: "",
  language: "zh-CN",
  settingsWidth: 420,
  settingsTab: "personalization",
  customEngines: []
};
