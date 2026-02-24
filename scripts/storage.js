import { DEFAULT_STATE } from "./config.js";

const STORAGE_KEY = "tabs_newtab_state_v1";

export async function loadState() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const stored = result?.[STORAGE_KEY] || {};
      resolve({ ...DEFAULT_STATE, ...stored });
    });
  });
}

export async function saveState(partialState) {
  const current = await loadState();
  const next = { ...current, ...partialState };

  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: next }, () => resolve(next));
  });
}
