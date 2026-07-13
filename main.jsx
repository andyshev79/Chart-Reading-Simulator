import { useState } from "react";
import DATA from "./patterns.json";

const C = { bg:"#0A0A0B", sf:"#161719", ln:"#2A2D31", ac:"#FF5A2C", bl:"#4C7DF0",
  vt:"#B57BFF", gn:"#22C55E", rd:"#E24B4A", tx:"#F4F5F7", mu:"#8B9096" };

const T = {
  en: { title:"Chart Reading Simulator", tagline:"Read the signals. Assess the odds. Learn calibration.",
    based:"Chart signals · probability training", chooseGroup:"Choose instrument group",
    sessLen:"Session length", test:"Test", quick:"Quick", medium:"Medium", all:"All",
    start:"Show the chart signals", ex:"e.g.", reliability:"Reliability", moves:"Moves" },
  ru: { title:"Тренажёр чтения графика", tagline:"Читайте сигналы. Оценивайте вероятность. Учитесь калибровке.",
    based:"Сигналы графика · тренировка вероятности", chooseGroup:"Выберите группу инструментов",
    sessLen:"Длина сессии", test:"Тест", quick:"Быстрый", medium:"Средний", all:"Все",
    start:"Показать сигналы графика", ex:"напр.", reliability:"Надёжность", moves:"Движения" },
  ua: { title:"Тренажер читання графіка", tagline:"Читайте сигнали. Оцінюйте ймовірність. Вчіться калібрування.",
    based:"Сигнали графіка · тренування ймовірності", chooseGroup:"Оберіть групу інструментів",
    sessLen:"Довжина сесії", test:"Тест", quick:"Швидкий", medium:"Середній", all:"Усі",
    start:"Показати сигнали графіка", ex:"напр.", reliability:"Надійність", moves:"Рухи" },
  uz: { title:"Grafik o'qish simulyatori", tagline:"Signallarni o'qing. Ehtimolni baholang. Kalibrlashni o'rganing.",
    based:"Grafik signallari · ehtimol mashqi", chooseGroup:"Asbob guruhini tanlang",
    sessLen:"Sessiya uzunligi", test:"Test", quick:"Tez", medium:"O'rta", all:"Hammasi",
    start:"Grafik signallarini ko'rsatish", ex:"masalan", reliability:"Ishonchlilik", moves:"Harakatlar" },
};
const L = (o, lang) => (o && typeof o === "object" ? (o[lang] || o.ru || o.en) : o);
const SESS = [
  { k:"test", len:1 }, { k:"quick", len:5 }, { k:"medium", len:10 }, { k:"all", len:30 },
];
const RELI = { low:"★★★", trend:"★★", high:"★" };
const MOVES = { low:"$", trend:"$$", high:"$$$" };

export default function ChartReadingSimulator() {
  const [lang, setLang] = useState("ru");
  const [phase, setPhase] = useState("idle");
  const [group, setGroup] = useState("trend");
  const [sessionLen, setSessionLen] = useState(5);
  const t = T[lang];
  const G = DATA.groups;

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
                <div className="gtop">
                  <span className="gname">{L(g.name, lang)}</span>
                  <span className="grad" style={group===id?{borderColor:g.hue,background:`radial-gradient(circle,${g.hue} 0 38%,transparent 42%)`}:{}} />
                </div>
                <div className="gex">{t.ex}: {L(g.ex, lang)}</div>
                <div className="gmeta">
                  <span style={{color:g.hue}}>{t.reliability}: {RELI[id]}</span>
                  <span className="gmu">{t.moves}: {MOVES[id]}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="eyebrow">{t.sessLen}</div>
          <div className="sess">
            {SESS.map((s) => (
              <button key={s.k} className={"schip" + (sessionLen===s.len?" on":"")} onClick={()=>setSessionLen(s.len)}>
                <span className="sname">{t[s.k]}</span>
                <span className="slen">{s.len}</span>
              </button>
            ))}
          </div>

          <button className="cta" onClick={()=>setPhase("spinning")}>{t.start}</button>
        </section>
      )}

      {phase !== "idle" && (
        <section className="idle">
          <div className="eyebrow">Скоро: барабаны сигналов</div>
          <p style={{color:C.mu,fontSize:13,textAlign:"center"}}>
            Группа: <b style={{color:G[group].hue}}>{L(G[group].name, lang)}</b> · сессия {sessionLen}
          </p>
          <button className="cta ghost" onClick={()=>setPhase("idle")}>← Назад</button>
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
.cta.ghost{background:none;border:1px solid ${C.ln};color:${C.mu};margin-top:12px;}
`;
