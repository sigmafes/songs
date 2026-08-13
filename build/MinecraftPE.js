// include: shell.js
// include: minimum_runtime_check.js
// end include: minimum_runtime_check.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module != "undefined" ? Module : {};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).
// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = !!globalThis.window;

var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;

// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != "renderer";

var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

// Three configurations we can be running in:
// 1) We could be the application main() thread running in the main JS UI thread. (ENVIRONMENT_IS_WORKER == false and ENVIRONMENT_IS_PTHREAD == false)
// 2) We could be the application main() running directly in a worker. (ENVIRONMENT_IS_WORKER == true, ENVIRONMENT_IS_PTHREAD == false)
// 3) We could be an application pthread running in a worker. (ENVIRONMENT_IS_WORKER == true and ENVIRONMENT_IS_PTHREAD == true)
// The way we signal to a worker that it is hosting a pthread is to construct
// it with a specific name.
var ENVIRONMENT_IS_PTHREAD = ENVIRONMENT_IS_WORKER && globalThis.name == "em-pthread";

if (ENVIRONMENT_IS_NODE) {
  var worker_threads = require("node:worker_threads");
  globalThis.Worker = worker_threads.Worker;
  ENVIRONMENT_IS_WORKER = !worker_threads.isMainThread;
  // Under node we set `workerData` to `em-pthread` to signal that the worker
  // is hosting a pthread.
  ENVIRONMENT_IS_PTHREAD = ENVIRONMENT_IS_WORKER && worker_threads.workerData == "em-pthread";
}

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
// include: C:\Users\mafes\AppData\Local\Temp\tmpqskupgos.js
if (!Module["expectedDataFileDownloads"]) Module["expectedDataFileDownloads"] = 0;

Module["expectedDataFileDownloads"]++;

(() => {
  // Do not attempt to redownload the virtual filesystem data when in a pthread or a Wasm Worker context.
  var isPthread = typeof ENVIRONMENT_IS_PTHREAD != "undefined" && ENVIRONMENT_IS_PTHREAD;
  var isWasmWorker = typeof ENVIRONMENT_IS_WASM_WORKER != "undefined" && ENVIRONMENT_IS_WASM_WORKER;
  if (isPthread || isWasmWorker) return;
  var isNode = globalThis.process && globalThis.process.versions && globalThis.process.versions.node && globalThis.process.type != "renderer";
  async function loadPackage(metadata) {
    var PACKAGE_PATH = "";
    if (typeof window === "object") {
      PACKAGE_PATH = window["encodeURIComponent"](window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")) + "/");
    } else if (typeof process === "undefined" && typeof location !== "undefined") {
      // web worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.substring(0, location.pathname.lastIndexOf("/")) + "/");
    }
    var PACKAGE_NAME = "MinecraftPE.data";
    var REMOTE_PACKAGE_BASE = "MinecraftPE.data";
    var REMOTE_PACKAGE_NAME = Module["locateFile"] ? Module["locateFile"](REMOTE_PACKAGE_BASE, "") : REMOTE_PACKAGE_BASE;
    var REMOTE_PACKAGE_SIZE = metadata["remote_package_size"];
    async function fetchRemotePackage(packageName, packageSize) {
      if (isNode) {
        var contents = require("fs").readFileSync(packageName);
        return new Uint8Array(contents).buffer;
      }
      if (!Module["dataFileDownloads"]) Module["dataFileDownloads"] = {};
      try {
        var response = await fetch(packageName);
      } catch (e) {
        throw new Error(`Network Error: ${packageName}`, {
          e
        });
      }
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.url}`);
      }
      const chunks = [];
      const headers = response.headers;
      const total = Number(headers.get("Content-Length") || packageSize);
      let loaded = 0;
      Module["setStatus"] && Module["setStatus"]("Downloading data...");
      const reader = response.body.getReader();
      while (1) {
        var {done, value} = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        Module["dataFileDownloads"][packageName] = {
          loaded,
          total
        };
        let totalLoaded = 0;
        let totalSize = 0;
        for (const download of Object.values(Module["dataFileDownloads"])) {
          totalLoaded += download.loaded;
          totalSize += download.total;
        }
        Module["setStatus"] && Module["setStatus"](`Downloading data... (${totalLoaded}/${totalSize})`);
      }
      const packageData = new Uint8Array(chunks.map(c => c.length).reduce((a, b) => a + b, 0));
      let offset = 0;
      for (const chunk of chunks) {
        packageData.set(chunk, offset);
        offset += chunk.length;
      }
      return packageData.buffer;
    }
    var fetchPromise;
    var fetched = Module["getPreloadedPackage"] && Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);
    if (!fetched) {
      // Note that we don't use await here because we want to execute the
      // the rest of this function immediately.
      fetchPromise = fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);
    }
    async function runWithFS(Module) {
      function assert(check, msg) {
        if (!check) throw new Error(msg);
      }
      Module["FS_createPath"]("/", "data", true, true);
      Module["FS_createPath"]("/data", "app", true, true);
      Module["FS_createPath"]("/data/app", "ios", true, true);
      Module["FS_createPath"]("/data/app/ios", "dialog", true, true);
      Module["FS_createPath"]("/data/app/ios/dialog", "ipad", true, true);
      Module["FS_createPath"]("/data/app/ios", "dialog2", true, true);
      Module["FS_createPath"]("/data/app/ios", "icons", true, true);
      Module["FS_createPath"]("/data/app", "launch", true, true);
      Module["FS_createPath"]("/data", "fonts", true, true);
      Module["FS_createPath"]("/data", "images", true, true);
      Module["FS_createPath"]("/data/images", "armor", true, true);
      Module["FS_createPath"]("/data/images", "art", true, true);
      Module["FS_createPath"]("/data/images", "environment", true, true);
      Module["FS_createPath"]("/data/images", "font", true, true);
      Module["FS_createPath"]("/data/images", "gui", true, true);
      Module["FS_createPath"]("/data/images/gui", "badge", true, true);
      Module["FS_createPath"]("/data/images/gui", "logo", true, true);
      Module["FS_createPath"]("/data/images", "item", true, true);
      Module["FS_createPath"]("/data/images", "misc", true, true);
      Module["FS_createPath"]("/data/images", "mob", true, true);
      Module["FS_createPath"]("/data/images", "terrain", true, true);
      Module["FS_createPath"]("/data", "lang", true, true);
      Module["FS_createPath"]("/data", "sound", true, true);
      Module["FS_createPath"]("/data/sound", "aac", true, true);
      Module["FS_createPath"]("/data/sound/aac", "damage", true, true);
      Module["FS_createPath"]("/data/sound/aac", "mob", true, true);
      Module["FS_createPath"]("/data/sound/aac", "random", true, true);
      Module["FS_createPath"]("/data/sound/aac", "step", true, true);
      async function processPackageData(arrayBuffer) {
        assert(arrayBuffer, "Loading data file failed.");
        assert(arrayBuffer.constructor.name === ArrayBuffer.name, "bad input to processPackageData " + arrayBuffer.constructor.name);
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        // Reuse the bytearray from the XHR as the source for file reads.
        for (var file of metadata["files"]) {
          var name = file["filename"];
          var data = byteArray.subarray(file["start"], file["end"]);
          // canOwn this data in the filesystem, it is a slice into the heap that will never change
          Module["FS_createDataFile"](name, null, data, true, true, true);
        }
        Module["removeRunDependency"]("datafile_MinecraftPE.data");
      }
      Module["addRunDependency"]("datafile_MinecraftPE.data");
      if (!Module["preloadResults"]) Module["preloadResults"] = {};
      Module["preloadResults"][PACKAGE_NAME] = {
        fromCache: false
      };
      if (!fetched) {
        fetched = await fetchPromise;
      }
      await processPackageData(fetched);
    }
    // Detect whether the module JS file has already been loaded.
    if (Module["FS_createPath"]) {
      runWithFS(Module);
    } else {
      if (!Module["preRun"]) Module["preRun"] = [];
      Module["preRun"].push(runWithFS);
    }
  }
  loadPackage({
    "files": [ {
      "filename": "/data/app/ios/bg128.png",
      "start": 0,
      "end": 1716
    }, {
      "filename": "/data/app/ios/bg64.png",
      "start": 1716,
      "end": 2461
    }, {
      "filename": "/data/app/ios/dialog/cancel_0.png",
      "start": 2461,
      "end": 4345
    }, {
      "filename": "/data/app/ios/dialog/cancel_0_1.png",
      "start": 4345,
      "end": 4982
    }, {
      "filename": "/data/app/ios/dialog/cancel_0_3.png",
      "start": 4982,
      "end": 5906
    }, {
      "filename": "/data/app/ios/dialog/cancel_1.png",
      "start": 5906,
      "end": 7849
    }, {
      "filename": "/data/app/ios/dialog/cancel_1_1.png",
      "start": 7849,
      "end": 8522
    }, {
      "filename": "/data/app/ios/dialog/cancel_1_3.png",
      "start": 8522,
      "end": 9494
    }, {
      "filename": "/data/app/ios/dialog/create_0.png",
      "start": 9494,
      "end": 11428
    }, {
      "filename": "/data/app/ios/dialog/create_0_1.png",
      "start": 11428,
      "end": 12080
    }, {
      "filename": "/data/app/ios/dialog/create_0_3.png",
      "start": 12080,
      "end": 13020
    }, {
      "filename": "/data/app/ios/dialog/create_1.png",
      "start": 13020,
      "end": 15016
    }, {
      "filename": "/data/app/ios/dialog/create_1_1.png",
      "start": 15016,
      "end": 15717
    }, {
      "filename": "/data/app/ios/dialog/create_1_3.png",
      "start": 15717,
      "end": 16729
    }, {
      "filename": "/data/app/ios/dialog/ipad/cancel_0_4.png",
      "start": 16729,
      "end": 17752
    }, {
      "filename": "/data/app/ios/dialog/ipad/cancel_1_4.png",
      "start": 17752,
      "end": 18807
    }, {
      "filename": "/data/app/ios/dialog/ipad/create_0_4.png",
      "start": 18807,
      "end": 19892
    }, {
      "filename": "/data/app/ios/dialog/ipad/create_1_4.png",
      "start": 19892,
      "end": 21022
    }, {
      "filename": "/data/app/ios/dialog/ipad/creative_0_4.png",
      "start": 21022,
      "end": 22192
    }, {
      "filename": "/data/app/ios/dialog/ipad/creative_1_4.png",
      "start": 22192,
      "end": 24869
    }, {
      "filename": "/data/app/ios/dialog/ipad/creative_3_4.png",
      "start": 24869,
      "end": 27458
    }, {
      "filename": "/data/app/ios/dialog/ipad/survival_0_4.png",
      "start": 27458,
      "end": 28590
    }, {
      "filename": "/data/app/ios/dialog/ipad/survival_1_4.png",
      "start": 28590,
      "end": 31179
    }, {
      "filename": "/data/app/ios/dialog/ipad/survival_3_4.png",
      "start": 31179,
      "end": 33680
    }, {
      "filename": "/data/app/ios/dialog/ipad/worldname_ipad_4.png",
      "start": 33680,
      "end": 34611
    }, {
      "filename": "/data/app/ios/dialog/save_0.png",
      "start": 34611,
      "end": 36432
    }, {
      "filename": "/data/app/ios/dialog/save_0_3.png",
      "start": 36432,
      "end": 37767
    }, {
      "filename": "/data/app/ios/dialog/save_1.png",
      "start": 37767,
      "end": 39648
    }, {
      "filename": "/data/app/ios/dialog/save_1_3.png",
      "start": 39648,
      "end": 41037
    }, {
      "filename": "/data/app/ios/dialog/worldname_ipad.png",
      "start": 41037,
      "end": 41576
    }, {
      "filename": "/data/app/ios/dialog/worldname_ipad_3.png",
      "start": 41576,
      "end": 43222
    }, {
      "filename": "/data/app/ios/dialog/worldname_iphone.png",
      "start": 43222,
      "end": 43743
    }, {
      "filename": "/data/app/ios/dialog/worldname_iphone_3.png",
      "start": 43743,
      "end": 45279
    }, {
      "filename": "/data/app/ios/dialog2/cancel_0_1.png",
      "start": 45279,
      "end": 45891
    }, {
      "filename": "/data/app/ios/dialog2/cancel_0_3.png",
      "start": 45891,
      "end": 49170
    }, {
      "filename": "/data/app/ios/dialog2/cancel_1_1.png",
      "start": 49170,
      "end": 49802
    }, {
      "filename": "/data/app/ios/dialog2/cancel_1_3.png",
      "start": 49802,
      "end": 53138
    }, {
      "filename": "/data/app/ios/dialog2/create_0_1.png",
      "start": 53138,
      "end": 53768
    }, {
      "filename": "/data/app/ios/dialog2/create_0_3.png",
      "start": 53768,
      "end": 57073
    }, {
      "filename": "/data/app/ios/dialog2/create_1_1.png",
      "start": 57073,
      "end": 57722
    }, {
      "filename": "/data/app/ios/dialog2/create_1_3.png",
      "start": 57722,
      "end": 61078
    }, {
      "filename": "/data/app/ios/dialog2/creative_0_3.png",
      "start": 61078,
      "end": 64460
    }, {
      "filename": "/data/app/ios/dialog2/creative_1_3.png",
      "start": 64460,
      "end": 67886
    }, {
      "filename": "/data/app/ios/dialog2/survival_0_3.png",
      "start": 67886,
      "end": 71244
    }, {
      "filename": "/data/app/ios/dialog2/survival_1_3.png",
      "start": 71244,
      "end": 74653
    }, {
      "filename": "/data/app/ios/dialog2/worldname.png",
      "start": 74653,
      "end": 75242
    }, {
      "filename": "/data/app/ios/dialog2/worldname_3.png",
      "start": 75242,
      "end": 77085
    }, {
      "filename": "/data/app/ios/dialog2/worldname_ipad.png",
      "start": 77085,
      "end": 77624
    }, {
      "filename": "/data/app/ios/dialog2/worldname_ipad_3.png",
      "start": 77624,
      "end": 79270
    }, {
      "filename": "/data/app/ios/dialog2/worldname_iphone.png",
      "start": 79270,
      "end": 82336
    }, {
      "filename": "/data/app/ios/dialog2/worldname_iphone5_3.png",
      "start": 82336,
      "end": 85559
    }, {
      "filename": "/data/app/ios/dialog2/worldname_iphone_3.png",
      "start": 85559,
      "end": 88747
    }, {
      "filename": "/data/app/ios/icons/Icon-72.png",
      "start": 88747,
      "end": 101202
    }, {
      "filename": "/data/app/ios/icons/Icon-72_lite.png",
      "start": 101202,
      "end": 114422
    }, {
      "filename": "/data/app/ios/icons/Icon-Small-50.png",
      "start": 114422,
      "end": 122811
    }, {
      "filename": "/data/app/ios/icons/Icon-Small-50_lite.png",
      "start": 122811,
      "end": 131517
    }, {
      "filename": "/data/app/ios/icons/Icon-Small.png",
      "start": 131517,
      "end": 136519
    }, {
      "filename": "/data/app/ios/icons/Icon-Small@2x.png",
      "start": 136519,
      "end": 146271
    }, {
      "filename": "/data/app/ios/icons/Icon-Small@2x_lite.png",
      "start": 146271,
      "end": 156501
    }, {
      "filename": "/data/app/ios/icons/Icon-Small_lite.png",
      "start": 156501,
      "end": 161578
    }, {
      "filename": "/data/app/ios/icons/Icon.png",
      "start": 161578,
      "end": 171159
    }, {
      "filename": "/data/app/ios/icons/Icon@2x.png",
      "start": 171159,
      "end": 191865
    }, {
      "filename": "/data/app/ios/icons/Icon@2x_lite.png",
      "start": 191865,
      "end": 214516
    }, {
      "filename": "/data/app/ios/icons/Icon_lite.png",
      "start": 214516,
      "end": 224554
    }, {
      "filename": "/data/app/ios/icons/mcpe_ios_icon.png",
      "start": 224554,
      "end": 302305
    }, {
      "filename": "/data/app/ios/icons/mcpe_lite_ios_icon.png",
      "start": 302305,
      "end": 395265
    }, {
      "filename": "/data/app/launch/Default-Landscape~ipad.png",
      "start": 395265,
      "end": 463022
    }, {
      "filename": "/data/app/launch/Default.png",
      "start": 463022,
      "end": 483294
    }, {
      "filename": "/data/app/launch/Default@2x.png",
      "start": 483294,
      "end": 551866
    }, {
      "filename": "/data/fonts/minecraft.ttf",
      "start": 551866,
      "end": 569542
    }, {
      "filename": "/data/images/armor/chain_1.png",
      "start": 569542,
      "end": 570506
    }, {
      "filename": "/data/images/armor/chain_2.png",
      "start": 570506,
      "end": 571029
    }, {
      "filename": "/data/images/armor/cloth_1.png",
      "start": 571029,
      "end": 572168
    }, {
      "filename": "/data/images/armor/cloth_2.png",
      "start": 572168,
      "end": 572878
    }, {
      "filename": "/data/images/armor/diamond_1.png",
      "start": 572878,
      "end": 574096
    }, {
      "filename": "/data/images/armor/diamond_2.png",
      "start": 574096,
      "end": 574820
    }, {
      "filename": "/data/images/armor/gold_1.png",
      "start": 574820,
      "end": 576018
    }, {
      "filename": "/data/images/armor/gold_2.png",
      "start": 576018,
      "end": 576726
    }, {
      "filename": "/data/images/armor/iron_1.png",
      "start": 576726,
      "end": 577859
    }, {
      "filename": "/data/images/armor/iron_2.png",
      "start": 577859,
      "end": 578545
    }, {
      "filename": "/data/images/art/kz.png",
      "start": 578545,
      "end": 664132
    }, {
      "filename": "/data/images/environment/clouds.png",
      "start": 664132,
      "end": 677844
    }, {
      "filename": "/data/images/font/default8.png",
      "start": 677844,
      "end": 679995
    }, {
      "filename": "/data/images/gui/background.png",
      "start": 679995,
      "end": 680363
    }, {
      "filename": "/data/images/gui/badge/minecon140.png",
      "start": 680363,
      "end": 683467
    }, {
      "filename": "/data/images/gui/bg32.png",
      "start": 683467,
      "end": 683975
    }, {
      "filename": "/data/images/gui/cursor.png",
      "start": 683975,
      "end": 684256
    }, {
      "filename": "/data/images/gui/default_world.png",
      "start": 684256,
      "end": 709494
    }, {
      "filename": "/data/images/gui/gui.png",
      "start": 709494,
      "end": 751791
    }, {
      "filename": "/data/images/gui/gui2.png",
      "start": 751791,
      "end": 765675
    }, {
      "filename": "/data/images/gui/gui_blocks.png",
      "start": 765675,
      "end": 943679
    }, {
      "filename": "/data/images/gui/icons.png",
      "start": 943679,
      "end": 946119
    }, {
      "filename": "/data/images/gui/itemframe.png",
      "start": 946119,
      "end": 951359
    }, {
      "filename": "/data/images/gui/items.png",
      "start": 951359,
      "end": 981114
    }, {
      "filename": "/data/images/gui/logo/github.png",
      "start": 981114,
      "end": 987079
    }, {
      "filename": "/data/images/gui/logo/raknet_high_72.png",
      "start": 987079,
      "end": 1008468
    }, {
      "filename": "/data/images/gui/logo/raknet_low_18.png",
      "start": 1008468,
      "end": 1010311
    }, {
      "filename": "/data/images/gui/pi_title.png",
      "start": 1010311,
      "end": 1017082
    }, {
      "filename": "/data/images/gui/spritesheet.png",
      "start": 1017082,
      "end": 1028684
    }, {
      "filename": "/data/images/gui/title.png",
      "start": 1028684,
      "end": 1034489
    }, {
      "filename": "/data/images/gui/touchgui.png",
      "start": 1034489,
      "end": 1054198
    }, {
      "filename": "/data/images/item/arrows.png",
      "start": 1054198,
      "end": 1054520
    }, {
      "filename": "/data/images/item/camera.png",
      "start": 1054520,
      "end": 1055202
    }, {
      "filename": "/data/images/item/sign.png",
      "start": 1055202,
      "end": 1056462
    }, {
      "filename": "/data/images/misc/foliagecolor.png",
      "start": 1056462,
      "end": 1074155
    }, {
      "filename": "/data/images/misc/grasscolor.png",
      "start": 1074155,
      "end": 1099392
    }, {
      "filename": "/data/images/misc/shadow.png",
      "start": 1099392,
      "end": 1100260
    }, {
      "filename": "/data/images/misc/vignette.png",
      "start": 1100260,
      "end": 1124417
    }, {
      "filename": "/data/images/misc/water.png",
      "start": 1124417,
      "end": 1124723
    }, {
      "filename": "/data/images/mob/char.png",
      "start": 1124723,
      "end": 1126170
    }, {
      "filename": "/data/images/mob/chicken.png",
      "start": 1126170,
      "end": 1126662
    }, {
      "filename": "/data/images/mob/cow.png",
      "start": 1126662,
      "end": 1128040
    }, {
      "filename": "/data/images/mob/creeper.png",
      "start": 1128040,
      "end": 1131040
    }, {
      "filename": "/data/images/mob/pig.png",
      "start": 1131040,
      "end": 1134345
    }, {
      "filename": "/data/images/mob/pigzombie.png",
      "start": 1134345,
      "end": 1137378
    }, {
      "filename": "/data/images/mob/sheep.png",
      "start": 1137378,
      "end": 1139820
    }, {
      "filename": "/data/images/mob/sheep_fur.png",
      "start": 1139820,
      "end": 1141471
    }, {
      "filename": "/data/images/mob/skeleton.png",
      "start": 1141471,
      "end": 1142365
    }, {
      "filename": "/data/images/mob/spider.png",
      "start": 1142365,
      "end": 1144919
    }, {
      "filename": "/data/images/mob/zombie.png",
      "start": 1144919,
      "end": 1146234
    }, {
      "filename": "/data/images/particles.png",
      "start": 1146234,
      "end": 1148147
    }, {
      "filename": "/data/images/pe.ico",
      "start": 1148147,
      "end": 1212887
    }, {
      "filename": "/data/images/pe.rc",
      "start": 1212887,
      "end": 1212910
    }, {
      "filename": "/data/images/terrain.png",
      "start": 1212910,
      "end": 1326971
    }, {
      "filename": "/data/images/terrain.pvr",
      "start": 1326971,
      "end": 1359791
    }, {
      "filename": "/data/images/terrain.pvr4",
      "start": 1359791,
      "end": 1392611
    }, {
      "filename": "/data/images/terrain.pvrtc",
      "start": 1392611,
      "end": 1425431
    }, {
      "filename": "/data/images/terrain/moon.png",
      "start": 1425431,
      "end": 1426341
    }, {
      "filename": "/data/images/terrain/sun.png",
      "start": 1426341,
      "end": 1427140
    }, {
      "filename": "/data/images/terrain_4444.h",
      "start": 1427140,
      "end": 1789312
    }, {
      "filename": "/data/images/terrain_5551.h",
      "start": 1789312,
      "end": 2151484
    }, {
      "filename": "/data/images/terrain_565.h",
      "start": 2151484,
      "end": 2513655
    }, {
      "filename": "/data/images/terrain_565_2.h",
      "start": 2513655,
      "end": 2875828
    }, {
      "filename": "/data/lang/en_US.lang",
      "start": 2875828,
      "end": 2915399
    }, {
      "filename": "/data/sound/aac/damage/fallbig1.m4a",
      "start": 2915399,
      "end": 2922316
    }, {
      "filename": "/data/sound/aac/damage/fallbig2.m4a",
      "start": 2922316,
      "end": 2928132
    }, {
      "filename": "/data/sound/aac/damage/fallsmall.m4a",
      "start": 2928132,
      "end": 2932951
    }, {
      "filename": "/data/sound/aac/mob/chicken1.m4a",
      "start": 2932951,
      "end": 2938966
    }, {
      "filename": "/data/sound/aac/mob/chicken2.m4a",
      "start": 2938966,
      "end": 2946360
    }, {
      "filename": "/data/sound/aac/mob/chicken3.m4a",
      "start": 2946360,
      "end": 2951533
    }, {
      "filename": "/data/sound/aac/mob/chickenhurt1.m4a",
      "start": 2951533,
      "end": 2957352
    }, {
      "filename": "/data/sound/aac/mob/chickenhurt2.m4a",
      "start": 2957352,
      "end": 2961803
    }, {
      "filename": "/data/sound/aac/mob/chickenplop.m4a",
      "start": 2961803,
      "end": 2964558
    }, {
      "filename": "/data/sound/aac/mob/cow1.m4a",
      "start": 2964558,
      "end": 2976832
    }, {
      "filename": "/data/sound/aac/mob/cow2.m4a",
      "start": 2976832,
      "end": 2989043
    }, {
      "filename": "/data/sound/aac/mob/cow3.m4a",
      "start": 2989043,
      "end": 3006087
    }, {
      "filename": "/data/sound/aac/mob/cow4.m4a",
      "start": 3006087,
      "end": 3019371
    }, {
      "filename": "/data/sound/aac/mob/cowhurt1.m4a",
      "start": 3019371,
      "end": 3024559
    }, {
      "filename": "/data/sound/aac/mob/cowhurt2.m4a",
      "start": 3024559,
      "end": 3029538
    }, {
      "filename": "/data/sound/aac/mob/cowhurt3.m4a",
      "start": 3029538,
      "end": 3035156
    }, {
      "filename": "/data/sound/aac/mob/creeper1.m4a",
      "start": 3035156,
      "end": 3039006
    }, {
      "filename": "/data/sound/aac/mob/creeper2.m4a",
      "start": 3039006,
      "end": 3042895
    }, {
      "filename": "/data/sound/aac/mob/creeper3.m4a",
      "start": 3042895,
      "end": 3046786
    }, {
      "filename": "/data/sound/aac/mob/creeper4.m4a",
      "start": 3046786,
      "end": 3050753
    }, {
      "filename": "/data/sound/aac/mob/creeperdeath.m4a",
      "start": 3050753,
      "end": 3057864
    }, {
      "filename": "/data/sound/aac/mob/pig1.m4a",
      "start": 3057864,
      "end": 3062135
    }, {
      "filename": "/data/sound/aac/mob/pig2.m4a",
      "start": 3062135,
      "end": 3067091
    }, {
      "filename": "/data/sound/aac/mob/pig3.m4a",
      "start": 3067091,
      "end": 3071062
    }, {
      "filename": "/data/sound/aac/mob/pigdeath.m4a",
      "start": 3071062,
      "end": 3077181
    }, {
      "filename": "/data/sound/aac/mob/sheep1.m4a",
      "start": 3077181,
      "end": 3086456
    }, {
      "filename": "/data/sound/aac/mob/sheep2.m4a",
      "start": 3086456,
      "end": 3094901
    }, {
      "filename": "/data/sound/aac/mob/sheep3.m4a",
      "start": 3094901,
      "end": 3103081
    }, {
      "filename": "/data/sound/aac/mob/skeleton1.m4a",
      "start": 3103081,
      "end": 3108709
    }, {
      "filename": "/data/sound/aac/mob/skeleton2.m4a",
      "start": 3108709,
      "end": 3113401
    }, {
      "filename": "/data/sound/aac/mob/skeleton3.m4a",
      "start": 3113401,
      "end": 3118538
    }, {
      "filename": "/data/sound/aac/mob/skeletonhurt1.m4a",
      "start": 3118538,
      "end": 3122883
    }, {
      "filename": "/data/sound/aac/mob/skeletonhurt2.m4a",
      "start": 3122883,
      "end": 3127522
    }, {
      "filename": "/data/sound/aac/mob/skeletonhurt3.m4a",
      "start": 3127522,
      "end": 3132098
    }, {
      "filename": "/data/sound/aac/mob/skeletonhurt4.m4a",
      "start": 3132098,
      "end": 3136783
    }, {
      "filename": "/data/sound/aac/mob/spider1.m4a",
      "start": 3136783,
      "end": 3142892
    }, {
      "filename": "/data/sound/aac/mob/spider2.m4a",
      "start": 3142892,
      "end": 3147450
    }, {
      "filename": "/data/sound/aac/mob/spider3.m4a",
      "start": 3147450,
      "end": 3152452
    }, {
      "filename": "/data/sound/aac/mob/spider4.m4a",
      "start": 3152452,
      "end": 3156604
    }, {
      "filename": "/data/sound/aac/mob/spiderdeath.m4a",
      "start": 3156604,
      "end": 3164242
    }, {
      "filename": "/data/sound/aac/mob/zombie1.m4a",
      "start": 3164242,
      "end": 3177726
    }, {
      "filename": "/data/sound/aac/mob/zombie2.m4a",
      "start": 3177726,
      "end": 3190192
    }, {
      "filename": "/data/sound/aac/mob/zombie3.m4a",
      "start": 3190192,
      "end": 3207807
    }, {
      "filename": "/data/sound/aac/mob/zombiedeath.m4a",
      "start": 3207807,
      "end": 3215086
    }, {
      "filename": "/data/sound/aac/mob/zombiehurt1.m4a",
      "start": 3215086,
      "end": 3223465
    }, {
      "filename": "/data/sound/aac/mob/zombiehurt2.m4a",
      "start": 3223465,
      "end": 3231780
    }, {
      "filename": "/data/sound/aac/mob/zpig1.m4a",
      "start": 3231780,
      "end": 3239366
    }, {
      "filename": "/data/sound/aac/mob/zpig2.m4a",
      "start": 3239366,
      "end": 3248317
    }, {
      "filename": "/data/sound/aac/mob/zpig3.m4a",
      "start": 3248317,
      "end": 3252290
    }, {
      "filename": "/data/sound/aac/mob/zpig4.m4a",
      "start": 3252290,
      "end": 3257498
    }, {
      "filename": "/data/sound/aac/mob/zpigangry1.m4a",
      "start": 3257498,
      "end": 3264806
    }, {
      "filename": "/data/sound/aac/mob/zpigangry2.m4a",
      "start": 3264806,
      "end": 3268724
    }, {
      "filename": "/data/sound/aac/mob/zpigangry3.m4a",
      "start": 3268724,
      "end": 3276701
    }, {
      "filename": "/data/sound/aac/mob/zpigangry4.m4a",
      "start": 3276701,
      "end": 3285741
    }, {
      "filename": "/data/sound/aac/mob/zpigdeath.m4a",
      "start": 3285741,
      "end": 3295295
    }, {
      "filename": "/data/sound/aac/mob/zpighurt1.m4a",
      "start": 3295295,
      "end": 3299928
    }, {
      "filename": "/data/sound/aac/mob/zpighurt2.m4a",
      "start": 3299928,
      "end": 3304218
    }, {
      "filename": "/data/sound/aac/random/bow.m4a",
      "start": 3304218,
      "end": 3308220
    }, {
      "filename": "/data/sound/aac/random/bowhit1.m4a",
      "start": 3308220,
      "end": 3315573
    }, {
      "filename": "/data/sound/aac/random/bowhit2.m4a",
      "start": 3315573,
      "end": 3322304
    }, {
      "filename": "/data/sound/aac/random/bowhit3.m4a",
      "start": 3322304,
      "end": 3330594
    }, {
      "filename": "/data/sound/aac/random/bowhit4.m4a",
      "start": 3330594,
      "end": 3340661
    }, {
      "filename": "/data/sound/aac/random/click.m4a",
      "start": 3340661,
      "end": 3344863
    }, {
      "filename": "/data/sound/aac/random/door_close.m4a",
      "start": 3344863,
      "end": 3349099
    }, {
      "filename": "/data/sound/aac/random/door_open.m4a",
      "start": 3349099,
      "end": 3354041
    }, {
      "filename": "/data/sound/aac/random/eat1.m4a",
      "start": 3354041,
      "end": 3356933
    }, {
      "filename": "/data/sound/aac/random/eat2.m4a",
      "start": 3356933,
      "end": 3359956
    }, {
      "filename": "/data/sound/aac/random/eat3.m4a",
      "start": 3359956,
      "end": 3362903
    }, {
      "filename": "/data/sound/aac/random/explode.m4a",
      "start": 3362903,
      "end": 3368458
    }, {
      "filename": "/data/sound/aac/random/fuse.m4a",
      "start": 3368458,
      "end": 3382610
    }, {
      "filename": "/data/sound/aac/random/glass1.m4a",
      "start": 3382610,
      "end": 3389344
    }, {
      "filename": "/data/sound/aac/random/glass2.m4a",
      "start": 3389344,
      "end": 3395951
    }, {
      "filename": "/data/sound/aac/random/glass3.m4a",
      "start": 3395951,
      "end": 3402165
    }, {
      "filename": "/data/sound/aac/random/hurt.m4a",
      "start": 3402165,
      "end": 3410601
    }, {
      "filename": "/data/sound/aac/random/pop.m4a",
      "start": 3410601,
      "end": 3412696
    }, {
      "filename": "/data/sound/aac/random/splash.m4a",
      "start": 3412696,
      "end": 3418212
    }, {
      "filename": "/data/sound/aac/random/water.m4a",
      "start": 3418212,
      "end": 3440375
    }, {
      "filename": "/data/sound/aac/step/cloth1.m4a",
      "start": 3440375,
      "end": 3443410
    }, {
      "filename": "/data/sound/aac/step/cloth2.m4a",
      "start": 3443410,
      "end": 3446461
    }, {
      "filename": "/data/sound/aac/step/cloth3.m4a",
      "start": 3446461,
      "end": 3449572
    }, {
      "filename": "/data/sound/aac/step/cloth4.m4a",
      "start": 3449572,
      "end": 3452616
    }, {
      "filename": "/data/sound/aac/step/grass1.m4a",
      "start": 3452616,
      "end": 3457289
    }, {
      "filename": "/data/sound/aac/step/grass2.m4a",
      "start": 3457289,
      "end": 3462598
    }, {
      "filename": "/data/sound/aac/step/grass3.m4a",
      "start": 3462598,
      "end": 3467415
    }, {
      "filename": "/data/sound/aac/step/grass4.m4a",
      "start": 3467415,
      "end": 3472273
    }, {
      "filename": "/data/sound/aac/step/gravel2.m4a",
      "start": 3472273,
      "end": 3477840
    }, {
      "filename": "/data/sound/aac/step/gravel3.m4a",
      "start": 3477840,
      "end": 3483179
    }, {
      "filename": "/data/sound/aac/step/gravel4.m4a",
      "start": 3483179,
      "end": 3488703
    }, {
      "filename": "/data/sound/aac/step/ladder1.m4a",
      "start": 3488703,
      "end": 3492728
    }, {
      "filename": "/data/sound/aac/step/ladder2.m4a",
      "start": 3492728,
      "end": 3496758
    }, {
      "filename": "/data/sound/aac/step/ladder3.m4a",
      "start": 3496758,
      "end": 3501009
    }, {
      "filename": "/data/sound/aac/step/ladder4.m4a",
      "start": 3501009,
      "end": 3505020
    }, {
      "filename": "/data/sound/aac/step/sand1.m4a",
      "start": 3505020,
      "end": 3508359
    }, {
      "filename": "/data/sound/aac/step/sand2.m4a",
      "start": 3508359,
      "end": 3511247
    }, {
      "filename": "/data/sound/aac/step/sand3.m4a",
      "start": 3511247,
      "end": 3514419
    }, {
      "filename": "/data/sound/aac/step/sand4.m4a",
      "start": 3514419,
      "end": 3517739
    }, {
      "filename": "/data/sound/aac/step/snow1.m4a",
      "start": 3517739,
      "end": 3522124
    }, {
      "filename": "/data/sound/aac/step/snow2.m4a",
      "start": 3522124,
      "end": 3526734
    }, {
      "filename": "/data/sound/aac/step/snow3.m4a",
      "start": 3526734,
      "end": 3531420
    }, {
      "filename": "/data/sound/aac/step/snow4.m4a",
      "start": 3531420,
      "end": 3535851
    }, {
      "filename": "/data/sound/aac/step/stone1.m4a",
      "start": 3535851,
      "end": 3541922
    }, {
      "filename": "/data/sound/aac/step/stone2.m4a",
      "start": 3541922,
      "end": 3547061
    }, {
      "filename": "/data/sound/aac/step/stone3.m4a",
      "start": 3547061,
      "end": 3551635
    }, {
      "filename": "/data/sound/aac/step/stone4.m4a",
      "start": 3551635,
      "end": 3557142
    }, {
      "filename": "/data/sound/aac/step/wood1.m4a",
      "start": 3557142,
      "end": 3563644
    }, {
      "filename": "/data/sound/aac/step/wood2.m4a",
      "start": 3563644,
      "end": 3571104
    }, {
      "filename": "/data/sound/aac/step/wood3.m4a",
      "start": 3571104,
      "end": 3578262
    }, {
      "filename": "/data/sound/aac/step/wood4.m4a",
      "start": 3578262,
      "end": 3585895
    } ],
    "remote_package_size": 3585895
  });
})();

// end include: C:\Users\mafes\AppData\Local\Temp\tmpqskupgos.js
var programArgs = [];

var thisProgram = "./this.program";

var quit_ = (status, toThrow) => {
  throw toThrow;
};

// In MODULARIZE mode _scriptName needs to be captured already at the very top of the page immediately when the page is parsed, so it is generated there
// before the page load. In non-MODULARIZE modes generate it here.
var _scriptName = globalThis.document?.currentScript?.src;

if (typeof __filename != "undefined") {
  // Node
  _scriptName = __filename;
} else if (ENVIRONMENT_IS_WORKER) {
  _scriptName = self.location.href;
}

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = "";

function locateFile(path) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

if (ENVIRONMENT_IS_NODE) {
  // These modules will usually be used on Node.js. Load them eagerly to avoid
  // the complexity of lazy-loading.
  var fs = require("node:fs");
  scriptDirectory = __dirname + "/";
  // include: node_shell_read.js
  readBinary = filename => {
    // We need to re-wrap `file://` strings to URLs.
    filename = isFileURI(filename) ? new URL(filename) : filename;
    var ret = fs.readFileSync(filename);
    return ret;
  };
  readAsync = async (filename, binary = true) => {
    // See the comment in the `readBinary` function.
    filename = isFileURI(filename) ? new URL(filename) : filename;
    var ret = fs.readFileSync(filename, binary ? undefined : "utf8");
    return ret;
  };
  // end include: node_shell_read.js
  if (process.argv.length > 1) {
    thisProgram = process.argv[1].replace(/\\/g, "/");
  }
  programArgs = process.argv.slice(2);
  // MODULARIZE will export the module in the proper place outside, we don't need to export here
  if (typeof module != "undefined") {
    module["exports"] = Module;
  }
  quit_ = (status, toThrow) => {
    process.exitCode = status;
    throw toThrow;
  };
} else // Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL(".", _scriptName).href;
  } catch {}
  // Differentiate the Web Worker from the Node Worker case, as reading must
  // be done differently.
  if (!ENVIRONMENT_IS_NODE) {
    // include: web_or_worker_shell_read.js
    if (ENVIRONMENT_IS_WORKER) {
      readBinary = url => {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, false);
        xhr.responseType = "arraybuffer";
        xhr.send(null);
        return new Uint8Array(/** @type{!ArrayBuffer} */ (xhr.response));
      };
    }
    readAsync = async url => {
      // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
      // See https://github.com/github/fetch/pull/92#issuecomment-140665932
      // Cordova or Electron apps are typically loaded from a file:// url.
      // So use XHR on webview if URL is a file URL.
      if (isFileURI(url)) {
        return new Promise((resolve, reject) => {
          var xhr = new XMLHttpRequest;
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = () => {
            if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
              // file URLs can return 0
              resolve(xhr.response);
              return;
            }
            reject(xhr.status);
          };
          xhr.onerror = reject;
          xhr.send(null);
        });
      }
      var response = await fetch(url, {
        credentials: "same-origin"
      });
      if (response.ok) {
        return response.arrayBuffer();
      }
      throw new Error(response.status + " : " + response.url);
    };
  }
} else {}

// Set up the out() and err() hooks, which are how we can print to stdout or
// stderr, respectively.
// Normally just binding console.log/console.error here works fine, but
// under node (with workers) we see missing/out-of-order messages so route
// directly to stdout and stderr.
// See https://github.com/emscripten-core/emscripten/issues/14804
var defaultPrint = console.log.bind(console);

var defaultPrintErr = console.error.bind(console);

if (ENVIRONMENT_IS_NODE) {
  var utils = require("node:util");
  var stringify = a => typeof a == "object" ? utils.inspect(a) : a;
  defaultPrint = (...args) => fs.writeSync(1, args.map(stringify).join(" ") + "\n");
  defaultPrintErr = (...args) => fs.writeSync(2, args.map(stringify).join(" ") + "\n");
}

var out = defaultPrint;

var err = defaultPrintErr;

// end include: shell.js
// include: preamble.js
// === Preamble library stuff ===
// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html
var wasmBinary;

// Wasm globals
// For sending to workers.
var wasmModule;

//========================================
// Runtime essentials
//========================================
// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */ function assert(condition, text) {
  if (!condition) {
    // This build was created without ASSERTIONS defined.  `assert()` should not
    // ever be called in this configuration but in case there are callers in
    // the wild leave this simple abort() implementation here for now.
    abort(text);
  }
}

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */ var isFileURI = filename => filename.startsWith("file://");

// include: runtime_common.js
// include: runtime_exceptions.js
// Base Emscripten EH error class
class EmscriptenEH {}

class EmscriptenSjLj extends EmscriptenEH {}

// end include: runtime_exceptions.js
// include: runtime_debug.js
// end include: runtime_debug.js
// Support for growable heap + pthreads, where the buffer may change, so JS views
// must be updated.
function growMemViews() {
  // `updateMemoryViews` updates all the views simultaneously, so it's enough to check any of them.
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
}

if (ENVIRONMENT_IS_NODE && (ENVIRONMENT_IS_PTHREAD)) {
  // Create as web-worker-like an environment as we can.
  globalThis.self = globalThis;
  var parentPort = worker_threads.parentPort;
  // Deno and Bun already have `postMessage` defined on the global scope and
  // deliver messages to `globalThis.onmessage`, so we must not duplicate that
  // behavior here if `postMessage` is already present.
  if (!globalThis.postMessage) {
    parentPort.on("message", msg => globalThis.onmessage?.({
      data: msg
    }));
    globalThis.postMessage = msg => parentPort.postMessage(msg);
  }
  // Node.js Workers do not pass postMessage()s and uncaught exception events to the parent
  // thread necessarily in the same order where they were generated in sequential program order.
  // See https://github.com/nodejs/node/issues/59617
  // To remedy this, capture all uncaughtExceptions in the Worker, and sequentialize those over
  // to the same postMessage pipe that other messages use.
  process.on("uncaughtException", err => {
    postMessage({
      cmd: 8,
      error: err
    });
    // Also shut down the Worker to match the same semantics as if this uncaughtException
    // handler was not registered.
    // (n.b. this will not shut down the whole Node.js app process, but just the Worker)
    process.exit(1);
  });
}

// include: runtime_pthread.js
// Pthread Web Worker handling code.
// This code runs only on pthread web workers and handles pthread setup
// and communication with the main thread via postMessage.
var startWorker;

if (ENVIRONMENT_IS_PTHREAD) {
  // Thread-local guard variable for one-time init of the JS state
  var initializedJS = false;
  // Turn unhandled rejected promises into errors so that the main thread will be
  // notified about them.
  self.onunhandledrejection = e => {
    throw e.reason || e;
  };
  function handleMessage(e) {
    try {
      var msgData = e.data;
      //dbg('msgData: ' + Object.keys(msgData));
      var cmd = msgData.cmd;
      if (cmd == 1) {
        // Preload command that is called once per worker to parse and load the Emscripten code.
        // Until we initialize the runtime, queue up any further incoming messages.
        let messageQueue = [];
        self.onmessage = e => messageQueue.push(e);
        // And add a callback for when the runtime is initialized.
        startWorker = () => {
          // Notify the main thread that this thread has loaded.
          postMessage({
            cmd: 3
          });
          // Process any messages that were queued before the thread was ready.
          for (let msg of messageQueue) {
            handleMessage(msg);
          }
          // Restore the real message handler.
          self.onmessage = handleMessage;
        };
        // Use `const` here to ensure that the variable is scoped only to
        // that iteration, allowing safe reference from a closure.
        for (const handler of msgData.handlers) {
          // If the main module has a handler for a certain event, but no
          // handler exists on the pthread worker, then proxy that handler
          // back to the main thread.
          if (!Module[handler] || Module[handler].proxy) {
            Module[handler] = (...args) => {
              postMessage({
                cmd: 9,
                handler,
                args
              });
            };
            // Rebind the out / err handlers if needed
            if (handler == "print") out = Module[handler];
            if (handler == "printErr") err = Module[handler];
          }
        }
        wasmMemory = msgData.wasmMemory;
        updateMemoryViews();
        wasmModule = msgData.wasmModule;
        createWasm();
        run();
        startWorker();
      } else if (cmd == 2) {
        // Call inside JS module to set up the stack frame for this pthread in JS module scope.
        // This needs to be the first thing that we do, as we cannot call to any C/C++ functions
        // until the thread stack is initialized.
        establishStackSpace(msgData.pthread_ptr);
        // Pass the thread address to wasm to store it for fast access.
        __emscripten_thread_init(msgData.pthread_ptr, /*is_main=*/ 0, /*is_runtime=*/ 0, /*can_block=*/ 1, 0, 0);
        PThread.threadInitTLS();
        // Await mailbox notifications with `Atomics.waitAsync` so we can start
        // using the fast `Atomics.notify` notification path.
        __emscripten_thread_mailbox_await(msgData.pthread_ptr);
        if (!initializedJS) {
          initializedJS = true;
        }
        try {
          invokeEntryPoint(msgData.start_routine, msgData.arg);
        } catch (ex) {
          if (ex != "unwind") {
            // The pthread "crashed".  Do not call `_emscripten_thread_exit` (which
            // would make this thread joinable).  Instead, re-throw the exception
            // and let the top level handler propagate it back to the main thread.
            throw ex;
          }
        }
      } else if (cmd == 4) {
        if (initializedJS) {
          checkMailbox();
        }
      } else if (cmd) {
        // The received message looks like something that should be handled by this message
        // handler, (since there is a cmd field present), but is not one of the
        // recognized commands:
        err(`worker: received unknown command ${cmd}`);
        err(msgData);
      }
    } catch (ex) {
      if (runtimeInitialized) __emscripten_thread_crashed();
      throw ex;
    }
  }
  self.onmessage = handleMessage;
}

// ENVIRONMENT_IS_PTHREAD
// end include: runtime_pthread.js
// Memory management
var runtimeInitialized = false;

// When ALLOW_MEMORY_GROWTH is enabled, the conversion from Wasm
// memory to ArrayBuffer requires some additional logic.
function getMemoryBuffer() {
  return wasmMemory.buffer;
}

function updateMemoryViews() {
  // If we already have a heap that is resizeable/growable buffer we don't
  // need to do anything in updateMemoryViews.
  if (HEAP8?.buffer?.growable) return;
  var b = getMemoryBuffer();
  Module["HEAP8"] = HEAP8 = new Int8Array(b);
  HEAP16 = new Int16Array(b);
  Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
  HEAPU16 = new Uint16Array(b);
  Module["HEAP32"] = HEAP32 = new Int32Array(b);
  Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
  HEAPF32 = new Float32Array(b);
  HEAPF64 = new Float64Array(b);
  HEAP64 = new BigInt64Array(b);
  HEAPU64 = new BigUint64Array(b);
}

// In non-standalone/normal mode, we create the memory here.
// include: runtime_init_memory.js
// Create the wasm memory. (Note: this only applies if IMPORTED_MEMORY is defined)
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
function initMemory() {
  if ((ENVIRONMENT_IS_PTHREAD)) {
    return;
  }
  {
    var INITIAL_MEMORY = 16777216;
    /** @suppress {checkTypes} */ wasmMemory = new WebAssembly.Memory({
      "initial": INITIAL_MEMORY / 65536,
      // In theory we should not need to emit the maximum if we want "unlimited"
      // or 4GB of memory, but VMs error on that atm, see
      // https://github.com/emscripten-core/emscripten/issues/14130
      // And in the pthreads case we definitely need to emit a maximum. So
      // always emit one.
      "maximum": 32768,
      "shared": true
    });
  }
  updateMemoryViews();
}

// end include: runtime_init_memory.js
// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
function preRun() {
  var preRun = Module["preRun"];
  if (preRun) {
    if (typeof preRun == "function") preRun = [ preRun ];
    onPreRuns.push(...preRun);
  }
  // Begin ATPRERUNS hooks
  callRuntimeCallbacks(onPreRuns);
}

function initRuntime() {
  runtimeInitialized = true;
  if (ENVIRONMENT_IS_PTHREAD) return;
  // Begin ATINITS hooks
  SOCKFS.root = FS.mount(SOCKFS, {}, null);
  if (!Module["noFSInit"] && !FS.initialized) FS.init();
  TTY.init();
  // End ATINITS hooks
  wasmExports["__wasm_call_ctors"]();
  // Begin ATPOSTCTORS hooks
  FS.ignorePermissions = false;
}

function postRun() {
  var postRun = Module["postRun"];
  if (postRun) {
    if (typeof postRun == "function") postRun = [ postRun ];
    onPostRuns.push(...postRun);
  }
  // Begin ATPOSTRUNS hooks
  callRuntimeCallbacks(onPostRuns);
}

/**
 * @param {string|number=} what
 */ function abort(what) {
  Module["onAbort"]?.(what);
  what = `Aborted(${what})`;
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);
  ABORT = true;
  what += ". Build with -sASSERTIONS for more info.";
  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.
  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */ var e = new WebAssembly.RuntimeError(what);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

var wasmBinaryFile;

function findWasmBinary() {
  return locateFile("MinecraftPE.wasm");
}

function getBinarySync(file) {
  if (readBinary) {
    return readBinary(file);
  }
  // Throwing a plain string here, even though it not normally advisable since
  // this gets turning into an `abort` in instantiateArrayBuffer.
  throw "both async and sync fetching of the wasm failed";
}

async function getWasmBinary(binaryFile) {
  // If we don't have the binary yet, load it asynchronously using readAsync.
  if (!wasmBinary) {
    // Fetch the binary using readAsync
    try {
      var response = await readAsync(binaryFile);
      return new Uint8Array(response);
    } catch {}
  }
  // Otherwise, getBinarySync should be able to get it synchronously
  return getBinarySync(binaryFile);
}

async function instantiateArrayBuffer(binaryFile, imports) {
  try {
    var binary = await getWasmBinary(binaryFile);
    var instance = await WebAssembly.instantiate(binary, imports);
    return instance;
  } catch (reason) {
    err(`failed to asynchronously prepare wasm: ${reason}`);
    abort(reason);
  }
}

async function instantiateAsync(binary, binaryFile, imports) {
  if (!binary && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE) {
    try {
      var response = fetch(binaryFile, {
        credentials: "same-origin"
      });
      var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
      return instantiationResult;
    } catch (reason) {
      // We expect the most common failure cause to be a bad MIME type for the binary,
      // in which case falling back to ArrayBuffer instantiation should work.
      err(`wasm streaming compile failed: ${reason}`);
      err("falling back to ArrayBuffer instantiation");
    }
  }
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
  assignWasmImports();
  // prepare imports
  var imports = {
    "env": wasmImports,
    "wasi_snapshot_preview1": wasmImports
  };
  return imports;
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm() {
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  function receiveInstance(instance, module) {
    wasmExports = instance.exports;
    registerTLSInit(wasmExports["_emscripten_tls_init"]);
    assignWasmExports(wasmExports);
    // We now have the Wasm module loaded up, keep a reference to the compiled module so we can post it to the workers.
    wasmModule = module;
    return wasmExports;
  }
  // Prefer streaming instantiation if available.
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    return receiveInstance(result["instance"], result["module"]);
  }
  var info = getWasmImports();
  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  var instantiateWasm = Module["instantiateWasm"];
  if (instantiateWasm) {
    return new Promise(resolve => {
      instantiateWasm(info, (inst, mod) => resolve(receiveInstance(inst, mod)));
    });
  }
  if ((ENVIRONMENT_IS_PTHREAD)) {
    // Instantiate from the module that was received via postMessage from
    // the main thread. We can just use sync instantiation in the worker.
    var instance = new WebAssembly.Instance(wasmModule, getWasmImports());
    return receiveInstance(instance, wasmModule);
  }
  wasmBinaryFile ??= findWasmBinary();
  var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
  var exports = receiveInstantiationResult(result);
  return exports;
}

// end include: preamble.js
// Begin JS library code
class ExitStatus {
  name="ExitStatus";
  constructor(status) {
    this.message = `Program terminated with exit(${status})`;
    this.status = status;
  }
}

/** @type {!Int8Array} */ var HEAP8;

var terminateWorker = worker => {
  worker.terminate();
  // terminate() can be asynchronous, so in theory the worker can continue
  // to run for some amount of time after termination.  However from our POV
  // the worker is now dead and we don't want to hear from it again, so we stub
  // out its message handler here.  This avoids having to check in each of
  // the onmessage handlers if the message was coming from a valid worker.
  worker.onmessage = e => {};
};

var cleanupThread = pthread_ptr => {
  var worker = PThread.pthreads[pthread_ptr];
  PThread.returnWorkerToPool(worker);
};

var callRuntimeCallbacks = callbacks => {
  while (callbacks.length > 0) {
    // Pass the module as the first argument.
    callbacks.shift()(Module);
  }
};

var onPreRuns = [];

var addOnPreRun = cb => onPreRuns.push(cb);

var spawnThread = threadParams => {
  var worker = PThread.getNewWorker();
  if (!worker) {
    // No available workers in the PThread pool.
    return 6;
  }
  // Add to pthreads map
  PThread.pthreads[threadParams.pthread_ptr] = worker;
  worker.pthread_ptr = threadParams.pthread_ptr;
  var msg = {
    cmd: 2,
    start_routine: threadParams.startRoutine,
    arg: threadParams.arg,
    pthread_ptr: threadParams.pthread_ptr
  };
  // Ask the worker to start executing its pthread entry point function.
  worker.postMessage(msg, threadParams.transferList);
  return 0;
};

var runtimeKeepaliveCounter = 0;

var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;

var stackSave = () => _emscripten_stack_get_current();

var stackRestore = val => __emscripten_stack_restore(val);

var stackAlloc = sz => __emscripten_stack_alloc(sz);

/** @type {!Float64Array} */ var HEAPF64;

/** not-@type {!BigInt64Array} */ var HEAP64;

/** @type{function(number, (number|boolean), ...number)} */ var proxyToMainThread = (funcIndex, emAsmAddr, proxyMode, ...callArgs) => {
  // EM_ASM proxying is done by passing a pointer to the address of the EM_ASM
  // content as `emAsmAddr`.  JS library proxying is done by passing an index
  // into `proxiedJSCallArgs` as `funcIndex`. If `emAsmAddr` is non-zero then
  // `funcIndex` will be ignored.
  // Additional arguments are passed after the first three are the actual
  // function arguments.
  // The serialization buffer contains the number of call params, and then
  // all the args here.
  // We also pass 'proxyMode' to C separately, since C needs to look at it.
  // Allocate a buffer (on the stack), which will be copied if necessary by
  // the C code.
  // First passed parameter specifies the number of arguments to the function.
  // When BigInt support is enabled, we must handle types in a more complex
  // way, detecting at runtime if a value is a BigInt or not (as we have no
  // type info here). To do that, add a "prefix" before each value that
  // indicates if it is a BigInt, which effectively doubles the number of
  // values we serialize for proxying. TODO: pack this?
  var bufSize = 8 * callArgs.length * 2;
  var sp = stackSave();
  var args = stackAlloc(bufSize);
  var b = ((args) >> 3);
  for (var arg of callArgs) {
    if (typeof arg == "bigint") {
      // The prefix is non-zero to indicate a bigint.
      (growMemViews(), HEAP64)[b++] = 1n;
      (growMemViews(), HEAP64)[b++] = arg;
    } else {
      // The prefix is zero to indicate a JS Number.
      (growMemViews(), HEAP64)[b++] = 0n;
      (growMemViews(), HEAPF64)[b++] = arg;
    }
  }
  var rtn = __emscripten_run_js_on_main_thread(funcIndex, emAsmAddr, bufSize, args, proxyMode);
  stackRestore(sp);
  return rtn;
};

function _proc_exit(code) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(0, 0, 1, code);
  EXITSTATUS = code;
  if (!keepRuntimeAlive()) {
    PThread.terminateAllThreads();
    Module["onExit"]?.(code);
    ABORT = true;
  }
  quit_(code, new ExitStatus(code));
}

function exitOnMainThread(returnCode) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(1, 0, 0, returnCode);
  _exit(returnCode);
}

/** @param {boolean|number=} implicit */ var exitJS = (status, implicit) => {
  EXITSTATUS = status;
  if (ENVIRONMENT_IS_PTHREAD) {
    // implicit exit can never happen on a pthread
    // When running in a pthread we propagate the exit back to the main thread
    // where it can decide if the whole process should be shut down or not.
    // The pthread may have decided not to exit its own runtime, for example
    // because it runs a main loop, but that doesn't affect the main thread.
    exitOnMainThread(status);
    throw "unwind";
  }
  _proc_exit(status);
};

var _exit = exitJS;

var waitAsyncPolyfilled = (!Atomics.waitAsync || (globalThis.navigator?.userAgent && Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./) || [])[2]) < 91));

/** @type {!Int32Array} */ var HEAP32;

var PThread = {
  unusedWorkers: [],
  tlsInitFunctions: [],
  pthreads: {},
  init() {
    if ((!(ENVIRONMENT_IS_PTHREAD))) {
      PThread.initMainThread();
    }
  },
  initMainThread() {},
  terminateAllThreads: () => {
    // Attempt to kill all workers.  Sadly (at least on the web) there is no
    // way to terminate a worker synchronously, or to be notified when a
    // worker is actually terminated.  This means there is some risk that
    // pthreads will continue to be executing after `worker.terminate` has
    // returned.  For this reason, we don't call `returnWorkerToPool` here or
    // free the underlying pthread data structures.
    for (var worker of Object.values(PThread.pthreads)) {
      terminateWorker(worker);
    }
    for (var worker of PThread.unusedWorkers) {
      terminateWorker(worker);
    }
    PThread.unusedWorkers = [];
    PThread.pthreads = {};
  },
  terminateRuntime: () => {
    PThread.terminateAllThreads();
    var pthread_ptr = _pthread_self();
    ___set_thread_state(0, 0, 0, 1);
    if (!waitAsyncPolyfilled) {
      // Break the waitAsync loop.  Note that checkMailbox will not
      // re-register since the `___set_thread_state` above causes _pthread_self
      // to return 0.
      Atomics.notify((growMemViews(), HEAP32), ((pthread_ptr) >> 2));
    }
  },
  returnWorkerToPool: worker => {
    // We don't want to run main thread queued calls here, since we are doing
    // some operations that leave the worker queue in an invalid state until
    // we are completely done (it would be bad if free() ends up calling a
    // queued pthread_create which looks at the global data structures we are
    // modifying). To achieve that, defer the free() until the very end, when
    // we are all done.
    var pthread_ptr = worker.pthread_ptr;
    delete PThread.pthreads[pthread_ptr];
    // Note: worker is intentionally not terminated so the pool can
    // dynamically grow.
    PThread.unusedWorkers.push(worker);
    // Not a running Worker anymore
    // Detach the worker from the pthread object, and return it to the
    // worker pool as an unused worker.
    worker.pthread_ptr = 0;
    // Finally, free the underlying (and now-unused) pthread structure in
    // linear memory.
    __emscripten_thread_free_data(pthread_ptr);
  },
  threadInitTLS() {
    // Call thread init functions (these are the _emscripten_tls_init for each
    // module loaded.
    PThread.tlsInitFunctions.forEach(f => f());
  },
  loadWasmModuleToWorker: worker => new Promise(onFinishedLoading => {
    worker.onmessage = e => {
      var d = e.data;
      var cmd = d.cmd;
      // If this message is intended to a recipient that is not the main
      // thread, forward it to the target thread. This is currently only
      // used by `CMD_CHECK_MAILBOX`.
      if (d.targetThread && d.targetThread != _pthread_self()) {
        var targetWorker = PThread.pthreads[d.targetThread];
        targetWorker?.postMessage(d);
        return;
      }
      if (d === "setimmediate" || d === "_si") {
        // Worker wants to postMessage() to itself to implement setImmediate()
        // emulation.
        worker.postMessage(d);
        return;
      }
      switch (cmd) {
       case 4:
        checkMailbox();
        break;

       case 5:
        spawnThread(d);
        break;

       case 6:
        // cleanupThread needs to be run via callUserCallback since it calls
        // back into user code to free thread data. Without this it's possible
        // the unwind or ExitStatus exception could escape here.
        callUserCallback(() => cleanupThread(d.thread));
        break;

       case 3:
        if (ENVIRONMENT_IS_NODE && !worker.strongref) {
          // Once worker is loaded & idle, mark it as weakly referenced,
          // so that mere existence of a Worker in the pool does not prevent
          // Node.js from exiting the app.
          worker.unref();
        }
        onFinishedLoading(worker);
        break;

       case 8:
        // Message handler for Node.js specific out-of-order behavior:
        // https://github.com/nodejs/node/issues/59617
        // A pthread sent an uncaught exception event. Re-raise it on the main thread.
        worker.onerror(d.error);
        break;

       case 9:
        Module[d.handler](...d.args);
        break;

       default:
        // The received message looks like something that should be handled by this message
        // handler, (since there is a e.data.cmd field present), but is not one of the
        // recognized commands:
        if (cmd) err(`worker sent an unknown command ${cmd}`);
      }
    };
    worker.onerror = e => {
      var message = "worker sent an error!";
      err(`${message} ${e.filename}:${e.lineno}: ${e.message}`);
      throw e;
    };
    if (ENVIRONMENT_IS_NODE) {
      worker.on("message", data => worker.onmessage({
        data
      }));
      worker.on("error", e => worker.onerror(e));
    }
    // When running on a pthread, none of the incoming parameters on the module
    // object are present. Proxy known handlers back to the main thread if specified.
    var handlers = [];
    var knownHandlers = [ "onExit", "onAbort", "print", "printErr" ];
    for (var handler of knownHandlers) {
      if (Module.propertyIsEnumerable(handler)) {
        handlers.push(handler);
      }
    }
    // Ask the new worker to load up the Emscripten-compiled page. This is a heavy operation.
    worker.postMessage({
      cmd: 1,
      handlers,
      wasmMemory,
      wasmModule
    });
  }),
  allocateUnusedWorker() {
    var worker;
    var pthreadMainJs = _scriptName;
    worker = new Worker(pthreadMainJs, {
      // This is the way that we signal to the node worker that it is hosting
      // a pthread.
      "workerData": "em-pthread",
      // This is the way that we signal to the Web Worker that it is hosting
      // a pthread.
      "name": "em-pthread"
    });
    PThread.unusedWorkers.push(worker);
    return worker;
  },
  getNewWorker() {
    if (PThread.unusedWorkers.length == 0) {
      // PTHREAD_POOL_SIZE_STRICT should show a warning and, if set to level `2`, return from the function.
      var newWorker = PThread.allocateUnusedWorker();
      PThread.loadWasmModuleToWorker(newWorker);
    }
    return PThread.unusedWorkers.pop();
  }
};

var onPostRuns = [];

var addOnPostRun = cb => onPostRuns.push(cb);

/** @type {!Uint32Array} */ var HEAPU32;

function establishStackSpace(pthread_ptr) {
  var stackHigh = (growMemViews(), HEAPU32)[(((pthread_ptr) + (48)) >> 2)];
  var stackSize = (growMemViews(), HEAPU32)[(((pthread_ptr) + (52)) >> 2)];
  var stackLow = stackHigh - stackSize;
  // Set stack limits used by `emscripten/stack.h` function.  These limits are
  // cached in wasm-side globals to make checks as fast as possible.
  _emscripten_stack_set_limits(stackHigh, stackLow);
  // Call inside wasm module to set up the stack frame for this pthread in wasm module scope
  stackRestore(stackHigh);
}

/** @suppress{checkTypes} */ var getWasmTableEntry = funcPtr => wasmTable.get(funcPtr);

var invokeEntryPoint = (ptr, arg) => {
  // An old thread on this worker may have been canceled without returning the
  // `runtimeKeepaliveCounter` to zero. Reset it now so the new thread won't
  // be affected.
  runtimeKeepaliveCounter = 0;
  // Same for noExitRuntime.  The default for pthreads should always be false
  // otherwise pthreads would never complete and attempts to pthread_join to
  // them would block forever.
  // pthreads can still choose to set `noExitRuntime` explicitly, or
  // call emscripten_unwind_to_js_event_loop to extend their lifetime beyond
  // their main function.  See comment in src/runtime_pthread.js for more.
  noExitRuntime = 0;
  // pthread entry points are always of signature 'void *ThreadMain(void *arg)'
  // Native codebases sometimes spawn threads with other thread entry point
  // signatures, such as void ThreadMain(void *arg), void *ThreadMain(), or
  // void ThreadMain().  That is not acceptable per C/C++ specification, but
  // x86 compiler ABI extensions enable that to work. If you find the
  // following line to crash, either change the signature to "proper" void
  // *ThreadMain(void *arg) form, or try linking with the Emscripten linker
  // flag -sEMULATE_FUNCTION_POINTER_CASTS to add in emulation for this x86
  // ABI extension.
  var result = getWasmTableEntry(ptr)(arg);
  function finish(result) {
    // In MINIMAL_RUNTIME the noExitRuntime concept does not apply to
    // pthreads. To exit a pthread with live runtime, use the function
    // emscripten_unwind_to_js_event_loop() in the pthread body.
    if (keepRuntimeAlive()) {
      EXITSTATUS = result;
      return;
    }
    __emscripten_thread_exit(result);
  }
  finish(result);
};

var noExitRuntime = true;

var registerTLSInit = tlsInitFunc => PThread.tlsInitFunctions.push(tlsInitFunc);

var wasmMemory;

class ExceptionInfo {
  // excPtr - Thrown object pointer to wrap. Metadata pointer is calculated from it.
  constructor(excPtr) {
    this.excPtr = excPtr;
    this.ptr = excPtr - 24;
  }
  set_type(type) {
    (growMemViews(), HEAPU32)[(((this.ptr) + (4)) >> 2)] = type;
  }
  get_type() {
    return (growMemViews(), HEAPU32)[(((this.ptr) + (4)) >> 2)];
  }
  set_destructor(destructor) {
    (growMemViews(), HEAPU32)[(((this.ptr) + (8)) >> 2)] = destructor;
  }
  get_destructor() {
    return (growMemViews(), HEAPU32)[(((this.ptr) + (8)) >> 2)];
  }
  set_caught(caught) {
    caught = caught ? 1 : 0;
    (growMemViews(), HEAP8)[(this.ptr) + (12)] = caught;
  }
  get_caught() {
    return (growMemViews(), HEAP8)[(this.ptr) + (12)] != 0;
  }
  set_rethrown(rethrown) {
    rethrown = rethrown ? 1 : 0;
    (growMemViews(), HEAP8)[(this.ptr) + (13)] = rethrown;
  }
  get_rethrown() {
    return (growMemViews(), HEAP8)[(this.ptr) + (13)] != 0;
  }
  // Initialize native structure fields. Should be called once after allocated.
  init(type, destructor) {
    this.set_adjusted_ptr(0);
    this.set_type(type);
    this.set_destructor(destructor);
  }
  set_adjusted_ptr(adjustedPtr) {
    (growMemViews(), HEAPU32)[(((this.ptr) + (16)) >> 2)] = adjustedPtr;
  }
  get_adjusted_ptr() {
    return (growMemViews(), HEAPU32)[(((this.ptr) + (16)) >> 2)];
  }
}

var uncaughtExceptionCount = 0;

var ___cxa_throw = (ptr, type, destructor) => {
  var info = new ExceptionInfo(ptr);
  // Initialize ExceptionInfo content after it was allocated in __cxa_allocate_exception.
  info.init(type, destructor);
  uncaughtExceptionCount++;
  abort();
};

function pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(2, 0, 1, pthread_ptr, attr, startRoutine, arg);
  return ___pthread_create_js(pthread_ptr, attr, startRoutine, arg);
}

var _emscripten_has_threading_support = () => !!globalThis.SharedArrayBuffer;

var ___pthread_create_js = (pthread_ptr, attr, startRoutine, arg) => {
  if (!_emscripten_has_threading_support()) {
    return 6;
  }
  // List of JS objects that will transfer ownership to the Worker hosting the thread
  var transferList = [];
  var error = 0;
  // Synchronously proxy the thread creation to main thread if possible. If we
  // need to transfer ownership of objects, then proxy asynchronously via
  // postMessage.
  if (ENVIRONMENT_IS_PTHREAD && (!transferList.length || error)) {
    return pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg);
  }
  // If on the main thread, and accessing Canvas/OffscreenCanvas failed, abort
  // with the detected error.
  if (error) return error;
  var threadParams = {
    startRoutine,
    pthread_ptr,
    arg,
    transferList
  };
  if (ENVIRONMENT_IS_PTHREAD) {
    // The prepopulated pool of web workers that can host pthreads is stored
    // in the main JS thread. Therefore if a pthread is attempting to spawn a
    // new thread, the thread creation must be deferred to the main JS thread.
    threadParams.cmd = 5;
    postMessage(threadParams, transferList);
    // When we defer thread creation this way, we have no way to detect thread
    // creation synchronously today, so we have to assume success and return 0.
    return 0;
  }
  // We are the main thread, so we have the pthread warmup pool in this
  // thread and can fire off JS thread creation directly ourselves.
  return spawnThread(threadParams);
};

var initRandomFill = () => {
  // This block is not needed on v19+ since crypto.getRandomValues is builtin
  if (ENVIRONMENT_IS_NODE) {
    var nodeCrypto = require("node:crypto");
    return view => (nodeCrypto.randomFillSync(view), 0);
  }
  // like with most Web APIs, we can't use Web Crypto API directly on shared memory,
  // so we need to create an intermediate buffer and copy it to the destination
  return view => (view.set(crypto.getRandomValues(new Uint8Array(view.byteLength))), 
  0);
};

var randomFill = view => (randomFill = initRandomFill())(view);

var PATH = {
  isAbs: path => path.charAt(0) === "/",
  splitPath: filename => {
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    return splitPathRe.exec(filename).slice(1);
  },
  normalizeArray: (parts, allowAboveRoot) => {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === ".") {
        parts.splice(i, 1);
      } else if (last === "..") {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }
    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
      for (;up; up--) {
        parts.unshift("..");
      }
    }
    return parts;
  },
  normalize: path => {
    var isAbsolute = PATH.isAbs(path), trailingSlash = path.slice(-1) === "/";
    // Normalize the path
    path = PATH.normalizeArray(path.split("/").filter(p => !!p), !isAbsolute).join("/");
    if (!path && !isAbsolute) {
      path = ".";
    }
    if (path && trailingSlash) {
      path += "/";
    }
    return (isAbsolute ? "/" : "") + path;
  },
  dirname: path => {
    var result = PATH.splitPath(path), root = result[0], dir = result[1];
    if (!root && !dir) {
      // No dirname whatsoever
      return ".";
    }
    if (dir) {
      // It has a dirname, strip trailing slash
      dir = dir.slice(0, -1);
    }
    return root + dir;
  },
  basename: path => path && path.match(/([^\/]+|\/)\/*$/)[1],
  join: (...paths) => PATH.normalize(paths.join("/")),
  join2: (l, r) => PATH.normalize(l + "/" + r)
};

var PATH_FS = {
  resolve: (...args) => {
    var resolvedPath = "", resolvedAbsolute = false;
    for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = (i >= 0) ? args[i] : FS.cwd();
      // Skip empty and invalid entries
      if (typeof path != "string") {
        throw new TypeError("Arguments to path.resolve must be strings");
      } else if (!path) {
        return "";
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = PATH.isAbs(path);
    }
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p => !!p), !resolvedAbsolute).join("/");
    return ((resolvedAbsolute ? "/" : "") + resolvedPath) || ".";
  },
  relative: (from, to) => {
    from = PATH_FS.resolve(from).slice(1);
    to = PATH_FS.resolve(to).slice(1);
    function trim(arr) {
      var start = 0;
      for (;start < arr.length; start++) {
        if (arr[start] !== "") break;
      }
      var end = arr.length - 1;
      for (;end >= 0; end--) {
        if (arr[end] !== "") break;
      }
      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }
    var fromParts = trim(from.split("/"));
    var toParts = trim(to.split("/"));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push("..");
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/");
  }
};

var UTF8Decoder = globalThis.TextDecoder && new TextDecoder;

/**
   * heapOrArray is either a regular array, or a JavaScript typed array view.
   * @param {number} idx
   * @param {number=} maxBytesToRead
   * @param {boolean=} ignoreNul
   * @return {number}
   */ var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
  var maxIdx = idx + maxBytesToRead;
  if (ignoreNul) return maxIdx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on
  // null terminator by itself.
  // As a tiny code save trick, compare idx against maxIdx using a negation,
  // so that maxBytesToRead=undefined/NaN means Infinity.
  while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
  return idx;
};

/**
   * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
   * array that contains uint8 values, returns a copy of that string as a
   * Javascript String object.
   * heapOrArray is either a regular array, or a JavaScript typed array view.
   * @param {number=} idx
   * @param {number=} maxBytesToRead
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */ var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
  var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
  // When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
  if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(heapOrArray.buffer instanceof ArrayBuffer ? heapOrArray.subarray(idx, endPtr) : heapOrArray.slice(idx, endPtr));
  }
  var str = "";
  while (idx < endPtr) {
    // For UTF8 byte structure, see:
    // http://en.wikipedia.org/wiki/UTF-8#Description
    // https://www.ietf.org/rfc/rfc2279.txt
    // https://tools.ietf.org/html/rfc3629
    var u0 = heapOrArray[idx++];
    if (!(u0 & 128)) {
      str += String.fromCharCode(u0);
      continue;
    }
    var u1 = heapOrArray[idx++] & 63;
    if ((u0 & 224) == 192) {
      str += String.fromCharCode(((u0 & 31) << 6) | u1);
      continue;
    }
    var u2 = heapOrArray[idx++] & 63;
    if ((u0 & 240) == 224) {
      u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
    } else {
      u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
    }
    if (u0 < 65536) {
      str += String.fromCharCode(u0);
    } else {
      var ch = u0 - 65536;
      str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
    }
  }
  return str;
};

var FS_stdin_getChar_buffer = [];

var lengthBytesUTF8 = str => {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
    // unit, not a Unicode code point of the character! So decode
    // UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var c = str.charCodeAt(i);
    // possibly a lead surrogate
    if (c <= 127) {
      len++;
    } else if (c <= 2047) {
      len += 2;
    } else if (c >= 55296 && c <= 57343) {
      len += 4;
      ++i;
    } else {
      len += 3;
    }
  }
  return len;
};

var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
  // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
  // undefined and false each don't write out any bytes.
  if (!(maxBytesToWrite > 0)) return 0;
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
  // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
    // and https://www.ietf.org/rfc/rfc2279.txt
    // and https://tools.ietf.org/html/rfc3629
    var u = str.codePointAt(i);
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 192 | (u >> 6);
      heap[outIdx++] = 128 | (u & 63);
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 224 | (u >> 12);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++] = 240 | (u >> 18);
      heap[outIdx++] = 128 | ((u >> 12) & 63);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
      // Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
      // We need to manually skip over the second code unit for correct iteration.
      i++;
    }
  }
  // Null-terminate the pointer to the buffer.
  heap[outIdx] = 0;
  return outIdx - startIdx;
};

/** @type {function(string, boolean=, number=)} */ var intArrayFromString = (stringy, dontAddNull, length) => {
  var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
};

var FS_stdin_getChar = () => {
  if (!FS_stdin_getChar_buffer.length) {
    var result = null;
    if (ENVIRONMENT_IS_NODE) {
      // we will read data by chunks of BUFSIZE
      var BUFSIZE = 256;
      var buf = Buffer.alloc(BUFSIZE);
      var bytesRead = 0;
      // For some reason we must suppress a closure warning here, even though
      // fd definitely exists on process.stdin, and is even the proper way to
      // get the fd of stdin,
      // https://github.com/nodejs/help/issues/2136#issuecomment-523649904
      // This started to happen after moving this logic out of library_tty.js,
      // so it is related to the surrounding code in some unclear manner.
      /** @suppress {missingProperties} */ var fd = process.stdin.fd;
      try {
        bytesRead = fs.readSync(fd, buf, 0, BUFSIZE);
      } catch (e) {
        // Cross-platform differences: on Windows, reading EOF throws an
        // exception, but on other OSes, reading EOF returns 0. Uniformize
        // behavior by treating the EOF exception to return 0.
        if (e.toString().includes("EOF")) bytesRead = 0; else throw e;
      }
      if (bytesRead > 0) {
        result = buf.slice(0, bytesRead).toString("utf-8");
      }
    } else if (globalThis.window?.prompt) {
      // Browser.
      result = window.prompt("Input: ");
      // returns null on cancel
      if (result !== null) {
        result += "\n";
      }
    } else {}
    if (!result) {
      return null;
    }
    FS_stdin_getChar_buffer = intArrayFromString(result, true);
  }
  return FS_stdin_getChar_buffer.shift();
};

var TTY = {
  ttys: [],
  init() {},
  shutdown() {},
  register(dev, ops) {
    TTY.ttys[dev] = {
      input: [],
      output: [],
      ops
    };
    FS.registerDevice(dev, TTY.stream_ops);
  },
  stream_ops: {
    open(stream) {
      var tty = TTY.ttys[stream.node.rdev];
      if (!tty) {
        throw new FS.ErrnoError(43);
      }
      stream.tty = tty;
      stream.seekable = false;
    },
    close(stream) {
      // flush any pending line data
      stream.tty.ops.fsync(stream.tty);
    },
    fsync(stream) {
      stream.tty.ops.fsync(stream.tty);
    },
    read(stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.get_char) {
        throw new FS.ErrnoError(60);
      }
      var bytesRead = 0;
      for (var i = 0; i < length; i++) {
        var result;
        try {
          result = stream.tty.ops.get_char(stream.tty);
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
        if (result === undefined && !bytesRead) {
          throw new FS.ErrnoError(6);
        }
        if (result === null || result === undefined) break;
        bytesRead++;
        buffer[offset + i] = result;
      }
      if (bytesRead) {
        stream.node.atime = Date.now();
      }
      return bytesRead;
    },
    write(stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.put_char) {
        throw new FS.ErrnoError(60);
      }
      try {
        for (var i = 0; i < length; i++) {
          stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
        }
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
      if (length) {
        stream.node.mtime = stream.node.ctime = Date.now();
      }
      return i;
    }
  },
  default_tty_ops: {
    get_char(tty) {
      return FS_stdin_getChar();
    },
    put_char(tty, val) {
      if (val === null || val === 10) {
        out(UTF8ArrayToString(tty.output));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    fsync(tty) {
      if (tty.output?.length > 0) {
        out(UTF8ArrayToString(tty.output));
        tty.output = [];
      }
    },
    ioctl_tcgets(tty) {
      // typical setting
      return {
        c_iflag: 25856,
        c_oflag: 5,
        c_cflag: 191,
        c_lflag: 35387,
        c_cc: [ 3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
      };
    },
    ioctl_tcsets(tty, optional_actions, data) {
      // currently just ignore
      return 0;
    },
    ioctl_tiocgwinsz(tty) {
      return [ 24, 80 ];
    }
  },
  default_tty1_ops: {
    put_char(tty, val) {
      if (val === null || val === 10) {
        err(UTF8ArrayToString(tty.output));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    fsync(tty) {
      if (tty.output?.length > 0) {
        err(UTF8ArrayToString(tty.output));
        tty.output = [];
      }
    }
  }
};

var mmapAlloc = size => {
  abort();
};

var MEMFS = {
  ops_table: null,
  mount(mount) {
    return MEMFS.createNode(null, "/", 16895, 0);
  },
  createNode(parent, name, mode, dev) {
    if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
      // not supported
      throw new FS.ErrnoError(63);
    }
    MEMFS.ops_table ||= {
      dir: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr,
          lookup: MEMFS.node_ops.lookup,
          mknod: MEMFS.node_ops.mknod,
          rename: MEMFS.node_ops.rename,
          unlink: MEMFS.node_ops.unlink,
          rmdir: MEMFS.node_ops.rmdir,
          readdir: MEMFS.node_ops.readdir,
          symlink: MEMFS.node_ops.symlink
        },
        stream: {
          llseek: MEMFS.stream_ops.llseek
        }
      },
      file: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr
        },
        stream: {
          llseek: MEMFS.stream_ops.llseek,
          read: MEMFS.stream_ops.read,
          write: MEMFS.stream_ops.write,
          mmap: MEMFS.stream_ops.mmap,
          msync: MEMFS.stream_ops.msync
        }
      },
      link: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr,
          readlink: MEMFS.node_ops.readlink
        },
        stream: {}
      },
      chrdev: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr
        },
        stream: FS.chrdev_stream_ops
      }
    };
    var node = FS.createNode(parent, name, mode, dev);
    if (FS.isDir(node.mode)) {
      node.node_ops = MEMFS.ops_table.dir.node;
      node.stream_ops = MEMFS.ops_table.dir.stream;
      node.contents = {};
    } else if (FS.isFile(node.mode)) {
      node.node_ops = MEMFS.ops_table.file.node;
      node.stream_ops = MEMFS.ops_table.file.stream;
      // The actual number of bytes used in the typed array, as opposed to
      // contents.length which gives the whole capacity.
      node.usedBytes = 0;
      // The byte data of the file is stored in a typed array.
      // Note: typed arrays are not resizable like normal JS arrays are, so
      // there is a small penalty involved for appending file writes that
      // continuously grow a file similar to std::vector capacity vs used.
      node.contents = MEMFS.emptyFileContents ??= new Uint8Array(0);
    } else if (FS.isLink(node.mode)) {
      node.node_ops = MEMFS.ops_table.link.node;
      node.stream_ops = MEMFS.ops_table.link.stream;
    } else if (FS.isChrdev(node.mode)) {
      node.node_ops = MEMFS.ops_table.chrdev.node;
      node.stream_ops = MEMFS.ops_table.chrdev.stream;
    }
    node.atime = node.mtime = node.ctime = Date.now();
    // add the new node to the parent
    if (parent) {
      parent.contents[name] = node;
      parent.atime = parent.mtime = parent.ctime = node.atime;
    }
    return node;
  },
  getFileDataAsTypedArray(node) {
    return node.contents.subarray(0, node.usedBytes);
  },
  expandFileStorage(node, newCapacity) {
    var prevCapacity = node.contents.length;
    if (prevCapacity >= newCapacity) return;
    // No need to expand, the storage was already large enough.
    // Don't expand strictly to the given requested limit if it's only a very
    // small increase, but instead geometrically grow capacity.
    // For small filesizes (<1MB), perform size*2 geometric increase, but for
    // large sizes, do a much more conservative size*1.125 increase to avoid
    // overshooting the allocation cap by a very large margin.
    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>> 0);
    if (prevCapacity) newCapacity = Math.max(newCapacity, 256);
    // At minimum allocate 256b for each file when expanding.
    var oldContents = MEMFS.getFileDataAsTypedArray(node);
    node.contents = new Uint8Array(newCapacity);
    // Allocate new storage.
    node.contents.set(oldContents);
  },
  resizeFileStorage(node, newSize) {
    if (node.usedBytes == newSize) return;
    var oldContents = node.contents;
    node.contents = new Uint8Array(newSize);
    // Allocate new storage.
    node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
    // Copy old data over to the new storage.
    node.usedBytes = newSize;
  },
  node_ops: {
    getattr(node) {
      var attr = {};
      // device numbers reuse inode numbers.
      attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
      attr.ino = node.id;
      attr.mode = node.mode;
      attr.nlink = 1;
      attr.uid = 0;
      attr.gid = 0;
      attr.rdev = node.rdev;
      if (FS.isDir(node.mode)) {
        attr.size = 4096;
      } else if (FS.isFile(node.mode)) {
        attr.size = node.usedBytes;
      } else if (FS.isLink(node.mode)) {
        attr.size = node.link.length;
      } else {
        attr.size = 0;
      }
      attr.atime = new Date(node.atime);
      attr.mtime = new Date(node.mtime);
      attr.ctime = new Date(node.ctime);
      // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
      //       but this is not required by the standard.
      attr.blksize = 4096;
      attr.blocks = Math.ceil(attr.size / attr.blksize);
      return attr;
    },
    setattr(node, attr) {
      for (const key of [ "mode", "atime", "mtime", "ctime" ]) {
        if (attr[key] != null) {
          node[key] = attr[key];
        }
      }
      if (attr.size !== undefined) {
        MEMFS.resizeFileStorage(node, attr.size);
      }
    },
    lookup(parent, name) {
      // This error may happen quite a bit. To avoid overhead we reuse it (and
      // suffer a lack of stack info).
      if (!MEMFS.doesNotExistError) {
        MEMFS.doesNotExistError = new FS.ErrnoError(44);
        /** @suppress {checkTypes} */ MEMFS.doesNotExistError.stack = "<generic error, no stack>";
      }
      throw MEMFS.doesNotExistError;
    },
    mknod(parent, name, mode, dev) {
      return MEMFS.createNode(parent, name, mode, dev);
    },
    rename(old_node, new_dir, new_name) {
      var new_node;
      try {
        new_node = FS.lookupNode(new_dir, new_name);
      } catch (e) {}
      if (new_node) {
        if (FS.isDir(old_node.mode)) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          for (var i in new_node.contents) {
            throw new FS.ErrnoError(55);
          }
        }
        FS.hashRemoveNode(new_node);
      }
      // do the internal rewiring
      delete old_node.parent.contents[old_node.name];
      new_dir.contents[new_name] = old_node;
      old_node.name = new_name;
      new_dir.ctime = new_dir.mtime = old_node.parent.ctime = old_node.parent.mtime = Date.now();
    },
    unlink(parent, name) {
      delete parent.contents[name];
      parent.ctime = parent.mtime = Date.now();
    },
    rmdir(parent, name) {
      var node = FS.lookupNode(parent, name);
      for (var i in node.contents) {
        throw new FS.ErrnoError(55);
      }
      delete parent.contents[name];
      parent.ctime = parent.mtime = Date.now();
    },
    readdir(node) {
      return [ ".", "..", ...Object.keys(node.contents) ];
    },
    symlink(parent, newname, oldpath) {
      var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
      node.link = oldpath;
      return node;
    },
    readlink(node) {
      if (!FS.isLink(node.mode)) {
        throw new FS.ErrnoError(28);
      }
      return node.link;
    }
  },
  stream_ops: {
    read(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= stream.node.usedBytes) return 0;
      var size = Math.min(stream.node.usedBytes - position, length);
      buffer.set(contents.subarray(position, position + size), offset);
      return size;
    },
    write(stream, buffer, offset, length, position, canOwn) {
      // If the buffer is located in main memory (HEAP), and if
      // memory can grow, we can't hold on to references of the
      // memory buffer, as they may get invalidated. That means we
      // need to copy its contents.
      if (buffer.buffer === (growMemViews(), HEAP8).buffer) {
        canOwn = false;
      }
      if (!length) return 0;
      var node = stream.node;
      node.mtime = node.ctime = Date.now();
      if (canOwn) {
        node.contents = buffer.subarray(offset, offset + length);
        node.usedBytes = length;
      } else if (!node.usedBytes && !position) {
        // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
        node.contents = buffer.slice(offset, offset + length);
        node.usedBytes = length;
      } else {
        MEMFS.expandFileStorage(node, position + length);
        // Use typed array write which is available.
        node.contents.set(buffer.subarray(offset, offset + length), position);
        node.usedBytes = Math.max(node.usedBytes, position + length);
      }
      return length;
    },
    llseek(stream, offset, whence) {
      var position = offset;
      if (whence === 1) {
        position += stream.position;
      } else if (whence === 2) {
        if (FS.isFile(stream.node.mode)) {
          position += stream.node.usedBytes;
        }
      }
      if (position < 0) {
        throw new FS.ErrnoError(28);
      }
      return position;
    },
    mmap(stream, length, position, prot, flags) {
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      var ptr;
      var allocated;
      var contents = stream.node.contents;
      // Only make a new copy when MAP_PRIVATE is specified.
      if (!(flags & 2) && contents.buffer === (growMemViews(), HEAP8).buffer) {
        // We can't emulate MAP_SHARED when the file is not backed by the
        // buffer we're mapping to (e.g. the HEAP buffer).
        allocated = false;
        ptr = contents.byteOffset;
      } else {
        allocated = true;
        ptr = mmapAlloc(length);
        if (!ptr) {
          throw new FS.ErrnoError(48);
        }
        if (contents) {
          // Try to avoid unnecessary slices.
          if (position > 0 || position + length < contents.length) {
            if (contents.subarray) {
              contents = contents.subarray(position, position + length);
            } else {
              contents = Array.prototype.slice.call(contents, position, position + length);
            }
          }
          (growMemViews(), HEAP8).set(contents, ptr);
        }
      }
      return {
        ptr,
        allocated
      };
    },
    msync(stream, buffer, offset, length, mmapFlags) {
      MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
      // should we check if bytesWritten and length are the same?
      return 0;
    }
  }
};

var FS_modeStringToFlags = str => {
  if (typeof str != "string") return str;
  var flagModes = {
    "r": 0,
    "r+": 2,
    "w": 512 | 64 | 1,
    "w+": 512 | 64 | 2,
    "a": 1024 | 64 | 1,
    "a+": 1024 | 64 | 2
  };
  var flags = flagModes[str];
  if (typeof flags == "undefined") {
    throw new Error(`Unknown file open mode: ${str}`);
  }
  return flags;
};

var FS_fileDataToTypedArray = data => {
  if (typeof data == "string") {
    data = intArrayFromString(data, true);
  }
  if (!data.subarray) {
    data = new Uint8Array(data);
  }
  return data;
};

var FS_getMode = (canRead, canWrite) => {
  var mode = 0;
  if (canRead) mode |= 292 | 73;
  if (canWrite) mode |= 146;
  return mode;
};

var IDBFS = {
  dbs: {},
  indexedDB: () => indexedDB,
  DB_VERSION: 21,
  DB_STORE_NAME: "FILE_DATA",
  queuePersist: mount => {
    function onPersistComplete() {
      if (mount.idbPersistState === "again") startPersist(); else {
        mount.idbPersistState = 0;
        // Otherwise reset sync state back to idle to wait for a new sync later
        IDBFS.onAutoPersistStateChanged?.(false);
      }
    }
    function startPersist() {
      mount.idbPersistState = "idb";
      // Mark that we are currently running a sync operation
      IDBFS.onAutoPersistStateChanged?.(true);
      IDBFS.syncfs(mount, /*populate:*/ false, onPersistComplete);
    }
    if (!mount.idbPersistState) {
      // Programs typically write/copy/move multiple files in the in-memory
      // filesystem within a single app frame, so when a filesystem sync
      // command is triggered, do not start it immediately, but only after
      // the current frame is finished. This way all the modified files
      // inside the main loop tick will be batched up to the same sync.
      mount.idbPersistState = setTimeout(startPersist, 0);
    } else if (mount.idbPersistState === "idb") {
      // There is an active IndexedDB sync operation in-flight, but we now
      // have accumulated more files to sync. We should therefore queue up
      // a new sync after the current one finishes so that all writes
      // will be properly persisted.
      mount.idbPersistState = "again";
    }
  },
  mount: mount => {
    // reuse core MEMFS functionality
    var mnt = MEMFS.mount(mount);
    // If the automatic IDBFS persistence option has been selected, then automatically persist
    // all modifications to the filesystem as they occur.
    if (mount?.opts?.autoPersist) {
      mount.idbPersistState = 0;
      // IndexedDB sync starts in idle state
      var memfs_node_ops = mnt.node_ops;
      mnt.node_ops = {
        ...mnt.node_ops
      };
      // Clone node_ops to inject write tracking
      mnt.node_ops.mknod = (parent, name, mode, dev) => {
        var node = memfs_node_ops.mknod(parent, name, mode, dev);
        // Propagate injected node_ops to the newly created child node
        node.node_ops = mnt.node_ops;
        // Remember for each IDBFS node which IDBFS mount point they came from so we know which mount to persist on modification.
        node.idbfs_mount = mnt.mount;
        // Remember original MEMFS stream_ops for this node
        node.memfs_stream_ops = node.stream_ops;
        // Clone stream_ops to inject write tracking
        node.stream_ops = {
          ...node.stream_ops
        };
        // Track all file writes
        node.stream_ops.write = (stream, buffer, offset, length, position, canOwn) => {
          // This file has been modified, we must persist IndexedDB when this file closes
          stream.node.isModified = true;
          return node.memfs_stream_ops.write(stream, buffer, offset, length, position, canOwn);
        };
        // Persist IndexedDB on file close
        node.stream_ops.close = stream => {
          var n = stream.node;
          if (n.isModified) {
            IDBFS.queuePersist(n.idbfs_mount);
            n.isModified = false;
          }
          if (n.memfs_stream_ops.close) return n.memfs_stream_ops.close(stream);
        };
        // Persist the node we just created to IndexedDB
        IDBFS.queuePersist(mnt.mount);
        return node;
      };
      // Also kick off persisting the filesystem on other operations that modify the filesystem.
      mnt.node_ops.rmdir = (...args) => (IDBFS.queuePersist(mnt.mount), memfs_node_ops.rmdir(...args));
      mnt.node_ops.symlink = (...args) => (IDBFS.queuePersist(mnt.mount), memfs_node_ops.symlink(...args));
      mnt.node_ops.unlink = (...args) => (IDBFS.queuePersist(mnt.mount), memfs_node_ops.unlink(...args));
      mnt.node_ops.rename = (...args) => (IDBFS.queuePersist(mnt.mount), memfs_node_ops.rename(...args));
    }
    return mnt;
  },
  syncfs: (mount, populate, callback) => {
    IDBFS.getLocalSet(mount, (err, local) => {
      if (err) return callback(err);
      IDBFS.getRemoteSet(mount, (err, remote) => {
        if (err) return callback(err);
        var src = populate ? remote : local;
        var dst = populate ? local : remote;
        IDBFS.reconcile(src, dst, callback);
      });
    });
  },
  quit: () => {
    for (var value of Object.values(IDBFS.dbs)) {
      value.close();
    }
    IDBFS.dbs = {};
  },
  getDB: (name, callback) => {
    // check the cache first
    var db = IDBFS.dbs[name];
    if (db) {
      return callback(null, db);
    }
    var req;
    try {
      req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
    } catch (e) {
      return callback(e);
    }
    if (!req) {
      return callback("Unable to connect to IndexedDB");
    }
    req.onupgradeneeded = e => {
      var db = /** @type {IDBDatabase} */ (e.target.result);
      var transaction = e.target.transaction;
      var fileStore;
      if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
        fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
      } else {
        fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
      }
      if (!fileStore.indexNames.contains("timestamp")) {
        fileStore.createIndex("timestamp", "timestamp", {
          unique: false
        });
      }
    };
    req.onsuccess = () => {
      db = /** @type {IDBDatabase} */ (req.result);
      // add to the cache
      IDBFS.dbs[name] = db;
      callback(null, db);
    };
    req.onerror = e => {
      callback(e.target.error);
      e.preventDefault();
    };
  },
  getLocalSet: (mount, callback) => {
    var entries = {};
    function isRealDir(p) {
      return p !== "." && p !== "..";
    }
    function toAbsolute(root) {
      return p => PATH.join2(root, p);
    }
    var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
    while (check.length) {
      var path = check.pop();
      var stat;
      try {
        stat = FS.lstat(path);
      } catch (e) {
        return callback(e);
      }
      if (FS.isDir(stat.mode)) {
        check.push(...FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
      }
      entries[path] = {
        "timestamp": stat.mtime
      };
    }
    return callback(null, {
      type: "local",
      entries
    });
  },
  getRemoteSet: (mount, callback) => {
    var entries = {};
    IDBFS.getDB(mount.mountpoint, (err, db) => {
      if (err) return callback(err);
      try {
        var transaction = db.transaction([ IDBFS.DB_STORE_NAME ], "readonly");
        transaction.onerror = e => {
          callback(e.target.error);
          e.preventDefault();
        };
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
        var index = store.index("timestamp");
        index.openKeyCursor().onsuccess = event => {
          var cursor = event.target.result;
          if (!cursor) {
            return callback(null, {
              type: "remote",
              db,
              entries
            });
          }
          entries[cursor.primaryKey] = {
            "timestamp": cursor.key
          };
          cursor.continue();
        };
      } catch (e) {
        return callback(e);
      }
    });
  },
  loadLocalEntry: (path, callback) => {
    var stat, node;
    try {
      var lookup = FS.lookupPath(path);
      node = lookup.node;
      stat = FS.lstat(path);
    } catch (e) {
      return callback(e);
    }
    if (FS.isDir(stat.mode)) {
      return callback(null, {
        "timestamp": stat.mtime,
        "mode": stat.mode
      });
    } else if (FS.isLink(stat.mode)) {
      return callback(null, {
        "timestamp": stat.mtime,
        "mode": stat.mode,
        "link": node.link
      });
    } else if (FS.isFile(stat.mode)) {
      // Performance consideration: storing a normal JavaScript array to a IndexedDB is much slower than storing a typed array.
      // Therefore always convert the file contents to a typed array first before writing the data to IndexedDB.
      node.contents = MEMFS.getFileDataAsTypedArray(node);
      return callback(null, {
        "timestamp": stat.mtime,
        "mode": stat.mode,
        "contents": node.contents
      });
    } else {
      return callback(new Error("node type not supported"));
    }
  },
  storeLocalEntry: (path, entry, callback) => {
    try {
      if (FS.isDir(entry["mode"])) {
        FS.mkdirTree(path, entry["mode"]);
      } else if (FS.isLink(entry["mode"])) {
        FS.symlink(entry["link"], path);
      } else if (FS.isFile(entry["mode"])) {
        FS.writeFile(path, entry["contents"], {
          canOwn: true
        });
      } else {
        return callback(new Error("node type not supported"));
      }
      FS.chmod(path, entry["mode"]);
      FS.utime(path, entry["timestamp"], entry["timestamp"]);
    } catch (e) {
      return callback(e);
    }
    callback(null);
  },
  removeLocalEntry: (path, callback) => {
    try {
      var stat = FS.lstat(path);
      if (FS.isDir(stat.mode)) {
        FS.rmdir(path);
      } else {
        FS.unlink(path);
      }
    } catch (e) {
      return callback(e);
    }
    callback(null);
  },
  loadRemoteEntry: (store, path, callback) => {
    var req = store.get(path);
    req.onsuccess = event => callback(null, event.target.result);
    req.onerror = e => {
      callback(e.target.error);
      e.preventDefault();
    };
  },
  storeRemoteEntry: (store, path, entry, callback) => {
    try {
      var req = store.put(entry, path);
    } catch (e) {
      callback(e);
      return;
    }
    req.onsuccess = event => callback();
    req.onerror = e => {
      callback(e.target.error);
      e.preventDefault();
    };
  },
  removeRemoteEntry: (store, path, callback) => {
    var req = store.delete(path);
    req.onsuccess = event => callback();
    req.onerror = e => {
      callback(e.target.error);
      e.preventDefault();
    };
  },
  reconcile: (src, dst, callback) => {
    var total = 0;
    var create = [];
    for (var [key, e] of Object.entries(src.entries)) {
      var e2 = dst.entries[key];
      if (!e2 || e["timestamp"].getTime() != e2["timestamp"].getTime()) {
        create.push(key);
        total++;
      }
    }
    var remove = [];
    for (var key of Object.keys(dst.entries)) {
      if (!src.entries[key]) {
        remove.push(key);
        total++;
      }
    }
    if (!total) {
      return callback(null);
    }
    var errored = false;
    var db = src.type === "remote" ? src.db : dst.db;
    var transaction = db.transaction([ IDBFS.DB_STORE_NAME ], "readwrite");
    var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
    function done(err) {
      if (err && !errored) {
        errored = true;
        return callback(err);
      }
    }
    // transaction may abort if (for example) there is a QuotaExceededError
    transaction.onerror = transaction.onabort = e => {
      done(e.target.error);
      e.preventDefault();
    };
    transaction.oncomplete = e => {
      if (!errored) {
        callback(null);
      }
    };
    // sort paths in ascending order so directory entries are created
    // before the files inside them
    for (const path of create.sort()) {
      if (dst.type === "local") {
        IDBFS.loadRemoteEntry(store, path, (err, entry) => {
          if (err) return done(err);
          IDBFS.storeLocalEntry(path, entry, done);
        });
      } else {
        IDBFS.loadLocalEntry(path, (err, entry) => {
          if (err) return done(err);
          IDBFS.storeRemoteEntry(store, path, entry, done);
        });
      }
    }
    // sort paths in descending order so files are deleted before their
    // parent directories
    for (var path of remove.sort().reverse()) {
      if (dst.type === "local") {
        IDBFS.removeLocalEntry(path, done);
      } else {
        IDBFS.removeRemoteEntry(store, path, done);
      }
    }
  }
};

var asyncLoad = async url => {
  var arrayBuffer = await readAsync(url);
  return new Uint8Array(arrayBuffer);
};

var FS_createDataFile = (...args) => FS.createDataFile(...args);

var getUniqueRunDependency = id => id;

var dependenciesPromise = null;

var resolveRunDependencies = async () => dependenciesPromise;

var runDependencies = 0;

var dependenciesPromiseResolve = null;

var removeRunDependency = id => {
  runDependencies--;
  Module["monitorRunDependencies"]?.(runDependencies);
  if (!runDependencies) {
    dependenciesPromiseResolve();
  }
};

var addRunDependency = id => {
  if (!runDependencies) {
    dependenciesPromise = new Promise(resolve => dependenciesPromiseResolve = resolve);
  }
  runDependencies++;
  Module["monitorRunDependencies"]?.(runDependencies);
};

var preloadPlugins = [];

var FS_handledByPreloadPlugin = async (byteArray, fullname) => {
  // Ensure plugins are ready.
  if (typeof Browser != "undefined") Browser.init();
  for (var plugin of preloadPlugins) {
    if (plugin["canHandle"](fullname)) {
      return plugin["handle"](byteArray, fullname);
    }
  }
  // If no plugin handled this file then return the original/unmodified
  // byteArray.
  return byteArray;
};

var FS_preloadFile = async (parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish) => {
  // TODO we should allow people to just pass in a complete filename instead
  // of parent and name being that we just join them anyways
  var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
  var dep = getUniqueRunDependency(`cp ${fullname}`);
  // might have several active requests for the same fullname
  addRunDependency(dep);
  try {
    var byteArray = url;
    if (typeof url == "string") {
      byteArray = await asyncLoad(url);
    }
    byteArray = await FS_handledByPreloadPlugin(byteArray, fullname);
    preFinish?.();
    if (!dontCreateFile) {
      FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
    }
  } finally {
    removeRunDependency(dep);
  }
};

var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
  FS_preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish).then(onload).catch(onerror);
};

var FS = {
  root: null,
  mounts: [],
  devices: {},
  streams: [],
  nextInode: 1,
  nameTable: null,
  currentPath: "/",
  initialized: false,
  ignorePermissions: true,
  filesystems: null,
  syncFSRequests: 0,
  ErrnoError: class {
    name="ErrnoError";
    // We set the `name` property to be able to identify `FS.ErrnoError`
    // - the `name` is a standard ECMA-262 property of error objects. Kind of good to have it anyway.
    // - when using PROXYFS, an error can come from an underlying FS
    // as different FS objects have their own FS.ErrnoError each,
    // the test `err instanceof FS.ErrnoError` won't detect an error coming from another filesystem, causing bugs.
    // we'll use the reliable test `err.name == "ErrnoError"` instead
    constructor(errno) {
      this.errno = errno;
    }
  },
  FSStream: class {
    shared={};
    get object() {
      return this.node;
    }
    set object(val) {
      this.node = val;
    }
    get isRead() {
      return (this.flags & 2097155) !== 1;
    }
    get isWrite() {
      return (this.flags & 2097155) !== 0;
    }
    get isAppend() {
      return (this.flags & 1024);
    }
    get flags() {
      return this.shared.flags;
    }
    set flags(val) {
      this.shared.flags = val;
    }
    get position() {
      return this.shared.position;
    }
    set position(val) {
      this.shared.position = val;
    }
  },
  FSNode: class {
    node_ops={};
    stream_ops={};
    readMode=292 | 73;
    writeMode=146;
    mounted=null;
    constructor(parent, name, mode, rdev) {
      if (!parent) {
        parent = this;
      }
      this.parent = parent;
      this.mount = parent.mount;
      this.id = FS.nextInode++;
      this.name = name;
      this.mode = mode;
      this.rdev = rdev;
      this.atime = this.mtime = this.ctime = Date.now();
    }
    get read() {
      return (this.mode & this.readMode) === this.readMode;
    }
    set read(val) {
      val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
    }
    get write() {
      return (this.mode & this.writeMode) === this.writeMode;
    }
    set write(val) {
      val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
    }
    get isFolder() {
      return FS.isDir(this.mode);
    }
    get isDevice() {
      return FS.isChrdev(this.mode);
    }
    // The per-inode readiness wait-queue. The node carries a Set of listener
    // entries {cb}; producers (SOCKFS, PIPEFS) call notifyListeners on a
    // readiness transition, and poll()/epoll consume it. It lives on the node
    // (not the fd) so dup'd fds share one queue. Only nodes that derive real
    // readiness (sockets, pipes, and an epoll's own node) ever use this -
    // always-ready types (regular files, ttys) never register or notify.
    addListener(cb, exclusive = false) {
      var entry = {
        cb,
        exclusive
      };
      var listeners = (this.listeners ??= new Set);
      listeners.add(entry);
      return {
        listeners,
        entry
      };
    }
    notifyListeners(flags) {
      // Iterates the set without copying, which is safe ONLY under a
      // load-bearing contract that every internal listener must honour:
      //   1. A listener must not run user code synchronously (a poll waiter only
      //      resolves a Promise; an epoll registration only re-lists +
      //      re-notifies; the epoll callback only schedules a tick). User code
      //      runs on a later tick, never inside this loop.
      //   2. A listener may delete entries only from ITS OWN waiter, never from
      //      a sibling node's set that may be mid-iteration. (Deleting an entry
      //      of the set being iterated here is fine - a Set tolerates removal of
      //      a not-yet-visited entry mid-iteration; mutating a *different* node's
      //      set is fine because that set is not being iterated.)
      // Violating either gives silently skipped wakeups that are near-impossible
      // to reproduce. Any new producer/listener must preserve it.
      if (!this.listeners) return;
      // Fire every non-exclusive listener. Among EPOLLEXCLUSIVE registrations
      // (one fd watched by several epolls) wake only one, rotating round-robin
      // per node, to avoid a thundering herd. (Only epoll registrations are ever
      // exclusive; poll waiters and a node's own consumers are not.)
      var excl;
      for (var entry of this.listeners) {
        if (entry.exclusive) (excl ||= []).push(entry); else entry.cb(flags);
      }
      if (excl) {
        var i = (this.exclTurn || 0) % excl.length;
        this.exclTurn = i + 1;
        excl[i].cb(flags);
      }
    }
  },
  lookupPath(path, opts = {}) {
    if (!path) {
      throw new FS.ErrnoError(44);
    }
    opts.follow_mount ??= true;
    if (!PATH.isAbs(path)) {
      path = FS.cwd() + "/" + path;
    }
    // limit max consecutive symlinks to SYMLOOP_MAX.
    linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
      // split the absolute path
      var parts = path.split("/").filter(p => !!p);
      // start at the root
      var current = FS.root;
      var current_path = "/";
      for (var i = 0; i < parts.length; i++) {
        var islast = (i === parts.length - 1);
        if (islast && opts.parent) {
          // stop resolving
          break;
        }
        if (parts[i] === ".") {
          continue;
        }
        if (parts[i] === "..") {
          current_path = PATH.dirname(current_path);
          if (FS.isRoot(current)) {
            path = current_path + "/" + parts.slice(i + 1).join("/");
            // We're making progress here, don't let many consecutive ..'s
            // lead to ELOOP
            nlinks--;
            continue linkloop;
          } else {
            current = current.parent;
          }
          continue;
        }
        current_path = PATH.join2(current_path, parts[i]);
        try {
          current = FS.lookupNode(current, parts[i]);
        } catch (e) {
          // if noent_okay is true, suppress a ENOENT in the last component
          // and return an object with an undefined node. This is needed for
          // resolving symlinks in the path when creating a file.
          if ((e?.errno === 44) && islast && opts.noent_okay) {
            return {
              path: current_path
            };
          }
          throw e;
        }
        // jump to the mount's root node if this is a mountpoint
        if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) {
          current = current.mounted.root;
        }
        // by default, lookupPath will not follow a symlink if it is the final path component.
        // setting opts.follow = true will override this behavior.
        if (FS.isLink(current.mode) && (!islast || opts.follow)) {
          if (!current.node_ops.readlink) {
            throw new FS.ErrnoError(52);
          }
          var link = current.node_ops.readlink(current);
          if (!PATH.isAbs(link)) {
            link = PATH.dirname(current_path) + "/" + link;
          }
          path = link + "/" + parts.slice(i + 1).join("/");
          continue linkloop;
        }
      }
      return {
        path: current_path,
        node: current
      };
    }
    throw new FS.ErrnoError(32);
  },
  getPath(node) {
    var path;
    while (true) {
      if (FS.isRoot(node)) {
        var mount = node.mount.mountpoint;
        if (!path) return mount;
        return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
      }
      path = path ? `${node.name}/${path}` : node.name;
      node = node.parent;
    }
  },
  hashName(parentid, name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
    }
    return ((parentid + hash) >>> 0) % FS.nameTable.length;
  },
  hashAddNode(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    node.name_next = FS.nameTable[hash];
    FS.nameTable[hash] = node;
  },
  hashRemoveNode(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    if (FS.nameTable[hash] === node) {
      FS.nameTable[hash] = node.name_next;
    } else {
      var current = FS.nameTable[hash];
      while (current) {
        if (current.name_next === node) {
          current.name_next = node.name_next;
          break;
        }
        current = current.name_next;
      }
    }
  },
  lookupNode(parent, name) {
    var errCode = FS.mayLookup(parent);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    var hash = FS.hashName(parent.id, name);
    for (var node = FS.nameTable[hash]; node; node = node.name_next) {
      var nodeName = node.name;
      if (node.parent.id === parent.id && nodeName === name) {
        return node;
      }
    }
    // if we failed to find it in the cache, call into the VFS
    return FS.lookup(parent, name);
  },
  createNode(parent, name, mode, rdev) {
    var node = new FS.FSNode(parent, name, mode, rdev);
    FS.hashAddNode(node);
    return node;
  },
  destroyNode(node) {
    FS.hashRemoveNode(node);
  },
  isRoot(node) {
    return node === node.parent;
  },
  isMountpoint(node) {
    return !!node.mounted;
  },
  isFile(mode) {
    return (mode & 61440) === 32768;
  },
  isDir(mode) {
    return (mode & 61440) === 16384;
  },
  isLink(mode) {
    return (mode & 61440) === 40960;
  },
  isChrdev(mode) {
    return (mode & 61440) === 8192;
  },
  isBlkdev(mode) {
    return (mode & 61440) === 24576;
  },
  isFIFO(mode) {
    return (mode & 61440) === 4096;
  },
  isSocket(mode) {
    return (mode & 49152) === 49152;
  },
  flagsToPermissionString(flag) {
    var perms = [ "r", "w", "rw" ][flag & 3];
    if ((flag & 512)) {
      perms += "w";
    }
    return perms;
  },
  nodePermissions(node, perms) {
    if (FS.ignorePermissions) {
      return 0;
    }
    // return 0 if any user, group or owner bits are set.
    if (perms.includes("r") && !(node.mode & 292)) {
      return 2;
    }
    if (perms.includes("w") && !(node.mode & 146)) {
      return 2;
    }
    if (perms.includes("x") && !(node.mode & 73)) {
      return 2;
    }
    return 0;
  },
  mayLookup(dir) {
    if (!FS.isDir(dir.mode)) return 54;
    var errCode = FS.nodePermissions(dir, "x");
    if (errCode) return errCode;
    if (!dir.node_ops.lookup) return 2;
    return 0;
  },
  mayCreate(dir, name) {
    if (!FS.isDir(dir.mode)) {
      return 54;
    }
    try {
      var node = FS.lookupNode(dir, name);
      return 20;
    } catch (e) {}
    return FS.nodePermissions(dir, "wx");
  },
  mayDelete(dir, name, isdir) {
    var node;
    try {
      node = FS.lookupNode(dir, name);
    } catch (e) {
      return e.errno;
    }
    var errCode = FS.nodePermissions(dir, "wx");
    if (errCode) {
      return errCode;
    }
    if (isdir) {
      if (!FS.isDir(node.mode)) {
        return 54;
      }
      if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
        return 10;
      }
    } else if (FS.isDir(node.mode)) {
      return 31;
    }
    return 0;
  },
  mayOpen(node, flags) {
    if (!node) {
      return 44;
    }
    if (FS.isLink(node.mode)) {
      return 32;
    }
    var mode = FS.flagsToPermissionString(flags);
    if (FS.isDir(node.mode)) {
      // opening for write
      // TODO: check for O_SEARCH? (== search for dir only)
      if (mode !== "r" || (flags & (512 | 64))) {
        return 31;
      }
    }
    return FS.nodePermissions(node, mode);
  },
  checkOpExists(op, err) {
    if (!op) {
      throw new FS.ErrnoError(err);
    }
    return op;
  },
  MAX_OPEN_FDS: 4096,
  nextfd() {
    for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
      if (!FS.streams[fd]) {
        return fd;
      }
    }
    throw new FS.ErrnoError(33);
  },
  getStreamChecked(fd) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    return stream;
  },
  getStream: fd => FS.streams[fd],
  createStream(stream, fd = -1) {
    // clone it, so we can return an instance of FSStream
    stream = Object.assign(new FS.FSStream, stream);
    if (fd == -1) {
      fd = FS.nextfd();
    }
    stream.fd = fd;
    FS.streams[fd] = stream;
    return stream;
  },
  closeStream(fd) {
    FS.streams[fd] = null;
  },
  dupStream(origStream, fd = -1) {
    var stream = FS.createStream(origStream, fd);
    stream.stream_ops?.dup?.(stream);
    return stream;
  },
  doSetAttr(stream, node, attr) {
    var setattr = stream?.stream_ops.setattr;
    var arg = setattr ? stream : node;
    setattr ??= node.node_ops.setattr;
    FS.checkOpExists(setattr, 63);
    try {
      setattr(arg, attr);
    } catch (e) {
      if (e instanceof RangeError) {
        throw new FS.ErrnoError(22);
      }
      throw e;
    }
  },
  chrdev_stream_ops: {
    open(stream) {
      var device = FS.getDevice(stream.node.rdev);
      // override node's stream ops with the device's
      stream.stream_ops = device.stream_ops;
      // forward the open call
      stream.stream_ops.open?.(stream);
    },
    llseek() {
      throw new FS.ErrnoError(70);
    }
  },
  major: dev => ((dev) >> 8),
  minor: dev => ((dev) & 255),
  makedev: (ma, mi) => ((ma) << 8 | (mi)),
  registerDevice(dev, ops) {
    FS.devices[dev] = {
      stream_ops: ops
    };
  },
  getDevice: dev => FS.devices[dev],
  getMounts(mount) {
    var mounts = [];
    var check = [ mount ];
    while (check.length) {
      var m = check.pop();
      mounts.push(m);
      check.push(...m.mounts);
    }
    return mounts;
  },
  syncfs(populate, callback) {
    if (typeof populate == "function") {
      callback = populate;
      populate = false;
    }
    FS.syncFSRequests++;
    if (FS.syncFSRequests > 1) {
      err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
    }
    var mounts = FS.getMounts(FS.root.mount);
    var completed = 0;
    function doCallback(errCode) {
      FS.syncFSRequests--;
      return callback(errCode);
    }
    function done(errCode) {
      if (errCode) {
        if (!done.errored) {
          done.errored = true;
          return doCallback(errCode);
        }
        return;
      }
      if (++completed >= mounts.length) {
        doCallback(null);
      }
    }
    // sync all mounts
    for (var mount of mounts) {
      if (mount.type.syncfs) {
        mount.type.syncfs(mount, populate, done);
      } else {
        done(null);
      }
    }
  },
  mount(type, opts, mountpoint) {
    var root = mountpoint === "/";
    var pseudo = !mountpoint;
    var node;
    if (root && FS.root) {
      throw new FS.ErrnoError(10);
    } else if (!root && !pseudo) {
      var lookup = FS.lookupPath(mountpoint, {
        follow_mount: false
      });
      mountpoint = lookup.path;
      // use the absolute path
      node = lookup.node;
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }
      if (!FS.isDir(node.mode)) {
        throw new FS.ErrnoError(54);
      }
    }
    var mount = {
      type,
      opts,
      mountpoint,
      mounts: []
    };
    // create a root node for the fs
    var mountRoot = type.mount(mount);
    mountRoot.mount = mount;
    mount.root = mountRoot;
    if (root) {
      FS.root = mountRoot;
    } else if (node) {
      // set as a mountpoint
      node.mounted = mount;
      // add the new mount to the current mount's children
      if (node.mount) {
        node.mount.mounts.push(mount);
      }
    }
    return mountRoot;
  },
  unmount(mountpoint) {
    var lookup = FS.lookupPath(mountpoint, {
      follow_mount: false
    });
    if (!FS.isMountpoint(lookup.node)) {
      throw new FS.ErrnoError(28);
    }
    // destroy the nodes for this mount, and all its child mounts
    var node = lookup.node;
    var mount = node.mounted;
    var mounts = FS.getMounts(mount);
    for (var [hash, current] of Object.entries(FS.nameTable)) {
      while (current) {
        var next = current.name_next;
        if (mounts.includes(current.mount)) {
          FS.destroyNode(current);
        }
        current = next;
      }
    }
    // no longer a mountpoint
    node.mounted = null;
    // remove this mount from the child mounts
    var idx = node.mount.mounts.indexOf(mount);
    node.mount.mounts.splice(idx, 1);
  },
  lookup(parent, name) {
    return parent.node_ops.lookup(parent, name);
  },
  mknod(path, mode, dev) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    var name = PATH.basename(path);
    if (!name) {
      throw new FS.ErrnoError(28);
    }
    if (name === "." || name === "..") {
      throw new FS.ErrnoError(20);
    }
    var errCode = FS.mayCreate(parent, name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.mknod) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.mknod(parent, name, mode, dev);
  },
  statfs(path) {
    return FS.statfsNode(FS.lookupPath(path, {
      follow: true
    }).node);
  },
  statfsStream(stream) {
    // We keep a separate statfsStream function because noderawfs overrides
    // it. In noderawfs, stream.node is sometimes null. Instead, we need to
    // look at stream.path.
    return FS.statfsNode(stream.node);
  },
  statfsNode(node) {
    // NOTE: None of the defaults here are true. We're just returning safe and
    //       sane values. Currently nodefs and rawfs replace these defaults,
    //       other file systems leave them alone.
    var rtn = {
      bsize: 4096,
      frsize: 4096,
      blocks: 1e6,
      bfree: 5e5,
      bavail: 5e5,
      files: FS.nextInode,
      ffree: FS.nextInode - 1,
      fsid: 42,
      flags: 2,
      namelen: 255
    };
    if (node.node_ops.statfs) {
      Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root));
    }
    return rtn;
  },
  create(path, mode = 438) {
    mode &= 4095;
    mode |= 32768;
    return FS.mknod(path, mode, 0);
  },
  mkdir(path, mode = 511) {
    mode &= 511 | 512;
    mode |= 16384;
    return FS.mknod(path, mode, 0);
  },
  mkdirTree(path, mode) {
    var dirs = path.split("/");
    var d = "";
    for (var dir of dirs) {
      if (!dir) continue;
      if (d || PATH.isAbs(path)) d += "/";
      d += dir;
      try {
        FS.mkdir(d, mode);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
    }
  },
  mkdev(path, mode, dev) {
    if (typeof dev == "undefined") {
      dev = mode;
      mode = 438;
    }
    mode |= 8192;
    return FS.mknod(path, mode, dev);
  },
  symlink(oldpath, newpath) {
    if (!PATH_FS.resolve(oldpath)) {
      throw new FS.ErrnoError(44);
    }
    var lookup = FS.lookupPath(newpath, {
      parent: true
    });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var newname = PATH.basename(newpath);
    var errCode = FS.mayCreate(parent, newname);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.symlink) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.symlink(parent, newname, oldpath);
  },
  link(oldpath, newpath, flags) {
    var lookup = FS.lookupPath(newpath, {
      parent: true
    });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var newname = PATH.basename(newpath);
    var errCode = FS.mayCreate(parent, newname);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    // Hardlinks are only supported by filesystem backends that provide a
    // `link` node op (e.g. NODERAWFS backed by the host). NODEFS omits it:
    // a host hardlink cannot be confined to the mount root.
    if (!parent.node_ops.link) {
      throw new FS.ErrnoError(34);
    }
    return parent.node_ops.link(parent, newname, oldpath, flags);
  },
  rename(old_path, new_path) {
    var old_dirname = PATH.dirname(old_path);
    var new_dirname = PATH.dirname(new_path);
    var old_name = PATH.basename(old_path);
    var new_name = PATH.basename(new_path);
    // parents must exist
    var lookup, old_dir, new_dir;
    // let the errors from non existent directories percolate up
    lookup = FS.lookupPath(old_path, {
      parent: true
    });
    old_dir = lookup.node;
    lookup = FS.lookupPath(new_path, {
      parent: true
    });
    new_dir = lookup.node;
    if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
    // need to be part of the same mount
    if (old_dir.mount !== new_dir.mount) {
      throw new FS.ErrnoError(75);
    }
    // source must exist
    var old_node = FS.lookupNode(old_dir, old_name);
    // old path should not be an ancestor of the new path
    var relative = PATH_FS.relative(old_path, new_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(28);
    }
    // new path should not be an ancestor of the old path
    relative = PATH_FS.relative(new_path, old_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(55);
    }
    // see if the new path already exists
    var new_node;
    try {
      new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {}
    // early out if nothing needs to change
    if (old_node === new_node) {
      return;
    }
    // we'll need to delete the old entry
    var isdir = FS.isDir(old_node.mode);
    var errCode = FS.mayDelete(old_dir, old_name, isdir);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    // need delete permissions if we'll be overwriting.
    // need create permissions if new doesn't already exist.
    errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!old_dir.node_ops.rename) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
      throw new FS.ErrnoError(10);
    }
    // if we are going to change the parent, check write permissions
    if (new_dir !== old_dir) {
      errCode = FS.nodePermissions(old_dir, "w");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    // remove the node from the lookup hash
    FS.hashRemoveNode(old_node);
    // do the underlying fs rename
    try {
      old_dir.node_ops.rename(old_node, new_dir, new_name);
      // update old node (we do this here to avoid each backend
      // needing to)
      old_node.parent = new_dir;
    } catch (e) {
      throw e;
    } finally {
      // add the node back to the hash (in case node_ops.rename
      // changed its name)
      FS.hashAddNode(old_node);
    }
  },
  rmdir(path) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, true);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.rmdir) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    parent.node_ops.rmdir(parent, name);
    FS.destroyNode(node);
  },
  readdir(path) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
    return readdir(node);
  },
  unlink(path) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, false);
    if (errCode) {
      // According to POSIX, we should map EISDIR to EPERM, but
      // we instead do what Linux does (and we must, as we use
      // the musl linux libc).
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.unlink) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    parent.node_ops.unlink(parent, name);
    FS.destroyNode(node);
  },
  readlink(path) {
    var lookup = FS.lookupPath(path);
    var link = lookup.node;
    if (!link) {
      throw new FS.ErrnoError(44);
    }
    if (!link.node_ops.readlink) {
      throw new FS.ErrnoError(28);
    }
    return link.node_ops.readlink(link);
  },
  stat(path, dontFollow) {
    var lookup = FS.lookupPath(path, {
      follow: !dontFollow
    });
    var node = lookup.node;
    var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
    return getattr(node);
  },
  fstat(fd) {
    var stream = FS.getStreamChecked(fd);
    var node = stream.node;
    var getattr = stream.stream_ops.getattr;
    var arg = getattr ? stream : node;
    getattr ??= node.node_ops.getattr;
    FS.checkOpExists(getattr, 63);
    return getattr(arg);
  },
  lstat(path) {
    return FS.stat(path, true);
  },
  doChmod(stream, node, mode, dontFollow) {
    FS.doSetAttr(stream, node, {
      mode: (mode & 4095) | (node.mode & ~4095),
      ctime: Date.now(),
      dontFollow
    });
  },
  chmod(path, mode, dontFollow) {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, {
        follow: !dontFollow
      });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doChmod(null, node, mode, dontFollow);
  },
  lchmod(path, mode) {
    FS.chmod(path, mode, true);
  },
  fchmod(fd, mode) {
    var stream = FS.getStreamChecked(fd);
    FS.doChmod(stream, stream.node, mode, false);
  },
  doChown(stream, node, dontFollow) {
    FS.doSetAttr(stream, node, {
      timestamp: Date.now(),
      dontFollow
    });
  },
  chown(path, uid, gid, dontFollow) {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, {
        follow: !dontFollow
      });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doChown(null, node, dontFollow);
  },
  lchown(path, uid, gid) {
    FS.chown(path, uid, gid, true);
  },
  fchown(fd, uid, gid) {
    var stream = FS.getStreamChecked(fd);
    FS.doChown(stream, stream.node, false);
  },
  doTruncate(stream, node, len) {
    if (FS.isDir(node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!FS.isFile(node.mode)) {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.nodePermissions(node, "w");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.doSetAttr(stream, node, {
      size: len,
      timestamp: Date.now()
    });
  },
  truncate(path, len) {
    if (len < 0) {
      throw new FS.ErrnoError(28);
    }
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, {
        follow: true
      });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doTruncate(null, node, len);
  },
  ftruncate(fd, len) {
    var stream = FS.getStreamChecked(fd);
    if (len < 0 || (stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(28);
    }
    FS.doTruncate(stream, stream.node, len);
  },
  utime(path, atime, mtime, dontFollow) {
    var lookup = FS.lookupPath(path, {
      follow: !dontFollow
    });
    FS.doSetAttr(null, lookup.node, {
      atime,
      mtime,
      dontFollow
    });
  },
  open(path, flags, mode = 438) {
    if (path === "") {
      throw new FS.ErrnoError(44);
    }
    flags = FS_modeStringToFlags(flags);
    if ((flags & 64)) {
      mode = (mode & 4095) | 32768;
    } else {
      mode = 0;
    }
    var node;
    var isDirPath;
    if (typeof path == "object") {
      node = path;
    } else {
      isDirPath = path.endsWith("/");
      // noent_okay makes it so that if the final component of the path
      // doesn't exist, lookupPath returns `node: undefined`. `path` will be
      // updated to point to the target of all symlinks.
      var lookup = FS.lookupPath(path, {
        follow: !(flags & 131072),
        noent_okay: true
      });
      node = lookup.node;
      path = lookup.path;
    }
    // perhaps we need to create the node
    var created = false;
    if ((flags & 64)) {
      if (node) {
        // if O_CREAT and O_EXCL are set, error out if the node already exists
        if ((flags & 128)) {
          throw new FS.ErrnoError(20);
        }
      } else if (isDirPath) {
        throw new FS.ErrnoError(31);
      } else {
        // node doesn't exist, try to create it
        // Ignore the permission bits here to ensure we can `open` this new
        // file below. We use chmod below to apply the permissions once the
        // file is open.
        node = FS.mknod(path, mode | 511, 0);
        created = true;
      }
    }
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    // can't truncate a device
    if (FS.isChrdev(node.mode)) {
      flags &= ~512;
    }
    // if asked only for a directory, then this must be one
    if ((flags & 65536) && !FS.isDir(node.mode)) {
      throw new FS.ErrnoError(54);
    }
    // check permissions, if this is not a file we just created now (it is ok to
    // create and write to a file with read-only permissions; it is read-only
    // for later use)
    if (!created) {
      var errCode = FS.mayOpen(node, flags);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    // do truncation if necessary
    if ((flags & 512) && !created) {
      FS.truncate(node, 0);
    }
    // we've already handled these, don't pass down to the underlying vfs
    flags &= ~(128 | 512 | 131072);
    // register the stream with the filesystem
    var stream = FS.createStream({
      node,
      path: FS.getPath(node),
      // we want the absolute path to the node
      flags,
      seekable: true,
      position: 0,
      stream_ops: node.stream_ops,
      // used by the file family libc calls (fopen, fwrite, ferror, etc.)
      ungotten: [],
      error: false
    });
    // call the new stream's open function
    if (stream.stream_ops.open) {
      stream.stream_ops.open(stream);
    }
    if (created) {
      FS.chmod(node, mode & 511);
    }
    return stream;
  },
  close(stream) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (stream.getdents) stream.getdents = null;
    // free readdir state
    // The fd is going away: wake anything waiting on it (poll/epoll) with
    // POLLNVAL so a blocking wait unblocks and an epoll registration is evicted
    // on its next derive. Only sockets/pipes/epoll ever carry a wait-queue, so
    // for every other stream (incl. nodeless noderawfs stdio) this is a no-op.
    stream.node?.notifyListeners(32);
    try {
      if (stream.stream_ops.close) {
        stream.stream_ops.close(stream);
      }
    } catch (e) {
      throw e;
    } finally {
      FS.closeStream(stream.fd);
    }
    stream.fd = null;
  },
  isClosed(stream) {
    return stream.fd === null;
  },
  llseek(stream, offset, whence) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (!stream.seekable || !stream.stream_ops.llseek) {
      throw new FS.ErrnoError(70);
    }
    if (whence != 0 && whence != 1 && whence != 2) {
      throw new FS.ErrnoError(28);
    }
    stream.position = stream.stream_ops.llseek(stream, offset, whence);
    stream.ungotten = [];
    return stream.position;
  },
  read(stream, buffer, offset, length, position) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.read) {
      throw new FS.ErrnoError(28);
    }
    var seeking = typeof position != "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
    if (!seeking) stream.position += bytesRead;
    return bytesRead;
  },
  write(stream, buffer, offset, length, position, canOwn) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.write) {
      throw new FS.ErrnoError(28);
    }
    if (stream.seekable && stream.flags & 1024) {
      // seek to the end before writing in append mode
      FS.llseek(stream, 0, 2);
    }
    var seeking = typeof position != "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
    if (!seeking) stream.position += bytesWritten;
    return bytesWritten;
  },
  mmap(stream, length, position, prot, flags) {
    // User requests writing to file (prot & PROT_WRITE != 0).
    // Checking if we have permissions to write to the file unless
    // MAP_PRIVATE flag is set. According to POSIX spec it is possible
    // to write to file opened in read-only mode with MAP_PRIVATE flag,
    // as all modifications will be visible only in the memory of
    // the current process.
    if ((prot & 2) && !(flags & 2) && (stream.flags & 2097155) !== 2) {
      throw new FS.ErrnoError(2);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(2);
    }
    if (!stream.stream_ops.mmap) {
      throw new FS.ErrnoError(43);
    }
    if (!length) {
      throw new FS.ErrnoError(28);
    }
    return stream.stream_ops.mmap(stream, length, position, prot, flags);
  },
  msync(stream, buffer, offset, length, mmapFlags) {
    if (!stream.stream_ops.msync) {
      return 0;
    }
    return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
  },
  ioctl(stream, cmd, arg) {
    if (!stream.stream_ops.ioctl) {
      throw new FS.ErrnoError(59);
    }
    return stream.stream_ops.ioctl(stream, cmd, arg);
  },
  readFile(path, opts = {}) {
    opts.flags = opts.flags ?? 0;
    opts.encoding = opts.encoding ?? "binary";
    if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
      abort(`Invalid encoding type "${opts.encoding}"`);
    }
    var stream = FS.open(path, opts.flags);
    var stat = FS.stat(path);
    var length = stat.size;
    var buf = new Uint8Array(length);
    FS.read(stream, buf, 0, length, 0);
    if (opts.encoding === "utf8") {
      buf = UTF8ArrayToString(buf);
    }
    FS.close(stream);
    return buf;
  },
  writeFile(path, data, opts = {}) {
    opts.flags = opts.flags ?? 577;
    var stream = FS.open(path, opts.flags, opts.mode);
    data = FS_fileDataToTypedArray(data);
    FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
    FS.close(stream);
  },
  cwd: () => FS.currentPath,
  chdir(path) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    if (lookup.node === null) {
      throw new FS.ErrnoError(44);
    }
    if (!FS.isDir(lookup.node.mode)) {
      throw new FS.ErrnoError(54);
    }
    var errCode = FS.nodePermissions(lookup.node, "x");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.currentPath = lookup.path;
  },
  createDefaultDirectories() {
    FS.mkdir("/tmp");
    FS.mkdir("/home");
    FS.mkdir("/home/web_user");
  },
  createDefaultDevices() {
    // create /dev
    FS.mkdir("/dev");
    // setup /dev/null
    FS.registerDevice(FS.makedev(1, 3), {
      read: () => 0,
      write: (stream, buffer, offset, length, pos) => length,
      llseek: () => 0
    });
    FS.mkdev("/dev/null", FS.makedev(1, 3));
    // setup /dev/tty and /dev/tty1
    // stderr needs to print output using err() rather than out()
    // so we register a second tty just for it.
    TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
    TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
    FS.mkdev("/dev/tty", FS.makedev(5, 0));
    FS.mkdev("/dev/tty1", FS.makedev(6, 0));
    // setup /dev/[u]random
    // use a buffer to avoid overhead of individual crypto calls per byte
    var randomBuffer = new Uint8Array(1024), randomLeft = 0;
    var randomByte = () => {
      if (!randomLeft) {
        randomFill(randomBuffer);
        randomLeft = randomBuffer.byteLength;
      }
      return randomBuffer[--randomLeft];
    };
    FS.createDevice("/dev", "random", randomByte);
    FS.createDevice("/dev", "urandom", randomByte);
    // we're not going to emulate the actual shm device,
    // just create the tmp dirs that reside in it commonly
    FS.mkdir("/dev/shm");
    FS.mkdir("/dev/shm/tmp");
  },
  createSpecialDirectories() {
    // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the
    // name of the stream for fd 6 (see test_unistd_ttyname)
    FS.mkdir("/proc");
    var proc_self = FS.mkdir("/proc/self");
    FS.mkdir("/proc/self/fd");
    FS.mount({
      mount() {
        var node = FS.createNode(proc_self, "fd", 16895, 73);
        node.stream_ops = {
          llseek: MEMFS.stream_ops.llseek
        };
        node.node_ops = {
          lookup(parent, name) {
            var fd = +name;
            var stream = FS.getStreamChecked(fd);
            var ret = {
              parent: null,
              mount: {
                mountpoint: "fake"
              },
              node_ops: {
                readlink: () => stream.path
              },
              id: fd + 1
            };
            ret.parent = ret;
            // make it look like a simple root node
            return ret;
          },
          readdir() {
            return Array.from(FS.streams.entries()).filter(([k, v]) => v).map(([k, v]) => k.toString());
          }
        };
        return node;
      }
    }, {}, "/proc/self/fd");
  },
  createStandardStreams(input, output, error) {
    // TODO deprecate the old functionality of a single
    // input / output callback and that utilizes FS.createDevice
    // and instead require a unique set of stream ops
    // by default, we symlink the standard streams to the
    // default tty devices. however, if the standard streams
    // have been overwritten we create a unique device for
    // them instead.
    if (input) {
      FS.createDevice("/dev", "stdin", input);
    } else {
      FS.symlink("/dev/tty", "/dev/stdin");
    }
    if (output) {
      FS.createDevice("/dev", "stdout", null, output);
    } else {
      FS.symlink("/dev/tty", "/dev/stdout");
    }
    if (error) {
      FS.createDevice("/dev", "stderr", null, error);
    } else {
      FS.symlink("/dev/tty1", "/dev/stderr");
    }
    // open default streams for the stdin, stdout and stderr devices
    var stdin = FS.open("/dev/stdin", 0);
    var stdout = FS.open("/dev/stdout", 1);
    var stderr = FS.open("/dev/stderr", 1);
  },
  staticInit() {
    FS.nameTable = new Array(4096);
    FS.mount(MEMFS, {}, "/");
    FS.createDefaultDirectories();
    FS.createDefaultDevices();
    FS.createSpecialDirectories();
    FS.filesystems = {
      "MEMFS": MEMFS,
      "IDBFS": IDBFS
    };
  },
  init(input, output, error) {
    FS.initialized = true;
    // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
    input ??= Module["stdin"];
    output ??= Module["stdout"];
    error ??= Module["stderr"];
    FS.createStandardStreams(input, output, error);
  },
  quit() {
    FS.initialized = false;
    // force-flush all streams, so we get musl std streams printed out
    // close all of our streams
    for (var stream of FS.streams) {
      if (stream) {
        FS.close(stream);
      }
    }
  },
  findObject(path, dontResolveLastLink) {
    var ret = FS.analyzePath(path, dontResolveLastLink);
    if (!ret.exists) {
      return null;
    }
    return ret.object;
  },
  analyzePath(path, dontResolveLastLink) {
    // operate from within the context of the symlink's target
    try {
      var lookup = FS.lookupPath(path, {
        follow: !dontResolveLastLink
      });
      path = lookup.path;
    } catch (e) {}
    var ret = {
      isRoot: false,
      exists: false,
      error: 0,
      name: null,
      path: null,
      object: null,
      parentExists: false,
      parentPath: null,
      parentObject: null
    };
    try {
      var lookup = FS.lookupPath(path, {
        parent: true
      });
      ret.parentExists = true;
      ret.parentPath = lookup.path;
      ret.parentObject = lookup.node;
      ret.name = PATH.basename(path);
      lookup = FS.lookupPath(path, {
        follow: !dontResolveLastLink
      });
      ret.exists = true;
      ret.path = lookup.path;
      ret.object = lookup.node;
      ret.name = lookup.node.name;
      ret.isRoot = lookup.path === "/";
    } catch (e) {
      ret.error = e.errno;
    }
    return ret;
  },
  createPath(parent, path, canRead, canWrite) {
    parent = typeof parent == "string" ? parent : FS.getPath(parent);
    var parts = path.split("/").reverse();
    while (parts.length) {
      var part = parts.pop();
      if (!part) continue;
      var current = PATH.join2(parent, part);
      try {
        FS.mkdir(current);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
      parent = current;
    }
    return current;
  },
  createFile(parent, name, properties, canRead, canWrite) {
    var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
    var mode = FS_getMode(canRead, canWrite);
    return FS.create(path, mode);
  },
  createDataFile(parent, name, data, canRead, canWrite, canOwn) {
    var path = name;
    if (parent) {
      parent = typeof parent == "string" ? parent : FS.getPath(parent);
      path = name ? PATH.join2(parent, name) : parent;
    }
    var mode = FS_getMode(canRead, canWrite);
    var node = FS.create(path, mode);
    if (data) {
      data = FS_fileDataToTypedArray(data);
      // make sure we can write to the file
      FS.chmod(node, mode | 146);
      var stream = FS.open(node, 577);
      FS.write(stream, data, 0, data.length, 0, canOwn);
      FS.close(stream);
      FS.chmod(node, mode);
    }
  },
  createDevice(parent, name, input, output) {
    var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
    var mode = FS_getMode(!!input, !!output);
    FS.createDevice.major ??= 64;
    var dev = FS.makedev(FS.createDevice.major++, 0);
    // Create a fake device that a set of stream ops to emulate
    // the old behavior.
    FS.registerDevice(dev, {
      open(stream) {
        stream.seekable = false;
      },
      close(stream) {
        // flush any pending line data
        if (output?.buffer?.length) {
          output(10);
        }
      },
      read(stream, buffer, offset, length, pos) {
        var bytesRead = 0;
        for (var i = 0; i < length; i++) {
          var result;
          try {
            result = input();
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (result === undefined && !bytesRead) {
            throw new FS.ErrnoError(6);
          }
          if (result === null || result === undefined) break;
          bytesRead++;
          buffer[offset + i] = result;
        }
        if (bytesRead) {
          stream.node.atime = Date.now();
        }
        return bytesRead;
      },
      write(stream, buffer, offset, length, pos) {
        for (var i = 0; i < length; i++) {
          try {
            output(buffer[offset + i]);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
        if (length) {
          stream.node.mtime = stream.node.ctime = Date.now();
        }
        return i;
      }
    });
    return FS.mkdev(path, mode, dev);
  },
  forceLoadFile(obj) {
    if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
    if (globalThis.XMLHttpRequest) {
      abort("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
    } else {
      // Command-line.
      try {
        obj.contents = readBinary(obj.url);
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
    }
  },
  createLazyFile(parent, name, url, canRead, canWrite) {
    // Lazy chunked Uint8Array (implements get and length from Uint8Array).
    // Actual getting is abstracted away for eventual reuse.
    class LazyUint8Array {
      lengthKnown=false;
      chunks=[];
      // Loaded chunks. Index is the chunk number
      get(idx) {
        if (idx > this.length - 1 || idx < 0) {
          return undefined;
        }
        var chunkOffset = idx % this.chunkSize;
        var chunkNum = (idx / this.chunkSize) | 0;
        return this.getter(chunkNum)[chunkOffset];
      }
      setDataGetter(getter) {
        this.getter = getter;
      }
      cacheLength() {
        // Find length
        var xhr = new XMLHttpRequest;
        xhr.open("HEAD", url, false);
        xhr.send(null);
        if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort(`Couldn't load ${url}. Status: ${xhr.status}`);
        var datalength = Number(xhr.getResponseHeader("Content-length"));
        var header;
        var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
        var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
        var chunkSize = 1024 * 1024;
        // Chunk size in bytes
        if (!hasByteServing) chunkSize = datalength;
        // Function to get a range from the remote URL.
        var doXHR = (from, to) => {
          if (from > to) abort(`invalid range (${from}, ${to}) or no bytes requested!`);
          if (to > datalength - 1) abort(`only ${datalength} bytes available! programmer error!`);
          // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
          var xhr = new XMLHttpRequest;
          xhr.open("GET", url, false);
          if (datalength !== chunkSize) xhr.setRequestHeader("Range", `bytes=${from}-${to}`);
          // Some hints to the browser that we want binary data.
          xhr.responseType = "arraybuffer";
          if (xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          }
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort(`Couldn't load ${url}. Status: ${xhr.status}`);
          if (xhr.response !== undefined) {
            return new Uint8Array(/** @type{Array<number>} */ (xhr.response || []));
          }
          return intArrayFromString(xhr.responseText ?? "", true);
        };
        var lazyArray = this;
        lazyArray.setDataGetter(chunkNum => {
          var start = chunkNum * chunkSize;
          var end = (chunkNum + 1) * chunkSize - 1;
          // including this byte
          end = Math.min(end, datalength - 1);
          // if datalength-1 is selected, this is the last block
          if (typeof lazyArray.chunks[chunkNum] == "undefined") {
            lazyArray.chunks[chunkNum] = doXHR(start, end);
          }
          if (typeof lazyArray.chunks[chunkNum] == "undefined") abort("doXHR failed!");
          return lazyArray.chunks[chunkNum];
        });
        if (usesGzip || !datalength) {
          // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
          chunkSize = datalength = 1;
          // this will force getter(0)/doXHR do download the whole file
          datalength = this.getter(0).length;
          chunkSize = datalength;
          out("LazyFiles on gzip forces download of the whole file when length is accessed");
        }
        this._length = datalength;
        this._chunkSize = chunkSize;
        this.lengthKnown = true;
      }
      get length() {
        if (!this.lengthKnown) {
          this.cacheLength();
        }
        return this._length;
      }
      get chunkSize() {
        if (!this.lengthKnown) {
          this.cacheLength();
        }
        return this._chunkSize;
      }
    }
    if (globalThis.XMLHttpRequest) {
      if (!ENVIRONMENT_IS_WORKER) abort("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
      var lazyArray = new LazyUint8Array;
      var properties = {
        isDevice: false,
        contents: lazyArray
      };
    } else {
      var properties = {
        isDevice: false,
        url
      };
    }
    var node = FS.createFile(parent, name, properties, canRead, canWrite);
    // This is a total hack, but I want to get this lazy file code out of the
    // core of MEMFS. If we want to keep this lazy file concept I feel it should
    // be its own thin LAZYFS proxying calls to MEMFS.
    if (properties.contents) {
      node.contents = properties.contents;
    } else if (properties.url) {
      node.contents = null;
      node.url = properties.url;
    }
    // Add a function that defers querying the file size until it is asked the first time.
    Object.defineProperties(node, {
      usedBytes: {
        get: function() {
          return this.contents.length;
        }
      }
    });
    // override each stream op with one that tries to force load the lazy file first
    var stream_ops = {};
    for (const [key, fn] of Object.entries(node.stream_ops)) {
      stream_ops[key] = (...args) => {
        FS.forceLoadFile(node);
        return fn(...args);
      };
    }
    function writeChunks(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= contents.length) return 0;
      var size = Math.min(contents.length - position, length);
      if (contents.slice) {
        // normal array
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents[position + i];
        }
      } else {
        for (var i = 0; i < size; i++) {
          // LazyUint8Array from sync binary XHR
          buffer[offset + i] = contents.get(position + i);
        }
      }
      return size;
    }
    // use a custom read function
    stream_ops.read = (stream, buffer, offset, length, position) => {
      FS.forceLoadFile(node);
      return writeChunks(stream, buffer, offset, length, position);
    };
    // use a custom mmap function
    stream_ops.mmap = (stream, length, position, prot, flags) => {
      FS.forceLoadFile(node);
      var ptr = mmapAlloc(length);
      if (!ptr) {
        throw new FS.ErrnoError(48);
      }
      writeChunks(stream, (growMemViews(), HEAP8), ptr, length, position);
      return {
        ptr,
        allocated: true
      };
    };
    node.stream_ops = stream_ops;
    return node;
  }
};

var SOCKFS = {
  websocketArgs: {},
  callbacks: {},
  on(event, callback) {
    SOCKFS.callbacks[event] = callback;
  },
  emit(event, param) {
    SOCKFS.callbacks[event]?.(param);
    // Bridge socket readiness into the inode wait-queue (poll/epoll). The
    // 'error' event carries [fd, ...]; the rest carry the fd directly.
    var fd = event === "error" ? param[0] : param;
    var flags = {
      "message": 64 | 1,
      "open": 4,
      "connection": 64 | 1,
      "close": 1 | 16,
      "error": 8
    }[event];
    // 'listen' has no readiness mapping; skip it.
    if (flags) FS.getStream(fd)?.node.notifyListeners(flags);
  },
  mount(mount) {
    // The incoming Module['websocket'] can be used for configuring 
    // subprotocol/url, etc
    SOCKFS.websocketArgs = Module["websocket"] || {};
    // Add the Event registration mechanism to the exported websocket configuration
    // object so we can register network callbacks from native JavaScript too.
    // For more documentation see system/include/emscripten/emscripten.h
    (Module["websocket"] ??= {})["on"] = SOCKFS.on;
    return FS.createNode(null, "/", 16895, 0);
  },
  createSocket(family, type, protocol) {
    if (family != 2) {
      throw new FS.ErrnoError(5);
    }
    type &= ~526336;
    // Some applications may pass it; it makes no sense for a single process.
    // Emscripten only supports SOCK_STREAM and SOCK_DGRAM
    if (type != 1 && type != 2) {
      throw new FS.ErrnoError(28);
    }
    var streaming = type == 1;
    // The IPPROTO_TCP protocol guard only applies to INET stream sockets; unix
    // stream sockets use protocol 0.
    if (streaming && protocol && protocol != 6) {
      throw new FS.ErrnoError(66);
    }
    // create our internal socket structure
    var sock = {
      family,
      type,
      protocol,
      server: null,
      error: null,
      // Used in getsockopt for SOL_SOCKET/SO_ERROR test
      peers: {},
      pending: [],
      recv_queue: [],
      sock_ops: SOCKFS.websocket_sock_ops
    };
    // create the filesystem node to store the socket structure
    var name = SOCKFS.nextname();
    var node = FS.createNode(SOCKFS.root, name, 49152, 0);
    node.sock = sock;
    // and the wrapping stream that enables library functions such
    // as read and write to indirectly interact with the socket
    var stream = FS.createStream({
      path: name,
      node,
      flags: 2,
      seekable: false,
      stream_ops: SOCKFS.stream_ops
    });
    // map the new stream to the socket structure (sockets have a 1:1
    // relationship with a stream)
    sock.stream = stream;
    return sock;
  },
  getSocket(fd) {
    var stream = FS.getStream(fd);
    if (!stream || !FS.isSocket(stream.node.mode)) {
      return null;
    }
    return stream.node.sock;
  },
  stream_ops: {
    getattr(stream) {
      var node = stream.node;
      return {
        dev: 1,
        ino: node.id,
        mode: 49152 | 511,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        size: 0,
        atime: new Date(0),
        mtime: new Date(0),
        ctime: new Date(0),
        blksize: 4096,
        blocks: 0
      };
    },
    poll(stream) {
      var sock = stream.node.sock;
      return sock.sock_ops.poll(sock);
    },
    ioctl(stream, request, varargs) {
      var sock = stream.node.sock;
      return sock.sock_ops.ioctl(sock, request, varargs);
    },
    read(stream, buffer, offset, length, position) {
      var sock = stream.node.sock;
      var msg = sock.sock_ops.recvmsg(sock, length);
      if (!msg) {
        // socket is closed
        return 0;
      }
      buffer.set(msg.buffer, offset);
      return msg.buffer.length;
    },
    write(stream, buffer, offset, length, position) {
      var sock = stream.node.sock;
      return sock.sock_ops.sendmsg(sock, buffer, offset, length);
    },
    close(stream) {
      var sock = stream.node.sock;
      sock.sock_ops.close(sock);
    }
  },
  nextname() {
    if (!SOCKFS.nextname.current) {
      SOCKFS.nextname.current = 0;
    }
    return `socket[${SOCKFS.nextname.current++}]`;
  },
  websocket_sock_ops: {
    createPeer(sock, addr, port) {
      var ws;
      if (typeof addr == "object") {
        ws = addr;
        addr = null;
        port = null;
      }
      if (ws) {
        // for sockets that've already connected (e.g. we're the server)
        // we can inspect the _socket property for the address
        if (ws._socket) {
          addr = ws._socket.remoteAddress;
          port = ws._socket.remotePort;
        } else {
          var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
          if (!result) {
            throw new Error("WebSocket URL must be in the format ws(s)://address:port");
          }
          addr = result[1];
          port = parseInt(result[2], 10);
        }
      } else {
        // create the actual websocket object and connect
        try {
          // The default value is 'ws://' the replace is needed because the compiler replaces '//' comments with '#'
          // comments without checking context, so we'd end up with ws:#, the replace swaps the '#' for '//' again.
          var url = "ws://".replace("#", "//");
          // Make the WebSocket subprotocol (Sec-WebSocket-Protocol) default to binary if no configuration is set.
          var subProtocols = "binary";
          // The default value is 'binary'
          // The default WebSocket options
          var opts = undefined;
          // Fetch runtime WebSocket URL config.
          if (SOCKFS.websocketArgs["url"]) {
            url = SOCKFS.websocketArgs["url"];
          }
          // Fetch runtime WebSocket subprotocol config.
          if (SOCKFS.websocketArgs["subprotocol"]) {
            subProtocols = SOCKFS.websocketArgs["subprotocol"];
          } else if (SOCKFS.websocketArgs["subprotocol"] === null) {
            subProtocols = "null";
          }
          if (url === "ws://" || url === "wss://") {
            // Is the supplied URL config just a prefix, if so complete it.
            var parts = addr.split("/");
            url = url + parts[0] + ":" + port + "/" + parts.slice(1).join("/");
          }
          if (subProtocols !== "null") {
            // The regex trims the string (removes spaces at the beginning and end), then splits the string by
            // <any space>,<any space> into an Array. Whitespace removal is important for Websockify and ws.
            subProtocols = subProtocols.replace(/^ +| +$/g, "").split(/ *, */);
            opts = subProtocols;
          }
          // If node we use the ws library.
          var WebSocketConstructor;
          if (ENVIRONMENT_IS_NODE) {
            WebSocketConstructor = /** @type{(typeof WebSocket)} */ (require("ws"));
          } else {
            WebSocketConstructor = WebSocket;
          }
          ws = new WebSocketConstructor(url, opts);
          ws.binaryType = "arraybuffer";
        } catch (e) {
          throw new FS.ErrnoError(23);
        }
      }
      var peer = {
        addr,
        port,
        socket: ws,
        msg_send_queue: []
      };
      SOCKFS.websocket_sock_ops.addPeer(sock, peer);
      SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
      // if this is a bound dgram socket, send the port number first to allow
      // us to override the ephemeral port reported to us by remotePort on the
      // remote end.
      if (sock.type === 2 && typeof sock.sport != "undefined") {
        peer.msg_send_queue.push(new Uint8Array([ 255, 255, 255, 255, "p".charCodeAt(0), "o".charCodeAt(0), "r".charCodeAt(0), "t".charCodeAt(0), ((sock.sport & 65280) >> 8), (sock.sport & 255) ]));
      }
      return peer;
    },
    getPeer(sock, addr, port) {
      return sock.peers[addr + ":" + port];
    },
    addPeer(sock, peer) {
      sock.peers[peer.addr + ":" + peer.port] = peer;
    },
    removePeer(sock, peer) {
      delete sock.peers[peer.addr + ":" + peer.port];
    },
    handlePeerEvents(sock, peer) {
      var first = true;
      function handleOpen() {
        sock.connecting = false;
        SOCKFS.emit("open", sock.stream.fd);
        try {
          var queued = peer.msg_send_queue.shift();
          while (queued) {
            peer.socket.send(queued);
            queued = peer.msg_send_queue.shift();
          }
        } catch (e) {
          // not much we can do here in the way of proper error handling as we've already
          // lied and said this data was sent. shut it down.
          peer.socket.close();
        }
      }
      function handleMessage(data) {
        if (typeof data == "string") {
          var encoder = new TextEncoder;
          // should be utf-8
          data = encoder.encode(data);
        } else {
          if (data.byteLength == 0) {
            // An empty ArrayBuffer will emit a pseudo disconnect event
            // as recv/recvmsg will return zero which indicates that a socket
            // has performed a shutdown although the connection has not been disconnected yet.
            return;
          }
          data = new Uint8Array(data);
        }
        // if this is the port message, override the peer's port with it
        var wasfirst = first;
        first = false;
        if (wasfirst && data.length === 10 && data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 && data[4] === "p".charCodeAt(0) && data[5] === "o".charCodeAt(0) && data[6] === "r".charCodeAt(0) && data[7] === "t".charCodeAt(0)) {
          // update the peer's port and its key in the peer map
          var newport = ((data[8] << 8) | data[9]);
          SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          peer.port = newport;
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          return;
        }
        sock.recv_queue.push({
          addr: peer.addr,
          port: peer.port,
          data
        });
        SOCKFS.emit("message", sock.stream.fd);
      }
      if (ENVIRONMENT_IS_NODE) {
        // EventEmitter-style events use by ws library objects in Node.js).
        peer.socket.on("open", handleOpen);
        peer.socket.on("message", (data, isBinary) => {
          if (!isBinary) {
            return;
          }
          handleMessage((new Uint8Array(data)).buffer);
        });
        peer.socket.on("close", () => SOCKFS.emit("close", sock.stream.fd));
        peer.socket.on("error", error => {
          // Although the ws library may pass errors that may be more descriptive than
          // ECONNREFUSED they are not necessarily the expected error code e.g.
          // ENOTFOUND on getaddrinfo seems to be node.js specific, so using ECONNREFUSED
          // is still probably the most useful thing to do.
          sock.error = 14;
          // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
          SOCKFS.emit("error", [ sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused" ]);
        });
        return;
      }
      peer.socket.onopen = handleOpen;
      peer.socket.onclose = () => SOCKFS.emit("close", sock.stream.fd);
      peer.socket.onmessage = event => handleMessage(event.data);
      peer.socket.onerror = error => {
        // The WebSocket spec only allows a 'simple event' to be thrown on error,
        // so we only really know as much as ECONNREFUSED.
        sock.error = 14;
        // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
        SOCKFS.emit("error", [ sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused" ]);
      };
    },
    poll(sock) {
      if (sock.type === 1 && sock.server) {
        // listen sockets should only say they're available for reading
        // if there are pending clients.
        return sock.pending.length ? (64 | 1) : 0;
      }
      var mask = 0;
      var dest = sock.type === 1 ? // we only care about the socket state for connection-based sockets
      SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) : null;
      if (sock.recv_queue.length || !dest || // connection-less sockets are always ready to read
      (dest && dest.socket.readyState === dest.socket.CLOSING) || (dest && dest.socket.readyState === dest.socket.CLOSED)) {
        // let recv return 0 once closed
        mask |= (64 | 1);
      }
      if (!dest || // connection-less sockets are always ready to write
      (dest && dest.socket.readyState === dest.socket.OPEN)) {
        mask |= 4;
      }
      if ((dest && dest.socket.readyState === dest.socket.CLOSING) || (dest && dest.socket.readyState === dest.socket.CLOSED)) {
        // When an non-blocking connect fails mark the socket as writable.
        // Its up to the calling code to then use getsockopt with SO_ERROR to
        // retrieve the error.
        // See https://man7.org/linux/man-pages/man2/connect.2.html
        if (sock.connecting) {
          mask |= 4;
        } else {
          // A closed peer is both a full hangup and a read-side hangup.
          mask |= 16 | 8192;
        }
      }
      return mask;
    },
    ioctl(sock, request, arg) {
      switch (request) {
       case 21531:
        var bytes = 0;
        if (sock.recv_queue.length) {
          bytes = sock.recv_queue[0].data.length;
        }
        (growMemViews(), HEAP32)[((arg) >> 2)] = bytes;
        return 0;

       case 21537:
        var on = (growMemViews(), HEAP32)[((arg) >> 2)];
        if (on) {
          sock.stream.flags |= 2048;
        } else {
          sock.stream.flags &= ~2048;
        }
        return 0;

       default:
        return 28;
      }
    },
    close(sock) {
      // if we've spawned a listen server, close it
      if (sock.server) {
        try {
          sock.server.close();
        } catch (e) {}
        sock.server = null;
      }
      // close any peer connections
      for (var peer of Object.values(sock.peers)) {
        try {
          peer.socket.close();
        } catch (e) {}
        SOCKFS.websocket_sock_ops.removePeer(sock, peer);
      }
      return 0;
    },
    bind(sock, addr, port) {
      if (typeof sock.saddr != "undefined" || typeof sock.sport != "undefined") {
        throw new FS.ErrnoError(28);
      }
      sock.saddr = addr;
      sock.sport = port;
      // in order to emulate dgram sockets, we need to launch a listen server when
      // binding on a connection-less socket
      // note: this is only required on the server side
      if (sock.type === 2) {
        // close the existing server if it exists
        if (sock.server) {
          sock.server.close();
          sock.server = null;
        }
        // swallow error operation not supported error that occurs when binding in the
        // browser where this isn't supported
        try {
          sock.sock_ops.listen(sock, 0);
        } catch (e) {
          if (!(e.name === "ErrnoError")) throw e;
          if (e.errno !== 138) throw e;
        }
      }
    },
    connect(sock, addr, port) {
      if (sock.server) {
        throw new FS.ErrnoError(138);
      }
      // TODO autobind
      // if (!sock.addr && sock.type == 2) {
      // }
      // early out if we're already connected / in the middle of connecting
      if (typeof sock.daddr != "undefined" && typeof sock.dport != "undefined") {
        var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
        if (dest) {
          if (dest.socket.readyState === dest.socket.CONNECTING) {
            throw new FS.ErrnoError(7);
          } else {
            throw new FS.ErrnoError(30);
          }
        }
      }
      // add the socket to our peer list and set our
      // destination address / port to match
      var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
      sock.daddr = peer.addr;
      sock.dport = peer.port;
      // because we cannot synchronously block to wait for the WebSocket
      // connection to complete, we return here pretending that the connection
      // was a success.
      sock.connecting = true;
    },
    listen(sock, backlog) {
      if (!ENVIRONMENT_IS_NODE) {
        throw new FS.ErrnoError(138);
      }
      if (sock.server) {
        throw new FS.ErrnoError(28);
      }
      var WebSocketServer = require("ws").Server;
      var host = sock.saddr;
      sock.server = new WebSocketServer({
        host,
        port: sock.sport
      });
      SOCKFS.emit("listen", sock.stream.fd);
      // Send Event with listen fd.
      sock.server.on("connection", ws => {
        if (sock.type === 1) {
          var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
          // create a peer on the new socket
          var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
          newsock.daddr = peer.addr;
          newsock.dport = peer.port;
          // push to queue for accept to pick up
          sock.pending.push(newsock);
          SOCKFS.emit("connection", newsock.stream.fd);
          // A queued client makes the listening socket readable (POLLIN).
          sock.stream.node.notifyListeners(64 | 1);
        } else {
          // create a peer on the listen socket so calling sendto
          // with the listen socket and an address will resolve
          // to the correct client
          SOCKFS.websocket_sock_ops.createPeer(sock, ws);
          SOCKFS.emit("connection", sock.stream.fd);
        }
      });
      sock.server.on("close", () => {
        SOCKFS.emit("close", sock.stream.fd);
        sock.server = null;
      });
      sock.server.on("error", error => {
        // Although the ws library may pass errors that may be more descriptive than
        // ECONNREFUSED they are not necessarily the expected error code e.g.
        // ENOTFOUND on getaddrinfo seems to be node.js specific, so using EHOSTUNREACH
        // is still probably the most useful thing to do. This error shouldn't
        // occur in a well written app as errors should get trapped in the compiled
        // app's own getaddrinfo call.
        sock.error = 23;
        // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
        SOCKFS.emit("error", [ sock.stream.fd, sock.error, "EHOSTUNREACH: Host is unreachable" ]);
      });
    },
    accept(listensock) {
      if (!listensock.server || !listensock.pending.length) {
        throw new FS.ErrnoError(28);
      }
      var newsock = listensock.pending.shift();
      newsock.stream.flags = listensock.stream.flags;
      return newsock;
    },
    getname(sock, peer) {
      var addr, port;
      if (peer) {
        if (sock.daddr === undefined || sock.dport === undefined) {
          throw new FS.ErrnoError(53);
        }
        addr = sock.daddr;
        port = sock.dport;
      } else {
        // TODO saddr and sport will be set for bind()'d UDP sockets, but what
        // should we be returning for TCP sockets that've been connect()'d?
        addr = sock.saddr || 0;
        port = sock.sport || 0;
      }
      return {
        addr,
        port
      };
    },
    sendmsg(sock, buffer, offset, length, addr, port) {
      if (sock.type === 2) {
        // connection-less sockets will honor the message address,
        // and otherwise fall back to the bound destination address
        if (addr === undefined || port === undefined) {
          addr = sock.daddr;
          port = sock.dport;
        }
        // if there was no address to fall back to, error out
        if (addr === undefined || port === undefined) {
          throw new FS.ErrnoError(17);
        }
      } else {
        // connection-based sockets will only use the bound
        addr = sock.daddr;
        port = sock.dport;
      }
      // find the peer for the destination address
      var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
      // early out if not connected with a connection-based socket
      if (sock.type === 1) {
        if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
          throw new FS.ErrnoError(53);
        }
      }
      // create a copy of the incoming data to send, as the WebSocket API
      // doesn't work entirely with an ArrayBufferView, it'll just send
      // the entire underlying buffer
      if (ArrayBuffer.isView(buffer)) {
        offset += buffer.byteOffset;
        buffer = buffer.buffer;
      }
      var data = buffer.slice(offset, offset + length);
      // WebSockets .send() does not allow passing a SharedArrayBuffer, so
      // clone the SharedArrayBuffer as regular ArrayBuffer before
      // sending.
      if (data instanceof SharedArrayBuffer) {
        data = new Uint8Array(new Uint8Array(data)).buffer;
      }
      // if we don't have a cached connectionless UDP datagram connection, or
      // the TCP socket is still connecting, queue the message to be sent upon
      // connect, and lie, saying the data was sent now.
      if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
        // if we're not connected, open a new connection
        if (sock.type === 2) {
          if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
            dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          }
        }
        dest.msg_send_queue.push(data);
        return length;
      }
      try {
        // send the actual data
        dest.socket.send(data);
        return length;
      } catch (e) {
        throw new FS.ErrnoError(28);
      }
    },
    recvmsg(sock, length, flags) {
      // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
      if (sock.type === 1 && sock.server) {
        // tcp servers should not be recv()'ing on the listen socket
        throw new FS.ErrnoError(53);
      }
      // MSG_PEEK returns the head of the queue without consuming it, so a
      // later recv sees the same bytes and poll still reports it readable.
      var peek = flags & 2;
      var queued = sock.recv_queue[0];
      if (!queued) {
        if (sock.type === 1) {
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
          if (!dest) {
            // if we have a destination address but are not connected, error out
            throw new FS.ErrnoError(53);
          }
          if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
            // return null if the socket has closed
            return null;
          }
          // else, our socket is in a valid state but truly has nothing available
          throw new FS.ErrnoError(6);
        }
        throw new FS.ErrnoError(6);
      }
      // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
      // requeued TCP data it'll be an ArrayBufferView
      var queuedLength = queued.data.byteLength || queued.data.length;
      var queuedOffset = queued.data.byteOffset || 0;
      var queuedBuffer = queued.data.buffer || queued.data;
      var bytesRead = Math.min(length, queuedLength);
      var res = {
        buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
        addr: queued.addr,
        port: queued.port
      };
      if (peek) return res;
      sock.recv_queue.shift();
      // push back any unread data for TCP connections
      if (sock.type === 1 && bytesRead < queuedLength) {
        var bytesRemaining = queuedLength - bytesRead;
        queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
        sock.recv_queue.unshift(queued);
      }
      return res;
    }
  }
};

var getSocketFromFD = fd => {
  var socket = SOCKFS.getSocket(fd);
  if (!socket) throw new FS.ErrnoError(8);
  return socket;
};

var inetPton4 = str => {
  var b = str.split(".");
  for (var i = 0; i < 4; i++) {
    var tmp = Number(b[i]);
    if (isNaN(tmp)) return null;
    b[i] = tmp;
  }
  return (b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24)) >>> 0;
};

var inetPton6 = str => {
  var words;
  var w, offset, z, i;
  /* http://home.deds.nl/~aeron/regex/ */ var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
  var parts = [];
  if (!valid6regx.test(str)) {
    return null;
  }
  if (str === "::") {
    return [ 0, 0, 0, 0, 0, 0, 0, 0 ];
  }
  // Z placeholder to keep track of zeros when splitting the string on ':'
  if (str.startsWith("::")) {
    str = str.replace("::", "Z:");
  } else {
    str = str.replace("::", ":Z:");
  }
  if (str.indexOf(".") > 0) {
    // parse IPv4 embedded address
    str = str.replace(new RegExp("[.]", "g"), ":");
    words = str.split(":");
    words[words.length - 4] = Number(words[words.length - 4]) + Number(words[words.length - 3]) * 256;
    words[words.length - 3] = Number(words[words.length - 2]) + Number(words[words.length - 1]) * 256;
    words = words.slice(0, words.length - 2);
  } else {
    words = str.split(":");
  }
  offset = 0;
  z = 0;
  for (w = 0; w < words.length; w++) {
    if (typeof words[w] == "string") {
      if (words[w] === "Z") {
        // compressed zeros - write appropriate number of zero words
        for (z = 0; z < (8 - words.length + 1); z++) {
          parts[w + z] = 0;
        }
        offset = z - 1;
      } else {
        // parse hex field to 16-bit value and write it in network byte-order
        parts[w + offset] = _htons(parseInt(words[w], 16));
      }
    } else {
      // parsed IPv4 words
      parts[w + offset] = words[w];
    }
  }
  return [ (parts[1] << 16) | parts[0], (parts[3] << 16) | parts[2], (parts[5] << 16) | parts[4], (parts[7] << 16) | parts[6] ];
};

/** @type {!Uint8Array} */ var HEAPU8;

var zeroMemory = (ptr, size) => (growMemViews(), HEAPU8).fill(0, ptr, ptr + size);

var DNS = {
  address_map: {
    id: 1,
    addrs: {},
    names: {}
  },
  lookup_name(name) {
    // If the name is already a valid ipv4 / ipv6 address, don't generate a fake one.
    var res = inetPton4(name);
    if (res !== null) {
      return name;
    }
    res = inetPton6(name);
    if (res !== null) {
      return name;
    }
    // See if this name is already mapped.
    var addr;
    if (DNS.address_map.addrs[name]) {
      addr = DNS.address_map.addrs[name];
    } else {
      var id = DNS.address_map.id++;
      addr = "172.29." + (id & 255) + "." + (id & 65280);
      DNS.address_map.names[addr] = name;
      DNS.address_map.addrs[name] = addr;
    }
    return addr;
  },
  lookup_addr(addr) {
    if (DNS.address_map.names[addr]) {
      return DNS.address_map.names[addr];
    }
    return null;
  }
};

/** @type {!Int16Array} */ var HEAP16;

/** @param {number=} addrlen */ var writeSockaddr = (sa, family, addr, port, addrlen) => {
  switch (family) {
   case 2:
    // The address may still be an unresolved hostname (e.g. a peer name
    // recorded at connect time); map it to its (possibly fake) IP here so
    // callers can pass names and IPs alike.
    addr = inetPton4(DNS.lookup_name(addr));
    zeroMemory(sa, 16);
    if (addrlen) {
      (growMemViews(), HEAP32)[((addrlen) >> 2)] = 16;
    }
    (growMemViews(), HEAP16)[((sa) >> 1)] = family;
    (growMemViews(), HEAP32)[(((sa) + (4)) >> 2)] = addr;
    (growMemViews(), HEAP16)[(((sa) + (2)) >> 1)] = _htons(port);
    break;

   case 10:
    addr = inetPton6(DNS.lookup_name(addr));
    zeroMemory(sa, 28);
    if (addrlen) {
      (growMemViews(), HEAP32)[((addrlen) >> 2)] = 28;
    }
    (growMemViews(), HEAP32)[((sa) >> 2)] = family;
    (growMemViews(), HEAP32)[(((sa) + (8)) >> 2)] = addr[0];
    (growMemViews(), HEAP32)[(((sa) + (12)) >> 2)] = addr[1];
    (growMemViews(), HEAP32)[(((sa) + (16)) >> 2)] = addr[2];
    (growMemViews(), HEAP32)[(((sa) + (20)) >> 2)] = addr[3];
    (growMemViews(), HEAP16)[(((sa) + (2)) >> 1)] = _htons(port);
    break;

   default:
    return 5;
  }
  return 0;
};

function ___syscall_accept4(fd, addr, len, flags, u1, u2) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(3, 0, 1, fd, addr, len, flags, u1, u2);
  try {
    var sock = getSocketFromFD(fd);
    var newsock = sock.sock_ops.accept(sock);
    if (addr) {
      var errno = writeSockaddr(addr, newsock.family, newsock.daddr, newsock.dport, len);
    }
    return newsock.stream.fd;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var inetNtop4 = addr => (addr & 255) + "." + ((addr >> 8) & 255) + "." + ((addr >> 16) & 255) + "." + ((addr >> 24) & 255);

var inetNtop6 = ints => {
  //  ref:  http://www.ietf.org/rfc/rfc2373.txt - section 2.5.4
  //  Format for IPv4 compatible and mapped  128-bit IPv6 Addresses
  //  128-bits are split into eight 16-bit words
  //  stored in network byte order (big-endian)
  //  |                80 bits               | 16 |      32 bits        |
  //  +-----------------------------------------------------------------+
  //  |               10 bytes               |  2 |      4 bytes        |
  //  +--------------------------------------+--------------------------+
  //  +               5 words                |  1 |      2 words        |
  //  +--------------------------------------+--------------------------+
  //  |0000..............................0000|0000|    IPv4 ADDRESS     | (compatible)
  //  +--------------------------------------+----+---------------------+
  //  |0000..............................0000|FFFF|    IPv4 ADDRESS     | (mapped)
  //  +--------------------------------------+----+---------------------+
  var str = "";
  var word = 0;
  var longest = 0;
  var lastzero = 0;
  var zstart = 0;
  var len = 0;
  var i = 0;
  var parts = [ ints[0] & 65535, (ints[0] >> 16), ints[1] & 65535, (ints[1] >> 16), ints[2] & 65535, (ints[2] >> 16), ints[3] & 65535, (ints[3] >> 16) ];
  // Handle IPv4-compatible, IPv4-mapped, loopback and any/unspecified addresses
  var hasipv4 = true;
  var v4part = "";
  // check if the 10 high-order bytes are all zeros (first 5 words)
  for (i = 0; i < 5; i++) {
    if (parts[i]) {
      hasipv4 = false;
      break;
    }
  }
  if (hasipv4) {
    // low-order 32-bits store an IPv4 address (bytes 13 to 16) (last 2 words)
    v4part = inetNtop4(parts[6] | (parts[7] << 16));
    // IPv4-mapped IPv6 address if 16-bit value (bytes 11 and 12) == 0xFFFF (6th word)
    if (parts[5] === -1) {
      str = "::ffff:";
      str += v4part;
      return str;
    }
    // IPv4-compatible IPv6 address if 16-bit value (bytes 11 and 12) == 0x0000 (6th word)
    if (!parts[5]) {
      str = "::";
      // special case IPv6 addresses
      if (v4part === "0.0.0.0") v4part = "";
      // any/unspecified address
      if (v4part === "0.0.0.1") v4part = "1";
      // loopback address
      str += v4part;
      return str;
    }
  }
  // Handle all other IPv6 addresses
  // first run to find the longest contiguous zero words
  for (word = 0; word < 8; word++) {
    if (!parts[word]) {
      if (word - lastzero > 1) {
        len = 0;
      }
      lastzero = word;
      len++;
    }
    if (len > longest) {
      longest = len;
      zstart = word - longest + 1;
    }
  }
  for (word = 0; word < 8; word++) {
    if (longest > 1) {
      // compress contiguous zeros - to produce '::'
      if (!parts[word] && word >= zstart && word < (zstart + longest)) {
        if (word === zstart) {
          str += ":";
          if (!zstart) str += ":";
        }
        continue;
      }
    }
    // converts 16-bit words from big-endian to little-endian before converting to hex string
    str += Number(_ntohs(parts[word] & 65535)).toString(16);
    str += word < 7 ? ":" : "";
  }
  return str;
};

/** @type {!Uint16Array} */ var HEAPU16;

var readSockaddr = (sa, salen) => {
  // family / port offsets are common to both sockaddr_in and sockaddr_in6
  var family = (growMemViews(), HEAP16)[((sa) >> 1)];
  var port = _ntohs((growMemViews(), HEAPU16)[(((sa) + (2)) >> 1)]);
  var addr;
  switch (family) {
   case 2:
    if (salen !== 16) {
      return {
        errno: 28
      };
    }
    addr = (growMemViews(), HEAP32)[(((sa) + (4)) >> 2)];
    addr = inetNtop4(addr);
    break;

   case 10:
    if (salen !== 28) {
      return {
        errno: 28
      };
    }
    addr = [ (growMemViews(), HEAP32)[(((sa) + (8)) >> 2)], (growMemViews(), HEAP32)[(((sa) + (12)) >> 2)], (growMemViews(), 
    HEAP32)[(((sa) + (16)) >> 2)], (growMemViews(), HEAP32)[(((sa) + (20)) >> 2)] ];
    addr = inetNtop6(addr);
    break;

   default:
    return {
      errno: 5
    };
  }
  return {
    family,
    addr,
    port
  };
};

var getSocketAddress = (addrp, addrlen) => {
  var info = readSockaddr(addrp, addrlen);
  if (info.errno) throw new FS.ErrnoError(info.errno);
  info.addr = DNS.lookup_addr(info.addr) || info.addr;
  return info;
};

function ___syscall_connect(fd, addr, len, u1, u2, u3) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(4, 0, 1, fd, addr, len, u1, u2, u3);
  try {
    var sock = getSocketFromFD(fd);
    var info = getSocketAddress(addr, len);
    sock.sock_ops.connect(sock, info.addr, info.port);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

/**
   * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
   * emscripten HEAP, returns a copy of that string as a Javascript String object.
   *
   * @param {number} ptr
   * @param {number=} maxBytesToRead - An optional length that specifies the
   *   maximum number of bytes to read. You can omit this parameter to scan the
   *   string until the first 0 byte. If maxBytesToRead is passed, and the string
   *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
   *   string will cut short at that byte index.
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */ var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => ptr ? UTF8ArrayToString((growMemViews(), 
HEAPU8), ptr, maxBytesToRead, ignoreNul) : "";

var SYSCALLS = {
  currentUmask: 18,
  calculateAt(dirfd, path, allowEmpty) {
    if (PATH.isAbs(path)) {
      return path;
    }
    // relative path
    var dir;
    if (dirfd === -100) {
      dir = FS.cwd();
    } else {
      var dirstream = SYSCALLS.getStreamFromFD(dirfd);
      dir = dirstream.path;
    }
    if (path.length == 0) {
      if (!allowEmpty) {
        throw new FS.ErrnoError(44);
      }
      return dir;
    }
    return dir + "/" + path;
  },
  writeStat(buf, stat) {
    (growMemViews(), HEAPU32)[((buf) >> 2)] = stat.dev;
    (growMemViews(), HEAPU32)[(((buf) + (4)) >> 2)] = stat.mode;
    (growMemViews(), HEAPU32)[(((buf) + (8)) >> 2)] = stat.nlink;
    (growMemViews(), HEAPU32)[(((buf) + (12)) >> 2)] = stat.uid;
    (growMemViews(), HEAPU32)[(((buf) + (16)) >> 2)] = stat.gid;
    (growMemViews(), HEAPU32)[(((buf) + (20)) >> 2)] = stat.rdev;
    (growMemViews(), HEAP64)[(((buf) + (24)) >> 3)] = BigInt(stat.size);
    (growMemViews(), HEAP32)[(((buf) + (32)) >> 2)] = 4096;
    (growMemViews(), HEAP32)[(((buf) + (36)) >> 2)] = stat.blocks;
    var atime = stat.atime.getTime();
    var mtime = stat.mtime.getTime();
    var ctime = stat.ctime.getTime();
    (growMemViews(), HEAP64)[(((buf) + (40)) >> 3)] = BigInt(Math.floor(atime / 1e3));
    (growMemViews(), HEAPU32)[(((buf) + (48)) >> 2)] = (atime % 1e3) * 1e3 * 1e3;
    (growMemViews(), HEAP64)[(((buf) + (56)) >> 3)] = BigInt(Math.floor(mtime / 1e3));
    (growMemViews(), HEAPU32)[(((buf) + (64)) >> 2)] = (mtime % 1e3) * 1e3 * 1e3;
    (growMemViews(), HEAP64)[(((buf) + (72)) >> 3)] = BigInt(Math.floor(ctime / 1e3));
    (growMemViews(), HEAPU32)[(((buf) + (80)) >> 2)] = (ctime % 1e3) * 1e3 * 1e3;
    (growMemViews(), HEAP64)[(((buf) + (88)) >> 3)] = BigInt(stat.ino);
    return 0;
  },
  writeStatFs(buf, stats) {
    (growMemViews(), HEAPU32)[(((buf) + (4)) >> 2)] = stats.bsize;
    (growMemViews(), HEAPU32)[(((buf) + (60)) >> 2)] = stats.bsize;
    (growMemViews(), HEAP64)[(((buf) + (8)) >> 3)] = BigInt(stats.blocks);
    (growMemViews(), HEAP64)[(((buf) + (16)) >> 3)] = BigInt(stats.bfree);
    (growMemViews(), HEAP64)[(((buf) + (24)) >> 3)] = BigInt(stats.bavail);
    (growMemViews(), HEAP64)[(((buf) + (32)) >> 3)] = BigInt(stats.files);
    (growMemViews(), HEAP64)[(((buf) + (40)) >> 3)] = BigInt(stats.ffree);
    (growMemViews(), HEAPU32)[(((buf) + (48)) >> 2)] = stats.fsid;
    (growMemViews(), HEAPU32)[(((buf) + (64)) >> 2)] = stats.flags;
    // ST_NOSUID
    (growMemViews(), HEAPU32)[(((buf) + (56)) >> 2)] = stats.namelen;
  },
  doMsync(addr, stream, len, flags, offset) {
    if (!FS.isFile(stream.node.mode)) {
      throw new FS.ErrnoError(43);
    }
    if (flags & 2) {
      // MAP_PRIVATE calls need not to be synced back to underlying fs
      return 0;
    }
    var buffer = (growMemViews(), HEAPU8).subarray(addr, addr + len);
    FS.msync(stream, buffer, offset, len, flags);
  },
  getStreamFromFD(fd) {
    var stream = FS.getStreamChecked(fd);
    return stream;
  },
  varargs: undefined,
  getStr(ptr) {
    var ret = UTF8ToString(ptr);
    return ret;
  }
};

function ___syscall_faccessat(dirfd, path, amode, flags) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(5, 0, 1, dirfd, path, amode, flags);
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    if (amode & ~7) {
      // need a valid mode
      return -28;
    }
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    if (!node) {
      return -44;
    }
    var perms = "";
    if (amode & 4) perms += "r";
    if (amode & 2) perms += "w";
    if (amode & 1) perms += "x";
    if (perms && FS.nodePermissions(node, perms)) {
      return -2;
    }
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var syscallGetVarargI = () => {
  // the `+` prepended here is necessary to convince the JSCompiler that varargs is indeed a number.
  var ret = (growMemViews(), HEAP32)[((+SYSCALLS.varargs) >> 2)];
  SYSCALLS.varargs += 4;
  return ret;
};

var syscallGetVarargP = syscallGetVarargI;

function ___syscall_fcntl64(fd, cmd, varargs) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(6, 0, 1, fd, cmd, varargs);
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (cmd) {
     case 0:
      {
        var arg = syscallGetVarargI();
        if (arg < 0) {
          return -28;
        }
        while (FS.streams[arg]) {
          arg++;
        }
        var newStream;
        newStream = FS.dupStream(stream, arg);
        return newStream.fd;
      }

     case 1:
     case 2:
      return 0;

     // FD_CLOEXEC makes no sense for a single process.
      case 3:
      return stream.flags;

     case 4:
      {
        var arg = syscallGetVarargI();
        var mask = 289792;
        stream.flags = (stream.flags & ~mask) | (arg & mask);
        return 0;
      }

     case 12:
      {
        var arg = syscallGetVarargP();
        var offset = 0;
        // We're always unlocked.
        (growMemViews(), HEAP16)[(((arg) + (offset)) >> 1)] = 2;
        return 0;
      }

     case 13:
     case 14:
      // Pretend that the locking is successful. These are process-level locks,
      // and Emscripten programs are a single process. If we supported linking a
      // filesystem between programs, we'd need to do more here.
      // See https://github.com/emscripten-core/emscripten/issues/23697
      return 0;
    }
    return -28;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_fstat64(fd, buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(7, 0, 1, fd, buf);
  try {
    return SYSCALLS.writeStat(buf, FS.fstat(fd));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, (growMemViews(), 
HEAPU8), outPtr, maxBytesToWrite);

function ___syscall_getdents64(fd, dirp, count) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(8, 0, 1, fd, dirp, count);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    stream.getdents ||= FS.readdir(stream.path);
    var struct_size = 280;
    var pos = 0;
    var off = FS.llseek(stream, 0, 1);
    var startIdx = Math.floor(off / struct_size);
    var endIdx = Math.min(stream.getdents.length, startIdx + Math.floor(count / struct_size));
    for (var idx = startIdx; idx < endIdx; idx++) {
      var id;
      var type;
      var name = stream.getdents[idx];
      if (name === ".") {
        id = stream.node.id;
        type = 4;
      } else if (name === "..") {
        var lookup = FS.lookupPath(stream.path, {
          parent: true
        });
        id = lookup.node.id;
        type = 4;
      } else {
        var child;
        try {
          child = FS.lookupNode(stream.node, name);
        } catch (e) {
          // If the entry is not a directory, file, or symlink, nodefs
          // lookupNode will raise EINVAL. Skip these and continue.
          if (e?.errno === 28) {
            continue;
          }
          throw e;
        }
        id = child.id;
        type = FS.isChrdev(child.mode) ? 2 : // character device.
        FS.isDir(child.mode) ? 4 : // directory
        FS.isLink(child.mode) ? 10 : // symbolic link.
        8;
      }
      (growMemViews(), HEAP64)[((dirp + pos) >> 3)] = BigInt(id);
      (growMemViews(), HEAP64)[(((dirp + pos) + (8)) >> 3)] = BigInt((idx + 1) * struct_size);
      (growMemViews(), HEAP16)[(((dirp + pos) + (16)) >> 1)] = 280;
      (growMemViews(), HEAP8)[(dirp + pos) + (18)] = type;
      stringToUTF8(name, dirp + pos + 19, 256);
      pos += struct_size;
    }
    FS.llseek(stream, idx * struct_size, 0);
    return pos;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_ioctl(fd, op, varargs) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(9, 0, 1, fd, op, varargs);
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (op) {
     case 21509:
      {
        if (!stream.tty) return -59;
        return 0;
      }

     case 21505:
      {
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tcgets) {
          var termios = stream.tty.ops.ioctl_tcgets(stream);
          var argp = syscallGetVarargP();
          (growMemViews(), HEAP32)[((argp) >> 2)] = termios.c_iflag || 0;
          (growMemViews(), HEAP32)[(((argp) + (4)) >> 2)] = termios.c_oflag || 0;
          (growMemViews(), HEAP32)[(((argp) + (8)) >> 2)] = termios.c_cflag || 0;
          (growMemViews(), HEAP32)[(((argp) + (12)) >> 2)] = termios.c_lflag || 0;
          for (var i = 0; i < 32; i++) {
            (growMemViews(), HEAP8)[(argp + i) + (17)] = termios.c_cc[i] || 0;
          }
          return 0;
        }
        return 0;
      }

     case 21510:
     case 21511:
     case 21512:
      {
        if (!stream.tty) return -59;
        return 0;
      }

     case 21506:
     case 21507:
     case 21508:
      {
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tcsets) {
          var argp = syscallGetVarargP();
          var c_iflag = (growMemViews(), HEAP32)[((argp) >> 2)];
          var c_oflag = (growMemViews(), HEAP32)[(((argp) + (4)) >> 2)];
          var c_cflag = (growMemViews(), HEAP32)[(((argp) + (8)) >> 2)];
          var c_lflag = (growMemViews(), HEAP32)[(((argp) + (12)) >> 2)];
          var c_cc = [];
          for (var i = 0; i < 32; i++) {
            c_cc.push((growMemViews(), HEAP8)[(argp + i) + (17)]);
          }
          return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
            c_iflag,
            c_oflag,
            c_cflag,
            c_lflag,
            c_cc
          });
        }
        return 0;
      }

     case 21519:
      {
        if (!stream.tty) return -59;
        var argp = syscallGetVarargP();
        (growMemViews(), HEAP32)[((argp) >> 2)] = 0;
        return 0;
      }

     case 21520:
      {
        if (!stream.tty) return -59;
        return -28;
      }

     case 21537:
     case 21531:
      {
        var argp = syscallGetVarargP();
        return FS.ioctl(stream, op, argp);
      }

     case 21523:
      {
        // TODO: in theory we should write to the winsize struct that gets
        // passed in, but for now musl doesn't read anything on it
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tiocgwinsz) {
          var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
          var argp = syscallGetVarargP();
          (growMemViews(), HEAP16)[((argp) >> 1)] = winsize[0];
          (growMemViews(), HEAP16)[(((argp) + (2)) >> 1)] = winsize[1];
        }
        return 0;
      }

     case 21524:
      {
        // TODO: technically, this ioctl call should change the window size.
        // but, since emscripten doesn't have any concept of a terminal window
        // yet, we'll just silently throw it away as we do TIOCGWINSZ
        if (!stream.tty) return -59;
        return 0;
      }

     case 21515:
      {
        if (!stream.tty) return -59;
        return 0;
      }

     default:
      return -28;
    }
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_lstat64(path, buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(10, 0, 1, path, buf);
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.writeStat(buf, FS.lstat(path));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_mkdirat(dirfd, path, mode) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(11, 0, 1, dirfd, path, mode);
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    mode &= ~SYSCALLS.currentUmask;
    FS.mkdir(path, mode, 0);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_newfstatat(dirfd, path, buf, flags) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(12, 0, 1, dirfd, path, buf, flags);
  try {
    path = SYSCALLS.getStr(path);
    var nofollow = flags & 256;
    var allowEmpty = flags & 4096;
    flags = flags & (~6400);
    path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
    return SYSCALLS.writeStat(buf, nofollow ? FS.lstat(path) : FS.stat(path));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_openat(dirfd, path, flags, varargs) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(13, 0, 1, dirfd, path, flags, varargs);
  SYSCALLS.varargs = varargs;
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    var mode = varargs ? syscallGetVarargI() : 0;
    if (flags & 64) {
      mode &= ~SYSCALLS.currentUmask;
    }
    return FS.open(path, flags, mode).fd;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_recvfrom(fd, buf, len, flags, addr, alen) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(14, 0, 1, fd, buf, len, flags, addr, alen);
  try {
    var sock = getSocketFromFD(fd);
    var msg = sock.sock_ops.recvmsg(sock, len, flags);
    if (!msg) return 0;
    // socket is closed
    if (addr) {
      var errno = writeSockaddr(addr, sock.family, msg.addr, msg.port, alen);
    }
    (growMemViews(), HEAPU8).set(msg.buffer, buf);
    return msg.buffer.byteLength;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(15, 0, 1, olddirfd, oldpath, newdirfd, newpath);
  try {
    oldpath = SYSCALLS.getStr(oldpath);
    newpath = SYSCALLS.getStr(newpath);
    oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
    newpath = SYSCALLS.calculateAt(newdirfd, newpath);
    FS.rename(oldpath, newpath);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_rmdir(path) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(16, 0, 1, path);
  try {
    path = SYSCALLS.getStr(path);
    FS.rmdir(path);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_sendto(fd, buf, len, flags, addr, alen) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(17, 0, 1, fd, buf, len, flags, addr, alen);
  try {
    var sock = getSocketFromFD(fd);
    if (!addr) {
      // send, no address provided
      return FS.write(sock.stream, (growMemViews(), HEAP8), buf, len);
    }
    var dest = getSocketAddress(addr, alen);
    // sendto an address
    return sock.sock_ops.sendmsg(sock, (growMemViews(), HEAP8), buf, len, dest.addr, dest.port);
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_socket(domain, type, protocol, u1, u2, u3) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(18, 0, 1, domain, type, protocol, u1, u2, u3);
  try {
    var sock = SOCKFS.createSocket(domain, type, protocol);
    return sock.stream.fd;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_stat64(path, buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(19, 0, 1, path, buf);
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.writeStat(buf, FS.stat(path));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_unlinkat(dirfd, path, flags) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(20, 0, 1, dirfd, path, flags);
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    if (!flags) {
      FS.unlink(path);
    } else if (flags === 512) {
      FS.rmdir(path);
    } else {
      return -28;
    }
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var __abort_js = () => abort("");

var __emscripten_init_main_thread_js = tb => {
  var can_block = !ENVIRONMENT_IS_WEB;
  // Feature detect whether the main thread can block.
  try {
    Atomics.wait((growMemViews(), HEAP32), 0, 0, 0);
    can_block = true;
  } catch (e) {}
  // Pass the thread address to the native code where they are stored in wasm
  // globals which act as a form of TLS. Global constructors trying
  // to access this value will read the wrong value, but that is UB anyway.
  __emscripten_thread_init(tb, /*is_main=*/ !ENVIRONMENT_IS_WORKER, /*is_runtime=*/ 1, can_block, /*default_stacksize=*/ 65536, /*start_profiling=*/ false);
  PThread.threadInitTLS();
};

var handleException = e => {
  // Certain exception types we do not treat as errors since they are used for
  // internal control flow.
  // 1. ExitStatus, which is thrown by exit()
  // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
  //    that wish to return to JS event loop.
  if (e instanceof ExitStatus || e == "unwind") {
    return EXITSTATUS;
  }
  quit_(1, e);
};

var maybeExit = () => {
  if (!keepRuntimeAlive()) {
    try {
      if (ENVIRONMENT_IS_PTHREAD) {
        // exit the current thread, but only if there is one active.
        // TODO(https://github.com/emscripten-core/emscripten/issues/25076):
        // Unify this check with the runtimeExited check above
        if (_pthread_self()) __emscripten_thread_exit(EXITSTATUS);
        return;
      }
      _exit(EXITSTATUS);
    } catch (e) {
      handleException(e);
    }
  }
};

var callUserCallback = func => {
  if (ABORT) {
    return;
  }
  try {
    return func();
  } catch (e) {
    handleException(e);
  } finally {
    maybeExit();
  }
};

var __emscripten_thread_mailbox_await = pthread_ptr => {
  if (!waitAsyncPolyfilled) {
    // Wait on the pthread's initial self-pointer field because it is easy and
    // safe to access from sending threads that need to notify the waiting
    // thread.
    // Note: Under wasm64 only the low 32-bit of the pthread_ptr are
    // read/compared here, but we don't actually care about the exact values
    // here as long as they match.
    var wait = Atomics.waitAsync((growMemViews(), HEAP32), ((pthread_ptr) >> 2), pthread_ptr);
    wait.value.then(checkMailbox);
    var waitingAsync = pthread_ptr + 112;
    Atomics.store((growMemViews(), HEAP32), ((waitingAsync) >> 2), 1);
  }
};

var checkMailbox = () => {
  // checkMailbox can be called after the pthread has shut down. See
  // Pthread.terminateRuntime().
  // In this case we return silently without re-registering using waitAsync.
  // Perhaps there is a more universal way we can detect runtime has exited.
  // TODO(https://github.com/emscripten-core/emscripten/issues/25076)
  var pthread_ptr = _pthread_self();
  if (!pthread_ptr) return;
  callUserCallback(() => {
    // If we are using Atomics.waitAsync as our notification mechanism, wait
    // for a notification before processing the mailbox to avoid missing any
    // work that could otherwise arrive after we've finished processing the
    // mailbox and before we're ready for the next notification.
    __emscripten_thread_mailbox_await(pthread_ptr);
    __emscripten_check_mailbox();
  });
};

var __emscripten_notify_mailbox_postmessage = (targetThread, currThreadId) => {
  if (targetThread == currThreadId) {
    setTimeout(checkMailbox);
  } else if (ENVIRONMENT_IS_PTHREAD) {
    postMessage({
      targetThread,
      cmd: 4
    });
  } else {
    var worker = PThread.pthreads[targetThread];
    if (!worker) {
      return;
    }
    worker.postMessage({
      cmd: 4
    });
  }
};

var proxiedJSCallArgs = [];

var __emscripten_receive_on_main_thread_js = (funcIndex, emAsmAddr, callingThread, bufSize, args, ctx, ctxArgs) => {
  // Sometimes we need to backproxy events to the calling thread (e.g.
  // HTML5 DOM events handlers such as
  // emscripten_set_mousemove_callback()), so keep track in a globally
  // accessible variable about the thread that initiated the proxying.
  proxiedJSCallArgs.length = 0;
  var b = ((args) >> 3);
  var end = ((args + bufSize) >> 3);
  while (b < end) {
    var arg;
    if ((growMemViews(), HEAP64)[b++]) {
      // It's a BigInt.
      arg = (growMemViews(), HEAP64)[b++];
    } else {
      // It's a Number.
      arg = (growMemViews(), HEAPF64)[b++];
    }
    proxiedJSCallArgs.push(arg);
  }
  // Proxied JS library funcs use funcIndex and EM_ASM functions use emAsmAddr
  var func = emAsmAddr ? ASM_CONSTS[emAsmAddr] : proxiedFunctionTable[funcIndex];
  PThread.currentProxiedOperationCallerThread = callingThread;
  var rtn = func(...proxiedJSCallArgs);
  PThread.currentProxiedOperationCallerThread = 0;
  if (ctx) {
    rtn.then(rtn => __emscripten_run_js_on_main_thread_done(ctx, ctxArgs, rtn));
    return;
  }
  return rtn;
};

var __emscripten_thread_cleanup = thread => {
  // Called when a thread needs to be cleaned up so it can be reused.
  // A thread is considered reusable when it either returns from its
  // entry point, calls pthread_exit, or acts upon a cancellation.
  // Detached threads are responsible for calling this themselves,
  // otherwise pthread_join is responsible for calling this.
  if (!ENVIRONMENT_IS_PTHREAD) cleanupThread(thread); else postMessage({
    cmd: 6,
    thread
  });
};

var __emscripten_thread_set_strongref = thread => {
  // Called when a thread needs to be strongly referenced.
  // Currently only used for:
  // - keeping the "main" thread alive in PROXY_TO_PTHREAD mode;
  // - crashed threads that need to propagate the uncaught exception
  //   back to the main thread.
  if (ENVIRONMENT_IS_NODE) {
    var worker = PThread.pthreads[thread];
    worker.ref();
    // Also, record that we called strongref, in case this function is called
    // bafore the 'loaded' callback from the thread (where we would normally
    // `unref` it.
    worker.strongref = 1;
  }
};

var __emscripten_throw_longjmp = () => {
  throw new EmscriptenSjLj;
};

var isLeapYear = year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

var MONTH_DAYS_LEAP_CUMULATIVE = [ 0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335 ];

var MONTH_DAYS_REGULAR_CUMULATIVE = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];

var ydayFromDate = date => {
  var leap = isLeapYear(date.getFullYear());
  var monthDaysCumulative = (leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE);
  var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
  // -1 since it's days since Jan 1
  return yday;
};

var INT53_MAX = 9007199254740992;

var INT53_MIN = -9007199254740992;

var bigintToI53Checked = num => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);

function __localtime_js(time, tmPtr) {
  time = bigintToI53Checked(time);
  var date = new Date(time * 1e3);
  if (isNaN(date.getTime())) {
    return 1;
  }
  (growMemViews(), HEAP32)[((tmPtr) >> 2)] = date.getSeconds();
  (growMemViews(), HEAP32)[(((tmPtr) + (4)) >> 2)] = date.getMinutes();
  (growMemViews(), HEAP32)[(((tmPtr) + (8)) >> 2)] = date.getHours();
  (growMemViews(), HEAP32)[(((tmPtr) + (12)) >> 2)] = date.getDate();
  (growMemViews(), HEAP32)[(((tmPtr) + (16)) >> 2)] = date.getMonth();
  (growMemViews(), HEAP32)[(((tmPtr) + (20)) >> 2)] = date.getFullYear() - 1900;
  (growMemViews(), HEAP32)[(((tmPtr) + (24)) >> 2)] = date.getDay();
  var yday = ydayFromDate(date) | 0;
  (growMemViews(), HEAP32)[(((tmPtr) + (28)) >> 2)] = yday;
  (growMemViews(), HEAP32)[(((tmPtr) + (36)) >> 2)] = -(date.getTimezoneOffset() * 60);
  // Attention: DST is in December in South, and some regions don't have DST at all.
  var start = new Date(date.getFullYear(), 0, 1);
  var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  var winterOffset = start.getTimezoneOffset();
  var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
  (growMemViews(), HEAP32)[(((tmPtr) + (32)) >> 2)] = dst;
  return 0;
}

var __tzset_js = (timezone, daylight, std_name, dst_name) => {
  // TODO: Use (malleable) environment variables instead of system settings.
  var currentYear = (new Date).getFullYear();
  var winter = new Date(currentYear, 0, 1);
  var summer = new Date(currentYear, 6, 1);
  var winterOffset = winter.getTimezoneOffset();
  var summerOffset = summer.getTimezoneOffset();
  // Local standard timezone offset. Local standard time is not adjusted for
  // daylight savings.  This code uses the fact that getTimezoneOffset returns
  // a greater value during Standard Time versus Daylight Saving Time (DST).
  // Thus it determines the expected output during Standard Time, and it
  // compares whether the output of the given date the same (Standard) or less
  // (DST).
  var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
  // timezone is specified as seconds west of UTC ("The external variable
  // `timezone` shall be set to the difference, in seconds, between
  // Coordinated Universal Time (UTC) and local standard time."), the same
  // as returned by stdTimezoneOffset.
  // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
  (growMemViews(), HEAPU32)[((timezone) >> 2)] = stdTimezoneOffset * 60;
  (growMemViews(), HEAP32)[((daylight) >> 2)] = Number(winterOffset != summerOffset);
  var extractZone = timezoneOffset => {
    // Why inverse sign?
    // Read here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
    var sign = timezoneOffset >= 0 ? "-" : "+";
    var absOffset = Math.abs(timezoneOffset);
    var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
    var minutes = String(absOffset % 60).padStart(2, "0");
    return `UTC${sign}${hours}${minutes}`;
  };
  var winterName = extractZone(winterOffset);
  var summerName = extractZone(summerOffset);
  if (summerOffset < winterOffset) {
    // Northern hemisphere
    stringToUTF8(winterName, std_name, 17);
    stringToUTF8(summerName, dst_name, 17);
  } else {
    stringToUTF8(winterName, dst_name, 17);
    stringToUTF8(summerName, std_name, 17);
  }
};

var _emscripten_get_now = () => performance.timeOrigin + performance.now();

var _emscripten_date_now = () => Date.now();

var nowIsMonotonic = 1;

var checkWasiClock = clock_id => clock_id >= 0 && clock_id <= 3;

function _clock_time_get(clk_id, ignored_precision, ptime) {
  ignored_precision = bigintToI53Checked(ignored_precision);
  if (!checkWasiClock(clk_id)) {
    return 28;
  }
  var now;
  // all wasi clocks but realtime are monotonic
  if (clk_id === 0) {
    now = _emscripten_date_now();
  } else if (nowIsMonotonic) {
    now = _emscripten_get_now();
  } else {
    return 52;
  }
  // "now" is in ms, and wasi times are in ns.
  var nsec = Math.round(now * 1e3 * 1e3);
  (growMemViews(), HEAP64)[((ptime) >> 3)] = BigInt(nsec);
  return 0;
}

var readEmAsmArgsArray = [];

var readEmAsmArgs = (sigPtr, buf) => {
  readEmAsmArgsArray.length = 0;
  var ch;
  // Most arguments are i32s, so shift the buffer pointer so it is a plain
  // index into HEAP32.
  while (ch = (growMemViews(), HEAPU8)[sigPtr++]) {
    // Floats are always passed as doubles, so all types except for 'i'
    // are 8 bytes and require alignment.
    var wide = (ch != 105);
    wide &= (ch != 112);
    buf += wide && (buf % 8) ? 4 : 0;
    readEmAsmArgsArray.push(// Special case for pointers under wasm64 or CAN_ADDRESS_2GB mode.
    ch == 112 ? (growMemViews(), HEAPU32)[((buf) >> 2)] : ch == 106 ? (growMemViews(), 
    HEAP64)[((buf) >> 3)] : ch == 105 ? (growMemViews(), HEAP32)[((buf) >> 2)] : (growMemViews(), 
    HEAPF64)[((buf) >> 3)]);
    buf += wide ? 8 : 4;
  }
  return readEmAsmArgsArray;
};

var runEmAsmFunction = (code, sigPtr, argbuf) => {
  var args = readEmAsmArgs(sigPtr, argbuf);
  return ASM_CONSTS[code](...args);
};

var _emscripten_asm_const_int = (code, sigPtr, argbuf) => runEmAsmFunction(code, sigPtr, argbuf);

var _emscripten_check_blocking_allowed = () => {};

var runtimeKeepalivePush = () => {
  runtimeKeepaliveCounter += 1;
};

var _emscripten_exit_with_live_runtime = () => {
  runtimeKeepalivePush();
  throw "unwind";
};

var maybeCStringToJsString = cString => cString > 2 ? UTF8ToString(cString) : cString;

/** @type {Object} */ var specialHTMLTargets = [ 0, globalThis.document ?? 0, globalThis.window ?? 0 ];

var findEventTarget = target => {
  target = maybeCStringToJsString(target);
  var domElement = specialHTMLTargets[target] || globalThis.document?.querySelector(target);
  return domElement;
};

var findCanvasEventTarget = findEventTarget;

var getCanvasSizeCallingThread = (target, width, height) => {
  var canvas = findCanvasEventTarget(target);
  if (!canvas) return -4;
  if (!canvas.controlTransferredOffscreen) {
    (growMemViews(), HEAP32)[((width) >> 2)] = canvas.width;
    (growMemViews(), HEAP32)[((height) >> 2)] = canvas.height;
  } else {
    return -4;
  }
  return 0;
};

function getCanvasSizeMainThread(target, width, height) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(21, 0, 1, target, width, height);
  return getCanvasSizeCallingThread(target, width, height);
}

var _emscripten_get_canvas_element_size = (target, width, height) => {
  var canvas = findCanvasEventTarget(target);
  if (canvas) {
    return getCanvasSizeCallingThread(target, width, height);
  }
  return getCanvasSizeMainThread(target, width, height);
};

var getHeapMax = () => // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
// full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
// for any code that deals with heap sizes, which would require special
// casing all heap size related code to treat 0 specially.
2147483648;

var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;

var growMemory = size => {
  var oldHeapSize = wasmMemory.buffer.byteLength;
  var pages = ((size - oldHeapSize + 65535) / 65536) | 0;
  try {
    // round size grow request up to wasm page size (fixed 64KB per spec)
    wasmMemory.grow(pages);
    // .grow() takes a delta compared to the previous size
    updateMemoryViews();
    return 1;
  } catch (e) {}
};

var _emscripten_resize_heap = requestedSize => {
  var oldSize = (growMemViews(), HEAPU8).length;
  // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
  requestedSize >>>= 0;
  // With multithreaded builds, races can happen (another thread might increase the size
  // in between), so return a failure, and let the caller retry.
  if (requestedSize <= oldSize) {
    return false;
  }
  // Memory resize rules:
  // 1.  Always increase heap size to at least the requested size, rounded up
  //     to next page multiple.
  // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
  //     geometrically: increase the heap size according to
  //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
  //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
  // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
  //     linearly: increase the heap size by at least
  //     MEMORY_GROWTH_LINEAR_STEP bytes.
  // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
  //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
  // 4.  If we were unable to allocate as much memory, it may be due to
  //     over-eager decision to excessively reserve due to (3) above.
  //     Hence if an allocation fails, cut down on the amount of excess
  //     growth, in an attempt to succeed to perform a smaller allocation.
  // A limit is set for how much we can grow. We should not exceed that
  // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
  var maxHeapSize = getHeapMax();
  if (requestedSize > maxHeapSize) {
    return false;
  }
  // Loop through potential heap size increases. If we attempt a too eager
  // reservation that fails, cut down on the attempted size and reserve a
  // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
    // ensure geometric growth
    // but limit overreserving (default to capping at +96MB overgrowth at most)
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
    var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
    var replacement = growMemory(newSize);
    if (replacement) {
      return true;
    }
  }
  return false;
};

/** @type {!Float32Array} */ var HEAPF32;

/** not-@type {!BigUint64Array} */ var HEAPU64;

var _emscripten_run_script = ptr => {
  eval(UTF8ToString(ptr));
};

var _emscripten_set_main_loop_timing = (mode, value) => {
  MainLoop.timingMode = mode;
  MainLoop.timingValue = value;
  if (!MainLoop.func) {
    return 1;
  }
  if (!MainLoop.running) {
    runtimeKeepalivePush();
    MainLoop.running = true;
  }
  if (mode == 0) {
    MainLoop.scheduler = function MainLoop_scheduler_setTimeout() {
      var timeUntilNextTick = Math.max(0, MainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
      setTimeout(MainLoop.runner, timeUntilNextTick);
    };
  } else if (mode == 1) {
    MainLoop.scheduler = function MainLoop_scheduler_rAF() {
      MainLoop.requestAnimationFrame(MainLoop.runner);
    };
  } else {
    if (!MainLoop.setImmediate) {
      if (globalThis.scheduler) {
        // Some modern browsers implement scheduler.postTask, but not all.
        MainLoop.setImmediate = scheduler.postTask.bind(scheduler);
      } else if (globalThis.setImmediate) {
        MainLoop.setImmediate = setImmediate;
      } else {
        // Emulate setImmediate. (note: not a complete polyfill, we don't emulate clearImmediate() to keep code size to minimum, since not needed)
        var setImmediates = [];
        var emscriptenMainLoopMessageId = "setimmediate";
        /** @param {Event} event */ var MainLoop_setImmediate_messageHandler = event => {
          if (event.data === emscriptenMainLoopMessageId) {
            event.stopPropagation();
            setImmediates.shift()();
          }
        };
        addEventListener("message", MainLoop_setImmediate_messageHandler, true);
        MainLoop.setImmediate = /** @type{function(function(): ?, ...?): number} */ (func => {
          setImmediates.push(func);
          if (ENVIRONMENT_IS_WORKER) {
            // The postMessge API in a Worker, sends message to the main
            // thread and does not support the `targetOrigin` (*) argument.
            postMessage(emscriptenMainLoopMessageId);
          } else {
            postMessage(emscriptenMainLoopMessageId, "*");
          }
        });
      }
    }
    MainLoop.scheduler = function MainLoop_scheduler_setImmediate() {
      MainLoop.setImmediate(MainLoop.runner);
    };
  }
  return 0;
};

var MainLoop = {
  running: false,
  scheduler: null,
  currentlyRunningMainloop: 0,
  func: null,
  arg: 0,
  timingMode: 0,
  timingValue: 0,
  currentFrameNumber: 0,
  queue: [],
  preMainLoop: [],
  postMainLoop: [],
  pause() {
    MainLoop.scheduler = null;
    // Incrementing this signals the previous main loop that it's now become old, and it must return.
    MainLoop.currentlyRunningMainloop++;
  },
  resume() {
    MainLoop.currentlyRunningMainloop++;
    var timingMode = MainLoop.timingMode;
    var timingValue = MainLoop.timingValue;
    var func = MainLoop.func;
    MainLoop.func = null;
    // do not set timing and call scheduler, we will do it on the next lines
    setMainLoop(func, 0, false, MainLoop.arg, true);
    _emscripten_set_main_loop_timing(timingMode, timingValue);
    MainLoop.scheduler();
  },
  updateStatus() {
    if (Module["setStatus"]) {
      var message = Module["statusMessage"] || "Please wait...";
      var remaining = MainLoop.remainingBlockers ?? 0;
      var expected = MainLoop.expectedBlockers ?? 0;
      if (remaining) {
        if (remaining < expected) {
          Module["setStatus"](`{message} ({expected - remaining}/{expected})`);
        } else {
          Module["setStatus"](message);
        }
      } else {
        Module["setStatus"]("");
      }
    }
  },
  init() {},
  runIter(func) {
    if (ABORT) return;
    for (var pre of MainLoop.preMainLoop) {
      if (pre() === false) {
        return;
      }
    }
    callUserCallback(func);
    for (var post of MainLoop.postMainLoop) {
      post();
    }
  },
  nextRAF: 0,
  fakeRequestAnimationFrame(func) {
    // try to keep 60fps between calls to here
    var now = Date.now();
    if (!MainLoop.nextRAF) {
      MainLoop.nextRAF = now + 1e3 / 60;
    } else {
      while (now + 2 >= MainLoop.nextRAF) {
        // fudge a little, to avoid timer jitter causing us to do lots of delay:0
        MainLoop.nextRAF += 1e3 / 60;
      }
    }
    var delay = Math.max(MainLoop.nextRAF - now, 0);
    setTimeout(func, delay);
  },
  requestAnimationFrame(func) {
    if (globalThis.requestAnimationFrame) {
      requestAnimationFrame(func);
    } else {
      MainLoop.fakeRequestAnimationFrame(func);
    }
  }
};

var runtimeKeepalivePop = () => {
  runtimeKeepaliveCounter -= 1;
};

/**
   * @param {number=} arg
   * @param {boolean=} noSetTiming
   */ var setMainLoop = (iterFunc, fps, simulateInfiniteLoop, arg, noSetTiming) => {
  MainLoop.func = iterFunc;
  MainLoop.arg = arg;
  var thisMainLoopId = MainLoop.currentlyRunningMainloop;
  function checkIsRunning() {
    if (thisMainLoopId < MainLoop.currentlyRunningMainloop) {
      runtimeKeepalivePop();
      maybeExit();
      return false;
    }
    return true;
  }
  // We create the loop runner here but it is not actually running until
  // _emscripten_set_main_loop_timing is called (which might happen at a
  // later time).  This member signifies that the current runner has not
  // yet been started so that we can call runtimeKeepalivePush when it
  // gets its timing set for the first time.
  MainLoop.running = false;
  MainLoop.runner = function MainLoop_runner() {
    if (ABORT) return;
    if (MainLoop.queue.length > 0) {
      var start = Date.now();
      var blocker = MainLoop.queue.shift();
      blocker.func(blocker.arg);
      if (MainLoop.remainingBlockers) {
        var remaining = MainLoop.remainingBlockers;
        var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
        if (blocker.counted) {
          MainLoop.remainingBlockers = next;
        } else {
          // not counted, but move the progress along a tiny bit
          next = next + .5;
          // do not steal all the next one's progress
          MainLoop.remainingBlockers = (8 * remaining + next) / 9;
        }
      }
      MainLoop.updateStatus();
      // catches pause/resume main loop from blocker execution
      if (!checkIsRunning()) return;
      setTimeout(MainLoop.runner, 0);
      return;
    }
    // catch pauses from non-main loop sources
    if (!checkIsRunning()) return;
    // Implement very basic swap interval control
    MainLoop.currentFrameNumber = MainLoop.currentFrameNumber + 1 | 0;
    if (MainLoop.timingMode == 1 && MainLoop.timingValue > 1 && MainLoop.currentFrameNumber % MainLoop.timingValue != 0) {
      // Not the scheduled time to render this frame - skip.
      MainLoop.scheduler();
      return;
    } else if (MainLoop.timingMode == 0) {
      MainLoop.tickStartTime = _emscripten_get_now();
    }
    MainLoop.runIter(iterFunc);
    // catch pauses from the main loop itself
    if (!checkIsRunning()) return;
    MainLoop.scheduler();
  };
  if (!noSetTiming) {
    if (fps > 0) {
      _emscripten_set_main_loop_timing(0, 1e3 / fps);
    } else {
      // Do rAF by rendering each frame (no decimating)
      _emscripten_set_main_loop_timing(1, 1);
    }
    MainLoop.scheduler();
  }
  if (simulateInfiniteLoop) {
    throw "unwind";
  }
};

var _emscripten_set_main_loop = (func, fps, simulateInfiniteLoop) => {
  var iterFunc = getWasmTableEntry(func);
  setMainLoop(iterFunc, fps, simulateInfiniteLoop);
};

var ENV = {};

var getExecutableName = () => thisProgram;

var getEnvStrings = () => {
  if (!getEnvStrings.strings) {
    // Default values.
    var lang = (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8";
    var env = {
      "USER": "web_user",
      "LOGNAME": "web_user",
      "PATH": "/",
      "PWD": "/",
      "HOME": "/home/web_user",
      "LANG": lang,
      "_": getExecutableName()
    };
    // Apply the user-provided values, if any.
    for (var x in ENV) {
      // x is a key in ENV; if ENV[x] is undefined, that means it was
      // explicitly set to be so. We allow user code to do that to
      // force variables with default values to remain unset.
      if (ENV[x] === undefined) delete env[x]; else env[x] = ENV[x];
    }
    var strings = [];
    for (var x in env) {
      strings.push(`${x}=${env[x]}`);
    }
    getEnvStrings.strings = strings;
  }
  return getEnvStrings.strings;
};

function _environ_get(__environ, environ_buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(22, 0, 1, __environ, environ_buf);
  var bufSize = 0;
  var envp = 0;
  for (var string of getEnvStrings()) {
    var ptr = environ_buf + bufSize;
    (growMemViews(), HEAPU32)[(((__environ) + (envp)) >> 2)] = ptr;
    bufSize += stringToUTF8(string, ptr, Infinity) + 1;
    envp += 4;
  }
  return 0;
}

function _environ_sizes_get(penviron_count, penviron_buf_size) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(23, 0, 1, penviron_count, penviron_buf_size);
  var strings = getEnvStrings();
  (growMemViews(), HEAPU32)[((penviron_count) >> 2)] = strings.length;
  var bufSize = 0;
  for (var string of strings) {
    bufSize += lengthBytesUTF8(string) + 1;
  }
  (growMemViews(), HEAPU32)[((penviron_buf_size) >> 2)] = bufSize;
  return 0;
}

function _fd_close(fd) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(24, 0, 1, fd);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.close(stream);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

/** @param {number=} offset */ var doReadv = (stream, iov, iovcnt, offset) => {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = (growMemViews(), HEAPU32)[((iov) >> 2)];
    var len = (growMemViews(), HEAPU32)[(((iov) + (4)) >> 2)];
    iov += 8;
    try {
      var curr = FS.read(stream, (growMemViews(), HEAP8), ptr, len, offset);
    } catch (e) {
      // On a non-blocking stream a subsequent read may would-block after we
      // already gathered data. POSIX readv is a single gather-read: return
      // what we have rather than failing the whole call.
      if (ret > 0 && e instanceof FS.ErrnoError && (e.errno == 6 || e.errno == 6)) {
        break;
      }
      throw e;
    }
    if (curr < 0) return -1;
    ret += curr;
    if (curr < len) break;
    // nothing more to read
    if (typeof offset != "undefined") {
      offset += curr;
    }
  }
  return ret;
};

function _fd_read(fd, iov, iovcnt, pnum) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(25, 0, 1, fd, iov, iovcnt, pnum);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = doReadv(stream, iov, iovcnt);
    (growMemViews(), HEAPU32)[((pnum) >> 2)] = num;
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

function _fd_seek(fd, offset, whence, newOffset) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(26, 0, 1, fd, offset, whence, newOffset);
  offset = bigintToI53Checked(offset);
  try {
    if (isNaN(offset)) return 22;
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.llseek(stream, offset, whence);
    (growMemViews(), HEAP64)[((newOffset) >> 3)] = BigInt(stream.position);
    if (stream.getdents && !offset && whence === 0) stream.getdents = null;
    // reset readdir state
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

/** @param {number=} offset */ var doWritev = (stream, iov, iovcnt, offset) => {
  // Gather all iovecs into one contiguous buffer and issue a single
  // FS.write, matching POSIX writev's single gather-write semantics (as
  // __syscall_sendmsg already does). Per-iovec writes fragment a stream
  // socket send into multiple segments, breaking stream byte semantics.
  if (iovcnt == 1) {
    // Single iovec: write directly from HEAP8, no gather buffer needed.
    return FS.write(stream, (growMemViews(), HEAP8), (growMemViews(), HEAPU32)[((iov) >> 2)], (growMemViews(), 
    HEAPU32)[(((iov) + (4)) >> 2)], offset);
  }
  var total = 0;
  for (var i = 0, p = iov; i < iovcnt; i++, p += 8) {
    total += (growMemViews(), HEAPU32)[(((p) + (4)) >> 2)];
  }
  var view = new Uint8Array(total);
  var voff = 0;
  for (var i = 0; i < iovcnt; i++, iov += 8) {
    var ptr = (growMemViews(), HEAPU32)[((iov) >> 2)];
    var len = (growMemViews(), HEAPU32)[(((iov) + (4)) >> 2)];
    view.set((growMemViews(), HEAPU8).subarray(ptr, ptr + len), voff);
    voff += len;
  }
  return FS.write(stream, view, 0, total, offset);
};

function _fd_write(fd, iov, iovcnt, pnum) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(27, 0, 1, fd, iov, iovcnt, pnum);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = doWritev(stream, iov, iovcnt);
    (growMemViews(), HEAPU32)[((pnum) >> 2)] = num;
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

function _getaddrinfo(node, service, hint, out) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(28, 0, 1, node, service, hint, out);
  // Note getaddrinfo currently only returns a single addrinfo with ai_next defaulting to NULL. When NULL
  // hints are specified or ai_family set to AF_UNSPEC or ai_socktype or ai_protocol set to 0 then we
  // really should provide a linked list of suitable addrinfo values.
  var addrs = [];
  var canon = null;
  var addr = 0;
  var port = 0;
  var flags = 0;
  var family = 0;
  var type = 0;
  var proto = 0;
  var ai, last;
  function allocaddrinfo(family, type, proto, canon, addr, port) {
    var sa, salen, ai;
    var errno;
    salen = family === 10 ? 28 : 16;
    addr = family === 10 ? inetNtop6(addr) : inetNtop4(addr);
    sa = _malloc(salen);
    errno = writeSockaddr(sa, family, addr, port);
    ai = _malloc(32);
    (growMemViews(), HEAP32)[(((ai) + (4)) >> 2)] = family;
    (growMemViews(), HEAP32)[(((ai) + (8)) >> 2)] = type;
    (growMemViews(), HEAP32)[(((ai) + (12)) >> 2)] = proto;
    (growMemViews(), HEAPU32)[(((ai) + (24)) >> 2)] = canon;
    (growMemViews(), HEAPU32)[(((ai) + (20)) >> 2)] = sa;
    if (family === 10) {
      (growMemViews(), HEAP32)[(((ai) + (16)) >> 2)] = 28;
    } else {
      (growMemViews(), HEAP32)[(((ai) + (16)) >> 2)] = 16;
    }
    (growMemViews(), HEAP32)[(((ai) + (28)) >> 2)] = 0;
    return ai;
  }
  if (hint) {
    flags = (growMemViews(), HEAP32)[((hint) >> 2)];
    family = (growMemViews(), HEAP32)[(((hint) + (4)) >> 2)];
    type = (growMemViews(), HEAP32)[(((hint) + (8)) >> 2)];
    proto = (growMemViews(), HEAP32)[(((hint) + (12)) >> 2)];
  }
  if (type && !proto) {
    proto = type === 2 ? 17 : 6;
  }
  if (!type && proto) {
    type = proto === 17 ? 2 : 1;
  }
  // If type or proto are set to zero in hints we should really be returning multiple addrinfo values, but for
  // now default to a TCP STREAM socket so we can at least return a sensible addrinfo given NULL hints.
  if (!proto) {
    proto = 6;
  }
  if (!type) {
    type = 1;
  }
  if (!node && !service) {
    return -2;
  }
  if (flags & ~(1 | 2 | 4 | 1024 | 8 | 16 | 32)) {
    return -1;
  }
  if (hint && ((growMemViews(), HEAP32)[((hint) >> 2)] & 2) && !node) {
    return -1;
  }
  if (flags & 32) {
    // TODO
    return -2;
  }
  if (type && type !== 1 && type !== 2) {
    return -7;
  }
  if (family !== 0 && family !== 2 && family !== 10) {
    return -6;
  }
  if (service) {
    service = UTF8ToString(service);
    port = parseInt(service, 10);
    if (isNaN(port)) {
      if (flags & 1024) {
        return -2;
      }
      // TODO support resolving well-known service names from:
      // http://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.txt
      return -8;
    }
  }
  if (!node) {
    if (family === 0) {
      family = 2;
    }
    if (!(flags & 1)) {
      if (family === 2) {
        addr = _htonl(2130706433);
      } else {
        addr = [ 0, 0, 0, _htonl(1) ];
      }
    }
    ai = allocaddrinfo(family, type, proto, null, addr, port);
    (growMemViews(), HEAPU32)[((out) >> 2)] = ai;
    return 0;
  }
  // try as a numeric address
  node = UTF8ToString(node);
  addr = inetPton4(node);
  if (addr !== null) {
    // incoming node is a valid ipv4 address
    if (family === 0 || family === 2) {
      family = 2;
    } else if (family === 10 && (flags & 8)) {
      addr = [ 0, 0, _htonl(65535), addr ];
      family = 10;
    } else {
      return -2;
    }
  } else {
    addr = inetPton6(node);
    if (addr !== null) {
      // incoming node is a valid ipv6 address
      if (family === 0 || family === 10) {
        family = 10;
      } else {
        return -2;
      }
    }
  }
  if (addr != null) {
    ai = allocaddrinfo(family, type, proto, node, addr, port);
    (growMemViews(), HEAPU32)[((out) >> 2)] = ai;
    return 0;
  }
  if (flags & 4) {
    return -2;
  }
  // try as a hostname
  // resolve the hostname to a temporary fake address
  node = DNS.lookup_name(node);
  addr = inetPton4(node);
  if (family === 0) {
    family = 2;
  } else if (family === 10) {
    addr = [ 0, 0, _htonl(65535), addr ];
  }
  ai = allocaddrinfo(family, type, proto, null, addr, port);
  (growMemViews(), HEAPU32)[((out) >> 2)] = ai;
  return 0;
}

var _emscripten_glAlphaFunc = (func, ref) => {
  switch (func) {
   case 512:
   // GL_NEVER
    case 513:
   // GL_LESS
    case 514:
   // GL_EQUAL
    case 515:
   // GL_LEQUAL
    case 516:
   // GL_GREATER
    case 517:
   // GL_NOTEQUAL
    case 518:
   // GL_GEQUAL
    case 519:
    // GL_ALWAYS
    GLEmulation.alphaTestRef = ref;
    if (GLEmulation.alphaTestFunc != func) {
      GLEmulation.alphaTestFunc = func;
      GLImmediate.currentRenderer = null;
    }
    break;

   default:
    // invalid value provided
    break;
  }
};

var _glAlphaFunc = _emscripten_glAlphaFunc;

var GLctx;

var webgl_enable_ANGLE_instanced_arrays = ctx => {
  // Extension available in WebGL 1 from Firefox 26 and Google Chrome 30 onwards. Core feature in WebGL 2.
  var ext = ctx.getExtension("ANGLE_instanced_arrays");
  // Because this extension is a core function in WebGL 2, assign the extension entry points in place of
  // where the core functions will reside in WebGL 2. This way the calling code can call these without
  // having to dynamically branch depending if running against WebGL 1 or WebGL 2.
  if (ext) {
    ctx["vertexAttribDivisor"] = (index, divisor) => ext["vertexAttribDivisorANGLE"](index, divisor);
    ctx["drawArraysInstanced"] = (mode, first, count, primcount) => ext["drawArraysInstancedANGLE"](mode, first, count, primcount);
    ctx["drawElementsInstanced"] = (mode, count, type, indices, primcount) => ext["drawElementsInstancedANGLE"](mode, count, type, indices, primcount);
    return 1;
  }
};

var webgl_enable_OES_vertex_array_object = ctx => {
  // Extension available in WebGL 1 from Firefox 25 and WebKit 536.28/desktop Safari 6.0.3 onwards. Core feature in WebGL 2.
  var ext = ctx.getExtension("OES_vertex_array_object");
  if (ext) {
    ctx["createVertexArray"] = () => ext["createVertexArrayOES"]();
    ctx["deleteVertexArray"] = vao => ext["deleteVertexArrayOES"](vao);
    ctx["bindVertexArray"] = vao => ext["bindVertexArrayOES"](vao);
    ctx["isVertexArray"] = vao => ext["isVertexArrayOES"](vao);
    return 1;
  }
};

var webgl_enable_WEBGL_draw_buffers = ctx => {
  // Extension available in WebGL 1 from Firefox 28 onwards. Core feature in WebGL 2.
  var ext = ctx.getExtension("WEBGL_draw_buffers");
  if (ext) {
    ctx["drawBuffers"] = (n, bufs) => ext["drawBuffersWEBGL"](n, bufs);
    return 1;
  }
};

var webgl_enable_EXT_polygon_offset_clamp = ctx => !!(ctx.extPolygonOffsetClamp = ctx.getExtension("EXT_polygon_offset_clamp"));

var webgl_enable_EXT_clip_control = ctx => !!(ctx.extClipControl = ctx.getExtension("EXT_clip_control"));

var webgl_enable_WEBGL_polygon_mode = ctx => !!(ctx.webglPolygonMode = ctx.getExtension("WEBGL_polygon_mode"));

var webgl_enable_WEBGL_multi_draw = ctx => // Closure is expected to be allowed to minify the '.multiDrawWebgl' property, so not accessing it quoted.
!!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));

var getEmscriptenSupportedExtensions = ctx => {
  // Restrict the list of advertised extensions to those that we actually
  // support.
  var supportedExtensions = [ // WebGL 1 extensions
  "ANGLE_instanced_arrays", "EXT_blend_minmax", "EXT_disjoint_timer_query", "EXT_frag_depth", "EXT_shader_texture_lod", "EXT_sRGB", "OES_element_index_uint", "OES_fbo_render_mipmap", "OES_standard_derivatives", "OES_texture_float", "OES_texture_half_float", "OES_texture_half_float_linear", "OES_vertex_array_object", "WEBGL_color_buffer_float", "WEBGL_depth_texture", "WEBGL_draw_buffers", // WebGL 1 and WebGL 2 extensions
  "EXT_clip_control", "EXT_color_buffer_half_float", "EXT_depth_clamp", "EXT_float_blend", "EXT_polygon_offset_clamp", "EXT_texture_compression_bptc", "EXT_texture_compression_rgtc", "EXT_texture_filter_anisotropic", "KHR_parallel_shader_compile", "OES_texture_float_linear", "WEBGL_blend_func_extended", "WEBGL_compressed_texture_astc", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_etc1", "WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders", "WEBGL_lose_context", "WEBGL_multi_draw", "WEBGL_polygon_mode" ];
  // .getSupportedExtensions() can return null if context is lost, so coerce to empty array.
  return ctx.getSupportedExtensions()?.filter(ext => supportedExtensions.includes(ext)) ?? [];
};

var registerPreMainLoop = f => {
  // Does nothing unless $MainLoop is included/used.
  typeof MainLoop != "undefined" && MainLoop.preMainLoop.push(f);
};

var webglBufferSubData = (target, offset, size, data, src = (growMemViews(), HEAPU8)) => {
  GLctx.bufferSubData(target, offset, src.subarray(data, data + size));
};

var GL = {
  counter: 1,
  buffers: [],
  programs: [],
  framebuffers: [],
  renderbuffers: [],
  textures: [],
  shaders: [],
  vaos: [],
  contexts: {},
  offscreenCanvases: {},
  queries: [],
  byteSizeByTypeRoot: 5120,
  byteSizeByType: [ 1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8 ],
  stringCache: {},
  unpackAlignment: 4,
  unpackRowLength: 0,
  recordError: errorCode => {
    if (!GL.lastError) {
      GL.lastError = errorCode;
    }
  },
  getNewId: table => {
    var ret = GL.counter++;
    for (var i = table.length; i < ret; i++) {
      table[i] = null;
    }
    return ret;
  },
  genObject: (n, buffers, createFunction, objectTable) => {
    for (var i = 0; i < n; i++) {
      var buffer = GLctx[createFunction]();
      var id = buffer && GL.getNewId(objectTable);
      if (buffer) {
        buffer.name = id;
        objectTable[id] = buffer;
      } else {
        GL.recordError(1282);
      }
      (growMemViews(), HEAP32)[(((buffers) + (i * 4)) >> 2)] = id;
    }
  },
  MAX_TEMP_BUFFER_SIZE: 2097152,
  numTempVertexBuffersPerSize: 64,
  log2ceilLookup: i => 32 - Math.clz32(i ? i - 1 : 0),
  generateTempBuffers: (quads, context) => {
    var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
    context.tempVertexBufferCounters1 = [];
    context.tempVertexBufferCounters2 = [];
    context.tempVertexBufferCounters1.length = context.tempVertexBufferCounters2.length = largestIndex + 1;
    context.tempVertexBuffers1 = [];
    context.tempVertexBuffers2 = [];
    context.tempVertexBuffers1.length = context.tempVertexBuffers2.length = largestIndex + 1;
    context.tempIndexBuffers = [];
    context.tempIndexBuffers.length = largestIndex + 1;
    for (var i = 0; i <= largestIndex; ++i) {
      context.tempIndexBuffers[i] = null;
      // Created on-demand
      context.tempVertexBufferCounters1[i] = context.tempVertexBufferCounters2[i] = 0;
      var ringbufferLength = GL.numTempVertexBuffersPerSize;
      context.tempVertexBuffers1[i] = [];
      context.tempVertexBuffers2[i] = [];
      var ringbuffer1 = context.tempVertexBuffers1[i];
      var ringbuffer2 = context.tempVertexBuffers2[i];
      ringbuffer1.length = ringbuffer2.length = ringbufferLength;
      for (var j = 0; j < ringbufferLength; ++j) {
        ringbuffer1[j] = ringbuffer2[j] = null;
      }
    }
    if (quads) {
      // GL_QUAD indexes can be precalculated
      context.tempQuadIndexBuffer = GLctx.createBuffer();
      context.GLctx.bindBuffer(34963, context.tempQuadIndexBuffer);
      var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
      var quadIndexes = new Uint16Array(numIndexes);
      var i = 0, v = 0;
      while (1) {
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 1;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 3;
        if (i >= numIndexes) break;
        v += 4;
      }
      context.GLctx.bufferData(34963, quadIndexes, 35044);
      context.GLctx.bindBuffer(34963, null);
    }
  },
  getTempVertexBuffer: sizeBytes => {
    var idx = GL.log2ceilLookup(sizeBytes);
    var ringbuffer = GL.currentContext.tempVertexBuffers1[idx];
    var nextFreeBufferIndex = GL.currentContext.tempVertexBufferCounters1[idx];
    GL.currentContext.tempVertexBufferCounters1[idx] = (GL.currentContext.tempVertexBufferCounters1[idx] + 1) & (GL.numTempVertexBuffersPerSize - 1);
    var vbo = ringbuffer[nextFreeBufferIndex];
    if (vbo) {
      return vbo;
    }
    var prevVBO = GLctx.getParameter(34964);
    ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
    GLctx.bindBuffer(34962, ringbuffer[nextFreeBufferIndex]);
    GLctx.bufferData(34962, 1 << idx, 35048);
    GLctx.bindBuffer(34962, prevVBO);
    return ringbuffer[nextFreeBufferIndex];
  },
  getTempIndexBuffer: sizeBytes => {
    var idx = GL.log2ceilLookup(sizeBytes);
    var ibo = GL.currentContext.tempIndexBuffers[idx];
    if (ibo) {
      return ibo;
    }
    var prevIBO = GLctx.getParameter(34965);
    GL.currentContext.tempIndexBuffers[idx] = GLctx.createBuffer();
    GLctx.bindBuffer(34963, GL.currentContext.tempIndexBuffers[idx]);
    GLctx.bufferData(34963, 1 << idx, 35048);
    GLctx.bindBuffer(34963, prevIBO);
    return GL.currentContext.tempIndexBuffers[idx];
  },
  newRenderingFrameStarted: () => {
    if (!GL.currentContext) {
      return;
    }
    var vb = GL.currentContext.tempVertexBuffers1;
    GL.currentContext.tempVertexBuffers1 = GL.currentContext.tempVertexBuffers2;
    GL.currentContext.tempVertexBuffers2 = vb;
    vb = GL.currentContext.tempVertexBufferCounters1;
    GL.currentContext.tempVertexBufferCounters1 = GL.currentContext.tempVertexBufferCounters2;
    GL.currentContext.tempVertexBufferCounters2 = vb;
    var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
    for (var i = 0; i <= largestIndex; ++i) {
      GL.currentContext.tempVertexBufferCounters1[i] = 0;
    }
  },
  getSource: (shader, count, string, length) => {
    var source = "";
    for (var i = 0; i < count; ++i) {
      var len = length ? (growMemViews(), HEAPU32)[(((length) + (i * 4)) >> 2)] : undefined;
      source += UTF8ToString((growMemViews(), HEAPU32)[(((string) + (i * 4)) >> 2)], len);
    }
    // Let's see if we need to enable the standard derivatives extension
    var type = GLctx.getShaderParameter(GL.shaders[shader], 35663);
    if (type == 35632) {
      if (GLEmulation.findToken(source, "dFdx") || GLEmulation.findToken(source, "dFdy") || GLEmulation.findToken(source, "fwidth")) {
        source = "#extension GL_OES_standard_derivatives : enable\n" + source;
        var extension = GLctx.getExtension("OES_standard_derivatives");
      }
    }
    return source;
  },
  createContext: (/** @type {HTMLCanvasElement} */ canvas, webGLContextAttributes) => {
    // BUG: Workaround Safari WebGL issue: After successfully acquiring WebGL
    // context on a canvas, calling .getContext() will always return that
    // context independent of which 'webgl' or 'webgl2'
    // context version was passed. See:
    //   https://webkit.org/b/222758
    // and:
    //   https://github.com/emscripten-core/emscripten/issues/13295.
    // TODO: Once the bug is fixed and shipped in Safari, adjust the Safari
    // version field in above check.
    if (!canvas.getContextSafariWebGL2Fixed) {
      canvas.getContextSafariWebGL2Fixed = canvas.getContext;
      /** @type {function(this:HTMLCanvasElement, string, (Object|null)=): (Object|null)} */ function fixedGetContext(ver, attrs) {
        var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
        return ((ver == "webgl") == (gl instanceof WebGLRenderingContext)) ? gl : null;
      }
      canvas.getContext = fixedGetContext;
    }
    var ctx = canvas.getContext("webgl", webGLContextAttributes);
    if (!ctx) return 0;
    var handle = GL.registerContext(ctx, webGLContextAttributes);
    return handle;
  },
  registerContext: (ctx, webGLContextAttributes) => {
    // with pthreads a context is a location in memory with some synchronized
    // data between threads
    var handle = _malloc(8);
    (growMemViews(), HEAPU32)[(((handle) + (4)) >> 2)] = _pthread_self();
    // the thread pointer of the thread that owns the control of the context
    var context = {
      handle,
      attributes: webGLContextAttributes,
      version: webGLContextAttributes.majorVersion,
      GLctx: ctx
    };
    // Store the created context object so that we can access the context
    // given a canvas without having to pass the parameters again.
    if (ctx.canvas) ctx.canvas.GLctxObject = context;
    GL.contexts[handle] = context;
    if (typeof webGLContextAttributes.enableExtensionsByDefault == "undefined" || webGLContextAttributes.enableExtensionsByDefault) {
      GL.initExtensions(context);
    }
    return handle;
  },
  makeContextCurrent: contextHandle => {
    // Active Emscripten GL layer context object.
    GL.currentContext = GL.contexts[contextHandle];
    // Active WebGL context object.
    Module["ctx"] = GLctx = GL.currentContext?.GLctx;
    return !(contextHandle && !GLctx);
  },
  getContext: contextHandle => GL.contexts[contextHandle],
  deleteContext: contextHandle => {
    if (GL.currentContext === GL.contexts[contextHandle]) {
      GL.currentContext = null;
    }
    if (typeof JSEvents == "object") {
      // Release all JS event handlers on the DOM element that the GL context is
      // associated with since the context is now deleted.
      JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
    }
    // Make sure the canvas object no longer refers to the context object so
    // there are no GC surprises.
    if (GL.contexts[contextHandle]?.GLctx.canvas) {
      GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
    }
    _free(GL.contexts[contextHandle].handle);
    GL.contexts[contextHandle] = null;
  },
  initExtensions: context => {
    // If this function is called without a specific context object, init the
    // extensions of the currently active context.
    context ||= GL.currentContext;
    if (context.initExtensionsDone) return;
    context.initExtensionsDone = true;
    var GLctx = context.GLctx;
    // Detect the presence of a few extensions manually, since the GL interop
    // layer itself will need to know if they exist.
    context.compressionExt = GLctx.getExtension("WEBGL_compressed_texture_s3tc");
    context.anisotropicExt = GLctx.getExtension("EXT_texture_filter_anisotropic");
    // Extensions that are available in both WebGL 1 and WebGL 2
    webgl_enable_WEBGL_multi_draw(GLctx);
    webgl_enable_EXT_polygon_offset_clamp(GLctx);
    webgl_enable_EXT_clip_control(GLctx);
    webgl_enable_WEBGL_polygon_mode(GLctx);
    // Extensions that are only available in WebGL 1 (the calls will be no-ops
    // if called on a WebGL 2 context active)
    webgl_enable_ANGLE_instanced_arrays(GLctx);
    webgl_enable_OES_vertex_array_object(GLctx);
    webgl_enable_WEBGL_draw_buffers(GLctx);
    {
      GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
    }
    for (var ext of getEmscriptenSupportedExtensions(GLctx)) {
      // WEBGL_lose_context, WEBGL_debug_renderer_info and WEBGL_debug_shaders
      // are not enabled by default.
      if (!ext.includes("lose_context") && !ext.includes("debug")) {
        // Call .getExtension() to enable that extension permanently.
        GLctx.getExtension(ext);
      }
    }
  }
};

var _emscripten_glBindBuffer = (target, buffer) => {
  if (target == 34962) {
    GLctx.currentArrayBufferBinding = buffer;
    GLImmediate.lastArrayBuffer = buffer;
  } else if (target == 34963) {
    GLctx.currentElementArrayBufferBinding = buffer;
  }
  GLctx.bindBuffer(target, GL.buffers[buffer]);
};

var _glBindBuffer = _emscripten_glBindBuffer;

var _emscripten_glBindTexture = (target, texture) => {
  GLctx.bindTexture(target, GL.textures[texture]);
};

var _glBindTexture = _emscripten_glBindTexture;

var _emscripten_glBlendFunc = (x0, x1) => GLctx.blendFunc(x0, x1);

var _glBlendFunc = _emscripten_glBlendFunc;

var _emscripten_glBufferData = (target, size, data, usage) => {
  switch (usage) {
   // fix usages, WebGL 1 only has *_DRAW
    case 35041:
   // GL_STREAM_READ
    case 35042:
    // GL_STREAM_COPY
    usage = 35040;
    // GL_STREAM_DRAW
    break;

   case 35045:
   // GL_STATIC_READ
    case 35046:
    // GL_STATIC_COPY
    usage = 35044;
    // GL_STATIC_DRAW
    break;

   case 35049:
   // GL_DYNAMIC_READ
    case 35050:
    // GL_DYNAMIC_COPY
    usage = 35048;
    // GL_DYNAMIC_DRAW
    break;
  }
  // N.b. here first form specifies a heap subarray, second form an integer
  // size, so the ?: code here is polymorphic. It is advised to avoid
  // randomly mixing both uses in calling code, to avoid any potential JS
  // engine JIT issues.
  GLctx.bufferData(target, data ? (growMemViews(), HEAPU8).subarray(data, data + size) : size, usage);
};

var _glBufferData = _emscripten_glBufferData;

var _emscripten_glClear = x0 => GLctx.clear(x0);

var _glClear = _emscripten_glClear;

var _emscripten_glClearColor = (x0, x1, x2, x3) => GLctx.clearColor(x0, x1, x2, x3);

var _glClearColor = _emscripten_glClearColor;

var _emscripten_glColor4f = (r, g, b, a) => {
  r = Math.max(Math.min(r, 1), 0);
  g = Math.max(Math.min(g, 1), 0);
  b = Math.max(Math.min(b, 1), 0);
  a = Math.max(Math.min(a, 1), 0);
  // TODO: make ub the default, not f, save a few mathops
  if (GLImmediate.mode >= 0) {
    var start = GLImmediate.vertexCounter << 2;
    GLImmediate.vertexDataU8[start + 0] = r * 255;
    GLImmediate.vertexDataU8[start + 1] = g * 255;
    GLImmediate.vertexDataU8[start + 2] = b * 255;
    GLImmediate.vertexDataU8[start + 3] = a * 255;
    GLImmediate.vertexCounter++;
    GLImmediate.addRendererComponent(GLImmediate.COLOR, 4, GLctx.UNSIGNED_BYTE);
  } else {
    GLImmediate.clientColor[0] = r;
    GLImmediate.clientColor[1] = g;
    GLImmediate.clientColor[2] = b;
    GLImmediate.clientColor[3] = a;
  }
};

var _glColor4f = _emscripten_glColor4f;

var _emscripten_glColorMask = (red, green, blue, alpha) => {
  GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
};

var _glColorMask = _emscripten_glColorMask;

var _emscripten_glColorPointer = (size, type, stride, pointer) => {
  GLImmediate.setClientAttribute(GLImmediate.COLOR, size, type, stride, pointer);
};

var _glColorPointer = _emscripten_glColorPointer;

var _emscripten_glCullFace = x0 => GLctx.cullFace(x0);

var _glCullFace = _emscripten_glCullFace;

var _emscripten_glDeleteBuffers = (n, buffers) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((buffers) + (i * 4)) >> 2)];
    var buffer = GL.buffers[id];
    // From spec: "glDeleteBuffers silently ignores 0's and names that do not
    // correspond to existing buffer objects."
    if (!buffer) continue;
    GLctx.deleteBuffer(buffer);
    buffer.name = 0;
    GL.buffers[id] = null;
    if (id == GLctx.currentArrayBufferBinding) GLctx.currentArrayBufferBinding = 0;
    if (id == GLctx.currentElementArrayBufferBinding) GLctx.currentElementArrayBufferBinding = 0;
  }
};

var _glDeleteBuffers = _emscripten_glDeleteBuffers;

var _emscripten_glDeleteTextures = (n, textures) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((textures) + (i * 4)) >> 2)];
    var texture = GL.textures[id];
    // GL spec: "glDeleteTextures silently ignores 0s and names that do not
    // correspond to existing textures".
    if (!texture) continue;
    GLctx.deleteTexture(texture);
    texture.name = 0;
    GL.textures[id] = null;
  }
};

var _glDeleteTextures = _emscripten_glDeleteTextures;

var _emscripten_glDepthFunc = x0 => GLctx.depthFunc(x0);

var _glDepthFunc = _emscripten_glDepthFunc;

var _emscripten_glDepthMask = flag => {
  GLctx.depthMask(!!flag);
};

var _glDepthMask = _emscripten_glDepthMask;

var _emscripten_glDepthRangef = (x0, x1) => GLctx.depthRange(x0, x1);

var _glDepthRangef = _emscripten_glDepthRangef;

var _emscripten_glDisable = x0 => GLctx.disable(x0);

var _glDisable = _emscripten_glDisable;

var _emscripten_glDisableClientState = cap => {
  var attrib = GLEmulation.getAttributeFromCapability(cap);
  if (attrib === null) {
    return;
  }
  if (GLImmediate.enabledClientAttributes[attrib]) {
    GLImmediate.enabledClientAttributes[attrib] = false;
    GLImmediate.totalEnabledClientAttributes--;
    GLImmediate.currentRenderer = null;
    // Will need to change current renderer, since the set of active vertex pointers changed.
    if (GLEmulation.currentVao) delete GLEmulation.currentVao.enabledClientStates[cap];
    GLImmediate.modifiedClientAttributes = true;
  }
};

var _glDisableClientState = _emscripten_glDisableClientState;

var _emscripten_glDrawArrays = (mode, first, count) => {
  if (GLImmediate.totalEnabledClientAttributes == 0 && mode <= 6) {
    GLctx.drawArrays(mode, first, count);
    return;
  }
  GLImmediate.prepareClientAttributes(count, false);
  GLImmediate.mode = mode;
  if (!GLctx.currentArrayBufferBinding) {
    GLImmediate.vertexData = (growMemViews(), HEAPF32).subarray((((GLImmediate.vertexPointer) >> 2)), ((GLImmediate.vertexPointer + (first + count) * GLImmediate.stride) >> 2));
    // XXX assuming float
    GLImmediate.firstVertex = first;
    GLImmediate.lastVertex = first + count;
  }
  GLImmediate.flush(null, first);
  GLImmediate.mode = -1;
};

var _glDrawArrays = _emscripten_glDrawArrays;

var _emscripten_glEnable = x0 => GLctx.enable(x0);

var _glEnable = _emscripten_glEnable;

var _emscripten_glEnableClientState = cap => {
  var attrib = GLEmulation.getAttributeFromCapability(cap);
  if (attrib === null) {
    return;
  }
  if (!GLImmediate.enabledClientAttributes[attrib]) {
    GLImmediate.enabledClientAttributes[attrib] = true;
    GLImmediate.totalEnabledClientAttributes++;
    GLImmediate.currentRenderer = null;
    // Will need to change current renderer, since the set of active vertex pointers changed.
    if (GLEmulation.currentVao) GLEmulation.currentVao.enabledClientStates[cap] = 1;
    GLImmediate.modifiedClientAttributes = true;
  }
};

var _glEnableClientState = _emscripten_glEnableClientState;

var _emscripten_glFogf = (pname, param) => {
  // partial support, TODO
  switch (pname) {
   case 2915:
    // GL_FOG_START
    GLEmulation.fogStart = param;
    break;

   case 2916:
    // GL_FOG_END
    GLEmulation.fogEnd = param;
    break;

   case 2914:
    // GL_FOG_DENSITY
    GLEmulation.fogDensity = param;
    break;

   case 2917:
    // GL_FOG_MODE
    switch (param) {
     case 2049:
     // GL_EXP2
      case 9729:
      // GL_LINEAR
      if (GLEmulation.fogMode != param) {
        GLImmediate.currentRenderer = null;
        // Fog mode is part of the FFP shader state, we must re-lookup the renderer to use.
        GLEmulation.fogMode = param;
      }
      break;

     default:
      // default to GL_EXP
      if (GLEmulation.fogMode != 2048) {
        GLImmediate.currentRenderer = null;
        // Fog mode is part of the FFP shader state, we must re-lookup the renderer to use.
        GLEmulation.fogMode = 2048;
      }
      break;
    }
    break;
  }
};

var _glFogf = _emscripten_glFogf;

var _emscripten_glFogfv = (pname, param) => {
  // partial support, TODO
  switch (pname) {
   case 2918:
    // GL_FOG_COLOR
    GLEmulation.fogColor[0] = (growMemViews(), HEAPF32)[((param) >> 2)];
    GLEmulation.fogColor[1] = (growMemViews(), HEAPF32)[(((param) + (4)) >> 2)];
    GLEmulation.fogColor[2] = (growMemViews(), HEAPF32)[(((param) + (8)) >> 2)];
    GLEmulation.fogColor[3] = (growMemViews(), HEAPF32)[(((param) + (12)) >> 2)];
    break;

   case 2915:
   // GL_FOG_START
    case 2916:
    // GL_FOG_END
    _glFogf(pname, (growMemViews(), HEAPF32)[((param) >> 2)]);
    break;
  }
};

var _glFogfv = _emscripten_glFogfv;

var _emscripten_glFogi = (pname, param) => _glFogf(pname, param);

var _glFogi = _emscripten_glFogi;

var _emscripten_glFogx = _glFogi;

var _glFogx = _emscripten_glFogx;

var _emscripten_glGenBuffers = (n, buffers) => {
  GL.genObject(n, buffers, "createBuffer", GL.buffers);
};

var _glGenBuffers = _emscripten_glGenBuffers;

var _emscripten_glGenTextures = (n, textures) => {
  GL.genObject(n, textures, "createTexture", GL.textures);
};

var _glGenTextures = _emscripten_glGenTextures;

var writeI53ToI64 = (ptr, num) => {
  (growMemViews(), HEAPU32)[((ptr) >> 2)] = num;
  var lower = (growMemViews(), HEAPU32)[((ptr) >> 2)];
  (growMemViews(), HEAPU32)[(((ptr) + (4)) >> 2)] = (num - lower) / 4294967296;
};

var emscriptenWebGLGet = (name_, p, type) => {
  // Guard against user passing a null pointer.
  // Note that GLES2 spec does not say anything about how passing a null
  // pointer should be treated.  Testing on desktop core GL 3, the application
  // crashes on glGetIntegerv to a null pointer, but better to report an error
  // instead of doing anything random.
  if (!p) {
    GL.recordError(1281);
    return;
  }
  var ret = undefined;
  switch (name_) {
   // Handle a few trivial GLES values
    case 36346:
    // GL_SHADER_COMPILER
    ret = 1;
    break;

   case 36344:
    // GL_SHADER_BINARY_FORMATS
    if (type != 0 && type != 1) {
      GL.recordError(1280);
    }
    // Do not write anything to the out pointer, since no binary formats are
    // supported.
    return;

   case 36345:
    // GL_NUM_SHADER_BINARY_FORMATS
    ret = 0;
    break;

   case 34466:
    // GL_NUM_COMPRESSED_TEXTURE_FORMATS
    // WebGL doesn't have GL_NUM_COMPRESSED_TEXTURE_FORMATS (it's obsolete
    // since GL_COMPRESSED_TEXTURE_FORMATS returns a JS array that can be
    // queried for length), so implement it ourselves to allow C++ GLES2
    // code to get the length.
    var formats = GLctx.getParameter(34467);
    ret = formats ? formats.length : 0;
    break;
  }
  if (ret === undefined) {
    var result = GLctx.getParameter(name_);
    switch (typeof result) {
     case "number":
      ret = result;
      break;

     case "boolean":
      ret = result ? 1 : 0;
      break;

     case "string":
      GL.recordError(1280);
      // GL_INVALID_ENUM
      return;

     case "object":
      if (result === null) {
        // null is a valid result for some (e.g., which buffer is bound -
        // perhaps nothing is bound), but otherwise can mean an invalid
        // name_, which we need to report as an error
        switch (name_) {
         case 34964:
         // ARRAY_BUFFER_BINDING
          case 35725:
         // CURRENT_PROGRAM
          case 34965:
         // ELEMENT_ARRAY_BUFFER_BINDING
          case 36006:
         // FRAMEBUFFER_BINDING or DRAW_FRAMEBUFFER_BINDING
          case 36007:
         // RENDERBUFFER_BINDING
          case 32873:
         // TEXTURE_BINDING_2D
          case 34229:
         // WebGL 2 GL_VERTEX_ARRAY_BINDING, or WebGL 1 extension OES_vertex_array_object GL_VERTEX_ARRAY_BINDING_OES
          case 34068:
          {
            // TEXTURE_BINDING_CUBE_MAP
            ret = 0;
            break;
          }

         default:
          {
            GL.recordError(1280);
            // GL_INVALID_ENUM
            return;
          }
        }
      } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
        for (var i = 0; i < result.length; ++i) {
          switch (type) {
           case 0:
            (growMemViews(), HEAP32)[(((p) + (i * 4)) >> 2)] = result[i];
            break;

           case 2:
            (growMemViews(), HEAPF32)[(((p) + (i * 4)) >> 2)] = result[i];
            break;

           case 4:
            (growMemViews(), HEAP8)[(p) + (i)] = result[i] ? 1 : 0;
            break;
          }
        }
        return;
      } else {
        try {
          ret = result.name | 0;
        } catch (e) {
          GL.recordError(1280);
          // GL_INVALID_ENUM
          err(`GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`);
          return;
        }
      }
      break;

     default:
      GL.recordError(1280);
      // GL_INVALID_ENUM
      err(`GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof (result)}!`);
      return;
    }
  }
  switch (type) {
   case 1:
    writeI53ToI64(p, ret);
    break;

   case 0:
    (growMemViews(), HEAP32)[((p) >> 2)] = ret;
    break;

   case 2:
    (growMemViews(), HEAPF32)[((p) >> 2)] = ret;
    break;

   case 4:
    (growMemViews(), HEAP8)[p] = ret ? 1 : 0;
    break;
  }
};

var _emscripten_glGetFloatv = (name_, p) => emscriptenWebGLGet(name_, p, 2);

var _glGetFloatv = _emscripten_glGetFloatv;

var _emscripten_glHint = (x0, x1) => GLctx.hint(x0, x1);

var _glHint = _emscripten_glHint;

var _emscripten_glLightModelfv = (pname, param) => {
  // TODO: GL_LIGHT_MODEL_LOCAL_VIEWER
  if (pname == 2899) {
    // GL_LIGHT_MODEL_AMBIENT
    GLEmulation.lightModelAmbient[0] = (growMemViews(), HEAPF32)[((param) >> 2)];
    GLEmulation.lightModelAmbient[1] = (growMemViews(), HEAPF32)[(((param) + (4)) >> 2)];
    GLEmulation.lightModelAmbient[2] = (growMemViews(), HEAPF32)[(((param) + (8)) >> 2)];
    GLEmulation.lightModelAmbient[3] = (growMemViews(), HEAPF32)[(((param) + (12)) >> 2)];
  } else {
    abort("glLightModelfv: TODO: " + pname);
  }
};

var _glLightModelfv = _emscripten_glLightModelfv;

var _emscripten_glLightfv = (light, pname, param) => {
  if ((light >= 16384) && (light < 16392)) {
    var lightId = light - 16384;
    if (pname == 4608) {
      // GL_AMBIENT
      GLEmulation.lightAmbient[lightId][0] = (growMemViews(), HEAPF32)[((param) >> 2)];
      GLEmulation.lightAmbient[lightId][1] = (growMemViews(), HEAPF32)[(((param) + (4)) >> 2)];
      GLEmulation.lightAmbient[lightId][2] = (growMemViews(), HEAPF32)[(((param) + (8)) >> 2)];
      GLEmulation.lightAmbient[lightId][3] = (growMemViews(), HEAPF32)[(((param) + (12)) >> 2)];
    } else if (pname == 4609) {
      // GL_DIFFUSE
      GLEmulation.lightDiffuse[lightId][0] = (growMemViews(), HEAPF32)[((param) >> 2)];
      GLEmulation.lightDiffuse[lightId][1] = (growMemViews(), HEAPF32)[(((param) + (4)) >> 2)];
      GLEmulation.lightDiffuse[lightId][2] = (growMemViews(), HEAPF32)[(((param) + (8)) >> 2)];
      GLEmulation.lightDiffuse[lightId][3] = (growMemViews(), HEAPF32)[(((param) + (12)) >> 2)];
    } else if (pname == 4610) {
      // GL_SPECULAR
      GLEmulation.lightSpecular[lightId][0] = (growMemViews(), HEAPF32)[((param) >> 2)];
      GLEmulation.lightSpecular[lightId][1] = (growMemViews(), HEAPF32)[(((param) + (4)) >> 2)];
      GLEmulation.lightSpecular[lightId][2] = (growMemViews(), HEAPF32)[(((param) + (8)) >> 2)];
      GLEmulation.lightSpecular[lightId][3] = (growMemViews(), HEAPF32)[(((param) + (12)) >> 2)];
    } else if (pname == 4611) {
      // GL_POSITION
      GLEmulation.lightPosition[lightId][0] = (growMemViews(), HEAPF32)[((param) >> 2)];
      GLEmulation.lightPosition[lightId][1] = (growMemViews(), HEAPF32)[(((param) + (4)) >> 2)];
      GLEmulation.lightPosition[lightId][2] = (growMemViews(), HEAPF32)[(((param) + (8)) >> 2)];
      GLEmulation.lightPosition[lightId][3] = (growMemViews(), HEAPF32)[(((param) + (12)) >> 2)];
      // multiply position with current modelviewmatrix
      GLImmediate.matrixLib.mat4.multiplyVec4(GLImmediate.matrix[0], GLEmulation.lightPosition[lightId]);
    } else {
      abort("glLightfv: TODO: " + pname);
    }
  }
};

var _glLightfv = _emscripten_glLightfv;

var _emscripten_glLineWidth = x0 => GLctx.lineWidth(x0);

var _glLineWidth = _emscripten_glLineWidth;

function getFullscreenElement() {
  return document.fullscreenElement ?? document.webkitFullscreenElement;
}

/** @param {number=} timeout */ var safeSetTimeout = (func, timeout) => {
  runtimeKeepalivePush();
  return setTimeout(() => {
    runtimeKeepalivePop();
    callUserCallback(func);
  }, timeout);
};

var warnOnce = text => {
  warnOnce.shown ||= {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    if (ENVIRONMENT_IS_NODE) text = "warning: " + text;
    err(text);
  }
};

var Browser = {
  useWebGL: false,
  isFullscreen: false,
  pointerLock: false,
  moduleContextCreatedCallbacks: [],
  preloadedImages: {},
  preloadedAudios: {},
  getCanvas: () => Module["canvas"],
  init() {
    if (Browser.initted) return;
    Browser.initted = true;
    // Support for plugins that can process preloaded files. You can add more of these to
    // your app by creating and appending to preloadPlugins.
    // Each plugin is asked if it can handle a file based on the file's name. If it can,
    // it is given the file's raw data. When it is done, it calls a callback with the file's
    // (possibly modified) data. For example, a plugin might decompress a file, or it
    // might create some side data structure for use later (like an Image element, etc.).
    var imagePlugin = {};
    imagePlugin["canHandle"] = name => !Module["noImageDecoding"] && /\.(jpg|jpeg|png|bmp|webp)$/i.test(name);
    imagePlugin["handle"] = async (byteArray, name) => {
      var b = new Blob([ byteArray ], {
        type: Browser.getMimetype(name)
      });
      if (b.size !== byteArray.length) {
        // Safari bug #118630
        // Safari's Blob can only take an ArrayBuffer
        b = new Blob([ (new Uint8Array(byteArray)).buffer ], {
          type: Browser.getMimetype(name)
        });
      }
      var url = URL.createObjectURL(b);
      return new Promise((resolve, reject) => {
        var img = new Image;
        img.onload = () => {
          var canvas = /** @type {!HTMLCanvasElement} */ (document.createElement("canvas"));
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          Browser.preloadedImages[name] = canvas;
          URL.revokeObjectURL(url);
          resolve(byteArray);
        };
        img.onerror = event => {
          err(`Image ${url} could not be decoded`);
          reject();
        };
        img.src = url;
      });
    };
    preloadPlugins.push(imagePlugin);
    var audioPlugin = {};
    audioPlugin["canHandle"] = name => !Module["noAudioDecoding"] && name.slice(-4) in {
      ".ogg": 1,
      ".wav": 1,
      ".mp3": 1
    };
    audioPlugin["handle"] = async (byteArray, name) => new Promise((resolve, reject) => {
      var done = false;
      function finish(audio) {
        if (done) return;
        done = true;
        Browser.preloadedAudios[name] = audio;
        resolve(byteArray);
      }
      var b = new Blob([ byteArray ], {
        type: Browser.getMimetype(name)
      });
      var url = URL.createObjectURL(b);
      // XXX we never revoke this!
      var audio = new Audio;
      audio.addEventListener("canplaythrough", () => finish(audio));
      // use addEventListener due to chromium bug 124926
      audio.onerror = event => {
        if (done) return;
        err(`warning: browser could not fully decode audio ${name}, trying slower base64 approach`);
        function encode64(data) {
          var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
          var PAD = "=";
          var ret = "";
          var leftchar = 0;
          var leftbits = 0;
          for (var byte of data) {
            leftchar = (leftchar << 8) | byte;
            leftbits += 8;
            while (leftbits >= 6) {
              var curr = (leftchar >> (leftbits - 6)) & 63;
              leftbits -= 6;
              ret += BASE[curr];
            }
          }
          if (leftbits == 2) {
            ret += BASE[(leftchar & 3) << 4];
            ret += PAD + PAD;
          } else if (leftbits == 4) {
            ret += BASE[(leftchar & 15) << 2];
            ret += PAD;
          }
          return ret;
        }
        audio.src = "data:audio/x-" + name.slice(-3) + ";base64," + encode64(byteArray);
        finish(audio);
      };
      audio.src = url;
      // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
      safeSetTimeout(() => {
        finish(audio);
      }, 1e4);
    });
    preloadPlugins.push(audioPlugin);
    // Canvas event setup
    function pointerLockChange() {
      var canvas = Browser.getCanvas();
      Browser.pointerLock = document.pointerLockElement === canvas;
    }
    var canvas = Browser.getCanvas();
    if (canvas) {
      // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
      // Module['forcedAspectRatio'] = 4 / 3;
      document.addEventListener("pointerlockchange", pointerLockChange);
      if (Module["elementPointerLock"]) {
        canvas.addEventListener("click", ev => {
          if (!Browser.pointerLock && Browser.getCanvas().requestPointerLock) {
            Browser.getCanvas().requestPointerLock();
            ev.preventDefault();
          }
        });
      }
    }
  },
  createContext(/** @type {HTMLCanvasElement} */ canvas, useWebGL, setInModule, webGLContextAttributes) {
    if (useWebGL && Module["ctx"] && canvas == Browser.getCanvas()) return Module["ctx"];
    // no need to recreate GL context if it's already been created for this canvas.
    var ctx;
    var contextHandle;
    if (useWebGL) {
      // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
      var contextAttributes = {
        antialias: false,
        alpha: false,
        majorVersion: 1
      };
      if (webGLContextAttributes) {
        for (var attribute in webGLContextAttributes) {
          contextAttributes[attribute] = webGLContextAttributes[attribute];
        }
      }
      // This check of existence of GL is here to satisfy Closure compiler, which yells if variable GL is referenced below but GL object is not
      // actually compiled in because application is not doing any GL operations. TODO: Ideally if GL is not being used, this function
      // Browser.createContext() should not even be emitted.
      if (typeof GL != "undefined") {
        contextHandle = GL.createContext(canvas, contextAttributes);
        if (contextHandle) {
          ctx = GL.getContext(contextHandle).GLctx;
        }
      }
    } else {
      ctx = canvas.getContext("2d");
    }
    if (!ctx) return null;
    if (setInModule) {
      Module["ctx"] = ctx;
      if (useWebGL) GL.makeContextCurrent(contextHandle);
      Browser.useWebGL = useWebGL;
      Browser.moduleContextCreatedCallbacks.forEach(callback => callback());
      Browser.init();
    }
    return ctx;
  },
  fullscreenHandlersInstalled: false,
  lockPointer: undefined,
  resizeCanvas: undefined,
  requestFullscreen(lockPointer, resizeCanvas) {
    Browser.lockPointer = lockPointer;
    Browser.resizeCanvas = resizeCanvas;
    if (typeof Browser.lockPointer == "undefined") Browser.lockPointer = true;
    if (typeof Browser.resizeCanvas == "undefined") Browser.resizeCanvas = false;
    var canvas = Browser.getCanvas();
    function fullscreenChange() {
      Browser.isFullscreen = false;
      var canvasContainer = canvas.parentNode;
      if (getFullscreenElement() === canvasContainer) {
        canvas.exitFullscreen = Browser.exitFullscreen;
        if (Browser.lockPointer) canvas.requestPointerLock();
        Browser.isFullscreen = true;
        if (Browser.resizeCanvas) {
          Browser.setFullscreenCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
        }
      } else {
        // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
        canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
        canvasContainer.parentNode.removeChild(canvasContainer);
        if (Browser.resizeCanvas) {
          Browser.setWindowedCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
        }
      }
    }
    if (!Browser.fullscreenHandlersInstalled) {
      Browser.fullscreenHandlersInstalled = true;
      document.addEventListener("fullscreenchange", fullscreenChange);
      document.addEventListener("webkitfullscreenchange", fullscreenChange);
    }
    // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
    var canvasContainer = document.createElement("div");
    canvas.parentNode.insertBefore(canvasContainer, canvas);
    canvasContainer.appendChild(canvas);
    // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
    // Safari didn't support Element.requestFullscreen until 16.4
    // See: https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen
    /** @suppress {checkTypes} */ canvasContainer.requestFullscreen ??= (canvasContainer["webkitRequestFullscreen"] ? () => canvasContainer["webkitRequestFullscreen"](Element.ALLOW_KEYBOARD_INPUT) : null) ?? (canvasContainer["webkitRequestFullScreen"] ? () => canvasContainer["webkitRequestFullScreen"](Element.ALLOW_KEYBOARD_INPUT) : null);
    canvasContainer.requestFullscreen();
  },
  exitFullscreen() {
    // This is workaround for chrome. Trying to exit from fullscreen
    // not in fullscreen state will cause 'TypeError: Document not active'
    // in chrome. See https://github.com/emscripten-core/emscripten/pull/8236
    if (!Browser.isFullscreen) {
      return false;
    }
    var CFS = document.exitFullscreen ?? document["webkitCancelFullScreen"];
    CFS.apply(document, []);
    return true;
  },
  safeSetTimeout(func, timeout) {
    // Legacy function, this is used by the SDL2 port so we need to keep it
    // around at least until that is updated.
    // See https://github.com/libsdl-org/SDL/pull/6304
    return safeSetTimeout(func, timeout);
  },
  getMimetype(name) {
    return {
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg",
      "png": "image/png",
      "bmp": "image/bmp",
      "ogg": "audio/ogg",
      "wav": "audio/wav",
      "mp3": "audio/mpeg"
    }[name.slice(name.lastIndexOf(".") + 1)];
  },
  getUserMedia(func) {
    return navigator.mediaDevices.getUserMedia(func);
  },
  getMouseWheelDelta(event) {
    var delta = 0;
    switch (event.type) {
     case "DOMMouseScroll":
      // 3 lines make up a step
      delta = event.detail / 3;
      break;

     case "mousewheel":
      // 120 units make up a step
      delta = event.wheelDelta / 120;
      break;

     case "wheel":
      delta = event.deltaY;
      switch (event.deltaMode) {
       case 0:
        // DOM_DELTA_PIXEL: 100 pixels make up a step
        delta /= 100;
        break;

       case 1:
        // DOM_DELTA_LINE: 3 lines make up a step
        delta /= 3;
        break;

       case 2:
        // DOM_DELTA_PAGE: A page makes up 80 steps
        delta *= 80;
        break;

       default:
        abort("unrecognized mouse wheel delta mode: " + event.deltaMode);
      }
      break;

     default:
      abort("unrecognized mouse wheel event: " + event.type);
    }
    return delta;
  },
  mouseX: 0,
  mouseY: 0,
  mouseMovementX: 0,
  mouseMovementY: 0,
  touches: {},
  lastTouches: {},
  calculateMouseCoords(pageX, pageY) {
    // Calculate the movement based on the changes
    // in the coordinates.
    var canvas = Browser.getCanvas();
    var rect = canvas.getBoundingClientRect();
    var adjustedX = pageX - (window.scrollX + rect.left);
    var adjustedY = pageY - (window.scrollY + rect.top);
    // the canvas might be CSS-scaled compared to its backbuffer;
    // SDL-using content will want mouse coordinates in terms
    // of backbuffer units.
    adjustedX = adjustedX * (canvas.width / rect.width);
    adjustedY = adjustedY * (canvas.height / rect.height);
    return {
      x: adjustedX,
      y: adjustedY
    };
  },
  setMouseCoords(pageX, pageY) {
    const {x, y} = Browser.calculateMouseCoords(pageX, pageY);
    Browser.mouseMovementX = x - Browser.mouseX;
    Browser.mouseMovementY = y - Browser.mouseY;
    Browser.mouseX = x;
    Browser.mouseY = y;
  },
  calculateMouseEvent(event) {
    // event should be mousemove, mousedown or mouseup
    if (Browser.pointerLock) {
      // When the pointer is locked, calculate the coordinates
      // based on the movement of the mouse.
      Browser.mouseMovementX = event.movementX;
      Browser.mouseMovementY = event.movementY;
      // add the mouse delta to the current absolute mouse position
      Browser.mouseX += Browser.mouseMovementX;
      Browser.mouseY += Browser.mouseMovementY;
    } else {
      if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
        var touch = event.touch;
        if (touch === undefined) {
          return;
        }
        var coords = Browser.calculateMouseCoords(touch.pageX, touch.pageY);
        if (event.type === "touchstart") {
          Browser.lastTouches[touch.identifier] = coords;
          Browser.touches[touch.identifier] = coords;
        } else if (event.type === "touchend" || event.type === "touchmove") {
          var last = Browser.touches[touch.identifier];
          last ||= coords;
          Browser.lastTouches[touch.identifier] = last;
          Browser.touches[touch.identifier] = coords;
        }
        return;
      }
      Browser.setMouseCoords(event.pageX, event.pageY);
    }
  },
  resizeListeners: [],
  updateResizeListeners() {
    var canvas = Browser.getCanvas();
    Browser.resizeListeners.forEach(listener => listener(canvas.width, canvas.height));
  },
  setCanvasSize(width, height, noUpdates) {
    var canvas = Browser.getCanvas();
    Browser.updateCanvasDimensions(canvas, width, height);
    if (!noUpdates) Browser.updateResizeListeners();
  },
  windowedWidth: 0,
  windowedHeight: 0,
  setFullscreenCanvasSize() {
    // check if SDL is available
    if (typeof SDL != "undefined") {
      var flags = (growMemViews(), HEAPU32)[((SDL.screen) >> 2)];
      flags = flags | 8388608;
      // set SDL_FULLSCREEN flag
      (growMemViews(), HEAP32)[((SDL.screen) >> 2)] = flags;
    }
    Browser.updateCanvasDimensions(Browser.getCanvas());
    Browser.updateResizeListeners();
  },
  setWindowedCanvasSize() {
    // check if SDL is available
    if (typeof SDL != "undefined") {
      var flags = (growMemViews(), HEAPU32)[((SDL.screen) >> 2)];
      flags = flags & ~8388608;
      // clear SDL_FULLSCREEN flag
      (growMemViews(), HEAP32)[((SDL.screen) >> 2)] = flags;
    }
    Browser.updateCanvasDimensions(Browser.getCanvas());
    Browser.updateResizeListeners();
  },
  updateCanvasDimensions(canvas, wNative, hNative) {
    if (wNative && hNative) {
      canvas.widthNative = wNative;
      canvas.heightNative = hNative;
    } else {
      wNative = canvas.widthNative;
      hNative = canvas.heightNative;
    }
    var w = wNative;
    var h = hNative;
    if ((getFullscreenElement() === canvas.parentNode) && (typeof screen != "undefined")) {
      var factor = Math.min(screen.width / w, screen.height / h);
      w = Math.round(w * factor);
      h = Math.round(h * factor);
    }
    if (Browser.resizeCanvas) {
      if (canvas.width != w) canvas.width = w;
      if (canvas.height != h) canvas.height = h;
      if (typeof canvas.style != "undefined") {
        canvas.style.removeProperty("width");
        canvas.style.removeProperty("height");
      }
    } else {
      if (canvas.width != wNative) canvas.width = wNative;
      if (canvas.height != hNative) canvas.height = hNative;
      if (typeof canvas.style != "undefined") {
        if (w != wNative || h != hNative) {
          canvas.style.setProperty("width", w + "px", "important");
          canvas.style.setProperty("height", h + "px", "important");
        } else {
          canvas.style.removeProperty("width");
          canvas.style.removeProperty("height");
        }
      }
    }
  }
};

var _emscripten_glIsEnabled = x0 => GLctx.isEnabled(x0);

var _glIsEnabled = _emscripten_glIsEnabled;

var _emscripten_glGetBooleanv = (name_, p) => emscriptenWebGLGet(name_, p, 4);

var _glGetBooleanv = _emscripten_glGetBooleanv;

var _emscripten_glGetIntegerv = (name_, p) => emscriptenWebGLGet(name_, p, 0);

var _glGetIntegerv = _emscripten_glGetIntegerv;

var stringToNewUTF8 = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8(str, ret, size);
  return ret;
};

var webglGetExtensions = () => {
  var exts = getEmscriptenSupportedExtensions(GLctx);
  exts = exts.concat(exts.map(e => "GL_" + e));
  return exts;
};

var _emscripten_glGetString = name_ => {
  var ret = GL.stringCache[name_];
  if (!ret) {
    switch (name_) {
     case 7939:
      ret = stringToNewUTF8(webglGetExtensions().join(" "));
      break;

     case 7936:
     case 7937:
     case 37445:
     case 37446:
      var s = GLctx.getParameter(name_);
      if (!s) {
        GL.recordError(1280);
      }
      ret = s ? stringToNewUTF8(s) : 0;
      break;

     case 7938:
      var webGLVersion = GLctx.getParameter(7938);
      // return GLES version string corresponding to the version of the WebGL context
      var glVersion = `OpenGL ES 2.0 (${webGLVersion})`;
      ret = stringToNewUTF8(glVersion);
      break;

     case 35724:
      var glslVersion = GLctx.getParameter(35724);
      // extract the version number 'N.M' from the string 'WebGL GLSL ES N.M ...'
      var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
      var ver_num = glslVersion.match(ver_re);
      if (ver_num !== null) {
        if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
        // ensure minor version has 2 digits
        glslVersion = `OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`;
      }
      ret = stringToNewUTF8(glslVersion);
      break;

     default:
      GL.recordError(1280);
    }
    GL.stringCache[name_] = ret;
  }
  return ret;
};

var _glGetString = _emscripten_glGetString;

var _emscripten_glCreateShader = shaderType => {
  var id = GL.getNewId(GL.shaders);
  GL.shaders[id] = GLctx.createShader(shaderType);
  return id;
};

var _glCreateShader = _emscripten_glCreateShader;

var _emscripten_glShaderSource = (shader, count, string, length) => {
  var source = GL.getSource(shader, count, string, length);
  GLctx.shaderSource(GL.shaders[shader], source);
};

var _glShaderSource = _emscripten_glShaderSource;

var _emscripten_glCompileShader = shader => {
  GLctx.compileShader(GL.shaders[shader]);
};

var _glCompileShader = _emscripten_glCompileShader;

var _emscripten_glAttachShader = (program, shader) => {
  GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
};

var _glAttachShader = _emscripten_glAttachShader;

var _emscripten_glDetachShader = (program, shader) => {
  GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
};

var _glDetachShader = _emscripten_glDetachShader;

var _emscripten_glUseProgram = program => {
  program = GL.programs[program];
  GLctx.useProgram(program);
  // Record the currently active program so that we can access the uniform
  // mapping table of that program.
  GLctx.currentProgram = program;
};

var _glUseProgram = _emscripten_glUseProgram;

var _emscripten_glDeleteProgram = id => {
  if (!id) return;
  var program = GL.programs[id];
  if (!program) {
    // glDeleteProgram actually signals an error when deleting a nonexisting
    // object, unlike some other GL delete functions.
    GL.recordError(1281);
    return;
  }
  GLctx.deleteProgram(program);
  program.name = 0;
  GL.programs[id] = null;
};

var _glDeleteProgram = _emscripten_glDeleteProgram;

var _emscripten_glBindAttribLocation = (program, index, name) => {
  GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
};

var _glBindAttribLocation = _emscripten_glBindAttribLocation;

var _emscripten_glLinkProgram = program => {
  program = GL.programs[program];
  GLctx.linkProgram(program);
  // Invalidate earlier computed uniform->ID mappings, those have now become stale
  program.uniformLocsById = 0;
  // Mark as null-like so that glGetUniformLocation() knows to populate this again.
  program.uniformSizeAndIdsByName = {};
};

var _glLinkProgram = _emscripten_glLinkProgram;

var _emscripten_glEnableVertexAttribArray = index => {
  GLctx.enableVertexAttribArray(index);
};

var _glEnableVertexAttribArray = _emscripten_glEnableVertexAttribArray;

var _emscripten_glDisableVertexAttribArray = index => {
  GLctx.disableVertexAttribArray(index);
};

var _glDisableVertexAttribArray = _emscripten_glDisableVertexAttribArray;

var _emscripten_glVertexAttribPointer = (index, size, type, normalized, stride, ptr) => {
  GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
};

var _glVertexAttribPointer = _emscripten_glVertexAttribPointer;

var _emscripten_glActiveTexture = x0 => GLctx.activeTexture(x0);

var _glActiveTexture = _emscripten_glActiveTexture;

function ptrToString(ptr) {
  // Convert to 32-bit unsigned value
  ptr >>>= 0;
  return "0x" + ptr.toString(16).padStart(8, "0");
}

var GLEmulation = {
  fogStart: 0,
  fogEnd: 1,
  fogDensity: 1,
  fogColor: null,
  fogMode: 2048,
  fogEnabled: false,
  MAX_CLIP_PLANES: 6,
  clipPlaneEnabled: [ false, false, false, false, false, false ],
  clipPlaneEquation: [],
  lightingEnabled: false,
  lightModelAmbient: null,
  lightModelLocalViewer: false,
  lightModelTwoSide: false,
  materialAmbient: null,
  materialDiffuse: null,
  materialSpecular: null,
  materialShininess: null,
  materialEmission: null,
  MAX_LIGHTS: 8,
  lightEnabled: [ false, false, false, false, false, false, false, false ],
  lightAmbient: [],
  lightDiffuse: [],
  lightSpecular: [],
  lightPosition: [],
  alphaTestEnabled: false,
  alphaTestFunc: 519,
  alphaTestRef: 0,
  pointSize: 1,
  vaos: [],
  currentVao: null,
  enabledVertexAttribArrays: {},
  hasRunInit: false,
  findToken(source, token) {
    function isIdentChar(ch) {
      if (ch >= 48 && ch <= 57) // 0-9
      return true;
      if (ch >= 65 && ch <= 90) // A-Z
      return true;
      if (ch >= 97 && ch <= 122) // a-z
      return true;
      return false;
    }
    var i = -1;
    do {
      i = source.indexOf(token, i + 1);
      if (i < 0) {
        break;
      }
      if (i > 0 && isIdentChar(source[i - 1])) {
        continue;
      }
      i += token.length;
      if (i < source.length - 1 && isIdentChar(source[i + 1])) {
        continue;
      }
      return true;
    } while (true);
    return false;
  },
  init() {
    // Do not activate immediate/emulation code (e.g. replace glDrawElements)
    // when in FULL_ES2 mode.  We do not need full emulation, we instead
    // emulate client-side arrays etc. in FULL_ES2 code in a straightforward
    // manner, and avoid not having a bound buffer be ambiguous between es2
    // emulation code and legacy gl emulation code.
    if (GLEmulation.hasRunInit) {
      return;
    }
    GLEmulation.hasRunInit = true;
    GLEmulation.fogColor = new Float32Array(4);
    for (var clipPlaneId = 0; clipPlaneId < GLEmulation.MAX_CLIP_PLANES; clipPlaneId++) {
      GLEmulation.clipPlaneEquation[clipPlaneId] = new Float32Array(4);
    }
    // set defaults for GL_LIGHTING
    GLEmulation.lightModelAmbient = new Float32Array([ .2, .2, .2, 1 ]);
    GLEmulation.materialAmbient = new Float32Array([ .2, .2, .2, 1 ]);
    GLEmulation.materialDiffuse = new Float32Array([ .8, .8, .8, 1 ]);
    GLEmulation.materialSpecular = new Float32Array([ 0, 0, 0, 1 ]);
    GLEmulation.materialShininess = new Float32Array([ 0 ]);
    GLEmulation.materialEmission = new Float32Array([ 0, 0, 0, 1 ]);
    for (var lightId = 0; lightId < GLEmulation.MAX_LIGHTS; lightId++) {
      GLEmulation.lightAmbient[lightId] = new Float32Array([ 0, 0, 0, 1 ]);
      GLEmulation.lightDiffuse[lightId] = lightId ? new Float32Array([ 0, 0, 0, 1 ]) : new Float32Array([ 1, 1, 1, 1 ]);
      GLEmulation.lightSpecular[lightId] = lightId ? new Float32Array([ 0, 0, 0, 1 ]) : new Float32Array([ 1, 1, 1, 1 ]);
      GLEmulation.lightPosition[lightId] = new Float32Array([ 0, 0, 1, 0 ]);
    }
    // Add some emulation workarounds
    err("WARNING: using emscripten GL emulation. This is a collection of limited workarounds, do not expect it to work.");
    // XXX some of the capabilities we don't support may lead to incorrect rendering, if we do not emulate them in shaders
    var validCapabilities = {
      2884: 1,
      // GL_CULL_FACE
      3042: 1,
      // GL_BLEND
      3024: 1,
      // GL_DITHER,
      2960: 1,
      // GL_STENCIL_TEST
      2929: 1,
      // GL_DEPTH_TEST
      3089: 1,
      // GL_SCISSOR_TEST
      32823: 1,
      // GL_POLYGON_OFFSET_FILL
      32926: 1,
      // GL_SAMPLE_ALPHA_TO_COVERAGE
      32928: 1
    };
    var orig_glEnable = _glEnable;
    _glEnable = _emscripten_glEnable = cap => {
      // Clean up the renderer on any change to the rendering state. The optimization of
      // skipping renderer setup is aimed at the case of multiple glDraw* right after each other
      GLImmediate.lastRenderer?.cleanup();
      if (cap == 2912) {
        if (GLEmulation.fogEnabled != true) {
          GLImmediate.currentRenderer = null;
          // Fog parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.fogEnabled = true;
        }
        return;
      } else if ((cap >= 12288) && (cap < 12294)) {
        var clipPlaneId = cap - 12288;
        if (GLEmulation.clipPlaneEnabled[clipPlaneId] != true) {
          GLImmediate.currentRenderer = null;
          // clip plane parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.clipPlaneEnabled[clipPlaneId] = true;
        }
        return;
      } else if ((cap >= 16384) && (cap < 16392)) {
        var lightId = cap - 16384;
        if (GLEmulation.lightEnabled[lightId] != true) {
          GLImmediate.currentRenderer = null;
          // light parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.lightEnabled[lightId] = true;
        }
        return;
      } else if (cap == 2896) {
        if (GLEmulation.lightingEnabled != true) {
          GLImmediate.currentRenderer = null;
          // light parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.lightingEnabled = true;
        }
        return;
      } else if (cap == 3008) {
        if (GLEmulation.alphaTestEnabled != true) {
          GLImmediate.currentRenderer = null;
          // alpha testing is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.alphaTestEnabled = true;
        }
        return;
      } else if (cap == 3553) {
        // XXX not according to spec, and not in desktop GL, but works in some GLES1.x apparently, so support
        // it by forwarding to glEnableClientState
        /* Actually, let's not, for now. (This sounds exceedingly broken)
           * This is in gl_ps_workaround2.c.
          _glEnableClientState(cap);
          */ return;
      } else if (!(cap in validCapabilities)) {
        return;
      }
      orig_glEnable(cap);
    };
    var orig_glDisable = _glDisable;
    _glDisable = _emscripten_glDisable = cap => {
      GLImmediate.lastRenderer?.cleanup();
      if (cap == 2912) {
        if (GLEmulation.fogEnabled != false) {
          GLImmediate.currentRenderer = null;
          // Fog parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.fogEnabled = false;
        }
        return;
      } else if ((cap >= 12288) && (cap < 12294)) {
        var clipPlaneId = cap - 12288;
        if (GLEmulation.clipPlaneEnabled[clipPlaneId] != false) {
          GLImmediate.currentRenderer = null;
          // clip plane parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.clipPlaneEnabled[clipPlaneId] = false;
        }
        return;
      } else if ((cap >= 16384) && (cap < 16392)) {
        var lightId = cap - 16384;
        if (GLEmulation.lightEnabled[lightId] != false) {
          GLImmediate.currentRenderer = null;
          // light parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.lightEnabled[lightId] = false;
        }
        return;
      } else if (cap == 2896) {
        if (GLEmulation.lightingEnabled != false) {
          GLImmediate.currentRenderer = null;
          // light parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.lightingEnabled = false;
        }
        return;
      } else if (cap == 3008) {
        if (GLEmulation.alphaTestEnabled != false) {
          GLImmediate.currentRenderer = null;
          // alpha testing is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.alphaTestEnabled = false;
        }
        return;
      } else if (cap == 3553) {
        // XXX not according to spec, and not in desktop GL, but works in some GLES1.x apparently, so support
        // it by forwarding to glDisableClientState
        /* Actually, let's not, for now. (This sounds exceedingly broken)
           * This is in gl_ps_workaround2.c.
          _glDisableClientState(cap);
          */ return;
      } else if (!(cap in validCapabilities)) {
        return;
      }
      orig_glDisable(cap);
    };
    var orig_glIsEnabled = _glIsEnabled;
    _glIsEnabled = _emscripten_glIsEnabled = cap => {
      if (cap == 2912) {
        return GLEmulation.fogEnabled ? 1 : 0;
      } else if ((cap >= 12288) && (cap < 12294)) {
        var clipPlaneId = cap - 12288;
        return GLEmulation.clipPlaneEnabled[clipPlaneId] ? 1 : 0;
      } else if ((cap >= 16384) && (cap < 16392)) {
        var lightId = cap - 16384;
        return GLEmulation.lightEnabled[lightId] ? 1 : 0;
      } else if (cap == 2896) {
        return GLEmulation.lightingEnabled ? 1 : 0;
      } else if (cap == 3008) {
        return GLEmulation.alphaTestEnabled ? 1 : 0;
      } else if (!(cap in validCapabilities)) {
        return 0;
      }
      return GLctx.isEnabled(cap);
    };
    var orig_glGetBooleanv = _glGetBooleanv;
    _glGetBooleanv = _emscripten_glGetBooleanv = (pname, p) => {
      var attrib = GLEmulation.getAttributeFromCapability(pname);
      if (attrib !== null) {
        var result = GLImmediate.enabledClientAttributes[attrib];
        (growMemViews(), HEAP8)[p] = result === true ? 1 : 0;
        return;
      }
      orig_glGetBooleanv(pname, p);
    };
    var orig_glGetIntegerv = _glGetIntegerv;
    _glGetIntegerv = _emscripten_glGetIntegerv = (pname, params) => {
      switch (pname) {
       case 34018:
        pname = GLctx.MAX_TEXTURE_IMAGE_UNITS;
        break;

       // GL_MAX_TEXTURE_UNITS
        case 35658:
        {
          // GL_MAX_VERTEX_UNIFORM_COMPONENTS_ARB
          var result = GLctx.getParameter(GLctx.MAX_VERTEX_UNIFORM_VECTORS);
          (growMemViews(), HEAP32)[((params) >> 2)] = result * 4;
          // GLES gives num of 4-element vectors, GL wants individual components, so multiply
          return;
        }

       case 35657:
        {
          // GL_MAX_FRAGMENT_UNIFORM_COMPONENTS_ARB
          var result = GLctx.getParameter(GLctx.MAX_FRAGMENT_UNIFORM_VECTORS);
          (growMemViews(), HEAP32)[((params) >> 2)] = result * 4;
          // GLES gives num of 4-element vectors, GL wants individual components, so multiply
          return;
        }

       case 35659:
        {
          // GL_MAX_VARYING_FLOATS_ARB
          var result = GLctx.getParameter(GLctx.MAX_VARYING_VECTORS);
          (growMemViews(), HEAP32)[((params) >> 2)] = result * 4;
          // GLES gives num of 4-element vectors, GL wants individual components, so multiply
          return;
        }

       case 34929:
        pname = GLctx.MAX_COMBINED_TEXTURE_IMAGE_UNITS;
        break;

       // GL_MAX_TEXTURE_COORDS
        case 32890:
        {
          // GL_VERTEX_ARRAY_SIZE
          var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
          (growMemViews(), HEAP32)[((params) >> 2)] = attribute ? attribute.size : 0;
          return;
        }

       case 32891:
        {
          // GL_VERTEX_ARRAY_TYPE
          var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
          (growMemViews(), HEAP32)[((params) >> 2)] = attribute ? attribute.type : 0;
          return;
        }

       case 32892:
        {
          // GL_VERTEX_ARRAY_STRIDE
          var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
          (growMemViews(), HEAP32)[((params) >> 2)] = attribute ? attribute.stride : 0;
          return;
        }

       case 32897:
        {
          // GL_COLOR_ARRAY_SIZE
          var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
          (growMemViews(), HEAP32)[((params) >> 2)] = attribute ? attribute.size : 0;
          return;
        }

       case 32898:
        {
          // GL_COLOR_ARRAY_TYPE
          var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
          (growMemViews(), HEAP32)[((params) >> 2)] = attribute ? attribute.type : 0;
          return;
        }

       case 32899:
        {
          // GL_COLOR_ARRAY_STRIDE
          var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
          (growMemViews(), HEAP32)[((params) >> 2)] = attribute ? attribute.stride : 0;
          return;
        }

       case 32904:
        {
          // GL_TEXTURE_COORD_ARRAY_SIZE
          var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
          (growMemViews(), HEAP32)[((params) >> 2)] = attribute ? attribute.size : 0;
          return;
        }

       case 32905:
        {
          // GL_TEXTURE_COORD_ARRAY_TYPE
          var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
          (growMemViews(), HEAP32)[((params) >> 2)] = attribute ? attribute.type : 0;
          return;
        }

       case 32906:
        {
          // GL_TEXTURE_COORD_ARRAY_STRIDE
          var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
          (growMemViews(), HEAP32)[((params) >> 2)] = attribute ? attribute.stride : 0;
          return;
        }

       case 3378:
        {
          // GL_MAX_CLIP_PLANES
          (growMemViews(), HEAP32)[((params) >> 2)] = GLEmulation.MAX_CLIP_PLANES;
          // all implementations need to support at least 6
          return;
        }

       case 2976:
        {
          // GL_MATRIX_MODE
          (growMemViews(), HEAP32)[((params) >> 2)] = GLImmediate.currentMatrix + 5888;
          return;
        }

       case 3009:
        {
          // GL_ALPHA_TEST_FUNC
          (growMemViews(), HEAP32)[((params) >> 2)] = GLEmulation.alphaTestFunc;
          return;
        }
      }
      orig_glGetIntegerv(pname, params);
    };
    var orig_glGetString = _glGetString;
    _glGetString = _emscripten_glGetString = name_ => {
      if (GL.stringCache[name_]) return GL.stringCache[name_];
      switch (name_) {
       case 7939:
        // Add various extensions that we can support
        var ret = stringToNewUTF8(getEmscriptenSupportedExtensions(GLctx).join(" ") + " GL_EXT_texture_env_combine GL_ARB_texture_env_crossbar GL_ATI_texture_env_combine3 GL_NV_texture_env_combine4 GL_EXT_texture_env_dot3 GL_ARB_multitexture GL_ARB_vertex_buffer_object GL_EXT_framebuffer_object GL_ARB_vertex_program GL_ARB_fragment_program GL_ARB_shading_language_100 GL_ARB_shader_objects GL_ARB_vertex_shader GL_ARB_fragment_shader GL_ARB_texture_cube_map GL_EXT_draw_range_elements" + (GL.currentContext.compressionExt ? " GL_ARB_texture_compression GL_EXT_texture_compression_s3tc" : "") + (GL.currentContext.anisotropicExt ? " GL_EXT_texture_filter_anisotropic" : ""));
        return GL.stringCache[name_] = ret;
      }
      return orig_glGetString(name_);
    };
    // Do some automatic rewriting to work around GLSL differences. Note that this must be done in
    // tandem with the rest of the program, by itself it cannot suffice.
    // Note that we need to remember shader types for this rewriting, saving sources makes it easier to debug.
    GL.shaderInfos = {};
    var orig_glCreateShader = _glCreateShader;
    _glCreateShader = _emscripten_glCreateShader = shaderType => {
      var id = orig_glCreateShader(shaderType);
      GL.shaderInfos[id] = {
        type: shaderType,
        ftransform: false
      };
      return id;
    };
    function ensurePrecision(source) {
      if (!/precision +(low|medium|high)p +float *;/.test(source)) {
        source = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n" + source;
      }
      return source;
    }
    var orig_glShaderSource = _glShaderSource;
    _glShaderSource = _emscripten_glShaderSource = (shader, count, string, length) => {
      var source = GL.getSource(shader, count, string, length);
      // XXX We add attributes and uniforms to shaders. The program can ask for the # of them, and see the
      // ones we generated, potentially confusing it? Perhaps we should hide them.
      if (GL.shaderInfos[shader].type == GLctx.VERTEX_SHADER) {
        // Replace ftransform() with explicit project/modelview transforms, and add position and matrix info.
        var has_pm = source.search(/u_projection/) >= 0;
        var has_mm = source.search(/u_modelView/) >= 0;
        var has_pv = source.search(/a_position/) >= 0;
        var need_pm = 0, need_mm = 0, need_pv = 0;
        var old = source;
        source = source.replace(/ftransform\(\)/g, "(u_projection * u_modelView * a_position)");
        if (old != source) need_pm = need_mm = need_pv = 1;
        old = source;
        source = source.replace(/gl_ProjectionMatrix/g, "u_projection");
        if (old != source) need_pm = 1;
        old = source;
        source = source.replace(/gl_ModelViewMatrixTranspose\[2\]/g, "vec4(u_modelView[0][2], u_modelView[1][2], u_modelView[2][2], u_modelView[3][2])");
        // XXX extremely inefficient
        if (old != source) need_mm = 1;
        old = source;
        source = source.replace(/gl_ModelViewMatrix/g, "u_modelView");
        if (old != source) need_mm = 1;
        old = source;
        source = source.replace(/gl_Vertex/g, "a_position");
        if (old != source) need_pv = 1;
        old = source;
        source = source.replace(/gl_ModelViewProjectionMatrix/g, "(u_projection * u_modelView)");
        if (old != source) need_pm = need_mm = 1;
        if (need_pv && !has_pv) source = "attribute vec4 a_position; \n" + source;
        if (need_mm && !has_mm) source = "uniform mat4 u_modelView; \n" + source;
        if (need_pm && !has_pm) source = "uniform mat4 u_projection; \n" + source;
        GL.shaderInfos[shader].ftransform = need_pm || need_mm || need_pv;
        // we will need to provide the fixed function stuff as attributes and uniforms
        for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
          // XXX To handle both regular texture mapping and cube mapping, we use vec4 for tex coordinates.
          old = source;
          var need_vtc = source.search(`v_texCoord${i}`) == -1;
          source = source.replace(new RegExp(`gl_TexCoord\\[${i}\\]`, "g"), `v_texCoord${i}`).replace(new RegExp(`gl_MultiTexCoord${i}`, "g"), `a_texCoord${i}`);
          if (source != old) {
            source = `attribute vec4 a_texCoord${i}; \n${source}`;
            if (need_vtc) {
              source = `varying vec4 v_texCoord${i};   \n${source}`;
            }
          }
          old = source;
          source = source.replace(new RegExp(`gl_TextureMatrix\\[${i}\\]`, "g"), `u_textureMatrix${i}`);
          if (source != old) {
            source = `uniform mat4 u_textureMatrix${i}; \n${source}`;
          }
        }
        if (source.includes("gl_FrontColor")) {
          source = "varying vec4 v_color; \n" + source.replace(/gl_FrontColor/g, "v_color");
        }
        if (source.includes("gl_Color")) {
          source = "attribute vec4 a_color; \n" + source.replace(/gl_Color/g, "a_color");
        }
        if (source.includes("gl_Normal")) {
          source = "attribute vec3 a_normal; \n" + source.replace(/gl_Normal/g, "a_normal");
        }
        // fog
        if (source.includes("gl_FogFragCoord")) {
          source = "varying float v_fogFragCoord;   \n" + source.replace(/gl_FogFragCoord/g, "v_fogFragCoord");
        }
      } else {
        // Fragment shader
        for (i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
          old = source;
          source = source.replace(new RegExp(`gl_TexCoord\\[${i}\\]`, "g"), `v_texCoord${i}`);
          if (source != old) {
            source = "varying vec4 v_texCoord" + i + ";   \n" + source;
          }
        }
        if (source.includes("gl_Color")) {
          source = "varying vec4 v_color; \n" + source.replace(/gl_Color/g, "v_color");
        }
        if (source.includes("gl_Fog.color")) {
          source = "uniform vec4 u_fogColor;   \n" + source.replace(/gl_Fog.color/g, "u_fogColor");
        }
        if (source.includes("gl_Fog.end")) {
          source = "uniform float u_fogEnd;   \n" + source.replace(/gl_Fog.end/g, "u_fogEnd");
        }
        if (source.includes("gl_Fog.scale")) {
          source = "uniform float u_fogScale;   \n" + source.replace(/gl_Fog.scale/g, "u_fogScale");
        }
        if (source.includes("gl_Fog.density")) {
          source = "uniform float u_fogDensity;   \n" + source.replace(/gl_Fog.density/g, "u_fogDensity");
        }
        if (source.includes("gl_FogFragCoord")) {
          source = "varying float v_fogFragCoord;   \n" + source.replace(/gl_FogFragCoord/g, "v_fogFragCoord");
        }
        source = ensurePrecision(source);
      }
      GLctx.shaderSource(GL.shaders[shader], source);
    };
    var orig_glCompileShader = _glCompileShader;
    _glCompileShader = _emscripten_glCompileShader = shader => {
      GLctx.compileShader(GL.shaders[shader]);
    };
    GL.programShaders = {};
    var orig_glAttachShader = _glAttachShader;
    _glAttachShader = _emscripten_glAttachShader = (program, shader) => {
      GL.programShaders[program] ||= [];
      GL.programShaders[program].push(shader);
      orig_glAttachShader(program, shader);
    };
    var orig_glDetachShader = _glDetachShader;
    _glDetachShader = _emscripten_glDetachShader = (program, shader) => {
      var programShader = GL.programShaders[program];
      if (!programShader) {
        err(`WARNING: _glDetachShader received invalid program: ${program}`);
        return;
      }
      var index = programShader.indexOf(shader);
      programShader.splice(index, 1);
      orig_glDetachShader(program, shader);
    };
    var orig_glUseProgram = _glUseProgram;
    _glUseProgram = _emscripten_glUseProgram = program => {
      if (GL.currProgram != program) {
        GLImmediate.currentRenderer = null;
        // This changes the FFP emulation shader program, need to recompute that.
        GL.currProgram = program;
        GLImmediate.fixedFunctionProgram = 0;
        orig_glUseProgram(program);
      }
    };
    var orig_glDeleteProgram = _glDeleteProgram;
    _glDeleteProgram = _emscripten_glDeleteProgram = program => {
      orig_glDeleteProgram(program);
      if (program == GL.currProgram) {
        GLImmediate.currentRenderer = null;
        // This changes the FFP emulation shader program, need to recompute that.
        GL.currProgram = 0;
      }
    };
    // If attribute 0 was not bound, bind it to 0 for WebGL performance reasons. Track if 0 is free for that.
    var zeroUsedPrograms = {};
    var orig_glBindAttribLocation = _glBindAttribLocation;
    _glBindAttribLocation = _emscripten_glBindAttribLocation = (program, index, name) => {
      if (index == 0) zeroUsedPrograms[program] = true;
      orig_glBindAttribLocation(program, index, name);
    };
    var orig_glLinkProgram = _glLinkProgram;
    _glLinkProgram = _emscripten_glLinkProgram = program => {
      if (!(program in zeroUsedPrograms)) {
        GLctx.bindAttribLocation(GL.programs[program], 0, "a_position");
      }
      orig_glLinkProgram(program);
    };
    var orig_glBindBuffer = _glBindBuffer;
    _glBindBuffer = _emscripten_glBindBuffer = (target, buffer) => {
      orig_glBindBuffer(target, buffer);
      if (target == GLctx.ARRAY_BUFFER) {
        if (GLEmulation.currentVao) {
          GLEmulation.currentVao.arrayBuffer = buffer;
        }
      } else if (target == GLctx.ELEMENT_ARRAY_BUFFER) {
        if (GLEmulation.currentVao) GLEmulation.currentVao.elementArrayBuffer = buffer;
      }
    };
    var orig_glGetFloatv = _glGetFloatv;
    _glGetFloatv = _emscripten_glGetFloatv = (pname, params) => {
      if (pname == 2982) {
        // GL_MODELVIEW_MATRIX
        (growMemViews(), HEAPF32).set(GLImmediate.matrix[0], ((params) >> 2));
      } else if (pname == 2983) {
        // GL_PROJECTION_MATRIX
        (growMemViews(), HEAPF32).set(GLImmediate.matrix[1], ((params) >> 2));
      } else if (pname == 2984) {
        // GL_TEXTURE_MATRIX
        (growMemViews(), HEAPF32).set(GLImmediate.matrix[2 + GLImmediate.clientActiveTexture], ((params) >> 2));
      } else if (pname == 2918) {
        // GL_FOG_COLOR
        (growMemViews(), HEAPF32).set(GLEmulation.fogColor, ((params) >> 2));
      } else if (pname == 2915) {
        // GL_FOG_START
        (growMemViews(), HEAPF32)[((params) >> 2)] = GLEmulation.fogStart;
      } else if (pname == 2916) {
        // GL_FOG_END
        (growMemViews(), HEAPF32)[((params) >> 2)] = GLEmulation.fogEnd;
      } else if (pname == 2914) {
        // GL_FOG_DENSITY
        (growMemViews(), HEAPF32)[((params) >> 2)] = GLEmulation.fogDensity;
      } else if (pname == 2917) {
        // GL_FOG_MODE
        (growMemViews(), HEAPF32)[((params) >> 2)] = GLEmulation.fogMode;
      } else if (pname == 2899) {
        // GL_LIGHT_MODEL_AMBIENT
        (growMemViews(), HEAPF32)[((params) >> 2)] = GLEmulation.lightModelAmbient[0];
        (growMemViews(), HEAPF32)[(((params) + (4)) >> 2)] = GLEmulation.lightModelAmbient[1];
        (growMemViews(), HEAPF32)[(((params) + (8)) >> 2)] = GLEmulation.lightModelAmbient[2];
        (growMemViews(), HEAPF32)[(((params) + (12)) >> 2)] = GLEmulation.lightModelAmbient[3];
      } else if (pname == 3010) {
        // GL_ALPHA_TEST_REF
        (growMemViews(), HEAPF32)[((params) >> 2)] = GLEmulation.alphaTestRef;
      } else {
        orig_glGetFloatv(pname, params);
      }
    };
    var orig_glHint = _glHint;
    _glHint = _emscripten_glHint = (target, mode) => {
      if (target == 34031) {
        // GL_TEXTURE_COMPRESSION_HINT
        return;
      }
      orig_glHint(target, mode);
    };
    var orig_glEnableVertexAttribArray = _glEnableVertexAttribArray;
    _glEnableVertexAttribArray = _emscripten_glEnableVertexAttribArray = index => {
      orig_glEnableVertexAttribArray(index);
      GLEmulation.enabledVertexAttribArrays[index] = 1;
      if (GLEmulation.currentVao) GLEmulation.currentVao.enabledVertexAttribArrays[index] = 1;
    };
    var orig_glDisableVertexAttribArray = _glDisableVertexAttribArray;
    _glDisableVertexAttribArray = _emscripten_glDisableVertexAttribArray = index => {
      orig_glDisableVertexAttribArray(index);
      delete GLEmulation.enabledVertexAttribArrays[index];
      if (GLEmulation.currentVao) delete GLEmulation.currentVao.enabledVertexAttribArrays[index];
    };
    var orig_glVertexAttribPointer = _glVertexAttribPointer;
    _glVertexAttribPointer = _emscripten_glVertexAttribPointer = (index, size, type, normalized, stride, pointer) => {
      orig_glVertexAttribPointer(index, size, type, normalized, stride, pointer);
      if (GLEmulation.currentVao) {
        // TODO: avoid object creation here? likely not hot though
        GLEmulation.currentVao.vertexAttribPointers[index] = [ index, size, type, normalized, stride, pointer ];
      }
    };
  },
  getAttributeFromCapability(cap) {
    var attrib = null;
    switch (cap) {
     case 3553:
     // GL_TEXTURE_2D - XXX not according to spec, and not in desktop GL, but works in some GLES1.x apparently, so support it
      // Fall through:
      case 32888:
      // GL_TEXTURE_COORD_ARRAY
      attrib = GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture;
      break;

     case 32884:
      // GL_VERTEX_ARRAY
      attrib = GLImmediate.VERTEX;
      break;

     case 32885:
      // GL_NORMAL_ARRAY
      attrib = GLImmediate.NORMAL;
      break;

     case 32886:
      // GL_COLOR_ARRAY
      attrib = GLImmediate.COLOR;
      break;
    }
    return attrib;
  }
};

var GLImmediate = {
  MapTreeLib: null,
  spawnMapTreeLib: () => {
    /**
       * A naive implementation of a map backed by an array, and accessed by
       * naive iteration along the array. (hashmap with only one bucket)
       * @constructor
       */ function CNaiveListMap() {
      var list = [];
      this.insert = function CNaiveListMap_insert(key, val) {
        if (this.contains(key | 0)) return false;
        list.push([ key, val ]);
        return true;
      };
      var __contains_i;
      this.contains = function CNaiveListMap_contains(key) {
        for (__contains_i = 0; __contains_i < list.length; ++__contains_i) {
          if (list[__contains_i][0] === key) return true;
        }
        return false;
      };
      var __get_i;
      this.get = function CNaiveListMap_get(key) {
        for (__get_i = 0; __get_i < list.length; ++__get_i) {
          if (list[__get_i][0] === key) return list[__get_i][1];
        }
        return undefined;
      };
    }
    /**
       * A tree of map nodes.
       * Uses `KeyView`s to allow descending the tree without garbage.
       * Example: {
       *   // Create our map object.
       *   var map = new ObjTreeMap();
       *
       *   // Grab the static keyView for the map.
       *   var keyView = map.GetStaticKeyView();
       *
       *   // Let's make a map for:
       *   // root: <undefined>
       *   //   1: <undefined>
       *   //     2: <undefined>
       *   //       5: "Three, sir!"
       *   //       3: "Three!"
       *
       *   // Note how we can chain together `Reset` and `Next` to
       *   // easily descend based on multiple key fragments.
       *   keyView.Reset().Next(1).Next(2).Next(5).Set("Three, sir!");
       *   keyView.Reset().Next(1).Next(2).Next(3).Set("Three!");
       * }
       * @constructor
       */ function CMapTree() {
      /** @constructor */ function CNLNode() {
        var map = new CNaiveListMap;
        this.child = function CNLNode_child(keyFrag) {
          if (!map.contains(keyFrag | 0)) {
            map.insert(keyFrag | 0, new CNLNode);
          }
          return map.get(keyFrag | 0);
        };
        this.value = undefined;
        this.get = function CNLNode_get() {
          return this.value;
        };
        this.set = function CNLNode_set(val) {
          this.value = val;
        };
      }
      /** @constructor */ function CKeyView(root) {
        var cur;
        this.reset = function CKeyView_reset() {
          cur = root;
          return this;
        };
        this.reset();
        this.next = function CKeyView_next(keyFrag) {
          cur = cur.child(keyFrag);
          return this;
        };
        this.get = function CKeyView_get() {
          return cur.get();
        };
        this.set = function CKeyView_set(val) {
          cur.set(val);
        };
      }
      var root;
      var staticKeyView;
      this.createKeyView = function CNLNode_createKeyView() {
        return new CKeyView(root);
      };
      this.clear = function CNLNode_clear() {
        root = new CNLNode;
        staticKeyView = this.createKeyView();
      };
      this.clear();
      this.getStaticKeyView = function CNLNode_getStaticKeyView() {
        staticKeyView.reset();
        return staticKeyView;
      };
    }
    // Exports:
    return {
      create: () => new CMapTree
    };
  },
  TexEnvJIT: null,
  spawnTexEnvJIT: () => {
    // GL defs:
    var GL_TEXTURE0 = 33984;
    var GL_TEXTURE_1D = 3552;
    var GL_TEXTURE_2D = 3553;
    var GL_TEXTURE_3D = 32879;
    var GL_TEXTURE_CUBE_MAP = 34067;
    var GL_TEXTURE_ENV = 8960;
    var GL_TEXTURE_ENV_MODE = 8704;
    var GL_TEXTURE_ENV_COLOR = 8705;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 34069;
    var GL_TEXTURE_CUBE_MAP_NEGATIVE_X = 34070;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_Y = 34071;
    var GL_TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_Z = 34073;
    var GL_TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074;
    var GL_SRC0_RGB = 34176;
    var GL_SRC1_RGB = 34177;
    var GL_SRC2_RGB = 34178;
    var GL_SRC0_ALPHA = 34184;
    var GL_SRC1_ALPHA = 34185;
    var GL_SRC2_ALPHA = 34186;
    var GL_OPERAND0_RGB = 34192;
    var GL_OPERAND1_RGB = 34193;
    var GL_OPERAND2_RGB = 34194;
    var GL_OPERAND0_ALPHA = 34200;
    var GL_OPERAND1_ALPHA = 34201;
    var GL_OPERAND2_ALPHA = 34202;
    var GL_COMBINE_RGB = 34161;
    var GL_COMBINE_ALPHA = 34162;
    var GL_RGB_SCALE = 34163;
    var GL_ALPHA_SCALE = 3356;
    // env.mode
    var GL_ADD = 260;
    var GL_BLEND = 3042;
    var GL_REPLACE = 7681;
    var GL_MODULATE = 8448;
    var GL_DECAL = 8449;
    var GL_COMBINE = 34160;
    // env.color/alphaCombiner
    //var GL_ADD         = 0x104;
    //var GL_REPLACE     = 0x1E01;
    //var GL_MODULATE    = 0x2100;
    var GL_SUBTRACT = 34023;
    var GL_INTERPOLATE = 34165;
    // env.color/alphaSrc
    var GL_TEXTURE = 5890;
    var GL_CONSTANT = 34166;
    var GL_PRIMARY_COLOR = 34167;
    var GL_PREVIOUS = 34168;
    // env.color/alphaOp
    var GL_SRC_COLOR = 768;
    var GL_ONE_MINUS_SRC_COLOR = 769;
    var GL_SRC_ALPHA = 770;
    var GL_ONE_MINUS_SRC_ALPHA = 771;
    var GL_RGB = 6407;
    var GL_RGBA = 6408;
    // Our defs:
    var TEXENVJIT_NAMESPACE_PREFIX = "tej_";
    // Not actually constant, as they can be changed between JIT passes:
    var TEX_UNIT_UNIFORM_PREFIX = "uTexUnit";
    var TEX_COORD_VARYING_PREFIX = "vTexCoord";
    var PRIM_COLOR_VARYING = "vPrimColor";
    var TEX_MATRIX_UNIFORM_PREFIX = "uTexMatrix";
    // Static vars:
    var s_texUnits = null;
    //[];
    var s_activeTexture = 0;
    var s_requiredTexUnitsForPass = [];
    // Static funcs:
    function abort_noSupport(info) {
      abort("[TexEnvJIT] ABORT: No support: " + info);
    }
    function abort_sanity(info) {
      abort("[TexEnvJIT] ABORT: Sanity failure: " + info);
    }
    function genTexUnitSampleExpr(texUnitID) {
      var texUnit = s_texUnits[texUnitID];
      var texType = texUnit.getTexType();
      var func = null;
      switch (texType) {
       case GL_TEXTURE_1D:
        func = "texture2D";
        break;

       case GL_TEXTURE_2D:
        func = "texture2D";
        break;

       case GL_TEXTURE_3D:
        return abort_noSupport("No support for 3D textures.");

       case GL_TEXTURE_CUBE_MAP:
        func = "textureCube";
        break;

       default:
        return abort_sanity(`Unknown texType: ${ptrToString(texType)}`);
      }
      var texCoordExpr = TEX_COORD_VARYING_PREFIX + texUnitID;
      if (TEX_MATRIX_UNIFORM_PREFIX != null) {
        texCoordExpr = `(${TEX_MATRIX_UNIFORM_PREFIX}${texUnitID} * ${texCoordExpr})`;
      }
      return `${func}(${TEX_UNIT_UNIFORM_PREFIX}${texUnitID}, ${texCoordExpr}.xy)`;
    }
    function getTypeFromCombineOp(op) {
      switch (op) {
       case GL_SRC_COLOR:
       case GL_ONE_MINUS_SRC_COLOR:
        return "vec3";

       case GL_SRC_ALPHA:
       case GL_ONE_MINUS_SRC_ALPHA:
        return "float";
      }
      return abort_noSupport("Unsupported combiner op: " + ptrToString(op));
    }
    function getCurTexUnit() {
      return s_texUnits[s_activeTexture];
    }
    function genCombinerSourceExpr(texUnitID, constantExpr, previousVar, src, op) {
      var srcExpr = null;
      switch (src) {
       case GL_TEXTURE:
        srcExpr = genTexUnitSampleExpr(texUnitID);
        break;

       case GL_CONSTANT:
        srcExpr = constantExpr;
        break;

       case GL_PRIMARY_COLOR:
        srcExpr = PRIM_COLOR_VARYING;
        break;

       case GL_PREVIOUS:
        srcExpr = previousVar;
        break;

       default:
        return abort_noSupport("Unsupported combiner src: " + ptrToString(src));
      }
      var expr = null;
      switch (op) {
       case GL_SRC_COLOR:
        expr = srcExpr + ".rgb";
        break;

       case GL_ONE_MINUS_SRC_COLOR:
        expr = `(vec3(1.0) - ${srcExpr}.rgb)`;
        break;

       case GL_SRC_ALPHA:
        expr = srcExpr + ".a";
        break;

       case GL_ONE_MINUS_SRC_ALPHA:
        expr = `(1.0 - ${srcExpr}.a)`;
        break;

       default:
        return abort_noSupport("Unsupported combiner op: " + ptrToString(op));
      }
      return expr;
    }
    function valToFloatLiteral(val) {
      if (val == Math.round(val)) return val + ".0";
      return val;
    }
    // Classes:
    /** @constructor */ function CTexEnv() {
      this.mode = GL_MODULATE;
      this.colorCombiner = GL_MODULATE;
      this.alphaCombiner = GL_MODULATE;
      this.colorScale = 1;
      this.alphaScale = 1;
      this.envColor = [ 0, 0, 0, 0 ];
      this.colorSrc = [ GL_TEXTURE, GL_PREVIOUS, GL_CONSTANT ];
      this.alphaSrc = [ GL_TEXTURE, GL_PREVIOUS, GL_CONSTANT ];
      this.colorOp = [ GL_SRC_COLOR, GL_SRC_COLOR, GL_SRC_ALPHA ];
      this.alphaOp = [ GL_SRC_ALPHA, GL_SRC_ALPHA, GL_SRC_ALPHA ];
      // Map GLenums to small values to efficiently pack the enums to bits for tighter access.
      this.traverseKey = {
        // mode
        7681: 0,
        8448: 1,
        260: 2,
        3042: 3,
        8449: 4,
        34160: 5,
        // additional color and alpha combiners
        34023: 3,
        34165: 4,
        // color and alpha src
        5890: 0,
        34166: 1,
        34167: 2,
        34168: 3,
        // color and alpha op
        768: 0,
        769: 1,
        770: 2,
        771: 3
      };
      // The tuple (key0,key1,key2) uniquely identifies the state of the variables in CTexEnv.
      // -1 on key0 denotes 'the whole cached key is dirty'
      this.key0 = -1;
      this.key1 = 0;
      this.key2 = 0;
      this.computeKey0 = function() {
        var k = this.traverseKey;
        var key = k[this.mode] * 1638400;
        // 6 distinct values.
        key += k[this.colorCombiner] * 327680;
        // 5 distinct values.
        key += k[this.alphaCombiner] * 65536;
        // 5 distinct values.
        // The above three fields have 6*5*5=150 distinct values -> 8 bits.
        key += (this.colorScale - 1) * 16384;
        // 10 bits used.
        key += (this.alphaScale - 1) * 4096;
        // 12 bits used.
        key += k[this.colorSrc[0]] * 1024;
        // 14
        key += k[this.colorSrc[1]] * 256;
        // 16
        key += k[this.colorSrc[2]] * 64;
        // 18
        key += k[this.alphaSrc[0]] * 16;
        // 20
        key += k[this.alphaSrc[1]] * 4;
        // 22
        key += k[this.alphaSrc[2]];
        // 24 bits used total.
        return key;
      };
      this.computeKey1 = function() {
        var k = this.traverseKey;
        var key = k[this.colorOp[0]] * 4096;
        key += k[this.colorOp[1]] * 1024;
        key += k[this.colorOp[2]] * 256;
        key += k[this.alphaOp[0]] * 16;
        key += k[this.alphaOp[1]] * 4;
        key += k[this.alphaOp[2]];
        return key;
      };
      // TODO: remove this. The color should not be part of the key!
      this.computeKey2 = function() {
        return this.envColor[0] * 16777216 + this.envColor[1] * 65536 + this.envColor[2] * 256 + 1 + this.envColor[3];
      };
      this.recomputeKey = function() {
        this.key0 = this.computeKey0();
        this.key1 = this.computeKey1();
        this.key2 = this.computeKey2();
      };
      this.invalidateKey = function() {
        this.key0 = -1;
        // The key of this texture unit must be recomputed when rendering the next time.
        GLImmediate.currentRenderer = null;
      };
    }
    /** @constructor */ function CTexUnit() {
      this.env = new CTexEnv;
      this.enabled_tex1D = false;
      this.enabled_tex2D = false;
      this.enabled_tex3D = false;
      this.enabled_texCube = false;
      this.texTypesEnabled = 0;
      // A bitfield combination of the four flags above, used for fast access to operations.
      this.traverseState = function CTexUnit_traverseState(keyView) {
        if (this.texTypesEnabled) {
          if (this.env.key0 == -1) {
            this.env.recomputeKey();
          }
          keyView.next(this.texTypesEnabled | (this.env.key0 << 4));
          keyView.next(this.env.key1);
          keyView.next(this.env.key2);
        } else {
          // For correctness, must traverse a zero value, theoretically a subsequent integer key could collide with this value otherwise.
          keyView.next(0);
        }
      };
    }
    // Class impls:
    CTexUnit.prototype.enabled = function CTexUnit_enabled() {
      return this.texTypesEnabled;
    };
    CTexUnit.prototype.genPassLines = function CTexUnit_genPassLines(passOutputVar, passInputVar, texUnitID) {
      if (!this.enabled()) {
        return [ `vec4 ${passOutputVar} = ${passInputVar};` ];
      }
      var lines = this.env.genPassLines(passOutputVar, passInputVar, texUnitID).join("\n");
      var texLoadLines = "";
      var texLoadRegex = /(texture.*?\(.*?\))/g;
      var loadCounter = 0;
      var load;
      // As an optimization, merge duplicate identical texture loads to one var.
      while (load = texLoadRegex.exec(lines)) {
        var texLoadExpr = load[1];
        var secondOccurrence = lines.slice(load.index + 1).indexOf(texLoadExpr);
        if (secondOccurrence != -1) {
          // And also has a second occurrence of same load expression..
          // Create new var to store the common load.
          var prefix = `${TEXENVJIT_NAMESPACE_PREFIX}env${texUnitID}_`;
          var texLoadVar = `${prefix}texload${loadCounter++}`;
          var texLoadLine = `vec4 ${texLoadVar} = ${texLoadExpr};\n`;
          texLoadLines += texLoadLine + "\n";
          // Store the generated texture load statements in a temp string to not confuse regex search in progress.
          lines = lines.split(texLoadExpr).join(texLoadVar);
          // Reset regex search, since we modified the string.
          texLoadRegex = /(texture.*\(.*\))/g;
        }
      }
      return [ texLoadLines + lines ];
    };
    CTexUnit.prototype.getTexType = function CTexUnit_getTexType() {
      if (this.enabled_texCube) {
        return GL_TEXTURE_CUBE_MAP;
      } else if (this.enabled_tex3D) {
        return GL_TEXTURE_3D;
      } else if (this.enabled_tex2D) {
        return GL_TEXTURE_2D;
      } else if (this.enabled_tex1D) {
        return GL_TEXTURE_1D;
      }
      return 0;
    };
    CTexEnv.prototype.genPassLines = function CTexEnv_genPassLines(passOutputVar, passInputVar, texUnitID) {
      switch (this.mode) {
       case GL_REPLACE:
        {
          /* RGB:
             * Cv = Cs
             * Av = Ap // Note how this is different, and that we'll
             *            need to track the bound texture internalFormat
             *            to get this right.
             *
             * RGBA:
             * Cv = Cs
             * Av = As
             */ return [ `vec4 ${passOutputVar} = ${genTexUnitSampleExpr(texUnitID)};` ];
        }

       case GL_ADD:
        {
          /* RGBA:
             * Cv = Cp + Cs
             * Av = ApAs
             */ var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + texUnitID + "_";
          var texVar = prefix + "tex";
          var colorVar = prefix + "color";
          var alphaVar = prefix + "alpha";
          return [ "vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";", "vec3 " + colorVar + " = " + passInputVar + ".rgb + " + texVar + ".rgb;", "float " + alphaVar + " = " + passInputVar + ".a * " + texVar + ".a;", "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");" ];
        }

       case GL_MODULATE:
        {
          /* RGBA:
             * Cv = CpCs
             * Av = ApAs
             */ var line = [ "vec4 " + passOutputVar, " = ", passInputVar, " * ", genTexUnitSampleExpr(texUnitID), ";" ];
          return [ line.join("") ];
        }

       case GL_DECAL:
        {
          /* RGBA:
             * Cv = Cp(1 - As) + CsAs
             * Av = Ap
             */ var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + texUnitID + "_";
          var texVar = prefix + "tex";
          var colorVar = prefix + "color";
          var alphaVar = prefix + "alpha";
          return [ "vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";", [ "vec3 " + colorVar + " = ", passInputVar + ".rgb * (1.0 - " + texVar + ".a)", " + ", texVar + ".rgb * " + texVar + ".a", ";" ].join(""), "float " + alphaVar + " = " + passInputVar + ".a;", "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");" ];
        }

       case GL_BLEND:
        {
          /* RGBA:
             * Cv = Cp(1 - Cs) + CcCs
             * Av = As
             */ var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + texUnitID + "_";
          var texVar = prefix + "tex";
          var colorVar = prefix + "color";
          var alphaVar = prefix + "alpha";
          return [ "vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";", [ "vec3 " + colorVar + " = ", passInputVar + ".rgb * (1.0 - " + texVar + ".rgb)", " + ", PRIM_COLOR_VARYING + ".rgb * " + texVar + ".rgb", ";" ].join(""), "float " + alphaVar + " = " + texVar + ".a;", "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");" ];
        }

       case GL_COMBINE:
        {
          var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + texUnitID + "_";
          var colorVar = prefix + "color";
          var alphaVar = prefix + "alpha";
          var colorLines = this.genCombinerLines(true, colorVar, passInputVar, texUnitID, this.colorCombiner, this.colorSrc, this.colorOp);
          var alphaLines = this.genCombinerLines(false, alphaVar, passInputVar, texUnitID, this.alphaCombiner, this.alphaSrc, this.alphaOp);
          // Generate scale, but avoid generating an identity op that multiplies by one.
          var scaledColor = (this.colorScale == 1) ? colorVar : (colorVar + " * " + valToFloatLiteral(this.colorScale));
          var scaledAlpha = (this.alphaScale == 1) ? alphaVar : (alphaVar + " * " + valToFloatLiteral(this.alphaScale));
          var line = [ "vec4 " + passOutputVar, " = ", "vec4(", scaledColor, ", ", scaledAlpha, ")", ";" ].join("");
          return [].concat(colorLines, alphaLines, [ line ]);
        }
      }
      return abort_noSupport("Unsupported TexEnv mode: " + ptrToString(this.mode));
    };
    CTexEnv.prototype.genCombinerLines = function CTexEnv_getCombinerLines(isColor, outputVar, passInputVar, texUnitID, combiner, srcArr, opArr) {
      var argsNeeded = null;
      switch (combiner) {
       case GL_REPLACE:
        argsNeeded = 1;
        break;

       case GL_MODULATE:
       case GL_ADD:
       case GL_SUBTRACT:
        argsNeeded = 2;
        break;

       case GL_INTERPOLATE:
        argsNeeded = 3;
        break;

       default:
        return abort_noSupport("Unsupported combiner: " + ptrToString(combiner));
      }
      var constantExpr = [ "vec4(", valToFloatLiteral(this.envColor[0]), ", ", valToFloatLiteral(this.envColor[1]), ", ", valToFloatLiteral(this.envColor[2]), ", ", valToFloatLiteral(this.envColor[3]), ")" ].join("");
      var src0Expr = (argsNeeded >= 1) ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[0], opArr[0]) : null;
      var src1Expr = (argsNeeded >= 2) ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[1], opArr[1]) : null;
      var src2Expr = (argsNeeded >= 3) ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[2], opArr[2]) : null;
      var outputType = isColor ? "vec3" : "float";
      var lines = null;
      switch (combiner) {
       case GL_REPLACE:
        {
          lines = [ `${outputType} ${outputVar} = ${src0Expr};` ];
          break;
        }

       case GL_MODULATE:
        {
          lines = [ `${outputType} ${outputVar} = ${src0Expr} * ${src1Expr};` ];
          break;
        }

       case GL_ADD:
        {
          lines = [ `${outputType} ${outputVar} = ${src0Expr} + ${src1Expr};` ];
          break;
        }

       case GL_SUBTRACT:
        {
          lines = [ `${outputType} ${outputVar} = ${src0Expr} - ${src1Expr};` ];
          break;
        }

       case GL_INTERPOLATE:
        {
          var prefix = `${TEXENVJIT_NAMESPACE_PREFIX}env${texUnitID}_`;
          var arg2Var = `${prefix}colorSrc2`;
          var arg2Type = getTypeFromCombineOp(this.colorOp[2]);
          lines = [ `${arg2Type} ${arg2Var} = ${src2Expr};`, `${outputType} ${outputVar} = ${src0Expr} * ${arg2Var} + ${src1Expr} * (1.0 - ${arg2Var});` ];
          break;
        }

       default:
        return abort_sanity("Unmatched TexEnv.colorCombiner?");
      }
      return lines;
    };
    return {
      // Exports:
      init: (gl, specifiedMaxTextureImageUnits) => {
        var maxTexUnits = 0;
        if (specifiedMaxTextureImageUnits) {
          maxTexUnits = specifiedMaxTextureImageUnits;
        } else if (gl) {
          maxTexUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        }
        s_texUnits = [];
        for (var i = 0; i < maxTexUnits; i++) {
          s_texUnits.push(new CTexUnit);
        }
      },
      setGLSLVars: (uTexUnitPrefix, vTexCoordPrefix, vPrimColor, uTexMatrixPrefix) => {
        TEX_UNIT_UNIFORM_PREFIX = uTexUnitPrefix;
        TEX_COORD_VARYING_PREFIX = vTexCoordPrefix;
        PRIM_COLOR_VARYING = vPrimColor;
        TEX_MATRIX_UNIFORM_PREFIX = uTexMatrixPrefix;
      },
      genAllPassLines: (resultDest, indentSize = 0) => {
        s_requiredTexUnitsForPass.length = 0;
        // Clear the list.
        var lines = [];
        var lastPassVar = PRIM_COLOR_VARYING;
        for (var i = 0; i < s_texUnits.length; i++) {
          if (!s_texUnits[i].enabled()) continue;
          s_requiredTexUnitsForPass.push(i);
          var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + i + "_";
          var passOutputVar = prefix + "result";
          var newLines = s_texUnits[i].genPassLines(passOutputVar, lastPassVar, i);
          lines = lines.concat(newLines, [ "" ]);
          lastPassVar = passOutputVar;
        }
        lines.push(resultDest + " = " + lastPassVar + ";");
        var indent = "";
        for (var i = 0; i < indentSize; i++) indent += " ";
        var output = indent + lines.join("\n" + indent);
        return output;
      },
      getUsedTexUnitList: () => s_requiredTexUnitsForPass,
      getActiveTexture: () => s_activeTexture,
      traverseState: keyView => {
        for (var texUnit of s_texUnits) {
          texUnit.traverseState(keyView);
        }
      },
      getTexUnitType: texUnitID => s_texUnits[texUnitID].getTexType(),
      // Hooks:
      hook_activeTexture: texture => {
        s_activeTexture = texture - GL_TEXTURE0;
        // Check if the current matrix mode is GL_TEXTURE.
        if (GLImmediate.currentMatrix >= 2) {
          // Switch to the corresponding texture matrix stack.
          GLImmediate.currentMatrix = 2 + s_activeTexture;
        }
      },
      hook_enable: cap => {
        var cur = getCurTexUnit();
        switch (cap) {
         case GL_TEXTURE_1D:
          if (!cur.enabled_tex1D) {
            GLImmediate.currentRenderer = null;
            // Renderer state changed, and must be recreated or looked up again.
            cur.enabled_tex1D = true;
            cur.texTypesEnabled |= 1;
          }
          break;

         case GL_TEXTURE_2D:
          if (!cur.enabled_tex2D) {
            GLImmediate.currentRenderer = null;
            cur.enabled_tex2D = true;
            cur.texTypesEnabled |= 2;
          }
          break;

         case GL_TEXTURE_3D:
          if (!cur.enabled_tex3D) {
            GLImmediate.currentRenderer = null;
            cur.enabled_tex3D = true;
            cur.texTypesEnabled |= 4;
          }
          break;

         case GL_TEXTURE_CUBE_MAP:
          if (!cur.enabled_texCube) {
            GLImmediate.currentRenderer = null;
            cur.enabled_texCube = true;
            cur.texTypesEnabled |= 8;
          }
          break;
        }
      },
      hook_disable: cap => {
        var cur = getCurTexUnit();
        switch (cap) {
         case GL_TEXTURE_1D:
          if (cur.enabled_tex1D) {
            GLImmediate.currentRenderer = null;
            // Renderer state changed, and must be recreated or looked up again.
            cur.enabled_tex1D = false;
            cur.texTypesEnabled &= ~1;
          }
          break;

         case GL_TEXTURE_2D:
          if (cur.enabled_tex2D) {
            GLImmediate.currentRenderer = null;
            cur.enabled_tex2D = false;
            cur.texTypesEnabled &= ~2;
          }
          break;

         case GL_TEXTURE_3D:
          if (cur.enabled_tex3D) {
            GLImmediate.currentRenderer = null;
            cur.enabled_tex3D = false;
            cur.texTypesEnabled &= ~4;
          }
          break;

         case GL_TEXTURE_CUBE_MAP:
          if (cur.enabled_texCube) {
            GLImmediate.currentRenderer = null;
            cur.enabled_texCube = false;
            cur.texTypesEnabled &= ~8;
          }
          break;
        }
      },
      hook_texEnvf(target, pname, param) {
        if (target != GL_TEXTURE_ENV) return;
        var env = getCurTexUnit().env;
        switch (pname) {
         case GL_RGB_SCALE:
          if (env.colorScale != param) {
            env.invalidateKey();
            // We changed FFP emulation renderer state.
            env.colorScale = param;
          }
          break;

         case GL_ALPHA_SCALE:
          if (env.alphaScale != param) {
            env.invalidateKey();
            env.alphaScale = param;
          }
          break;

         default:
          err("WARNING: Unhandled `pname` in call to `glTexEnvf`.");
        }
      },
      hook_texEnvi(target, pname, param) {
        if (target != GL_TEXTURE_ENV) return;
        var env = getCurTexUnit().env;
        switch (pname) {
         case GL_TEXTURE_ENV_MODE:
          if (env.mode != param) {
            env.invalidateKey();
            // We changed FFP emulation renderer state.
            env.mode = param;
          }
          break;

         case GL_COMBINE_RGB:
          if (env.colorCombiner != param) {
            env.invalidateKey();
            env.colorCombiner = param;
          }
          break;

         case GL_COMBINE_ALPHA:
          if (env.alphaCombiner != param) {
            env.invalidateKey();
            env.alphaCombiner = param;
          }
          break;

         case GL_SRC0_RGB:
          if (env.colorSrc[0] != param) {
            env.invalidateKey();
            env.colorSrc[0] = param;
          }
          break;

         case GL_SRC1_RGB:
          if (env.colorSrc[1] != param) {
            env.invalidateKey();
            env.colorSrc[1] = param;
          }
          break;

         case GL_SRC2_RGB:
          if (env.colorSrc[2] != param) {
            env.invalidateKey();
            env.colorSrc[2] = param;
          }
          break;

         case GL_SRC0_ALPHA:
          if (env.alphaSrc[0] != param) {
            env.invalidateKey();
            env.alphaSrc[0] = param;
          }
          break;

         case GL_SRC1_ALPHA:
          if (env.alphaSrc[1] != param) {
            env.invalidateKey();
            env.alphaSrc[1] = param;
          }
          break;

         case GL_SRC2_ALPHA:
          if (env.alphaSrc[2] != param) {
            env.invalidateKey();
            env.alphaSrc[2] = param;
          }
          break;

         case GL_OPERAND0_RGB:
          if (env.colorOp[0] != param) {
            env.invalidateKey();
            env.colorOp[0] = param;
          }
          break;

         case GL_OPERAND1_RGB:
          if (env.colorOp[1] != param) {
            env.invalidateKey();
            env.colorOp[1] = param;
          }
          break;

         case GL_OPERAND2_RGB:
          if (env.colorOp[2] != param) {
            env.invalidateKey();
            env.colorOp[2] = param;
          }
          break;

         case GL_OPERAND0_ALPHA:
          if (env.alphaOp[0] != param) {
            env.invalidateKey();
            env.alphaOp[0] = param;
          }
          break;

         case GL_OPERAND1_ALPHA:
          if (env.alphaOp[1] != param) {
            env.invalidateKey();
            env.alphaOp[1] = param;
          }
          break;

         case GL_OPERAND2_ALPHA:
          if (env.alphaOp[2] != param) {
            env.invalidateKey();
            env.alphaOp[2] = param;
          }
          break;

         case GL_RGB_SCALE:
          if (env.colorScale != param) {
            env.invalidateKey();
            env.colorScale = param;
          }
          break;

         case GL_ALPHA_SCALE:
          if (env.alphaScale != param) {
            env.invalidateKey();
            env.alphaScale = param;
          }
          break;

         default:
          err("WARNING: Unhandled `pname` in call to `glTexEnvi`.");
        }
      },
      hook_texEnvfv(target, pname, params) {
        if (target != GL_TEXTURE_ENV) return;
        var env = getCurTexUnit().env;
        switch (pname) {
         case GL_TEXTURE_ENV_COLOR:
          {
            for (var i = 0; i < 4; i++) {
              var param = (growMemViews(), HEAPF32)[(((params) + (i * 4)) >> 2)];
              if (env.envColor[i] != param) {
                env.invalidateKey();
                // We changed FFP emulation renderer state.
                env.envColor[i] = param;
              }
            }
            break;
          }

         default:
          err("WARNING: Unhandled `pname` in call to `glTexEnvfv`.");
        }
      },
      hook_getTexEnviv(target, pname, param) {
        if (target != GL_TEXTURE_ENV) return;
        var env = getCurTexUnit().env;
        switch (pname) {
         case GL_TEXTURE_ENV_MODE:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.mode;
          return;

         case GL_TEXTURE_ENV_COLOR:
          (growMemViews(), HEAP32)[((param) >> 2)] = Math.max(Math.min(env.envColor[0] * 255, 255, -255));
          (growMemViews(), HEAP32)[(((param) + (1)) >> 2)] = Math.max(Math.min(env.envColor[1] * 255, 255, -255));
          (growMemViews(), HEAP32)[(((param) + (2)) >> 2)] = Math.max(Math.min(env.envColor[2] * 255, 255, -255));
          (growMemViews(), HEAP32)[(((param) + (3)) >> 2)] = Math.max(Math.min(env.envColor[3] * 255, 255, -255));
          return;

         case GL_COMBINE_RGB:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.colorCombiner;
          return;

         case GL_COMBINE_ALPHA:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.alphaCombiner;
          return;

         case GL_SRC0_RGB:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.colorSrc[0];
          return;

         case GL_SRC1_RGB:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.colorSrc[1];
          return;

         case GL_SRC2_RGB:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.colorSrc[2];
          return;

         case GL_SRC0_ALPHA:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.alphaSrc[0];
          return;

         case GL_SRC1_ALPHA:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.alphaSrc[1];
          return;

         case GL_SRC2_ALPHA:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.alphaSrc[2];
          return;

         case GL_OPERAND0_RGB:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.colorOp[0];
          return;

         case GL_OPERAND1_RGB:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.colorOp[1];
          return;

         case GL_OPERAND2_RGB:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.colorOp[2];
          return;

         case GL_OPERAND0_ALPHA:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.alphaOp[0];
          return;

         case GL_OPERAND1_ALPHA:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.alphaOp[1];
          return;

         case GL_OPERAND2_ALPHA:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.alphaOp[2];
          return;

         case GL_RGB_SCALE:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.colorScale;
          return;

         case GL_ALPHA_SCALE:
          (growMemViews(), HEAP32)[((param) >> 2)] = env.alphaScale;
          return;

         default:
          err("WARNING: Unhandled `pname` in call to `glGetTexEnvi`.");
        }
      },
      hook_getTexEnvfv: (target, pname, param) => {
        if (target != GL_TEXTURE_ENV) return;
        var env = getCurTexUnit().env;
        switch (pname) {
         case GL_TEXTURE_ENV_COLOR:
          (growMemViews(), HEAPF32)[((param) >> 2)] = env.envColor[0];
          (growMemViews(), HEAPF32)[(((param) + (4)) >> 2)] = env.envColor[1];
          (growMemViews(), HEAPF32)[(((param) + (8)) >> 2)] = env.envColor[2];
          (growMemViews(), HEAPF32)[(((param) + (12)) >> 2)] = env.envColor[3];
          return;
        }
      }
    };
  },
  vertexData: null,
  vertexDataU8: null,
  tempData: null,
  indexData: null,
  vertexCounter: 0,
  mode: -1,
  rendererCache: null,
  rendererComponents: [],
  rendererComponentPointer: 0,
  lastRenderer: null,
  lastArrayBuffer: null,
  lastProgram: null,
  lastStride: -1,
  matrix: [],
  matrixStack: [],
  currentMatrix: 0,
  tempMatrix: null,
  matricesModified: false,
  useTextureMatrix: false,
  VERTEX: 0,
  NORMAL: 1,
  COLOR: 2,
  TEXTURE0: 3,
  NUM_ATTRIBUTES: -1,
  MAX_TEXTURES: -1,
  totalEnabledClientAttributes: 0,
  enabledClientAttributes: [ 0, 0 ],
  clientAttributes: [],
  liveClientAttributes: [],
  currentRenderer: null,
  modifiedClientAttributes: false,
  clientActiveTexture: 0,
  clientColor: null,
  usedTexUnitList: [],
  fixedFunctionProgram: null,
  setClientAttribute(name, size, type, stride, pointer) {
    var attrib = GLImmediate.clientAttributes[name];
    if (!attrib) {
      for (var i = 0; i <= name; i++) {
        // keep flat
        GLImmediate.clientAttributes[i] ||= {
          name,
          size,
          type,
          stride,
          pointer,
          offset: 0
        };
      }
    } else {
      attrib.name = name;
      attrib.size = size;
      attrib.type = type;
      attrib.stride = stride;
      attrib.pointer = pointer;
      attrib.offset = 0;
    }
    GLImmediate.modifiedClientAttributes = true;
  },
  addRendererComponent(name, size, type) {
    if (!GLImmediate.rendererComponents[name]) {
      GLImmediate.rendererComponents[name] = 1;
      GLImmediate.enabledClientAttributes[name] = true;
      GLImmediate.setClientAttribute(name, size, type, 0, GLImmediate.rendererComponentPointer);
      GLImmediate.rendererComponentPointer += size * GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
    } else {
      GLImmediate.rendererComponents[name]++;
    }
  },
  disableBeginEndClientAttributes() {
    for (var i = 0; i < GLImmediate.NUM_ATTRIBUTES; i++) {
      if (GLImmediate.rendererComponents[i]) GLImmediate.enabledClientAttributes[i] = false;
    }
  },
  getRenderer() {
    // If no FFP state has changed that would have forced to re-evaluate which FFP emulation shader to use,
    // we have the currently used renderer in cache, and can immediately return that.
    if (GLImmediate.currentRenderer) {
      return GLImmediate.currentRenderer;
    }
    // return a renderer object given the liveClientAttributes
    // we maintain a cache of renderers, optimized to not generate garbage
    var attributes = GLImmediate.liveClientAttributes;
    var cacheMap = GLImmediate.rendererCache;
    var keyView = cacheMap.getStaticKeyView().reset();
    // By attrib state:
    var enabledAttributesKey = 0;
    for (var attr of attributes) {
      enabledAttributesKey |= 1 << attr.name;
    }
    // To prevent using more than 31 bits add another level to the maptree
    // and reset the enabledAttributesKey for the next glemulation state bits
    keyView.next(enabledAttributesKey);
    enabledAttributesKey = 0;
    // By fog state:
    var fogParam = 0;
    if (GLEmulation.fogEnabled) {
      switch (GLEmulation.fogMode) {
       case 2049:
        // GL_EXP2
        fogParam = 1;
        break;

       case 9729:
        // GL_LINEAR
        fogParam = 2;
        break;

       default:
        // default to GL_EXP
        fogParam = 3;
        break;
      }
    }
    enabledAttributesKey = (enabledAttributesKey << 2) | fogParam;
    // By clip plane mode
    for (var clipPlaneId = 0; clipPlaneId < GLEmulation.MAX_CLIP_PLANES; clipPlaneId++) {
      enabledAttributesKey = (enabledAttributesKey << 1) | GLEmulation.clipPlaneEnabled[clipPlaneId];
    }
    // By lighting mode and enabled lights
    enabledAttributesKey = (enabledAttributesKey << 1) | GLEmulation.lightingEnabled;
    for (var lightId = 0; lightId < GLEmulation.MAX_LIGHTS; lightId++) {
      enabledAttributesKey = (enabledAttributesKey << 1) | (GLEmulation.lightingEnabled ? GLEmulation.lightEnabled[lightId] : 0);
    }
    // By alpha testing mode
    enabledAttributesKey = (enabledAttributesKey << 3) | (GLEmulation.alphaTestEnabled ? (GLEmulation.alphaTestFunc - 512) : 7);
    // By drawing mode:
    enabledAttributesKey = (enabledAttributesKey << 1) | (GLImmediate.mode == GLctx.POINTS ? 1 : 0);
    keyView.next(enabledAttributesKey);
    // By cur program:
    keyView.next(GL.currProgram);
    if (!GL.currProgram) {
      GLImmediate.TexEnvJIT.traverseState(keyView);
    }
    // If we don't already have it, create it.
    var renderer = keyView.get();
    if (!renderer) {
      renderer = GLImmediate.createRenderer();
      GLImmediate.currentRenderer = renderer;
      keyView.set(renderer);
      return renderer;
    }
    GLImmediate.currentRenderer = renderer;
    // Cache the currently used renderer, so later lookups without state changes can get this fast.
    return renderer;
  },
  createRenderer(renderer) {
    var useCurrProgram = !!GL.currProgram;
    var hasTextures = false;
    for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
      var texAttribName = GLImmediate.TEXTURE0 + i;
      if (!GLImmediate.enabledClientAttributes[texAttribName]) continue;
      hasTextures = true;
    }
    /** @constructor */ function Renderer() {
      this.init = function() {
        // For fixed-function shader generation.
        var uTexUnitPrefix = "u_texUnit";
        var aTexCoordPrefix = "a_texCoord";
        var vTexCoordPrefix = "v_texCoord";
        var vPrimColor = "v_color";
        var uTexMatrixPrefix = GLImmediate.useTextureMatrix ? "u_textureMatrix" : null;
        if (useCurrProgram) {
          if (GL.shaderInfos[GL.programShaders[GL.currProgram][0]].type == GLctx.VERTEX_SHADER) {
            this.vertexShader = GL.shaders[GL.programShaders[GL.currProgram][0]];
            this.fragmentShader = GL.shaders[GL.programShaders[GL.currProgram][1]];
          } else {
            this.vertexShader = GL.shaders[GL.programShaders[GL.currProgram][1]];
            this.fragmentShader = GL.shaders[GL.programShaders[GL.currProgram][0]];
          }
          this.program = GL.programs[GL.currProgram];
          this.usedTexUnitList = [];
        } else {
          // IMPORTANT NOTE: If you parameterize the shader source based on any runtime values
          // in order to create the least expensive shader possible based on the features being
          // used, you should also update the code in the beginning of getRenderer to make sure
          // that you cache the renderer based on the said parameters.
          if (GLEmulation.fogEnabled) {
            switch (GLEmulation.fogMode) {
             case 2049:
              // GL_EXP2
              // fog = exp(-(gl_Fog.density * gl_FogFragCoord)^2)
              var fogFormula = "  float fog = exp(-u_fogDensity * u_fogDensity * ecDistance * ecDistance); \n";
              break;

             case 9729:
              // GL_LINEAR
              // fog = (gl_Fog.end - gl_FogFragCoord) * gl_fog.scale
              var fogFormula = "  float fog = (u_fogEnd - ecDistance) * u_fogScale; \n";
              break;

             default:
              // default to GL_EXP
              // fog = exp(-gl_Fog.density * gl_FogFragCoord)
              var fogFormula = "  float fog = exp(-u_fogDensity * ecDistance); \n";
              break;
            }
          }
          GLImmediate.TexEnvJIT.setGLSLVars(uTexUnitPrefix, vTexCoordPrefix, vPrimColor, uTexMatrixPrefix);
          var fsTexEnvPass = GLImmediate.TexEnvJIT.genAllPassLines("gl_FragColor", 2);
          var texUnitAttribList = "";
          var texUnitVaryingList = "";
          var texUnitUniformList = "";
          var vsTexCoordInits = "";
          this.usedTexUnitList = GLImmediate.TexEnvJIT.getUsedTexUnitList();
          for (var texUnit of this.usedTexUnitList) {
            texUnitAttribList += "attribute vec4 " + aTexCoordPrefix + texUnit + ";\n";
            texUnitVaryingList += "varying vec4 " + vTexCoordPrefix + texUnit + ";\n";
            texUnitUniformList += "uniform sampler2D " + uTexUnitPrefix + texUnit + ";\n";
            vsTexCoordInits += "  " + vTexCoordPrefix + texUnit + " = " + aTexCoordPrefix + texUnit + ";\n";
            if (GLImmediate.useTextureMatrix) {
              texUnitUniformList += "uniform mat4 " + uTexMatrixPrefix + texUnit + ";\n";
            }
          }
          var vsFogVaryingInit = null;
          if (GLEmulation.fogEnabled) {
            vsFogVaryingInit = "  v_fogFragCoord = abs(ecPosition.z);\n";
          }
          var vsPointSizeDefs = null;
          var vsPointSizeInit = null;
          if (GLImmediate.mode == GLctx.POINTS) {
            vsPointSizeDefs = "uniform float u_pointSize;\n";
            vsPointSizeInit = "  gl_PointSize = u_pointSize;\n";
          }
          var vsClipPlaneDefs = "";
          var vsClipPlaneInit = "";
          var fsClipPlaneDefs = "";
          var fsClipPlanePass = "";
          for (var clipPlaneId = 0; clipPlaneId < GLEmulation.MAX_CLIP_PLANES; clipPlaneId++) {
            if (GLEmulation.clipPlaneEnabled[clipPlaneId]) {
              vsClipPlaneDefs += "uniform vec4 u_clipPlaneEquation" + clipPlaneId + ";";
              vsClipPlaneDefs += "varying float v_clipDistance" + clipPlaneId + ";";
              vsClipPlaneInit += "  v_clipDistance" + clipPlaneId + " = dot(ecPosition, u_clipPlaneEquation" + clipPlaneId + ");";
              fsClipPlaneDefs += "varying float v_clipDistance" + clipPlaneId + ";";
              fsClipPlanePass += "  if (v_clipDistance" + clipPlaneId + " < 0.0) discard;";
            }
          }
          var vsLightingDefs = "";
          var vsLightingPass = "";
          if (GLEmulation.lightingEnabled) {
            vsLightingDefs += "attribute vec3 a_normal;";
            vsLightingDefs += "uniform mat3 u_normalMatrix;";
            vsLightingDefs += "uniform vec4 u_lightModelAmbient;";
            vsLightingDefs += "uniform vec4 u_materialAmbient;";
            vsLightingDefs += "uniform vec4 u_materialDiffuse;";
            vsLightingDefs += "uniform vec4 u_materialSpecular;";
            vsLightingDefs += "uniform float u_materialShininess;";
            vsLightingDefs += "uniform vec4 u_materialEmission;";
            vsLightingPass += "  vec3 ecNormal = normalize(u_normalMatrix * a_normal);";
            vsLightingPass += "  v_color.w = u_materialDiffuse.w;";
            vsLightingPass += "  v_color.xyz = u_materialEmission.xyz;";
            vsLightingPass += "  v_color.xyz += u_lightModelAmbient.xyz * u_materialAmbient.xyz;";
            for (var lightId = 0; lightId < GLEmulation.MAX_LIGHTS; lightId++) {
              if (GLEmulation.lightEnabled[lightId]) {
                vsLightingDefs += "uniform vec4 u_lightAmbient" + lightId + ";";
                vsLightingDefs += "uniform vec4 u_lightDiffuse" + lightId + ";";
                vsLightingDefs += "uniform vec4 u_lightSpecular" + lightId + ";";
                vsLightingDefs += "uniform vec4 u_lightPosition" + lightId + ";";
                vsLightingPass += "  {";
                vsLightingPass += "    vec3 lightDirection = normalize(u_lightPosition" + lightId + ").xyz;";
                vsLightingPass += "    vec3 halfVector = normalize(lightDirection + vec3(0,0,1));";
                vsLightingPass += "    vec3 ambient = u_lightAmbient" + lightId + ".xyz * u_materialAmbient.xyz;";
                vsLightingPass += "    float diffuseI = max(dot(ecNormal, lightDirection), 0.0);";
                vsLightingPass += "    float specularI = max(dot(ecNormal, halfVector), 0.0);";
                vsLightingPass += "    vec3 diffuse = diffuseI * u_lightDiffuse" + lightId + ".xyz * u_materialDiffuse.xyz;";
                vsLightingPass += "    specularI = (diffuseI > 0.0 && specularI > 0.0) ? exp(u_materialShininess * log(specularI)) : 0.0;";
                vsLightingPass += "    vec3 specular = specularI * u_lightSpecular" + lightId + ".xyz * u_materialSpecular.xyz;";
                vsLightingPass += "    v_color.xyz += ambient + diffuse + specular;";
                vsLightingPass += "  }";
              }
            }
            vsLightingPass += "  v_color = clamp(v_color, 0.0, 1.0);";
          }
          var vsSource = [ "attribute vec4 a_position;", "attribute vec4 a_color;", "varying vec4 v_color;", texUnitAttribList, texUnitVaryingList, (GLEmulation.fogEnabled ? "varying float v_fogFragCoord;" : null), "uniform mat4 u_modelView;", "uniform mat4 u_projection;", vsPointSizeDefs, vsClipPlaneDefs, vsLightingDefs, "void main()", "{", "  vec4 ecPosition = u_modelView * a_position;", // eye-coordinate position
          "  gl_Position = u_projection * ecPosition;", "  v_color = a_color;", vsTexCoordInits, vsFogVaryingInit, vsPointSizeInit, vsClipPlaneInit, vsLightingPass, "}", "" ].join("\n").replace(/\n\n+/g, "\n");
          this.vertexShader = GLctx.createShader(GLctx.VERTEX_SHADER);
          GLctx.shaderSource(this.vertexShader, vsSource);
          GLctx.compileShader(this.vertexShader);
          var fogHeaderIfNeeded = null;
          if (GLEmulation.fogEnabled) {
            fogHeaderIfNeeded = [ "", "varying float v_fogFragCoord; ", "uniform vec4 u_fogColor;      ", "uniform float u_fogEnd;       ", "uniform float u_fogScale;     ", "uniform float u_fogDensity;   ", "float ffog(in float ecDistance) { ", fogFormula, "  fog = clamp(fog, 0.0, 1.0); ", "  return fog;                 ", "}", "" ].join("\n");
          }
          var fogPass = null;
          if (GLEmulation.fogEnabled) {
            fogPass = "gl_FragColor = vec4(mix(u_fogColor.rgb, gl_FragColor.rgb, ffog(v_fogFragCoord)), gl_FragColor.a);\n";
          }
          var fsAlphaTestDefs = "";
          var fsAlphaTestPass = "";
          if (GLEmulation.alphaTestEnabled) {
            fsAlphaTestDefs = "uniform float u_alphaTestRef;";
            switch (GLEmulation.alphaTestFunc) {
             case 512:
              // GL_NEVER
              fsAlphaTestPass = "discard;";
              break;

             case 513:
              // GL_LESS
              fsAlphaTestPass = "if (!(gl_FragColor.a < u_alphaTestRef)) { discard; }";
              break;

             case 514:
              // GL_EQUAL
              fsAlphaTestPass = "if (!(gl_FragColor.a == u_alphaTestRef)) { discard; }";
              break;

             case 515:
              // GL_LEQUAL
              fsAlphaTestPass = "if (!(gl_FragColor.a <= u_alphaTestRef)) { discard; }";
              break;

             case 516:
              // GL_GREATER
              fsAlphaTestPass = "if (!(gl_FragColor.a > u_alphaTestRef)) { discard; }";
              break;

             case 517:
              // GL_NOTEQUAL
              fsAlphaTestPass = "if (!(gl_FragColor.a != u_alphaTestRef)) { discard; }";
              break;

             case 518:
              // GL_GEQUAL
              fsAlphaTestPass = "if (!(gl_FragColor.a >= u_alphaTestRef)) { discard; }";
              break;

             case 519:
              // GL_ALWAYS
              fsAlphaTestPass = "";
              break;
            }
          }
          var fsSource = [ "precision mediump float;", texUnitVaryingList, texUnitUniformList, "varying vec4 v_color;", fogHeaderIfNeeded, fsClipPlaneDefs, fsAlphaTestDefs, "void main()", "{", fsClipPlanePass, fsTexEnvPass, fogPass, fsAlphaTestPass, "}", "" ].join("\n").replace(/\n\n+/g, "\n");
          this.fragmentShader = GLctx.createShader(GLctx.FRAGMENT_SHADER);
          GLctx.shaderSource(this.fragmentShader, fsSource);
          GLctx.compileShader(this.fragmentShader);
          this.program = GLctx.createProgram();
          GLctx.attachShader(this.program, this.vertexShader);
          GLctx.attachShader(this.program, this.fragmentShader);
          // As optimization, bind all attributes to prespecified locations, so that the FFP emulation
          // code can submit attributes to any generated FFP shader without having to examine each shader in turn.
          // These prespecified locations are only assumed if GL_FFP_ONLY is specified, since user could also create their
          // own shaders that didn't have attributes in the same locations.
          GLctx.bindAttribLocation(this.program, GLImmediate.VERTEX, "a_position");
          GLctx.bindAttribLocation(this.program, GLImmediate.COLOR, "a_color");
          GLctx.bindAttribLocation(this.program, GLImmediate.NORMAL, "a_normal");
          var maxVertexAttribs = GLctx.getParameter(GLctx.MAX_VERTEX_ATTRIBS);
          for (var i = 0; i < GLImmediate.MAX_TEXTURES && GLImmediate.TEXTURE0 + i < maxVertexAttribs; i++) {
            GLctx.bindAttribLocation(this.program, GLImmediate.TEXTURE0 + i, "a_texCoord" + i);
            GLctx.bindAttribLocation(this.program, GLImmediate.TEXTURE0 + i, aTexCoordPrefix + i);
          }
          GLctx.linkProgram(this.program);
        }
        // Stores an array that remembers which matrix uniforms are up-to-date in this FFP renderer, so they don't need to be resubmitted
        // each time we render with this program.
        this.textureMatrixVersion = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        this.positionLocation = GLctx.getAttribLocation(this.program, "a_position");
        this.texCoordLocations = [];
        for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
          if (!GLImmediate.enabledClientAttributes[GLImmediate.TEXTURE0 + i]) {
            this.texCoordLocations[i] = -1;
            continue;
          }
          if (useCurrProgram) {
            this.texCoordLocations[i] = GLctx.getAttribLocation(this.program, `a_texCoord${i}`);
          } else {
            this.texCoordLocations[i] = GLctx.getAttribLocation(this.program, aTexCoordPrefix + i);
          }
        }
        this.colorLocation = GLctx.getAttribLocation(this.program, "a_color");
        if (!useCurrProgram) {
          // Temporarily switch to the program so we can set our sampler uniforms early.
          var prevBoundProg = GLctx.getParameter(GLctx.CURRENT_PROGRAM);
          GLctx.useProgram(this.program);
          {
            for (var i = 0; i < this.usedTexUnitList.length; i++) {
              var texUnitID = this.usedTexUnitList[i];
              var texSamplerLoc = GLctx.getUniformLocation(this.program, uTexUnitPrefix + texUnitID);
              GLctx.uniform1i(texSamplerLoc, texUnitID);
            }
          }
          // The default color attribute value is not the same as the default for all other attribute streams (0,0,0,1) but (1,1,1,1),
          // so explicitly set it right at start.
          GLctx.vertexAttrib4fv(this.colorLocation, [ 1, 1, 1, 1 ]);
          GLctx.useProgram(prevBoundProg);
        }
        this.textureMatrixLocations = [];
        for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
          this.textureMatrixLocations[i] = GLctx.getUniformLocation(this.program, `u_textureMatrix${i}`);
        }
        this.normalLocation = GLctx.getAttribLocation(this.program, "a_normal");
        this.modelViewLocation = GLctx.getUniformLocation(this.program, "u_modelView");
        this.projectionLocation = GLctx.getUniformLocation(this.program, "u_projection");
        this.normalMatrixLocation = GLctx.getUniformLocation(this.program, "u_normalMatrix");
        this.hasTextures = hasTextures;
        this.hasNormal = GLImmediate.enabledClientAttributes[GLImmediate.NORMAL] && GLImmediate.clientAttributes[GLImmediate.NORMAL].size > 0 && this.normalLocation >= 0;
        this.hasColor = this.colorLocation >= 0;
        this.floatType = GLctx.FLOAT;
        // minor optimization
        this.fogColorLocation = GLctx.getUniformLocation(this.program, "u_fogColor");
        this.fogEndLocation = GLctx.getUniformLocation(this.program, "u_fogEnd");
        this.fogScaleLocation = GLctx.getUniformLocation(this.program, "u_fogScale");
        this.fogDensityLocation = GLctx.getUniformLocation(this.program, "u_fogDensity");
        this.hasFog = !!(this.fogColorLocation || this.fogEndLocation || this.fogScaleLocation || this.fogDensityLocation);
        this.pointSizeLocation = GLctx.getUniformLocation(this.program, "u_pointSize");
        this.hasClipPlane = false;
        this.clipPlaneEquationLocation = [];
        for (var clipPlaneId = 0; clipPlaneId < GLEmulation.MAX_CLIP_PLANES; clipPlaneId++) {
          this.clipPlaneEquationLocation[clipPlaneId] = GLctx.getUniformLocation(this.program, `u_clipPlaneEquation${clipPlaneId}`);
          this.hasClipPlane = (this.hasClipPlane || this.clipPlaneEquationLocation[clipPlaneId]);
        }
        this.hasLighting = GLEmulation.lightingEnabled;
        this.lightModelAmbientLocation = GLctx.getUniformLocation(this.program, "u_lightModelAmbient");
        this.materialAmbientLocation = GLctx.getUniformLocation(this.program, "u_materialAmbient");
        this.materialDiffuseLocation = GLctx.getUniformLocation(this.program, "u_materialDiffuse");
        this.materialSpecularLocation = GLctx.getUniformLocation(this.program, "u_materialSpecular");
        this.materialShininessLocation = GLctx.getUniformLocation(this.program, "u_materialShininess");
        this.materialEmissionLocation = GLctx.getUniformLocation(this.program, "u_materialEmission");
        this.lightAmbientLocation = [];
        this.lightDiffuseLocation = [];
        this.lightSpecularLocation = [];
        this.lightPositionLocation = [];
        for (var lightId = 0; lightId < GLEmulation.MAX_LIGHTS; lightId++) {
          this.lightAmbientLocation[lightId] = GLctx.getUniformLocation(this.program, `u_lightAmbient${lightId}`);
          this.lightDiffuseLocation[lightId] = GLctx.getUniformLocation(this.program, `u_lightDiffuse${lightId}`);
          this.lightSpecularLocation[lightId] = GLctx.getUniformLocation(this.program, `u_lightSpecular${lightId}`);
          this.lightPositionLocation[lightId] = GLctx.getUniformLocation(this.program, `u_lightPosition${lightId}`);
        }
        this.hasAlphaTest = GLEmulation.alphaTestEnabled;
        this.alphaTestRefLocation = GLctx.getUniformLocation(this.program, "u_alphaTestRef");
      };
      this.prepare = function() {
        // Calculate the array buffer
        var arrayBuffer;
        if (!GLctx.currentArrayBufferBinding) {
          var start = GLImmediate.firstVertex * GLImmediate.stride;
          var end = GLImmediate.lastVertex * GLImmediate.stride;
          arrayBuffer = GL.getTempVertexBuffer(end);
        } else {
          arrayBuffer = GLctx.currentArrayBufferBinding;
        }
        if (!GLctx.currentArrayBufferBinding) {
          // Bind the array buffer and upload data after cleaning up the previous renderer
          if (arrayBuffer != GLImmediate.lastArrayBuffer) {
            GLctx.bindBuffer(GLctx.ARRAY_BUFFER, arrayBuffer);
            GLImmediate.lastArrayBuffer = arrayBuffer;
          }
          webglBufferSubData(GLctx.ARRAY_BUFFER, start, (end - start) >> 2, start >> 2, GLImmediate.vertexData);
        }
        if (!GL.currProgram) {
          if (GLImmediate.fixedFunctionProgram != this.program) {
            GLctx.useProgram(this.program);
            GLImmediate.fixedFunctionProgram = this.program;
          }
        }
        if (this.modelViewLocation && this.modelViewMatrixVersion != GLImmediate.matrixVersion[0]) {
          this.modelViewMatrixVersion = GLImmediate.matrixVersion[0];
          GLctx.uniformMatrix4fv(this.modelViewLocation, false, GLImmediate.matrix[0]);
          // set normal matrix to the upper 3x3 of the inverse transposed current modelview matrix
          if (GLEmulation.lightEnabled) {
            var tmpMVinv = GLImmediate.matrixLib.mat4.create(GLImmediate.matrix[0]);
            GLImmediate.matrixLib.mat4.inverse(tmpMVinv);
            GLImmediate.matrixLib.mat4.transpose(tmpMVinv);
            GLctx.uniformMatrix3fv(this.normalMatrixLocation, false, GLImmediate.matrixLib.mat4.toMat3(tmpMVinv));
          }
        }
        if (this.projectionLocation && this.projectionMatrixVersion != GLImmediate.matrixVersion[1]) {
          this.projectionMatrixVersion = GLImmediate.matrixVersion[1];
          GLctx.uniformMatrix4fv(this.projectionLocation, false, GLImmediate.matrix[1]);
        }
        var clientAttributes = GLImmediate.clientAttributes;
        var posAttr = clientAttributes[GLImmediate.VERTEX];
        GLctx.vertexAttribPointer(this.positionLocation, posAttr.size, posAttr.type, false, GLImmediate.stride, posAttr.offset);
        GLctx.enableVertexAttribArray(this.positionLocation);
        if (this.hasNormal) {
          var normalAttr = clientAttributes[GLImmediate.NORMAL];
          GLctx.vertexAttribPointer(this.normalLocation, normalAttr.size, normalAttr.type, true, GLImmediate.stride, normalAttr.offset);
          GLctx.enableVertexAttribArray(this.normalLocation);
        }
        if (this.hasTextures) {
          for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
            var attribLoc = this.texCoordLocations[i];
            if (attribLoc === undefined || attribLoc < 0) continue;
            var texAttr = clientAttributes[GLImmediate.TEXTURE0 + i];
            if (texAttr.size) {
              GLctx.vertexAttribPointer(attribLoc, texAttr.size, texAttr.type, false, GLImmediate.stride, texAttr.offset);
              GLctx.enableVertexAttribArray(attribLoc);
            } else {
              // These two might be dangerous, but let's try them.
              GLctx.vertexAttrib4f(attribLoc, 0, 0, 0, 1);
              GLctx.disableVertexAttribArray(attribLoc);
            }
            var t = 2 + i;
            if (this.textureMatrixLocations[i] && this.textureMatrixVersion[t] != GLImmediate.matrixVersion[t]) {
              // XXX might we need this even without the condition we are currently in?
              this.textureMatrixVersion[t] = GLImmediate.matrixVersion[t];
              GLctx.uniformMatrix4fv(this.textureMatrixLocations[i], false, GLImmediate.matrix[t]);
            }
          }
        }
        if (GLImmediate.enabledClientAttributes[GLImmediate.COLOR]) {
          var colorAttr = clientAttributes[GLImmediate.COLOR];
          GLctx.vertexAttribPointer(this.colorLocation, colorAttr.size, colorAttr.type, true, GLImmediate.stride, colorAttr.offset);
          GLctx.enableVertexAttribArray(this.colorLocation);
        } else if (this.hasColor) {
          GLctx.disableVertexAttribArray(this.colorLocation);
          GLctx.vertexAttrib4fv(this.colorLocation, GLImmediate.clientColor);
        }
        if (this.hasFog) {
          if (this.fogColorLocation) GLctx.uniform4fv(this.fogColorLocation, GLEmulation.fogColor);
          if (this.fogEndLocation) GLctx.uniform1f(this.fogEndLocation, GLEmulation.fogEnd);
          if (this.fogScaleLocation) GLctx.uniform1f(this.fogScaleLocation, 1 / (GLEmulation.fogEnd - GLEmulation.fogStart));
          if (this.fogDensityLocation) GLctx.uniform1f(this.fogDensityLocation, GLEmulation.fogDensity);
        }
        if (this.hasClipPlane) {
          for (var clipPlaneId = 0; clipPlaneId < GLEmulation.MAX_CLIP_PLANES; clipPlaneId++) {
            if (this.clipPlaneEquationLocation[clipPlaneId]) GLctx.uniform4fv(this.clipPlaneEquationLocation[clipPlaneId], GLEmulation.clipPlaneEquation[clipPlaneId]);
          }
        }
        if (this.hasLighting) {
          if (this.lightModelAmbientLocation) GLctx.uniform4fv(this.lightModelAmbientLocation, GLEmulation.lightModelAmbient);
          if (this.materialAmbientLocation) GLctx.uniform4fv(this.materialAmbientLocation, GLEmulation.materialAmbient);
          if (this.materialDiffuseLocation) GLctx.uniform4fv(this.materialDiffuseLocation, GLEmulation.materialDiffuse);
          if (this.materialSpecularLocation) GLctx.uniform4fv(this.materialSpecularLocation, GLEmulation.materialSpecular);
          if (this.materialShininessLocation) GLctx.uniform1f(this.materialShininessLocation, GLEmulation.materialShininess[0]);
          if (this.materialEmissionLocation) GLctx.uniform4fv(this.materialEmissionLocation, GLEmulation.materialEmission);
          for (var lightId = 0; lightId < GLEmulation.MAX_LIGHTS; lightId++) {
            if (this.lightAmbientLocation[lightId]) GLctx.uniform4fv(this.lightAmbientLocation[lightId], GLEmulation.lightAmbient[lightId]);
            if (this.lightDiffuseLocation[lightId]) GLctx.uniform4fv(this.lightDiffuseLocation[lightId], GLEmulation.lightDiffuse[lightId]);
            if (this.lightSpecularLocation[lightId]) GLctx.uniform4fv(this.lightSpecularLocation[lightId], GLEmulation.lightSpecular[lightId]);
            if (this.lightPositionLocation[lightId]) GLctx.uniform4fv(this.lightPositionLocation[lightId], GLEmulation.lightPosition[lightId]);
          }
        }
        if (this.hasAlphaTest) {
          if (this.alphaTestRefLocation) GLctx.uniform1f(this.alphaTestRefLocation, GLEmulation.alphaTestRef);
        }
        if (GLImmediate.mode == GLctx.POINTS) {
          if (this.pointSizeLocation) {
            GLctx.uniform1f(this.pointSizeLocation, GLEmulation.pointSize);
          }
        }
      };
      this.cleanup = function() {
        GLctx.disableVertexAttribArray(this.positionLocation);
        if (this.hasTextures) {
          for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
            if (GLImmediate.enabledClientAttributes[GLImmediate.TEXTURE0 + i] && this.texCoordLocations[i] >= 0) {
              GLctx.disableVertexAttribArray(this.texCoordLocations[i]);
            }
          }
        }
        if (this.hasColor) {
          GLctx.disableVertexAttribArray(this.colorLocation);
        }
        if (this.hasNormal) {
          GLctx.disableVertexAttribArray(this.normalLocation);
        }
        if (!GL.currProgram) {
          GLctx.useProgram(null);
          GLImmediate.fixedFunctionProgram = 0;
        }
        if (!GLctx.currentArrayBufferBinding) {
          GLctx.bindBuffer(GLctx.ARRAY_BUFFER, null);
          GLImmediate.lastArrayBuffer = null;
        }
        GLImmediate.matricesModified = true;
      };
      this.init();
    }
    return new Renderer;
  },
  setupFuncs() {
    // TexEnv stuff needs to be prepared early, so do it here.
    // init() is too late for -O2, since it freezes the GL functions
    // by that point.
    GLImmediate.MapTreeLib = GLImmediate.spawnMapTreeLib();
    GLImmediate.spawnMapTreeLib = null;
    GLImmediate.TexEnvJIT = GLImmediate.spawnTexEnvJIT();
    GLImmediate.spawnTexEnvJIT = null;
    GLImmediate.setupHooks();
  },
  setupHooks() {
    if (!GLEmulation.hasRunInit) {
      GLEmulation.init();
    }
    var glActiveTexture = _glActiveTexture;
    _glActiveTexture = _emscripten_glActiveTexture = texture => {
      GLImmediate.TexEnvJIT.hook_activeTexture(texture);
      glActiveTexture(texture);
    };
    var glEnable = _glEnable;
    _glEnable = _emscripten_glEnable = cap => {
      GLImmediate.TexEnvJIT.hook_enable(cap);
      glEnable(cap);
    };
    var glDisable = _glDisable;
    _glDisable = _emscripten_glDisable = cap => {
      GLImmediate.TexEnvJIT.hook_disable(cap);
      glDisable(cap);
    };
    var glTexEnvf = (typeof _glTexEnvf != "undefined") ? _glTexEnvf : () => {};
    /** @suppress {checkTypes} */ _glTexEnvf = _emscripten_glTexEnvf = (target, pname, param) => {
      GLImmediate.TexEnvJIT.hook_texEnvf(target, pname, param);
    };
    var glTexEnvi = (typeof _glTexEnvi != "undefined") ? _glTexEnvi : () => {};
    /** @suppress {checkTypes} */ _glTexEnvi = _emscripten_glTexEnvi = (target, pname, param) => {
      GLImmediate.TexEnvJIT.hook_texEnvi(target, pname, param);
    };
    var glTexEnvfv = (typeof _glTexEnvfv != "undefined") ? _glTexEnvfv : () => {};
    /** @suppress {checkTypes} */ _glTexEnvfv = _emscripten_glTexEnvfv = (target, pname, param) => {
      GLImmediate.TexEnvJIT.hook_texEnvfv(target, pname, param);
    };
    _glGetTexEnviv = (target, pname, param) => {
      GLImmediate.TexEnvJIT.hook_getTexEnviv(target, pname, param);
    };
    _glGetTexEnvfv = (target, pname, param) => {
      GLImmediate.TexEnvJIT.hook_getTexEnvfv(target, pname, param);
    };
    var glGetIntegerv = _glGetIntegerv;
    _glGetIntegerv = _emscripten_glGetIntegerv = (pname, params) => {
      switch (pname) {
       case 35725:
        {
          // GL_CURRENT_PROGRAM
          // Just query directly so we're working with WebGL objects.
          var cur = GLctx.getParameter(GLctx.CURRENT_PROGRAM);
          if (cur == GLImmediate.fixedFunctionProgram) {
            // Pretend we're not using a program.
            (growMemViews(), HEAP32)[((params) >> 2)] = 0;
            return;
          }
          break;
        }
      }
      glGetIntegerv(pname, params);
    };
  },
  initted: false,
  init() {
    err("WARNING: using emscripten GL immediate mode emulation. This is very limited in what it supports");
    GLImmediate.initted = true;
    if (!Browser.useWebGL) return;
    // a 2D canvas may be currently used TODO: make sure we are actually called in that case
    // User can override the maximum number of texture units that we emulate. Using fewer texture units increases runtime performance
    // slightly, so it is advantageous to choose as small value as needed.
    // Limit to a maximum of 28 to not overflow the state bits used for renderer caching (31 bits = 3 attributes + 28 texture units).
    var maxTextureUnits = GLctx.getParameter(GLctx.MAX_TEXTURE_IMAGE_UNITS);
    GLImmediate.MAX_TEXTURES = Math.min(maxTextureUnits, 28);
    GLImmediate.TexEnvJIT.init(GLctx, GLImmediate.MAX_TEXTURES);
    GLImmediate.NUM_ATTRIBUTES = 3 + GLImmediate.MAX_TEXTURES;
    GLImmediate.clientAttributes = [];
    GLEmulation.enabledClientAttribIndices = [];
    for (var i = 0; i < GLImmediate.NUM_ATTRIBUTES; i++) {
      GLImmediate.clientAttributes.push({});
      GLEmulation.enabledClientAttribIndices.push(false);
    }
    // Initialize matrix library
    // When user sets a matrix, increment a 'version number' on the new data, and when rendering, submit
    // the matrices to the shader program only if they have an old version of the data.
    GLImmediate.matrix = [];
    GLImmediate.matrixStack = [];
    GLImmediate.matrixVersion = [];
    for (var i = 0; i < 2 + GLImmediate.MAX_TEXTURES; i++) {
      // Modelview, Projection, plus one matrix for each texture coordinate.
      GLImmediate.matrixStack.push([]);
      GLImmediate.matrixVersion.push(0);
      GLImmediate.matrix.push(GLImmediate.matrixLib.mat4.create());
      GLImmediate.matrixLib.mat4.identity(GLImmediate.matrix[i]);
    }
    // Renderer cache
    GLImmediate.rendererCache = GLImmediate.MapTreeLib.create();
    // Buffers for data
    GLImmediate.tempData = new Float32Array(GL.MAX_TEMP_BUFFER_SIZE >> 2);
    GLImmediate.indexData = new Uint16Array(GL.MAX_TEMP_BUFFER_SIZE >> 1);
    GLImmediate.vertexDataU8 = new Uint8Array(GLImmediate.tempData.buffer);
    GL.generateTempBuffers(true, GL.currentContext);
    GLImmediate.clientColor = new Float32Array([ 1, 1, 1, 1 ]);
  },
  prepareClientAttributes(count, beginEnd) {
    // If no client attributes were modified since we were last called, do
    // nothing. Note that this does not work for glBegin/End, where we
    // generate renderer components dynamically and then disable them
    // ourselves, but it does help with glDrawElements/Arrays.
    if (!GLImmediate.modifiedClientAttributes) {
      GLImmediate.vertexCounter = (GLImmediate.stride * count) / 4;
      // XXX assuming float
      return;
    }
    GLImmediate.modifiedClientAttributes = false;
    // The role of prepareClientAttributes is to examine the set of
    // client-side vertex attribute buffers that user code has submitted, and
    // to prepare them to be uploaded to a VBO in GPU memory (since WebGL does
    // not support client-side rendering, i.e. rendering from vertex data in
    // CPU memory). User can submit vertex data generally in three different
    // configurations:
    // 1. Fully planar: all attributes are in their own separate
    //                  tightly-packed arrays in CPU memory.
    // 2. Fully interleaved: all attributes share a single array where data is
    //                       interleaved something like (pos,uv,normal),
    //                       (pos,uv,normal), ...
    // 3. Complex hybrid: Multiple separate arrays that either are sparsely
    //                    strided, and/or partially interleaves vertex
    //                    attributes.
    // For simplicity, we support the case (2) as the fast case. For (1) and
    // (3), we do a memory copy of the vertex data here to prepare a
    // relayouted buffer that is of the structure in case (2). The reason
    // for this is that it allows the emulation code to get away with using
    // just one VBO buffer for rendering, and not have to maintain multiple
    // ones. Therefore cases (1) and (3) will be very slow, and case (2) is
    // fast.
    // Detect which case we are in by using a quick heuristic by examining the
    // strides of the buffers. If all the buffers have identical stride, we
    // assume we have case (2), otherwise we have something more complex.
    var clientStartPointer = 4294967295;
    var bytes = 0;
    // Total number of bytes taken up by a single vertex.
    var minStride = 4294967295;
    var maxStride = 0;
    var attributes = GLImmediate.liveClientAttributes;
    attributes.length = 0;
    for (var i = 0; i < 3 + GLImmediate.MAX_TEXTURES; i++) {
      if (GLImmediate.enabledClientAttributes[i]) {
        var attr = GLImmediate.clientAttributes[i];
        attributes.push(attr);
        clientStartPointer = Math.min(clientStartPointer, attr.pointer);
        attr.sizeBytes = attr.size * GL.byteSizeByType[attr.type - GL.byteSizeByTypeRoot];
        bytes += attr.sizeBytes;
        minStride = Math.min(minStride, attr.stride);
        maxStride = Math.max(maxStride, attr.stride);
      }
    }
    if ((minStride != maxStride || maxStride < bytes) && !beginEnd) {
      // We are in cases (1) or (3): slow path, shuffle the data around into a
      // single interleaved vertex buffer.
      // The immediate-mode glBegin()/glEnd() vertex submission gets
      // automatically generated in appropriate layout, so never need to come
      // down this path if that was used.
      GLImmediate.restrideBuffer ||= _malloc(GL.MAX_TEMP_BUFFER_SIZE);
      var start = GLImmediate.restrideBuffer;
      bytes = 0;
      // calculate restrided offsets and total size
      for (var attr of attributes) {
        var size = attr.sizeBytes;
        if (size % 4 != 0) size += 4 - (size % 4);
        // align everything
        attr.offset = bytes;
        bytes += size;
      }
      // copy out the data (we need to know the stride for that, and define attr.pointer)
      for (var attr of attributes) {
        var srcStride = Math.max(attr.sizeBytes, attr.stride);
        if ((srcStride & 3) == 0 && (attr.sizeBytes & 3) == 0) {
          for (var j = 0; j < count; j++) {
            for (var k = 0; k < attr.sizeBytes; k += 4) {
              // copy in chunks of 4 bytes, our alignment makes this possible
              var val = (growMemViews(), HEAP32)[(((attr.pointer) + (j * srcStride + k)) >> 2)];
              (growMemViews(), HEAP32)[(((start + attr.offset) + (bytes * j + k)) >> 2)] = val;
            }
          }
        } else {
          for (var j = 0; j < count; j++) {
            for (var k = 0; k < attr.sizeBytes; k++) {
              // source data was not aligned to multiples of 4, must copy byte by byte.
              (growMemViews(), HEAP8)[start + attr.offset + bytes * j + k] = (growMemViews(), 
              HEAP8)[attr.pointer + j * srcStride + k];
            }
          }
        }
        attr.pointer = start + attr.offset;
      }
      GLImmediate.stride = bytes;
      GLImmediate.vertexPointer = start;
    } else {
      // case (2): fast path, all data is interleaved to a single vertex array so we can get away with a single VBO upload.
      if (GLctx.currentArrayBufferBinding) {
        GLImmediate.vertexPointer = 0;
      } else {
        GLImmediate.vertexPointer = clientStartPointer;
      }
      for (var attr of attributes) {
        attr.offset = attr.pointer - GLImmediate.vertexPointer;
      }
      GLImmediate.stride = Math.max(maxStride, bytes);
    }
    if (!beginEnd) {
      GLImmediate.vertexCounter = (GLImmediate.stride * count) / 4;
    }
  },
  flush(numProvidedIndexes, startIndex = 0, ptr = 0) {
    var renderer = GLImmediate.getRenderer();
    // Generate index data in a format suitable for GLES 2.0/WebGL
    var numVertices = 4 * GLImmediate.vertexCounter / GLImmediate.stride;
    if (!numVertices) return;
    var emulatedElementArrayBuffer = false;
    var numIndexes = 0;
    if (numProvidedIndexes) {
      numIndexes = numProvidedIndexes;
      if (!GLctx.currentArrayBufferBinding && GLImmediate.firstVertex > GLImmediate.lastVertex) {
        // Figure out the first and last vertex from the index data
        for (var i = 0; i < numProvidedIndexes; i++) {
          var currIndex = (growMemViews(), HEAPU16)[(((ptr) + (i * 2)) >> 1)];
          GLImmediate.firstVertex = Math.min(GLImmediate.firstVertex, currIndex);
          GLImmediate.lastVertex = Math.max(GLImmediate.lastVertex, currIndex + 1);
        }
      }
      if (!GLctx.currentElementArrayBufferBinding) {
        // If no element array buffer is bound, then indices is a literal pointer to clientside data
        var byteSize = numProvidedIndexes << 1;
        var indexBuffer = GL.getTempIndexBuffer(byteSize);
        GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, indexBuffer);
        webglBufferSubData(GLctx.ELEMENT_ARRAY_BUFFER, 0, byteSize, ptr);
        ptr = 0;
        emulatedElementArrayBuffer = true;
      }
    } else if (GLImmediate.mode > 6) {
      // above GL_TRIANGLE_FAN are the non-GL ES modes
      if (GLImmediate.mode != 7) abort("unsupported immediate mode " + GLImmediate.mode);
      // GL_QUADS
      // GLImmediate.firstVertex is the first vertex we want. Quad indexes are
      // in the pattern 0 1 2, 0 2 3, 4 5 6, 4 6 7, so we need to look at
      // index firstVertex * 1.5 to see it.  Then since indexes are 2 bytes
      // each, that means 3
      ptr = GLImmediate.firstVertex * 3;
      var numQuads = numVertices / 4;
      numIndexes = numQuads * 6;
      // 0 1 2, 0 2 3 pattern
      GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.currentContext.tempQuadIndexBuffer);
      emulatedElementArrayBuffer = true;
      GLImmediate.mode = GLctx.TRIANGLES;
    }
    renderer.prepare();
    if (numIndexes) {
      GLctx.drawElements(GLImmediate.mode, numIndexes, GLctx.UNSIGNED_SHORT, ptr);
    } else {
      GLctx.drawArrays(GLImmediate.mode, startIndex, numVertices);
    }
    if (emulatedElementArrayBuffer) {
      GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.buffers[GLctx.currentElementArrayBufferBinding] || null);
    }
    renderer.cleanup();
  }
};

GLImmediate.matrixLib = (() => {
  /**
 * @fileoverview gl-matrix - High performance matrix and vector operations for WebGL
 * @author Brandon Jones
 * @version 1.2.4
 */ // Modified for emscripten:
  // - Global scoping etc.
  // - Disabled some non-closure-compatible javadoc comments.
  /*
 * Copyright (c) 2011 Brandon Jones
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */ /**
 * @class 3 Dimensional Vector
 * @name vec3
 */ var vec3 = {};
  /**
 * @class 3x3 Matrix
 * @name mat3
 */ var mat3 = {};
  /**
 * @class 4x4 Matrix
 * @name mat4
 */ var mat4 = {};
  /**
 * @class Quaternion
 * @name quat4
 */ var quat4 = {};
  var MatrixArray = Float32Array;
  /*
 * vec3
 */ /**
 * Creates a new instance of a vec3 using the default array type
 * Any javascript array-like objects containing at least 3 numeric elements can serve as a vec3
 *
 * _param {vec3} [vec] vec3 containing values to initialize with
 *
 * _returns {vec3} New vec3
 */ vec3.create = function(vec) {
    var dest = new MatrixArray(3);
    if (vec) {
      dest[0] = vec[0];
      dest[1] = vec[1];
      dest[2] = vec[2];
    } else {
      dest[0] = dest[1] = dest[2] = 0;
    }
    return dest;
  };
  /**
 * Copies the values of one vec3 to another
 *
 * _param {vec3} vec vec3 containing values to copy
 * _param {vec3} dest vec3 receiving copied values
 *
 * _returns {vec3} dest
 */ vec3.set = function(vec, dest) {
    dest[0] = vec[0];
    dest[1] = vec[1];
    dest[2] = vec[2];
    return dest;
  };
  /**
 * Performs a vector addition
 *
 * _param {vec3} vec First operand
 * _param {vec3} vec2 Second operand
 * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
 *
 * _returns {vec3} dest if specified, vec otherwise
 */ vec3.add = function(vec, vec2, dest) {
    if (!dest || vec === dest) {
      vec[0] += vec2[0];
      vec[1] += vec2[1];
      vec[2] += vec2[2];
      return vec;
    }
    dest[0] = vec[0] + vec2[0];
    dest[1] = vec[1] + vec2[1];
    dest[2] = vec[2] + vec2[2];
    return dest;
  };
  /**
 * Performs a vector subtraction
 *
 * _param {vec3} vec First operand
 * _param {vec3} vec2 Second operand
 * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
 *
 * _returns {vec3} dest if specified, vec otherwise
 */ vec3.subtract = function(vec, vec2, dest) {
    if (!dest || vec === dest) {
      vec[0] -= vec2[0];
      vec[1] -= vec2[1];
      vec[2] -= vec2[2];
      return vec;
    }
    dest[0] = vec[0] - vec2[0];
    dest[1] = vec[1] - vec2[1];
    dest[2] = vec[2] - vec2[2];
    return dest;
  };
  /**
 * Performs a vector multiplication
 *
 * _param {vec3} vec First operand
 * _param {vec3} vec2 Second operand
 * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
 *
 * _returns {vec3} dest if specified, vec otherwise
 */ vec3.multiply = function(vec, vec2, dest) {
    if (!dest || vec === dest) {
      vec[0] *= vec2[0];
      vec[1] *= vec2[1];
      vec[2] *= vec2[2];
      return vec;
    }
    dest[0] = vec[0] * vec2[0];
    dest[1] = vec[1] * vec2[1];
    dest[2] = vec[2] * vec2[2];
    return dest;
  };
  /**
 * Negates the components of a vec3
 *
 * _param {vec3} vec vec3 to negate
 * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
 *
 * _returns {vec3} dest if specified, vec otherwise
 */ vec3.negate = function(vec, dest) {
    if (!dest) {
      dest = vec;
    }
    dest[0] = -vec[0];
    dest[1] = -vec[1];
    dest[2] = -vec[2];
    return dest;
  };
  /**
 * Multiplies the components of a vec3 by a scalar value
 *
 * _param {vec3} vec vec3 to scale
 * _param {number} val Value to scale by
 * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
 *
 * _returns {vec3} dest if specified, vec otherwise
 */ vec3.scale = function(vec, val, dest) {
    if (!dest || vec === dest) {
      vec[0] *= val;
      vec[1] *= val;
      vec[2] *= val;
      return vec;
    }
    dest[0] = vec[0] * val;
    dest[1] = vec[1] * val;
    dest[2] = vec[2] * val;
    return dest;
  };
  /**
 * Generates a unit vector of the same direction as the provided vec3
 * If vector length is 0, returns [0, 0, 0]
 *
 * _param {vec3} vec vec3 to normalize
 * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
 *
 * _returns {vec3} dest if specified, vec otherwise
 */ vec3.normalize = function(vec, dest) {
    if (!dest) {
      dest = vec;
    }
    var x = vec[0], y = vec[1], z = vec[2], len = Math.sqrt(x * x + y * y + z * z);
    if (!len) {
      dest[0] = 0;
      dest[1] = 0;
      dest[2] = 0;
      return dest;
    } else if (len === 1) {
      dest[0] = x;
      dest[1] = y;
      dest[2] = z;
      return dest;
    }
    len = 1 / len;
    dest[0] = x * len;
    dest[1] = y * len;
    dest[2] = z * len;
    return dest;
  };
  /**
 * Generates the cross product of two vec3s
 *
 * _param {vec3} vec First operand
 * _param {vec3} vec2 Second operand
 * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
 *
 * _returns {vec3} dest if specified, vec otherwise
 */ vec3.cross = function(vec, vec2, dest) {
    if (!dest) {
      dest = vec;
    }
    var x = vec[0], y = vec[1], z = vec[2], x2 = vec2[0], y2 = vec2[1], z2 = vec2[2];
    dest[0] = y * z2 - z * y2;
    dest[1] = z * x2 - x * z2;
    dest[2] = x * y2 - y * x2;
    return dest;
  };
  /**
 * Calculates the length of a vec3
 *
 * _param {vec3} vec vec3 to calculate length of
 *
 * _returns {number} Length of vec
 */ vec3.length = function(vec) {
    var x = vec[0], y = vec[1], z = vec[2];
    return Math.sqrt(x * x + y * y + z * z);
  };
  /**
 * Calculates the dot product of two vec3s
 *
 * _param {vec3} vec First operand
 * _param {vec3} vec2 Second operand
 *
 * _returns {number} Dot product of vec and vec2
 */ vec3.dot = function(vec, vec2) {
    return vec[0] * vec2[0] + vec[1] * vec2[1] + vec[2] * vec2[2];
  };
  /**
 * Generates a unit vector pointing from one vector to another
 *
 * _param {vec3} vec Origin vec3
 * _param {vec3} vec2 vec3 to point to
 * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
 *
 * _returns {vec3} dest if specified, vec otherwise
 */ vec3.direction = function(vec, vec2, dest) {
    if (!dest) {
      dest = vec;
    }
    var x = vec[0] - vec2[0], y = vec[1] - vec2[1], z = vec[2] - vec2[2], len = Math.sqrt(x * x + y * y + z * z);
    if (!len) {
      dest[0] = 0;
      dest[1] = 0;
      dest[2] = 0;
      return dest;
    }
    len = 1 / len;
    dest[0] = x * len;
    dest[1] = y * len;
    dest[2] = z * len;
    return dest;
  };
  /**
 * Performs a linear interpolation between two vec3
 *
 * _param {vec3} vec First vector
 * _param {vec3} vec2 Second vector
 * _param {number} lerp Interpolation amount between the two inputs
 * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
 *
 * _returns {vec3} dest if specified, vec otherwise
 */ vec3.lerp = function(vec, vec2, lerp, dest) {
    if (!dest) {
      dest = vec;
    }
    dest[0] = vec[0] + lerp * (vec2[0] - vec[0]);
    dest[1] = vec[1] + lerp * (vec2[1] - vec[1]);
    dest[2] = vec[2] + lerp * (vec2[2] - vec[2]);
    return dest;
  };
  /**
 * Calculates the euclidean distance between two vec3
 *
 * Params:
 * _param {vec3} vec First vector
 * _param {vec3} vec2 Second vector
 *
 * _returns {number} Distance between vec and vec2
 */ vec3.dist = function(vec, vec2) {
    var x = vec2[0] - vec[0], y = vec2[1] - vec[1], z = vec2[2] - vec[2];
    return Math.sqrt(x * x + y * y + z * z);
  };
  /**
 * Projects the specified vec3 from screen space into object space
 * Based on the <a href="http://webcvs.freedesktop.org/mesa/Mesa/src/glu/mesa/project.c?revision=1.4&view=markup">Mesa gluUnProject implementation</a>
 *
 * _param {vec3} vec Screen-space vector to project
 * _param {mat4} view View matrix
 * _param {mat4} proj Projection matrix
 * _param {vec4} viewport Viewport as given to gl.viewport [x, y, width, height]
 * _param {vec3} [dest] vec3 receiving unprojected result. If not specified result is written to vec
 *
 * _returns {vec3} dest if specified, vec otherwise
 */ vec3.unproject = function(vec, view, proj, viewport, dest) {
    if (!dest) {
      dest = vec;
    }
    var m = mat4.create();
    var v = new MatrixArray(4);
    v[0] = (vec[0] - viewport[0]) * 2 / viewport[2] - 1;
    v[1] = (vec[1] - viewport[1]) * 2 / viewport[3] - 1;
    v[2] = 2 * vec[2] - 1;
    v[3] = 1;
    mat4.multiply(proj, view, m);
    if (!mat4.inverse(m)) {
      return null;
    }
    mat4.multiplyVec4(m, v);
    if (v[3] === 0) {
      return null;
    }
    dest[0] = v[0] / v[3];
    dest[1] = v[1] / v[3];
    dest[2] = v[2] / v[3];
    return dest;
  };
  /**
 * Returns a string representation of a vector
 *
 * _param {vec3} vec Vector to represent as a string
 *
 * _returns {string} String representation of vec
 */ vec3.str = function(vec) {
    return "[" + vec[0] + ", " + vec[1] + ", " + vec[2] + "]";
  };
  /*
 * mat3
 */ /**
 * Creates a new instance of a mat3 using the default array type
 * Any javascript array-like object containing at least 9 numeric elements can serve as a mat3
 *
 * _param {mat3} [mat] mat3 containing values to initialize with
 *
 * _returns {mat3} New mat3
 *
 * @param {Object=} mat
 */ mat3.create = function(mat) {
    var dest = new MatrixArray(9);
    if (mat) {
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[8] = mat[8];
    }
    return dest;
  };
  /**
 * Copies the values of one mat3 to another
 *
 * _param {mat3} mat mat3 containing values to copy
 * _param {mat3} dest mat3 receiving copied values
 *
 * _returns {mat3} dest
 */ mat3.set = function(mat, dest) {
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    return dest;
  };
  /**
 * Sets a mat3 to an identity matrix
 *
 * _param {mat3} dest mat3 to set
 *
 * _returns dest if specified, otherwise a new mat3
 */ mat3.identity = function(dest) {
    if (!dest) {
      dest = mat3.create();
    }
    dest[0] = 1;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 1;
    dest[5] = 0;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = 1;
    return dest;
  };
  /**
 * Transposes a mat3 (flips the values over the diagonal)
 *
 * Params:
 * _param {mat3} mat mat3 to transpose
 * _param {mat3} [dest] mat3 receiving transposed values. If not specified result is written to mat
 */ mat3.transpose = function(mat, dest) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (!dest || mat === dest) {
      var a01 = mat[1], a02 = mat[2], a12 = mat[5];
      mat[1] = mat[3];
      mat[2] = mat[6];
      mat[3] = a01;
      mat[5] = mat[7];
      mat[6] = a02;
      mat[7] = a12;
      return mat;
    }
    dest[0] = mat[0];
    dest[1] = mat[3];
    dest[2] = mat[6];
    dest[3] = mat[1];
    dest[4] = mat[4];
    dest[5] = mat[7];
    dest[6] = mat[2];
    dest[7] = mat[5];
    dest[8] = mat[8];
    return dest;
  };
  /**
 * Copies the elements of a mat3 into the upper 3x3 elements of a mat4
 *
 * _param {mat3} mat mat3 containing values to copy
 * _param {mat4} [dest] mat4 receiving copied values
 *
 * _returns {mat4} dest if specified, a new mat4 otherwise
 */ mat3.toMat4 = function(mat, dest) {
    if (!dest) {
      dest = mat4.create();
    }
    dest[15] = 1;
    dest[14] = 0;
    dest[13] = 0;
    dest[12] = 0;
    dest[11] = 0;
    dest[10] = mat[8];
    dest[9] = mat[7];
    dest[8] = mat[6];
    dest[7] = 0;
    dest[6] = mat[5];
    dest[5] = mat[4];
    dest[4] = mat[3];
    dest[3] = 0;
    dest[2] = mat[2];
    dest[1] = mat[1];
    dest[0] = mat[0];
    return dest;
  };
  /**
 * Returns a string representation of a mat3
 *
 * _param {mat3} mat mat3 to represent as a string
 *
 * _param {string} String representation of mat
 */ mat3.str = function(mat) {
    return "[" + mat[0] + ", " + mat[1] + ", " + mat[2] + ", " + mat[3] + ", " + mat[4] + ", " + mat[5] + ", " + mat[6] + ", " + mat[7] + ", " + mat[8] + "]";
  };
  /*
 * mat4
 */ /**
 * Creates a new instance of a mat4 using the default array type
 * Any javascript array-like object containing at least 16 numeric elements can serve as a mat4
 *
 * _param {mat4} [mat] mat4 containing values to initialize with
 *
 * _returns {mat4} New mat4
 *
 * @param {Object=} mat
 */ mat4.create = function(mat) {
    var dest = new MatrixArray(16);
    if (mat) {
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[8] = mat[8];
      dest[9] = mat[9];
      dest[10] = mat[10];
      dest[11] = mat[11];
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
    }
    return dest;
  };
  /**
 * Copies the values of one mat4 to another
 *
 * _param {mat4} mat mat4 containing values to copy
 * _param {mat4} dest mat4 receiving copied values
 *
 * _returns {mat4} dest
 */ mat4.set = function(mat, dest) {
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    dest[9] = mat[9];
    dest[10] = mat[10];
    dest[11] = mat[11];
    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
    dest[15] = mat[15];
    return dest;
  };
  /**
 * Sets a mat4 to an identity matrix
 *
 * _param {mat4} dest mat4 to set
 *
 * _returns {mat4} dest
 */ mat4.identity = function(dest) {
    if (!dest) {
      dest = mat4.create();
    }
    dest[0] = 1;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 0;
    dest[5] = 1;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = 0;
    dest[9] = 0;
    dest[10] = 1;
    dest[11] = 0;
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = 0;
    dest[15] = 1;
    return dest;
  };
  /**
 * Transposes a mat4 (flips the values over the diagonal)
 *
 * _param {mat4} mat mat4 to transpose
 * _param {mat4} [dest] mat4 receiving transposed values. If not specified result is written to mat
 */ mat4.transpose = function(mat, dest) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (!dest || mat === dest) {
      var a01 = mat[1], a02 = mat[2], a03 = mat[3], a12 = mat[6], a13 = mat[7], a23 = mat[11];
      mat[1] = mat[4];
      mat[2] = mat[8];
      mat[3] = mat[12];
      mat[4] = a01;
      mat[6] = mat[9];
      mat[7] = mat[13];
      mat[8] = a02;
      mat[9] = a12;
      mat[11] = mat[14];
      mat[12] = a03;
      mat[13] = a13;
      mat[14] = a23;
      return mat;
    }
    dest[0] = mat[0];
    dest[1] = mat[4];
    dest[2] = mat[8];
    dest[3] = mat[12];
    dest[4] = mat[1];
    dest[5] = mat[5];
    dest[6] = mat[9];
    dest[7] = mat[13];
    dest[8] = mat[2];
    dest[9] = mat[6];
    dest[10] = mat[10];
    dest[11] = mat[14];
    dest[12] = mat[3];
    dest[13] = mat[7];
    dest[14] = mat[11];
    dest[15] = mat[15];
    return dest;
  };
  /**
 * Calculates the determinant of a mat4
 *
 * _param {mat4} mat mat4 to calculate determinant of
 *
 * _returns {number} determinant of mat
 */ mat4.determinant = function(mat) {
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11], a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
    return (a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 + a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 + a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 + a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 + a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 + a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33);
  };
  /**
 * Calculates the inverse matrix of a mat4
 *
 * _param {mat4} mat mat4 to calculate inverse of
 * _param {mat4} [dest] mat4 receiving inverse matrix. If not specified result is written to mat, null if matrix cannot be inverted
 *
 * @param {Object=} dest
 */ mat4.inverse = function(mat, dest) {
    if (!dest) {
      dest = mat;
    }
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11], a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06), invDet;
    // Calculate the determinant
    if (!d) {
      return null;
    }
    invDet = 1 / d;
    dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
    dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
    dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
    dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
    dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
    dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
    dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
    dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
    dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
    dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
    return dest;
  };
  /**
 * Copies the upper 3x3 elements of a mat4 into another mat4
 *
 * _param {mat4} mat mat4 containing values to copy
 * _param {mat4} [dest] mat4 receiving copied values
 *
 * _returns {mat4} dest is specified, a new mat4 otherwise
 */ mat4.toRotationMat = function(mat, dest) {
    if (!dest) {
      dest = mat4.create();
    }
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    dest[9] = mat[9];
    dest[10] = mat[10];
    dest[11] = mat[11];
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = 0;
    dest[15] = 1;
    return dest;
  };
  /**
 * Copies the upper 3x3 elements of a mat4 into a mat3
 *
 * _param {mat4} mat mat4 containing values to copy
 * _param {mat3} [dest] mat3 receiving copied values
 *
 * _returns {mat3} dest is specified, a new mat3 otherwise
 */ mat4.toMat3 = function(mat, dest) {
    if (!dest) {
      dest = mat3.create();
    }
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[4];
    dest[4] = mat[5];
    dest[5] = mat[6];
    dest[6] = mat[8];
    dest[7] = mat[9];
    dest[8] = mat[10];
    return dest;
  };
  /**
 * Calculates the inverse of the upper 3x3 elements of a mat4 and copies the result into a mat3
 * The resulting matrix is useful for calculating transformed normals
 *
 * Params:
 * _param {mat4} mat mat4 containing values to invert and copy
 * _param {mat3} [dest] mat3 receiving values
 *
 * _returns {mat3} dest is specified, a new mat3 otherwise, null if the matrix cannot be inverted
 */ mat4.toInverseMat3 = function(mat, dest) {
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a10 = mat[4], a11 = mat[5], a12 = mat[6], a20 = mat[8], a21 = mat[9], a22 = mat[10], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20, d = a00 * b01 + a01 * b11 + a02 * b21, id;
    if (!d) {
      return null;
    }
    id = 1 / d;
    if (!dest) {
      dest = mat3.create();
    }
    dest[0] = b01 * id;
    dest[1] = (-a22 * a01 + a02 * a21) * id;
    dest[2] = (a12 * a01 - a02 * a11) * id;
    dest[3] = b11 * id;
    dest[4] = (a22 * a00 - a02 * a20) * id;
    dest[5] = (-a12 * a00 + a02 * a10) * id;
    dest[6] = b21 * id;
    dest[7] = (-a21 * a00 + a01 * a20) * id;
    dest[8] = (a11 * a00 - a01 * a10) * id;
    return dest;
  };
  /**
 * Performs a matrix multiplication
 *
 * _param {mat4} mat First operand
 * _param {mat4} mat2 Second operand
 * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
 */ mat4.multiply = function(mat, mat2, dest) {
    if (!dest) {
      dest = mat;
    }
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11], a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15], b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3], b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7], b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11], b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];
    dest[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    dest[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    dest[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    dest[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    dest[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    dest[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    dest[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    dest[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    dest[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    dest[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    dest[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    dest[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    dest[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    dest[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    dest[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    dest[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
    return dest;
  };
  /**
 * Transforms a vec3 with the given matrix
 * 4th vector component is implicitly '1'
 *
 * _param {mat4} mat mat4 to transform the vector with
 * _param {vec3} vec vec3 to transform
 * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
 *
 * _returns {vec3} dest if specified, vec otherwise
 */ mat4.multiplyVec3 = function(mat, vec, dest) {
    if (!dest) {
      dest = vec;
    }
    var x = vec[0], y = vec[1], z = vec[2];
    dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
    dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
    dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
    return dest;
  };
  /**
 * Transforms a vec4 with the given matrix
 *
 * _param {mat4} mat mat4 to transform the vector with
 * _param {vec4} vec vec4 to transform
 * _param {vec4} [dest] vec4 receiving operation result. If not specified result is written to vec
 *
 * _returns {vec4} dest if specified, vec otherwise
 *
 * @param {Object=} dest
 */ mat4.multiplyVec4 = function(mat, vec, dest) {
    if (!dest) {
      dest = vec;
    }
    var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
    dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w;
    dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w;
    dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
    dest[3] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;
    return dest;
  };
  /**
 * Translates a matrix by the given vector
 *
 * _param {mat4} mat mat4 to translate
 * _param {vec3} vec vec3 specifying the translation
 * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
 */ mat4.translate = function(mat, vec, dest) {
    var x = vec[0], y = vec[1], z = vec[2], a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;
    if (!dest || mat === dest) {
      mat[12] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
      mat[13] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
      mat[14] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
      mat[15] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];
      return mat;
    }
    a00 = mat[0];
    a01 = mat[1];
    a02 = mat[2];
    a03 = mat[3];
    a10 = mat[4];
    a11 = mat[5];
    a12 = mat[6];
    a13 = mat[7];
    a20 = mat[8];
    a21 = mat[9];
    a22 = mat[10];
    a23 = mat[11];
    dest[0] = a00;
    dest[1] = a01;
    dest[2] = a02;
    dest[3] = a03;
    dest[4] = a10;
    dest[5] = a11;
    dest[6] = a12;
    dest[7] = a13;
    dest[8] = a20;
    dest[9] = a21;
    dest[10] = a22;
    dest[11] = a23;
    dest[12] = a00 * x + a10 * y + a20 * z + mat[12];
    dest[13] = a01 * x + a11 * y + a21 * z + mat[13];
    dest[14] = a02 * x + a12 * y + a22 * z + mat[14];
    dest[15] = a03 * x + a13 * y + a23 * z + mat[15];
    return dest;
  };
  /**
 * Scales a matrix by the given vector
 *
 * _param {mat4} mat mat4 to scale
 * _param {vec3} vec vec3 specifying the scale for each axis
 * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
 */ mat4.scale = function(mat, vec, dest) {
    var x = vec[0], y = vec[1], z = vec[2];
    if (!dest || mat === dest) {
      mat[0] *= x;
      mat[1] *= x;
      mat[2] *= x;
      mat[3] *= x;
      mat[4] *= y;
      mat[5] *= y;
      mat[6] *= y;
      mat[7] *= y;
      mat[8] *= z;
      mat[9] *= z;
      mat[10] *= z;
      mat[11] *= z;
      return mat;
    }
    dest[0] = mat[0] * x;
    dest[1] = mat[1] * x;
    dest[2] = mat[2] * x;
    dest[3] = mat[3] * x;
    dest[4] = mat[4] * y;
    dest[5] = mat[5] * y;
    dest[6] = mat[6] * y;
    dest[7] = mat[7] * y;
    dest[8] = mat[8] * z;
    dest[9] = mat[9] * z;
    dest[10] = mat[10] * z;
    dest[11] = mat[11] * z;
    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
    dest[15] = mat[15];
    return dest;
  };
  /**
 * Rotates a matrix by the given angle around the specified axis
 * If rotating around a primary axis (X,Y,Z) one of the specialized rotation functions should be used instead for performance
 *
 * _param {mat4} mat mat4 to rotate
 * _param {number} angle Angle (in radians) to rotate
 * _param {vec3} axis vec3 representing the axis to rotate around
 * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
 */ mat4.rotate = function(mat, angle, axis, dest) {
    var x = axis[0], y = axis[1], z = axis[2], len = Math.sqrt(x * x + y * y + z * z), s, c, t, a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, b00, b01, b02, b10, b11, b12, b20, b21, b22;
    if (!len) {
      return null;
    }
    if (len !== 1) {
      len = 1 / len;
      x *= len;
      y *= len;
      z *= len;
    }
    s = Math.sin(angle);
    c = Math.cos(angle);
    t = 1 - c;
    a00 = mat[0];
    a01 = mat[1];
    a02 = mat[2];
    a03 = mat[3];
    a10 = mat[4];
    a11 = mat[5];
    a12 = mat[6];
    a13 = mat[7];
    a20 = mat[8];
    a21 = mat[9];
    a22 = mat[10];
    a23 = mat[11];
    // Construct the elements of the rotation matrix
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;
    if (!dest) {
      dest = mat;
    } else if (mat !== dest) {
      // If the source and destination differ, copy the unchanged last row
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
    }
    // Perform rotation-specific matrix multiplication
    dest[0] = a00 * b00 + a10 * b01 + a20 * b02;
    dest[1] = a01 * b00 + a11 * b01 + a21 * b02;
    dest[2] = a02 * b00 + a12 * b01 + a22 * b02;
    dest[3] = a03 * b00 + a13 * b01 + a23 * b02;
    dest[4] = a00 * b10 + a10 * b11 + a20 * b12;
    dest[5] = a01 * b10 + a11 * b11 + a21 * b12;
    dest[6] = a02 * b10 + a12 * b11 + a22 * b12;
    dest[7] = a03 * b10 + a13 * b11 + a23 * b12;
    dest[8] = a00 * b20 + a10 * b21 + a20 * b22;
    dest[9] = a01 * b20 + a11 * b21 + a21 * b22;
    dest[10] = a02 * b20 + a12 * b21 + a22 * b22;
    dest[11] = a03 * b20 + a13 * b21 + a23 * b22;
    return dest;
  };
  /**
 * Rotates a matrix by the given angle around the X axis
 *
 * _param {mat4} mat mat4 to rotate
 * _param {number} angle Angle (in radians) to rotate
 * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
 */ mat4.rotateX = function(mat, angle, dest) {
    var s = Math.sin(angle), c = Math.cos(angle), a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
    if (!dest) {
      dest = mat;
    } else if (mat !== dest) {
      // If the source and destination differ, copy the unchanged rows
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
    }
    // Perform axis-specific matrix multiplication
    dest[4] = a10 * c + a20 * s;
    dest[5] = a11 * c + a21 * s;
    dest[6] = a12 * c + a22 * s;
    dest[7] = a13 * c + a23 * s;
    dest[8] = a10 * -s + a20 * c;
    dest[9] = a11 * -s + a21 * c;
    dest[10] = a12 * -s + a22 * c;
    dest[11] = a13 * -s + a23 * c;
    return dest;
  };
  /**
 * Rotates a matrix by the given angle around the Y axis
 *
 * _param {mat4} mat mat4 to rotate
 * _param {number} angle Angle (in radians) to rotate
 * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
 */ mat4.rotateY = function(mat, angle, dest) {
    var s = Math.sin(angle), c = Math.cos(angle), a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
    if (!dest) {
      dest = mat;
    } else if (mat !== dest) {
      // If the source and destination differ, copy the unchanged rows
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
    }
    // Perform axis-specific matrix multiplication
    dest[0] = a00 * c + a20 * -s;
    dest[1] = a01 * c + a21 * -s;
    dest[2] = a02 * c + a22 * -s;
    dest[3] = a03 * c + a23 * -s;
    dest[8] = a00 * s + a20 * c;
    dest[9] = a01 * s + a21 * c;
    dest[10] = a02 * s + a22 * c;
    dest[11] = a03 * s + a23 * c;
    return dest;
  };
  /**
 * Rotates a matrix by the given angle around the Z axis
 *
 * _param {mat4} mat mat4 to rotate
 * _param {number} angle Angle (in radians) to rotate
 * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
 */ mat4.rotateZ = function(mat, angle, dest) {
    var s = Math.sin(angle), c = Math.cos(angle), a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
    if (!dest) {
      dest = mat;
    } else if (mat !== dest) {
      // If the source and destination differ, copy the unchanged last row
      dest[8] = mat[8];
      dest[9] = mat[9];
      dest[10] = mat[10];
      dest[11] = mat[11];
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
    }
    // Perform axis-specific matrix multiplication
    dest[0] = a00 * c + a10 * s;
    dest[1] = a01 * c + a11 * s;
    dest[2] = a02 * c + a12 * s;
    dest[3] = a03 * c + a13 * s;
    dest[4] = a00 * -s + a10 * c;
    dest[5] = a01 * -s + a11 * c;
    dest[6] = a02 * -s + a12 * c;
    dest[7] = a03 * -s + a13 * c;
    return dest;
  };
  /**
 * Generates a frustum matrix with the given bounds
 *
 * _param {number} left Left bound of the frustum
 * _param {number} right Right bound of the frustum
 * _param {number} bottom Bottom bound of the frustum
 * _param {number} top Top bound of the frustum
 * _param {number} near Near bound of the frustum
 * _param {number} far Far bound of the frustum
 * _param {mat4} [dest] mat4 frustum matrix will be written into
 *
 * _returns {mat4} dest if specified, a new mat4 otherwise
 */ mat4.frustum = function(left, right, bottom, top, near, far, dest) {
    if (!dest) {
      dest = mat4.create();
    }
    var rl = (right - left), tb = (top - bottom), fn = (far - near);
    dest[0] = (near * 2) / rl;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 0;
    dest[5] = (near * 2) / tb;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = (right + left) / rl;
    dest[9] = (top + bottom) / tb;
    dest[10] = -(far + near) / fn;
    dest[11] = -1;
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = -(far * near * 2) / fn;
    dest[15] = 0;
    return dest;
  };
  /**
 * Generates a perspective projection matrix with the given bounds
 *
 * _param {number} fovy Vertical field of view
 * _param {number} aspect Aspect ratio. typically viewport width/height
 * _param {number} near Near bound of the frustum
 * _param {number} far Far bound of the frustum
 * _param {mat4} [dest] mat4 frustum matrix will be written into
 *
 * _returns {mat4} dest if specified, a new mat4 otherwise
 */ mat4.perspective = function(fovy, aspect, near, far, dest) {
    var top = near * Math.tan(fovy * Math.PI / 360), right = top * aspect;
    return mat4.frustum(-right, right, -top, top, near, far, dest);
  };
  /**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * _param {number} left Left bound of the frustum
 * _param {number} right Right bound of the frustum
 * _param {number} bottom Bottom bound of the frustum
 * _param {number} top Top bound of the frustum
 * _param {number} near Near bound of the frustum
 * _param {number} far Far bound of the frustum
 * _param {mat4} [dest] mat4 frustum matrix will be written into
 *
 * _returns {mat4} dest if specified, a new mat4 otherwise
 */ mat4.ortho = function(left, right, bottom, top, near, far, dest) {
    if (!dest) {
      dest = mat4.create();
    }
    var rl = (right - left), tb = (top - bottom), fn = (far - near);
    dest[0] = 2 / rl;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 0;
    dest[5] = 2 / tb;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = 0;
    dest[9] = 0;
    dest[10] = -2 / fn;
    dest[11] = 0;
    dest[12] = -(left + right) / rl;
    dest[13] = -(top + bottom) / tb;
    dest[14] = -(far + near) / fn;
    dest[15] = 1;
    return dest;
  };
  /**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * _param {vec3} eye Position of the viewer
 * _param {vec3} center Point the viewer is looking at
 * _param {vec3} up vec3 pointing "up"
 * _param {mat4} [dest] mat4 frustum matrix will be written into
 *
 * _returns {mat4} dest if specified, a new mat4 otherwise
 */ mat4.lookAt = function(eye, center, up, dest) {
    if (!dest) {
      dest = mat4.create();
    }
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len, eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2], centerx = center[0], centery = center[1], centerz = center[2];
    if (eyex === centerx && eyey === centery && eyez === centerz) {
      return mat4.identity(dest);
    }
    //vec3.direction(eye, center, z);
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    // normalize (no check needed for 0 because of early return)
    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    //vec3.normalize(vec3.cross(up, z, x));
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    //vec3.normalize(vec3.cross(z, x, y));
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }
    dest[0] = x0;
    dest[1] = y0;
    dest[2] = z0;
    dest[3] = 0;
    dest[4] = x1;
    dest[5] = y1;
    dest[6] = z1;
    dest[7] = 0;
    dest[8] = x2;
    dest[9] = y2;
    dest[10] = z2;
    dest[11] = 0;
    dest[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    dest[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    dest[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    dest[15] = 1;
    return dest;
  };
  /**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * _param {quat4} quat Rotation quaternion
 * _param {vec3} vec Translation vector
 * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to a new mat4
 *
 * _returns {mat4} dest if specified, a new mat4 otherwise
 */ mat4.fromRotationTranslation = function(quat, vec, dest) {
    if (!dest) {
      dest = mat4.create();
    }
    // Quaternion math
    var x = quat[0], y = quat[1], z = quat[2], w = quat[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
    dest[0] = 1 - (yy + zz);
    dest[1] = xy + wz;
    dest[2] = xz - wy;
    dest[3] = 0;
    dest[4] = xy - wz;
    dest[5] = 1 - (xx + zz);
    dest[6] = yz + wx;
    dest[7] = 0;
    dest[8] = xz + wy;
    dest[9] = yz - wx;
    dest[10] = 1 - (xx + yy);
    dest[11] = 0;
    dest[12] = vec[0];
    dest[13] = vec[1];
    dest[14] = vec[2];
    dest[15] = 1;
    return dest;
  };
  /**
 * Returns a string representation of a mat4
 *
 * _param {mat4} mat mat4 to represent as a string
 *
 * _returns {string} String representation of mat
 */ mat4.str = function(mat) {
    return "[" + mat[0] + ", " + mat[1] + ", " + mat[2] + ", " + mat[3] + ", " + mat[4] + ", " + mat[5] + ", " + mat[6] + ", " + mat[7] + ", " + mat[8] + ", " + mat[9] + ", " + mat[10] + ", " + mat[11] + ", " + mat[12] + ", " + mat[13] + ", " + mat[14] + ", " + mat[15] + "]";
  };
  /*
 * quat4
 */ /**
 * Creates a new instance of a quat4 using the default array type
 * Any javascript array containing at least 4 numeric elements can serve as a quat4
 *
 * _param {quat4} [quat] quat4 containing values to initialize with
 *
 * _returns {quat4} New quat4
 */ quat4.create = function(quat) {
    var dest = new MatrixArray(4);
    if (quat) {
      dest[0] = quat[0];
      dest[1] = quat[1];
      dest[2] = quat[2];
      dest[3] = quat[3];
    }
    return dest;
  };
  /**
 * Copies the values of one quat4 to another
 *
 * _param {quat4} quat quat4 containing values to copy
 * _param {quat4} dest quat4 receiving copied values
 *
 * _returns {quat4} dest
 */ quat4.set = function(quat, dest) {
    dest[0] = quat[0];
    dest[1] = quat[1];
    dest[2] = quat[2];
    dest[3] = quat[3];
    return dest;
  };
  /**
 * Calculates the W component of a quat4 from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * _param {quat4} quat quat4 to calculate W component of
 * _param {quat4} [dest] quat4 receiving calculated values. If not specified result is written to quat
 *
 * _returns {quat4} dest if specified, quat otherwise
 */ quat4.calculateW = function(quat, dest) {
    var x = quat[0], y = quat[1], z = quat[2];
    if (!dest || quat === dest) {
      quat[3] = -Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
      return quat;
    }
    dest[0] = x;
    dest[1] = y;
    dest[2] = z;
    dest[3] = -Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
    return dest;
  };
  /**
 * Calculates the dot product of two quaternions
 *
 * _param {quat4} quat First operand
 * _param {quat4} quat2 Second operand
 *
 * @return {number} Dot product of quat and quat2
 */ quat4.dot = function(quat, quat2) {
    return quat[0] * quat2[0] + quat[1] * quat2[1] + quat[2] * quat2[2] + quat[3] * quat2[3];
  };
  /**
 * Calculates the inverse of a quat4
 *
 * _param {quat4} quat quat4 to calculate inverse of
 * _param {quat4} [dest] quat4 receiving inverse values. If not specified result is written to quat
 *
 * _returns {quat4} dest if specified, quat otherwise
 */ quat4.inverse = function(quat, dest) {
    var q0 = quat[0], q1 = quat[1], q2 = quat[2], q3 = quat[3], dot = q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3, invDot = dot ? 1 / dot : 0;
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
    if (!dest || quat === dest) {
      quat[0] *= -invDot;
      quat[1] *= -invDot;
      quat[2] *= -invDot;
      quat[3] *= invDot;
      return quat;
    }
    dest[0] = -quat[0] * invDot;
    dest[1] = -quat[1] * invDot;
    dest[2] = -quat[2] * invDot;
    dest[3] = quat[3] * invDot;
    return dest;
  };
  /**
 * Calculates the conjugate of a quat4
 * If the quaternion is normalized, this function is faster than quat4.inverse and produces the same result.
 *
 * _param {quat4} quat quat4 to calculate conjugate of
 * _param {quat4} [dest] quat4 receiving conjugate values. If not specified result is written to quat
 *
 * _returns {quat4} dest if specified, quat otherwise
 */ quat4.conjugate = function(quat, dest) {
    if (!dest || quat === dest) {
      quat[0] *= -1;
      quat[1] *= -1;
      quat[2] *= -1;
      return quat;
    }
    dest[0] = -quat[0];
    dest[1] = -quat[1];
    dest[2] = -quat[2];
    dest[3] = quat[3];
    return dest;
  };
  /**
 * Calculates the length of a quat4
 *
 * Params:
 * _param {quat4} quat quat4 to calculate length of
 *
 * _returns Length of quat
 */ quat4.length = function(quat) {
    var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
  };
  /**
 * Generates a unit quaternion of the same direction as the provided quat4
 * If quaternion length is 0, returns [0, 0, 0, 0]
 *
 * _param {quat4} quat quat4 to normalize
 * _param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
 *
 * _returns {quat4} dest if specified, quat otherwise
 */ quat4.normalize = function(quat, dest) {
    if (!dest) {
      dest = quat;
    }
    var x = quat[0], y = quat[1], z = quat[2], w = quat[3], len = Math.sqrt(x * x + y * y + z * z + w * w);
    if (len === 0) {
      dest[0] = 0;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      return dest;
    }
    len = 1 / len;
    dest[0] = x * len;
    dest[1] = y * len;
    dest[2] = z * len;
    dest[3] = w * len;
    return dest;
  };
  /**
 * Performs quaternion addition
 *
 * _param {quat4} quat First operand
 * _param {quat4} quat2 Second operand
 * _param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
 *
 * _returns {quat4} dest if specified, quat otherwise
 */ quat4.add = function(quat, quat2, dest) {
    if (!dest || quat === dest) {
      quat[0] += quat2[0];
      quat[1] += quat2[1];
      quat[2] += quat2[2];
      quat[3] += quat2[3];
      return quat;
    }
    dest[0] = quat[0] + quat2[0];
    dest[1] = quat[1] + quat2[1];
    dest[2] = quat[2] + quat2[2];
    dest[3] = quat[3] + quat2[3];
    return dest;
  };
  /**
 * Performs a quaternion multiplication
 *
 * _param {quat4} quat First operand
 * _param {quat4} quat2 Second operand
 * _param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
 *
 * _returns {quat4} dest if specified, quat otherwise
 */ quat4.multiply = function(quat, quat2, dest) {
    if (!dest) {
      dest = quat;
    }
    var qax = quat[0], qay = quat[1], qaz = quat[2], qaw = quat[3], qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];
    dest[0] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    dest[1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    dest[2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    dest[3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
    return dest;
  };
  /**
 * Transforms a vec3 with the given quaternion
 *
 * _param {quat4} quat quat4 to transform the vector with
 * _param {vec3} vec vec3 to transform
 * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
 *
 * _returns dest if specified, vec otherwise
 */ quat4.multiplyVec3 = function(quat, vec, dest) {
    if (!dest) {
      dest = vec;
    }
    var x = vec[0], y = vec[1], z = vec[2], qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3], // calculate quat * vec
    ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
    // calculate result * inverse quat
    dest[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    dest[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    dest[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return dest;
  };
  /**
 * Multiplies the components of a quaternion by a scalar value
 *
 * _param {quat4} quat to scale
 * _param {number} val Value to scale by
 * _param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
 *
 * _returns {quat4} dest if specified, quat otherwise
 */ quat4.scale = function(quat, val, dest) {
    if (!dest || quat === dest) {
      quat[0] *= val;
      quat[1] *= val;
      quat[2] *= val;
      quat[3] *= val;
      return quat;
    }
    dest[0] = quat[0] * val;
    dest[1] = quat[1] * val;
    dest[2] = quat[2] * val;
    dest[3] = quat[3] * val;
    return dest;
  };
  /**
 * Calculates a 3x3 matrix from the given quat4
 *
 * _param {quat4} quat quat4 to create matrix from
 * _param {mat3} [dest] mat3 receiving operation result
 *
 * _returns {mat3} dest if specified, a new mat3 otherwise
 */ quat4.toMat3 = function(quat, dest) {
    if (!dest) {
      dest = mat3.create();
    }
    var x = quat[0], y = quat[1], z = quat[2], w = quat[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
    dest[0] = 1 - (yy + zz);
    dest[1] = xy + wz;
    dest[2] = xz - wy;
    dest[3] = xy - wz;
    dest[4] = 1 - (xx + zz);
    dest[5] = yz + wx;
    dest[6] = xz + wy;
    dest[7] = yz - wx;
    dest[8] = 1 - (xx + yy);
    return dest;
  };
  /**
 * Calculates a 4x4 matrix from the given quat4
 *
 * _param {quat4} quat quat4 to create matrix from
 * _param {mat4} [dest] mat4 receiving operation result
 *
 * _returns {mat4} dest if specified, a new mat4 otherwise
 */ quat4.toMat4 = function(quat, dest) {
    if (!dest) {
      dest = mat4.create();
    }
    var x = quat[0], y = quat[1], z = quat[2], w = quat[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
    dest[0] = 1 - (yy + zz);
    dest[1] = xy + wz;
    dest[2] = xz - wy;
    dest[3] = 0;
    dest[4] = xy - wz;
    dest[5] = 1 - (xx + zz);
    dest[6] = yz + wx;
    dest[7] = 0;
    dest[8] = xz + wy;
    dest[9] = yz - wx;
    dest[10] = 1 - (xx + yy);
    dest[11] = 0;
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = 0;
    dest[15] = 1;
    return dest;
  };
  /**
 * Performs a spherical linear interpolation between two quat4
 *
 * _param {quat4} quat First quaternion
 * _param {quat4} quat2 Second quaternion
 * _param {number} slerp Interpolation amount between the two inputs
 * _param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
 *
 * _returns {quat4} dest if specified, quat otherwise
 */ quat4.slerp = function(quat, quat2, slerp, dest) {
    if (!dest) {
      dest = quat;
    }
    var cosHalfTheta = quat[0] * quat2[0] + quat[1] * quat2[1] + quat[2] * quat2[2] + quat[3] * quat2[3], halfTheta, sinHalfTheta, ratioA, ratioB;
    if (Math.abs(cosHalfTheta) >= 1) {
      if (dest !== quat) {
        dest[0] = quat[0];
        dest[1] = quat[1];
        dest[2] = quat[2];
        dest[3] = quat[3];
      }
      return dest;
    }
    halfTheta = Math.acos(cosHalfTheta);
    sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
    if (Math.abs(sinHalfTheta) < .001) {
      dest[0] = (quat[0] * .5 + quat2[0] * .5);
      dest[1] = (quat[1] * .5 + quat2[1] * .5);
      dest[2] = (quat[2] * .5 + quat2[2] * .5);
      dest[3] = (quat[3] * .5 + quat2[3] * .5);
      return dest;
    }
    ratioA = Math.sin((1 - slerp) * halfTheta) / sinHalfTheta;
    ratioB = Math.sin(slerp * halfTheta) / sinHalfTheta;
    dest[0] = (quat[0] * ratioA + quat2[0] * ratioB);
    dest[1] = (quat[1] * ratioA + quat2[1] * ratioB);
    dest[2] = (quat[2] * ratioA + quat2[2] * ratioB);
    dest[3] = (quat[3] * ratioA + quat2[3] * ratioB);
    return dest;
  };
  /**
 * Returns a string representation of a quaternion
 *
 * _param {quat4} quat quat4 to represent as a string
 *
 * _returns {string} String representation of quat
 */ quat4.str = function(quat) {
    return "[" + quat[0] + ", " + quat[1] + ", " + quat[2] + ", " + quat[3] + "]";
  };
  return {
    vec3,
    mat3,
    mat4,
    quat4
  };
})();

var GLImmediateSetup = {};

var _emscripten_glLoadIdentity = () => {
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.identity(GLImmediate.matrix[GLImmediate.currentMatrix]);
};

var _glLoadIdentity = _emscripten_glLoadIdentity;

var _emscripten_glMatrixMode = mode => {
  if (mode == 5888) {
    GLImmediate.currentMatrix = 0;
  } else if (mode == 5889) {
    GLImmediate.currentMatrix = 1;
  } else if (mode == 5890) {
    // GL_TEXTURE
    GLImmediate.useTextureMatrix = true;
    GLImmediate.currentMatrix = 2 + GLImmediate.TexEnvJIT.getActiveTexture();
  } else {
    throw `Wrong mode ${mode} passed to glMatrixMode`;
  }
};

var _glMatrixMode = _emscripten_glMatrixMode;

var _emscripten_glMultMatrixf = matrix => {
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.multiply(GLImmediate.matrix[GLImmediate.currentMatrix], (growMemViews(), 
  HEAPF32).subarray((((matrix) >> 2)), ((matrix + 64) >> 2)));
};

var _glMultMatrixf = _emscripten_glMultMatrixf;

var _emscripten_glNormal3f = (x, y, z) => {
  GLImmediate.vertexData[GLImmediate.vertexCounter++] = x;
  GLImmediate.vertexData[GLImmediate.vertexCounter++] = y;
  GLImmediate.vertexData[GLImmediate.vertexCounter++] = z;
  GLImmediate.addRendererComponent(GLImmediate.NORMAL, 3, GLctx.FLOAT);
};

var _glNormal3f = _emscripten_glNormal3f;

var _emscripten_glNormalPointer = (type, stride, pointer) => {
  GLImmediate.setClientAttribute(GLImmediate.NORMAL, 3, type, stride, pointer);
};

var _glNormalPointer = _emscripten_glNormalPointer;

var _emscripten_glOrtho = (left, right, bottom, top_, nearVal, farVal) => {
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.multiply(GLImmediate.matrix[GLImmediate.currentMatrix], GLImmediate.matrixLib.mat4.ortho(left, right, bottom, top_, nearVal, farVal));
};

var _glOrtho = _emscripten_glOrtho;

var _emscripten_glOrthof = _glOrtho;

var _glOrthof = _emscripten_glOrthof;

var _emscripten_glPolygonOffset = (x0, x1) => GLctx.polygonOffset(x0, x1);

var _glPolygonOffset = _emscripten_glPolygonOffset;

var _emscripten_glPopMatrix = () => {
  if (GLImmediate.matrixStack[GLImmediate.currentMatrix].length == 0) {
    GL.recordError(1284);
    return;
  }
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrix[GLImmediate.currentMatrix] = GLImmediate.matrixStack[GLImmediate.currentMatrix].pop();
};

var _glPopMatrix = _emscripten_glPopMatrix;

var _emscripten_glPushMatrix = () => {
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixStack[GLImmediate.currentMatrix].push(Array.prototype.slice.call(GLImmediate.matrix[GLImmediate.currentMatrix]));
};

var _glPushMatrix = _emscripten_glPushMatrix;

var _emscripten_glRotated = (angle, x, y, z) => {
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.rotate(GLImmediate.matrix[GLImmediate.currentMatrix], angle * Math.PI / 180, [ x, y, z ]);
};

var _glRotated = _emscripten_glRotated;

var _emscripten_glRotatef = _glRotated;

var _glRotatef = _emscripten_glRotatef;

var _emscripten_glScaled = (x, y, z) => {
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.scale(GLImmediate.matrix[GLImmediate.currentMatrix], [ x, y, z ]);
};

var _glScaled = _emscripten_glScaled;

var _emscripten_glScalef = _glScaled;

var _glScalef = _emscripten_glScalef;

var _emscripten_glScissor = (x0, x1, x2, x3) => GLctx.scissor(x0, x1, x2, x3);

var _glScissor = _emscripten_glScissor;

var _emscripten_glShadeModel = () => warnOnce("TODO: glShadeModel");

var _glShadeModel = _emscripten_glShadeModel;

var _emscripten_glTexCoordPointer = (size, type, stride, pointer) => {
  GLImmediate.setClientAttribute(GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture, size, type, stride, pointer);
};

var _glTexCoordPointer = _emscripten_glTexCoordPointer;

var computeUnpackAlignedImageSize = (width, height, sizePerPixel) => {
  function roundedToNextMultipleOf(x, y) {
    return (x + y - 1) & -y;
  }
  var plainRowSize = (GL.unpackRowLength || width) * sizePerPixel;
  var alignedRowSize = roundedToNextMultipleOf(plainRowSize, GL.unpackAlignment);
  return height * alignedRowSize;
};

var colorChannelsInGlTextureFormat = format => {
  // Micro-optimizations for size: map format to size by subtracting smallest
  // enum value (0x1902) from all values first.  Also omit the most common
  // size value (1) from the list, which is assumed by formats not on the
  // list.
  var colorChannels = {
    // 0x1902 /* GL_DEPTH_COMPONENT */ - 0x1902: 1,
    // 0x1906 /* GL_ALPHA */ - 0x1902: 1,
    5: 3,
    6: 4,
    // 0x1909 /* GL_LUMINANCE */ - 0x1902: 1,
    8: 2,
    29502: 3,
    29504: 4
  };
  return colorChannels[format - 6402] || 1;
};

var heapObjectForWebGLType = type => {
  // Micro-optimization for size: Subtract lowest GL enum number (0x1400/* GL_BYTE */) from type to compare
  // smaller values for the heap, for shorter generated code size.
  // Also the type HEAPU16 is not tested for explicitly, but any unrecognized type will return out HEAPU16.
  // (since most types are HEAPU16)
  type -= 5120;
  if (type == 1) return (growMemViews(), HEAPU8);
  if (type == 4) return (growMemViews(), HEAP32);
  if (type == 6) return (growMemViews(), HEAPF32);
  if (type == 5 || type == 28922) return (growMemViews(), HEAPU32);
  return (growMemViews(), HEAPU16);
};

var toTypedArrayIndex = (pointer, heap) => pointer >>> (31 - Math.clz32(heap.BYTES_PER_ELEMENT));

var emscriptenWebGLGetTexPixelData = (type, format, width, height, pixels) => {
  var heap = heapObjectForWebGLType(type);
  var sizePerPixel = colorChannelsInGlTextureFormat(format) * heap.BYTES_PER_ELEMENT;
  var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel);
  return heap.subarray(toTypedArrayIndex(pixels, heap), toTypedArrayIndex(pixels + bytes, heap));
};

var _emscripten_glTexImage2D = (target, level, internalFormat, width, height, border, format, type, pixels) => {
  var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels) : null;
  GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData);
};

var _glTexImage2D = _emscripten_glTexImage2D;

var _emscripten_glTexParameteri = (x0, x1, x2) => GLctx.texParameteri(x0, x1, x2);

var _glTexParameteri = _emscripten_glTexParameteri;

var _emscripten_glTexSubImage2D = (target, level, xoffset, yoffset, width, height, format, type, pixels) => {
  var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels) : null;
  GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
};

var _glTexSubImage2D = _emscripten_glTexSubImage2D;

var _emscripten_glTranslated = (x, y, z) => {
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.translate(GLImmediate.matrix[GLImmediate.currentMatrix], [ x, y, z ]);
};

var _glTranslated = _emscripten_glTranslated;

var _emscripten_glTranslatef = _glTranslated;

var _glTranslatef = _emscripten_glTranslatef;

var _emscripten_glVertexPointer = (size, type, stride, pointer) => {
  GLImmediate.setClientAttribute(GLImmediate.VERTEX, size, type, stride, pointer);
};

var _glVertexPointer = _emscripten_glVertexPointer;

var _emscripten_glViewport = (x0, x1, x2, x3) => GLctx.viewport(x0, x1, x2, x3);

var _glViewport = _emscripten_glViewport;

/** @constructor */ function GLFW_Window(id, width, height, framebufferWidth, framebufferHeight, title, monitor, share) {
  this.id = id;
  this.x = 0;
  this.y = 0;
  this.fullscreen = false;
  // Used to determine if app is in fullscreen mode
  this.storedX = 0;
  // Used to store X before fullscreen
  this.storedY = 0;
  // Used to store Y before fullscreen
  this.width = width;
  this.height = height;
  this.framebufferWidth = framebufferWidth;
  this.framebufferHeight = framebufferHeight;
  this.storedWidth = width;
  // Used to store width before fullscreen
  this.storedHeight = height;
  // Used to store height before fullscreen
  this.title = title;
  this.monitor = monitor;
  this.share = share;
  this.attributes = {
    ...GLFW.hints
  };
  this.inputModes = {
    208897: 212993,
    // GLFW_CURSOR (GLFW_CURSOR_NORMAL)
    208898: 0,
    // GLFW_STICKY_KEYS
    208899: 0
  };
  this.buttons = 0;
  this.keys = new Array;
  this.domKeys = new Array;
  this.shouldClose = 0;
  this.title = null;
  this.windowPosFunc = 0;
  // GLFWwindowposfun
  this.windowSizeFunc = 0;
  // GLFWwindowsizefun
  this.windowCloseFunc = 0;
  // GLFWwindowclosefun
  this.windowRefreshFunc = 0;
  // GLFWwindowrefreshfun
  this.windowFocusFunc = 0;
  // GLFWwindowfocusfun
  this.windowIconifyFunc = 0;
  // GLFWwindowiconifyfun
  this.windowMaximizeFunc = 0;
  // GLFWwindowmaximizefun
  this.framebufferSizeFunc = 0;
  // GLFWframebuffersizefun
  this.windowContentScaleFunc = 0;
  // GLFWwindowcontentscalefun
  this.mouseButtonFunc = 0;
  // GLFWmousebuttonfun
  this.cursorPosFunc = 0;
  // GLFWcursorposfun
  this.cursorEnterFunc = 0;
  // GLFWcursorenterfun
  this.scrollFunc = 0;
  // GLFWscrollfun
  this.dropFunc = 0;
  // GLFWdropfun
  this.keyFunc = 0;
  // GLFWkeyfun
  this.charFunc = 0;
  // GLFWcharfun
  this.userptr = 0;
}

function _emscripten_set_window_title(title) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(29, 0, 1, title);
  return document.title = UTF8ToString(title);
}

var GLFW = {
  WindowFromId: id => {
    if (id <= 0 || !GLFW.windows) return null;
    return GLFW.windows[id - 1];
  },
  joystickFunc: 0,
  errorFunc: 0,
  monitorFunc: 0,
  active: null,
  scale: null,
  windows: null,
  monitors: null,
  monitorString: null,
  versionString: null,
  initialTime: null,
  extensions: null,
  devicePixelRatioMQL: null,
  hints: null,
  primaryTouchId: null,
  defaultHints: {
    131073: 0,
    131074: 0,
    131075: 1,
    131076: 1,
    131077: 1,
    131082: 0,
    135169: 8,
    135170: 8,
    135171: 8,
    135172: 8,
    135173: 24,
    135174: 8,
    135175: 0,
    135176: 0,
    135177: 0,
    135178: 0,
    135179: 0,
    135180: 0,
    135181: 0,
    135182: 0,
    135183: 0,
    139265: 196609,
    139266: 1,
    139267: 0,
    139268: 0,
    139269: 0,
    139270: 0,
    139271: 0,
    139272: 0,
    139276: 0
  },
  DOMToGLFWKeyCode: keycode => {
    switch (keycode) {
     // these keycodes are only defined for GLFW3, assume they are the same for GLFW2
      case 32:
      return 32;

     // DOM_VK_SPACE -> GLFW_KEY_SPACE
      case 222:
      return 39;

     // DOM_VK_QUOTE -> GLFW_KEY_APOSTROPHE
      case 188:
      return 44;

     // DOM_VK_COMMA -> GLFW_KEY_COMMA
      case 173:
      return 45;

     // DOM_VK_HYPHEN_MINUS -> GLFW_KEY_MINUS
      case 189:
      return 45;

     // DOM_VK_MINUS -> GLFW_KEY_MINUS
      case 190:
      return 46;

     // DOM_VK_PERIOD -> GLFW_KEY_PERIOD
      case 191:
      return 47;

     // DOM_VK_SLASH -> GLFW_KEY_SLASH
      case 48:
      return 48;

     // DOM_VK_0 -> GLFW_KEY_0
      case 49:
      return 49;

     // DOM_VK_1 -> GLFW_KEY_1
      case 50:
      return 50;

     // DOM_VK_2 -> GLFW_KEY_2
      case 51:
      return 51;

     // DOM_VK_3 -> GLFW_KEY_3
      case 52:
      return 52;

     // DOM_VK_4 -> GLFW_KEY_4
      case 53:
      return 53;

     // DOM_VK_5 -> GLFW_KEY_5
      case 54:
      return 54;

     // DOM_VK_6 -> GLFW_KEY_6
      case 55:
      return 55;

     // DOM_VK_7 -> GLFW_KEY_7
      case 56:
      return 56;

     // DOM_VK_8 -> GLFW_KEY_8
      case 57:
      return 57;

     // DOM_VK_9 -> GLFW_KEY_9
      case 59:
      return 59;

     // DOM_VK_SEMICOLON -> GLFW_KEY_SEMICOLON
      case 61:
      return 61;

     // DOM_VK_EQUALS -> GLFW_KEY_EQUAL
      case 187:
      return 61;

     // DOM_VK_EQUALS -> GLFW_KEY_EQUAL
      case 65:
      return 65;

     // DOM_VK_A -> GLFW_KEY_A
      case 66:
      return 66;

     // DOM_VK_B -> GLFW_KEY_B
      case 67:
      return 67;

     // DOM_VK_C -> GLFW_KEY_C
      case 68:
      return 68;

     // DOM_VK_D -> GLFW_KEY_D
      case 69:
      return 69;

     // DOM_VK_E -> GLFW_KEY_E
      case 70:
      return 70;

     // DOM_VK_F -> GLFW_KEY_F
      case 71:
      return 71;

     // DOM_VK_G -> GLFW_KEY_G
      case 72:
      return 72;

     // DOM_VK_H -> GLFW_KEY_H
      case 73:
      return 73;

     // DOM_VK_I -> GLFW_KEY_I
      case 74:
      return 74;

     // DOM_VK_J -> GLFW_KEY_J
      case 75:
      return 75;

     // DOM_VK_K -> GLFW_KEY_K
      case 76:
      return 76;

     // DOM_VK_L -> GLFW_KEY_L
      case 77:
      return 77;

     // DOM_VK_M -> GLFW_KEY_M
      case 78:
      return 78;

     // DOM_VK_N -> GLFW_KEY_N
      case 79:
      return 79;

     // DOM_VK_O -> GLFW_KEY_O
      case 80:
      return 80;

     // DOM_VK_P -> GLFW_KEY_P
      case 81:
      return 81;

     // DOM_VK_Q -> GLFW_KEY_Q
      case 82:
      return 82;

     // DOM_VK_R -> GLFW_KEY_R
      case 83:
      return 83;

     // DOM_VK_S -> GLFW_KEY_S
      case 84:
      return 84;

     // DOM_VK_T -> GLFW_KEY_T
      case 85:
      return 85;

     // DOM_VK_U -> GLFW_KEY_U
      case 86:
      return 86;

     // DOM_VK_V -> GLFW_KEY_V
      case 87:
      return 87;

     // DOM_VK_W -> GLFW_KEY_W
      case 88:
      return 88;

     // DOM_VK_X -> GLFW_KEY_X
      case 89:
      return 89;

     // DOM_VK_Y -> GLFW_KEY_Y
      case 90:
      return 90;

     // DOM_VK_Z -> GLFW_KEY_Z
      case 219:
      return 91;

     // DOM_VK_OPEN_BRACKET -> GLFW_KEY_LEFT_BRACKET
      case 220:
      return 92;

     // DOM_VK_BACKSLASH -> GLFW_KEY_BACKSLASH
      case 221:
      return 93;

     // DOM_VK_CLOSE_BRACKET -> GLFW_KEY_RIGHT_BRACKET
      case 192:
      return 96;

     // DOM_VK_BACK_QUOTE -> GLFW_KEY_GRAVE_ACCENT
      case 27:
      return 256;

     // DOM_VK_ESCAPE -> GLFW_KEY_ESCAPE
      case 13:
      return 257;

     // DOM_VK_RETURN -> GLFW_KEY_ENTER
      case 9:
      return 258;

     // DOM_VK_TAB -> GLFW_KEY_TAB
      case 8:
      return 259;

     // DOM_VK_BACK -> GLFW_KEY_BACKSPACE
      case 45:
      return 260;

     // DOM_VK_INSERT -> GLFW_KEY_INSERT
      case 46:
      return 261;

     // DOM_VK_DELETE -> GLFW_KEY_DELETE
      case 39:
      return 262;

     // DOM_VK_RIGHT -> GLFW_KEY_RIGHT
      case 37:
      return 263;

     // DOM_VK_LEFT -> GLFW_KEY_LEFT
      case 40:
      return 264;

     // DOM_VK_DOWN -> GLFW_KEY_DOWN
      case 38:
      return 265;

     // DOM_VK_UP -> GLFW_KEY_UP
      case 33:
      return 266;

     // DOM_VK_PAGE_UP -> GLFW_KEY_PAGE_UP
      case 34:
      return 267;

     // DOM_VK_PAGE_DOWN -> GLFW_KEY_PAGE_DOWN
      case 36:
      return 268;

     // DOM_VK_HOME -> GLFW_KEY_HOME
      case 35:
      return 269;

     // DOM_VK_END -> GLFW_KEY_END
      case 20:
      return 280;

     // DOM_VK_CAPS_LOCK -> GLFW_KEY_CAPS_LOCK
      case 145:
      return 281;

     // DOM_VK_SCROLL_LOCK -> GLFW_KEY_SCROLL_LOCK
      case 144:
      return 282;

     // DOM_VK_NUM_LOCK -> GLFW_KEY_NUM_LOCK
      case 44:
      return 283;

     // DOM_VK_SNAPSHOT -> GLFW_KEY_PRINT_SCREEN
      case 19:
      return 284;

     // DOM_VK_PAUSE -> GLFW_KEY_PAUSE
      case 112:
      return 290;

     // DOM_VK_F1 -> GLFW_KEY_F1
      case 113:
      return 291;

     // DOM_VK_F2 -> GLFW_KEY_F2
      case 114:
      return 292;

     // DOM_VK_F3 -> GLFW_KEY_F3
      case 115:
      return 293;

     // DOM_VK_F4 -> GLFW_KEY_F4
      case 116:
      return 294;

     // DOM_VK_F5 -> GLFW_KEY_F5
      case 117:
      return 295;

     // DOM_VK_F6 -> GLFW_KEY_F6
      case 118:
      return 296;

     // DOM_VK_F7 -> GLFW_KEY_F7
      case 119:
      return 297;

     // DOM_VK_F8 -> GLFW_KEY_F8
      case 120:
      return 298;

     // DOM_VK_F9 -> GLFW_KEY_F9
      case 121:
      return 299;

     // DOM_VK_F10 -> GLFW_KEY_F10
      case 122:
      return 300;

     // DOM_VK_F11 -> GLFW_KEY_F11
      case 123:
      return 301;

     // DOM_VK_F12 -> GLFW_KEY_F12
      case 124:
      return 302;

     // DOM_VK_F13 -> GLFW_KEY_F13
      case 125:
      return 303;

     // DOM_VK_F14 -> GLFW_KEY_F14
      case 126:
      return 304;

     // DOM_VK_F15 -> GLFW_KEY_F15
      case 127:
      return 305;

     // DOM_VK_F16 -> GLFW_KEY_F16
      case 128:
      return 306;

     // DOM_VK_F17 -> GLFW_KEY_F17
      case 129:
      return 307;

     // DOM_VK_F18 -> GLFW_KEY_F18
      case 130:
      return 308;

     // DOM_VK_F19 -> GLFW_KEY_F19
      case 131:
      return 309;

     // DOM_VK_F20 -> GLFW_KEY_F20
      case 132:
      return 310;

     // DOM_VK_F21 -> GLFW_KEY_F21
      case 133:
      return 311;

     // DOM_VK_F22 -> GLFW_KEY_F22
      case 134:
      return 312;

     // DOM_VK_F23 -> GLFW_KEY_F23
      case 135:
      return 313;

     // DOM_VK_F24 -> GLFW_KEY_F24
      case 136:
      return 314;

     // 0x88 (not used?) -> GLFW_KEY_F25
      case 96:
      return 320;

     // DOM_VK_NUMPAD0 -> GLFW_KEY_KP_0
      case 97:
      return 321;

     // DOM_VK_NUMPAD1 -> GLFW_KEY_KP_1
      case 98:
      return 322;

     // DOM_VK_NUMPAD2 -> GLFW_KEY_KP_2
      case 99:
      return 323;

     // DOM_VK_NUMPAD3 -> GLFW_KEY_KP_3
      case 100:
      return 324;

     // DOM_VK_NUMPAD4 -> GLFW_KEY_KP_4
      case 101:
      return 325;

     // DOM_VK_NUMPAD5 -> GLFW_KEY_KP_5
      case 102:
      return 326;

     // DOM_VK_NUMPAD6 -> GLFW_KEY_KP_6
      case 103:
      return 327;

     // DOM_VK_NUMPAD7 -> GLFW_KEY_KP_7
      case 104:
      return 328;

     // DOM_VK_NUMPAD8 -> GLFW_KEY_KP_8
      case 105:
      return 329;

     // DOM_VK_NUMPAD9 -> GLFW_KEY_KP_9
      case 110:
      return 330;

     // DOM_VK_DECIMAL -> GLFW_KEY_KP_DECIMAL
      case 111:
      return 331;

     // DOM_VK_DIVIDE -> GLFW_KEY_KP_DIVIDE
      case 106:
      return 332;

     // DOM_VK_MULTIPLY -> GLFW_KEY_KP_MULTIPLY
      case 109:
      return 333;

     // DOM_VK_SUBTRACT -> GLFW_KEY_KP_SUBTRACT
      case 107:
      return 334;

     // DOM_VK_ADD -> GLFW_KEY_KP_ADD
      // case 0x0D:return 335; // DOM_VK_RETURN -> GLFW_KEY_KP_ENTER (DOM_KEY_LOCATION_RIGHT)
      // case 0x61:return 336; // DOM_VK_EQUALS -> GLFW_KEY_KP_EQUAL (DOM_KEY_LOCATION_RIGHT)
      case 16:
      return 340;

     // DOM_VK_SHIFT -> GLFW_KEY_LEFT_SHIFT
      case 17:
      return 341;

     // DOM_VK_CONTROL -> GLFW_KEY_LEFT_CONTROL
      case 18:
      return 342;

     // DOM_VK_ALT -> GLFW_KEY_LEFT_ALT
      case 91:
      return 343;

     // DOM_VK_WIN -> GLFW_KEY_LEFT_SUPER
      case 224:
      return 343;

     // DOM_VK_META -> GLFW_KEY_LEFT_SUPER
      // case 0x10:return 344; // DOM_VK_SHIFT -> GLFW_KEY_RIGHT_SHIFT (DOM_KEY_LOCATION_RIGHT)
      // case 0x11:return 345; // DOM_VK_CONTROL -> GLFW_KEY_RIGHT_CONTROL (DOM_KEY_LOCATION_RIGHT)
      // case 0x12:return 346; // DOM_VK_ALT -> GLFW_KEY_RIGHT_ALT (DOM_KEY_LOCATION_RIGHT)
      // case 0x5B:return 347; // DOM_VK_WIN -> GLFW_KEY_RIGHT_SUPER (DOM_KEY_LOCATION_RIGHT)
      case 93:
      return 348;

     // DOM_VK_CONTEXT_MENU -> GLFW_KEY_MENU
      // XXX: GLFW_KEY_WORLD_1, GLFW_KEY_WORLD_2 what are these?
      default:
      return -1;
    }
  },
  getModBits: win => {
    var mod = 0;
    if (win.keys[340]) mod |= 1;
    // GLFW_MOD_SHIFT
    if (win.keys[341]) mod |= 2;
    // GLFW_MOD_CONTROL
    if (win.keys[342]) mod |= 4;
    // GLFW_MOD_ALT
    if (win.keys[343] || win.keys[348]) mod |= 8;
    // GLFW_MOD_SUPER
    // add caps and num lock keys? only if lock_key_mod is set
    return mod;
  },
  onKeyPress: event => {
    if (!GLFW.active || !GLFW.active.charFunc) return;
    if (event.ctrlKey || event.metaKey) return;
    // correct unicode charCode is only available with onKeyPress event
    var charCode = event.charCode;
    if (charCode == 0 || (charCode >= 0 && charCode <= 31)) return;
    getWasmTableEntry(GLFW.active.charFunc)(GLFW.active.id, charCode);
  },
  onKeyChanged: (keyCode, status) => {
    if (!GLFW.active) return;
    var key = GLFW.DOMToGLFWKeyCode(keyCode);
    if (key == -1) return;
    var repeat = status && GLFW.active.keys[key];
    GLFW.active.keys[key] = status;
    GLFW.active.domKeys[keyCode] = status;
    if (GLFW.active.keyFunc) {
      if (repeat) status = 2;
      // GLFW_REPEAT
      getWasmTableEntry(GLFW.active.keyFunc)(GLFW.active.id, key, keyCode, status, GLFW.getModBits(GLFW.active));
    }
  },
  onGamepadConnected: event => {
    GLFW.refreshJoysticks();
  },
  onGamepadDisconnected: event => {
    GLFW.refreshJoysticks();
  },
  onKeydown: event => {
    GLFW.onKeyChanged(event.keyCode, 1);
    // GLFW_PRESS or GLFW_REPEAT
    // This logic comes directly from the sdl implementation. We cannot
    // call preventDefault on all keydown events otherwise onKeyPress will
    // not get called
    if (event.key == "Backspace" || event.key == "Tab") {
      event.preventDefault();
    }
  },
  onKeyup: event => {
    GLFW.onKeyChanged(event.keyCode, 0);
  },
  onBlur: event => {
    if (!GLFW.active) return;
    for (var i = 0; i < GLFW.active.domKeys.length; ++i) {
      if (GLFW.active.domKeys[i]) {
        GLFW.onKeyChanged(i, 0);
      }
    }
  },
  onMousemove: event => {
    if (!GLFW.active) return;
    if (event.type === "touchmove") {
      // Handling for touch events that are being converted to mouse input.
      // Don't let the browser fire a duplicate mouse event.
      event.preventDefault();
      let primaryChanged = false;
      for (let i of event.changedTouches) {
        // If our chosen primary touch moved, update Browser mouse coords
        if (GLFW.primaryTouchId === i.identifier) {
          Browser.setMouseCoords(i.pageX, i.pageY);
          primaryChanged = true;
          break;
        }
      }
      if (!primaryChanged) {
        // Do not send mouse events if some touch other than the primary triggered this.
        return;
      }
    } else {
      // Handling for non-touch mouse input events.
      Browser.calculateMouseEvent(event);
    }
    if (event.target != Browser.getCanvas() || !GLFW.active.cursorPosFunc) return;
    if (GLFW.active.cursorPosFunc) {
      getWasmTableEntry(GLFW.active.cursorPosFunc)(GLFW.active.id, Browser.mouseX, Browser.mouseY);
    }
  },
  DOMToGLFWMouseButton: event => {
    // DOM and glfw have different button codes.
    // See http://www.w3schools.com/jsref/event_button.asp.
    var eventButton = event["button"];
    if (eventButton > 0) {
      if (eventButton == 1) {
        eventButton = 2;
      } else {
        eventButton = 1;
      }
    }
    return eventButton;
  },
  onMouseenter: event => {
    if (!GLFW.active) return;
    if (event.target != Browser.getCanvas()) return;
    if (GLFW.active.cursorEnterFunc) {
      getWasmTableEntry(GLFW.active.cursorEnterFunc)(GLFW.active.id, 1);
    }
  },
  onMouseleave: event => {
    if (!GLFW.active) return;
    if (event.target != Browser.getCanvas()) return;
    if (GLFW.active.cursorEnterFunc) {
      getWasmTableEntry(GLFW.active.cursorEnterFunc)(GLFW.active.id, 0);
    }
  },
  onMouseButtonChanged: (event, status) => {
    if (!GLFW.active) return;
    if (event.target != Browser.getCanvas()) return;
    // Is this from a touch event?
    const isTouchType = event.type === "touchstart" || event.type === "touchend" || event.type === "touchcancel";
    // Only emulating mouse left-click behavior for touches.
    let eventButton = 0;
    if (isTouchType) {
      // Handling for touch events that are being converted to mouse input.
      // Don't let the browser fire a duplicate mouse event.
      event.preventDefault();
      let primaryChanged = false;
      // Set a primary touch if we have none.
      if (GLFW.primaryTouchId === null && event.type === "touchstart" && event.targetTouches.length > 0) {
        // Pick the first touch that started in the canvas and treat it as primary.
        const chosenTouch = event.targetTouches[0];
        GLFW.primaryTouchId = chosenTouch.identifier;
        Browser.setMouseCoords(chosenTouch.pageX, chosenTouch.pageY);
        primaryChanged = true;
      } else if (event.type === "touchend" || event.type === "touchcancel") {
        // Clear the primary touch if it ended.
        for (let i of event.changedTouches) {
          // If our chosen primary touch ended, remove it.
          if (GLFW.primaryTouchId === i.identifier) {
            GLFW.primaryTouchId = null;
            primaryChanged = true;
            break;
          }
        }
      }
      if (!primaryChanged) {
        // Do not send mouse events if some touch other than the primary triggered this.
        return;
      }
    } else {
      // Handling for non-touch mouse input events.
      Browser.calculateMouseEvent(event);
      eventButton = GLFW.DOMToGLFWMouseButton(event);
    }
    if (status == 1) {
      // GLFW_PRESS
      GLFW.active.buttons |= (1 << eventButton);
      try {
        event.target.setCapture();
      } catch (e) {}
    } else {
      // GLFW_RELEASE
      GLFW.active.buttons &= ~(1 << eventButton);
    }
    // Send mouse event to GLFW.
    if (GLFW.active.mouseButtonFunc) {
      getWasmTableEntry(GLFW.active.mouseButtonFunc)(GLFW.active.id, eventButton, status, GLFW.getModBits(GLFW.active));
    }
  },
  onMouseButtonDown: event => {
    if (!GLFW.active) return;
    GLFW.onMouseButtonChanged(event, 1);
  },
  onMouseButtonUp: event => {
    if (!GLFW.active) return;
    GLFW.onMouseButtonChanged(event, 0);
  },
  onMouseWheel: event => {
    // Note the minus sign that flips browser wheel direction (positive direction scrolls page down) to native wheel direction (positive direction is mouse wheel up)
    var delta = -Browser.getMouseWheelDelta(event);
    delta = (delta == 0) ? 0 : (delta > 0 ? Math.max(delta, 1) : Math.min(delta, -1));
    // Quantize to integer so that minimum scroll is at least +/- 1.
    GLFW.wheelPos += delta;
    if (!GLFW.active || !GLFW.active.scrollFunc || event.target != Browser.getCanvas()) return;
    var sx = 0;
    var sy = delta;
    if (event.type == "mousewheel") {
      sx = event.wheelDeltaX;
    } else {
      sx = event.deltaX;
    }
    getWasmTableEntry(GLFW.active.scrollFunc)(GLFW.active.id, sx, sy);
    event.preventDefault();
  },
  onCanvasResize: (width, height, framebufferWidth, framebufferHeight) => {
    if (!GLFW.active) return;
    var resizeNeeded = false;
    // If the client is requesting fullscreen mode
    if (getFullscreenElement()) {
      if (!GLFW.active.fullscreen) {
        resizeNeeded = width != screen.width || height != screen.height;
        GLFW.active.storedX = GLFW.active.x;
        GLFW.active.storedY = GLFW.active.y;
        GLFW.active.storedWidth = GLFW.active.width;
        GLFW.active.storedHeight = GLFW.active.height;
        GLFW.active.x = GLFW.active.y = 0;
        GLFW.active.width = screen.width;
        GLFW.active.height = screen.height;
        GLFW.active.fullscreen = true;
      }
    } else if (GLFW.active.fullscreen == true) {
      resizeNeeded = width != GLFW.active.storedWidth || height != GLFW.active.storedHeight;
      GLFW.active.x = GLFW.active.storedX;
      GLFW.active.y = GLFW.active.storedY;
      GLFW.active.width = GLFW.active.storedWidth;
      GLFW.active.height = GLFW.active.storedHeight;
      GLFW.active.fullscreen = false;
    }
    if (resizeNeeded) {
      // width or height is changed (fullscreen / exit fullscreen) which will call this listener back
      // with proper framebufferWidth/framebufferHeight
      Browser.setCanvasSize(GLFW.active.width, GLFW.active.height);
    } else if (GLFW.active.width != width || GLFW.active.height != height || GLFW.active.framebufferWidth != framebufferWidth || GLFW.active.framebufferHeight != framebufferHeight) {
      GLFW.active.width = width;
      GLFW.active.height = height;
      GLFW.active.framebufferWidth = framebufferWidth;
      GLFW.active.framebufferHeight = framebufferHeight;
      GLFW.onWindowSizeChanged();
      GLFW.onFramebufferSizeChanged();
    }
  },
  onWindowSizeChanged: () => {
    if (!GLFW.active) return;
    if (GLFW.active.windowSizeFunc) {
      getWasmTableEntry(GLFW.active.windowSizeFunc)(GLFW.active.id, GLFW.active.width, GLFW.active.height);
    }
  },
  onFramebufferSizeChanged: () => {
    if (!GLFW.active) return;
    if (GLFW.active.framebufferSizeFunc) {
      getWasmTableEntry(GLFW.active.framebufferSizeFunc)(GLFW.active.id, GLFW.active.framebufferWidth, GLFW.active.framebufferHeight);
    }
  },
  onWindowContentScaleChanged: scale => {
    GLFW.scale = scale;
    if (!GLFW.active) return;
    if (GLFW.active.windowContentScaleFunc) {
      getWasmTableEntry(GLFW.active.windowContentScaleFunc)(GLFW.active.id, GLFW.scale, GLFW.scale);
    }
  },
  getTime: () => _emscripten_get_now() / 1e3,
  setWindowTitle: (winid, title) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return;
    win.title = title;
    if (GLFW.active.id == win.id) {
      _emscripten_set_window_title(title);
    }
  },
  setJoystickCallback: cbfun => {
    var prevcbfun = GLFW.joystickFunc;
    GLFW.joystickFunc = cbfun;
    GLFW.refreshJoysticks();
    return prevcbfun;
  },
  joys: {},
  lastGamepadState: [],
  lastGamepadStateFrame: null,
  refreshJoysticks: () => {
    // Produce a new Gamepad API sample if we are ticking a new game frame, or if not using emscripten_set_main_loop() at all to drive animation.
    if (MainLoop.currentFrameNumber !== GLFW.lastGamepadStateFrame || !MainLoop.currentFrameNumber) {
      GLFW.lastGamepadState = navigator.getGamepads?.() ?? [];
      GLFW.lastGamepadStateFrame = MainLoop.currentFrameNumber;
      for (var joy = 0; joy < GLFW.lastGamepadState.length; ++joy) {
        var gamepad = GLFW.lastGamepadState[joy];
        if (gamepad) {
          if (!GLFW.joys[joy]) {
            out("glfw joystick connected:", joy);
            GLFW.joys[joy] = {
              id: stringToNewUTF8(gamepad.id),
              buttonsCount: gamepad.buttons.length,
              axesCount: gamepad.axes.length,
              buttons: _malloc(gamepad.buttons.length),
              axes: _malloc(gamepad.axes.length * 4)
            };
            if (GLFW.joystickFunc) {
              getWasmTableEntry(GLFW.joystickFunc)(joy, 262145);
            }
          }
          var data = GLFW.joys[joy];
          for (var i = 0; i < gamepad.buttons.length; ++i) {
            (growMemViews(), HEAP8)[data.buttons + i] = gamepad.buttons[i].pressed;
          }
          for (var i = 0; i < gamepad.axes.length; ++i) {
            (growMemViews(), HEAPF32)[((data.axes + i * 4) >> 2)] = gamepad.axes[i];
          }
        } else {
          if (GLFW.joys[joy]) {
            out("glfw joystick disconnected", joy);
            if (GLFW.joystickFunc) {
              getWasmTableEntry(GLFW.joystickFunc)(joy, 262146);
            }
            _free(GLFW.joys[joy].id);
            _free(GLFW.joys[joy].buttons);
            _free(GLFW.joys[joy].axes);
            delete GLFW.joys[joy];
          }
        }
      }
    }
  },
  setKeyCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.keyFunc;
    win.keyFunc = cbfun;
    return prevcbfun;
  },
  setCharCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.charFunc;
    win.charFunc = cbfun;
    return prevcbfun;
  },
  setMouseButtonCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.mouseButtonFunc;
    win.mouseButtonFunc = cbfun;
    return prevcbfun;
  },
  setCursorPosCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.cursorPosFunc;
    win.cursorPosFunc = cbfun;
    return prevcbfun;
  },
  setScrollCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.scrollFunc;
    win.scrollFunc = cbfun;
    return prevcbfun;
  },
  setDropCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.dropFunc;
    win.dropFunc = cbfun;
    return prevcbfun;
  },
  onDrop: event => {
    if (!GLFW.active || !GLFW.active.dropFunc) return;
    if (!event.dataTransfer || !event.dataTransfer.files || event.dataTransfer.files.length == 0) return;
    event.preventDefault();
    var drop_dir = ".glfw_dropped_files";
    var filenames = _malloc(event.dataTransfer.files.length * 4);
    var filenamesArray = [];
    for (var i = 0; i < event.dataTransfer.files.length; ++i) {
      var path = `/${drop_dir}/${event.dataTransfer.files[i].name.replace(/\//g, "_")}`;
      var filename = stringToNewUTF8(path);
      filenamesArray.push(filename);
      (growMemViews(), HEAPU32)[(((filenames) + (i * 4)) >> 2)] = filename;
    }
    // Read and save the files to emscripten's FS
    var written = 0;
    FS.createPath("/", drop_dir);
    function save(file, in_path, numfiles) {
      var path = "/" + drop_dir + in_path + "/" + file.name.replace(/\//g, "_");
      var reader = new FileReader;
      reader.onloadend = e => {
        if (reader.readyState != 2) {
          // not DONE
          ++written;
          err(`failed to read dropped file: ${in_path}/${file.name}: ${reader.error}`);
          return;
        }
        var data = e.target.result;
        FS.writeFile(path, new Uint8Array(data));
        if (++written === numfiles) {
          getWasmTableEntry(GLFW.active.dropFunc)(GLFW.active.id, filenamesArray.length, filenames);
          for (var i = 0; i < filenamesArray.length; ++i) {
            _free(filenamesArray[i]);
          }
          _free(filenames);
        }
      };
      reader.readAsArrayBuffer(file);
    }
    let filesQ = [];
    function finalize() {
      var count = filesQ.length;
      for (var i = 0; i < count; ++i) {
        save(filesQ[i].file, filesQ[i].path, count);
      }
    }
    if (DataTransferItem.prototype.webkitGetAsEntry) {
      let entriesTree = {};
      function markDone(fullpath, recursive) {
        if (entriesTree[fullpath].subpaths.length != 0) return;
        delete entriesTree[fullpath];
        let parentpath = fullpath.substring(0, fullpath.lastIndexOf("/"));
        if (!entriesTree.hasOwnProperty(parentpath)) {
          if (Object.keys(entriesTree).length == 0) finalize();
          return;
        }
        const fpIndex = entriesTree[parentpath].subpaths.indexOf(fullpath);
        if (fpIndex > -1) entriesTree[parentpath].subpaths.splice(fpIndex, 1);
        if (recursive) markDone(parentpath, true);
        if (Object.keys(entriesTree).length == 0) finalize();
      }
      function processEntry(entry) {
        let fp = entry.fullPath;
        let pp = fp.substring(0, fp.lastIndexOf("/"));
        entriesTree[fp] = {
          subpaths: []
        };
        if (entry.isFile) {
          entry.file(f => {
            filesQ.push({
              file: f,
              path: pp
            });
            markDone(fp, false);
          });
        } else if (entry.isDirectory) {
          if (entriesTree.hasOwnProperty(pp)) entriesTree[pp].subpaths.push(fp);
          FS.createPath("/" + drop_dir + pp, entry.name);
          var reader = entry.createReader();
          var rRead = function(dirEntries) {
            if (dirEntries.length == 0) {
              markDone(fp, true);
              return;
            }
            for (const ent of dirEntries) processEntry(ent);
            reader.readEntries(rRead);
          };
          reader.readEntries(rRead);
        }
      }
      for (const item of event.dataTransfer.items) {
        processEntry(item.webkitGetAsEntry());
      }
    } else {
      // fallback for browsers that does not support webkitGetAsEntry
      for (const file of event.dataTransfer.files) {
        filesQ.push({
          file,
          path: ""
        });
      }
      finalize();
    }
    return false;
  },
  onDragover: event => {
    if (!GLFW.active || !GLFW.active.dropFunc) return;
    event.preventDefault();
    return false;
  },
  setWindowSizeCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.windowSizeFunc;
    win.windowSizeFunc = cbfun;
    return prevcbfun;
  },
  setWindowCloseCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.windowCloseFunc;
    win.windowCloseFunc = cbfun;
    return prevcbfun;
  },
  setWindowRefreshCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.windowRefreshFunc;
    win.windowRefreshFunc = cbfun;
    return prevcbfun;
  },
  onClickRequestPointerLock: e => {
    var canvas = Browser.getCanvas();
    if (!Browser.pointerLock && canvas.requestPointerLock) {
      canvas.requestPointerLock();
      e.preventDefault();
    }
  },
  setInputMode: (winid, mode, value) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return;
    switch (mode) {
     case 208897:
      {
        // GLFW_CURSOR
        var canvas = Browser.getCanvas();
        switch (value) {
         case 212993:
          {
            // GLFW_CURSOR_NORMAL
            win.inputModes[mode] = value;
            canvas.removeEventListener("click", GLFW.onClickRequestPointerLock, true);
            document.exitPointerLock();
            break;
          }

         case 212994:
          {
            // GLFW_CURSOR_HIDDEN
            err("glfwSetInputMode called with GLFW_CURSOR_HIDDEN value not implemented");
            break;
          }

         case 212995:
          {
            // GLFW_CURSOR_DISABLED
            win.inputModes[mode] = value;
            canvas.addEventListener("click", GLFW.onClickRequestPointerLock, true);
            canvas.requestPointerLock();
            break;
          }

         default:
          {
            err(`glfwSetInputMode called with unknown value parameter value: ${value}`);
            break;
          }
        }
        break;
      }

     case 208898:
      {
        // GLFW_STICKY_KEYS
        err("glfwSetInputMode called with GLFW_STICKY_KEYS mode not implemented");
        break;
      }

     case 208899:
      {
        // GLFW_STICKY_MOUSE_BUTTONS
        err("glfwSetInputMode called with GLFW_STICKY_MOUSE_BUTTONS mode not implemented");
        break;
      }

     case 208900:
      {
        // GLFW_LOCK_KEY_MODS
        err("glfwSetInputMode called with GLFW_LOCK_KEY_MODS mode not implemented");
        break;
      }

     case 208901:
      {
        // GLFW_RAW_MOUSE_MOTION
        err("glfwSetInputMode called with GLFW_RAW_MOUSE_MOTION mode not implemented");
        break;
      }

     default:
      {
        err(`glfwSetInputMode called with unknown mode parameter value: ${mode}`);
        break;
      }
    }
  },
  getKey: (winid, key) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return 0;
    return win.keys[key];
  },
  getMouseButton: (winid, button) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return 0;
    return (win.buttons & (1 << button)) > 0;
  },
  getCursorPos: (winid, x, y) => {
    (growMemViews(), HEAPF64)[((x) >> 3)] = Browser.mouseX;
    (growMemViews(), HEAPF64)[((y) >> 3)] = Browser.mouseY;
  },
  getMousePos: (winid, x, y) => {
    (growMemViews(), HEAP32)[((x) >> 2)] = Browser.mouseX;
    (growMemViews(), HEAP32)[((y) >> 2)] = Browser.mouseY;
  },
  setCursorPos: (winid, x, y) => {},
  getWindowPos: (winid, x, y) => {
    var wx = 0;
    var wy = 0;
    var win = GLFW.WindowFromId(winid);
    if (win) {
      wx = win.x;
      wy = win.y;
    }
    if (x) {
      (growMemViews(), HEAP32)[((x) >> 2)] = wx;
    }
    if (y) {
      (growMemViews(), HEAP32)[((y) >> 2)] = wy;
    }
  },
  setWindowPos: (winid, x, y) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return;
    win.x = x;
    win.y = y;
  },
  getWindowSize: (winid, width, height) => {
    var ww = 0;
    var wh = 0;
    var win = GLFW.WindowFromId(winid);
    if (win) {
      ww = win.width;
      wh = win.height;
    }
    if (width) {
      (growMemViews(), HEAP32)[((width) >> 2)] = ww;
    }
    if (height) {
      (growMemViews(), HEAP32)[((height) >> 2)] = wh;
    }
  },
  setWindowSize: (winid, width, height) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return;
    if (GLFW.active.id == win.id) {
      Browser.setCanvasSize(width, height);
    }
  },
  defaultWindowHints: () => {
    GLFW.hints = {
      ...GLFW.defaultHints
    };
  },
  createWindow: (width, height, title, monitor, share) => {
    var i, id;
    for (i = 0; i < GLFW.windows.length && GLFW.windows[i] !== null; i++) {}
    if (i > 0) abort("glfwCreateWindow only supports one window at time currently");
    // id for window
    id = i + 1;
    // not valid
    if (width <= 0 || height <= 0) return 0;
    if (monitor) {
      Browser.requestFullscreen();
    } else {
      Browser.setCanvasSize(width, height);
    }
    // Create context when there are no existing alive windows
    for (i = 0; i < GLFW.windows.length && GLFW.windows[i] == null; i++) {}
    const canvas = Browser.getCanvas();
    var useWebGL = GLFW.hints[139265] > 0;
    // Use WebGL when we are told to based on GLFW_CLIENT_API
    if (i == GLFW.windows.length) {
      if (useWebGL) {
        var contextAttributes = {
          antialias: (GLFW.hints[135181] > 1),
          // GLFW_SAMPLES
          depth: (GLFW.hints[135173] > 0),
          // GLFW_DEPTH_BITS
          stencil: (GLFW.hints[135174] > 0),
          // GLFW_STENCIL_BITS
          alpha: (GLFW.hints[135172] > 0)
        };
        Browser.createContext(canvas, /*useWebGL=*/ true, /*setInModule=*/ true, contextAttributes);
      } else {
        Browser.init();
      }
    }
    // If context creation failed, do not return a valid window
    if (!Module["ctx"] && useWebGL) return 0;
    // Initializes the framebuffer size from the canvas
    var win = new GLFW_Window(id, width, height, canvas.width, canvas.height, title, monitor, share);
    // Set window to array
    if (id - 1 == GLFW.windows.length) {
      GLFW.windows.push(win);
    } else {
      GLFW.windows[id - 1] = win;
    }
    GLFW.active = win;
    GLFW.adjustCanvasDimensions();
    return win.id;
  },
  destroyWindow: winid => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return;
    if (win.windowCloseFunc) {
      getWasmTableEntry(win.windowCloseFunc)(win.id);
    }
    GLFW.windows[win.id - 1] = null;
    if (GLFW.active.id == win.id) {
      GLFW.active = null;
    }
    // Destroy context when no alive windows
    for (win of GLFW.windows) {
      if (win !== null) return;
    }
    delete Module["ctx"];
  },
  swapBuffers: winid => {},
  requestFullscreen(lockPointer, resizeCanvas) {
    Browser.lockPointer = lockPointer;
    Browser.resizeCanvas = resizeCanvas;
    if (typeof Browser.lockPointer == "undefined") Browser.lockPointer = true;
    if (typeof Browser.resizeCanvas == "undefined") Browser.resizeCanvas = false;
    var canvas = Browser.getCanvas();
    function fullscreenChange() {
      Browser.isFullscreen = false;
      var canvasContainer = canvas.parentNode;
      if (getFullscreenElement() === canvasContainer) {
        canvas.exitFullscreen = Browser.exitFullscreen;
        if (Browser.lockPointer) canvas.requestPointerLock();
        Browser.isFullscreen = true;
        if (Browser.resizeCanvas) {
          Browser.setFullscreenCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
          Browser.updateResizeListeners();
        }
      } else {
        // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
        canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
        canvasContainer.parentNode.removeChild(canvasContainer);
        if (Browser.resizeCanvas) {
          Browser.setWindowedCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
          Browser.updateResizeListeners();
        }
      }
    }
    if (!Browser.fullscreenHandlersInstalled) {
      Browser.fullscreenHandlersInstalled = true;
      document.addEventListener("fullscreenchange", fullscreenChange);
      document.addEventListener("webkitfullscreenchange", fullscreenChange);
    }
    // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
    var canvasContainer = document.createElement("div");
    canvas.parentNode.insertBefore(canvasContainer, canvas);
    canvasContainer.appendChild(canvas);
    // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
    // Safari didn't Element.requestFullscreen support until 16.4
    // See: https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen
    /** @suppress {checkTypes} */ canvasContainer.requestFullscreen ??= (canvasContainer.webkitRequestFullscreen ? () => canvasContainer.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT) : null) ?? (canvasContainer.webkitRequestFullScreen ? () => canvasContainer.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) : null);
    canvasContainer.requestFullscreen();
  },
  updateCanvasDimensions(canvas, wNative, hNative) {
    const scale = GLFW.getHiDPIScale();
    if (wNative && hNative) {
      canvas.widthNative = wNative;
      canvas.heightNative = hNative;
    } else {
      wNative = canvas.widthNative;
      hNative = canvas.heightNative;
    }
    var w = wNative;
    var h = hNative;
    if ((getFullscreenElement() === canvas.parentNode) && (typeof screen != "undefined")) {
      var factor = Math.min(screen.width / w, screen.height / h);
      w = Math.round(w * factor);
      h = Math.round(h * factor);
    }
    if (Browser.resizeCanvas) {
      wNative = w;
      hNative = h;
    }
    const wNativeScaled = Math.floor(wNative * scale);
    const hNativeScaled = Math.floor(hNative * scale);
    if (canvas.width != wNativeScaled) canvas.width = wNativeScaled;
    if (canvas.height != hNativeScaled) canvas.height = hNativeScaled;
    if (typeof canvas.style != "undefined") {
      if (!GLFW.isCSSScalingEnabled()) {
        canvas.style.setProperty("width", wNative + "px", "important");
        canvas.style.setProperty("height", hNative + "px", "important");
      } else {
        canvas.style.removeProperty("width");
        canvas.style.removeProperty("height");
      }
    }
  },
  calculateMouseCoords(pageX, pageY) {
    // Calculate the movement based on the changes
    // in the coordinates.
    const rect = Browser.getCanvas().getBoundingClientRect();
    var adjustedX = pageX - (window.scrollX + rect.left);
    var adjustedY = pageY - (window.scrollY + rect.top);
    // getBoundingClientRect() returns dimension affected by CSS, so as a result:
    // - when CSS scaling is enabled, this will fix the mouse coordinates to match the width/height of the window
    // - otherwise the CSS width/height are forced to the width/height of the GLFW window (see updateCanvasDimensions),
    //   so there is no need to adjust the position
    if (GLFW.isCSSScalingEnabled() && GLFW.active) {
      adjustedX = adjustedX * (GLFW.active.width / rect.width);
      adjustedY = adjustedY * (GLFW.active.height / rect.height);
    }
    return {
      x: adjustedX,
      y: adjustedY
    };
  },
  setWindowAttrib: (winid, attrib, value) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return;
    const isHiDPIAware = GLFW.isHiDPIAware();
    win.attributes[attrib] = value;
    if (isHiDPIAware !== GLFW.isHiDPIAware()) GLFW.adjustCanvasDimensions();
  },
  getDevicePixelRatio() {
    return (typeof devicePixelRatio == "number" && devicePixelRatio) || 1;
  },
  isHiDPIAware() {
    if (GLFW.active) return GLFW.active.attributes[139276] > 0; else return false;
  },
  isCSSScalingEnabled() {
    return !GLFW.isHiDPIAware();
  },
  adjustCanvasDimensions() {
    if (GLFW.active) {
      Browser.updateCanvasDimensions(Browser.getCanvas(), GLFW.active.width, GLFW.active.height);
      Browser.updateResizeListeners();
    }
  },
  getHiDPIScale() {
    return GLFW.isHiDPIAware() ? GLFW.scale : 1;
  },
  onDevicePixelRatioChange() {
    GLFW.onWindowContentScaleChanged(GLFW.getDevicePixelRatio());
    GLFW.adjustCanvasDimensions();
  },
  GLFW2ParamToGLFW3Param: param => {
    var table = {
      196609: 0,
      // GLFW_MOUSE_CURSOR
      196610: 0,
      // GLFW_STICKY_KEYS
      196611: 0,
      // GLFW_STICKY_MOUSE_BUTTONS
      196612: 0,
      // GLFW_SYSTEM_KEYS
      196613: 0,
      // GLFW_KEY_REPEAT
      196614: 0,
      // GLFW_AUTO_POLL_EVENTS
      131073: 0,
      // GLFW_OPENED
      131074: 0,
      // GLFW_ACTIVE
      131075: 0,
      // GLFW_ICONIFIED
      131076: 0,
      // GLFW_ACCELERATED
      131077: 135169,
      // GLFW_RED_BITS
      131078: 135170,
      // GLFW_GREEN_BITS
      131079: 135171,
      // GLFW_BLUE_BITS
      131080: 135172,
      // GLFW_ALPHA_BITS
      131081: 135173,
      // GLFW_DEPTH_BITS
      131082: 135174,
      // GLFW_STENCIL_BITS
      131083: 135183,
      // GLFW_REFRESH_RATE
      131084: 135175,
      // GLFW_ACCUM_RED_BITS
      131085: 135176,
      // GLFW_ACCUM_GREEN_BITS
      131086: 135177,
      // GLFW_ACCUM_BLUE_BITS
      131087: 135178,
      // GLFW_ACCUM_ALPHA_BITS
      131088: 135179,
      // GLFW_AUX_BUFFERS
      131089: 135180,
      // GLFW_STEREO
      131090: 0,
      // GLFW_WINDOW_NO_RESIZE
      131091: 135181,
      // GLFW_FSAA_SAMPLES
      131092: 139266,
      // GLFW_OPENGL_VERSION_MAJOR
      131093: 139267,
      // GLFW_OPENGL_VERSION_MINOR
      131094: 139270,
      // GLFW_OPENGL_FORWARD_COMPAT
      131095: 139271,
      // GLFW_OPENGL_DEBUG_CONTEXT
      131096: 139272
    };
    return table[param];
  }
};

var _glfwCreateWindow = (width, height, title, monitor, share) => GLFW.createWindow(width, height, title, monitor, share);

var _glfwDestroyWindow = winid => GLFW.destroyWindow(winid);

var _glfwGetCurrentContext = () => GLFW.active ? GLFW.active.id : 0;

var _glfwGetCursorPos = (winid, x, y) => GLFW.getCursorPos(winid, x, y);

var _glfwGetInputMode = (winid, mode) => {
  var win = GLFW.WindowFromId(winid);
  if (!win) return;
  switch (mode) {
   case 208897:
    {
      // GLFW_CURSOR
      if (Browser.pointerLock) {
        win.inputModes[mode] = 212995;
      } else {
        win.inputModes[mode] = 212993;
      }
    }
  }
  return win.inputModes[mode];
};

var _glfwGetMonitorPhysicalSize = (monitor, width, height) => {
  // AFAIK there is no way to do this in javascript
  // Maybe with platform specific ccalls?
  // Let's report 0 now which is as wrong as it can get for end user.
  (growMemViews(), HEAP32)[((width) >> 2)] = 0;
  (growMemViews(), HEAP32)[((height) >> 2)] = 0;
};

var _glfwGetPrimaryMonitor = () => 1;

var _glfwGetVideoMode = monitor => 0;

var _glfwGetWindowMonitor = winid => {
  var win = GLFW.WindowFromId(winid);
  if (!win) return 0;
  return win.monitor;
};

var _glfwInit = () => {
  if (GLFW.windows) return 1;
  // GL_TRUE
  GLFW.initialTime = GLFW.getTime();
  GLFW.defaultWindowHints();
  GLFW.windows = new Array;
  GLFW.active = null;
  GLFW.scale = GLFW.getDevicePixelRatio();
  window.addEventListener("gamepadconnected", GLFW.onGamepadConnected, true);
  window.addEventListener("gamepaddisconnected", GLFW.onGamepadDisconnected, true);
  window.addEventListener("keydown", GLFW.onKeydown, true);
  window.addEventListener("keypress", GLFW.onKeyPress, true);
  window.addEventListener("keyup", GLFW.onKeyup, true);
  window.addEventListener("blur", GLFW.onBlur, true);
  // watch for devicePixelRatio changes
  GLFW.devicePixelRatioMQL = window.matchMedia("(resolution: " + GLFW.getDevicePixelRatio() + "dppx)");
  GLFW.devicePixelRatioMQL.addEventListener("change", GLFW.onDevicePixelRatioChange);
  var canvas = Browser.getCanvas();
  canvas.addEventListener("touchmove", GLFW.onMousemove, true);
  canvas.addEventListener("touchstart", GLFW.onMouseButtonDown, true);
  canvas.addEventListener("touchcancel", GLFW.onMouseButtonUp, true);
  canvas.addEventListener("touchend", GLFW.onMouseButtonUp, true);
  canvas.addEventListener("mousemove", GLFW.onMousemove, true);
  canvas.addEventListener("mousedown", GLFW.onMouseButtonDown, true);
  canvas.addEventListener("mouseup", GLFW.onMouseButtonUp, true);
  canvas.addEventListener("wheel", GLFW.onMouseWheel, true);
  canvas.addEventListener("mousewheel", GLFW.onMouseWheel, true);
  canvas.addEventListener("mouseenter", GLFW.onMouseenter, true);
  canvas.addEventListener("mouseleave", GLFW.onMouseleave, true);
  canvas.addEventListener("drop", GLFW.onDrop, true);
  canvas.addEventListener("dragover", GLFW.onDragover, true);
  // Overriding implementation to account for HiDPI
  Browser.requestFullscreen = GLFW.requestFullscreen;
  Browser.calculateMouseCoords = GLFW.calculateMouseCoords;
  Browser.updateCanvasDimensions = GLFW.updateCanvasDimensions;
  Browser.resizeListeners.push((width, height) => {
    if (GLFW.isHiDPIAware()) {
      var canvas = Browser.getCanvas();
      GLFW.onCanvasResize(canvas.clientWidth, canvas.clientHeight, width, height);
    } else {
      GLFW.onCanvasResize(width, height, width, height);
    }
  });
  return 1;
};

var _glfwMakeContextCurrent = winid => 0;

var _glfwPollEvents = () => 0;

var _glfwSetCharCallback = (winid, cbfun) => GLFW.setCharCallback(winid, cbfun);

var _glfwSetCursorPosCallback = (winid, cbfun) => GLFW.setCursorPosCallback(winid, cbfun);

var _glfwSetErrorCallback = cbfun => {
  var prevcbfun = GLFW.errorFunc;
  GLFW.errorFunc = cbfun;
  return prevcbfun;
};

var _glfwSetInputMode = (winid, mode, value) => {
  GLFW.setInputMode(winid, mode, value);
};

var _glfwSetKeyCallback = (winid, cbfun) => GLFW.setKeyCallback(winid, cbfun);

var _glfwSetMouseButtonCallback = (winid, cbfun) => GLFW.setMouseButtonCallback(winid, cbfun);

var _glfwSetScrollCallback = (winid, cbfun) => GLFW.setScrollCallback(winid, cbfun);

var _glfwSetWindowMonitor = (winid, monitor, xpos, ypos, width, height, refreshRate) => abort("glfwSetWindowMonitor not implemented.");

var _glfwSetWindowSizeCallback = (winid, cbfun) => GLFW.setWindowSizeCallback(winid, cbfun);

var _glfwSwapBuffers = winid => GLFW.swapBuffers(winid);

var _glfwSwapInterval = interval => {
  interval = Math.abs(interval);
  // GLFW uses negative values to enable GLX_EXT_swap_control_tear, which we don't have, so just treat negative and positive the same.
  if (interval == 0) _emscripten_set_main_loop_timing(0, 0); else _emscripten_set_main_loop_timing(1, interval);
};

var _glfwTerminate = () => {
  window.removeEventListener("gamepadconnected", GLFW.onGamepadConnected, true);
  window.removeEventListener("gamepaddisconnected", GLFW.onGamepadDisconnected, true);
  window.removeEventListener("keydown", GLFW.onKeydown, true);
  window.removeEventListener("keypress", GLFW.onKeyPress, true);
  window.removeEventListener("keyup", GLFW.onKeyup, true);
  window.removeEventListener("blur", GLFW.onBlur, true);
  var canvas = Browser.getCanvas();
  canvas.removeEventListener("touchmove", GLFW.onMousemove, true);
  canvas.removeEventListener("touchstart", GLFW.onMouseButtonDown, true);
  canvas.removeEventListener("touchcancel", GLFW.onMouseButtonUp, true);
  canvas.removeEventListener("touchend", GLFW.onMouseButtonUp, true);
  canvas.removeEventListener("mousemove", GLFW.onMousemove, true);
  canvas.removeEventListener("mousedown", GLFW.onMouseButtonDown, true);
  canvas.removeEventListener("mouseup", GLFW.onMouseButtonUp, true);
  canvas.removeEventListener("wheel", GLFW.onMouseWheel, true);
  canvas.removeEventListener("mousewheel", GLFW.onMouseWheel, true);
  canvas.removeEventListener("mouseenter", GLFW.onMouseenter, true);
  canvas.removeEventListener("mouseleave", GLFW.onMouseleave, true);
  canvas.removeEventListener("drop", GLFW.onDrop, true);
  canvas.removeEventListener("dragover", GLFW.onDragover, true);
  if (GLFW.devicePixelRatioMQL) GLFW.devicePixelRatioMQL.removeEventListener("change", GLFW.onDevicePixelRatioChange);
  canvas.width = canvas.height = 1;
  GLFW.windows = null;
  GLFW.active = null;
};

var _glfwWindowHint = (target, hint) => {
  GLFW.hints[target] = hint;
};

var getCFunc = ident => {
  var func = Module["_" + ident];
  // closure exported function
  return func;
};

var writeArrayToMemory = (array, buffer) => {
  (growMemViews(), HEAP8).set(array, buffer);
};

var stringToUTF8OnStack = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8(str, ret, size);
  return ret;
};

/**
   * @param {string|null=} returnType
   * @param {Array=} argTypes
   * @param {Array=} args
   * @param {Object=} opts
   */ var ccall = (ident, returnType, argTypes, args, opts) => {
  // For fast lookup of conversion functions
  var toC = {
    "string": str => {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) {
        // null string
        ret = stringToUTF8OnStack(str);
      }
      return ret;
    },
    "array": arr => {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    }
  };
  function convertReturnValue(ret) {
    if (returnType === "string") {
      return UTF8ToString(ret);
    }
    if (returnType === "boolean") return Boolean(ret);
    return ret;
  }
  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (!stack) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func(...cArgs);
  function onDone(ret) {
    if (stack) stackRestore(stack);
    return convertReturnValue(ret);
  }
  ret = onDone(ret);
  return ret;
};

/**
   * @param {string=} returnType
   * @param {Array=} argTypes
   * @param {Object=} opts
   */ var cwrap = (ident, returnType, argTypes, opts) => {
  // When the function takes numbers and returns a number, we can just return
  // the original function
  var numericArgs = !argTypes || argTypes.every(type => type === "number" || type === "boolean");
  var numericRet = returnType !== "string";
  if (numericRet && numericArgs && !opts) {
    return getCFunc(ident);
  }
  return (...args) => ccall(ident, returnType, argTypes, args, opts);
};

var FS_createPath = (...args) => FS.createPath(...args);

var FS_unlink = (...args) => FS.unlink(...args);

var FS_createLazyFile = (...args) => FS.createLazyFile(...args);

var FS_createDevice = (...args) => FS.createDevice(...args);

PThread.init();

FS.createPreloadedFile = FS_createPreloadedFile;

FS.preloadFile = FS_preloadFile;

FS.staticInit();

Module["requestAnimationFrame"] = MainLoop.requestAnimationFrame;

Module["pauseMainLoop"] = MainLoop.pause;

Module["resumeMainLoop"] = MainLoop.resume;

MainLoop.init();

// Signal GL rendering layer that processing of a new frame is about to
// start. This helps it optimize VBO double-buffering and reduce GPU stalls.
registerPreMainLoop(() => GL.newRenderingFrameStarted());

GLImmediate.setupFuncs();

Browser.moduleContextCreatedCallbacks.push(() => GLImmediate.init());

// Forward declare GL functions that are overridden by GLEmulation.
/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glDrawArrays;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glDrawElements;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glActiveTexture;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glEnable;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glDisable;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glTexEnvf;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glTexEnvi;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glTexEnvfv;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glGetIntegerv;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glIsEnabled;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glGetBooleanv;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glGetString;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glCreateShader;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glShaderSource;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glCompileShader;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glAttachShader;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glDetachShader;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glUseProgram;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glDeleteProgram;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glBindAttribLocation;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glLinkProgram;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glBindBuffer;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glGetFloatv;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glHint;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glEnableVertexAttribArray;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glDisableVertexAttribArray;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glVertexAttribPointer;

/**@suppress {duplicate, undefinedVars}*/ var _glTexEnvf;

/**@suppress {duplicate, undefinedVars}*/ var _glTexEnvi;

/**@suppress {duplicate, undefinedVars}*/ var _glTexEnvfv;

/**@suppress {duplicate, undefinedVars}*/ var _glGetTexEnviv;

/**@suppress {duplicate, undefinedVars}*/ var _glGetTexEnvfv;

GLEmulation.init();

// End JS library code
// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.
{
  // With WASM_ESM_INTEGRATION this has to happen at the top level and not
  // delayed until processModuleArgs.
  initMemory();
  // Begin ATMODULES hooks
  if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
  if (Module["print"]) out = Module["print"];
  if (Module["printErr"]) err = Module["printErr"];
  // End ATMODULES hooks
  if (Module["arguments"]) programArgs = Module["arguments"];
  if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
  var preInit = Module["preInit"];
  if (preInit) {
    if (typeof preInit == "function") Module["preInit"] = preInit = [ preInit ];
    // Written as a loop so that preInit functions that themselves add more
    // preInit functions.  Is this actually needed?
    while (preInit.length > 0) {
      preInit.shift()();
    }
  }
}

// Begin runtime exports
Module["addRunDependency"] = addRunDependency;

Module["removeRunDependency"] = removeRunDependency;

Module["ccall"] = ccall;

Module["cwrap"] = cwrap;

Module["UTF8ToString"] = UTF8ToString;

Module["stringToUTF8"] = stringToUTF8;

Module["FS_preloadFile"] = FS_preloadFile;

Module["FS_unlink"] = FS_unlink;

Module["FS_createPath"] = FS_createPath;

Module["FS_createDevice"] = FS_createDevice;

Module["FS"] = FS;

Module["FS_createDataFile"] = FS_createDataFile;

Module["FS_createLazyFile"] = FS_createLazyFile;

// End runtime exports
// Begin JS library exports
// End JS library exports
// end include: postlibrary.js
// proxiedFunctionTable specifies the list of functions that can be called
// either synchronously or asynchronously from other threads in postMessage()d
// or internally queued events. This way a pthread in a Worker can synchronously
// access e.g. the DOM on the main thread.
var proxiedFunctionTable = [ _proc_exit, exitOnMainThread, pthreadCreateProxied, ___syscall_accept4, ___syscall_connect, ___syscall_faccessat, ___syscall_fcntl64, ___syscall_fstat64, ___syscall_getdents64, ___syscall_ioctl, ___syscall_lstat64, ___syscall_mkdirat, ___syscall_newfstatat, ___syscall_openat, ___syscall_recvfrom, ___syscall_renameat, ___syscall_rmdir, ___syscall_sendto, ___syscall_socket, ___syscall_stat64, ___syscall_unlinkat, getCanvasSizeMainThread, _environ_get, _environ_sizes_get, _fd_close, _fd_read, _fd_seek, _fd_write, _getaddrinfo, _emscripten_set_window_title ];

var ASM_CONSTS = {
  6449624: () => {
    FS.mkdir("/games");
    FS.mkdir("/games/com.mojang");
    FS.mkdir("/games/com.mojang/minecraftWorlds");
    FS.mount(IDBFS, {}, "/games");
    FS.syncfs(true, function(err) {});
  },
  6449789: () => {
    if (Module.webAudioContext && Module.webAudioContext.state === "suspended") {
      Module.webAudioContext.resume();
    }
  }
};

function web_audio_play_pcm(data, size, channels, byteWidth, rate, volume, pitch) {
  if (!Module.webAudioContext) {
    Module.webAudioContext = new (window.AudioContext || window.webkitAudioContext);
  }
  var context = Module.webAudioContext;
  if (context.state === "suspended") context.resume();
  var frameSize = channels * byteWidth;
  var frameCount = Math.floor(size / frameSize);
  var audioBuffer = context.createBuffer(channels, frameCount, rate);
  var bytes = (growMemViews(), HEAPU8).slice(data, data + size);
  var view = new DataView(bytes.buffer);
  for (var channel = 0; channel < channels; ++channel) {
    var output = audioBuffer.getChannelData(channel);
    for (var frame = 0; frame < frameCount; ++frame) {
      var offset = frame * frameSize + channel * byteWidth;
      if (byteWidth === 2) {
        output[frame] = view.getInt16(offset, true) / 32768;
      } else {
        output[frame] = (bytes[offset] - 128) / 128;
      }
    }
  }
  var source = context.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = pitch > 0 ? pitch : 1;
  var gain = context.createGain();
  gain.gain.value = Math.max(0, Math.min(1, volume));
  source.connect(gain);
  gain.connect(context.destination);
  source.start();
}

// Imports from the Wasm binary.
var _main, _htonl, _htons, _ntohs, _malloc, _free, __emscripten_tls_init, _pthread_self, __emscripten_thread_init, ___set_thread_state, __emscripten_thread_crashed, __emscripten_run_js_on_main_thread_done, __emscripten_run_js_on_main_thread, __emscripten_thread_free_data, __emscripten_thread_exit, __emscripten_check_mailbox, _setThrew, _emscripten_stack_set_limits, __emscripten_stack_restore, __emscripten_stack_alloc, _emscripten_stack_get_current, __indirect_function_table, wasmTable;

function assignWasmExports(wasmExports) {
  _main = Module["_main"] = wasmExports["main"];
  _htonl = wasmExports["htonl"];
  _htons = wasmExports["htons"];
  _ntohs = wasmExports["ntohs"];
  _malloc = wasmExports["malloc"];
  _free = wasmExports["free"];
  __emscripten_tls_init = wasmExports["_emscripten_tls_init"];
  _pthread_self = wasmExports["pthread_self"];
  __emscripten_thread_init = wasmExports["_emscripten_thread_init"];
  ___set_thread_state = wasmExports["__set_thread_state"];
  __emscripten_thread_crashed = wasmExports["_emscripten_thread_crashed"];
  __emscripten_run_js_on_main_thread_done = wasmExports["_emscripten_run_js_on_main_thread_done"];
  __emscripten_run_js_on_main_thread = wasmExports["_emscripten_run_js_on_main_thread"];
  __emscripten_thread_free_data = wasmExports["_emscripten_thread_free_data"];
  __emscripten_thread_exit = wasmExports["_emscripten_thread_exit"];
  __emscripten_check_mailbox = wasmExports["_emscripten_check_mailbox"];
  _setThrew = wasmExports["setThrew"];
  _emscripten_stack_set_limits = wasmExports["emscripten_stack_set_limits"];
  __emscripten_stack_restore = wasmExports["_emscripten_stack_restore"];
  __emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"];
  _emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"];
  __indirect_function_table = wasmTable = wasmExports["__indirect_function_table"];
}

var wasmImports;

function assignWasmImports() {
  wasmImports = {
    /** @export */ __cxa_throw: ___cxa_throw,
    /** @export */ __pthread_create_js: ___pthread_create_js,
    /** @export */ __syscall_accept4: ___syscall_accept4,
    /** @export */ __syscall_connect: ___syscall_connect,
    /** @export */ __syscall_faccessat: ___syscall_faccessat,
    /** @export */ __syscall_fcntl64: ___syscall_fcntl64,
    /** @export */ __syscall_fstat64: ___syscall_fstat64,
    /** @export */ __syscall_getdents64: ___syscall_getdents64,
    /** @export */ __syscall_ioctl: ___syscall_ioctl,
    /** @export */ __syscall_lstat64: ___syscall_lstat64,
    /** @export */ __syscall_mkdirat: ___syscall_mkdirat,
    /** @export */ __syscall_newfstatat: ___syscall_newfstatat,
    /** @export */ __syscall_openat: ___syscall_openat,
    /** @export */ __syscall_recvfrom: ___syscall_recvfrom,
    /** @export */ __syscall_renameat: ___syscall_renameat,
    /** @export */ __syscall_rmdir: ___syscall_rmdir,
    /** @export */ __syscall_sendto: ___syscall_sendto,
    /** @export */ __syscall_socket: ___syscall_socket,
    /** @export */ __syscall_stat64: ___syscall_stat64,
    /** @export */ __syscall_unlinkat: ___syscall_unlinkat,
    /** @export */ _abort_js: __abort_js,
    /** @export */ _emscripten_init_main_thread_js: __emscripten_init_main_thread_js,
    /** @export */ _emscripten_notify_mailbox_postmessage: __emscripten_notify_mailbox_postmessage,
    /** @export */ _emscripten_receive_on_main_thread_js: __emscripten_receive_on_main_thread_js,
    /** @export */ _emscripten_thread_cleanup: __emscripten_thread_cleanup,
    /** @export */ _emscripten_thread_mailbox_await: __emscripten_thread_mailbox_await,
    /** @export */ _emscripten_thread_set_strongref: __emscripten_thread_set_strongref,
    /** @export */ _emscripten_throw_longjmp: __emscripten_throw_longjmp,
    /** @export */ _localtime_js: __localtime_js,
    /** @export */ _tzset_js: __tzset_js,
    /** @export */ clock_time_get: _clock_time_get,
    /** @export */ emscripten_asm_const_int: _emscripten_asm_const_int,
    /** @export */ emscripten_check_blocking_allowed: _emscripten_check_blocking_allowed,
    /** @export */ emscripten_date_now: _emscripten_date_now,
    /** @export */ emscripten_exit_with_live_runtime: _emscripten_exit_with_live_runtime,
    /** @export */ emscripten_get_canvas_element_size: _emscripten_get_canvas_element_size,
    /** @export */ emscripten_get_now: _emscripten_get_now,
    /** @export */ emscripten_resize_heap: _emscripten_resize_heap,
    /** @export */ emscripten_run_script: _emscripten_run_script,
    /** @export */ emscripten_set_main_loop: _emscripten_set_main_loop,
    /** @export */ environ_get: _environ_get,
    /** @export */ environ_sizes_get: _environ_sizes_get,
    /** @export */ exit: _exit,
    /** @export */ fd_close: _fd_close,
    /** @export */ fd_read: _fd_read,
    /** @export */ fd_seek: _fd_seek,
    /** @export */ fd_write: _fd_write,
    /** @export */ getaddrinfo: _getaddrinfo,
    /** @export */ glAlphaFunc: _glAlphaFunc,
    /** @export */ glBindBuffer: _glBindBuffer,
    /** @export */ glBindTexture: _glBindTexture,
    /** @export */ glBlendFunc: _glBlendFunc,
    /** @export */ glBufferData: _glBufferData,
    /** @export */ glClear: _glClear,
    /** @export */ glClearColor: _glClearColor,
    /** @export */ glColor4f: _glColor4f,
    /** @export */ glColorMask: _glColorMask,
    /** @export */ glColorPointer: _glColorPointer,
    /** @export */ glCullFace: _glCullFace,
    /** @export */ glDeleteBuffers: _glDeleteBuffers,
    /** @export */ glDeleteTextures: _glDeleteTextures,
    /** @export */ glDepthFunc: _glDepthFunc,
    /** @export */ glDepthMask: _glDepthMask,
    /** @export */ glDepthRangef: _glDepthRangef,
    /** @export */ glDisable: _glDisable,
    /** @export */ glDisableClientState: _glDisableClientState,
    /** @export */ glDrawArrays: _glDrawArrays,
    /** @export */ glEnable: _glEnable,
    /** @export */ glEnableClientState: _glEnableClientState,
    /** @export */ glFogf: _glFogf,
    /** @export */ glFogfv: _glFogfv,
    /** @export */ glFogx: _glFogx,
    /** @export */ glGenBuffers: _glGenBuffers,
    /** @export */ glGenTextures: _glGenTextures,
    /** @export */ glGetFloatv: _glGetFloatv,
    /** @export */ glHint: _glHint,
    /** @export */ glLightModelfv: _glLightModelfv,
    /** @export */ glLightfv: _glLightfv,
    /** @export */ glLineWidth: _glLineWidth,
    /** @export */ glLoadIdentity: _glLoadIdentity,
    /** @export */ glMatrixMode: _glMatrixMode,
    /** @export */ glMultMatrixf: _glMultMatrixf,
    /** @export */ glNormal3f: _glNormal3f,
    /** @export */ glNormalPointer: _glNormalPointer,
    /** @export */ glOrthof: _glOrthof,
    /** @export */ glPolygonOffset: _glPolygonOffset,
    /** @export */ glPopMatrix: _glPopMatrix,
    /** @export */ glPushMatrix: _glPushMatrix,
    /** @export */ glRotatef: _glRotatef,
    /** @export */ glScalef: _glScalef,
    /** @export */ glScissor: _glScissor,
    /** @export */ glShadeModel: _glShadeModel,
    /** @export */ glTexCoordPointer: _glTexCoordPointer,
    /** @export */ glTexImage2D: _glTexImage2D,
    /** @export */ glTexParameteri: _glTexParameteri,
    /** @export */ glTexSubImage2D: _glTexSubImage2D,
    /** @export */ glTranslatef: _glTranslatef,
    /** @export */ glVertexPointer: _glVertexPointer,
    /** @export */ glViewport: _glViewport,
    /** @export */ glfwCreateWindow: _glfwCreateWindow,
    /** @export */ glfwDestroyWindow: _glfwDestroyWindow,
    /** @export */ glfwGetCurrentContext: _glfwGetCurrentContext,
    /** @export */ glfwGetCursorPos: _glfwGetCursorPos,
    /** @export */ glfwGetInputMode: _glfwGetInputMode,
    /** @export */ glfwGetMonitorPhysicalSize: _glfwGetMonitorPhysicalSize,
    /** @export */ glfwGetPrimaryMonitor: _glfwGetPrimaryMonitor,
    /** @export */ glfwGetVideoMode: _glfwGetVideoMode,
    /** @export */ glfwGetWindowMonitor: _glfwGetWindowMonitor,
    /** @export */ glfwInit: _glfwInit,
    /** @export */ glfwMakeContextCurrent: _glfwMakeContextCurrent,
    /** @export */ glfwPollEvents: _glfwPollEvents,
    /** @export */ glfwSetCharCallback: _glfwSetCharCallback,
    /** @export */ glfwSetCursorPosCallback: _glfwSetCursorPosCallback,
    /** @export */ glfwSetErrorCallback: _glfwSetErrorCallback,
    /** @export */ glfwSetInputMode: _glfwSetInputMode,
    /** @export */ glfwSetKeyCallback: _glfwSetKeyCallback,
    /** @export */ glfwSetMouseButtonCallback: _glfwSetMouseButtonCallback,
    /** @export */ glfwSetScrollCallback: _glfwSetScrollCallback,
    /** @export */ glfwSetWindowMonitor: _glfwSetWindowMonitor,
    /** @export */ glfwSetWindowSizeCallback: _glfwSetWindowSizeCallback,
    /** @export */ glfwSwapBuffers: _glfwSwapBuffers,
    /** @export */ glfwSwapInterval: _glfwSwapInterval,
    /** @export */ glfwTerminate: _glfwTerminate,
    /** @export */ glfwWindowHint: _glfwWindowHint,
    /** @export */ invoke_ii,
    /** @export */ invoke_iii,
    /** @export */ invoke_iiii,
    /** @export */ invoke_iiiii,
    /** @export */ invoke_vi,
    /** @export */ invoke_vii,
    /** @export */ invoke_viii,
    /** @export */ invoke_viiii,
    /** @export */ memory: wasmMemory,
    /** @export */ web_audio_play_pcm
  };
}

function invoke_iiiii(index, a1, a2, a3, a4) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1, a2, a3, a4);
  } catch (e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_ii(index, a1) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1);
  } catch (e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viii(index, a1, a2, a3) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1, a2, a3);
  } catch (e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiii(index, a1, a2, a3) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1, a2, a3);
  } catch (e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vii(index, a1, a2) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1, a2);
  } catch (e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iii(index, a1, a2) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1, a2);
  } catch (e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vi(index, a1) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1);
  } catch (e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiii(index, a1, a2, a3, a4) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1, a2, a3, a4);
  } catch (e) {
    stackRestore(sp);
    if (!(e instanceof EmscriptenEH)) throw e;
    _setThrew(1, 0);
  }
}

// include: postamble.js
// === Auto-generated postamble setup entry stuff ===
function callMain() {
  var entryFunction = _main;
  var argc = 0;
  var argv = 0;
  try {
    var ret = entryFunction(argc, argv);
    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
    return ret;
  } catch (e) {
    return handleException(e);
  }
}

async function run() {
  if ((ENVIRONMENT_IS_PTHREAD)) {
    initRuntime();
    return;
  }
  preRun();
  if (runDependencies) {
    await resolveRunDependencies();
  }
  var setStatus = Module["setStatus"];
  if (setStatus) {
    setStatus("Running...");
    // Yield to the event loop to allow the browser to paint "Running..."
    await new Promise(resolve => setTimeout(resolve, 1));
    // Then we want to clear the status text, but only after the rest of this function runs.
    setTimeout(setStatus, 1, "");
  }
  if (ABORT) return;
  initRuntime();
  // No ATMAINS hooks
  Module["onRuntimeInitialized"]?.();
  var noInitialRun = Module["noInitialRun"] || false;
  if (!noInitialRun) callMain();
  postRun();
}

var wasmExports;

if ((!(ENVIRONMENT_IS_PTHREAD))) {
  // Call createWasm on startup if we are the main thread.
  // Worker threads call this once they receive the module via postMessage
  // With async instantation wasmExports is assigned asynchronously when the
  // instance is received.
  createWasm().then(() => run());
}
