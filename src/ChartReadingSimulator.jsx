import { useState, useMemo, useRef, useLayoutEffect } from "react";
import DATA from "./patterns.json";

const C = { bg:"#0A0A0B", sf:"#161719", ln:"#2A2D31", ac:"#FF5A2C", bl:"#4C7DF0",
  vt:"#B57BFF", gn:"#22C55E", rd:"#E24B4A", tx:"#F4F5F7", mu:"#8B9096" };

const T = {
  en: { title:"Chart Reading Simulator", tagline:"Read the signals. Assess the probability of a signal firing and the risk.",
    based:"Chart signals · probability training", chooseGroup:"Choose instrument group",
    sessLen:"Session length", test:"Test", quick:"Quick", medium:"Medium", all:"All",
    start:"Show the chart signals", ex:"e.g.", reliability:"Signal reliability", moves:"Instrument move", moveWords:{low:"limited",trend:"moderate",high:"strong"},
    reading:"Reading the chart…", signalsOut:"Signals on the chart", again:"Deal again",
    rowF:"Chart patterns", rowI:"Indicators & volume", rowC:"Candlestick patterns",
    yourDecision:"Your decision", up:"Up", down:"Down", skip:"Skip", strength:"Signal strength",
    buy:"Buy", sell:"Sell", strongBuy:"Confident buy", strongSell:"Confident sell", noTrade:"Stay out",
    neut:{F:"Figure",I:"Indicator",C:"Candles"},
    stake:"Stake", openTrade:"Open trade", skipTrade:"Skip this trade", weak:"coin toss", strong:"almost sure",
    yourChoice:"Your call", market:"Market", combined:"Combined probability", trueProb:"true prob",
    howWorks:"What came out and how it works", calib:"Your estimate", vsReal:"real",
    verd:{ right:{t:"Correct decision",e:"Profit on a high-probability setup ({p}%). Direction and conviction matched the market — betting with the odds is how capital grows over the long run. Keep weighing probabilities rather than chasing the move."},
      lucky:{t:"Lucky, but a weak decision",e:"You profited, though your direction's real probability was only {p}%. This gain was luck, not skill: over time, bets against the odds drain the account. Don't repeat it — what matters is how justified the risk was, not how much you made."},
      unlucky:{t:"Right call, but markets are unpredictable",e:"You lost, but the setup was in your favor ({p}%). A correct decision can still have a bad outcome due to a sudden shift in conditions or new information hitting the market. For illiquid instruments it can be the result of manipulation. To limit this kind of outcome, always set a Stop-Loss."},
      mistake:{t:"Mistake",e:"Loss on a low-probability bet ({p}%). Both the decision and outcome were poor — you went against the signals' edge. Review which signal you overrated, and next time cut size or skip when the odds are weak."},
      fair:{t:"Borderline",e:"The setup was near 50/50 ({p}%) — essentially a coin toss. With no edge, a deliberate skip or a minimal position usually beats a full-size trade."},
      skipGood:{t:"Good skip",e:"Signals conflicted, edge only {p}%. You rightly stayed out of the uncertainty — knowing when not to trade protects capital as much as good trades do."},
      skipMiss:{t:"Missed opportunity",e:"There was a real edge ({p}%) — signals pointed one way with decent conviction. Skipping avoided risk but cost a good chance. Learn to tell a strong aligned setup from a conflicted one."},
      skipOk:{t:"Fair skip",e:"A modest edge ({p}%). Skipping is defensible, though a careful small position was also viable. No error in the decision."} },
    round:"Round", continue:"Continue", showResult:"Show result", newSession:"New session", end:"End",
    sessionDone:"{n} rounds played", decisionQuality:"Decision quality", calibration:"Calibration", skips:"Skips", dynamics:"P&L dynamics",
    ranks:{ k1:"Novice", k2:"Chart reader", k3:"Analyst", k4:"Calibration master" } },
  ru: { title:"Тренажёр чтения графика", tagline:"Читайте сигналы. Оценивайте вероятность срабатывания сигнала и риск.",
    based:"Сигналы графика · тренировка вероятности", chooseGroup:"Выберите группу инструментов",
    sessLen:"Длина сессии", test:"Тест", quick:"Быстрый", medium:"Средний", all:"Все",
    start:"Показать сигналы графика", ex:"напр.", reliability:"Надёжность сигнала", moves:"Движение инструмента", moveWords:{low:"ограниченные",trend:"умеренные",high:"сильные"},
    reading:"Читаем график…", signalsOut:"Сигналы на графике", again:"Ещё раз",
    rowF:"Графические фигуры", rowI:"Индикаторы и объёмы", rowC:"Свечные комбинации",
    yourDecision:"Ваше решение", up:"Вверх", down:"Вниз", skip:"Пропустить", strength:"Сила сигнала",
    buy:"Покупка", sell:"Продажа", strongBuy:"Уверенная покупка", strongSell:"Уверенная продажа", noTrade:"Не торговать",
    neut:{F:"Фигура",I:"Индикатор",C:"Свеча"},
    stake:"Ставка", openTrade:"Открыть сделку", skipTrade:"Пропустить сделку", weak:"случайность", strong:"почти точно",
    yourChoice:"Ваш выбор", market:"Рынок", combined:"Общая вероятность", trueProb:"реальная",
    howWorks:"Что выпало и как это работает", calib:"Ваша оценка", vsReal:"реально",
    verd:{ right:{t:"Верное решение",e:"Прибыль на сигнале с высокой вероятностью ({p}%). Направление и сила совпали с рынком — именно так, на стороне вероятностей, и растёт капитал в долгую. Продолжайте оценивать шансы, а не гнаться за движением."},
      lucky:{t:"Повезло, но решение слабое",e:"Вы заработали, хотя реальная вероятность вашего направления была лишь {p}%. Прибыль здесь — везение, а не расчёт: на дистанции ставки против шансов съедают депозит. Такой исход не стоит повторять — важно не «сколько заработал», а «насколько оправдан был риск»."},
      unlucky:{t:"Верное решение, но рынок бывает непредсказуем",e:"Вы потеряли, но расклад был в вашу пользу ({p}%). Правильное решение с плохим исходом бывает по причине резкой смены обстоятельств и появления на рынке новой информации. Для малоликвидных инструментов это может быть следствием манипуляций. Чтобы ограничить такой исход, необходимо устанавливать Стоп-Лосс."},
      mistake:{t:"Ошибка",e:"Убыток на ставке с низкой вероятностью ({p}%). И решение, и исход были плохими: вы пошли против перевеса сигналов. Разберите расклад — какой сигнал вы переоценили, — и в следующий раз при слабых шансах уменьшайте ставку или пропускайте."},
      fair:{t:"Пограничный случай",e:"Расклад был близок к 50/50 ({p}%) — по сути монетка. При таких шансах преимущества нет: осознанный пропуск или минимальная ставка обычно выгоднее полноразмерной позиции."},
      skipGood:{t:"Правильный пропуск",e:"Сигналы конфликтовали, перевес лишь {p}%. Вы верно не полезли в неопределённость — умение не торговать при мутном раскладе экономит капитал не хуже удачных сделок."},
      skipMiss:{t:"Упущенная возможность",e:"Был реальный перевес ({p}%) — сигналы указывали в одну сторону достаточно уверенно. Пропуск уберёг от риска, но стоил хорошей возможности. Учитесь отличать сильный согласованный расклад от конфликтного."},
      skipOk:{t:"Допустимый пропуск",e:"Умеренный перевес ({p}%). Пропуск оправдан, хотя аккуратная небольшая позиция здесь тоже была возможна. Решение без ошибки."} },
    round:"Раунд", continue:"Продолжить", showResult:"Показать итог", newSession:"Новая сессия", end:"Завершить",
    sessionDone:"Сыграно раундов: {n}", decisionQuality:"Качество решений", calibration:"Калибровка", skips:"Пропусков", dynamics:"Динамика P&L",
    ranks:{ k1:"Новичок", k2:"Читатель графика", k3:"Аналитик", k4:"Мастер калибровки" } },
  ua: { title:"Тренажер читання графіка", tagline:"Читайте сигнали. Оцінюйте ймовірність спрацювання сигналу та ризик.",
    based:"Сигнали графіка · тренування ймовірності", chooseGroup:"Оберіть групу інструментів",
    sessLen:"Довжина сесії", test:"Тест", quick:"Швидкий", medium:"Середній", all:"Усі",
    start:"Показати сигнали графіка", ex:"напр.", reliability:"Надійність сигналу", moves:"Рух інструменту", moveWords:{low:"обмежені",trend:"помірні",high:"сильні"},
    reading:"Читаємо графік…", signalsOut:"Сигнали на графіку", again:"Ще раз",
    rowF:"Графічні фігури", rowI:"Індикатори та об'єми", rowC:"Свічкові комбінації",
    yourDecision:"Ваше рішення", up:"Вгору", down:"Вниз", skip:"Пропустити", strength:"Сила сигналу",
    buy:"Купівля", sell:"Продаж", strongBuy:"Впевнена купівля", strongSell:"Впевнений продаж", noTrade:"Не торгувати",
    neut:{F:"Фігура",I:"Індикатор",C:"Свічка"},
    stake:"Ставка", openTrade:"Відкрити угоду", skipTrade:"Пропустити угоду", weak:"випадковість", strong:"майже точно",
    yourChoice:"Ваш вибір", market:"Ринок", combined:"Загальна ймовірність", trueProb:"реальна",
    howWorks:"Що випало і як це працює", calib:"Ваша оцінка", vsReal:"реально",
    verd:{ right:{t:"Вірне рішення",e:"Прибуток на сигналі з високою ймовірністю ({p}%). Напрям і сила збіглися з ринком — саме так, на боці ймовірностей, і росте капітал у довгій перспективі. Продовжуйте оцінювати шанси, а не гнатися за рухом."},
      lucky:{t:"Пощастило, але рішення слабке",e:"Ви заробили, хоча реальна ймовірність вашого напряму була лише {p}%. Прибуток тут — везіння, а не розрахунок: на дистанції ставки проти шансів з'їдають депозит. Такий результат не варто повторювати — важливо не «скільки заробив», а «наскільки виправданий був ризик»."},
      unlucky:{t:"Вірне рішення, але ринок буває непередбачуваним",e:"Ви втратили, але розклад був на вашу користь ({p}%). Правильне рішення з поганим результатом буває через різку зміну обставин і появу на ринку нової інформації. Для малоліквідних інструментів це може бути наслідком маніпуляцій. Щоб обмежити такий результат, необхідно встановлювати Стоп-Лосс."},
      mistake:{t:"Помилка",e:"Збиток на ставці з низькою ймовірністю ({p}%). І рішення, і результат були поганими: ви пішли проти переваги сигналів. Розберіть розклад — який сигнал ви переоцінили, — і наступного разу за слабких шансів зменшуйте ставку або пропускайте."},
      fair:{t:"Межовий випадок",e:"Розклад був близький до 50/50 ({p}%) — по суті монетка. За таких шансів переваги немає: свідомий пропуск або мінімальна ставка зазвичай вигідніші за повнорозмірну позицію."},
      skipGood:{t:"Правильний пропуск",e:"Сигнали конфліктували, перевага лише {p}%. Ви вірно не полізли в невизначеність — уміння не торгувати за каламутного розкладу економить капітал не гірше за вдалі угоди."},
      skipMiss:{t:"Втрачена можливість",e:"Була реальна перевага ({p}%) — сигнали вказували в один бік досить упевнено. Пропуск уберіг від ризику, але коштував гарної можливості. Вчіться відрізняти сильний узгоджений розклад від конфліктного."},
      skipOk:{t:"Припустимий пропуск",e:"Помірна перевага ({p}%). Пропуск виправданий, хоча акуратна невелика позиція тут теж була можлива. Рішення без помилки."} },
    round:"Раунд", continue:"Продовжити", showResult:"Показати підсумок", newSession:"Нова сесія", end:"Завершити",
    sessionDone:"Зіграно раундів: {n}", decisionQuality:"Якість рішень", calibration:"Калібрування", skips:"Пропусків", dynamics:"Динаміка P&L",
    ranks:{ k1:"Новачок", k2:"Читач графіка", k3:"Аналітик", k4:"Майстер калібрування" } },
  uz: { title:"Grafik o'qish simulyatori", tagline:"Signallarni o'qing. Signal ishlashi ehtimoli va xavfni baholang.",
    based:"Grafik signallari · ehtimol mashqi", chooseGroup:"Asbob guruhini tanlang",
    sessLen:"Sessiya uzunligi", test:"Test", quick:"Tez", medium:"O'rta", all:"Hammasi",
    start:"Grafik signallarini ko'rsatish", ex:"masalan", reliability:"Signal ishonchliligi", moves:"Asbob harakati", moveWords:{low:"cheklangan",trend:"o'rtacha",high:"kuchli"},
    reading:"Grafik o'qilyapti…", signalsOut:"Grafikdagi signallar", again:"Yana",
    rowF:"Grafik shakllar", rowI:"Indikatorlar va hajm", rowC:"Sham kombinatsiyalari",
    yourDecision:"Sizning qaroringiz", up:"Yuqoriga", down:"Pastga", skip:"O'tkazish", strength:"Signal kuchi",
    buy:"Sotib olish", sell:"Sotish", strongBuy:"Ishonchli sotib olish", strongSell:"Ishonchli sotish", noTrade:"Savdo qilmaslik",
    neut:{F:"Shakl",I:"Indikator",C:"Sham"},
    stake:"Tikish", openTrade:"Savdo ochish", skipTrade:"Savdoni o'tkazish", weak:"tasodif", strong:"deyarli aniq",
    yourChoice:"Sizning tanlovingiz", market:"Bozor", combined:"Umumiy ehtimol", trueProb:"haqiqiy",
    howWorks:"Nima chiqdi va qanday ishlaydi", calib:"Sizning bahoyingiz", vsReal:"haqiqatda",
    verd:{ right:{t:"To'g'ri qaror",e:"Yuqori ehtimolli signalda foyda ({p}%). Yo'nalish va ishonch bozorga mos keldi — ehtimollar tomonida turish uzoq muddatda kapitalni oshiradi. Harakat ortidan quvish o'rniga ehtimollarni baholashda davom eting."},
      lucky:{t:"Omad, lekin qaror zaif",e:"Foyda oldingiz, garchi yo'nalishingizning haqiqiy ehtimoli faqat {p}% edi. Bu foyda — omad, hisob emas: uzoq muddatda ehtimolga qarshi tikishlar hisobni yeydi. Buni takrorlamang — qancha ishlaganingiz emas, xavf qanchalik oqlangani muhim."},
      unlucky:{t:"To'g'ri qaror, lekin bozor oldindan aytib bo'lmaydi",e:"Yo'qotdingiz, lekin vaziyat foydangizga edi ({p}%). To'g'ri qaror yomon natija berishi mumkin — sharoitning keskin o'zgarishi yoki bozorga yangi ma'lumot chiqishi tufayli. Kam likvidli asboblar uchun bu manipulyatsiya natijasi bo'lishi mumkin. Bunday natijani cheklash uchun doimo Stop-Loss o'rnating."},
      mistake:{t:"Xato",e:"Past ehtimolli tikishda zarar ({p}%). Ham qaror, ham natija yomon edi: siz signallar ustunligiga qarshi bordingiz. Qaysi signalni ortiqcha baholaganingizni ko'rib chiqing va keyingi safar zaif ehtimolda hajmni kamaytiring yoki o'tkazing."},
      fair:{t:"Chegaraviy holat",e:"Vaziyat 50/50 ga yaqin edi ({p}%) — aslida tanga. Ustunlik yo'q bo'lganda ongli o'tkazish yoki minimal pozitsiya to'liq hajmli savdodan afzalroq."},
      skipGood:{t:"To'g'ri o'tkazish",e:"Signallar qarama-qarshi, ustunlik faqat {p}%. Noaniqlikka kirmadingiz — savdo qilmaslikni bilish kapitalni yaxshi savdolar kabi himoya qiladi."},
      skipMiss:{t:"Boy berilgan imkoniyat",e:"Haqiqiy ustunlik bor edi ({p}%) — signallar bir tomonni ancha ishonchli ko'rsatdi. O'tkazish xavfdan saqladi, lekin yaxshi imkoniyatga tushdi. Kuchli mos vaziyatni qarama-qarshisidan farqlashni o'rganing."},
      skipOk:{t:"Maqbul o'tkazish",e:"O'rtacha ustunlik ({p}%). O'tkazish oqilona, garchi ehtiyotkor kichik pozitsiya ham mumkin edi. Qarorda xato yo'q."} },
    round:"Raund", continue:"Davom etish", showResult:"Natijani ko'rsatish", newSession:"Yangi sessiya", end:"Yakunlash",
    sessionDone:"O'ynalgan raundlar: {n}", decisionQuality:"Qaror sifati", calibration:"Kalibrlash", skips:"O'tkazishlar", dynamics:"P&L dinamikasi",
    ranks:{ k1:"Yangi", k2:"Grafik o'quvchi", k3:"Tahlilchi", k4:"Kalibrlash ustasi" } },
};
const L = (o, lang) => (o && typeof o === "object" ? (o[lang] || o.ru || o.en) : o);
const SESS = [ { k:"test", len:1 }, { k:"quick", len:5 }, { k:"medium", len:10 }, { k:"all", len:30 } ];
const RELI = { low:"★★★", trend:"★★", high:"★" };
const MOVES = { low:"$", trend:"$$", high:"$$$" };
const ROWS = ["F","I","C"];
const CARDW = 158, TARGET_AT = 13;   // ширина карточки и позиция выпавшей в ленте
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

// Крупный график паттерна с контекстом (вход/формация/уровень). Направление НЕ дорисовывается — его определяет игрок.
function PatternChart({ icon, color }) {
  const mu = "#6B7076", base = "#2A2D31";
  const ln = (p, c=color, w=2.6, dash) => <polyline points={p} fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={dash}/>;
  const FIG = {
    // фигуры: предшествующий тренд + формация + ключевой уровень, конец в точке решения
    headshoulders:<g>{ln("6,66 40,58 62,44 78,52 108,26 132,10 156,26 186,52 208,44 226,52")}<line x1="78" y1="52" x2="250" y2="52" stroke={mu} strokeWidth="1.3" strokeDasharray="5 3"/><circle cx="226" cy="52" r="3.5" fill={color}/></g>,
    doubletop:<g>{ln("6,64 40,54 70,26 100,44 140,26 168,46")}<line x1="60" y1="24" x2="150" y2="24" stroke={mu} strokeWidth="1.3" strokeDasharray="5 3"/><circle cx="168" cy="46" r="3.5" fill={color}/></g>,
    doublebottom:<g>{ln("6,16 40,26 70,54 100,36 140,54 168,34")}<line x1="60" y1="56" x2="150" y2="56" stroke={mu} strokeWidth="1.3" strokeDasharray="5 3"/><circle cx="168" cy="34" r="3.5" fill={color}/></g>,
    triangleup:<g>{ln("10,58 40,30 70,52 100,26 130,48 160,24 190,44 220,22")}<line x1="10" y1="20" x2="240" y2="20" stroke={mu} strokeWidth="1.3" strokeDasharray="5 3"/><line x1="10" y1="60" x2="240" y2="22" stroke={mu} strokeWidth="1.3"/><circle cx="220" cy="22" r="3.5" fill={color}/></g>,
    triangledown:<g>{ln("10,22 40,50 70,28 100,54 130,32 160,56 190,36 220,58")}<line x1="10" y1="60" x2="240" y2="60" stroke={mu} strokeWidth="1.3" strokeDasharray="5 3"/><line x1="10" y1="20" x2="240" y2="58" stroke={mu} strokeWidth="1.3"/><circle cx="220" cy="58" r="3.5" fill={color}/></g>,
    flagup:<g>{ln("10,66 30,58 50,30 70,10")}{ln("70,10 92,22 114,16 136,30 158,24")}<circle cx="158" cy="24" r="3.5" fill={color}/></g>,
    flagdown:<g>{ln("10,14 30,22 50,50 70,70")}{ln("70,70 92,58 114,64 136,50 158,56")}<circle cx="158" cy="56" r="3.5" fill={color}/></g>,
    pennant:<g>{ln("10,66 32,54 54,26 76,10")}<line x1="76" y1="10" x2="150" y2="30" stroke={mu} strokeWidth="1.3"/><line x1="76" y1="46" x2="150" y2="30" stroke={mu} strokeWidth="1.3"/>{ln("76,10 96,34 116,22 136,32 150,30",color,2.4)}<circle cx="150" cy="30" r="3.5" fill={color}/></g>,
    wedge:<g>{ln("10,64 44,52 78,44 112,32 146,28 180,18 214,16")}<line x1="10" y1="60" x2="214" y2="14" stroke={mu} strokeWidth="1.3"/><line x1="44" y1="52" x2="214" y2="16" stroke={mu} strokeWidth="1.3" strokeDasharray="5 3"/><circle cx="214" cy="16" r="3.5" fill={color}/></g>,
    cup:<g><path d={"M10,16 C10,64 90,64 120,60 C150,56 150,20 150,16"} fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round"/>{ln("150,16 168,30 186,26 204,30",color,2.4)}<circle cx="204" cy="30" r="3.5" fill={color}/></g>,
  };
  const IND = {
    // индикаторы на цене (две средние с подписями)
    macross:<g>{ln("6,52 254,26",color,2.6)}{ln("6,30 254,50",mu,2.6)}<circle cx="150" cy="38" r="4" fill={color}/><text x="8" y="16" fontSize="9" fill={color}>MA5</text><text x="212" y="62" fontSize="9" fill={mu}>MA50</text></g>,
    macrossup:<g>{ln("6,54 254,22",color,2.6)}{ln("6,32 254,48",mu,2.6)}<circle cx="140" cy="37" r="4" fill={color}/><text x="8" y="16" fontSize="9" fill={color}>MA5</text><text x="212" y="60" fontSize="9" fill={mu}>MA50</text></g>,
    goldcross:<g>{ln("6,56 254,20",color,3)}{ln("6,26 254,52",mu,3)}<circle cx="150" cy="38" r="4.5" fill={color}/><text x="8" y="16" fontSize="9" fill={color}>MA50</text><text x="204" y="64" fontSize="9" fill={mu}>MA200</text></g>,
    breakvol:<g><line x1="30" y1="20" x2="248" y2="20" stroke={mu} strokeWidth="1.4" strokeDasharray="5 3"/>{ln("6,58 50,52 96,42 142,32 188,24 214,20")}<circle cx="214" cy="20" r="4" fill={color}/><g fill={color}><rect x="150" y="54" width="8" height="12"/><rect x="166" y="48" width="8" height="18"/><rect x="182" y="40" width="8" height="26"/><rect x="198" y="32" width="8" height="34"/></g><text x="34" y="16" fontSize="9" fill={mu}>уровень</text><text x="150" y="50" fontSize="8" fill={mu}>объём↑</text></g>,
    breaknovol:<g><line x1="30" y1="20" x2="248" y2="20" stroke={mu} strokeWidth="1.4" strokeDasharray="5 3"/>{ln("6,58 50,52 96,42 142,32 188,24 214,20",color,2.6,"6 4")}<g fill={mu}><rect x="166" y="60" width="8" height="6"/><rect x="182" y="58" width="8" height="8"/><rect x="198" y="59" width="8" height="7"/></g><text x="34" y="16" fontSize="9" fill={mu}>уровень</text><text x="150" y="52" fontSize="8" fill={mu}>объём слабый</text></g>,
    bollinger:<g>{ln("6,12 130,20 254,14",mu,1.8)}{ln("6,64 130,56 254,62",mu,1.8)}{ln("6,38 40,26 78,50 120,32 160,46 200,36 240,40 254,38",color,2.4)}<text x="8" y="10" fontSize="8" fill={mu}>верхняя</text><text x="8" y="74" fontSize="8" fill={mu}>нижняя</text></g>,
    bounce:<g><line x1="6" y1="58" x2="254" y2="58" stroke={mu} strokeWidth="1.6" strokeDasharray="5 3"/>{ln("6,12 54,26 110,46 156,57 196,50")}<circle cx="156" cy="57" r="4" fill={color}/><text x="8" y="72" fontSize="9" fill={mu}>уровень поддержки</text></g>,
    // индикаторы с нижней панелью (цена сверху / индикатор снизу)
    rsidiv:<g><line x1="0" y1="38" x2="260" y2="38" stroke={mu} strokeWidth="1" strokeDasharray="2 3"/>{ln("6,28 70,20 140,13 210,9 250,7",mu,2.4)}{ln("6,52 70,56 140,60 210,64 250,66",color,2.4)}<text x="230" y="20" fontSize="9" fill={mu}>цена</text><text x="230" y="62" fontSize="9" fill={color}>RSI</text></g>,
    rsiover:<g><rect x="0" y="6" width="260" height="16" fill={mu} opacity="0.16"/><rect x="0" y="54" width="260" height="16" fill={mu} opacity="0.16"/>{ln("6,60 70,52 140,40 200,24 240,15",color,2.6)}<circle cx="240" cy="15" r="4" fill={color}/><text x="6" y="18" fontSize="9" fill={mu}>перекуплен</text><text x="6" y="66" fontSize="9" fill={mu}>перепродан</text></g>,
    macd:<g><line x1="6" y1="40" x2="254" y2="40" stroke={mu} strokeWidth="1" strokeDasharray="3 3"/>{ln("6,58 130,40 254,18",color,2.8)}{ln("6,44 130,42 254,34",mu,2.4)}<g fill={color} opacity="0.55"><rect x="150" y="30" width="9" height="10"/><rect x="168" y="24" width="9" height="16"/><rect x="186" y="18" width="9" height="22"/></g><circle cx="128" cy="41" r="4" fill={color}/><text x="8" y="16" fontSize="9" fill={color}>MACD</text><text x="196" y="52" fontSize="9" fill={mu}>сигнал</text></g>,
  };
  // свеча: x-центр, тени (wt..wb), тело (bt..bb); filled=залита цветом, иначе контур
  const cd = (x,wt,wb,bt,bb,col,filled=true,W=15) => (
    <g key={x+"-"+bt}>
      <line x1={x} y1={wt} x2={x} y2={wb} stroke={col} strokeWidth="1.6"/>
      <rect x={x-W/2} y={Math.min(bt,bb)} width={W} height={Math.max(3,Math.abs(bb-bt))} fill={filled?col:C.bg} stroke={col} strokeWidth="1.6"/>
    </g>
  );
  const gr = "#7C8794"; // нейтральные «контекстные» свечи до формации
  const UP = "#22C55E", DN = "#E24B4A"; // зелёная — вверх, красная — вниз
  const CDL = {
    // контекст (серые свечи до) → формация (зелёная=рост / красная=падение), направление читает игрок
    bullengulf:<g>{cd(40,26,54,32,48,DN,true)}{cd(72,24,52,30,46,DN,true)}{cd(120,14,58,52,20,UP,true,20)}<text x="26" y="68" fontSize="8" fill="#5F6166">до</text><text x="104" y="68" fontSize="8" fill="#5F6166">поглощающая</text></g>,
    bearengulf:<g>{cd(40,26,54,48,34,UP,true)}{cd(72,22,50,44,30,UP,true)}{cd(120,14,58,20,52,DN,true,20)}<text x="26" y="68" fontSize="8" fill="#5F6166">до</text><text x="104" y="68" fontSize="8" fill="#5F6166">поглощающая</text></g>,
    hammer:<g>{cd(50,20,40,36,24,DN,true)}{cd(90,26,44,40,30,DN,true)}{cd(140,20,62,34,24,UP,true,18)}<text x="118" y="68" fontSize="8" fill="#5F6166">длинная тень</text></g>,
    shooting:<g>{cd(50,32,52,48,36,UP,true)}{cd(90,28,48,44,32,UP,true)}{cd(140,10,52,52,42,DN,true,18)}<text x="118" y="68" fontSize="8" fill="#5F6166">длинная тень</text></g>,
    morningstar:<g>{cd(46,18,52,22,48,DN,true)}{cd(96,44,60,54,50,gr,true,12)}{cd(150,16,54,44,20,UP,true,18)}<text x="30" y="68" fontSize="8" fill="#5F6166">1 · 2 · 3</text></g>,
    eveningstar:<g>{cd(46,20,54,50,24,UP,true)}{cd(96,14,30,24,20,gr,true,12)}{cd(150,22,60,26,52,DN,true,18)}<text x="30" y="68" fontSize="8" fill="#5F6166">1 · 2 · 3</text></g>,
    doji:<g>{cd(60,24,50,44,30,gr,true)}{cd(130,12,60,35,37,gr,true,20)}<text x="150" y="40" fontSize="8" fill="#5F6166">открытие≈закрытие</text></g>,
    soldiers:<g>{cd(50,44,64,58,48,UP,true,14)}{cd(96,30,56,50,34,UP,true,14)}{cd(142,16,48,42,20,UP,true,14)}<text x="40" y="70" fontSize="8" fill="#5F6166">три подряд</text></g>,
    crows:<g>{cd(50,16,36,20,30,DN,true,14)}{cd(96,26,52,30,44,DN,true,14)}{cd(142,38,64,42,56,DN,true,14)}<text x="40" y="70" fontSize="8" fill="#5F6166">три подряд</text></g>,
    harami:<g>{cd(60,14,60,54,20,UP,true,22)}{cd(120,34,48,44,38,DN,true,12)}<text x="94" y="68" fontSize="8" fill="#5F6166">малая внутри</text></g>,
  };
  const subPanel = icon==="rsidiv" || icon==="rsiob" || icon==="macd";
  return (
    <svg viewBox="0 0 260 76" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{display:"block"}}>
      {!subPanel && <line x1="0" y1="70" x2="260" y2="70" stroke={base} strokeWidth="1"/>}
      {FIG[icon] || IND[icon] || CDL[icon] || null}
    </svg>
  );
}

export default function ChartReadingSimulator() {
  const [lang, setLang] = useState("ru");
  const [phase, setPhase] = useState("idle"); // idle | spinning | decide
  const [group, setGroup] = useState("trend");
  const [sessionLen, setSessionLen] = useState(5);
  const [active, setActive] = useState(null);
  const [strips, setStrips] = useState(null);
  const [winW, setWinW] = useState(0);
  const winRef = useRef(null);
  const [nonce, setNonce] = useState(0);
  const [pos, setPos] = useState(0);         // -100..+100, центр 0 = пропуск
  const [result, setResult] = useState(null);
  const [roundNum, setRoundNum] = useState(1);
  const [sessionData, setSessionData] = useState([]);
  const t = T[lang];
  const G = DATA.groups;
  const dir = pos === 0 ? "skip" : pos > 0 ? "up" : "down"; // up=покупка, down=продажа
  const strength = Math.abs(pos);                            // уверенность/вероятность, %

  const byRow = useMemo(() => {
    const m = { F:[], I:[], C:[] };
    DATA.signals.forEach((s) => m[s.row].push(s));
    return m;
  }, []);

  useLayoutEffect(() => {
    if ((phase === "spinning" || phase === "decide") && winRef.current) {
      setWinW(winRef.current.offsetWidth);
    }
  }, [phase, nonce]);

  function deal() {
    const picked = { F:rnd(byRow.F), I:rnd(byRow.I), C:rnd(byRow.C) };
    const mk = (r) => [
      ...Array.from({length:TARGET_AT}, () => rnd(byRow[r])),
      picked[r], rnd(byRow[r]), rnd(byRow[r]),
    ];
    setStrips({ F:mk("F"), I:mk("I"), C:mk("C") });
    setActive(picked);
    setPos(0); setResult(null);
    setPhase("spinning");
    setNonce((n) => n + 1);
    setTimeout(() => setPhase("decide"), 2400);
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
  function endSession() {
    setPhase(sessionData.length > 0 ? "final" : "idle");
  }

  function confirm() {
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
                <div className="gmeta"><span style={{color:g.hue}}>{t.reliability}: {RELI[id]}</span><span className="gmu">{t.moves}: {t.moveWords[id]}</span></div>
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

          {(phase === "spinning" || phase === "decide") && strips && (
            <div className="ribbons" key={nonce}>
              {ROWS.map((r, i) => {
                const hue = DATA.rows[r].hue;
                const spinning = phase === "spinning";
                const end = winW ? -(TARGET_AT*CARDW) + (winW - CARDW)/2 : -(TARGET_AT*CARDW);
                const sig = active[r];
                const left = strips[r][TARGET_AT-1], right = strips[r][TARGET_AT+1];
                return (
                  <div className="rb-row" key={r}>
                    <div className="rb-lbl" style={{color:hue}}>{L(DATA.rows[r].name, lang)}</div>

                    {spinning ? (
                      <div className="rb-win" ref={i===0 ? winRef : null}>
                        <div className="rb-strip spin"
                          style={{ animationDelay:`${i*0.15}s`, ["--end"]:`${end}px`, transform:`translateX(${end}px)` }}>
                          {strips[r].map((s, k) => (
                            <div className="rb-cell" style={{ width:`${CARDW}px`, borderLeftColor:hue }} key={k}>
                              <PatternIcon icon={s.icon} color={hue} size={34} />
                              <span className="rb-nm">{L(s.t, lang)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="reelbig">
                        <div className="rb-side" style={{borderColor:hue+"4D"}}>
                          <PatternIcon icon={left.icon} color={hue} size={30} />
                        </div>
                        <div className="rb-center" style={{borderColor:hue}}>
                          <div className="rc-name"><span style={{color:hue}}>{t.neut[r]}:</span> {L(sig.nt, lang)}</div>
                          <div className="rc-chart">
                            <PatternChart icon={sig.icon} color={hue} />
                          </div>
                        </div>
                        <div className="rb-side" style={{borderColor:hue+"4D"}}>
                          <PatternIcon icon={right.icon} color={hue} size={30} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {phase === "decide" && (
            <>

              <div className="dec">
                <div className="eyebrow">{t.yourDecision}</div>
                <div className="tsl-top">
                  <span className="tsl-side sell">{t.strongSell}</span>
                  <span className="tsl-side buy">{t.strongBuy}</span>
                </div>
                <input className="tslider" type="range" min="-100" max="100" step="20" value={pos}
                  onChange={(e)=>setPos(+e.target.value)} />
                <div className="tsl-scale">
                  <span>{t.sell}</span><span>{t.noTrade}</span><span>{t.buy}</span>
                </div>
                <div className="tsl-readout" style={{color: dir==="skip"?C.mu:dir==="up"?C.gn:C.rd}}>
                  {dir==="skip" ? t.noTrade
                    : (strength>=80 ? (dir==="up"?t.strongBuy:t.strongSell) : (dir==="up"?t.buy:t.sell)) + " · " + strength + "%"}
                </div>

                <div className="stake">{t.stake}: <b>${STAKE.toLocaleString()}</b></div>
                <button className="cta" onClick={confirm}>
                  {dir==="skip" ? t.skipTrade : t.openTrade}
                </button>
                <button className="cta ghost" onClick={endSession}>{t.end}</button>
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
              {roundNum < sessionLen && <button className="cta ghost" onClick={endSession}>{t.end}</button>}
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
.rb-win{overflow:hidden;border:1px solid ${C.ln};border-radius:12px;background:${C.sf};height:60px;position:relative;}
.rb-strip{display:flex;height:100%;width:max-content;}
.rb-strip.spin{animation:rbspin 2s cubic-bezier(.12,.6,.15,1) forwards;}
@keyframes rbspin{from{transform:translateX(0);}to{transform:translateX(var(--end));}}
.rb-cell{flex:0 0 auto;height:100%;display:flex;align-items:center;gap:9px;padding:0 12px;border-left:1px solid ${C.ln};box-sizing:border-box;transition:opacity .25s;}
.rb-cell.dim{opacity:.32;}
.rb-cell.landed{border:2px solid;border-radius:10px;background:${C.bg};}
.reelbig{display:flex;align-items:center;gap:7px;height:126px;animation:growin .32s ease;}
@keyframes growin{from{opacity:.5;}to{opacity:1;}}
.rb-side{flex:0 0 40px;height:92px;border:1.5px solid;border-radius:9px;background:#131315;display:flex;align-items:center;justify-content:center;opacity:.55;overflow:hidden;}
.rb-center{flex:1;height:124px;border:2px solid;border-radius:12px;background:#131315;padding:9px 12px;box-sizing:border-box;display:flex;flex-direction:column;animation:popin .32s cubic-bezier(.2,.8,.2,1);}
@keyframes popin{from{transform:scale(.92);}to{transform:scale(1);}}
.rc-name{font-size:12px;font-weight:800;color:${C.tx};margin-bottom:6px;}
.rc-chart{height:82px;flex:0 0 82px;}
.rc-chart svg{width:100%;height:82px;display:block;overflow:visible;}
.rc-iconbig{display:flex;align-items:center;justify-content:center;height:100%;}
.rb-nm{font-size:12px;font-weight:700;color:${C.tx};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cards{display:flex;flex-direction:column;gap:8px;margin-bottom:18px;}
.scard{display:flex;gap:12px;align-items:flex-start;background:${C.sf};border:1px solid ${C.ln};border-left:3px solid ${C.ln};border-radius:0 11px 11px 0;padding:11px 13px;}
.sc-ic{flex:0 0 42px;margin-top:2px;}
.sc-tx{flex:1;}
.sc-row{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:2px;}
.sc-nm{font-size:14px;font-weight:800;color:${C.tx};margin-bottom:3px;}
.sc-d{font-size:11.5px;line-height:1.4;color:${C.mu};}
.dec{}
.tsl-top{display:flex;justify-content:space-between;margin-bottom:8px;}
.tsl-side{font-size:11px;font-weight:800;}
.tsl-side.sell{color:${C.rd};} .tsl-side.buy{color:${C.gn};}
.tslider{-webkit-appearance:none;appearance:none;width:100%;height:8px;border-radius:5px;outline:none;
  background:linear-gradient(90deg, ${C.rd} 0%, ${C.rd} 38%, ${C.ln} 44%, ${C.ln} 56%, ${C.gn} 62%, ${C.gn} 100%);}
.tslider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:24px;height:24px;border-radius:50%;background:${C.tx};border:3px solid ${C.bg};box-shadow:0 0 0 1px ${C.ln};cursor:pointer;}
.tslider::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:${C.tx};border:3px solid ${C.bg};cursor:pointer;}
.tsl-scale{display:flex;justify-content:space-between;font-size:9px;color:#5F5E5A;margin-top:6px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;}
.tsl-readout{text-align:center;font-size:18px;font-weight:800;margin:14px 0 4px;}
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
