import { getNav, buildPage } from "./shared.js";

export function renderMines() {
  var nav = getNav("mines");
  var gridHtml = "";
  for (var i = 0; i < 25; i++) {
    gridHtml += '<div id="mt' + i + '" style="aspect-ratio:1;background:#1a1a1a;border-radius:6px;display:flex;align-items:center;justify-content:center;border:1px solid #333"><div style="width:14px;height:14px;background:#444;border-radius:50%"></div></div>';
  }
  var html = '<div class="head"><div class="logo" style="color:#ffcc00;text-shadow:0 0 20px #ffcc00">⚡ L.F.K PREDICTOR ⚡</div><div class="tag" style="color:#ff3333">MINES INTELLIGENCE</div></div>';
  html += '<div class="card glow"><h3 class="ct" style="color:#ffcc00">⚡ 5x5 MINE GRID ⚡</h3><div id="mg" style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;background:#000;padding:15px;border-radius:10px;border:2px solid #ffcc00;margin-top:10px">' + gridHtml + '</div><p class="muted" style="margin-top:10px;text-align:center;color:#ffcc00">Click ANALYZE: Green=safe, Red=mine</p></div>';
  html += '<div class="card" style="border:1px solid #ffcc00"><label style="color:#ffcc00">SERVER SEED (Hashed OK)</label><input id="ss" placeholder="Paste server seed here" style="border:1px solid #ffcc00"></div>';
  html += '<div class="card" style="border:1px solid #ffcc00"><label style="color:#ffcc00">CLIENT SEED</label><input id="cs" placeholder="Paste client seed here" style="border:1px solid #ffcc00"></div>';
  html += '<div class="card" style="border:1px solid #ffcc00"><label style="color:#ffcc00">MINES (1-24)</label><input id="nm" type="number" min="1" max="24" value="3" style="border:1px solid #ffcc00"></div>';
  html += '<button class="btn" id="go" style="background:linear-gradient(135deg,#ffcc00,#ff8800);color:#000;box-shadow:0 0 30px #ffcc00">⚡ ANALYZE MINES ⚡</button>';
  html += '<div id="r"></div>';
  html += '<script>document.getElementById("go").addEventListener("click",async function(){var b=this;b.disabled=true;b.textContent="ANALYZING...";for(var i=0;i<25;i++){var t=document.getElementById("mt"+i);t.style.background="#1a1a1a";t.innerHTML="<div style=\"width:14px;height:14px;background:#444;border-radius:50%\"></div>";}var fd=new FormData();fd.append("server_seed",document.getElementById("ss").value);fd.append("client_seed",document.getElementById("cs").value);fd.append("num_mines",document.getElementById("nm").value);try{var r=await fetch("/api/mines",{method:"POST",body:fd});var d=await r.json();if(d.ok&&d.grid){for(var i=0;i<25;i++){var t=document.getElementById("mt"+i);if(d.minePositions.indexOf(i)!==-1){t.style.background="#330000";t.innerHTML="<div style=\"width:12px;height:12px;background:#ff0000;border-radius:50%;box-shadow:0 0 8px #ff0000\"></div>";}else{t.style.background="#003300";t.innerHTML="<div style=\"width:16px;height:16px;background:#00ff66;border-radius:50%;box-shadow:0 0 10px #00ff66\"></div>";}}document.getElementById("r").innerHTML="<div class=\"card glow\" style=\"border:2px solid #ffcc00\"><h3 class=\"ct\" style=\"color:#ffcc00\">"+d.confidence+"% CONFIDENCE</h3><p class=\"muted\" style=\"color:#00ff66\">GREEN = Safe to click</p><p class=\"muted\" style=\"color:#ff3333\">RED = DO NOT CLICK</p><button class=\"btn\" onclick=\"location.reload()\">NEW GAME</button></div>";}else{alert("Error: "+(d.error||"unknown"));}b.disabled=false;b.textContent="⚡ ANALYZE MINES ⚡";}catch(e){alert("Error: "+e.message);b.disabled=false;b.textContent="⚡ ANALYZE MINES ⚡";}});</script>';
  return buildPage("MINES", nav, html);
}
