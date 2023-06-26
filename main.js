
var WDE = (function (exports) {
    'use strict';

    var bcModSdk = function () { "use strict"; const e = "1.1.0"; function o(e) { alert("Mod ERROR:\n" + e); const o = new Error(e); throw console.error(o), o } const t = new TextEncoder; function n(e) { return !!e && "object" == typeof e && !Array.isArray(e) } function r(e) { const o = new Set; return e.filter((e => !o.has(e) && o.add(e))) } const i = new Map, a = new Set; function d(e) { a.has(e) || (a.add(e), console.warn(e)) } function s(e) { const o = [], t = new Map, n = new Set; for (const r of p.values()) { const i = r.patching.get(e.name); if (i) { o.push(...i.hooks); for (const [o, a] of i.patches.entries()) t.has(o) && t.get(o) !== a && d(`ModSDK: Mod '${r.name}' is patching function ${e.name} with same pattern that is already applied by different mod, but with different pattern:\nPattern:\n${o}\nPatch1:\n${t.get(o) || ""}\nPatch2:\n${a}`), t.set(o, a), n.add(r.name) } } o.sort(((e, o) => o.priority - e.priority)); const r = function (e, o) { if (0 === o.size) return e; let t = e.toString().replaceAll("\r\n", "\n"); for (const [n, r] of o.entries()) t.includes(n) || d(`ModSDK: Patching ${e.name}: Patch ${n} not applied`), t = t.replaceAll(n, r); return (0, eval)(`(${t})`) }(e.original, t); let i = function (o) { var t, i; const a = null === (i = (t = m.errorReporterHooks).hookChainExit) || void 0 === i ? void 0 : i.call(t, e.name, n), d = r.apply(this, o); return null == a || a(), d }; for (let t = o.length - 1; t >= 0; t--) { const n = o[t], r = i; i = function (o) { var t, i; const a = null === (i = (t = m.errorReporterHooks).hookEnter) || void 0 === i ? void 0 : i.call(t, e.name, n.mod), d = n.hook.apply(this, [o, e => { if (1 !== arguments.length || !Array.isArray(o)) throw new Error(`Mod ${n.mod} failed to call next hook: Expected args to be array, got ${typeof e}`); return r.call(this, e) }]); return null == a || a(), d } } return { hooks: o, patches: t, patchesSources: n, enter: i, final: r } } function c(e, o = !1) { let r = i.get(e); if (r) o && (r.precomputed = s(r)); else { let o = window; const a = e.split("."); for (let t = 0; t < a.length - 1; t++)if (o = o[a[t]], !n(o)) throw new Error(`ModSDK: Function ${e} to be patched not found; ${a.slice(0, t + 1).join(".")} is not object`); const d = o[a[a.length - 1]]; if ("function" != typeof d) throw new Error(`ModSDK: Function ${e} to be patched not found`); const c = function (e) { let o = -1; for (const n of t.encode(e)) { let e = 255 & (o ^ n); for (let o = 0; o < 8; o++)e = 1 & e ? -306674912 ^ e >>> 1 : e >>> 1; o = o >>> 8 ^ e } return ((-1 ^ o) >>> 0).toString(16).padStart(8, "0").toUpperCase() }(d.toString().replaceAll("\r\n", "\n")), l = { name: e, original: d, originalHash: c }; r = Object.assign(Object.assign({}, l), { precomputed: s(l), router: () => { }, context: o, contextProperty: a[a.length - 1] }), r.router = function (e) { return function (...o) { return e.precomputed.enter.apply(this, [o]) } }(r), i.set(e, r), o[r.contextProperty] = r.router } return r } function l() { const e = new Set; for (const o of p.values()) for (const t of o.patching.keys()) e.add(t); for (const o of i.keys()) e.add(o); for (const o of e) c(o, !0) } function f() { const e = new Map; for (const [o, t] of i) e.set(o, { name: o, original: t.original, originalHash: t.originalHash, sdkEntrypoint: t.router, currentEntrypoint: t.context[t.contextProperty], hookedByMods: r(t.precomputed.hooks.map((e => e.mod))), patchedByMods: Array.from(t.precomputed.patchesSources) }); return e } const p = new Map; function u(e) { p.get(e.name) !== e && o(`Failed to unload mod '${e.name}': Not registered`), p.delete(e.name), e.loaded = !1, l() } function g(e, t, r) { "string" == typeof e && "string" == typeof t && (alert(`Mod SDK warning: Mod '${e}' is registering in a deprecated way.\nIt will work for now, but please inform author to update.`), e = { name: e, fullName: e, version: t }, t = { allowReplace: !0 === r }), e && "object" == typeof e || o("Failed to register mod: Expected info object, got " + typeof e), "string" == typeof e.name && e.name || o("Failed to register mod: Expected name to be non-empty string, got " + typeof e.name); let i = `'${e.name}'`; "string" == typeof e.fullName && e.fullName || o(`Failed to register mod ${i}: Expected fullName to be non-empty string, got ${typeof e.fullName}`), i = `'${e.fullName} (${e.name})'`, "string" != typeof e.version && o(`Failed to register mod ${i}: Expected version to be string, got ${typeof e.version}`), e.repository || (e.repository = void 0), void 0 !== e.repository && "string" != typeof e.repository && o(`Failed to register mod ${i}: Expected repository to be undefined or string, got ${typeof e.version}`), null == t && (t = {}), t && "object" == typeof t || o(`Failed to register mod ${i}: Expected options to be undefined or object, got ${typeof t}`); const a = !0 === t.allowReplace, d = p.get(e.name); d && (d.allowReplace && a || o(`Refusing to load mod ${i}: it is already loaded and doesn't allow being replaced.\nWas the mod loaded multiple times?`), u(d)); const s = e => { "string" == typeof e && e || o(`Mod ${i} failed to patch a function: Expected function name string, got ${typeof e}`); let t = g.patching.get(e); return t || (t = { hooks: [], patches: new Map }, g.patching.set(e, t)), t }, f = { unload: () => u(g), hookFunction: (e, t, n) => { g.loaded || o(`Mod ${i} attempted to call SDK function after being unloaded`); const r = s(e); "number" != typeof t && o(`Mod ${i} failed to hook function '${e}': Expected priority number, got ${typeof t}`), "function" != typeof n && o(`Mod ${i} failed to hook function '${e}': Expected hook function, got ${typeof n}`); const a = { mod: g.name, priority: t, hook: n }; return r.hooks.push(a), l(), () => { const e = r.hooks.indexOf(a); e >= 0 && (r.hooks.splice(e, 1), l()) } }, patchFunction: (e, t) => { g.loaded || o(`Mod ${i} attempted to call SDK function after being unloaded`); const r = s(e); n(t) || o(`Mod ${i} failed to patch function '${e}': Expected patches object, got ${typeof t}`); for (const [n, a] of Object.entries(t)) "string" == typeof a ? r.patches.set(n, a) : null === a ? r.patches.delete(n) : o(`Mod ${i} failed to patch function '${e}': Invalid format of patch '${n}'`); l() }, removePatches: e => { g.loaded || o(`Mod ${i} attempted to call SDK function after being unloaded`); s(e).patches.clear(), l() }, callOriginal: (e, t, n) => (g.loaded || o(`Mod ${i} attempted to call SDK function after being unloaded`), "string" == typeof e && e || o(`Mod ${i} failed to call a function: Expected function name string, got ${typeof e}`), Array.isArray(t) || o(`Mod ${i} failed to call a function: Expected args array, got ${typeof t}`), function (e, o, t = window) { return c(e).original.apply(t, o) }(e, t, n)), getOriginalHash: e => ("string" == typeof e && e || o(`Mod ${i} failed to get hash: Expected function name string, got ${typeof e}`), c(e).originalHash) }, g = { name: e.name, fullName: e.fullName, version: e.version, repository: e.repository, allowReplace: a, api: f, loaded: !0, patching: new Map }; return p.set(e.name, g), Object.freeze(f) } function h() { const e = []; for (const o of p.values()) e.push({ name: o.name, fullName: o.fullName, version: o.version, repository: o.repository }); return e } let m; const y = function () { if (void 0 === window.bcModSdk) return window.bcModSdk = function () { const o = { version: e, apiVersion: 1, registerMod: g, getModsInfo: h, getPatchingInfo: f, errorReporterHooks: Object.seal({ hookEnter: null, hookChainExit: null }) }; return m = o, Object.freeze(o) }(); if (n(window.bcModSdk) || o("Failed to init Mod SDK: Name already in use"), 1 !== window.bcModSdk.apiVersion && o(`Failed to init Mod SDK: Different version already loaded ('1.1.0' vs '${window.bcModSdk.version}')`), window.bcModSdk.version !== e && (alert(`Mod SDK warning: Loading different but compatible versions ('1.1.0' vs '${window.bcModSdk.version}')\nOne of mods you are using is using an old version of SDK. It will work for now but please inform author to update`), window.bcModSdk.version.startsWith("1.0.") && void 0 === window.bcModSdk._shim10register)) { const e = window.bcModSdk, o = Object.freeze(Object.assign(Object.assign({}, e), { registerMod: (o, t, n) => o && "object" == typeof o && "string" == typeof o.name && "string" == typeof o.version ? e.registerMod(o.name, o.version, "object" == typeof t && !!t && !0 === t.allowReplace) : e.registerMod(o, t, n), _shim10register: !0 })); window.bcModSdk = o } return window.bcModSdk }(); return "undefined" != typeof exports && (Object.defineProperty(exports, "__esModule", { value: !0 }), exports.default = y), y }();

    const MOD_NAME = "WDE";
    const MOD_FULL_NAME = "Wolf Den Enhancements";
    const MOD_VERSION = "v0.0.4.4";


    const SDK = bcModSdk.registerMod({
        name: MOD_NAME,
        fullName: MOD_FULL_NAME,
        version: MOD_VERSION
    });

    const MAX_OTHER_ROOM_SIZE = 9;

    const SWITCH_ROOM_COOL_DOWN = 5 * 1000;
    let SwitchEnable = true;

    let OtherRoomCharacters = {};
    let OtherRoomDatas = {}; // TODO...
    let CurrentRoomName = "";
    let SelfRoomName = "";

    let InBotRoom = false;
    let BotMemberNumber = -1;

    // 玩家进入房间
    function MemberJoin(data) {
        if (data === undefined || data.SourceMemberNumber === undefined || data.Character === undefined || data.RoomName === undefined) {
            return;
        }
        const char = CharacterLoadOnline(data.Character, data.SourceMemberNumber);

        // 所有进入房间的玩家都要加入到ChatRoomCharacter中才可以同步数据
        let charaIndex = ChatRoomCharacter.findIndex(c => c.MemberNumber === data.SourceMemberNumber);
        charaIndex < 0 ? ChatRoomCharacter.push(char) : ChatRoomCharacter[charaIndex] = char;

        let roomName = data.RoomName;
        if (OtherRoomCharacters[roomName] === undefined) {
            OtherRoomCharacters[roomName] = [data.SourceMemberNumber];
        }
        else {
            let index = OtherRoomCharacters[roomName].findIndex(m => m === data.SourceMemberNumber);
            if (index < 0) {
                OtherRoomCharacters[roomName].push(data.SourceMemberNumber)
            }
        }

        // ChatRoomSyncMemberJoin(data);
    }

    // 玩家离开房间
    function MemberLeave(data) {
        if (data === undefined || data.SourceMemberNumber === undefined || data.RoomName === undefined)
            return;

        let roomName = data.RoomName;
        if (OtherRoomCharacters[roomName] === undefined)
            return;

        // 从数组中移除
        let memberNumber = data.SourceMemberNumber;
        ChatRoomCharacter = ChatRoomCharacter.filter(chara => chara.MemberNumber !== memberNumber);
        OtherRoomCharacters[roomName] = OtherRoomCharacters[roomName].filter(M => M !== memberNumber);
    }

    SDK.hookFunction(
        "ChatRoomSyncMemberJoin",
        0,
        (args, next) => {
            next(args);

            let data = args[0];

            const char = CharacterLoadOnline(data.Character, data.SourceMemberNumber);
            if (OtherRoomCharacters[ChatRoomData.Name] === undefined) {
                OtherRoomCharacters[ChatRoomData.Name] = [data.SourceMemberNumber];
            }
            else {
                let index = OtherRoomCharacters[ChatRoomData.Name].findIndex(chara => chara.MemberNumber === data.SourceMemberNumber);
                if (index < 0) {
                    OtherRoomCharacters[ChatRoomData.Name].push(data.SourceMemberNumber);
                }
            }

        }
    )

    SDK.hookFunction(
        "ChatRoomSyncMemberLeave",
        0,
        (args, next) => {
            if (!InBotRoom) {
                next(args);
                return;
            }

            let data = args[0];
            OtherRoomCharacters[SelfRoomName] = OtherRoomCharacters[SelfRoomName].filter(M => M !== data.SourceMemberNumber);
            ChatRoomCharacter = ChatRoomCharacter.filter(C => C.MemberNumber !== data.SourceMemberNumber);

            // Bot离开则删除其他房间的数据且切回自己的房间
            if (data.SourceMemberNumber === BotMemberNumber) {
                InBotRoom = false;
                BotMemberNumber = -1;
                CurrentRoomName = SelfRoomName;
                const BK = OtherRoomCharacters[SelfRoomName];
                OtherRoomCharacters = {};
                OtherRoomCharacters[SelfRoomName] = BK;
                ChatRoomCharacter = ChatRoomCharacter.filter(C => BK.findIndex(M => M === C.MemberNumber) >= 0);
                return;
            }
            next(args);
        }
    )

    // 进入房间同步
    SDK.hookFunction(
        "ChatRoomSync",
        0,
        (args, next) => {

            let data = args[0];
            SelfRoomName = data['Name'];
            CurrentRoomName = SelfRoomName;

            // 进入时先删除数据
            OtherRoomCharacters = {};
            ChatRoomCharacter = [];
            InBotRoom = false;

            next(args);
            // 添加到OtherRoomCharacters中
            for (let C = 0; C < data.Character.length; C++) {
                MemberJoin({
                    Character: data.Character[C],
                    SourceMemberNumber: data.Character[C].MemberNumber,
                    RoomName: SelfRoomName,
                });
            }

            // 发送WDE-Ping，用于在bot处注册为WDE-Client
            setTimeout(() => ServerSend("ChatRoomChat", { Type: "Hidden", Content: "WDE-Client-Ping" }), 500);
        }
    );

    // 修改渲染逻辑
    SDK.hookFunction(
        "ChatRoomUpdateDisplay",
        0,
        (args, next) => {
            if (InBotRoom) {
                let ChatRoomCharacterBK = ChatRoomCharacter;
                ChatRoomCharacter = ChatRoomCharacterBK.filter(C => {
                    return OtherRoomCharacters[CurrentRoomName].findIndex(M => M === C.MemberNumber) >= 0;
                })
                // 有这个if比较重要的原因是在另一个房间只有一个人，且那个人不是自己的时候，BC会直接跳过该角色的渲染
                if (ChatRoomCharacter.findIndex(c => c.MemberNumber == Player.MemberNumber) < 0) ChatRoomCharacter.push(Player);
                next(args);
                ChatRoomCharacter = ChatRoomCharacterBK;
                return;
            }
            next(args);
        }
    );

    // 聊天室渲染时绘制切换房间按钮
    SDK.hookFunction(
        "ChatRoomMenuDraw",
        0,
        (args, next) => {
            next(args);
            if (InBotRoom) {
                if (Object.keys(OtherRoomCharacters).length > 1) {
                    if (CurrentRoomName === SelfRoomName) {
                        DrawButton(965, 490, 40, 40, "🐺", "#66CCFF");
                    }
                    else {
                        DrawButton(965, 490, 40, 40, "🐺", "#11AA11");
                    }
                }
                else {
                    DrawButton(965, 490, 40, 40, "🐺", "#888888")
                }
                if (SwitchEnable && OtherRoomCharacters[CurrentRoomName].length < MAX_OTHER_ROOM_SIZE && CurrentRoomName != SelfRoomName) {
                    DrawButton(965, 450, 40, 40, "✔", "#66CCFF")
                }
                else {
                    DrawButton(965, 450, 40, 40, "✔", "#888888")
                }
            }
        }
    );

    // 点击切换房间按钮逻辑
    SDK.hookFunction(
        "ChatRoomClick",
        0,
        (args, next) => {
            if (InBotRoom) {
                if (MouseIn(970, 490, 40, 40)) {
                    let keys = Object.keys(OtherRoomCharacters);
                    let roomNameIndex = (keys.findIndex(r => r == CurrentRoomName) + 1) % keys.length;
                    CurrentRoomName = keys[roomNameIndex];
                    if (CurrentRoomName == SelfRoomName) {
                        ChatRoomSendLocal(`<i><b><u style="color: #880000;">当前房间: ${CurrentRoomName}</i></u></b>`, 5000)
                    }
                    else {
                        ChatRoomSendLocal(`<i><b><u>当前房间: ${CurrentRoomName}</i></u></b>`, 5000)
                    }
                    return;
                }
                else if (MouseIn(965, 450, 40, 40)) {
                    if (SwitchEnable && CurrentRoomName != SelfRoomName && OtherRoomCharacters[CurrentRoomName].length < MAX_OTHER_ROOM_SIZE) {
                        SwitchEnable = false;
                        setTimeout(() => {
                            SwitchEnable = true;
                        }, SWITCH_ROOM_COOL_DOWN);
                        ServerSend("ChatRoomLeave", "");
                        // 做个延迟加入，减少bot消息传输比bc传输慢导致数据不同步的错误
                        setTimeout(() => ServerSend("ChatRoomJoin", { Name: CurrentRoomName }), 2000);
                    }
                    return;
                }
            }
            next(args);
        }
    );

    // 通过BOT消息模拟同房间内玩家的消息
    SDK.hookFunction(
        "ChatRoomMessage",
        0,
        (args, next) => {
            let data = args[0];
            if (data !== undefined && data.Type == "Whisper" && data.Content == "BotChatRoom" && data.Dictionary !== undefined) {
                InBotRoom = true;
                BotMemberNumber = data.Sender;
                data.Dictionary.forEach(D => {
                    switch (D.Type) {
                        case "MemberJoin":
                        case "BotSyncCharacters":
                            MemberJoin(Object.assign({ RoomName: D.RoomName }, D.Data));
                            break;
                        case "MemberLeave":
                            MemberLeave(Object.assign({ RoomName: D.RoomName }, D.Data));
                            break;
                        case "ChatRoomSyncItem":
                            ChatRoomSyncItem(D.Data);
                            break;
                        case "ChatRoomMessage":
                            ChatRoomMessage(D.Data);
                            break;
                        case "ChatRoomSyncSingle":
                            ChatRoomSyncSingle(D.Data);
                            break;
                        case "ChatRoomSyncExpression":
                            ChatRoomSyncExpression(D.Data);
                            break;
                        case "ChatRoomSyncPose":
                            ChatRoomSyncPose(D.Data);
                            break;
                        case "ChatRoomSyncArousal":
                            ChatRoomSyncArousal(D.Data);
                            break;
                        case "ChatRoomMusic":
                            // 私聊bot时会自动转播放器，所以不需要接收
                            if (!D.Data.UseId && D.Data.Sender == Player.MemberNumber) return;
                            if (D.Data.MusicUrl === undefined || D.Data.MusicUrl == "") return;
                            ChatRoomSendLocal(`<i><u><b>${D.Data.Nickname}-${D.Data.Sender}</b></u></i>： ${D.Data.MusicUrl}`);
                            break;
                    }
                })
                return;
            }

            next(args);
        }
    );

    // 解析消息
    SDK.hookFunction(
        "ChatRoomMessage",
        1,
        (args, next) => {
            let data = args[0];
            // 行为 (隐藏消息)
            if (data !== undefined && data.Content == "WDE-Bot-Element" && data.Type == "Hidden" && data.Dictionary !== undefined) {
                args[0] = data.Dictionary;
                data = args[0];

                // 加载BOT分享的内嵌播放器链接
                if (data.Content !== undefined && data.Content == "MusicBox") {
                    let botContent = data.BotContent;
                    if (botContent === undefined) {
                        return;
                    }

                    let url = botContent.MusicUrl;
                    let sender = botContent.Sender;
                    let nickname = botContent.Nickname;
                    // 私聊bot时会自动转播放器，所以不需要接收
                    if (!botContent.UseId && sender == Player.MemberNumber) return;
                    if (url === undefined || url == "") return;
                    ChatRoomSendLocal(`<i><u><b>${nickname}-${sender}</b></u></i>： ${url}`);
                    return;
                }
                return;
            }
            next(args);
        }
    );

    // 过滤由bot转发的模拟消息
    SDK.hookFunction(
        "ChatRoomMessage",
        1,
        (args, next) => {
            let data = args[0];
            if (data !== undefined && data.Type === "Emote" && data.Dictionary !== undefined && data.Dictionary.findIndex(item => item.Tag === "BotContent") >= 0) {
                BotMemberNumber = data.Sender;
                return;
            }
            next(args);
        }
    );

    // 响应bot进入房间的ping
    SDK.hookFunction(
        "ChatRoomMessage",
        1,
        (args, next) => {
            let data = args[0];
            if (data !== undefined && data.Type === "Hidden" && data.Content === "WDE-Bot-Ping") {
                InBotRoom = true;
                BotMemberNumber = data.Sender;
                ServerSend("ChatRoomChat", { Type: "Whisper", Content: "WDE-Bot-Pong", Target: data.Sender });
                return;
            }

            next(args);
        }
    );

    console.log(`${MOD_NAME} ${MOD_VERSION} Loaded.`);
})({});