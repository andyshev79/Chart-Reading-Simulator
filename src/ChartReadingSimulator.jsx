import { useState, useMemo } from "react";
import DATA from "./patterns.json";

const C = { bg:"#0A0A0B", sf:"#161719", ln:"#2A2D31", ac:"#FF5A2C", bl:"#4C7DF0",
  vt:"#B57BFF", gn:"#22C55E", rd:"#E24B4A", tx:"#F4F5F7", mu:"#8B9096" };

const T = {
  en: { title:"Chart Reading Simulator", tagline:"Read the signals. Assess the odds. Learn calibration.",
    based:"Chart signals · probability training", chooseGroup:"Choose instrument group",
    sessLen:"Session length", test:"Test", quick:"Quick", medium:"Medium", all:"All",
    start:"Show the chart signals", ex:"e.g.", reliability:"Reliability", moves:"Moves",
    reading:"Reading the chart…", signalsOut:"Signals on the chart", again:"Deal again", next:"Next",
    rowF:"Chart patterns", rowI:"Indicators & volume", rowC:"Candlestick patterns" },
  ru: { title:"Тренажёр чтения графика", tagline:"Читайте сигналы. Оценивайте вероятность. Учитесь калибровке.",
    based:"Сигналы графика · тренировка вероятности", chooseGroup:"Выберите группу инструментов",
    sessLen:"Длина сессии", test:"Тест", quick:"Быстрый", medium:"Средний", all:"Все",
    start:"Показать сигналы графика", ex:"напр.", reliability:"Надёжность", moves:"Движения",
    reading:"Читаем график…", signalsOut:"Сигналы на графике", again:"Ещё раз", next:"Далее",
    rowF:"Графические фигуры", rowI:"Индикаторы и объёмы", rowC:"Свечные комбинации" },
  ua: { title:"Тренажер читання графіка", tagline:"Читайте сигнали. Оцінюйте ймовірність. Вчіться калібрування.",
    based:"Сигнали графіка · тренування ймовірності", chooseGroup:"Оберіть групу інструментів",
    sessLen:"Довжина сесії", test:"Тест", quick:"Швидкий", medium:"Середній", all:"Усі",
    start:"Показати сигнали графіка", ex:"напр.", reliability:"Надійність", moves:"Рухи",
    reading:"Читаємо графік…", signalsOut:"Сигнали на графіку", again:"Ще раз", next:"Далі",
    rowF:"Графічні фігури", rowI:"Індикатори та об'єми", rowC:"Свічкові комбінації" },
  uz: { title:"Grafik o'qish simulyatori", tagline:"Signallarni o'qing. Ehtimolni baholang. Kalibrlashni o'rganing.",
    based:"Grafik signallari · ehtimol mashqi", chooseGroup:"Asbob guruhini tanlang",
    sessLen:"Sessiya uzunligi", test:"Test", quick:"Tez", medium:"O'rta", all:"Hammasi",
    start:"Grafik signallarini ko'rsatish", ex:"masalan", reliability:"Ishonchlilik", moves:"Harakatlar",
    reading:"Grafik o'qilyapti…", signalsOut:"Grafikdagi signallar", again:"Yana", next:"Keyingi",
    rowF:"Grafik shakllar", rowI:"Indikatorlar va hajm", rowC:"Sham kombinatsiyalari" },
};
const L = (o, lang) => (o && typeof o === "object" ? (o[lang] || o.ru || o.en) : o);
const SESS = [ { k:"test", len:1 }, { k:"quick", len:5 }, { k:"medium", len:10 }, { k:"all", len:30 } ];
const RELI = { low:"★★★", trend:"★★", high:"★" };
const MOVES = { low:"$", trend:"$$", high:"$$$" };
const ROWS = ["F","I","C"];
const rnd = (a) => a[Math.floor(Math.random()*a.length)];

// ---- стилизованные иконки паттернов ----
function PatternIcon({ icon, color, size=44 }) {
  const s = { fill:"none", stroke:color, strokeWidth:2, strokeLinejoin:"round", strokeLinecap:"round" };
  const mu = "#5F6166";
  const cndl = (x,wt,wb,bt,bb,col,filled=true) => (
    <g key={x+"-"+bt}>
      <line x1={x} y1={wt} x2={x} y2={wb} stroke={col} strokeWidth="1.4" />
      <rect x={x-4} y={bt} width="8" height={Math.max(2,bb-bt)} fill={filled?col:C.bg} stroke={col} strokeWidth="1.4" />
    </g>
  );
  const I = {
    // фигуры
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
    // индикаторы
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
    // свечи
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
  const [phase, setPhase] = useState("idle"); // idle | spinning | landed
  const [group, setGroup] = useState("trend");
  const [sessionLen, setSessionLen] = useState(5);
  const [active, setActive] = useState(null); // {F,I,C} выпавшие сигналы
  const [nonce, setNonce] = useState(0);
  const t = T[lang];
  const G = DATA.groups;

  const byRow = useMemo(() => {
    const m = { F:[], I:[], C:[] };
    DATA.signals.forEach((s) => m[s.row].push(s));
    return m;
  }, []);

  function deal() {
    const picked = { F:rnd(byRow.F), I:rnd(byRow.I), C:rnd(byRow.C) };
    setActive(picked);
    setPhase("spinning");
    setNonce((n) => n + 1);
    setTimeout(() => setPhase("landed"), 1900 + 500);
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
          <button className="cta" onClick={deal}>{t.start}</button>
        </section>
      )}

      {(phase === "spinning" || phase === "landed") && active && (
        <section className="board">
          <div className="board-head">
            <span className="chip-g" style={{color:G[group].hue,borderColor:G[group].hue+"66",background:G[group].hue+"14"}}>{L(G[group].name, lang)}</span>
            <span className="board-status">{phase==="spinning" ? t.reading : t.signalsOut}</span>
          </div>

          <div className="reels" key={nonce}>
            {ROWS.map((r, i) => {
              const hue = DATA.rows[r].hue;
              const target = active[r];
              const strip = phase==="spinning"
                ? Array.from({length:11}, () => rnd(byRow[r])).concat(target)
                : [target];
              return (
                <div className="reel-row" key={r}>
                  <div className="reel-lbl" style={{color:hue}}>{L(DATA.rows[r].name, lang)}</div>
                  <div className="reel-win">
                    <div className={"reel-strip" + (phase==="spinning"?" spin":"")}
                      style={phase==="spinning" ? { animationDelay:`${i*0.18}s`, ["--end"]:`-${11*74}px` } : {}}>
                      {strip.map((sig, k) => (
                        <div className="reel-cell" key={k} style={{borderColor: (phase==="landed"?hue:C.ln)}}>
                          <div className="cell-ic"><PatternIcon icon={sig.icon} color={hue} /></div>
                          {phase==="landed" && <div className="cell-nm">{L(sig.t, lang)}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {phase === "landed" && (
            <div className="board-actions">
              <button className="cta" onClick={()=>alert("Блок 3: экран решения — следующий шаг")}>{t.next}</button>
              <button className="cta ghost" onClick={deal}>{t.again}</button>
            </div>
          )}
        </section>
      )}
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
.cta.ghost{background:none;border:1px solid ${C.ln};color:${C.mu};margin-top:10px;}
.board{padding:16px 16px 26px;}
.board-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
.chip-g{font-size:11px;font-weight:700;border:1px solid;border-radius:20px;padding:5px 11px;}
.board-status{font-size:11px;color:${C.mu};}
.reels{display:flex;flex-direction:column;gap:11px;}
.reel-row{display:flex;flex-direction:column;gap:5px;}
.reel-lbl{font-size:9px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;}
.reel-win{height:74px;overflow:hidden;border:1px solid ${C.ln};border-radius:12px;background:${C.sf};}
.reel-strip{display:flex;flex-direction:column;}
.reel-strip.spin{animation:reelspin 1.9s cubic-bezier(.15,.7,.2,1) forwards;}
@keyframes reelspin{from{transform:translateY(0);}to{transform:translateY(var(--end));}}
.reel-cell{height:74px;display:flex;align-items:center;gap:12px;padding:0 14px;border-left:3px solid ${C.ln};box-sizing:border-box;}
.cell-ic{flex:0 0 auto;width:44px;}
.cell-nm{font-size:13.5px;font-weight:700;color:${C.tx};}
.board-actions{margin-top:18px;}
`;
