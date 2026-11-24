// Cloudflare Worker: secure proxy for API-Football
// Add API_FOOTBALL_KEY as a Worker secret. Never put the provider key in GitHub or the PWA.
const API = "https://v3.football.api-sports.io";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8"
};
const json = (data, status=200) => new Response(JSON.stringify(data), {status, headers:cors});
const seasonDefault = () => new Date().getUTCFullYear();

async function provider(path, params, env) {
  if (!env.API_FOOTBALL_KEY) throw new Error("API_FOOTBALL_KEY secret is missing");
  const url = new URL(API + path);
  for (const [k,v] of Object.entries(params || {})) if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  const res = await fetch(url.toString(), {
    headers: {"x-apisports-key": env.API_FOOTBALL_KEY, "Accept":"application/json"}
  });
  const body = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(`Provider HTTP ${res.status}: ${JSON.stringify(body.errors || body.message || {})}`);
  if (body.errors && Object.keys(body.errors).length) throw new Error(JSON.stringify(body.errors));
  return body.response || [];
}
function currentSeason(seasons) {
  const year = seasonDefault();
  const active = (seasons || []).find(s => s.current);
  if (active) return active.year;
  const eligible = (seasons || []).map(s=>s.year).filter(y=>Number(y)<=year).sort((a,b)=>b-a);
  return eligible[0] || year;
}
export default {
 async fetch(request, env) {
  if (request.method === "OPTIONS") return new Response(null,{status:204,headers:cors});
  const u = new URL(request.url), p = u.pathname.replace(/\/+$/,"");
  try {
   if (p === "/health") {
    if (!env.API_FOOTBALL_KEY) return json({ok:false,provider:"API-Football",error:"API key secret not configured"},503);
    return json({ok:true,provider:"API-Football",message:"Backend is connected"});
   }
   if (p === "/leagues") {
    const country = u.searchParams.get("country") || "Turkey";
    const rows = await provider("/leagues",{country,season:u.searchParams.get("season") || seasonDefault()},env);
    return json(rows.map(x=>({id:x.league.id,name:x.league.name,country:x.country?.name || country,season:currentSeason(x.seasons),type:x.league.type,logo:x.league.logo,coverage:x.seasons?.find(s=>s.year===currentSeason(x.seasons))?.coverage || {}})));
   }
   if (p === "/teams") {
    const league = u.searchParams.get("league_id"), season = u.searchParams.get("season") || seasonDefault();
    if (!league) return json({error:"league_id is required"},400);
    const rows = await provider("/teams",{league,season},env);
    return json(rows.map(x=>({id:x.team.id,name:x.team.name,logo:x.team.logo,venue:x.venue?.name || null})));
   }
   if (p === "/fixtures") {
    const league = u.searchParams.get("league_id"), date = u.searchParams.get("date"), season = u.searchParams.get("season") || seasonDefault();
    if (!league) return json({error:"league_id is required"},400);
    const rows = await provider("/fixtures",{league,date:date || undefined,season},env);
    return json(rows.map(x=>({id:x.fixture.id,date:x.fixture.date,time:x.fixture.date,status:x.fixture.status?.short,elapsed:x.fixture.status?.elapsed,home_team:x.teams?.home?.name,home_id:x.teams?.home?.id,away_team:x.teams?.away?.name,away_id:x.teams?.away?.id,home_goals:x.goals?.home,away_goals:x.goals?.away,venue:x.fixture.venue?.name,referee:x.fixture.referee})));
   }
   if (p === "/compare") {
    const league = u.searchParams.get("league_id"), season = u.searchParams.get("season") || seasonDefault();
    const home = u.searchParams.get("home_team"), away = u.searchParams.get("away_team");
    if (!league || !home || !away) return json({error:"league_id, home_team and away_team IDs are required"},400);
    const [h,a] = await Promise.all([
      provider("/teams/statistics",{league,season,team:home},env),
      provider("/teams/statistics",{league,season,team:away},env)
    ]);
    return json({season,home:h[0] || null,away:a[0] || null,notice:"Team statistics are returned as supplied by API-Football. Fixture-specific lineups, injuries and odds are separate endpoints."});
   }
   const match = p.match(/^\/matches\/(\d+)\/(analysis|lineups|odds|injuries)$/);
   if (match) {
    const id=match[1], kind=match[2];
    if (kind==="lineups") return json(await provider("/fixtures/lineups",{fixture:id},env));
    if (kind==="odds") return json(await provider("/odds",{fixture:id},env));
    if (kind==="injuries") return json(await provider("/injuries",{fixture:id},env));
    const [fixture,stats,events]=await Promise.all([
      provider("/fixtures",{id},env),
      provider("/fixtures/statistics",{fixture:id},env),
      provider("/fixtures/events",{fixture:id},env)
    ]);
    return json({fixture:fixture[0] || null,statistics:stats,events});
   }
   return json({error:"Not found",routes:["/health","/leagues?country=Turkey","/teams?league_id=...&season=2026","/fixtures?league_id=...&date=YYYY-MM-DD","/compare?league_id=...&home_team=ID&away_team=ID","/matches/{id}/analysis","/matches/{id}/lineups","/matches/{id}/odds","/matches/{id}/injuries"]},404);
  } catch(e) {
   return json({error:String(e.message || e)},502);
  }
 }
};