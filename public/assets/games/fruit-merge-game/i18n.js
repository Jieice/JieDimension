/* ============================================================
   fruit-merge-game 中英文案
   字典格式：键名 → [中文, English]
   依赖 ../shared/game-i18n.js（提供 window.GameI18N）。
   各场景是普通脚本、共享全局作用域，不能各自 const 同名变量，
   因此这里额外挂一个已绑定字典的取词函数 window.FT：
     FT("fruit.menu.start")                 → 取词
     FT("fruit.hud.score", { score: 120 })  → 取词并替换占位符
   ============================================================ */
window.FRUIT_MERGE_I18N = {
  // 文档与加载态
  "fruit.doc.title": ["水果合成狂热 Fruit Merge Mania", "Fruit Merge Mania"],
  "fruit.doc.description": [
    "水果合成：投放水果、同级相撞合成更大的水果，别让果堆越过红线。",
    "Fruit Merge Mania: drop fruits, merge matching ones, and keep the pile below the line.",
  ],
  "fruit.loading": ["加载中…", "Loading…"],
  "fruit.loadFail": ["游戏加载失败，请检查网络后重试", "Failed to load. Check your network and retry."],
  "fruit.reload": ["重新加载", "Reload"],

  // 启动场景
  "fruit.boot.subtitle": ["水果合成狂热", "Merge the Fruits"],

  // 主菜单
  "fruit.menu.highScore": ["最高分", "High Score"],
  "fruit.menu.start": ["开始游戏", "Start"],
  "fruit.menu.hint": ["点击屏幕投放水果", "Tap to drop fruits"],

  // 对局 HUD
  "fruit.hud.score": ["分数: {score}", "Score: {score}"],
  "fruit.hud.best": ["最高分: {score}", "Best: {score}"],
  "fruit.hud.next": ["下一个:", "Next:"],
  "fruit.hud.pause": ["⏸\n暂停", "⏸\nPause"],
  "fruit.hud.watermelon": ["🎉 西瓜！🎉", "🎉 WATERMELON! 🎉"],

  // 暂停场景
  "fruit.pause.title": ["⏸️ 游戏已暂停", "⏸️ Game Paused"],
  "fruit.pause.subtitle": ["游戏暂停中", "GAME PAUSED"],
  "fruit.pause.tips": [
    "💡 点击下方按钮继续游戏或选择其他操作",
    "💡 Tap a button below to continue or pick another option",
  ],
  "fruit.pause.resume": ["▶️ 继续游戏", "▶️ Resume"],
  "fruit.pause.restart": ["🔄 重新开始", "🔄 Restart"],
  "fruit.pause.menu": ["🏠 返回菜单", "🏠 Menu"],
  "fruit.pause.footer": ["游戏进度已保存，可以安全退出", "Progress saved, safe to exit"],

  // 结算场景
  "fruit.over.title": ["游戏结束", "Game Over"],
  "fruit.over.record": ["🎉 新纪录！🎉", "🎉 NEW RECORD! 🎉"],
  "fruit.over.yourScore": ["本局得分", "Your Score"],
  "fruit.over.highScore": ["最高分: {score}", "High Score: {score}"],
  "fruit.over.retry": ["再来一次", "Retry"],
  "fruit.over.menu": ["返回菜单", "Menu"],
  "fruit.over.praise.master": ["太厉害了！🏆", "Master level! 🏆"],
  "fruit.over.praise.great": ["很棒！🌟", "Great job! 🌟"],
  "fruit.over.praise.nice": ["不错！👍", "Nice try! 👍"],
  "fruit.over.praise.keep": ["继续加油！💪", "Keep going! 💪"],
};

window.FT = function (key, vars) {
  var i18n = window.GameI18N;
  var dict = window.FRUIT_MERGE_I18N;
  return vars ? i18n.format(dict, key, vars) : i18n.text(dict, key);
};
