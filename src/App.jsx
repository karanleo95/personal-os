import { useState, useEffect, useCallback } from "react";

const HABITS = [
  { id: "wakeup",    icon: "🌅", label: "Wake Up Routine",         desc: "6:30 AM · 500ml water · no phone 20 min" },
  { id: "sunwalk",   icon: "🌤️", label: "Sun Walk",                desc: "6:45 AM · 10–15 min outdoor · no sunglasses" },
  { id: "meditate",  icon: "🧘", label: "Meditation",               desc: "7:00 AM · 10–15 min breathing" },
  { id: "zone2",     icon: "🚴", label: "Zone 2 + CEO Block",       desc: "7:30 AM · 20 min cycling · plan your day" },
  { id: "workout",   icon: "🏋️", label: "Morning Workout",          desc: "8:00–9:00 AM strength session" },
  { id: "meals",     icon: "🍽️", label: "Meals On Plan",            desc: "All 5 meals followed" },
  { id: "healthify", icon: "📱", label: "Calorie Log (Healthify)",  desc: "Log all meals in Healthify" },
  { id: "supps",     icon: "💊", label: "Supplements",              desc: "All 4 supplement timings done" },
  { id: "activity",  icon: "🎾", label: "Evening Activity",         desc: "Tennis / football / walk" },
  { id: "alcohol",   icon: "🍺", label: "No Alcohol",               desc: "Zero alcohol today" },
  { id: "sleep",     icon: "😴", label: "Wind Down by 10:30",       desc: "Dim lights 9:30 · in bed 10:30" },
  { id: "steps",     icon: "👟", label: "8–12k Steps",              desc: "Daily step target" },
  { id: "screen",    icon: "📵", label: "Screen Detox",             desc: "No phone 1hr before bed" },
];

const WEEK1 = [
  { lunch: "Toor dal tadka · Bhindi sabzi · 2 rotis · Curd · Salad",       dinner: "Moong dal · Lauki sabzi · 1 roti · Salad" },
  { lunch: "Chana dal · Palak sabzi · 2 rotis · Curd · Salad",             dinner: "Egg bhurji (2 eggs) · Toast · Mixed veg · Salad" },
  { lunch: "Masoor dal · Methi sabzi · 2 rotis · Curd · Salad",            dinner: "Palak tofu 200g · 1 roti · Salad" },
  { lunch: "Rajma · Tinda sabzi · 2 rotis · Curd · Salad",                 dinner: "Khichdi (moong+rice) · Curd · Salad" },
  { lunch: "Toor dal · Aloo gobi (dry) · 2 rotis · Curd · Salad",          dinner: "Tofu bhurji · 1 roti · Cucumber raita · Salad" },
  { lunch: "Chana dal+spinach · 2 rotis · Curd · Salad",                   dinner: "Sprouts bowl · Curd · Salad · 1 roti optional" },
  { lunch: null, dinner: null },
];
const WEEK2 = [
  { lunch: "Moong dal · Beans sabzi · 2 rotis · Curd · Salad",             dinner: "Thick veg soup · 1 multigrain roti · Salad" },
  { lunch: "Masoor dal · Baingan bharta · 2 rotis · Curd · Salad",         dinner: "Egg bhurji (2 eggs) · 1 roti · Sautéed spinach · Salad" },
  { lunch: "Toor dal tadka · Karela sabzi · 2 rotis · Curd · Salad",       dinner: "Millet bowl (bajra/jowar) · Dal · Curd · Salad" },
  { lunch: "Chana dal · Capsicum sabzi · 2 rotis · Curd · Salad",          dinner: "Palak tofu 200g · 1 roti · Salad" },
  { lunch: "Rajma · Lauki sabzi · 2 rotis · Curd · Salad",                 dinner: "Khichdi · Curd · Pickle · Salad" },
  { lunch: "Moong dal+methi · 2 rotis · Curd · Salad",                     dinner: "Chole (small) · 1 roti · Large salad" },
  { lunch: null, dinner: null },
];
const SNACKS = [
  "Moong sprouts · lemon · chaat masala",
  "Greek yogurt 100g · pumpkin seeds",
  "Roasted makhana 30g",
  "Roasted chana 40g · cucumber sticks",
  "Sprouts · boiled egg white · pepper",
  "Apple · 4 walnuts",
  null,
];

const QUARTERS = [
  { id:"morning", label:"Morning", icon:"🌅", color:"#f59e0b", items:[
    {time:"6:30 AM", icon:"💧", task:"Wake up · 500ml water + pinch salt · no phone 20 min"},
    {time:"6:45 AM", icon:"🌤️", task:"Sun walk · 10–15 min outdoor · no sunglasses"},
    {time:"7:00 AM", icon:"🧘", task:"Meditation / breathing · 10–15 min"},
    {time:"7:30 AM", icon:"🚴", task:"CEO block + Zone 2 cycling · 20 min · plan your day while riding"},
    {time:"8:00 AM", icon:"🏋️", task:"Strength workout (home gym)"},
    {time:"9:00 AM", icon:"🥤", task:"Whey isolate 1 scoop + 300ml water"},
    {time:"9:15 AM", icon:"🚿", task:"Shower + get ready"},
    {time:"9:30 AM", icon:"🍓", task:"Breakfast · oats bowl + fruit · Vit D, Neurobion, Biotin"},
  ]},
  { id:"noon", label:"Noon", icon:"☀️", color:"#10b981", items:[
    {time:"10:30 AM", icon:"💼", task:"Leave for office"},
    {time:"11:00 AM", icon:"🐸", task:"Eat the frog · biggest task of the day first"},
    {time:"2:00 PM",  icon:"🥗", task:"Lunch · tiffin (dal + sabzi + 2 rotis + curd + salad)"},
    {time:"2:15 PM",  icon:"💊", task:"Omega-3 (1 cap now · 2 caps from week 3)"},
    {time:"2:30 PM",  icon:"🚶", task:"Short walk post lunch · 5–10 min"},
  ]},
  { id:"evening", label:"Evening", icon:"🌆", color:"#8b5cf6", items:[
    {time:"3:00 PM",  icon:"💻", task:"Work block 2 · meetings · delegate"},
    {time:"5:30 PM",  icon:"🥜", task:"Evening snack · per day rotation · from home"},
    {time:"6:00 PM",  icon:"🏃", task:"Leave office"},
    {time:"6:30 PM",  icon:"🎾", task:"Evening activity · tennis / football / walk"},
    {time:"8:00 PM",  icon:"🍽️", task:"Dinner · light · from rotation · finish by 8:30"},
  ]},
  { id:"night", label:"Night", icon:"🌙", color:"#6366f1", items:[
    {time:"8:30 PM",  icon:"✅", task:"Log today's habits + calories in Healthify"},
    {time:"9:15 PM",  icon:"🌿", task:"Isabgol 1 tsp in water (1hr after dinner)"},
    {time:"9:30 PM",  icon:"💡", task:"Dim lights · no intense screens · wind down"},
    {time:"10:00 PM", icon:"💊", task:"Magnesium glycinate · light reading · no phone"},
    {time:"10:30 PM", icon:"😴", task:"In bed · cool dark room · target 8 hrs"},
  ]},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const pad = (n) => String(n).padStart(2,"0");
const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const todayKey = () => dateKey(new Date());

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
  date.setUTCDate(date.getUTCDate()+4-(date.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  return Math.ceil((((date-yearStart)/86400000)+1)/7);
}

function getMealDay(date) {
  const ref = new Date("2026-03-30");
  const diff = Math.floor((date-ref)/86400000);
  const idx = ((diff%14)+14)%14;
  const week = idx<7?WEEK1:WEEK2;
  const day = week[idx%7];
  return {...day, snack:SNACKS[idx%7], weekLabel:idx<7?"Week 1":"Week 2", dayNum:idx+1, isSunday:(idx%7)===6};
}

function getCurrentQuarter() {
  const h = new Date().getHours();
  if (h>=6&&h<10) return "morning";
  if (h>=10&&h<15) return "noon";
  if (h>=15&&h<20) return "evening";
  return "night";
}

function formatDate(d) {
  return d.toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"});
}

function getYearDays() {
  const today=new Date(); const d=new Date(today.getFullYear(),0,1); const days=[];
  while(d.getFullYear()===today.getFullYear()){days.push(new Date(d));d.setDate(d.getDate()+1);}
  return days;
}

function getWeekScore(habits,weekDates) {
  let score=0,max=0;
  weekDates.forEach(d=>{const day=habits[dateKey(d)]||{};HABITS.forEach(h=>{if(day[h.id])score++;max++;});});
  return max?Math.round((score/max)*100):0;
}

function getLast84Days() {
  const days=[];
  for(let i=83;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(new Date(d));}
  return days;
}

const scoreColor=(p)=>p>=80?"#10b981":p>=60?"#f59e0b":p>=40?"#f97316":"#ef4444";

// ─── LOCALSTORAGE (works on any browser, persists on device) ─────────────────

function lsGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── QUOTE ────────────────────────────────────────────────────────────────────

async function fetchDailyQuote() {
  const today = todayKey();
  const cached = lsGet(`quote-${today}`);
  if (cached) return cached;
  const fallback = {quote:"Small daily actions compound into extraordinary results.", theme:"consistency"};
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514",
        max_tokens:120,
        messages:[{role:"user",content:`You are a coach for a man in his early 30s on a 12-week fat loss + lipid improvement + abs + elite habits protocol. Today is ${new Date().toLocaleDateString("en-IN",{weekday:"long"})}. Give ONE short powerful motivational quote (max 18 words) on discipline, consistency, or transformation. Personal and direct. No hashtags. Respond ONLY with JSON: {"quote":"...","theme":"one word"}`}]
      })
    });
    const data = await res.json();
    const text = (data.content?.[0]?.text||"").replace(/```json|```/g,"").trim();
    const parsed = JSON.parse(text);
    lsSet(`quote-${today}`, parsed);
    return parsed;
  } catch { return fallback; }
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab,        setTab]        = useState("today");
  const [quarter,    setQuarter]    = useState(getCurrentQuarter());
  const [selDate,    setSelDate]    = useState(new Date());
  const [habits,     setHabits]     = useState(()=>lsGet("pos-habits")||{});
  const [water,      setWater]      = useState(()=>lsGet("pos-water")||{});
  const [metrics,    setMetrics]    = useState(()=>lsGet("pos-metrics")||[]);
  const [energy,     setEnergy]     = useState(()=>lsGet("pos-energy")||{});
  const [quote,      setQuote]      = useState(null);
  const [quoteLoad,  setQuoteLoad]  = useState(true);
  const [showReview, setShowReview] = useState(false);

  useEffect(()=>{
    fetchDailyQuote().then(q=>{setQuote(q);setQuoteLoad(false);});
    if (new Date().getDay()===0) setShowReview(true);
  },[]);

  const toggleHabit = useCallback((id,date)=>{
    const dk=dateKey(date);
    setHabits(prev=>{
      const next={...prev,[dk]:{...(prev[dk]||{}),[id]:!(prev[dk]?.[id])}};
      lsSet("pos-habits",next); return next;
    });
  },[]);

  const setWaterCount = useCallback((date,n)=>{
    const dk=dateKey(date);
    setWater(prev=>{ const next={...prev,[dk]:n}; lsSet("pos-water",next); return next; });
  },[]);

  const logEnergy = useCallback((date,v)=>{
    const dk=dateKey(date);
    setEnergy(prev=>{ const next={...prev,[dk]:v}; lsSet("pos-energy",next); return next; });
  },[]);

  const addMetric = useCallback((entry)=>{
    setMetrics(prev=>{
      const next=[...prev.filter(m=>m.date!==entry.date),entry].sort((a,b)=>a.date.localeCompare(b.date));
      lsSet("pos-metrics",next); return next;
    });
  },[]);

  const dk        = dateKey(selDate);
  const isToday   = dk===todayKey();
  const isWed     = selDate.getDay()===3;
  const dayHabits = habits[dk]||{};
  const dayWater  = water[dk]||0;
  const dayEnergy = energy[dk]||0;
  const mealDay   = getMealDay(selDate);
  const habitScore= HABITS.reduce((a,h)=>a+(dayHabits[h.id]?1:0),0);
  const pct       = Math.round((habitScore/HABITS.length)*100);

  const C={bg:"#0d0d0c",surface:"#141413",card:"#1a1a18",border:"#252523",text:"#f0ede6",muted:"#66665f",subtle:"#252523"};
  const s={
    app:  {minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif",fontSize:14,paddingBottom:80},
    card: {background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",marginBottom:12},
    ch:   (accent)=>({padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:accent?accent+"11":C.surface}),
    row:  (last)=>({display:"flex",alignItems:"center",gap:12,padding:"11px 16px",borderBottom:last?"none":`1px solid ${C.border}`}),
    tag:  (c)=>({background:c+"22",color:c,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}),
    btn:  (active,c="#f59e0b")=>({background:active?c:C.subtle,color:active?"#000":C.muted,border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"}),
    iBtn: {background:C.subtle,border:"none",color:C.muted,borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"},
    inp:  {width:"100%",background:C.subtle,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:16,fontWeight:700,outline:"none",boxSizing:"border-box"},
  };

  return (
    <div style={s.app}>
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <div style={{fontWeight:800,fontSize:17,letterSpacing:-0.5}}>Personal<span style={{color:"#f59e0b"}}>OS</span><span style={{fontSize:9,color:"#10b981",marginLeft:6,fontWeight:400}}>● live</span></div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <button onClick={()=>{const d=new Date(selDate);d.setDate(d.getDate()-1);setSelDate(d);}} style={s.iBtn}>‹</button>
          <button onClick={()=>setSelDate(new Date())} style={{...s.iBtn,color:isToday?"#f59e0b":C.muted,fontSize:11,fontWeight:700,width:"auto",padding:"0 10px"}}>
            {isToday?"Today":formatDate(selDate)}
          </button>
          <button onClick={()=>{const d=new Date(selDate);d.setDate(d.getDate()+1);setSelDate(d);}} style={s.iBtn}>›</button>
        </div>
      </div>

      <div style={{display:"flex",gap:6,padding:"10px 16px 0",overflowX:"auto"}}>
        {[["today","📅","Today"],["meals","🍽","Meals"],["body","📏","Body"],["progress","📊","Progress"]].map(([id,icon,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={s.btn(tab===id)}>{icon} {label}</button>
        ))}
      </div>

      <div style={{padding:"12px 16px 0"}}>
        {tab==="today" && <TodayTab selDate={selDate} dayHabits={dayHabits} dayWater={dayWater} dayEnergy={dayEnergy} mealDay={mealDay} habitScore={habitScore} pct={pct} quarter={quarter} setQuarter={setQuarter} isToday={isToday} isWed={isWed} toggleHabit={toggleHabit} setWaterCount={setWaterCount} logEnergy={logEnergy} quote={quote} quoteLoad={quoteLoad} setTab={setTab} s={s} C={C}/>}
        {tab==="meals"    && <MealsTab s={s} C={C}/>}
        {tab==="body"     && <BodyTab metrics={metrics} onAdd={addMetric} s={s} C={C}/>}
        {tab==="progress" && <ProgressTab habits={habits} s={s} C={C}/>}
      </div>

      {showReview&&tab==="today"&&<SundayReview habits={habits} onClose={()=>setShowReview(false)} s={s} C={C}/>}
    </div>
  );
}

function TodayTab({selDate,dayHabits,dayWater,dayEnergy,mealDay,habitScore,pct,quarter,setQuarter,isToday,isWed,toggleHabit,setWaterCount,logEnergy,quote,quoteLoad,setTab,s,C}) {
  return <>
    <div style={{...s.card,background:"linear-gradient(135deg,#1a1610,#1a1a18)",border:"1px solid #3a3020"}}>
      <div style={{padding:"14px 16px"}}>
        {quoteLoad?<div style={{fontSize:12,color:"#555",fontStyle:"italic"}}>Getting your quote…</div>
        :quote&&<><div style={{fontSize:9,color:"#f59e0b",letterSpacing:2,fontWeight:700,marginBottom:8,textTransform:"uppercase"}}>{quote.theme} · Quote of the Day</div>
        <div style={{fontSize:15,color:"#e8d5a0",lineHeight:1.6,fontStyle:"italic",fontWeight:500}}>"{quote.quote}"</div></>}
      </div>
    </div>

    <div style={s.card}>
      <div style={{display:"flex"}}>
        <div style={{flex:1,padding:"14px 12px",borderRight:`1px solid ${C.border}`}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:2}}>TODAY</div>
          <div style={{fontSize:26,fontWeight:800,color:scoreColor(pct),lineHeight:1}}>{pct}%</div>
          <div style={{fontSize:10,color:C.muted,marginTop:1}}>{habitScore}/{HABITS.length} habits</div>
          <div style={{height:3,background:C.subtle,borderRadius:4,marginTop:6}}>
            <div style={{height:"100%",width:`${pct}%`,background:scoreColor(pct),borderRadius:4,transition:"width 0.4s"}}/>
          </div>
        </div>
        <div style={{flex:1,padding:"14px 12px",borderRight:`1px solid ${C.border}`}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:4}}>💧 WATER</div>
          <div style={{fontSize:20,fontWeight:800,color:dayWater>=8?"#3b82f6":C.text,lineHeight:1}}>{dayWater}<span style={{fontSize:11,color:C.muted,fontWeight:400}}>/10</span></div>
          <div style={{display:"flex",gap:3,marginTop:6,flexWrap:"wrap"}}>
            {Array.from({length:10},(_,i)=>(
              <button key={i} onClick={()=>setWaterCount(selDate,i<dayWater?i:i+1)} style={{width:11,height:11,borderRadius:"50%",border:"none",cursor:"pointer",background:i<dayWater?"#3b82f6":C.subtle,padding:0}}/>
            ))}
          </div>
        </div>
        <div style={{flex:1,padding:"14px 12px"}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:1}}>⚡ FEEL</div>
          <div style={{fontSize:9,color:"#444",marginBottom:3}}>Energy today?</div>
          <div style={{fontSize:20,fontWeight:800,color:dayEnergy?"#f59e0b":C.muted,lineHeight:1}}>{dayEnergy||"—"}{dayEnergy?<span style={{fontSize:10,color:C.muted,fontWeight:400}}>/5</span>:""}</div>
          <div style={{display:"flex",gap:4,marginTop:6}}>
            {[1,2,3,4,5].map(i=><button key={i} onClick={()=>logEnergy(selDate,i)} style={{width:13,height:13,borderRadius:3,border:"none",cursor:"pointer",background:i<=dayEnergy?"#f59e0b":C.subtle,padding:0}}/>)}
          </div>
        </div>
      </div>
    </div>

    {isWed&&isToday&&<button onClick={()=>setTab("body")} style={{width:"100%",background:"#f59e0b11",border:"1px solid #f59e0b44",borderRadius:12,padding:"10px 16px",color:"#f59e0b",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:12,textAlign:"left"}}>⚖️ Wednesday — Log your weigh-in →</button>}

    <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto"}}>
      {QUARTERS.map(q=><button key={q.id} onClick={()=>setQuarter(q.id)} style={{...s.btn(quarter===q.id,q.color),flex:"0 0 auto"}}>{q.icon} {q.label}</button>)}
    </div>

    {QUARTERS.filter(q=>q.id===quarter).map(q=>(
      <div key={q.id} style={s.card}>
        <div style={s.ch(q.color)}>
          <span style={{fontWeight:700,color:q.color,fontSize:14}}>{q.icon} {q.label}</span>
          <span style={{fontSize:11,color:C.muted}}>{q.items[0].time} – {q.items[q.items.length-1].time}</span>
        </div>
        {q.items.map((item,i)=>(
          <div key={i} style={s.row(i===q.items.length-1)}>
            <div style={{fontSize:11,color:C.muted,minWidth:58,fontVariantNumeric:"tabular-nums"}}>{item.time}</div>
            <div style={{fontSize:17}}>{item.icon}</div>
            <div style={{fontSize:13,color:"#c0bdb6",lineHeight:1.5}}>{item.task}</div>
          </div>
        ))}
      </div>
    ))}

    <div style={s.card}>
      <div style={s.ch(null)}>
        <span style={{fontWeight:700,fontSize:14}}>🍽 Today's Meals</span>
        <span style={s.tag("#10b981")}>{mealDay.weekLabel} · D{mealDay.dayNum}</span>
      </div>
      {[
        {time:"9:30 AM",label:"Breakfast",text:"Overnight oats · chia · flax · Greek yogurt · strawberries · walnuts · fruit",color:"#10b981"},
        {time:"2:00 PM",label:"Lunch",    text:mealDay.isSunday?"Flex Sunday — eat mindfully":mealDay.lunch,   color:"#3b82f6"},
        {time:"5:30 PM",label:"Snack",    text:mealDay.isSunday?"Flex Sunday":mealDay.snack,                   color:"#f59e0b"},
        {time:"8:00 PM",label:"Dinner",   text:mealDay.isSunday?"Flex Sunday — light home meal":mealDay.dinner,color:"#8b5cf6"},
      ].map((m,i,arr)=>(
        <div key={i} style={{display:"flex",gap:12,padding:"10px 16px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
          <div style={{fontSize:11,color:C.muted,minWidth:58,paddingTop:2,fontVariantNumeric:"tabular-nums"}}>{m.time}</div>
          <div style={{width:3,background:m.color,borderRadius:4,flexShrink:0,alignSelf:"stretch"}}/>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:m.color,marginBottom:2}}>{m.label}</div>
            <div style={{fontSize:12.5,color:"#999",lineHeight:1.5}}>{m.text}</div>
          </div>
        </div>
      ))}
    </div>

    <HabitCheckin dayHabits={dayHabits} onToggle={(id)=>toggleHabit(id,selDate)} s={s} C={C}/>
  </>;
}

function HabitCheckin({dayHabits,onToggle,s,C}) {
  const done=HABITS.filter(h=>dayHabits[h.id]);
  const todo=HABITS.filter(h=>!dayHabits[h.id]);
  const [showDone,setShowDone]=useState(false);
  return (
    <div style={s.card}>
      <div style={s.ch(null)}>
        <span style={{fontWeight:700,fontSize:14}}>✅ Habit Check-in</span>
        <span style={{fontSize:12,color:done.length===HABITS.length?"#10b981":C.muted,fontWeight:700}}>{done.length}/{HABITS.length}</span>
      </div>
      {todo.length===0&&<div style={{textAlign:"center",padding:"20px 16px",color:"#10b981",fontWeight:700,fontSize:15}}>🎉 Perfect day! All {HABITS.length} habits done.</div>}
      {todo.map(h=>(
        <div key={h.id} style={s.row(false)}>
          <button onClick={()=>onToggle(h.id)} style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${C.border}`,background:"transparent",cursor:"pointer",flexShrink:0,color:C.muted,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>○</button>
          <div style={{fontSize:20,flexShrink:0}}>{h.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600,color:C.text}}>{h.label}</div>
            <div style={{fontSize:11,color:C.muted}}>{h.desc}</div>
          </div>
        </div>
      ))}
      {done.length>0&&<>
        <button onClick={()=>setShowDone(v=>!v)} style={{width:"100%",background:"none",border:"none",color:C.muted,fontSize:12,padding:"10px 16px",cursor:"pointer",textAlign:"left",borderTop:`1px solid ${C.border}`}}>
          {showDone?"▾":"▸"} {done.length} completed
        </button>
        {showDone&&done.map((h,i)=>(
          <div key={h.id} style={{...s.row(i===done.length-1),opacity:0.5}}>
            <button onClick={()=>onToggle(h.id)} style={{width:28,height:28,borderRadius:"50%",border:"none",background:"#10b981",cursor:"pointer",flexShrink:0,color:"#fff",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✓</button>
            <div style={{fontSize:20,flexShrink:0}}>{h.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#10b981",textDecoration:"line-through"}}>{h.label}</div></div>
          </div>
        ))}
      </>}
    </div>
  );
}

function MealsTab({s,C}) {
  const [week,setWeek]=useState(0);
  const weeks=[WEEK1,WEEK2];
  const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  return <>
    <div style={{display:"flex",gap:6,marginBottom:12}}>
      {["Week 1","Week 2"].map((w,i)=><button key={i} onClick={()=>setWeek(i)} style={s.btn(week===i)}>{w}</button>)}
    </div>
    <div style={s.card}>
      <div style={s.ch(null)}><span style={{fontWeight:700,fontSize:14,color:"#f59e0b"}}>💊 Supplements — Every Day</span></div>
      {[["9:00 AM","Post-gym · Whey isolate 1 scoop + 300ml water"],["9:30 AM","Vit D3 · Neurobion · Biotin (with breakfast)"],["2:15 PM","Omega-3 (1 cap → 2 from week 3) after lunch"],["9:15 PM","Isabgol 1 tsp in water · Magnesium glycinate"]].map(([t,item],i,arr)=>(
        <div key={i} style={s.row(i===arr.length-1)}>
          <div style={{fontSize:11,color:"#f59e0b",minWidth:64,fontWeight:700}}>{t}</div>
          <div style={{fontSize:13,color:"#c0bdb6"}}>{item}</div>
        </div>
      ))}
    </div>
    <div style={{...s.card,background:"#10b98111",border:"1px solid #10b98133"}}>
      <div style={{padding:"12px 16px"}}>
        <div style={{fontSize:11,color:"#10b981",fontWeight:700,marginBottom:4}}>🔒 BREAKFAST — FIXED · 9:30 AM</div>
        <div style={{fontSize:13,color:"#10b981",lineHeight:1.8}}>Overnight oats 40g · Chia 1 tbsp · Flax 1 tbsp · Greek yogurt 100g · 5–6 strawberries · 4 walnuts · Apple or guava</div>
        <div style={{fontSize:11,color:"#10b98188",marginTop:6}}>~420 kcal · 22g protein · 18g fibre</div>
      </div>
    </div>
    {days.map((day,i)=>{
      const d=weeks[week][i];const isSun=i===6;const isWed=i===2;
      return (
        <div key={i} style={{...s.card,opacity:isSun?0.65:1}}>
          <div style={{...s.ch(null),background:C.surface}}>
            <span style={{fontWeight:700}}>{day}</span>
            <div style={{display:"flex",gap:6}}>
              {isWed&&<span style={s.tag("#f59e0b")}>⚖️ Weigh-in</span>}
              {isSun&&<span style={s.tag("#ef4444")}>Flex</span>}
            </div>
          </div>
          {isSun?<div style={{padding:"12px 16px",color:C.muted,fontSize:13,fontStyle:"italic"}}>Flex day — eat mindfully. One light indulgence OK. Back on plan Monday.</div>
          :[{label:"Lunch",text:d.lunch,color:"#3b82f6"},{label:"Snack",text:SNACKS[i],color:"#f59e0b"},{label:"Dinner",text:d.dinner,color:"#8b5cf6"}].map((m,j,arr)=>(
            <div key={j} style={{display:"flex",gap:10,padding:"10px 16px",borderBottom:j<arr.length-1?`1px solid ${C.border}`:"none"}}>
              <div style={{width:3,background:m.color,borderRadius:4,flexShrink:0}}/>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:m.color,marginBottom:3,letterSpacing:1}}>{m.label.toUpperCase()}</div>
                <div style={{fontSize:12.5,color:"#999",lineHeight:1.6}}>{m.text}</div>
              </div>
            </div>
          ))}
        </div>
      );
    })}
  </>;
}

function BodyTab({metrics,onAdd,s,C}) {
  const [weight,setWeight]=useState("");
  const [waist,setWaist]=useState("");
  const [bf,setBf]=useState("");
  const [saved,setSaved]=useState(false);
  const isWed=new Date().getDay()===3;
  function handleSave(){
    if(!weight)return;
    onAdd({date:dateKey(new Date()),weight:parseFloat(weight),waist:waist?parseFloat(waist):null,bf:bf?parseFloat(bf):null});
    setSaved(true);setTimeout(()=>setSaved(false),2500);
    setWeight("");setWaist("");setBf("");
  }
  const last8=metrics.slice(-8);
  return <>
    <div style={s.card}>
      <div style={s.ch(isWed?"#f59e0b":null)}>
        <span style={{fontWeight:700,fontSize:14}}>{isWed?"⚖️ Wednesday Weigh-In":"📏 Log Metrics"}</span>
        <span style={{fontSize:11,color:C.muted}}>{dateKey(new Date())}</span>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
          {[["Weight (kg)","75.6",weight,setWeight,0.1],["Waist (cm)","86",waist,setWaist,0.5],["Body Fat %","22",bf,setBf,0.1]].map(([label,ph,val,setter,step],i)=>(
            <div key={i}>
              <div style={{fontSize:10,color:C.muted,marginBottom:5}}>{label}{i>0&&<span style={{color:"#444"}}> opt</span>}</div>
              <input value={val} onChange={e=>setter(e.target.value)} type="number" step={step} placeholder={ph} style={s.inp}/>
            </div>
          ))}
        </div>
        <button onClick={handleSave} style={{width:"100%",background:saved?"#10b981":"#f59e0b",border:"none",borderRadius:10,padding:12,color:"#000",fontSize:14,fontWeight:800,cursor:"pointer",transition:"background 0.3s"}}>
          {saved?"✓ Saved!":"Save Entry"}
        </button>
        <div style={{fontSize:11,color:"#444",marginTop:8,textAlign:"center"}}>Every Wednesday · after bathroom · before food · Body Fat % monthly only</div>
      </div>
    </div>
    <div style={{...s.card,background:"#6366f111",border:"1px solid #6366f133"}}>
      <div style={{padding:"12px 16px"}}>
        <div style={{fontSize:11,color:"#818cf8",fontWeight:700,marginBottom:4}}>📌 BODY FAT % — LOG MONTHLY ONLY</div>
        <div style={{fontSize:12.5,color:"#818cf8aa",lineHeight:1.7}}>Xiaomi BIA swings with hydration — log on the 1st of each month only. Waist cm is your best weekly abs signal.</div>
      </div>
    </div>
    <div style={s.card}>
      <div style={s.ch(null)}><span style={{fontWeight:700,fontSize:14}}>🎯 12-Week Targets</span></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
        {[["Start Weight","78 kg"],["Target Weight","70 kg"],["Waist Now","~88 cm"],["Waist Target","~82 cm"],["Body Fat Goal","Sub 18%"],["Visceral Fat","10 → 7–8"]].map(([l,v],i,arr)=>(
          <div key={i} style={{padding:"12px 16px",borderRight:(i+1)%2!==0?`1px solid ${C.border}`:"none",borderBottom:i<arr.length-2?`1px solid ${C.border}`:"none"}}>
            <div style={{fontSize:10,color:C.muted,marginBottom:2}}>{l}</div>
            <div style={{fontSize:16,fontWeight:800}}>{v}</div>
          </div>
        ))}
      </div>
    </div>
    {last8.length>=2&&(
      <div style={s.card}>
        <div style={s.ch(null)}><span style={{fontWeight:700,fontSize:14}}>📈 Weight Trend</span></div>
        <div style={{padding:"14px 16px",display:"flex",alignItems:"flex-end",gap:6,height:100}}>
          {last8.map((m,i)=>{
            const min=Math.min(...last8.map(x=>x.weight));
            const max=Math.max(...last8.map(x=>x.weight));
            const h=20+((m.weight-min)/(max-min||1))*60;
            const imp=i>0&&m.weight<=last8[i-1].weight;
            return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <div style={{fontSize:9,color:imp?"#10b981":"#ef4444",fontWeight:700}}>{m.weight}</div>
              <div style={{width:"100%",height:h,background:imp?"#10b98144":"#ef444444",borderRadius:"4px 4px 0 0",border:`1px solid ${imp?"#10b981":"#ef4444"}`}}/>
              <div style={{fontSize:8,color:C.muted}}>{m.date.slice(5)}</div>
            </div>);
          })}
        </div>
      </div>
    )}
    {metrics.length>0&&(
      <div style={s.card}>
        <div style={s.ch(null)}><span style={{fontWeight:700,fontSize:14}}>📋 Log History</span></div>
        {metrics.slice().reverse().slice(0,10).map((m,i,arr)=>(
          <div key={i} style={s.row(i===arr.length-1)}>
            <div style={{fontSize:12,color:C.muted,flex:1}}>{m.date}</div>
            <div style={{fontWeight:700,minWidth:55}}>{m.weight} kg</div>
            {m.waist&&<div style={{fontSize:12,color:C.muted,minWidth:48}}>{m.waist} cm</div>}
            {m.bf&&<div style={{fontSize:12,color:"#818cf8"}}>{m.bf}%</div>}
          </div>
        ))}
      </div>
    )}
  </>;
}

function ProgressTab({habits,s,C}) {
  const [view,setView]=useState("weekly");
  const today=new Date();
  const days84=getLast84Days();
  const yearDays=getYearDays();
  const weekNum=getWeekNumber(today);
  const dayOfYear=Math.ceil((today-new Date(today.getFullYear(),0,1))/86400000);
  const yearPct=Math.round((dayOfYear/365)*100);
  const weeks=Array.from({length:12},(_,wi)=>Array.from({length:7},(_,di)=>{const d=new Date(today);d.setDate(today.getDate()-((11-wi)*7)-(6-di));return d;}));
  const weeklyData=weeks.map(wd=>({score:getWeekScore(habits,wd),weekNo:getWeekNumber(wd[3]),label:wd[0].toLocaleDateString("en-IN",{day:"numeric",month:"short"})+" – "+wd[6].toLocaleDateString("en-IN",{day:"numeric",month:"short"})}));
  const monthlyData=(()=>{const map={};days84.forEach(d=>{const mk=`${d.getFullYear()}-${pad(d.getMonth()+1)}`;const label=d.toLocaleDateString("en-IN",{month:"short",year:"2-digit"});if(!map[mk])map[mk]={label,score:0,max:0};const day=habits[dateKey(d)]||{};HABITS.forEach(h=>{if(day[h.id])map[mk].score++;map[mk].max++;});});return Object.values(map).map(m=>({...m,pct:m.max?Math.round((m.score/m.max)*100):0}));})();
  const habitBreakdown=HABITS.map(h=>{let score=0;for(let i=0;i<30;i++){const d=new Date(today);d.setDate(today.getDate()-i);if((habits[dateKey(d)]||{})[h.id])score++;}return{...h,score,pct:Math.round((score/30)*100)};});

  const Dot=({d,sz})=>{
    const day=habits[dateKey(d)]||{};
    const sc=HABITS.reduce((a,h)=>a+(day[h.id]?1:0),0);
    const p=Math.round((sc/HABITS.length)*100);
    const fut=d>today;const isT=dateKey(d)===todayKey();
    const bg=fut?"#1a1a18":sc===0?"#252523":scoreColor(p)+(p>=80?"ee":p>=60?"99":"55");
    return <div title={`${d.toDateString()}: ${sc}/${HABITS.length}`} style={{width:sz,height:sz,borderRadius:2,background:bg,border:isT?"1.5px solid #f59e0b":"1.5px solid transparent"}}/>;
  };

  return <>
    <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto"}}>
      {["weekly","monthly","habits","year"].map(v=><button key={v} onClick={()=>setView(v)} style={{...s.btn(view===v),flex:"0 0 auto"}}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>)}
    </div>
    <div style={s.card}>
      <div style={s.ch(null)}><span style={{fontWeight:700,fontSize:14}}>🔥 12-Week Streak</span></div>
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{days84.map((d,i)=><Dot key={i} d={d} sz={13}/>)}</div>
        <div style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
          <span style={{fontSize:10,color:C.muted}}>Less</span>
          {["#252523","#ef444455","#f9731688","#f59e0b99","#10b981ee"].map((c,i)=><div key={i} style={{width:11,height:11,borderRadius:2,background:c}}/>)}
          <span style={{fontSize:10,color:C.muted}}>More</span>
        </div>
      </div>
    </div>
    {view==="weekly"&&<div style={s.card}><div style={s.ch(null)}><span style={{fontWeight:700,fontSize:14}}>📊 Weekly Scores</span></div>{weeklyData.map(({score,weekNo,label},i,arr)=>(
      <div key={i} style={s.row(i===arr.length-1)}>
        <div style={{fontSize:11,color:"#f59e0b",fontWeight:800,minWidth:26}}>W{weekNo}</div>
        <div style={{fontSize:11,color:C.muted,minWidth:88}}>{label}</div>
        <div style={{flex:1,height:6,background:C.subtle,borderRadius:4}}><div style={{width:`${score}%`,height:"100%",background:scoreColor(score),borderRadius:4,transition:"width 0.4s"}}/></div>
        <div style={{fontSize:12,fontWeight:700,color:scoreColor(score),minWidth:34,textAlign:"right"}}>{score}%</div>
      </div>
    ))}</div>}
    {view==="monthly"&&<div style={s.card}><div style={s.ch(null)}><span style={{fontWeight:700,fontSize:14}}>📅 Monthly Overview</span></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr"}}>{monthlyData.map((m,i,arr)=>(<div key={i} style={{padding:"14px 12px",borderRight:(i+1)%3!==0?`1px solid ${C.border}`:"none",borderBottom:i<arr.length-3?`1px solid ${C.border}`:"none",textAlign:"center"}}><div style={{fontSize:11,color:C.muted,marginBottom:4}}>{m.label}</div><div style={{fontSize:22,fontWeight:800,color:scoreColor(m.pct)}}>{m.pct}%</div></div>))}</div></div>}
    {view==="habits"&&<div style={s.card}><div style={s.ch(null)}><span style={{fontWeight:700,fontSize:14}}>🎯 Habit Breakdown — 30 Days</span></div>{habitBreakdown.map((h,i,arr)=>(<div key={h.id} style={s.row(i===arr.length-1)}><div style={{fontSize:18,flexShrink:0}}>{h.icon}</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12.5,color:"#c0bdb6"}}>{h.label}</span><span style={{fontSize:11,fontWeight:700,color:scoreColor(h.pct)}}>{h.score}/30</span></div><div style={{height:4,background:C.subtle,borderRadius:4}}><div style={{width:`${h.pct}%`,height:"100%",background:scoreColor(h.pct),borderRadius:4,transition:"width 0.5s"}}/></div></div></div>))}</div>}
    {view==="year"&&<>
      <div style={s.card}><div style={{padding:"16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <div><div style={{fontSize:10,color:C.muted,marginBottom:2}}>{today.getFullYear()} PROGRESS</div><div style={{fontSize:24,fontWeight:800,color:"#f59e0b"}}>{yearPct}% <span style={{fontSize:13,color:C.muted,fontWeight:400}}>of year</span></div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:10,color:C.muted,marginBottom:2}}>CURRENT WEEK</div><div style={{fontSize:24,fontWeight:800,color:"#10b981"}}>W{weekNum}<span style={{fontSize:13,color:C.muted,fontWeight:400}}>/52</span></div></div>
        </div>
        <div style={{height:6,background:C.subtle,borderRadius:4,marginBottom:6}}><div style={{width:`${yearPct}%`,height:"100%",background:"linear-gradient(90deg,#f59e0b,#10b981)",borderRadius:4}}/></div>
        <div style={{fontSize:11,color:C.muted}}>{dayOfYear} of 365 days · {365-dayOfYear} days remaining</div>
      </div></div>
      <div style={s.card}><div style={s.ch(null)}><span style={{fontWeight:700,fontSize:14}}>📆 {today.getFullYear()} — Full Year</span></div>
        <div style={{padding:"14px 16px"}}>
          <div style={{display:"flex",marginBottom:6}}>{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i)=><div key={i} style={{flex:1,fontSize:8,color:C.muted,textAlign:"center"}}>{m}</div>)}</div>
          <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>{yearDays.map((d,i)=><Dot key={i} d={d} sz={8}/>)}</div>
          <div style={{display:"flex",gap:8,marginTop:10,alignItems:"center"}}><span style={{fontSize:10,color:C.muted}}>Less</span>{["#252523","#ef444455","#f9731688","#f59e0b99","#10b981ee"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:2,background:c}}/>)}<span style={{fontSize:10,color:C.muted}}>More</span></div>
        </div>
      </div>
    </>}
  </>;
}

function SundayReview({habits,onClose,s,C}) {
  const today=new Date();
  const weekDays=Array.from({length:7},(_,i)=>{const d=new Date(today);d.setDate(today.getDate()-6+i);return d;});
  const score=getWeekScore(habits,weekDays);
  const wn=getWeekNumber(today);
  const worst=HABITS.map(h=>({...h,count:weekDays.filter(d=>(habits[dateKey(d)]||{})[h.id]).length})).sort((a,b)=>a.count-b.count)[0];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:100,display:"flex",alignItems:"flex-end"}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:"20px 20px 0 0",padding:"24px 20px 48px",width:"100%"}}>
        <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:6}}>WEEK {wn} REVIEW</div>
        <div style={{fontSize:24,fontWeight:800,marginBottom:4}}>This week: <span style={{color:scoreColor(score)}}>{score}%</span></div>
        <div style={{fontSize:13,color:C.muted,marginBottom:20}}>{score>=80?"Excellent week. Momentum is building.":score>=60?"Solid effort. One more gear this week.":"Tough week. Full reset — go again."}</div>
        {worst&&<div style={{background:C.surface,borderRadius:10,padding:"12px 14px",marginBottom:16}}>
          <div style={{fontSize:10,color:"#ef4444",fontWeight:700,letterSpacing:1,marginBottom:4}}>FOCUS HABIT THIS WEEK</div>
          <div style={{fontSize:15,fontWeight:700}}>{worst.icon} {worst.label}</div>
          <div style={{fontSize:12,color:C.muted,marginTop:2}}>Done {worst.count}/7 days last week · anchor on this one first</div>
        </div>}
        <button onClick={onClose} style={{width:"100%",background:"#f59e0b",border:"none",borderRadius:10,padding:14,color:"#000",fontWeight:800,fontSize:15,cursor:"pointer"}}>Start Week {wn+1} Strong →</button>
      </div>
    </div>
  );
}
