import { useState, useMemo } from "react";
import DATA from "./patterns.json";

const C = { bg:"#0A0A0B", sf:"#161719", ln:"#2A2D31", ac:"#FF5A2C", bl:"#4C7DF0",
  vt:"#B57BFF", gn:"#22C55E", rd:"#E24B4A", tx:"#F4F5F7", mu:"#8B9096" };

const T = {
  en: { title:"Chart Reading Simulator", tagline:"Read the signals. Assess the odds. Learn calibration.",
    based:"Chart signals · probability training", chooseGroup:"Choose instrument group",
    sessLen:"Session length", test:"Test", quick:"Quick", medium:"Medium", all:"All",
    start:"Show the chart signals", ex:"e.g.", reliability:"Reliability", moves:"Moves",
    reading:"Reading the chart…", signalsOut:"Signals on the chart", again:"Deal again",
    rowF:"Chart patterns", rowI:"Indicators & volume", rowC:"Candlestick patterns",
    yourDecision:"Your decision", up:"Up", down:"Down", skip:"Skip", strength:"Signal strength",
    stake:"Stake", openTrade:"Open trade", skipTrade:"Skip this trade", weak:"coin toss", strong:"almost sure",
    yourChoice:"Your call", market:"Market", combined:"Combined probability", trueProb:"true prob",
    howWorks:"What came out and how it works", calib:"Your estimate", vsReal:"real",
    verd:{ right:{t:"Correct decision",e:"Profit on a high-probability setup ({p}%). Good risk/reward — this is how capital grows."},
      lucky:{t:"Lucky",e:"You profited, but your direction's real probability was only {p}%. Poor risk/reward — over time such trades drain the account."},
      unlucky:{t:"Right call, unlucky",e:"You lost, but the setup was in your favor ({p}%). A correct decision with a bad outcome — this is acceptable."},
      mistake:{t:"Mistake",e:"Loss on a low-probability bet ({p}%). Both the decision and the outcome were poor."},
      fair:{t:"Borderline",e:"The setup was close to 50/50 ({p}%) — a marginal call either way."},
      skipGood:{t:"Good skip",e:"Signals conflicted (edge only {p}%). Correctly stayed out of a coin toss."},
      skipMiss:{t:"Missed chance",e:"There was a real edge ({p}%). Skipping cost you a good opportunity."},
      skipOk:{t:"Fair skip",e:"A modest edge ({p}%) — skipping is defensible."} },
    round:"Round", continue:"Continue", showResult:"Show result", newSession:"New session",
    sessionDone:"{n} rounds played", decisionQuality:"Decision quality", calibration:"Calibration", skips:"Skips", dynamics:"P&L dynamics",
    ranks:{ k1:"Novice", k2:"Chart reader", k3:"Analyst", k4:"Calibration master" } },
  ru: { title:"Тренажёр чтения графика", tagline:"Читайте сигналы. Оценивайте вероятность. Учитесь калибровке.",
    based:"Сигналы графика · тренировка вероятности", chooseGroup:"Выберите группу инструментов",
    sessLen:"Длина сессии", test:"Тест", quick:"Быстрый", medium:"Средний", all:"Все",
    start:"Показать сигналы графика", ex:"напр.", reliability:"Надёжность", moves:"Движения",
    reading:"Читаем график…", signalsOut:"Сигналы на графике", again:"Ещё раз",
    rowF:"Графические фигуры", rowI:"Индикаторы и объёмы", rowC:"Свечные комбинации",
    yourDecision:"Ваше решение", up:"Вверх", down:"Вниз", skip:"Пропустить", strength:"Сила сигнала",
    stake:"Ставка", openTrade:"Открыть сделку", skipTrade:"Пропустить сделку", weak:"случайность", strong:"почти точно",
    yourChoice:"Ваш выбор", market:"Рынок", combined:"Общая вероятность", trueProb:"реальная",
    howWorks:"Что выпало и как это работает", calib:"Ваша оценка", vsReal:"реально",
    verd:{ right:{t:"Правильное решение",e:"Прибыль на сигнале с высокой вероятностью ({p}%). Хороший risk/reward — так и растёт капитал."},
      lucky:{t:"Повезло",e:"Вы заработали, но реальная вероятность вашего направления была лишь {p}%. Плохой risk/reward — на дистанции такие сделки съедают депозит."},
      unlucky:{t:"Верное решение, не повезло",e:"Вы потеряли, но расклад был в вашу пользу ({p}%). Правильное решение с плохим исходом — это приемлемо."},
      mistake:{t:"Ошибка",e:"Убыток на ставке с низкой вероятностью ({p}%). И решение, и исход были плохими."},
      fair:{t:"Пограничный случай",e:"Расклад был близок к 50/50 ({p}%) — спорный выбор в любую сторону."},
      skipGood:{t:"Правильный пропуск",e:"Сигналы конфликтовали (перевес лишь {p}%). Вы верно не полезли в мутный сигнал."},
      skipMiss:{t:"Упущено",e:"Был реальный перевес ({p}%). Пропуск стоил вам хорошей возможности."},
      skipOk:{t:"Допустимый пропуск",e:"Умеренный перевес ({p}%) — пропуск оправдан."} },
    round:"Раунд", continue:"Продолжить", showResult:"Показать итог", newSession:"Новая сессия",
    sessionDone:"Сыграно раундов: {n}", decisionQuality:"Качество решений", calibration:"Калибровка", skips:"Пропусков", dynamics:"Динамика P&L",
    ranks:{ k1:"Новичок", k2:"Читатель графика", k3:"Аналитик", k4:"Мастер калибровки" } },
  ua: { title:"Тренажер читання графіка", tagline:"Читайте сигнали. Оцінюйте ймовірність. Вчіться калібрування.",
    based:"Сигнали графіка · тренування ймовірності", chooseGroup:"Оберіть групу інструментів",
    sessLen:"Довжина сесії", test:"Тест", quick:"Швидкий", medium:"Середній", all:"Усі",
    start:"Показати сигнали графіка", ex:"напр.", reliability:"Надійність", moves:"Рухи",
    reading:"Читаємо графік…", signalsOut:"Сигнали на графіку", again:"Ще раз",
    rowF:"Графічні фігури", rowI:"Індикатори та об'єми", rowC:"Свічкові комбінації",
    yourDecision:"Ваше рішення", up:"Вгору", down:"Вниз", skip:"Пропустити", strength:"Сила сигналу",
    stake:"Ставка", openTrade:"Відкрити угоду", skipTrade:"Пропустити угоду", weak:"випадковість", strong:"майже точно",
    yourChoice:"Ваш вибір", market:"Ринок", combined:"Загальна ймовірність", trueProb:"реальна",
    howWorks:"Що випало і як це працює", calib:"Ваша оцінка", vsReal:"реально",
    verd:{ right:{t:"Правильне рішення",e:"Прибуток на сигналі з високою ймовірністю ({p}%). Добрий risk/reward — так і росте капітал."},
      lucky:{t:"Пощастило",e:"Ви заробили, але реальна ймовірність вашого напряму була лише {p}%. Поганий risk/reward — на дистанції такі угоди з'їдають депозит."},
      unlucky:{t:"Вірне рішення, не пощастило",e:"Ви втратили, але розклад був на вашу користь ({p}%). Правильне рішення з поганим результатом — це прийнятно."},
      mistake:{t:"Помилка",e:"Збиток на ставці з низькою ймовірністю ({p}%). І рішення, і результат були поганими."},
      fair:{t:"Межовий випадок",e:"Розклад був близький до 50/50 ({p}%) — спірний вибір у будь-який бік."},
      skipGood:{t:"Правильний пропуск",e:"Сигнали конфліктували (перевага лише {p}%). Ви вірно не полізли в каламутний сигнал."},
      skipMiss:{t:"Втрачено",e:"Була реальна перевага ({p}%). Пропуск коштував вам гарної можливості."},
      skipOk:{t:"Припустимий пропуск",e:"Помірна перевага ({p}%) — пропуск виправданий."} },
    round:"Раунд", continue:"Продовжити", showResult:"Показати підсумок", newSession:"Нова сесія",
    sessionDone:"Зіграно раундів: {n}", decisionQuality:"Якість рішень", calibration:"Калібрування", skips:"Пропусків", dynamics:"Динаміка P&L",
    ranks:{ k1:"Новачок", k2:"Читач графіка", k3:"Аналітик", k4:"Майстер калібрування" } },
  uz: { title:"Grafik o'qish simulyatori", tagline:"Signallarni o'qing. Ehtimolni baholang. Kalibrlashni o'rganing.",
    based:"Grafik signallari · ehtimol mashqi", chooseGroup:"Asbob guruhini tanlang",
    sessLen:"Sessiya uzunligi", test:"Test", quick:"Tez", medium:"O'rta", all:"Hammasi",
    start:"Grafik signallarini ko'rsatish", ex:"masalan", reliability:"Ishonchlilik", moves:"Harakatlar",
    reading:"Grafik o'qilyapti…", signalsOut:"Grafikdagi signallar", again:"Yana",
    rowF:"Grafik shakllar", rowI:"Indikatorlar va hajm", rowC:"Sham kombinatsiyalari",
    yourDecision:"Sizning qaroringiz", up:"Yuqoriga", down:"Pastga", skip:"O'tkazish", strength:"Signal kuchi",
    stake:"Tikish", openTrade:"Savdo ochish", skipTrade:"Savdoni o'tkazish", weak:"tasodif", strong:"deyarli aniq",
    yourChoice:"Sizning tanlovingiz", market:"Bozor", combined:"Umumiy ehtimol", trueProb:"haqiqiy",
    howWorks:"Nima chiqdi va qanday ishlaydi", calib:"Sizning bahoyingiz", vsReal:"haqiqatda",
    verd:{ right:{t:"To'g'ri qaror",e:"Yuqori ehtimolli signalda foyda ({p}%). Yaxshi risk/reward — kapital shunday o'sadi."},
      lucky:{t:"Omad keldi",e:"Foyda oldingiz, lekin yo'nalishingizning haqiqiy ehtimoli faqat {p}% edi. Yomon risk/reward."},
      unlucky:{t:"To'g'ri qaror, omad kelmadi",e:"Yo'qotdingiz, lekin vaziyat foydangizga edi ({p}%). To'g'ri qaror, yomon natija — bu maqbul."},
      mistake:{t:"Xato",e:"Past ehtimolli tikishda zarar ({p}%). Ham qaror, ham natija yomon edi."},
      fair:{t:"Chegaraviy holat",e:"Vaziyat 50/50 ga yaqin edi ({p}%) — har ikki tomon uchun bahsli."},
      skipGood:{t:"To'g'ri o'tkazish",e:"Signallar qarama-qarshi edi (ustunlik faqat {p}%). To'g'ri o'tkazdingiz."},
      skipMiss:{t:"Imkoniyat boy berildi",e:"Haqiqiy ustunlik bor edi ({p}%). O'tkazish yaxshi imkoniyatga tushdi."},
      skipOk:{t:"Maqbul o'tkazish",e:"O'rtacha ustunlik ({p}%) — o'tkazish oqilona."} },
    round:"Raund", continue:"Davom etish", showResult:"Natijani ko'rsatish", newSession:"Yangi sessiya",
    sessionDone:"O'ynalgan raundlar: {n}", decisionQuality:"Qaror sifati", calibration:"Kalibrlash", skips:"O'tkazishlar", dynamics:"P&L dinamikasi",
    ranks:{ k1:"Yangi", k2:"Grafik o'quvchi", k3:"Tahlilchi", k4:"Kalibrlash ustasi" } },
};
const L = (o, lang) => (o && typeof o === "object" ? (o[lang] || o.ru || o.en) : o);
const SESS = [ { k:"test", len:1 }, { k:"quick", len:5 }, { k:"medium", len:10 }, { k:"all", len:30 } ];
const RELI = { low:"★★★", trend:"★★", high:"★" };
const MOVES = { low:"$", trend:"$$", high:"$$$" };
const ROWS = ["F","I","C"];
const rnd = (a) => a[Math.floor(Math.random()*a.length)];
const STAKE = 1000;
const clamp = (x,a,b) => Math.max(a, Math.min(b, x));

// вероятность отработки сигнала в его сторону, с поправкой на группу
const adjProb = (sig, group) => sig.dir === "neutral" ? 50 : clamp(sig.base + DATA.groupMod[group], 35, 92);
// приведение к вероятности движения ВВЕРХ
const pUpOf = (sig, group) => {
  const a = adjProb(sig, group);
  return sig.dir === "up" ? a : sig.dir === "down" ? 100 - a : 50;
};
// комбинирование 3 сигналов: согласованные усиливают, конфликтующие тянут к 50
function combineUp(sigs, group) {
  const raw = sigs.reduce((s, x) => s + (pUpOf(x, group) - 50), 0);
  return clamp(Math.round(50 + raw * 0.7), 5, 95);
}
function verdictOf(dir, pnl, pDir, edge) {
  if (dir === "skip") return edge <= 58 ? "skipGood" : edge >= 65 ? "skipMiss" : "skipOk";
  const profit = pnl > 0;
  if (profit && pDir >= 58) return "right";
  if (profit && pDir < 45) return "lucky";
  if (!profit && pDir >= 58) return "unlucky";
  if (!profit && pDir < 45) return "mistake";
  return "fair";
}
const VCOL = { right:"#22C55E", lucky:"#EAB308", unlucky:"#4C7DF0", mistake:"#E24B4A", fair:"#8B9096",
  skipGood:"#22C55E", skipMiss:"#EAB308", skipOk:"#8B9096" };
// качество решения (не исход!) для каждого вердикта: 0..1
const QUAL = { right:1, unlucky:0.85, skipGood:1, skipOk:0.6, fair:0.5, lucky:0.3, skipMiss:0.3, mistake:0 };
const rankKey = (q) => q < 0.4 ? "k1" : q < 0.6 ? "k2" : q < 0.8 ? "k3" : "k4";

function PatternIcon({ icon, color, size=42 }) {
  const s = { fill:"none", stroke:color, strokeWidth:2, strokeLinejoin:"round", strokeLinecap:"round" };
  const mu = "#5F6166";
  const cndl = (x,wt,wb,bt,bb,col,filled=true) => (
    <g key={x+"-"+bt}>
      <line x1={x} y1={wt} x2={x} y2={wb} stroke={col} strokeWidth="1.4" />
      <rect x={x-4} y={bt} width="8" height={Math.max(2,bb-bt)} fill={filled?col:C.bg} stroke={col} strokeWidth="1.4" />
    </g>
  );
  const I = {
    headshoulders:<polyline points="2,26 9,19 13,22 19,10 24,6 29,10 35,22 39,19 46,26" {...s}/>,
    doubletop:<polyline points="3,25 11,7 17,16 23,7 31,25" {...s}/>,
    doublebottom:<polyline points="3,7 11,25 17,16 23,25 31,7" {...s}/>,
    triangleup:<g><line x1="5" y1="8" x2="43" y2="8" {...s}/><line x1="5" y1="26" x2="43" y2="11" {...s}/></g>,
    triangledown:<g><line x1="5" y1="26" x2="43" y2="26" {...s}/><line x1="5" y1="8" x2="43" y2="23" {...s}/></g>,
    flagup:<polyline points="4,28 10,10 14,15 18,12 22,17 27,7" {...s}/>,
    flagdown:<polyline points="4,4 10,22 14,17 18,20 22,15 27,25" {...s}/>,
    pennant:<g><line x1="6" y1="30" x2="6" y2="13" {...s}/><line x1="6" y1="10" x2="24" y2="17" {...s}/><line x1="6" y1="24" x2="24" y2="17" {...s}/><line x1="24" y1="17" x2="32" y2="9" {...s}/></g>,
    wedge:<g><line x1="4" y1="26" x2="42" y2="9" {...s}/><line x1="4" y1="17" x2="42" y2="12" {...s}/></g>,
    cup:<g><path d="M4,7 Q24,36 44,7" {...s}/><line x1="44" y1="7" x2="47" y2="13" {...s}/></g>,
    macross:<g><line x1="4" y1="9" x2="44" y2="23" stroke={color} strokeWidth="2"/><line x1="4" y1="21" x2="44" y2="13" stroke={mu} strokeWidth="2"/></g>,
    macrossup:<g><line x1="4" y1="23" x2="44" y2="9" stroke={color} strokeWidth="2"/><line x1="4" y1="15" x2="44" y2="21" stroke={mu} strokeWidth="2"/></g>,
    goldcross:<g><line x1="4" y1="25" x2="44" y2="7" stroke={color} strokeWidth="2.4"/><line x1="4" y1="14" x2="44" y2="20" stroke={mu} strokeWidth="2"/></g>,
    rsidiv:<g><line x1="4" y1="22" x2="44" y2="11" stroke={mu} strokeWidth="2"/><line x1="4" y1="11" x2="44" y2="22" stroke={color} strokeWidth="2" strokeDasharray="3 2"/></g>,
    rsiover:<g><line x1="4" y1="25" x2="44" y2="8" stroke={color} strokeWidth="2"/><line x1="4" y1="8" x2="44" y2="8" stroke={mu} strokeWidth="1.4" strokeDasharray="3 2"/></g>,
    macd:<g><polyline points="4,20 22,13 44,9" {...s}/><rect x="12" y="22" width="3" height="6" fill={color}/><rect x="20" y="20" width="3" height="8" fill={color}/><rect x="28" y="18" width="3" height="10" fill={color}/></g>,
    breakvol:<g><polyline points="4,22 24,22 30,7" {...s}/><rect x="34" y="14" width="4" height="14" fill={color}/><rect x="40" y="10" width="4" height="18" fill={color}/></g>,
    breaknovol:<g><polyline points="4,22 24,22 30,7" stroke={color} strokeWidth="2" fill="none" strokeDasharray="3 2"/><rect x="38" y="24" width="4" height="4" fill={mu}/></g>,
    bollinger:<g><line x1="4" y1="8" x2="44" y2="14" stroke={mu} strokeWidth="1.6"/><line x1="4" y1="24" x2="44" y2="18" stroke={mu} strokeWidth="1.6"/><polyline points="4,16 16,13 28,19 44,16" {...s}/></g>,
    bounce:<g><line x1="4" y1="25" x2="44" y2="25" stroke={mu} strokeWidth="1.6" strokeDasharray="3 2"/><polyline points="7,9 21,24 35,9" {...s}/></g>,
    bullengulf:<g>{cndl(14,10,24,13,20,mu,false)}{cndl(30,4,28,8,24,color,true)}</g>,
    bearengulf:<g>{cndl(14,8,22,12,18,mu,true)}{cndl(30,4,28,8,24,color,false)}</g>,
    hammer:<g>{cndl(24,5,26,5,11,color,false)}</g>,
    shooting:<g>{cndl(24,6,27,21,27,color,true)}</g>,
    morningstar:<g>{cndl(10,6,24,8,22,mu,true)}{cndl(24,18,28,22,26,mu,false)}{cndl(38,7,26,9,22,color,false)}</g>,
    eveningstar:<g>{cndl(10,7,24,9,22,mu,false)}{cndl(24,5,10,5,8,mu,true)}{cndl(38,6,26,10,24,color,true)}</g>,
    doji:<g><line x1="24" y1="5" x2="24" y2="27" stroke={color} strokeWidth="1.6"/><line x1="15" y1="16" x2="33" y2="16" stroke={color} strokeWidth="2.6"/></g>,
    soldiers:<g>{cndl(12,20,28,22,26,color,false)}{cndl(24,12,24,14,22,color,false)}{cndl(36,5,18,7,16,color,false)}</g>,
    crows:<g>{cndl(12,4,12,6,10,color,true)}{cndl(24,8,20,10,18,color,true)}{cndl(36,14,28,16,26,color,true)}</g>,
    harami:<g>{cndl(13,6,26,8,24,color,false)}{cndl(31,14,21,15,20,mu,true)}</g>,
  };
  return <svg viewBox="0 0 48 32" width={size} height={size*0.66} style={{display:"block"}}>{I[icon]||null}</svg>;
}

export default function ChartReadingSimulator() {
  const [lang, setLang] = useState("ru");
  const [phase, setPhase] = useState("idle"); // idle | spinning | decide
  const [group, setGroup] = useState("trend");
  const [sessionLen, setSessionLen] = useState(5);
  const [active, setActive] = useState(null);
  const [nonce, setNonce] = useState(0);
  const [dir, setDir] = useState(null);      // up | down | skip
  const [strength, setStrength] = useState(60);
  const [result, setResult] = useState(null);
  const [roundNum, setRoundNum] = useState(1);
  const [sessionData, setSessionData] = useState([]);
  const t = T[lang];
  const G = DATA.groups;

  const byRow = useMemo(() => {
    const m = { F:[], I:[], C:[] };
    DATA.signals.forEach((s) => m[s.row].push(s));
    return m;
  }, []);

  function deal() {
    setActive({ F:rnd(byRow.F), I:rnd(byRow.I), C:rnd(byRow.C) });
    setDir(null); setStrength(60); setResult(null);
    setPhase("spinning");
    setNonce((n) => n + 1);
    setTimeout(() => setPhase("decide"), 1900 + 500);
  }

  function startSession() {
    setRoundNum(1); setSessionData([]);
    deal();
  }
  function nextRound() {
    if (roundNum >= sessionLen) { setPhase("final"); return; }
    setRoundNum((n) => n + 1);
    deal();
  }

  function confirm() {
    if (!dir) return;
    const sigs = ROWS.map((r) => active[r]);
    const pUp = combineUp(sigs, group);
    const pDown = 100 - pUp;
    const up = Math.random() * 100 < pUp;                       // истинный исход
    const amp = G[group].vol * 4 * (0.7 + Math.random() * 0.6); // амплитуда, %
    const move = +((up ? 1 : -1) * amp).toFixed(1);
    let pnl = 0, pDir = 50;
    if (dir !== "skip") {
      pnl = Math.round((dir === "up" ? 1 : -1) * STAKE * (move / 100));
      pDir = dir === "up" ? pUp : pDown;
    }
    const edge = Math.max(pUp, pDown);
    const vk = verdictOf(dir, pnl, pDir, edge);
    const probForText = dir === "skip" ? edge : pDir;
    setResult({ pUp, pDown, up, move, pnl, pDir, edge, vk, probForText,
      sigs: sigs.map((x) => ({ id:x.id, row:x.row, dir:x.dir, p:adjProb(x, group), pUp:pUpOf(x, group), t:x.t, d:x.d, icon:x.icon })) });
    setSessionData((d) => [...d, { pnl, quality:QUAL[vk], calibErr: dir==="skip" ? null : Math.abs(strength - pDir), skip: dir==="skip" }]);
    setPhase("result");
  }

  return (
    <div className="crs">
      <style>{CSS}</style>
      <div className="top">
        <span className="brand"><span className="brand-mk" />{t.title}</span>
        <span className="langs">
          {["en","ru","ua","uz"].map((l) => (
            <button key={l} className={"lang" + (lang===l?" on":"")} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>
          ))}
        </span>
      </div>

      {phase === "idle" && (
        <section className="idle">
          <span className="badge">{t.based}</span>
          <h1 className="h1">{t.tagline}</h1>
          <div className="eyebrow">{t.chooseGroup}</div>
          <div className="groups">
            {Object.entries(G).map(([id, g]) => (
              <button key={id} className={"gcard" + (group===id?" on":"")}
                style={group===id?{borderColor:g.hue,background:g.hue+"14"}:{}}
                onClick={()=>setGroup(id)}>
                <div className="gtop"><span className="gname">{L(g.name, lang)}</span>
                  <span className="grad" style={group===id?{borderColor:g.hue,background:`radial-gradient(circle,${g.hue} 0 38%,transparent 42%)`}:{}} /></div>
                <div className="gex">{t.ex}: {L(g.ex, lang)}</div>
                <div className="gmeta"><span style={{color:g.hue}}>{t.reliability}: {RELI[id]}</span><span className="gmu">{t.moves}: {MOVES[id]}</span></div>
              </button>
            ))}
          </div>
          <div className="eyebrow">{t.sessLen}</div>
          <div className="sess">
            {SESS.map((s) => (
              <button key={s.k} className={"schip" + (sessionLen===s.len?" on":"")} onClick={()=>setSessionLen(s.len)}>
                <span className="sname">{t[s.k]}</span><span className="slen">{s.len}</span>
              </button>
            ))}
          </div>
          <button className="cta" onClick={startSession}>{t.start}</button>
        </section>
      )}

      {(phase === "spinning" || phase === "decide" || phase === "result") && active && (
        <section className="board">
          <div className="board-head">
            <span className="chip-g" style={{color:G[group].hue,borderColor:G[group].hue+"66",background:G[group].hue+"14"}}>{L(G[group].name, lang)}</span>
            <span className="board-status">{t.round} {roundNum}/{sessionLen}</span>
          </div>

          {phase === "spinning" && (
            <div className="ribbons" key={nonce}>
              {ROWS.map((r, i) => {
                const hue = DATA.rows[r].hue;
                const strip = Array.from({length:11}, () => rnd(byRow[r])).concat(active[r]);
                const cnt = strip.length;
                return (
                  <div className="rb-row" key={r}>
                    <div className="rb-lbl" style={{color:hue}}>{L(DATA.rows[r].name, lang)}</div>
                    <div className="rb-win">
                      <div className="rb-strip spin"
                        style={{ width:`${cnt*100}%`, animationDelay:`${i*0.18}s`, ["--end"]:`-${(cnt-1)/cnt*100}%` }}>
                        {strip.map((sig, k) => (
                          <div className="rb-cell" style={{width:`${100/cnt}%`, borderLeftColor:hue}} key={k}>
                            <PatternIcon icon={sig.icon} color={hue} />
                            <span className="rb-nm">{L(sig.t, lang)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {phase === "decide" && (
            <>
              <div className="cards">
                {ROWS.map((r) => {
                  const hue = DATA.rows[r].hue; const sig = active[r];
                  return (
                    <div className="scard" style={{borderLeftColor:hue}} key={r}>
                      <div className="sc-ic"><PatternIcon icon={sig.icon} color={hue} /></div>
                      <div className="sc-tx">
                        <div className="sc-row" style={{color:hue}}>{L(DATA.rows[r].name, lang)}</div>
                        <div className="sc-nm">{L(sig.t, lang)}</div>
                        <div className="sc-d">{L(sig.d, lang)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="dec">
                <div className="eyebrow">{t.yourDecision}</div>
                <div className="dirs">
                  <button className={"dir" + (dir==="up"?" on up":"")} onClick={()=>setDir("up")}>↑ {t.up}</button>
                  <button className={"dir" + (dir==="down"?" on dn":"")} onClick={()=>setDir("down")}>↓ {t.down}</button>
                  <button className={"dir" + (dir==="skip"?" on sk":"")} onClick={()=>setDir("skip")}>{t.skip}</button>
                </div>

                {dir && dir!=="skip" && (
                  <div className="str">
                    <div className="str-lbl"><span>{t.strength}</span><span className="str-v">{strength}%</span></div>
                    <input type="range" min="50" max="95" step="5" value={strength} onChange={(e)=>setStrength(+e.target.value)} />
                    <div className="str-ends"><span>50% {t.weak}</span><span>95% {t.strong}</span></div>
                  </div>
                )}

                <div className="stake">{t.stake}: <b>${STAKE.toLocaleString()}</b></div>
                <button className="cta" disabled={!dir} style={!dir?{opacity:.5}:{}} onClick={confirm}>
                  {dir==="skip" ? t.skipTrade : t.openTrade}
                </button>
                <button className="cta ghost" onClick={deal}>{t.again}</button>
              </div>
            </>
          )}
          {phase === "result" && result && (
            <div className="res">
              <div className="res-top">
                <div className="res-choice">
                  {t.yourChoice}: <b style={{color: dir==="up"?C.gn:dir==="down"?C.rd:C.mu}}>
                    {dir==="skip" ? t.skip : (dir==="up"?("↑ "+t.up):("↓ "+t.down)) + " · " + strength + "%"}
                  </b>
                  {" · "}{t.market}: <b style={{color: result.up?C.gn:C.rd}}>{result.up?"↑":"↓"} {result.move>0?"+":""}{result.move}%</b>
                </div>
                {dir!=="skip" && <div className={"res-pnl " + (result.pnl>=0?"up":"dn")}>{result.pnl>=0?"+":"−"}${Math.abs(result.pnl)}</div>}
              </div>

              <div className="verd" style={{borderColor:VCOL[result.vk]+"66", background:VCOL[result.vk]+"14"}}>
                <div className="verd-t" style={{color:VCOL[result.vk]}}>{t.verd[result.vk].t}</div>
                <div className="verd-e">{t.verd[result.vk].e.replace("{p}", result.probForText)}</div>
              </div>

              <div className="eyebrow">{t.howWorks}</div>
              <div className="cards">
                {result.sigs.map((sg) => {
                  const hue = DATA.rows[sg.row].hue;
                  const arrow = sg.dir==="up" ? "↑" : sg.dir==="down" ? "↓" : "≈";
                  const acol = sg.dir==="up" ? C.gn : sg.dir==="down" ? C.rd : C.mu;
                  return (
                    <div className="scard" style={{borderLeftColor:hue}} key={sg.id}>
                      <div className="sc-ic"><PatternIcon icon={sg.icon} color={hue} /></div>
                      <div className="sc-tx">
                        <div className="sc-head"><span className="sc-nm">{L(sg.t, lang)}</span><span className="sc-p" style={{color:acol}}>{arrow} {sg.p}%</span></div>
                        <div className="sc-d">{L(sg.d, lang)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="combo">
                <div className="combo-h"><span>{t.combined} ↑</span><span className="combo-v">{result.pUp}%</span></div>
                <div className="combo-bar"><span style={{width:result.pUp+"%",background:C.gn}} /><span style={{width:result.pDown+"%",background:C.rd}} /></div>
                <div className="combo-ends"><span style={{color:C.gn}}>↑ {result.pUp}%</span><span style={{color:C.rd}}>↓ {result.pDown}%</span></div>
                {dir!=="skip" && (
                  <div className="combo-note">{t.calib}: {strength}% · {t.vsReal}: {result.pDir}%</div>
                )}
              </div>

              <button className="cta" onClick={nextRound}>
                {roundNum >= sessionLen ? t.showResult : t.continue}
              </button>
            </div>
          )}
        </section>
      )}

      {phase === "final" && (() => {
        const n = sessionData.length || 1;
        const totalPnl = sessionData.reduce((s, x) => s + x.pnl, 0);
        const avgQ = sessionData.reduce((s, x) => s + x.quality, 0) / n;
        const calibRounds = sessionData.filter((x) => x.calibErr != null);
        const avgCalib = calibRounds.length ? Math.round(100 - calibRounds.reduce((s, x) => s + x.calibErr, 0) / calibRounds.length) : null;
        const rk = t.ranks[rankKey(avgQ)];
        const skips = sessionData.filter((x) => x.skip).length;
        // кривая капитала
        let cum = 0; const pts = sessionData.map((x) => (cum += x.pnl));
        const mn = Math.min(0, ...pts), mx = Math.max(0, ...pts), rg = mx - mn || 1;
        const curve = pts.map((v, i) => `${pts.length === 1 ? 0 : (i / (pts.length - 1)) * 300},${64 - ((v - mn) / rg) * 56}`).join(" ");
        const base = 64 - ((0 - mn) / rg) * 56;
        return (
          <section className="final">
            <div className="fin-rank">{rk}</div>
            <div className={"fin-pnl " + (totalPnl >= 0 ? "up" : "dn")}>{totalPnl >= 0 ? "+" : "−"}${Math.abs(totalPnl)}</div>
            <div className="fin-sub">{t.sessionDone.replace("{n}", n)}</div>

            <div className="fin-metrics">
              <div className="fmet"><div className="fmet-v">{Math.round(avgQ * 100)}%</div><div className="fmet-l">{t.decisionQuality}</div></div>
              <div className="fmet"><div className="fmet-v">{avgCalib != null ? avgCalib + "%" : "—"}</div><div className="fmet-l">{t.calibration}</div></div>
              <div className="fmet"><div className="fmet-v">{skips}</div><div className="fmet-l">{t.skips}</div></div>
            </div>

            {pts.length > 1 && (
              <div className="fin-curve">
                <div className="eyebrow" style={{textAlign:"center"}}>{t.dynamics}</div>
                <svg viewBox="0 0 300 70" preserveAspectRatio="none" className="curve">
                  <line x1="0" y1={base} x2="300" y2={base} stroke={C.ln} strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                  <polyline points={curve} fill="none" stroke={totalPnl >= 0 ? C.gn : C.rd} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </div>
            )}

            <button className="cta" onClick={() => setPhase("idle")}>{t.newSession}</button>
          </section>
        );
      })()}
    </div>
  );
}

const CSS = `
.crs{width:100%;max-width:440px;margin:0 auto;color:${C.tx};font-family:inherit;background:${C.bg};min-height:100vh;}
.top{display:flex;justify-content:space-between;align-items:center;padding:13px 16px;border-bottom:1px solid ${C.ln};background:#0D0D0F;position:sticky;top:0;z-index:5;}
.brand{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;}
.brand-mk{width:16px;height:16px;border-radius:5px;background:${C.ac};display:inline-block;}
.langs{display:inline-flex;gap:2px;background:${C.sf};border:1px solid ${C.ln};border-radius:9px;padding:2px;}
.lang{font-size:10px;font-weight:600;color:${C.mu};background:none;border:none;border-radius:7px;padding:4px 7px;cursor:pointer;font-family:inherit;}
.lang.on{color:${C.bg};background:${C.ac};}
.idle{padding:22px 18px 30px;display:flex;flex-direction:column;align-items:center;text-align:center;}
.badge{display:inline-block;border:1px solid ${C.ac}59;background:${C.ac}14;color:#FF7A52;border-radius:20px;padding:6px 13px;font-size:11px;font-weight:700;margin-bottom:16px;}
.h1{font-size:20px;line-height:1.3;font-weight:800;margin:0 0 22px;max-width:340px;}
.eyebrow{align-self:flex-start;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:${C.mu};font-weight:700;margin-bottom:10px;}
.groups{width:100%;display:flex;flex-direction:column;gap:9px;margin-bottom:20px;}
.gcard{background:${C.sf};border:1px solid ${C.ln};border-radius:13px;padding:13px;cursor:pointer;font-family:inherit;text-align:left;}
.gtop{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;}
.gname{font-size:14.5px;font-weight:800;color:${C.tx};}
.grad{width:18px;height:18px;border-radius:50%;border:2px solid ${C.ln};flex:0 0 18px;}
.gex{font-size:11px;color:${C.mu};line-height:1.35;margin-bottom:8px;}
.gmeta{display:flex;justify-content:space-between;font-size:11px;font-weight:700;}
.gmu{color:${C.mu};}
.sess{width:100%;display:flex;gap:7px;margin-bottom:22px;}
.schip{flex:1;background:${C.sf};border:1px solid ${C.ln};border-radius:10px;padding:9px 4px;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;gap:2px;align-items:center;}
.schip.on{border-color:${C.ac};background:${C.ac}1A;}
.sname{font-size:12px;font-weight:700;color:${C.tx};}
.slen{font-size:11px;color:${C.mu};}
.schip.on .slen{color:${C.ac};}
.cta{width:100%;background:${C.ac};color:${C.bg};border:none;border-radius:12px;padding:15px;font-size:14.5px;font-weight:800;font-family:inherit;cursor:pointer;}
.cta:disabled{cursor:default;}
.cta.ghost{background:none;border:1px solid ${C.ln};color:${C.mu};margin-top:10px;}
.board{padding:16px 16px 26px;}
.board-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
.chip-g{font-size:11px;font-weight:700;border:1px solid;border-radius:20px;padding:5px 11px;}
.board-status{font-size:11px;color:${C.mu};}
.ribbons{display:flex;flex-direction:column;gap:11px;}
.rb-row{display:flex;flex-direction:column;gap:5px;}
.rb-lbl{font-size:9px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;}
.rb-win{overflow:hidden;border:1px solid ${C.ln};border-radius:12px;background:${C.sf};height:64px;}
.rb-strip{display:flex;height:100%;}
.rb-strip.spin{animation:rbspin 1.9s cubic-bezier(.15,.7,.2,1) forwards;}
@keyframes rbspin{from{transform:translateX(0);}to{transform:translateX(var(--end));}}
.rb-cell{flex:0 0 auto;height:100%;display:flex;align-items:center;gap:11px;padding:0 14px;border-left:3px solid ${C.ln};box-sizing:border-box;}
.rb-nm{font-size:13px;font-weight:700;color:${C.tx};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cards{display:flex;flex-direction:column;gap:8px;margin-bottom:18px;}
.scard{display:flex;gap:12px;align-items:flex-start;background:${C.sf};border:1px solid ${C.ln};border-left:3px solid ${C.ln};border-radius:0 11px 11px 0;padding:11px 13px;}
.sc-ic{flex:0 0 42px;margin-top:2px;}
.sc-tx{flex:1;}
.sc-row{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:2px;}
.sc-nm{font-size:14px;font-weight:800;color:${C.tx};margin-bottom:3px;}
.sc-d{font-size:11.5px;line-height:1.4;color:${C.mu};}
.dec{}
.dirs{display:flex;gap:7px;margin-bottom:14px;}
.dir{flex:1;text-align:center;font-size:13px;font-weight:800;color:${C.mu};background:${C.sf};border:1px solid ${C.ln};border-radius:10px;padding:12px 0;cursor:pointer;font-family:inherit;}
.dir.on.up{color:${C.bg};background:${C.gn};border-color:${C.gn};}
.dir.on.dn{color:${C.bg};background:${C.rd};border-color:${C.rd};}
.dir.on.sk{color:${C.tx};background:${C.ln};border-color:${C.mu};}
.str{margin-bottom:14px;}
.str-lbl{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:7px;}
.str-lbl span:first-child{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:${C.mu};font-weight:700;}
.str-v{font-size:20px;font-weight:800;color:${C.ac};}
.str input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:3px;background:${C.sf};outline:none;}
.str input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:${C.ac};cursor:pointer;}
.str input[type=range]::-moz-range-thumb{width:18px;height:18px;border:none;border-radius:50%;background:${C.ac};cursor:pointer;}
.str-ends{display:flex;justify-content:space-between;font-size:9px;color:#5F5E5A;margin-top:5px;}
.stake{text-align:center;font-size:12px;color:${C.mu};margin-bottom:14px;}
.stake b{color:${C.tx};}
.res-top{text-align:center;margin-bottom:14px;}
.res-choice{font-size:11.5px;color:${C.mu};line-height:1.5;margin-bottom:4px;}
.res-pnl{font-size:26px;font-weight:800;}
.res-pnl.up{color:${C.gn};} .res-pnl.dn{color:${C.rd};}
.verd{border:1px solid;border-radius:12px;padding:12px 13px;margin-bottom:16px;}
.verd-t{font-size:14px;font-weight:800;margin-bottom:4px;}
.verd-e{font-size:11.5px;line-height:1.5;color:#B8BCC2;}
.sc-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:3px;}
.sc-p{font-size:12px;font-weight:800;white-space:nowrap;}
.combo{background:#0F0E0D;border:1px solid ${C.ln};border-radius:12px;padding:13px;margin-bottom:16px;}
.combo-h{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:9px;font-size:11px;color:${C.mu};}
.combo-v{font-size:20px;font-weight:800;color:${C.tx};}
.combo-bar{height:8px;border-radius:5px;overflow:hidden;display:flex;background:${C.sf};}
.combo-ends{display:flex;justify-content:space-between;font-size:10px;font-weight:700;margin-top:6px;}
.combo-note{font-size:10.5px;color:${C.mu};margin-top:10px;padding-top:9px;border-top:1px solid ${C.ln};text-align:center;}
.final{padding:26px 18px 30px;display:flex;flex-direction:column;align-items:center;text-align:center;}
.fin-rank{font-size:20px;font-weight:800;color:${C.ac};margin-bottom:4px;}
.fin-pnl{font-size:36px;font-weight:800;letter-spacing:-.02em;margin-bottom:2px;}
.fin-pnl.up{color:${C.gn};} .fin-pnl.dn{color:${C.rd};}
.fin-sub{font-size:12px;color:${C.mu};margin-bottom:22px;}
.fin-metrics{display:flex;gap:9px;width:100%;margin-bottom:22px;}
.fmet{flex:1;background:${C.sf};border:1px solid ${C.ln};border-radius:12px;padding:14px 6px;}
.fmet-v{font-size:20px;font-weight:800;color:${C.tx};}
.fmet-l{font-size:10px;color:${C.mu};margin-top:3px;line-height:1.2;}
.fin-curve{width:100%;margin-bottom:22px;}
.curve{width:100%;height:70px;display:block;}
`;
