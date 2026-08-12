'use strict';

let days = [];
let italianSections = [];
let musicList = [];
let currentLang = 'basic';
let currentDayId = null;
let flashIndex = 0;
let showAnswer = false;

/* Italian game stats */
let quizScore = 0;
let quizTotal = 0;
let quizStreak = 0;
let quizBest = parseInt(localStorage.getItem('quizBest') || '0', 10);

/* Difficulty + timer config */
const DIFFICULTIES = {
  easy:   { label: 'קל',  options: 3, time: 0 },
  medium: { label: 'בינוני', options: 4, time: 12 },
  hard:   { label: 'קשה', options: 6, time: 7 }
};
let gameDifficulty = localStorage.getItem('gameDifficulty') || 'easy';
if (!DIFFICULTIES[gameDifficulty]) gameDifficulty = 'easy';
let quizTimerId = null;

/* Flashcard deck (auto-shuffle + autoplay) */
let flashDeck = [];
let flashAutoId = null;

const dayStrip = document.getElementById('dayStrip');
const dayView = document.getElementById('dayView');

/* Fun facts / history per day (keyed by day id) */
const DAY_FACTS = {
  d12: [
    'נאפולי היא בת יותר מ-2,800 שנה — אחת הערים המיושבות ברציפות העתיקות באירופה. שמה בא מיוונית "Neápolis" = "עיר חדשה".',
    'הפיצה נולדה כאן: פיצה מרגריטה נקראה על שם המלכה מרגריטה ב-1889, בצבעי הדגל האיטלקי — עגבנייה, מוצרלה ובזיליקום.',
    'מתחת לעיר מסתתרת "נאפולי התת-קרקעית" — מנהרות ומאגרי מים יווניים-רומיים ששימשו כמקלט בזמן מלחמת העולם השנייה.',
    'לנאפוליטנים יש אמונה טפלה חזקה: הקרן האדומה ("cornicello") נועדה להרחיק עין הרע.'
  ],
  d13: [
    'איסקיה היא אי געשי — כל המעיינות החמים והספא שלה מחוממים מהמאגמה שמתחת. האי כולו למעשה הוא הר געש רדום ("Monte Epomeo").',
    'לפי המיתולוגיה, הענק טיפון כלוא מתחת לאי, והרעידות והאדים החמים הם הנשימות שלו.',
    'איסקיה כונתה "האי הירוק" בזכות הצמחייה השופעת — בניגוד לשכנתה הסלעית קאפרי.',
    'כאן נמצא אחד הממצאים הארכיאולוגיים המפורסמים — "גביע נסטור" מהמאה ה-8 לפנה"ס, עם אחת הכתובות היווניות הקדומות שנמצאו.'
  ],
  d14: [
    'קסטלו אראגונזה בנוי על אי סלע קטן, ומחובר לאיסקיה בגשר אבן באורך 220 מ\' שנבנה ב-1441.',
    'המבצר הראשון על הסלע נבנה כבר ב-474 לפנה"ס. במשך הדורות שימש כמנזר, כלא ואפילו מקום מסתור מפני פיראטים.',
    'בסנטאנג\'לו אין כבישים למכוניות — מגיעים ברגל או בסירת מונית ("taxi boat"), מה שמשמר אווירה של כפר דייגים קטן.'
  ],
  d15: [
    'פראגוסטו (15 באוגוסט) הוא אחד החגים הגדולים באיטליה — במקורו חג רומי של הקיסר אוגוסטוס ("Feriae Augusti"), היום חג של ים, מנגלים וזיקוקים.',
    'החופים הכי יפים של איסקיה נגישים רק מהים — לכן סיור בסירה הוא הדרך הטובה ביותר לראות את האי.',
    'במפרץ Sorgeto מים חמים גיאותרמיים נובעים ישירות לתוך הים — אפשר להתרחץ ב"ג\'קוזי טבעי" גם בלילה.'
  ],
  d16: [
    'נגומבו הוא פארק תרמי-גני ("thermal garden") שעוצב בהשראת מפרץ שראה המייסד בדרום אפריקה — משלב בריכות בטמפרטורות שונות עם גינון טרופי.',
    'איסקיה מתגאה ביותר מ-100 מעיינות תרמיים וספא — היא אחד היעדים הגדולים באירופה ל"תיירות בריאות".',
    'המים המינרליים כאן עשירים במלחים ובגופרית, ומשמשים לטיפולים כבר מהתקופה הרומית.'
  ],
  d17: [
    'La Mortella הם גנים סובטרופיים מדהימים שיצר המלחין הבריטי William Walton ואשתו הארגנטינאית — היום אחד הגנים היפים באיטליה.',
    'פוריו מפורסם ב"Il Torrione", מגדל שמירה עגול מהמאה ה-15 שנבנה להגנה מפני פשיטות פיראטים.',
    'השקיעה מכנסיית Soccorso הלבנה בפוריו נחשבת לאחת היפות באי — נקודת חובה לצילום.'
  ],
  d18: [
    'סורנטו יושבת על צוקים דרמטיים מעל הים — העיר בנויה מעל מפרץ, והגישה למים היא במעליות ובשבילים חצובים בסלע.',
    'סורנטו היא בירת הלימונצ\'לו: לימוני הענק המקומיים ("femminello") גדלים תחת רשתות עץ מסורתיות ומשמשים לליקר הצהוב המפורסם.',
    'לפי המיתולוגיה, חופי סורנטו הם ביתן של הסירנות — היצורות ששרו לאודיסאוס בניסיון לפתותו.'
  ],
  d19: [
    'פוזיטנו בנויה כמדרגות על מדרון תלול — אומרים ש"עוזבים אותה בגעגוע עוד לפני שהגעתם". הסופר ג\'ון סטיינבק הפך אותה למפורסמת במאמר מ-1953.',
    'הכיפה הצבעונית של כנסיית Santa Maria Assunta בפוזיטנו מכוסה באלפי אריחי מיוליקה צבעוניים.',
    'אמלפי הייתה מעצמה ימית עצמאית וחזקה בימי הביניים — אחת מארבע "הרפובליקות הימיות" של איטליה, לצד ונציה, ג\'נובה ופיזה.',
    'נייר "Amalfi" המפורסם מיוצר כאן ביד עוד מימי הביניים, בשיטה שהובאה מהמזרח הערבי.'
  ],
  d20: [
    'מפרץ Ieranto נחשב לאחד היפים בחצי האי הסורנטיני, ולפי האגדה כאן ישבו הסירנות ששרו למלחים.',
    'Marina del Cantone הוא כפר דייגים שקט עם חוף חלוקים — נקודת זינוק פופולרית לטיולי סירה וצלילה.',
    'האזור הזה הוא שמורת טבע ימית ("Punta Campanella") — המים צלולים במיוחד ומלאים בחיים ימיים.'
  ],
  d21: [
    'פומפיי נקברה תחת אפר וזרם וולקני ב-79 לספירה בהתפרצות הוזוב — והאפר שימר את העיר בצורה מדהימה למשך כ-1,700 שנה.',
    'בין ההריסות אפשר לראות "פסי הליכה" מוגבהים בכבישים — מדרכות מעבר קדומות שאפשרו לחצות מבלי לדרוך על מי הביוב.',
    'הצורות האנושיות בפומפיי הן למעשה יציקות גבס שנוצקו לתוך החללים שהותירו הגופות באפר המתקשה.',
    'הוזוב עדיין פעיל — ההר שמעל נאפולי נחשב לאחד הרי הגעש המסוכנים בעולם בגלל האוכלוסייה הצפופה סביבו.'
  ],
  d22: [
    'שדה התעופה של נאפולי (Capodichino) קרוב במיוחד למרכז העיר — אחת ההמראות עם הנוף הכי יפה על המפרץ והוזוב.',
    'פתגם נאפוליטני מפורסם: "Vedi Napoli e poi muori" — "ראה את נאפולי ואז מות", כלומר אין יופי שאפשר להוסיף אחריו.',
    'קפה נאפוליטני הוא מוסד: מסורת ה"caffè sospeso" — לשלם על שתי כוסות ולהשאיר אחת לזר שאין לו — נולדה כאן.'
  ]
};
function factsHtml(d) {
  const facts = DAY_FACTS[d.id];
  if (!facts || !facts.length) return '';
  return `<div class="card facts"><h2>💡 ידעת? עובדות ו${'\u200F'}היסטוריה על ${d.area}</h2>` +
    `<ul class="factlist">${facts.map(f => `<li>${f}</li>`).join('')}</ul></div>`;
}

/* ---------- helpers ---------- */
const enc = s => encodeURIComponent(s || '');

function mapBtn(q, label = 'פתח במפה') {
  return `<a class="btn secondary" target="_blank" rel="noopener" aria-label="${label}" href="https://www.google.com/maps/search/${enc(q)}">${label}</a>`;
}
function linkBtns(links, cls = 'secondary') {
  return (links || []).map(x => `<a class="btn ${cls}" target="_blank" rel="noopener" href="${x[1]}">${x[0]}</a>`).join('');
}
function checks(items, prefix) {
  return (items || []).map((x, i) =>
    `<label class="check"><input type="checkbox" data-key="${prefix}-${i}"><span>${x}</span></label>`
  ).join('');
}

/* ---------- persistence + progress ---------- */
function updateProgressBars() {
  document.querySelectorAll('.progress[data-scope]').forEach(p => {
    const scope = p.dataset.scope;
    const boxes = document.querySelectorAll(`input[type=checkbox][data-key^="${scope}"]`);
    const total = boxes.length;
    const done = [...boxes].filter(b => b.checked).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    p.querySelector('.label').textContent = `${done}/${total} הושלמו · ${pct}%`;
    p.querySelector('.bar > span').style.width = pct + '%';
  });
}
function hookChecks() {
  document.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.checked = localStorage.getItem(cb.dataset.key) === '1';
    cb.onchange = () => {
      localStorage.setItem(cb.dataset.key, cb.checked ? '1' : '0');
      updateProgressBars();
    };
  });
  updateProgressBars();
}
function progressBar(scope) {
  return `<div class="progress" data-scope="${scope}"><div class="label"></div><div class="bar"><span style="width:0"></span></div></div>`;
}

/* ---------- rendering ---------- */
function recCards(arr) {
  if (!arr || !arr.length) return '<p class="muted">אין פריטים מיוחדים ליום הזה.</p>';
  return '<div class="grid">' + arr.map(x =>
    `<div class="card third"><h3>${x.name}</h3><p class="muted">${x.why || ''}</p>` +
    `<span class="tag">${x.area || x.priority || x.bestFor || ''}</span>` +
    `<div class="btns">${mapBtn(x.query || x.name, 'ניווט / חיפוש')}</div></div>`
  ).join('') + '</div>';
}
function packingHtml(d) {
  if (!d.packingFull) return '';
  return `<div class="card"><h2>🧳 רשימת אריזה מלאה</h2>` +
    `<p class="muted">מחולקת לפי קטגוריות, נשמרת בטלפון.</p>${progressBar('pack-')}` +
    `<div class="grid">${Object.entries(d.packingFull).map(([cat, items], ci) =>
      `<div class="card third"><h3>${cat}</h3>${checks(items, 'pack-' + ci)}</div>`).join('')}</div></div>`;
}

function isToday(d) {
  const now = new Date();
  const [dd, mm] = String(d.date).split('/').map(n => parseInt(n, 10));
  return now.getDate() === dd && (now.getMonth() + 1) === mm;
}

function dayButtons(id) {
  dayStrip.innerHTML = days.map(d =>
    `<button class="daybtn ${d.id === id ? 'active' : ''} ${isToday(d) ? 'today' : ''}" role="tab" ` +
    `aria-selected="${d.id === id}" onclick="selectDay('${d.id}')">` +
    `<b>${d.date}</b><br><span>${d.weekday} · ${d.area}</span><br><span>${d.title}</span></button>`
  ).join('');
  const active = dayStrip.querySelector('.daybtn.active');
  if (active) active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
}

function selectDay(id) {
  const d = days.find(x => x.id === id) || days[0];
  currentDayId = d.id;
  dayButtons(d.id);
  const src = `https://www.google.com/maps?q=${enc(d.mapQuery)}&output=embed`;
  dayView.innerHTML =
    `<div class="card"><div class="muted">${d.weekday} · ${d.area}</div>` +
    `<h2>${d.date} · ${d.title}</h2><p class="muted">${d.hero}</p>` +
    `<span class="pill green">Family score: ${d.familyScore}</span>` +    `<span class="pill">לינה: ${d.lodging}</span><span class="pill">${d.address}</span></div>` +
    factsHtml(d) +
    packingHtml(d) +
    `<div class="card"><h2>🎟️ הזמנות ומידע רשמי</h2><div class="btns">${linkBtns(d.bookingLinks, 'book')}</div></div>` +
    `<div class="card half"><h2>🗺️ מפת היום</h2><iframe loading="lazy" title="מפת ${d.title}" src="${src}"></iframe>` +
    `<div class="btns">${mapBtn(d.mapQuery, 'פתח מפת היום')}</div></div>` +
    `<div class="card half"><h2>🕘 לו״ז</h2>${(d.schedule || []).map(([t, x]) =>
      `<div class="row"><span class="time">${t}</span><div>${x}</div></div>`).join('')}</div>` +
    `<div class="card half"><h2>🚕 תחבורה</h2><ul class="list">${(d.transport || []).map(x => `<li>${x}</li>`).join('')}</ul></div>` +
    `<div class="card half warning"><h2>⭐ דברים חשובים</h2><ul class="list">${(d.important || []).map(x => `<li>${x}</li>`).join('')}</ul></div>` +
    `<div class="card half"><h2>🎒 מה להביא</h2>${progressBar(d.id)}${checks(d.bring, d.id)}</div>` +
    `<div class="card half"><h2>🚨 שימושי באזור</h2><div class="btns">${(d.useful || []).map(x => mapBtn(x, x)).join('')}</div></div>` +
    `<div class="card"><h2>📍 אטרקציות באזור</h2>${recCards(d.attractions)}</div>` +
    `<div class="card"><h2>🍝 מסעדות מומלצות</h2>${recCards(d.restaurants)}</div>` +
    `<div class="card"><h2>🍦 גלידה ומתוקים</h2>${recCards(d.gelato)}</div>` +
    `<div class="card"><h2>🔗 קישורים נוספים</h2><div class="btns">${linkBtns(d.links)}</div></div>`;
  hookChecks();
}

function shiftDay(delta) {
  const idx = days.findIndex(x => x.id === currentDayId);
  const next = days[Math.min(days.length - 1, Math.max(0, idx + delta))];
  if (next) selectDay(next.id);
}
function jumpToToday() {
  const t = days.find(isToday) || days[0];
  showPage('trip');
  selectDay(t.id);
}

/* ---------- Italian learning ---------- */
function speakIt(t) {
  try {
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'it-IT';
    u.rate = .86;
    speechSynthesis.speak(u);
  } catch (e) {
    alert('השמעה אינה זמינה בדפדפן הזה');
  }
}
function renderLangTabs() {
  document.getElementById('langTabs').innerHTML = italianSections.map(s =>
    `<button class="${s.key === currentLang ? 'active' : ''}" role="tab" aria-selected="${s.key === currentLang}" ` +
    `onclick="selectLang('${s.key}')">${s.title}</button>`
  ).join('');
}
function selectLang(key) {
  currentLang = key;
  flashIndex = 0;
  showAnswer = false;
  flashDeck = [];
  renderItalian();
}
function difficultyBar() {
  return `<div class="card"><h2>⚙️ רמת קושי</h2>` +
    `<p class="muted">משפיע על מספר האפשרויות בחידון והאם יש טיימר.</p>` +
    `<div class="seg diff-seg">${Object.entries(DIFFICULTIES).map(([k, v]) =>
      `<button class="${k === gameDifficulty ? 'active' : ''}" onclick="setDifficulty('${k}')">` +
      `${v.label}${v.time ? ' · ⏱️' + v.time + 'ש' : ''}</button>`).join('')}</div></div>`;
}
function setDifficulty(k) {
  if (!DIFFICULTIES[k]) return;
  gameDifficulty = k;
  localStorage.setItem('gameDifficulty', k);
  renderItalian();
}
function renderItalian() {
  renderLangTabs();
  const sec = italianSections.find(s => s.key === currentLang) || italianSections[0];
  if (!sec) return;
  document.getElementById('langContent').innerHTML =
    `<div class="card"><h2>📚 ${sec.title}</h2>${sec.phrases.map(x =>
      `<div class="phrase"><div class="italian">${x[0]}</div><div class="phonetic">${x[1]}</div>` +
      `<div class="muted">${x[2]}</div><button class="btn" onclick='speakIt(${JSON.stringify(x[0])})' aria-label="השמע">🔊 השמע</button></div>`).join('')}</div>` +
    difficultyBar() +
    `<div class="card half" id="flashGame"></div>` +
    `<div class="card half" id="quizGame"></div>` +
    `<div class="card half" id="builderGame"></div>` +
    `<div class="card half" id="fillGame"></div>` +
    `<div class="card"><h2>� מוזיקה איטלקית עכשווית</h2><p class="muted">אמנים לשמיעה בדרך.</p>` +
    `<div class="grid">${musicList.map(m =>
      `<div class="card third"><h3>${m.artist}</h3><p class="muted">${m.why}</p><div class="btns">${mapBtn(m.artist + ' Italian songs', 'חפש שירים')}</div></div>`).join('')}</div>` +
    `<div class="btns">` +
    `<a class="btn secondary" target="_blank" rel="noopener" href="https://www.italiamia.com/culture/music/top-italian-songs-and-artists-summer-2026-complete-playlist-guide/">Italia Mia 2026</a>` +
    `<a class="btn secondary" target="_blank" rel="noopener" href="https://www.youtube.com/playlist?list=PLy_wKxVmWb4aVmvrij9J92HnbSxkDHgXN">YouTube Playlist</a>` +
    `<a class="btn secondary" target="_blank" rel="noopener" href="https://music.youtube.com/playlist?list=PL-_HauNKjNPsX9F0_shOvEIG-wsgDx1qm">YouTube Music</a></div></div>`;
  newQuizQuestion();
  newBuilderQuestion();
  newFillQuestion();
}

/* ---------- Italian games engine ---------- */
function langPhrases() {
  const sec = italianSections.find(s => s.key === currentLang) || italianSections[0];
  return (sec && sec.phrases) || [];
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function randomPhrase() {
  const ph = langPhrases();
  return ph[Math.floor(Math.random() * ph.length)];
}
function recordAnswer(correct) {
  quizTotal++;
  if (correct) {
    quizScore++;
    quizStreak++;
    if (quizStreak > quizBest) {
      quizBest = quizStreak;
      localStorage.setItem('quizBest', String(quizBest));
    }
  } else {
    quizStreak = 0;
  }
  document.querySelectorAll('.scoreboard').forEach(updateScoreboard);
}
function scoreboardHtml() {
  return `<div class="scoreboard muted"></div>`;
}
function updateScoreboard(el) {
  el.innerHTML =
    `<span class="stat">✅ נכונות: <b>${quizScore}/${quizTotal}</b></span>` +
    `<span class="stat">🔥 רצף: <b>${quizStreak}</b></span>` +
    `<span class="stat">🏆 שיא: <b>${quizBest}</b></span>`;
}

/* Flashcards: auto-shuffled deck with optional autoplay */
function renderFlashcards() {
  const box = document.getElementById('flashGame');
  if (!box) return;
  if (!flashDeck.length) { flashDeck = shuffle(langPhrases()); flashIndex = 0; }
  const p = flashDeck[flashIndex % flashDeck.length];
  const autoOn = !!flashAutoId;
  box.innerHTML =
    `<h2>🃏 כרטיסיות <span class="muted" style="font-size:13px">(${(flashIndex % flashDeck.length) + 1}/${flashDeck.length})</span></h2>` +
    `<div class="flash" onclick="flipFlash()"><div class="big">${showAnswer ? p[2] : p[0]}</div>` +
    `<div class="muted">${showAnswer ? p[0] + ' · ' + p[1] : 'הקישו לחשיפת התרגום'}</div></div>` +
    `<div class="btns"><button class="btn secondary" onclick="flipFlash()">הפוך כרטיס</button>` +
    `<button class="btn" onclick="nextFlash()">הבא ›</button>` +
    `<button class="btn secondary" onclick='speakIt(${JSON.stringify(p[0])})' aria-label="השמע">🔊</button>` +
    `<button class="btn secondary" onclick="reshuffleFlash()">🔀 ערבוב</button>` +
    `<button class="btn ${autoOn ? '' : 'secondary'}" onclick="toggleFlashAuto()">${autoOn ? '⏸️ עצור' : '▶️ אוטומטי'}</button></div>`;
}
function flipFlash() { showAnswer = !showAnswer; renderFlashcards(); }
function nextFlash() {
  flashIndex++;
  if (flashIndex % flashDeck.length === 0) flashDeck = shuffle(flashDeck);
  showAnswer = false;
  renderFlashcards();
}
function reshuffleFlash() {
  flashDeck = shuffle(langPhrases());
  flashIndex = 0;
  showAnswer = false;
  renderFlashcards();
}
function toggleFlashAuto() {
  if (flashAutoId) {
    clearInterval(flashAutoId);
    flashAutoId = null;
  } else {
    flashAutoId = setInterval(() => {
      if (!showAnswer) { showAnswer = true; renderFlashcards(); }
      else { nextFlash(); }
    }, 2200);
  }
  renderFlashcards();
}

/* Game 1: multiple choice — difficulty-based options + optional timer */
function clearQuizTimer() {
  if (quizTimerId) { clearInterval(quizTimerId); quizTimerId = null; }
}
function newQuizQuestion() {
  const box = document.getElementById('quizGame');
  if (!box) return;
  clearQuizTimer();
  const cfg = DIFFICULTIES[gameDifficulty];
  const ph = langPhrases();
  const p = randomPhrase();
  const distractors = ph.filter(x => x[2] !== p[2]).sort(() => Math.random() - .5)
    .slice(0, cfg.options - 1).map(x => x[2]);
  const opts = [p[2], ...distractors].sort(() => Math.random() - .5);  box.innerHTML =
    `<h2>🎯 בחירה מהירה</h2>${scoreboardHtml()}` +
    (cfg.time ? `<div class="timerbar" id="quizTimer"><span></span></div>` : '') +
    `<p class="muted">מה המשמעות של <b class="italian-inline">${p[0]}</b>? ` +
    `<button class="linklike" onclick='speakIt(${JSON.stringify(p[0])})' aria-label="השמע">🔊</button></p>` +
    `<div id="quizOpts">${opts.map(o =>
      `<button class="btn secondary quizOption" data-correct="${o === p[2]}">${o}</button>`).join('')}</div>` +
    `<div class="feedback" id="quizFeedback"></div>`;
  updateScoreboard(box.querySelector('.scoreboard'));
  box.querySelectorAll('.quizOption').forEach(btn =>
    (btn.onclick = () => answerQuiz(btn, p[2])));
  if (cfg.time) startQuizTimer(cfg.time, p[2]);
}
function startQuizTimer(seconds, correctAnswer) {
  const box = document.getElementById('quizGame');
  const bar = box.querySelector('#quizTimer span');
  let remaining = seconds * 1000;
  const total = remaining;
  bar.style.width = '100%';
  const tick = 100;
  quizTimerId = setInterval(() => {
    remaining -= tick;
    bar.style.width = Math.max(0, (remaining / total) * 100) + '%';
    if (remaining <= 0) {
      clearQuizTimer();
      timeoutQuiz(correctAnswer);
    }
  }, tick);
}
function timeoutQuiz(correctAnswer) {
  const box = document.getElementById('quizGame');
  if (!box) return;
  box.querySelectorAll('.quizOption').forEach(b => {
    b.disabled = true;
    if (b.textContent === correctAnswer) b.classList.add('correct');
  });
  const fb = box.querySelector('#quizFeedback');
  fb.textContent = `⏱️ נגמר הזמן! התשובה: ${correctAnswer}`;
  fb.className = 'feedback no';
  recordAnswer(false);
  setTimeout(newQuizQuestion, 1600);
}
function answerQuiz(btn, correctAnswer) {
  const box = document.getElementById('quizGame');
  clearQuizTimer();
  const correct = btn.dataset.correct === 'true';
  box.querySelectorAll('.quizOption').forEach(b => {
    b.disabled = true;
    if (b.textContent === correctAnswer) b.classList.add('correct');
  });
  if (!correct) btn.classList.add('wrong');
  const fb = box.querySelector('#quizFeedback');
  fb.textContent = correct ? 'נכון! 🎉 שאלה חדשה בדרך…' : `כמעט. התשובה: ${correctAnswer}`;
  fb.className = 'feedback ' + (correct ? 'ok' : 'no');
  recordAnswer(correct);
  setTimeout(newQuizQuestion, correct ? 850 : 1600);
}

/* Game 2: sentence builder — auto-advances on correct */
function newBuilderQuestion() {
  const box = document.getElementById('builderGame');
  if (!box) return;
  const p = randomPhrase();
  const words = p[0].split(' ');
  const chips = words.map((w, i) => ({ w, i })).sort(() => Math.random() - .5);
  box.dataset.target = p[0];
  box.innerHTML =
    `<h2>🧩 סדרו את המשפט</h2><p class="muted">משמעות: <b>${p[2]}</b> · לחצו על המילים לפי הסדר.</p>` +
    `<div class="drop" id="builderAnswer" aria-live="polite"></div>` +
    `<div class="chips" id="builderChips">${chips.map(c =>
      `<button class="wordchip" data-idx="${c.i}">${c.w}</button>`).join('')}</div>` +
    `<div class="feedback" id="builderFeedback"></div>` +
    `<div class="btns"><button class="btn secondary" id="builderReset">איפוס</button>` +
    `<button class="btn secondary" id="builderSkip">משפט אחר</button></div>`;
  const answer = box.querySelector('#builderAnswer');
  const picked = [];
  box.querySelectorAll('.wordchip').forEach(chip => {
    chip.onclick = () => {
      chip.disabled = true;
      chip.style.opacity = .35;
      picked.push(chip.textContent);
      answer.textContent = picked.join(' ');
      if (picked.length === words.length) checkBuilder(box, picked.join(' '));
    };
  });
  box.querySelector('#builderReset').onclick = newBuilderQuestion;
  box.querySelector('#builderSkip').onclick = newBuilderQuestion;
}
function checkBuilder(box, attempt) {
  const target = box.dataset.target;
  const fb = box.querySelector('#builderFeedback');
  const correct = attempt.trim() === target.trim();
  fb.textContent = correct ? 'Bravissimi! 🎉 משפט חדש…' : `כמעט. הנכון: ${target}`;
  fb.className = 'feedback ' + (correct ? 'ok' : 'no');
  recordAnswer(correct);
  setTimeout(newBuilderQuestion, correct ? 900 : 1900);
}

/* Game 3: type the first word — auto-advances after checking */
function newFillQuestion() {
  const box = document.getElementById('fillGame');
  if (!box) return;
  const p = randomPhrase();
  const firstWord = p[0].split(' ')[0];
  box.dataset.answer = firstWord.toLowerCase();
  box.innerHTML =
    `<h2>✍️ השלמת משפט</h2><p class="muted">כתבו את המילה הראשונה במשפט: <b>${p[2]}</b><br>` +
    `<span class="muted">(רמז: מתחיל ב־"${firstWord[0]}")</span></p>` +
    `<input id="fillInput" type="text" autocomplete="off" placeholder="המילה הראשונה באיטלקית">` +
    `<div class="feedback" id="fillFeedback"></div>` +
    `<div class="btns"><button class="btn" id="fillCheck">בדיקה</button>` +
    `<button class="btn secondary" id="fillSkip">דלג</button></div>`;
  const input = box.querySelector('#fillInput');
  input.focus();
  const submit = () => checkFill(box, input.value);
  box.querySelector('#fillCheck').onclick = submit;
  box.querySelector('#fillSkip').onclick = newFillQuestion;
  input.onkeydown = e => { if (e.key === 'Enter') submit(); };
}
function checkFill(box, value) {
  const fb = box.querySelector('#fillFeedback');
  const correct = value.trim().toLowerCase() === box.dataset.answer;
  fb.textContent = correct ? 'נכון! 🎉 שאלה חדשה…' : `המילה הנכונה: ${box.dataset.answer}`;
  fb.className = 'feedback ' + (correct ? 'ok' : 'no');
  recordAnswer(correct);
  setTimeout(newFillQuestion, correct ? 900 : 1800);
}

/* ---------- pages ---------- */
const PAGES = {
  overview: { section: 'overviewPage', nav: 'navOverview' },
  trip: { section: 'tripPage', nav: 'navTrip' },
  italian: { section: 'italianPage', nav: 'navItalian' }
};
function showPage(page) {
  if (!PAGES[page]) page = 'overview';
  Object.entries(PAGES).forEach(([key, ids]) => {
    const section = document.getElementById(ids.section);
    const nav = document.getElementById(ids.nav);
    const on = key === page;
    section.classList.toggle('active', on);
    section.classList.toggle('hidden', !on);
    nav.classList.toggle('active', on);
    if (on) nav.setAttribute('aria-current', 'page');
    else nav.removeAttribute('aria-current');
  });
  if (page === 'italian') renderItalian();
  if (page === 'overview') renderOverview();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- overview ---------- */
function renderOverview() {
  const box = document.getElementById('overviewContent');
  if (!box || !days.length) return;
  const areas = [...new Set(days.map(d => d.area))];
  const stats =
    `<div class="card ov-stats">` +
    `<span class="pill green">📅 ${days.length} ימים</span>` +
    `<span class="pill">📍 ${areas.length} אזורים</span>` +
    `<span class="pill">🗓️ ${days[0].date} – ${days[days.length - 1].date}</span>` +
    `</div>`;
  const timeline =
    `<div class="card"><h2>🗺️ ציר הזמן של הטיול</h2><div class="timeline">` +
    days.map(d =>
      `<button class="ov-day ${isToday(d) ? 'today' : ''}" onclick="openDayFromOverview('${d.id}')">` +
      `<div class="ov-date"><b>${d.date}</b><span class="muted">${d.weekday}</span></div>` +
      `<div class="ov-body"><div class="ov-title">${d.title}</div>` +
      `<div class="muted ov-area">📍 ${d.area} · 🛏️ ${d.lodging}</div>` +
      `<div class="muted ov-hero">${d.hero || ''}</div></div>` +
      `<div class="ov-score">${d.familyScore || ''}</div></button>`
    ).join('') +
    `</div></div>`;
  box.innerHTML = stats + timeline;
}
function openDayFromOverview(id) {
  showPage('trip');
  selectDay(id);
}

/* ---------- theme ---------- */
const THEMES = ['light', 'dark', 'auto'];
const THEME_META = {
  light: { icon: '☀️', label: 'מצב בהיר' },
  dark: { icon: '🌙', label: 'מצב כהה' },
  auto: { icon: '🌗', label: 'אוטומטי (לפי המכשיר)' }
};
function applyTheme(theme) {
  if (!THEMES.includes(theme)) theme = 'auto';
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  const meta = THEME_META[theme];
  btn.textContent = meta.icon;
  btn.setAttribute('aria-label', 'מצב תצוגה: ' + meta.label);
  btn.title = meta.label + ' · לחצו להחלפה';
  localStorage.setItem('theme', theme);
}
function cycleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'auto';
  const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
  applyTheme(next);
}
function initTheme() {
  const saved = localStorage.getItem('theme');
  applyTheme(THEMES.includes(saved) ? saved : 'auto');
  // Keep the theme-color meta in sync when the OS switches while in auto mode.
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (document.documentElement.getAttribute('data-theme') === 'auto') {
        applyTheme('auto');
      }
    });
}

/* ---------- notes ---------- */
function initNotes() {
  const notes = document.getElementById('notes');
  const hint = document.getElementById('notesHint');
  notes.value = localStorage.getItem('familyNotes') || '';
  let t;
  notes.oninput = () => {
    localStorage.setItem('familyNotes', notes.value);
    hint.textContent = '✔ נשמר';
    clearTimeout(t);
    t = setTimeout(() => (hint.textContent = ''), 1500);
  };
}

/* ---------- events + boot ---------- */
function wireUi() {  document.getElementById('themeToggle').onclick = () => cycleTheme();
  document.getElementById('todayBtn').onclick = jumpToToday;
  document.getElementById('prevDay').onclick = () => shiftDay(-1);
  document.getElementById('nextDay').onclick = () => shiftDay(1);
  document.querySelectorAll('.bottomNav button').forEach(b =>
    (b.onclick = () => showPage(b.dataset.page)));
}

async function loadItineraryData() {
  try {
    const response = await fetch('./itinerary.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load itinerary.json: ' + response.status);
    const data = await response.json();
    days = data.days || [];
    italianSections = (data.italian && data.italian.sections) || [];
    musicList = (data.music && data.music.artists) || [];    if (!days.length) throw new Error('itinerary.json has no days');
    const startDay = days.find(isToday) || days[0];
    selectDay(startDay.id);
    renderOverview();
  } catch (err) {
    dayView.innerHTML =
      `<div class="card warning"><h2>לא ניתן לטעון את itinerary.json</h2>` +
      `<p class="muted">${err.message}</p>` +
      `<p class="muted">ודא ש-itinerary.json נמצא באותה תיקייה כמו index.html.</p></div>`;
    console.error(err);
  }
}

initTheme();
wireUi();
initNotes();
loadItineraryData();

// Offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW registration failed', err)));
}
