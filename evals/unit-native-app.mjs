// nativeApp.js: iOS / Android kabuğu algılama (web'de hiçbiri true olmamalı)
import assert from "node:assert/strict";
const setUA = (ua) => { Object.defineProperty(globalThis, "navigator", { value: { userAgent: ua }, configurable: true, writable: true }); };
const { isIosApp, isAndroidApp, isStoreApp } = await import("../lib/nativeApp.js");

setUA("Mozilla/5.0 (iPhone) Safari");
assert.deepEqual([isIosApp(), isAndroidApp(), isStoreApp()], [false, false, false], "normal Safari mağaza uygulaması değil");
setUA("Mozilla/5.0 (Linux; Android 14) Chrome/120");
assert.deepEqual([isIosApp(), isAndroidApp(), isStoreApp()], [false, false, false], "normal Android Chrome mağaza uygulaması değil");
setUA("Mozilla/5.0 (iPhone) IsinnApp-iOS");
assert.deepEqual([isIosApp(), isAndroidApp(), isStoreApp()], [true, false, true]);
setUA("Mozilla/5.0 (Linux; Android 14) IsinnApp-Android");
assert.deepEqual([isIosApp(), isAndroidApp(), isStoreApp()], [false, true, true]);
console.log("native app algılama testleri geçti");
