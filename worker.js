const API = "https://api.api-ninjas.com/v1";
const CORS = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{...CORS,"Content-Type":"application/json; charset=utf-8"}});
const ALLOWED=new Set(["superlig","epl","laliga","bundesliga","seriea","ligue1","ucl","uel","uecl","eredivisie","primeiraliga","scottishpremiership","belgianproleague","greeksuperleague"]);
async function upstream(path,env){
 if(!env.API_NINJAS_KEY) throw new Error("Cloudflare Secret API_NINJAS_KEY tanımlı değil.");
 const r=await fetch(API+path,{headers:{"X-Api-Key":env.API_NINJAS_KEY}});
 const body=await r.text();let data;try{data=JSON.parse(body)}catch{data={raw:body}}
 if(!r.ok)throw new Error(data.error||data.message||`API Ninjas HTTP ${r.status}`);
 return data;
}
function getId(t){return typeof t==="string"?t:t?.team_id||t?.id||""}
function getName(t){return typeof t==="string"?t:t?.name||"Bilinmeyen takım"}
function teamStats(matches,teamId){
 const done=(Array.isArray(matches)?matches:[]).filter(m=>m.status==="final"||m.status==="completed").sort((a,b)=>new Date(b.start_time||b.date)-new Date(a.start_time||a.date)).slice(0,5);
 let gf=0,ga=0,w=0,d=0,l=0;
 for(const m of done){const home=getId(m.home_team)===teamId;const ours=Number(home?m.home_score:m.away_score),theirs=Number(home?m.away_score:m.home_score);if(!Number.isFinite(ours)||!Number.isFinite(theirs))continue;gf+=ours;ga+=theirs;if(ours>theirs)w++;else if(ours===theirs)d++;else l++;}
 return {played:done.length,gf,ga,w,d,l,record:`${w}G ${d}B ${l}M`,matches:done};
}
export default {
 async fetch(request,env){
  if(request.method==="OPTIONS")return new Response(null,{headers:CORS});
  const u=new URL(request.url),p=u.pathname;
  try{
   if(p==="/health")return json({ok:true,provider:"API Ninjas Football API",freeTier:true});
   if(p==="/leagues")return json({leagues:[...ALLOWED].map(code=>({code}))});
   if(p==="/matches"){
    const league=u.searchParams.get("league")||"superlig",date=u.searchParams.get("date");
    if(!ALLOWED.has(league))return json({error:"Desteklenmeyen lig."},400);
    const q=new URLSearchParams({league});if(date)q.set("date",date);
    const data=await upstream("/soccermatches?"+q,env);
    return json({matches:Array.isArray(data)?data:[],count:Array.isArray(data)?data.length:0,provider:"API Ninjas"});
   }
   if(p==="/standings"){
    const league=u.searchParams.get("league")||"superlig";if(!ALLOWED.has(league))return json({error:"Desteklenmeyen lig."},400);
    const data=await upstream("/soccerstandings?"+new URLSearchParams({league}),env);
    return json({standings:Array.isArray(data)?data:[]});
   }
   if(p==="/teams"){
    const league=u.searchParams.get("league")||"superlig";if(!ALLOWED.has(league))return json({error:"Desteklenmeyen lig."},400);
    const data=await upstream("/soccerclubs?"+new URLSearchParams({league}),env);
    return json({teams:Array.isArray(data)?data:[]});
   }
   if(p==="/squad"){
    const league=u.searchParams.get("league"),team=u.searchParams.get("team");
    if(!league||!ALLOWED.has(league)||!team)return json({error:"league ve team gerekli."},400);
    const data=await upstream("/soccerplayers?"+new URLSearchParams({league,team}),env);
    return json({players:Array.isArray(data)?data:[]});
   }
   if(p==="/compare"){
    const league=u.searchParams.get("league")||"superlig",home=u.searchParams.get("home_team"),away=u.searchParams.get("away_team");
    if(!ALLOWED.has(league)||!home||!away)return json({error:"league, home_team ve away_team gerekli."},400);
    const [hm,am]=await Promise.all([
      upstream("/soccermatches?"+new URLSearchParams({team:home}),env),
      upstream("/soccermatches?"+new URLSearchParams({team:away}),env)
    ]);
    const hs=teamStats(hm,home),as=teamStats(am,away);
    const homeName=hs.matches[0]?(getId(hs.matches[0].home_team)===home?getName(hs.matches[0].home_team):getName(hs.matches[0].away_team)):home;
    const awayName=as.matches[0]?(getId(as.matches[0].home_team)===away?getName(as.matches[0].home_team):getName(as.matches[0].away_team)):away;
    const summary=`${homeName}: son ${hs.played} tamamlanan maçta ${hs.w} galibiyet, ${hs.d} beraberlik, ${hs.l} mağlubiyet; maç başı ${hs.played?(hs.gf/hs.played).toFixed(2):"—"} gol attı ve ${hs.played?(hs.ga/hs.played).toFixed(2):"—"} gol yedi. ${awayName}: son ${as.played} tamamlanan maçta ${as.w} galibiyet, ${as.d} beraberlik, ${as.l} mağlubiyet; maç başı ${as.played?(as.gf/as.played).toFixed(2):"—"} gol attı ve ${as.played?(as.ga/as.played).toFixed(2):"—"} gol yedi.`;
    return json({home:{name:homeName,...hs},away:{name:awayName,...as},summary});
   }
   return json({error:"Endpoint bulunamadı."},404);
  }catch(e){return json({error:e.message||"Beklenmeyen hata"},502);}
 }
};