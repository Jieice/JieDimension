/* ============================================================
   game-i18n — 站内小游戏与主站的语言桥
   读取主站同一个 localStorage 键（jiedim.lang），使游戏界面跟随站点语言。
   字典格式：{ "key": ["中文", "English"] }
   用法：
     <script src="../shared/game-i18n.js"></script>   <!-- 置于 <head> -->
     <script>GameI18N.apply(MY_DICT);</script>        <!-- 置于 </body> 末尾 -->
     GameI18N.pick("中文", "English")                 <!-- JS 内联取词 -->
     GameI18N.text(MY_DICT, "some.key")               <!-- 按 key 取词 -->
   ============================================================ */
window.GameI18N = (function () {
  var lang = "zh";
  try {
    lang = localStorage.getItem("jiedim.lang") === "en" ? "en" : "zh";
  } catch (e) {}

  function pick(zh, en) {
    return lang === "en" ? en : zh;
  }

  function entry(dict, key) {
    return dict && Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : null;
  }

  return {
    lang: lang,
    pick: pick,

    text: function (dict, key) {
      var e = entry(dict, key);
      return e ? pick(e[0], e[1]) : key;
    },

    // 取词并替换 {name} 占位符
    format: function (dict, key, vars) {
      var e = entry(dict, key);
      if (!e) return key;
      var out = pick(e[0], e[1]);
      for (var name in vars) {
        if (Object.prototype.hasOwnProperty.call(vars, name)) {
          out = out.split("{" + name + "}").join(vars[name]);
        }
      }
      return out;
    },

    // 替换带 data-i18n / data-i18n-attr 的节点
    // data-i18n-attr 写法："aria-label:key" 或 "title:a,aria-label:b"
    apply: function (dict, root) {
      var scope = root || document;
      var nodes = scope.querySelectorAll("[data-i18n]");
      for (var i = 0; i < nodes.length; i++) {
        var e = entry(dict, nodes[i].getAttribute("data-i18n"));
        if (e) nodes[i].textContent = pick(e[0], e[1]);
      }

      var attrNodes = scope.querySelectorAll("[data-i18n-attr]");
      for (var j = 0; j < attrNodes.length; j++) {
        var pairs = attrNodes[j].getAttribute("data-i18n-attr").split(",");
        for (var k = 0; k < pairs.length; k++) {
          var bits = pairs[k].split(":");
          var attr = bits[0].trim();
          var e2 = entry(dict, (bits[1] || "").trim());
          if (attr && e2) attrNodes[j].setAttribute(attr, pick(e2[0], e2[1]));
        }
      }
    },
  };
})();

document.documentElement.lang = window.GameI18N.lang === "en" ? "en" : "zh-CN";
