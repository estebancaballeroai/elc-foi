/* Bible Aventure Pixel LAB — original isolated pilot. ES5 syntax, Canvas 2D, no runtime dependency. */
(function () {
'use strict';
var $=function(id){return document.getElementById(id);};
var canvas=$('game'),ctx=canvas.getContext('2d'),T=32,W=27,H=19;
var STORAGE='bible-aventure-lab-noah-pixel-v1';
var cells=[],assets={},loaded=false,loadFailed=false,route=[],motion=null,held=null,heldAt=0;
var camera={x:0,y:0},player={x:3,y:15,dir:'down'},lastFrame=0,frameCount=0,lastFocus=null,toastTimer=null,saveTimer=null;
var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var background=document.createElement('canvas'),bg=background.getContext('2d'),decor=[],hintRoute=[],particles=[],soundEnabled=false,audio=null;
var exit={x:22,y:7},noah={x:20,y:8},sheep={x:24,y:9},chest={x:17,y:15};
var books=[
 {x:3,y:3,title:'Un homme appelé Noé',ref:'Genèse 6, 9–10',body:'La Bible présente Noé comme un homme juste. Il marche avec Dieu. Noé a trois fils : Sem, Cham et Japhet.'},
 {x:11,y:11,title:'Une arche pour protéger',ref:'Genèse 6, 14–21',body:'Dieu demande à Noé de construire une arche en bois. Il lui indique comment la préparer. Noé doit y faire entrer sa famille, des animaux et de la nourriture.'},
 {x:23,y:15,title:'Noé fait confiance',ref:'Genèse 6, 22',body:'Noé fait tout ce que Dieu lui demande. Il prépare l’arche en suivant ses instructions. Le récit dit : « C’est ainsi que fit Noé : il exécuta tout ce que Dieu lui avait ordonné. »'}
];
var progress={version:1,books:[],position:{x:3,y:15},complete:false};
function rand(x,y){var n=Math.sin(x*127.1+y*311.7+72)*43758.5453;return n-Math.floor(n);}
function openCell(x,y){if(x>1&&x<W-1&&y>0&&y<H-1)cells[y*W+x]=1;}
function line(x1,y1,x2,y2){var x,y;for(y=Math.min(y1,y2);y<=Math.max(y1,y2);y++)for(x=Math.min(x1,x2);x<=Math.max(x1,x2);x++)openCell(x,y);}
function room(x,y){line(x-1,y-1,x+1,y+1);}
for(var i=0;i<W*H;i++)cells[i]=0;
line(3,3,3,15);line(3,3,15,3);line(9,3,9,9);line(5,9,17,9);line(5,9,5,15);line(3,15,11,15);line(11,11,11,15);line(9,11,17,11);line(15,3,15,7);line(15,7,23,7);line(17,7,17,15);line(17,15,23,15);line(23,7,23,15);line(9,9,9,11);
[books[0],books[1],books[2],{x:3,y:15},chest,{x:22,y:8}].forEach(function(p){room(p.x,p.y);});
line(19,7,25,9); // The ark clearing and animal glade.
function pass(x,y){return x>=0&&y>=0&&x<W&&y<H&&cells[y*W+x]===1;}
function seen(n){return progress.books.indexOf(n)!==-1;}
function validRecord(v){return v&&typeof v==='object'&&!Array.isArray(v);}
var readFailed=false;
try{
 var saved=JSON.parse(localStorage.getItem(STORAGE)||'null');
 if(validRecord(saved)&&saved.version===1){
  progress.books=Array.isArray(saved.books)?saved.books.filter(function(v,n,a){return typeof v==='number'&&v>=0&&v<3&&v%1===0&&a.indexOf(v)===n;}):[];
  progress.complete=saved.complete===true&&progress.books.length===3;
  if(validRecord(saved.position)&&saved.position.x%1===0&&saved.position.y%1===0&&pass(saved.position.x,saved.position.y))progress.position={x:saved.position.x,y:saved.position.y};
 }
}catch(e){readFailed=true;}
player.x=progress.position.x;player.y=progress.position.y;
function save(){
 if(saveTimer){clearTimeout(saveTimer);saveTimer=null;}
 progress.position={x:player.x,y:player.y};
 try{localStorage.setItem(STORAGE,JSON.stringify(progress));$('saveStatus').hidden=true;return true;}
 catch(e){$('saveStatus').hidden=false;return false;}
}
function queueSave(){if(!saveTimer)saveTimer=setTimeout(save,350);}
$('retry').onclick=save;
function toast(s){$('toast').textContent=s;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(function(){$('toast').hidden=true;},3500);}
function sound(){if(!soundEnabled)return;try{var C=window.AudioContext||window.webkitAudioContext;if(!C)return;if(!audio)audio=new C();if(audio.state==='suspended')audio.resume();[523.25,659.25,783.99].forEach(function(f,n){var o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+n*.09;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.06,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+.32);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.33);});}catch(e){toast('Le son n’est pas disponible sur cet appareil.');}}
$('sound').onclick=function(){soundEnabled=!soundEnabled;this.setAttribute('aria-pressed',String(soundEnabled));this.textContent='Son : '+(soundEnabled?'oui':'non');if(soundEnabled)sound();};
function update(){
 $('count').textContent=progress.books.length+' / 3';
 books.forEach(function(b,n){$('entry'+n).textContent=(seen(n)?'✓ ':'')+b.title;$('entry'+n).className=seen(n)?'found':'';});
 $('mission').textContent=progress.complete?'Bravo ! Ton souvenir est dans le carnet.':progress.books.length===3?'Rejoins Noé devant l’arche.':'Trouve les trois livres du jardin.';
 if(progress.complete){$('rewardTitle').textContent='Médaille du bâtisseur obtenue';$('rewardText').textContent='Trois livres découverts et un récit à raconter !';}
}
function closeDialog(){if($('overlay').hidden)return;$('overlay').hidden=true;document.body.classList.remove('modal-open');if(lastFocus&&lastFocus.focus)lastFocus.focus();else canvas.focus();}
function dialog(title,ref,body,art){
 route=[];held=null;lastFocus=document.activeElement;$('dialogTitle').textContent=title;$('dialogRef').textContent=ref;$('dialogBody').innerHTML=body;$('dialogArt').src='assets/'+(art||'book')+'.png';$('choices').innerHTML='';$('feedback').textContent='';$('continue').textContent='Continuer l’exploration';$('continue').onclick=closeDialog;$('overlay').hidden=false;document.body.classList.add('modal-open');$('close').focus();
}
$('close').onclick=closeDialog;
$('overlay').addEventListener('keydown',function(e){if(e.key==='Escape'){closeDialog();return;}if(e.key!=='Tab')return;var f=this.querySelectorAll('button:not([disabled]),a[href]'),first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
function sparkle(x,y){if(reduced)return;for(var n=0;n<16;n++)particles.push({x:x*T+T/2,y:y*T+T/2,vx:(rand(n,x)-.5)*1.8,vy:-rand(n,y)*1.4-.3,life:1});}
function book(n){
 var isNew=!seen(n);if(isNew){progress.books.push(n);save();update();sound();sparkle(books[n].x,books[n].y);}
 dialog(books[n].title,books[n].ref+' · Livre '+(n+1)+' / 3','<p>'+books[n].body+'</p><p class="note">Texte adapté du récit biblique. Le jardin et les livres cachés sont des éléments imaginés pour le jeu.</p>');
}
function distance(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);}
function finish(){
 if(progress.books.length<3){dialog('L’arche se prépare','NOÉ · LE CHANTIER DE L’ARCHE','<p>Bonjour, petit explorateur ! Cherche les trois livres du jardin. Ils te raconteront pourquoi je prépare cette grande arche.</p><p>Tu peux utiliser « Un indice » si tu cherches ton chemin.</p>','noah');return;}
 if(progress.complete){celebrate();return;}
 dialog('Te souviens-tu de l’histoire ?','GENÈSE 6, 22 · LA DÉCOUVERTE FINALE','<p>Que fait Noé quand Dieu lui demande de construire l’arche ?</p>','noah');
 ['Il fait ce que Dieu lui demande.','Il oublie de préparer l’arche.','Il part construire un palais.'].forEach(function(label,n){var b=document.createElement('button');b.textContent=label;b.onclick=function(){if(n===0){complete();}else{$('feedback').textContent='Le récit dit que Noé suit les instructions de Dieu. Tu peux réessayer ou lire la réponse.';$('continue').textContent='Lire la réponse et terminer';$('continue').onclick=complete;}};$('choices').appendChild(b);});
 $('continue').textContent='Revenir au jardin';
}
function complete(){progress.complete=true;save();update();sound();sparkle(exit.x,exit.y);celebrate();}
function celebrate(){dialog('Le souvenir du bâtisseur','CHAPITRE TERMINÉ · MÉDAILLE OBTENUE','<p>Bravo ! Tu as découvert les trois livres. Noé a fait confiance à Dieu et a préparé l’arche selon ses instructions.</p><p>Raconte avec tes mots : qui est Noé ? À quoi sert l’arche ?</p><p>Tu peux continuer à explorer et relire tes découvertes.</p>','chest');}
function interact(){
 if(!loaded||!$('overlay').hidden||motion)return;
 for(var n=0;n<books.length;n++)if(distance(player,books[n])<=1){book(n);return;}
 if(distance(player,exit)<=2||distance(player,noah)<=1){finish();return;}
 if(distance(player,sheep)<=2){dialog('Les animaux de l’arche','GENÈSE 6, 19–20','<p>Dieu demande à Noé de faire entrer des animaux dans l’arche pour les garder en vie. Les moutons de ce jardin illustrent ce passage.</p>','sheep');return;}
 if(distance(player,chest)<=1){if(progress.complete)celebrate();else dialog('Un souvenir t’attend','LE COFFRE DU BÂTISSEUR','<p>Découvre les trois livres, puis rejoins Noé devant l’arche. Tu gagneras la médaille du bâtisseur.</p>','chest');return;}
 toast('Approche-toi d’un livre, d’un animal ou de Noé.');
}
$('interact').onclick=interact;
$('library').onclick=function(){
 dialog('Mon carnet de Noé','MES LIVRES · '+progress.books.length+' / 3','<p>Choisis un livre découvert pour le relire.</p>');
 books.forEach(function(b,n){var button=document.createElement('button');button.textContent=(seen(n)?'Relire : ':'À découvrir : ')+b.title;button.disabled=!seen(n);button.onclick=function(){book(n);};$('choices').appendChild(button);});
};
function help(){dialog('À toi d’explorer !','LE JARDIN DES CÈDRES','<p>Utilise les grandes flèches pour marcher. Tu peux aussi toucher un chemin : l’explorateur s’y rend tout seul.</p><p>Approche-toi d’un livre pour le découvrir. Le bouton A ou la touche Espace permet de parler à Noé et d’observer.</p><p>Trois livres sont cachés : près des cèdres au nord-ouest, dans la clairière au centre et au bout du sentier au sud-est. Puis rejoins l’arche au nord-est.</p><p>« Un indice » trace le chemin vers ta prochaine découverte. Il n’y a ni chronomètre ni danger.</p>');}
$('help').onclick=help;
function pathTo(start,end){
 if(!pass(end.x,end.y))return null;var visited={},q=[{x:start.x,y:start.y}],head=0,prev={},k=start.y*W+start.x;visited[k]=true;
 while(head<q.length){var p=q[head++],pk=p.y*W+p.x;if(p.x===end.x&&p.y===end.y){var result=[];while(pk!==k){result.unshift({x:pk%W,y:Math.floor(pk/W)});pk=prev[pk];}return result;}
  [[0,-1],[1,0],[0,1],[-1,0]].forEach(function(d){var x=p.x+d[0],y=p.y+d[1],nk=y*W+x;if(pass(x,y)&&!visited[nk]){visited[nk]=true;prev[nk]=pk;q.push({x:x,y:y});}});
 }return null;
}
$('hint').onclick=function(){
 var targets=books.filter(function(b,n){return !seen(n);});if(!targets.length)targets=[exit];var candidates=targets.map(function(b){return {target:b,path:pathTo(player,b)};}).filter(function(v){return v.path!==null;});candidates.sort(function(a,b){return a.path.length-b.path.length;});
 if(candidates.length){hintRoute=candidates[0].path;toast('Suis les petites lumières : '+(candidates[0].target.title||'l’arche de Noé')+'.');}
};
var vectors={up:[0,-1],left:[-1,0],right:[1,0],down:[0,1]};
function step(dir,fromRoute){
 if(!loaded||motion||!$('overlay').hidden)return false;var d=vectors[dir];if(!d)return false;player.dir=dir;var nx=player.x+d[0],ny=player.y+d[1];if(!pass(nx,ny)){if(!fromRoute)route=[];return false;}
 motion={fromX:player.x,fromY:player.y,toX:nx,toY:ny,start:performance.now(),duration:reduced?65:170};return true;
}
function arrive(){
 player.x=motion.toX;player.y=motion.toY;motion=null;queueSave();
 $('area').textContent=player.x>18&&player.y<11?'Le chantier de l’arche':player.x>14?'Le sentier des animaux':'Le jardin des cèdres';
 for(var n=0;n<books.length;n++)if(player.x===books[n].x&&player.y===books[n].y&&!seen(n)){route=[];book(n);return;}
 resize();
 if(player.x===exit.x&&player.y===exit.y){route=[];finish();}
}
function stopHeld(){held=null;Array.prototype.forEach.call(document.querySelectorAll('[data-dir]'),function(b){b.classList.remove('pressed');});}
// Touch + mouse fallback also works when Pointer Events are absent (older Android WebViews).
Array.prototype.forEach.call(document.querySelectorAll('[data-dir]'),function(b){
 function begin(e){e.preventDefault();route=[];held=b.getAttribute('data-dir');heldAt=performance.now();b.classList.add('pressed');step(held,false);}
 if(window.PointerEvent){b.addEventListener('pointerdown',function(e){begin(e);if(b.setPointerCapture)b.setPointerCapture(e.pointerId);});b.addEventListener('pointerup',stopHeld);b.addEventListener('pointercancel',stopHeld);b.addEventListener('lostpointercapture',stopHeld);}
 else{b.addEventListener('touchstart',begin,{passive:false});b.addEventListener('touchend',stopHeld);b.addEventListener('touchcancel',stopHeld);b.addEventListener('mousedown',begin);}
});
document.addEventListener('mouseup',stopHeld);window.addEventListener('blur',function(){stopHeld();route=[];save();});
var keys={ArrowUp:'up',ArrowLeft:'left',ArrowRight:'right',ArrowDown:'down',z:'up',w:'up',q:'left',a:'left',s:'down',d:'right'};
document.addEventListener('keydown',function(e){if(!$('overlay').hidden)return;if(e.target.tagName==='BUTTON'&&(e.key===' '||e.key==='Enter'))return;var dir=keys[e.key];if(dir){e.preventDefault();route=[];held=dir;heldAt=performance.now();step(dir,false);}else if(e.key===' '||e.key==='e'){e.preventDefault();interact();}});
document.addEventListener('keyup',function(e){if(keys[e.key])stopHeld();});
function clickPath(e){
 if(!loaded||!$('overlay').hidden)return;var rect=canvas.getBoundingClientRect(),touch=e.changedTouches?e.changedTouches[0]:e;
 var x=Math.floor(((touch.clientX-rect.left)*canvas.width/rect.width+camera.x)/T),y=Math.floor(((touch.clientY-rect.top)*canvas.height/rect.height+camera.y)/T);
 if(!pass(x,y)){toast('Touche un chemin clair pour avancer.');return;}
 if(x===player.x&&y===player.y){interact();return;}
 route=pathTo(motion?{x:motion.toX,y:motion.toY}:player,{x:x,y:y})||[];held=null;
}
canvas.addEventListener('click',clickPath);
canvas.addEventListener('touchend',function(e){e.preventDefault();clickPath(e);},{passive:false});
function resize(){var r=canvas.getBoundingClientRect(),nearArk=player.x>=18&&player.y<11,scale=nearArk&&r.width<600?.95:1.55;var w=Math.max(180,Math.min(760,Math.round(r.width/scale))),h=Math.max(200,Math.round(r.height/scale));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}ctx.imageSmoothingEnabled=false;}
window.addEventListener('resize',resize);
document.addEventListener('visibilitychange',function(){if(document.hidden){stopHeld();route=[];save();}});
window.addEventListener('pagehide',save);
function sprite(c,name,x,y,w,h){var im=assets[name];if(!im)return;c.drawImage(im,Math.round(x),Math.round(y),w||im.width,h||im.height);}
function ground(){
 background.width=W*T;background.height=H*T;bg.imageSmoothingEnabled=false;
 for(var y=0;y<H;y++)for(var x=0;x<W;x++){
  var walk=pass(x,y);var terrain=x<2?'water':walk?'sand':'grass';bg.drawImage(assets[terrain],(x%3)*T,(y%3)*T,T,T,x*T,y*T,T,T);
  for(var n=0;n<8;n++){var sx=Math.floor(rand(x*29+n,y)*T),sy=Math.floor(rand(x,y*31+n)*T);bg.fillStyle=x<2?(n%2?'#69b8b8':'#266c79'):walk?['#e7cc91','#c5a56a','#f0d59b'][n%3]:['#78934f','#477548','#8d9e5c'][n%3];bg.fillRect(x*T+sx,y*T+sy,n%3===0?3:1,n%4===0?2:1);}
  if(walk){for(var edge=0;edge<4;edge++){var d=[[0,-1],[1,0],[0,1],[-1,0]][edge];if(!pass(x+d[0],y+d[1])){bg.fillStyle='#9e9c5b';if(edge===0)bg.fillRect(x*T,y*T,T,3);if(edge===2)bg.fillRect(x*T,y*T+T-3,T,3);if(edge===1)bg.fillRect(x*T+T-3,y*T,3,T);if(edge===3)bg.fillRect(x*T,y*T,3,T);}}}
  if(!walk&&x>1&&!(x>=18&&y<7)){
   var r=rand(x,y),near=pass(x-1,y)||pass(x+1,y)||pass(x,y-1)||pass(x,y+1);
   if(r>.2){var name=near?(r>.62?'flowers':r>.44?'boulder':'cedar'):(r>.35?'cedar':'flowers');var size=.86+rand(y,x)*.25;var width=Math.round((name==='cedar'?44:name==='boulder'?30:27)*size);var height=Math.round((name==='cedar'?54:name==='boulder'?30:27)*size);decor.push({name:name,x:x*T+16+Math.round((rand(x+8,y)-.5)*5),y:y*T+29,w:width,h:height});}
  }
 }
 // Irregular grass pixels soften the grid without changing reliable collisions.
 for(var gy=1;gy<H-1;gy++)for(var gx=2;gx<W-1;gx++)if(pass(gx,gy)){
  [[0,-1],[1,0],[0,1],[-1,0]].forEach(function(d){if(!pass(gx+d[0],gy+d[1]))for(var j=0;j<12;j++){var offset=Math.floor(rand(gx+j,gy+3)*T),depth=1+Math.floor(rand(gy+j,gx)*3);bg.fillStyle=j%2?'#6d8b4d':'#8a9d5a';if(d[0]===0)bg.fillRect(gx*T+offset,gy*T+(d[1]<0?0:T-depth),2,depth);else bg.fillRect(gx*T+(d[0]<0?0:T-depth),gy*T+offset,depth,2);}});
 }
 // A contact shadow under each tree anchors the sprite in the meadow.
 decor.forEach(function(o){if(o.name==='cedar'){bg.fillStyle='#254d3c35';bg.fillRect(o.x-14,o.y-4,29,6);bg.fillRect(o.x-10,o.y+2,23,3);}});
 // Scattered riverbank rocks break the straight water boundary.
 for(var ry=0;ry<H;ry++){if(ry>=14&&ry<=16)continue;sprite(bg,'boulder',T*2-12,ry*T+11,20,21);}
 // Wood bridge at the river, a purely scenic border landmark.
 bg.fillStyle='#5c4e35';bg.fillRect(0,15*T-5,3*T,38);for(var k=0;k<8;k++){bg.drawImage(assets.planks,(k%3)*24,0,24,64,k*12,15*T-3,11,32);bg.fillStyle='#e0b56c';bg.fillRect(k*12,15*T-3,10,2);}
 // The ark occupies its own non-walkable background, ramp ends at the clearing.
 for(var ay=0;ay<7;ay++)for(var ax=18;ax<27;ax++)bg.drawImage(assets.grass,(ax%3)*T,(ay%3)*T,T,T,ax*T,ay*T,T,T);for(var z=0;z<280;z++){bg.fillStyle=z%2?'#8b9e62':'#657e4d';bg.fillRect(18*T+Math.floor(rand(z,5)*9*T),Math.floor(rand(z,6)*7*T),2,1);}
 sprite(bg,'ark',exit.x*T+16-128,exit.y*T+22-194,256,194);
}
function draw(time){
 var px=player.x,py=player.y,walking=!!motion;
 if(motion){var f=Math.min(1,(time-motion.start)/motion.duration);px=motion.fromX+(motion.toX-motion.fromX)*f;py=motion.fromY+(motion.toY-motion.fromY)*f;if(f>=1)arrive();}
 // Keep the explorer above the touch controls, below the HUD.
 camera.x=Math.max(0,Math.min(W*T-canvas.width,px*T+16-canvas.width*(player.x>=18&&player.y<11?.64:.5)));camera.y=Math.max(0,Math.min(H*T-canvas.height,py*T+16-canvas.height*(player.x>=18&&player.y<11?.60:.43)));camera.x=Math.round(camera.x);camera.y=Math.round(camera.y);
 ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.translate(-camera.x,-camera.y);ctx.drawImage(background,0,0);
 var artTime=reduced?0:time;
 // Sparse water ripples, no shaders or compositing requirement.
 ctx.fillStyle='#9ed7ca';for(var n=0;n<35;n++){var yy=(n*43+artTime*.012)%(H*T);ctx.fillRect(8+Math.floor(rand(n,1)*44),Math.round(yy),4+n%5,1);}
 hintRoute.forEach(function(p,n){ctx.fillStyle=n%2?'#e7d78c':'#fff0ad';ctx.fillRect(p.x*T+14,p.y*T+14,4,3);});
 var objects=decor.slice();
 books.forEach(function(b,n){objects.push({name:'book',x:b.x*T+16,y:b.y*T+24,w:24,h:20,book:n});});
 objects.push({name:'noah',x:noah.x*T+16,y:noah.y*T+29,w:26,h:39});objects.push({name:'sheep',x:sheep.x*T+16,y:sheep.y*T+27,w:46,h:29});objects.push({name:'doves',x:8*T+16,y:9*T+30,w:32,h:25});objects.push({name:'chest',x:chest.x*T+16,y:chest.y*T+28,w:32,h:35});
 objects.push({name:'player',x:px*T+16,y:py*T+27,w:32,h:43});objects.sort(function(a,b){return a.y-b.y;});
 objects.forEach(function(o){
  if(o.x+o.w<camera.x||o.x-o.w>camera.x+canvas.width||o.y<camera.y||o.y-o.h>camera.y+canvas.height)return;
  if(o.book!==undefined){var done=seen(o.book);if(!done){ctx.fillStyle='#e4c16c66';ctx.fillRect(o.x-15,o.y-20,30,23);ctx.fillStyle='#fff0ab';var bob=reduced?0:Math.round(Math.sin(time/300+o.book)*2);ctx.fillRect(o.x-1,o.y-27+bob,3,5);ctx.fillRect(o.x-3,o.y-25+bob,7,1);}ctx.globalAlpha=done?.6:1;}
  if(o.name==='player'){
   ctx.fillStyle='#233d3655';ctx.fillRect(Math.round(o.x-8),Math.round(o.y-3),16,5);
   var row={down:0,left:1,right:2,up:3}[player.dir],col=walking&&!reduced?Math.floor(time/100)%4:1;
   ctx.drawImage(assets.explorer,col*48,row*64,48,64,Math.round(o.x-16),Math.round(o.y-40),32,43);
  }else sprite(ctx,o.name,o.x-o.w/2,o.y-o.h,o.w,o.h);
  ctx.globalAlpha=1;
 });
 // The landing marker communicates the exit through shape as well as color.
 ctx.fillStyle=progress.books.length===3?'#ffedac':'#37634c';var ex=exit.x*T+16,ey=exit.y*T+29;ctx.fillRect(ex-5,ey,10,2);ctx.fillRect(ex-3,ey-2,6,2);ctx.fillRect(ex-1,ey-4,2,2);
 if(!reduced){ctx.fillStyle='#fff2ba';for(var p=particles.length-1;p>=0;p--){var a=particles[p];a.x+=a.vx;a.y+=a.vy;a.life-=.02;ctx.globalAlpha=Math.max(0,a.life);ctx.fillRect(Math.round(a.x),Math.round(a.y),2,2);if(a.life<=0)particles.splice(p,1);}ctx.globalAlpha=1;for(var m=0;m<10;m++){var xx=rand(m,4)*W*T,yyy=rand(m,8)*H*T;ctx.fillStyle=(Math.sin(time/600+m)>0)?'#f6df8b99':'#f6df8b22';ctx.fillRect(Math.round(xx+Math.sin(time/1300+m)*5),Math.round(yyy),1,1);}}
 ctx.restore();frameCount++;
}
function tick(t){requestAnimationFrame(tick);if(!loaded||document.hidden||!$('overlay').hidden)return;if(t-lastFrame<32)return;lastFrame=t;
 if(!motion){if(held&&t-heldAt>95){step(held,false);heldAt=t;}else if(route.length){var next=route.shift(),dx=next.x-player.x,dy=next.y-player.y;if(Math.abs(dx)+Math.abs(dy)===1)step(dx>0?'right':dx<0?'left':dy>0?'down':'up',true);else route=[];}}
 draw(t);
}
var names=['cedar','flowers','boulder','ark','noah','sheep','book','doves','chest','explorer','grass','sand','water','planks'],remaining=names.length;
names.forEach(function(name){var im=new Image();assets[name]=im;im.onload=function(){remaining--;if(!remaining&&!loadFailed){loaded=true;ground();resize();update();draw(performance.now());if(readFailed)$('saveStatus').hidden=false;toast(progress.complete?'Ton souvenir est déjà dans le carnet. Bonne exploration !':'Bienvenue ! Cherche les trois livres lumineux.');}};im.onerror=function(){loadFailed=true;toast('Une image manque. Recharge la page pour réessayer.');$('mission').textContent='Images indisponibles. Recharge la page.';};im.src='assets/'+name+'.png';});
update();requestAnimationFrame(tick);
// Read-only diagnostics used by reproducible browser tests. No teleport, no completion shortcut.
window.NoahLab={snapshot:function(){return {ready:loaded,failed:loadFailed,player:{x:player.x,y:player.y,dir:player.dir},moving:!!motion,books:progress.books.slice(),complete:progress.complete,frames:frameCount,camera:{x:camera.x,y:camera.y},width:W,height:H,cells:cells.slice(),targets:books.map(function(b){return {x:b.x,y:b.y};}),exit:{x:exit.x,y:exit.y},storage:STORAGE,reduced:!!reduced};},path:function(x,y){return pathTo(player,{x:x,y:y});}};
}());
