/* Bible Aventure — Éden Pixel Art v2.5, cinq chapitres. ES5, Canvas 2D, zéro service distant. */
(function(){
'use strict';
var $=function(id){return document.getElementById(id);};
var cfg=window.PIXEL_CONFIG||{},C=window.PIXEL_CHAPTERS||[],images=window.PIXEL_IMAGES||{};if(!cfg.id||C.length!==5)throw Error('Story pack missing');document.body.dataset.world=cfg.id;
var STORAGE='bible-aventure-pixel-shared-v04-'+cfg.id,OLD_STORAGE='bible-aventure-pixel-shared-v03-'+cfg.id;
var canvas=$('game'),ctx=canvas.getContext('2d'),T=32,chapter=-1,W=0,H=0,cells=[],books=[],exit={x:0,y:0};
var assets={},assetNames=cfg.assetNames;
var loaded=false,loadFailed=false,background=document.createElement('canvas'),bg=background.getContext('2d'),decor=[];
var player={x:1,y:1,dir:'down'},camera={x:0,y:0},motion=null,route=[],hintRoute=[],held=null,heldAt=0,lastFrame=0,frames=0,particles=[],lastFocus=null,toastTimer=null,saveTimer=null;
var reduced=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches),soundOn=false,audio=null;
var defaults={version:2,selected:0,difficulty:'discovery',font:'large',light:false,avatar:cfg.avatars[0],levels:{}};
var data={version:2,selected:0,difficulty:'discovery',font:'large',light:false,avatar:cfg.avatars[0],levels:{}},storageError=false;
function object(x){return !!x&&typeof x==='object'&&!Array.isArray(x);}
function uniqueBooks(arr,n){if(!Array.isArray(arr))return [];return arr.filter(function(v,i){return typeof v==='number'&&v%1===0&&v>=0&&v<n&&arr.indexOf(v)===i;});}
try{var raw=localStorage.getItem(STORAGE)||localStorage.getItem(OLD_STORAGE);if(raw){var v=JSON.parse(raw);if(object(v)){data.selected=integer(v.selected,0,C.length-1)?v.selected:0;data.difficulty=v.difficulty==='adventure'?'adventure':'discovery';data.font=['normal','large','xlarge'].indexOf(v.font)!==-1?v.font:'large';data.light=v.light===true;data.avatar=cfg.avatars.indexOf(v.avatar)>=0?v.avatar:cfg.avatars[0];if(object(v.levels)){Object.keys(v.levels).forEach(function(k){var n=+k,z=v.levels[k];if(n>=0&&n<C.length&&n%1===0&&object(z))data.levels[k]={books:uniqueBooks(z.books,C[n].events.length),position:object(z.position)?{x:z.position.x,y:z.position.y}:null,complete:z.complete===true&&uniqueBooks(z.books,C[n].events.length).length===C[n].events.length};});}}}
}catch(e){storageError=true;}
function integer(v,a,b){return typeof v==='number'&&v%1===0&&v>=a&&v<=b;}
function level(){if(!data.levels[chapter])data.levels[chapter]={books:[],position:null,complete:false};return data.levels[chapter];}
function save(){if(saveTimer){clearTimeout(saveTimer);saveTimer=null;}if(chapter>=0){var z=level();z.position={x:player.x,y:player.y};}try{localStorage.setItem(STORAGE,JSON.stringify(data));storageError=false;$('saveStatus').hidden=true;return true;}catch(e){storageError=true;$('saveStatus').hidden=false;return false;}}
function queueSave(){if(!saveTimer)saveTimer=setTimeout(save,380);}
$('retry').onclick=save;
function toast(s){$('toast').textContent=s;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(function(){$('toast').hidden=true;},3100);}
function rng(seed){var s=seed>>>0;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function rand(x,y){var n=Math.sin(x*127.1+y*311.7+73.91)*43758.5453;return n-Math.floor(n);}
function pass(x,y){return x>=0&&y>=0&&x<W&&y<H&&cells[y*W+x]===1;}
function path(start,end){if(!pass(end.x,end.y))return null;var q=[{x:start.x,y:start.y}],head=0,prev={},seen={},a=start.y*W+start.x;seen[a]=true;
 while(head<q.length){var p=q[head++],k=p.y*W+p.x;if(p.x===end.x&&p.y===end.y){var z=[];while(k!==a){z.unshift({x:k%W,y:Math.floor(k/W)});k=prev[k];}return z;}
 [[0,-1],[1,0],[0,1],[-1,0]].forEach(function(d){var x=p.x+d[0],y=p.y+d[1],t=y*W+x;if(pass(x,y)&&!seen[t]){seen[t]=true;prev[t]=k;q.push({x:x,y:y});}});}
 return null;}
function generate(i){var spec=C[i],random=rng(spec.seed+(data.difficulty==='discovery'?19:71));W=spec.size[0];H=spec.size[1];cells=[];for(var k=0;k<W*H;k++)cells[k]=0;
 var stack=[{x:1,y:1}];cells[W+1]=1;while(stack.length){var top=stack[stack.length-1],options=[];[[2,0],[-2,0],[0,2],[0,-2]].forEach(function(d){var x=top.x+d[0],y=top.y+d[1];if(x>=1&&y>=1&&x<W-1&&y<H-1&&cells[y*W+x]===0)options.push({x:x,y:y,mx:top.x+d[0]/2,my:top.y+d[1]/2});});if(!options.length){stack.pop();continue;}var a=options[Math.floor(random()*options.length)];cells[a.my*W+a.mx]=1;cells[a.y*W+a.x]=1;stack.push({x:a.x,y:a.y});}
 // Le mode Découverte ouvre davantage de passages ; aucune destination n'est sacrifiée.
 for(var y=1;y<H-1;y++)for(var x=1;x<W-1;x++)if(cells[y*W+x]===0&&random()<(data.difficulty==='discovery'?.24:.075)){
  if((pass(x-1,y)&&pass(x+1,y))||(pass(x,y-1)&&pass(x,y+1)))cells[y*W+x]=1;}
 var start={x:(Math.floor(W/2)|1),y:H-4};exit={x:W-2,y:1};
 var candidates=[],r0=path(start,exit);if(!r0)throw Error('Carte sans sortie '+i);
 for(var yy=1;yy<H-1;yy++)for(var xx=1;xx<W-1;xx++)if(pass(xx,yy)){
  var p={x:xx,y:yy},d=path(start,p);if(d&&d.length>=5&&Math.abs(p.x-exit.x)+Math.abs(p.y-exit.y)>2)candidates.push({x:xx,y:yy,dist:d.length});}
 candidates.sort(function(a,b){return b.dist-a.dist;});books=[];
 for(var j=0;j<spec.events.length;j++){
  var best=null,score=-1;for(var u=0;u<candidates.length;u++){
   var p=candidates[u];if(books.some(function(b){return b.x===p.x&&b.y===p.y;}))continue;
   var gap=books.length?Math.min.apply(null,books.map(function(b){return Math.abs(b.x-p.x)+Math.abs(b.y-p.y);})):p.dist;
   if(gap<4)continue;
   var s=p.dist*.55+gap*2.8+rand(p.x+j,p.y+j)*6;
   if(s>score){score=s;best=p;}
  }
  if(!best)throw Error('Livre manquant '+i+'/'+j);
  books.push({x:best.x,y:best.y,title:spec.events[j].title,ref:spec.events[j].ref,body:spec.events[j].body,notice:spec.events[j].notice});
 }
 var saved=data.levels[i],pos=saved&&saved.position;
 player={x:integer(pos&&pos.x,0,W-1)&&integer(pos&&pos.y,0,H-1)&&pass(pos.x,pos.y)?pos.x:start.x,y:integer(pos&&pos.x,0,W-1)&&integer(pos&&pos.y,0,H-1)&&pass(pos.x,pos.y)?pos.y:start.y,dir:'down'};
 motion=null;route=[];hintRoute=[];particles=[];decor=[];trail=[];camFloatX=null;camFloatY=null;footsteps=0;
}
function discovered(n){return level().books.indexOf(n)!==-1;}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function totalDone(){return Object.keys(data.levels).filter(function(k){return data.levels[k]&&data.levels[k].complete;}).length;}
function starCount(){var n=0;Object.keys(data.levels).forEach(function(k){var z=data.levels[k];if(object(z)){n+=z.books.length*10;if(z.complete)n+=50;}});return n;}
function updateHome(){var h='';C.forEach(function(c,n){var z=data.levels[n]||{books:[],complete:false},icons=cfg.icons;h+='<button class="chapter-card'+(n===data.selected?' selected':'')+'" data-chapter="'+n+'"><span class="card-scene"><span class="big-icon" aria-hidden="true">'+icons[n]+'</span><img src="'+images[cfg.chapterArts[n]]+'" alt="Illustration du chapitre"></span><small>CHAPITRE '+(n+1)+' · '+escapeHTML(c.ref)+'</small><strong>'+escapeHTML(c.title)+'</strong><span class="'+(z.complete?'done':'todo')+'">'+(z.complete?'✦ Souvenir gagné':'📖 '+(z.books||[]).length+' / '+c.events.length+' découvertes')+'</span></button>';});$('chapters').innerHTML=h;
 $('overall').textContent=totalDone()+' / '+C.length+' chapitres terminés · ✦ '+starCount()+' étoiles';$('resume').textContent=data.levels[data.selected]?'▶ Reprendre le chapitre '+(data.selected+1):'▶ Commencer l’aventure';
 Array.prototype.forEach.call($('chapters').querySelectorAll('button'),function(b){b.onclick=function(){startChapter(+this.getAttribute('data-chapter'));};});}
function settings(){document.body.className='font-'+data.font;$('difficulty').value=data.difficulty;$('fontSize').value=data.font;$('lightMode').checked=data.light;$('avatar').value=data.avatar;}
$('difficulty').onchange=function(){data.difficulty=this.value==='adventure'?'adventure':'discovery';save();};
$('fontSize').onchange=function(){data.font=this.value;settings();save();};
$('lightMode').onchange=function(){data.light=this.checked;save();};$('avatar').onchange=function(){if(cfg.avatars.indexOf(this.value)>=0){data.avatar=this.value;save();}};$('switchAvatar').onclick=function(){if(cfg.avatars.length<2||chapter<2)return;data.avatar=cfg.avatars[(cfg.avatars.indexOf(data.avatar)+1)%cfg.avatars.length];$('avatar').value=data.avatar;save();updateHUD();};
$('resume').onclick=function(){startChapter(data.selected);};
$('back').onclick=function(){closeDialog();save();stopHeld();route=[];chapter=-1;document.body.removeAttribute('data-scene');$('play').hidden=true;$('home').hidden=false;updateHome();window.scrollTo(0,0);};
$('next').onclick=function(){startChapter(Math.min(C.length-1,chapter+1));};
function updateHUD(){if(chapter<0)return;var c=C[chapter],z=level();$('count').textContent=z.books.length+' / '+books.length+' livres';$('starHud').textContent='✦ '+starCount();$('missionShort').textContent=z.complete?'Souvenir gagné !':z.books.length===books.length?'Rejoins la sortie.':'Découvre les livres';$('mission').textContent=z.complete?'Bravo ! Le chapitre est terminé. Tu peux explorer encore ou avancer.':z.books.length===books.length?'Tous les livres sont trouvés. Rejoins le repère doré pour répondre à la question.':c.mission;
 $('entries').innerHTML='';books.forEach(function(b,n){var button=document.createElement('button');button.className='book-entry'+(discovered(n)?' found':'');button.textContent=(discovered(n)?'✓ ':'○ ')+b.title;button.disabled=!discovered(n);button.onclick=function(){readBook(n);};$('entries').appendChild(button);});
 $('switchAvatar').hidden=cfg.avatars.length<2;$('switchAvatar').textContent=chapter<2?'Autre personnage dès le chapitre 3':'Personnage : '+data.avatar+' ↔';$('switchAvatar').disabled=chapter<2; $('rewardTitle').textContent=z.complete?'✦ Souvenir du chapitre gagné':'✦ Un souvenir t’attend';$('rewardText').textContent=z.complete?'Ce souvenir est dans ton carnet. Tu peux le relire.':'Découvre '+books.length+' livres et trouve le chemin de la sortie.';$('next').hidden=!z.complete||chapter===C.length-1;
}
function sound(){if(!soundOn)return;try{var Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;if(!audio)audio=new Audio();if(audio.state==='suspended')audio.resume();[493.8,659.2,880].forEach(function(f,n){var o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+n*.10;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.055,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.26);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.27);});}catch(e){}}
$('sound').onclick=function(){soundOn=!soundOn;this.textContent='♪ Son : '+(soundOn?'oui':'non');this.setAttribute('aria-pressed',String(soundOn));if(soundOn)sound();};
function closeDialog(){if($('overlay').hidden)return;try{if(window.speechSynthesis)window.speechSynthesis.cancel();}catch(e){}$('overlay').hidden=true;document.body.classList.remove('modal-open');if(lastFocus&&lastFocus.focus)lastFocus.focus();else canvas.focus();}
function dialog(title,ref,body,art){route=[];held=null;lastFocus=document.activeElement;$('dialogTitle').textContent=title;$('dialogRef').textContent=ref;$('dialogBody').innerHTML=body;$('dialogArt').src=images[art||'book'];$('choices').innerHTML='';$('feedback').textContent='';$('continue').textContent='Continuer l’exploration';$('continue').onclick=closeDialog;$('overlay').hidden=false;document.body.classList.add('modal-open');$('close').focus();}
$('close').onclick=closeDialog;
$('listen').onclick=function(){var synth=window.speechSynthesis;if(!synth||!window.SpeechSynthesisUtterance){$('feedback').textContent='La lecture vocale n’est pas disponible sur cet appareil.';return;}var vv=synth.getVoices().filter(function(v){return /^fr([-_]|$)/i.test(v.lang||'');});if(!vv.length){$('feedback').textContent='Installe une voix française sur ton appareil pour écouter ce récit.';return;}var t=($('dialogTitle').textContent||'')+'. '+($('dialogBody').textContent||'');var u=new SpeechSynthesisUtterance(t);u.lang='fr-FR';u.voice=vv.filter(function(v){return /^fr[-_]FR$/i.test(v.lang||'');})[0]||vv[0];u.rate=.88;synth.cancel();synth.speak(u);};
$('overlay').addEventListener('keydown',function(e){if(e.key==='Escape'){closeDialog();return;}if(e.key!=='Tab')return;var f=this.querySelectorAll('button:not([disabled]),a[href]'),first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
function readBook(n){var b=books[n],first=!discovered(n);if(first){level().books.push(n);sound();save();updateHUD();sparkle(b.x,b.y);}dialog(b.title,b.ref+' · Découverte '+(n+1)+' / '+books.length,'<p>'+escapeHTML(b.body)+'</p><p class="readNote">'+escapeHTML(b.notice||'Le décor et les livres du jeu sont imaginés pour aider à comprendre le récit biblique.')+'</p>','book');}
function sparkle(x,y){if(reduced||data.light)return;for(var n=0;n<14;n++)particles.push({x:x*T+16,y:y*T+16,vx:(rand(n,x)-.5)*2,vy:-rand(n,y)*1.2-.4,life:1});}
function finish(){var z=level(),c=C[chapter];if(z.books.length<books.length){dialog('Encore quelques découvertes','AVENTURE · '+cfg.shortTitle.toUpperCase(),'<p>Il reste '+(books.length-z.books.length)+' livre(s) à découvrir avant de terminer. Cherche les lueurs sur les chemins, ou utilise le bouton « Un indice ».</p>','book');return;}
 if(z.complete){celebrate();return;}
 var q=c.question;
 dialog('Te souviens-tu du récit ?','QUESTION · '+escapeHTML(c.ref),'<p>'+escapeHTML(q.ask)+'</p>','book');
 q.answers.forEach(function(a,n){var b=document.createElement('button');b.textContent=a;b.onclick=function(){if(n===q.correct){complete();}else{$('feedback').textContent='Ce n’est pas cette réponse. Tu peux réessayer ou découvrir l’explication.';$('continue').textContent='Comprendre et terminer';$('continue').onclick=function(){dialog('Explication biblique',c.ref,'<p>'+escapeHTML(q.explain)+'</p>','book');$('continue').textContent='Terminer ce chapitre';$('continue').onclick=complete;};}};$('choices').appendChild(b);});$('continue').textContent='Revenir au labyrinthe';
}
function complete(){if(!level().complete){level().complete=true;save();sparkle(exit.x,exit.y);sound();}updateHUD();celebrate();}
function celebrate(){var c=C[chapter],done=totalDone();dialog(chapter===C.length-1?'✦ Les cinq chapitres de '+cfg.shortTitle+' terminés !':'✦ Souvenir '+(chapter+1)+' / 5','CHAPITRE TERMINÉ · '+escapeHTML(c.ref),'<p>'+escapeHTML(c.reflection)+'</p><p><strong>À raconter :</strong> qu’as-tu découvert dans ce chapitre ?</p><p>'+done+' / 5 souvenirs collectés. ✦ '+starCount()+' étoiles.</p>','chest');$('continue').textContent=chapter===C.length-1?'Retour aux chapitres':'Chapitre suivant →';$('continue').onclick=function(){closeDialog();if(chapter===C.length-1){$('back').click();}else{startChapter(chapter+1);}};}
function distance(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);}
function interact(){if(chapter<0||!loaded||!$('overlay').hidden||motion)return;
 for(var n=0;n<books.length;n++)if(distance(player,books[n])<=1){readBook(n);return;}
 if(distance(player,exit)<=1){finish();return;}
 toast('Avance vers un livre ou le repère doré pour observer.');}
$('interact').onclick=interact;
function album(){var done=totalDone();dialog('Le carnet des cinq chapitres','MES DÉCOUVERTES · '+done+' / 5 souvenirs','<p>Relis les livres découverts ou choisis un chapitre pour continuer.</p>','book');C.forEach(function(c,i){var z=data.levels[i]||{books:[],complete:false},b=document.createElement('button');b.textContent=(z.complete?'✦ ':'📖 ')+(i+1)+'. '+c.title+' ('+(z.books||[]).length+'/'+c.events.length+')';b.onclick=function(){closeDialog();startChapter(i);};$('choices').appendChild(b);});}
$('albumHome').onclick=album;$('albumPlay').onclick=album;
$('help').onclick=function(){dialog('Comment jouer ?','LE GUIDE DE L’EXPLORATEUR','<p>Marche avec les flèches ou ZQSD. Sur téléphone, utilise les grandes touches. Tu peux toucher un chemin pour marcher vers ce point.</p><p>Approche-toi d’un livre brillant ou du repère de sortie, puis touche « Observer ». Les livres apparaissent aussi automatiquement lorsque tu marches dessus.</p><p>Un indice affiche un chemin lumineux. Les questions ne bloquent jamais la progression.</p>','book');};
$('hint').onclick=function(){var targets=books.filter(function(b,n){return !discovered(n);});if(!targets.length)targets=[exit];var routes=targets.map(function(t){return {target:t,path:path(player,t)};}).filter(function(o){return !!o.path;}).sort(function(a,b){return a.path.length-b.path.length;});if(routes.length){hintRoute=routes[0].path;toast('Les lumières indiquent : '+(routes[0].target.title||'la sortie')+'.');}};
function startChapter(i){if(!integer(i,0,C.length-1))return;chapter=i;data.selected=i;document.body.setAttribute('data-scene',cfg.scenes[i]);generate(i);var c=C[i];$('chapterNo').textContent='CHAPITRE '+(i+1)+' / 5';$('chapterTitle').textContent=c.title;$('sideTitle').textContent=c.title;$('sideRef').textContent=c.ref;$('introText').textContent=c.intro;$('area').textContent=(cfg.areas||[])[i]||cfg.area;$('sceneIllustration').src=images[cfg.chapterArts[i]]||images.book;$('avatar').disabled=cfg.avatars.length<2||i<2;$('home').hidden=true;$('play').hidden=false;$('missionPanel').open=false;updateHUD();if(loaded)ground();resize();save();window.scrollTo(0,0);toast('Chapitre '+(i+1)+' : découvre '+books.length+' livres !');}
var vectors={up:[0,-1],left:[-1,0],right:[1,0],down:[0,1]};
function step(dir,fromRoute){if(!loaded||chapter<0||motion||!$('overlay').hidden)return false;var d=vectors[dir];if(!d)return false;player.dir=dir;var nx=player.x+d[0],ny=player.y+d[1];if(!pass(nx,ny)){if(!fromRoute)route=[];return false;}motion={fromX:player.x,fromY:player.y,toX:nx,toY:ny,start:performance.now(),duration:reduced||data.light?92:166};return true;}
function arrive(){if(!motion)return;player.x=motion.toX;player.y=motion.toY;motion=null;
 if(!reduced&&!data.light){trail.push({x:player.x*T+16,y:player.y*T+29,t:performance.now(),side:footsteps++%2,dir:player.dir});if(trail.length>22)trail.shift();}
 queueSave();for(var n=0;n<books.length;n++)if(player.x===books[n].x&&player.y===books[n].y&&!discovered(n)){route=[];readBook(n);return;}if(player.x===exit.x&&player.y===exit.y){route=[];finish();}}
function stopHeld(){held=null;Array.prototype.forEach.call(document.querySelectorAll('[data-dir]'),function(b){b.classList.remove('pressed');});}
var controlsRoot=document.querySelector('.game-controls');
['contextmenu','selectstart','dragstart'].forEach(function(type){controlsRoot.addEventListener(type,function(e){e.preventDefault();});});
controlsRoot.addEventListener('touchstart',function(e){if(e.cancelable)e.preventDefault();},{passive:false});
controlsRoot.addEventListener('touchmove',function(e){if(e.cancelable)e.preventDefault();},{passive:false});
Array.prototype.forEach.call(document.querySelectorAll('[data-dir]'),function(b){function begin(e){e.preventDefault();route=[];held=b.getAttribute('data-dir');heldAt=performance.now();b.classList.add('pressed');step(held,false);}if(window.PointerEvent){b.addEventListener('pointerdown',function(e){begin(e);if(b.setPointerCapture)b.setPointerCapture(e.pointerId);});b.addEventListener('pointerup',stopHeld);b.addEventListener('pointercancel',stopHeld);b.addEventListener('lostpointercapture',stopHeld);}else{b.addEventListener('touchstart',begin,{passive:false});b.addEventListener('touchend',stopHeld);b.addEventListener('mousedown',begin);}});
document.addEventListener('mouseup',stopHeld);window.addEventListener('blur',function(){stopHeld();route=[];if(chapter>=0)save();});
var keys={ArrowUp:'up',ArrowLeft:'left',ArrowRight:'right',ArrowDown:'down',z:'up',w:'up',q:'left',a:'left',s:'down',d:'right'};
document.addEventListener('keydown',function(e){if(!$('overlay').hidden)return;if(['BUTTON','SELECT','INPUT','TEXTAREA'].indexOf(e.target.tagName)!==-1&&(e.key===' '||e.key==='Enter'||e.target.tagName==='SELECT'))return;var dir=keys[e.key];if(dir){e.preventDefault();route=[];held=dir;heldAt=performance.now();step(dir,false);}else if((e.key===' '||e.key==='e')&&chapter>=0){e.preventDefault();interact();}});document.addEventListener('keyup',function(e){if(keys[e.key])stopHeld();});
function clickPath(e){if(chapter<0||!loaded||!$('overlay').hidden)return;var r=canvas.getBoundingClientRect(),t=e.changedTouches?e.changedTouches[0]:e;var x=Math.floor(((t.clientX-r.left)*canvas.width/r.width+camera.x)/T),y=Math.floor(((t.clientY-r.top)*canvas.height/r.height+camera.y)/T);if(!pass(x,y)){toast('Touche un sentier pour avancer.');return;}if(x===player.x&&y===player.y){interact();return;}route=path(motion?{x:motion.toX,y:motion.toY}:player,{x:x,y:y})||[];held=null;}
canvas.addEventListener('click',clickPath);canvas.addEventListener('touchend',function(e){e.preventDefault();clickPath(e);},{passive:false});
function resize(){var r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;var scale=data.light?2:1.55;var w=Math.max(155,Math.min(800,Math.round(r.width/scale))),h=Math.max(180,Math.round(r.height/scale));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}ctx.imageSmoothingEnabled=false;}window.addEventListener('resize',resize);
document.addEventListener('visibilitychange',function(){if(document.hidden){stopHeld();route=[];if(chapter>=0)save();}});window.addEventListener('pagehide',function(){if(chapter>=0)save();});
function sprite(c,name,x,y,w,h){var im=assets[name];if(!im||!im.complete||!im.naturalWidth)return;c.drawImage(im,Math.round(x),Math.round(y),w||im.width,h||im.height);}
// Pixel art helpers: static decoration is cached on an offscreen canvas.
function pixel(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function dotflower(c,x,y,flower){
 pixel(c,x,y,2,2,'#254f36');pixel(c,x+1,y+2,1,4,'#3c7847');
 pixel(c,x-2,y,3,3,flower);pixel(c,x+2,y-1,3,3,flower);pixel(c,x,y-3,3,3,flower);
 pixel(c,x,y,3,3,'#ffdb6a');
}
function woodCrate(c,x,y){
 pixel(c,x+2,y+3,25,17,'#65482c');pixel(c,x+4,y+2,22,15,'#b88449');
 pixel(c,x+5,y+5,20,3,'#e7bd75');pixel(c,x+6,y+12,18,2,'#8d5b34');
 pixel(c,x+5,y+3,3,14,'#684a30');pixel(c,x+22,y+3,3,14,'#684a30');
 pixel(c,x+9,y+8,3,3,'#f4d191');pixel(c,x+16,y+9,3,3,'#e5b766');
}
function woodLogs(c,x,y){
 for(var i=0;i<3;i++){var yy=y+i*5;pixel(c,x+i*2,yy,29-i*3,7,'#734b2b');pixel(c,x+i*2+2,yy,23-i*3,3,'#d4a464');pixel(c,x+i*2+26-i*3,yy+1,4,5,'#f5d68e');}
}
function lantern(c,x,y){pixel(c,x+2,y-2,2,10,'#483a2b');pixel(c,x,y+6,8,12,'#725033');pixel(c,x+1,y+7,6,9,'#f9c968');pixel(c,x+3,y+8,2,7,'#fff4ba');}
function fence(c,x,y){
 pixel(c,x+2,y+5,30,4,'#67442c');pixel(c,x+2,y+15,30,4,'#67442c');
 for(var j=2;j<33;j+=12){pixel(c,x+j,y,5,23,'#936138');pixel(c,x+j+1,y+2,2,17,'#d1a363');}
}
function drawRiverStone(c,x,y){
 pixel(c,x,y+7,20,5,'#426a59');pixel(c,x+3,y+2,16,10,'#96a99c');
 pixel(c,x+7,y,11,5,'#dce3bf');pixel(c,x+16,y+6,4,6,'#697d79');
}
function naturalEdge(c,x,y,mode){
 if(mode===2)return;var watery=(mode===3),border=watery?'#6f9b8b':'#7b9764',dark=watery?'#3a7f87':'#4b744b';
 [[0,-1],[1,0],[0,1],[-1,0]].forEach(function(d,j){if(pass(x+d[0],y+d[1]))return;
  var x0=x*T,y0=y*T;
  for(var k=0;k<6;k++){
   var off=2+k*5,depth=2+Math.floor(rand(x*8+k,y*11+j)*4);
   pixel(c,x0+(j%2?j===1?T-depth:0:off),y0+(j%2?off:j===2?T-depth:0),j%2?depth:4,j%2?4:depth,k%3?border:dark);
  }
 });
}
var animalDecor=[];var trail=[],camFloatX=null,camFloatY=null,footsteps=0;

/* v2.5: hand-drawn floor details, generated deterministically and cached once per chapter.
   Decorative only: maze walkability, books and exits remain untouched. */
function terrainDetail(c,xx,yy,walk,mode,r){
 var dry=mode===4,shade=mode===3;
 if(walk){
  if(r>.27){var sx=xx+5+Math.floor(r*19)%15,sy=yy+5+Math.floor(r*27)%20;
   pixel(c,sx,sy,4,2,dry?'#e0c28b':'#d9bb7e');pixel(c,sx+1,sy-1,2,1,dry?'#fff0bb':'#f9e7b2');
   if(r>.7)pixel(c,xx+22,yy+23,3,2,dry?'#b18d59':'#a68d63');}
  if(r>.79){pixel(c,xx+3,yy+8,1,5,'#79905b');pixel(c,xx+5,yy+6,2,3,'#a1af67');}
  if(dry&&r>.54){pixel(c,xx+17,yy+26,8,1,'#b79765');pixel(c,xx+19,yy+27,3,1,'#d2b27b');}
 }else{
  if(r>.14){var a=xx+4+Math.floor(r*11)%18,b=yy+12+Math.floor(r*7)%14;
   pixel(c,a,b,2,8,dry?'#a28e52':'#3f814d');pixel(c,a-2,b+3,2,4,dry?'#bb9c57':'#68a55f');pixel(c,a+3,b+2,2,5,dry?'#a48c4e':'#7cab63');
   pixel(c,a+1,b-2,1,5,shade?'#72936a':dry?'#c7a966':'#9dc976');}
  if(r>.64&&!dry){var color=mode===3?'#c3a5e2':r>.83?'#ffcb8f':'#e78faa';
   dotflower(c,xx+7+Math.floor(r*17)%15,yy+10+Math.floor(r*13)%14,color);}
  if(dry&&r>.73){pixel(c,xx+20,yy+13,2,11,'#766d4c');pixel(c,xx+17,yy+15,4,2,'#a18e56');}
  if(!dry&&r>.85){pixel(c,xx+22,yy+6,3,3,'#8fbf67');pixel(c,xx+25,yy+8,3,2,'#2f7654');}
 }
}
function decorateExit(c,x,y,mode){
 var xx=x*T+16,yy=y*T+18;
 pixel(c,xx-10,yy+10,20,4,mode===4?'#b18b52':'#a1ab66');
 pixel(c,xx-7,yy+7,14,3,'#eee0a0');
 pixel(c,xx-3,yy+3,6,4,'#ffe5a4');
 pixel(c,xx-1,yy-3,2,6,'#f5d07e');
 if(mode!==4){dotflower(c,xx-12,yy+8,'#f2cd77');dotflower(c,xx+11,yy+8,'#f2cd77');}
}

function groundOther(){
 var m=chapter,noah=cfg.theme==='noah',inside=noah&&m===2,wet=noah&&m===3,desert=!noah&&m>=2;
 background.width=W*T;background.height=H*T;bg.imageSmoothingEnabled=false;decor=[];animalDecor=[];
 for(var y=0;y<H;y++)for(var x=0;x<W;x++){
  var walk=pass(x,y),r=rand(x+m*7,y+m*3),tile=inside?'planks':wet&&!walk?'water':desert&&!walk?'sand':walk?'sand':'grass';
  bg.drawImage(assets[tile],(x%3)*T,(y%3)*T,T,T,x*T,y*T,T,T);
  if(walk&&!inside)naturalEdge(bg,x,y,wet?3:0);
  if(inside){pixel(bg,x*T+1,y*T+27,30,2,walk?'#a67b4b':'#463d35');if(!walk)pixel(bg,x*T+3,y*T+3,26,23,'#554537a0');}
  else if(!walk&&r>.46&&!(x>W-6&&y<7)){
   var propName=null,propList=cfg.worldProps||[];
   // The props follow the narrative: timber at the construction site,
   // reeds near the floodplain, sheep only in Noah, sheaves in Canaan,
   // jars in Egyptian granaries, tents on the journey.
   if(noah&&m===0&&r>.89)propName='timber';
   else if(noah&&m===3&&r>.85)propName='reeds';
   else if(noah&&m===2&&r>.90)propName='fish';
   else if(!noah&&m===0&&r>.84)propName='sheaf';
   else if(!noah&&m===1&&r>.84)propName='tent';
   else if(!noah&&m===3&&r>.84)propName='jar';
   else if(!noah&&m===4&&r>.86)propName='palm';
   if(propName&&assets['prop-'+propName])decor.push({name:'prop-'+propName,x:x*T+16,y:y*T+29,w:30,h:32});
   else{var name=desert?r>.75?'boulder':r>.56?'flowers':'cedar':wet?r>.7?'boulder':'flowers':r>.78?'cedar':r>.56?'flowers':'boulder',tree=name==='cedar';decor.push({name:name,x:x*T+16,y:y*T+29,w:tree?47:29,h:tree?59:30});}
  }
  if(walk){
    // Distinct lighter pathways, pebble clusters and safe walkable borders.
    if(r>.31){pixel(bg,x*T+6+Math.floor(r*17)%15,y*T+8,4,2,wet?'#b4d6d2':desert?'#ebcd9e':'#e6d19f');}
    if(r>.74){pixel(bg,x*T+19,y*T+24,4,2,desert?'#bb9968':'#a0a67c');pixel(bg,x*T+21,y*T+22,2,2,'#f4dba7');}
    if(r>.91&&!inside&&!desert)dotflower(bg,x*T+26,y*T+6,'#f4d68b');
   }
  if(!walk&&!inside&&r>.66&&r<.72)dotflower(bg,x*T+13,y*T+15,desert?'#edc58c':'#eda1a1');
 }
 if(noah){
  if(inside){for(var q=2;q<W-2;q+=4){lantern(bg,q*T,5);woodCrate(bg,q*T+5,(H-2)*T-20);}}
  else {bg.globalAlpha=.82;sprite(bg,'ark',(W-5)*T-72,Math.max(0,m*12),122,92);bg.globalAlpha=1;}
  if(m===0)for(var t=0;t<7;t++)woodLogs(bg,(3+t*2)*T,3*T);
  if(m===1)for(var n=0;n<9;n++){var ax=2+n*2,ay=2+n%3*5;if(ax<W-2&&!pass(ax,ay))animalDecor.push({name:'sheep',x:ax*T+16,y:ay*T+26,w:36,h:25,phase:n});}
  if(m===4){var rx=(W-5)*T,ry=95;['#e77b67','#f9b559','#f4df78','#6cba7d','#5ba9c6','#9e86c6'].forEach(function(color,i){bg.beginPath();bg.strokeStyle=color;bg.lineWidth=5;bg.arc(rx,ry,81-i*6,Math.PI,Math.PI*2);bg.stroke();});}
 }else{
  if(m===0||m===2)for(var j=0;j<8;j++)woodCrate(bg,(2+j*3)*T,4*T);
  if(m===1)for(var k=0;k<8;k++){var jx=3+k*3,jy=3+(k%3)*3;if(jx<W-2&&!pass(jx,jy))decor.push({name:'prop-tent',x:jx*T+16,y:jy*T+28,w:36,h:39});}
  if(m>=3)for(var z=0;z<10;z++)lantern(bg,(3+z*2)*T,(4+z%4*4)*T);
 }
 decorateExit(bg,exit.x,exit.y,m);
}

function ground(){if(cfg.theme!=='eden'){groundOther();return;}
 if(chapter<0||!loaded)return;
 var mode=chapter;background.width=W*T;background.height=H*T;bg.imageSmoothingEnabled=false;
 decor=[];animalDecor=[];
 var th=[
  {base:'grass',path:'sand',flowers:.48,trees:.48},
  {base:'grass',path:'sand',flowers:.48,trees:.40},
  {base:'grass',path:'sand',flowers:.40,trees:.43},
  {base:'grass',path:'sand',flowers:.32,trees:.49},
  {base:'grass',path:'sand',flowers:.21,trees:.25}
 ][mode];
 for(var y=0;y<H;y++)for(var x=0;x<W;x++){
  var walk=pass(x,y),r=rand(x,y),outside=(mode===4&&x>W*.65);
  var tile=outside?'sand':walk?th.path:th.base;
  if(!walk&&mode===0&&x<2)tile='water';
  bg.drawImage(assets[tile],(x%3)*T,(y%3)*T,T,T,x*T,y*T,T,T);
  if(walk)naturalEdge(bg,x,y,0);terrainDetail(bg,x*T,y*T,walk,mode,r);
  for(var n=0;n<5;n++){
   var xx=x*T+Math.floor(rand(x*17+n,y+mode)*T),yy=y*T+Math.floor(rand(x,y*17+n+mode)*T);
   pixel(bg,xx,yy,2+(n%2),1,walk?'#e5cc88':outside?'#cead71':'#80a663');
  }
  if(!walk&&r>th.trees&&!(x>=W-5&&y<=6)){
   var typ=r>.80?'eden-tree':r>.61?'cedar':r>.53?'flowers':'boulder',scale=.85+rand(y,x)*.35;
   if(typ==='cedar'||typ==='eden-tree'){pixel(bg,x*T+3,y*T+27,27,4,'#35563c49');pixel(bg,x*T+7,y*T+24,18,3,'#24483038');}
   decor.push({name:typ,x:x*T+16,y:y*T+29,w:Math.round((typ==='cedar'||typ==='eden-tree'?51:typ==='boulder'?30:29)*scale),h:Math.round((typ==='cedar'||typ==='eden-tree'?62:typ==='boulder'?29:30)*scale)});
  }
  if(!walk&&r>.70&&r<.73&&!outside){dotflower(bg,x*T+12,y*T+14,mode===3?'#d5aed0':'#ec8aa4');}
 }
 // Scenic landmarks are outside the logical maze and never change collision.
 var tx=(W-5)*T,ty=(3)*T;
 if(mode===2){
   sprite(bg,'eden-tree',tx-45,ty-68,110,115);
   // Symbolic little green serpent on the tree branch.
   bg.fillStyle='#517e36';for(var a=0;a<9;a++){var sx=tx+Math.round(Math.sin(a*.75)*7),sy=ty-39+a*3;pixel(bg,sx,sy,5,4,a%2?'#7fa33c':'#315c36');}
   pixel(bg,tx+2,ty-17,2,2,'#ffe1a5');
 }
 if(mode===1){
   for(var a2=0;a2<9;a2++){var ax=3+a2*3,ay=2+(a2%3)*5;if(ax<W-2&&ay<H-2&&!pass(ax,ay))animalDecor.push({name:'sheep',x:ax*T+16,y:ay*T+26,w:36,h:25,phase:a2});}
 }
 if(mode===3){
   // Quieter shaded garden, visual mood only.
   pixel(bg,0,0,W*T,H*T,'#27412b12');
 }
 if(mode===4){
   for(var f=0;f<15;f++){var fx=Math.floor(W*.63+rand(f,2)*W*.32),fy=1+Math.floor(rand(f,4)*(H-2));
    if(!pass(fx,fy)&&rand(f,9)>.45)drawRiverStone(bg,fx*T,fy*T+10);
   }
   // Simple golden glimmer at the garden boundary: not a portrayal of God.
   for(var q=0;q<8;q++)pixel(bg,tx-20+q*7,ty-8+(q%3)*2,4,4,'#f0c46c');
 }
 decorateExit(bg,exit.x,exit.y,mode);
 if(mode===0||mode===1){
  for(var z=0;z<12;z++){var px2=2+Math.floor(rand(z,3)*(W-4)),py2=2+Math.floor(rand(z,7)*(H-4));if(!pass(px2,py2))dotflower(bg,px2*T+10,py2*T+16,'#f6e7a2');}
 }
}

/* v2.5: directional animation, soft camera, living scenery and pixel-depth effects. */
function draw(t){
 if(chapter<0||!loaded)return;
 var px=player.x,py=player.y,walking=!!motion,progress=0;
 if(motion){
  progress=Math.max(0,Math.min(1,(t-motion.start)/motion.duration));
  // A gentle acceleration without a stop at every tile in a long route.
  var f=progress+.08*Math.sin(Math.PI*2*progress)/(Math.PI*2);
  px=motion.fromX+(motion.toX-motion.fromX)*f;
  py=motion.fromY+(motion.toY-motion.fromY)*f;
  if(progress>=1)arrive();
 }
 var targetX=Math.max(0,Math.min(Math.max(0,W*T-canvas.width),px*T+16-canvas.width*.5));
 var targetY=Math.max(0,Math.min(Math.max(0,H*T-canvas.height),py*T+16-canvas.height*.44));
 if(camFloatX===null||reduced||data.light){camFloatX=targetX;camFloatY=targetY;}
 else{camFloatX+=(targetX-camFloatX)*.48;camFloatY+=(targetY-camFloatY)*.48;
  if(Math.abs(targetX-camFloatX)<.3)camFloatX=targetX;if(Math.abs(targetY-camFloatY)<.3)camFloatY=targetY;}
 camera.x=Math.round(camFloatX);camera.y=Math.round(camFloatY);
 ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.save();ctx.translate(-camera.x,-camera.y);ctx.drawImage(background,0,0);
 // Footstep traces fade gently behind the hero. Never alter the collision map.
 if(!reduced&&!data.light){
  for(var tr=trail.length-1;tr>=0;tr--){
   var v=trail[tr],age=(t-v.t)/1900;
   if(age>=1){trail.splice(tr,1);continue;}
   var side=v.side?1:-1,hor=v.dir==='left'||v.dir==='right';
   var tx=v.x+(hor?0:side*4),ty=v.y+(hor?side*4:0);
   ctx.globalAlpha=.28*(1-age)*(1-age);ctx.fillStyle=chapter===C.length-1?'#7a674c':'#49664a';
   ctx.fillRect(Math.round(tx-2),Math.round(ty-1),hor?4:3,hor?3:4);
   if(age<.24){ctx.globalAlpha=(.24-age)*.6;ctx.fillStyle='#f7ddb0';
    ctx.fillRect(Math.round(v.x-7-age*8),Math.round(v.y-3-age*5),3,2);
    ctx.fillRect(Math.round(v.x+5+age*8),Math.round(v.y-3-age*5),3,2);}
  }
  ctx.globalAlpha=1;
 }
 // Golden compass breadcrumbs: brighter at the next step, quieter in easy mode.
 hintRoute.forEach(function(p,n){
  var xx=p.x*T+16,yy=p.y*T+16,blink=.65+.3*Math.sin(t/330-n*.5);
  ctx.globalAlpha=reduced?1:blink;
  ctx.fillStyle='#c98d36';ctx.fillRect(xx-4,yy-2,8,5);
  ctx.fillStyle=n%2?'#fff6be':'#ffe17a';ctx.fillRect(xx-3,yy-3,6,6);
  ctx.fillStyle='#fffde7';ctx.fillRect(xx-1,yy-1,2,2);
 });ctx.globalAlpha=1;
 var objects=decor.slice();
 animalDecor.forEach(function(a){objects.push({name:a.name,x:a.x,y:a.y,w:a.w,h:a.h,phase:a.phase});});
 books.forEach(function(b,n){objects.push({name:'book',x:b.x*T+16,y:b.y*T+27,w:24,h:22,book:n});});
 if(cfg.theme==='eden'){if(chapter>=2||(chapter===1&&level().books.indexOf(2)!==-1))objects.push({name:'partner',x:exit.x*T+32,y:exit.y*T+27,w:34,h:44});if(chapter<2){for(var a=0;a<3;a++){var ax=2+a*4,ay=5+(a%3)*4;if(!pass(ax,ay))objects.push({name:'sheep',x:ax*T+16,y:ay*T+27,w:35,h:25,phase:a});}objects.push({name:'doves',x:exit.x*T-30,y:exit.y*T+20,w:35,h:25,phase:9});}}
  else if(cfg.theme==='noah'){if(chapter>=3)objects.push({name:'doves',x:exit.x*T-25,y:exit.y*T+20,w:35,h:25});}
  // Joseph's adventures feature people, grain and Egyptian landscapes; no unrelated sheep NPC.
  else if(cfg.theme==='joseph'&&(chapter===0||chapter===3)){objects.push({name:chapter===0?'prop-sheaf':'prop-jar',x:exit.x*T-28,y:exit.y*T+27,w:28,h:31});}
  objects.push({name:'player',x:px*T+16,y:py*T+29,w:35,h:55});
 objects.sort(function(a,b){return a.y-b.y;});
 objects.forEach(function(o){
  if(o.x+o.w<camera.x-4||o.x-o.w>camera.x+canvas.width+4||o.y<camera.y-4||o.y-o.h>camera.y+canvas.height+4)return;
  if(o.book!==undefined){
   var done=discovered(o.book),pulse=reduced||data.light?0:Math.sin(t/260+o.book);
   ctx.globalAlpha=done?.35:.57;
   ctx.fillStyle=done?'#b8c09f':'#ffe6a0';ctx.fillRect(Math.round(o.x-15),Math.round(o.y-24),30,25);
   if(!done){ctx.fillStyle='#fff0b0';ctx.fillRect(o.x-18,o.y-14,3,3);ctx.fillRect(o.x+15,o.y-19,3,3);
    ctx.fillStyle='#fffbd7';ctx.fillRect(o.x-3,o.y-29+Math.round(pulse*2),6,4);}
   ctx.globalAlpha=done?.47:1;
  }
  if(o.name==='player'){
   // Direction is kept when stopping; the old build always snapped to a frontal pose.
   ctx.globalAlpha=.27;ctx.fillStyle='#1a3427';
   ctx.fillRect(Math.round(o.x-11),Math.round(o.y-3),22,5);
   ctx.fillRect(Math.round(o.x-7),Math.round(o.y+2),14,2);ctx.globalAlpha=1;
   var other=!cfg.avatarAtlas&&cfg.theme!=='eden',activeAvatar=cfg.id==='eden'&&chapter<2?'adam':data.avatar,atlas=assets[cfg.avatarAtlas||(other?'explorer':activeAvatar+'-atlas')];
   var row=other?{down:0,left:1,right:2,up:3}[player.dir]:walking?{down:1,left:2,right:3,up:4}[player.dir]:(player.dir==='down'?0:{down:1,left:2,right:3,up:4}[player.dir]);
   var col=walking?(reduced||data.light?1:Math.floor(t/115)%4):other?1:(player.dir==='down'&&!reduced&&!data.light?Math.floor(t/1050)%4:0);
   var bob=walking&&!reduced&&!data.light?Math.round(Math.abs(Math.sin(t/135))*2):0;
   ctx.drawImage(atlas,col*(other?48:64),row*(other?64:80),other?48:64,other?64:80,Math.round(o.x-(other?17:21)),Math.round(o.y-(other?45:56)-bob),other?34:42,other?45:55);
  }else if(o.name==='partner'){
   var npc=assets[(data.avatar==='eve'?'adam':'eve')+'-atlas'];
   if(chapter<2)npc=assets['eve-atlas'];
   var nc=reduced||data.light?0:Math.floor(t/1750)%4;
   var nb=reduced||data.light?0:Math.round(Math.sin(t/850));
   ctx.globalAlpha=.25;ctx.fillStyle='#203b2b';ctx.fillRect(Math.round(o.x-9),Math.round(o.y-4),18,4);ctx.globalAlpha=1;
   ctx.drawImage(npc,nc*64,0,64,80,Math.round(o.x-19),Math.round(o.y-52-nb),38,49);
  }else if(o.phase!==undefined&&(o.name==='sheep'||o.name==='doves')){
   var bob2=reduced||data.light?0:Math.round(Math.sin(t/480+o.phase*3)*2);
   sprite(ctx,o.name,o.x-o.w/2,o.y-o.h+bob2,o.w,o.h);
  }else{sprite(ctx,o.name,o.x-o.w/2,o.y-o.h,o.w,o.h);}
  ctx.globalAlpha=1;
 });
 // Fireflies, drifting petals and shimmering air add depth without new downloads.
 if(!data.light){
  for(var fly=0;fly<11;fly++){
   var fx=rand(fly+12,chapter)*W*T+(reduced?0:Math.sin(t/730+fly*3)*15);
   var fy=rand(fly+18,chapter)*H*T+(reduced?0:Math.cos(t/840+fly*2)*9);
   if(fx<camera.x-12||fx>camera.x+canvas.width+12||fy<camera.y-12||fy>camera.y+canvas.height+12)continue;
   fx=Math.round(fx);fy=Math.round(fy);
   if(chapter===2||chapter===3){
    ctx.fillStyle=fly%2?'#fff0b6':'#d5f8b4';ctx.fillRect(fx,fy,3,3);
    if(!reduced){ctx.globalAlpha=.3;ctx.fillRect(fx-2,fy-2,7,7);ctx.globalAlpha=1;}
   }else if(chapter===C.length-1){
    ctx.fillStyle=fly%2?'#ffd89b':'#ddb380';ctx.fillRect(fx,fy,3,2);
    if(!reduced)ctx.fillRect(fx-3,fy-1,2,2);
   }else{
    ctx.fillStyle=fly%2?'#f7d773':'#fba6b8';
    ctx.fillRect(fx-3,fy-1,3,3);ctx.fillRect(fx+2,fy-1,3,3);
    ctx.fillStyle='#467d46';ctx.fillRect(fx,fy,2,4);
   }
  }
 }
 // Weather remains decorative and cannot block a maze passage.
 if(cfg.theme==='noah'&&chapter===2&&!data.light){
  ctx.fillStyle='#c9e1f2';
  for(var rain=0;rain<(reduced?24:86);rain++){
   var rx=(rain*137+59)%(W*T),ry=(rain*67+(reduced?0:t*.23))%(H*T);
   if(rx<camera.x-8||rx>camera.x+canvas.width+8||ry<camera.y-10||ry>camera.y+canvas.height+10)continue;
   ctx.globalAlpha=.25+.20*(rain%4);ctx.fillRect(Math.round(rx),Math.round(ry),2,9);
  }
  ctx.globalAlpha=1;
 }
 if(cfg.theme==='noah'&&chapter===3&&!data.light){
  ctx.fillStyle='#d1eee6';ctx.globalAlpha=.45;
  for(var wave=0;wave<24;wave++){var wx=(wave*157)%(W*T),wy=(wave*83+(reduced?0:t*.015))%(H*T);if(wx>camera.x&&wx<camera.x+canvas.width&&wy>camera.y&&wy<camera.y+canvas.height)ctx.fillRect(Math.round(wx),Math.round(wy),14,2);}
  ctx.globalAlpha=1;
 }
 if(cfg.theme==='joseph'&&chapter===3&&!data.light){
  ctx.fillStyle='#f8de9c';ctx.globalAlpha=.26;
  for(var grain=0;grain<22;grain++){var gx=(grain*79+19)%(W*T),gy=(grain*109+(reduced?0:t*.014))%(H*T);if(gx>camera.x&&gx<camera.x+canvas.width&&gy>camera.y&&gy<camera.y+canvas.height)ctx.fillRect(Math.round(gx),Math.round(gy),3,5);}
  ctx.globalAlpha=1;
 }
 var ex=exit.x*T+16,ey=exit.y*T+27,ready=level().books.length===books.length;
 var pulseExit=reduced||data.light?0:Math.round(Math.sin(t/260)*2);
 ctx.fillStyle=ready?'#fff4bc':'#356956';ctx.fillRect(ex-10,ey+1,20,3);
 ctx.fillStyle=ready?'#f9d072':'#b8cba2';ctx.fillRect(ex-7,ey-3,14,3);
 ctx.fillStyle=ready?'#fff7d2':'#d3e1bd';ctx.fillRect(ex-3,ey-9+pulseExit,6,5);
 ctx.fillRect(ex-1,ey-15+pulseExit,2,4);
 if(!reduced&&!data.light){
  for(var pp=particles.length-1;pp>=0;pp--){var p=particles[pp];
   p.x+=p.vx;p.y+=p.vy;p.life-=.025;ctx.globalAlpha=Math.max(0,p.life);
   ctx.fillStyle='#fff0ad';ctx.fillRect(Math.round(p.x),Math.round(p.y),2,2);
   if(p.life<=0)particles.splice(pp,1);
  }ctx.globalAlpha=1;
 }
 ctx.restore();frames++;
}
function tick(t){requestAnimationFrame(tick);if(!loaded||chapter<0||document.hidden||!$('overlay').hidden)return;if(t-lastFrame<(data.light?54:34))return;lastFrame=t;if(!motion){if(held&&t-heldAt>95){step(held,false);heldAt=t;}else if(route.length){var next=route.shift(),dx=next.x-player.x,dy=next.y-player.y;if(Math.abs(dx)+Math.abs(dy)===1)step(dx>0?'right':dx<0?'left':dy>0?'down':'up',true);else route=[];}}draw(t);}
var waiting=assetNames.length;assetNames.forEach(function(name){var im=new Image();assets[name]=im;im.onload=function(){waiting--;if(waiting===0&&!loadFailed){loaded=true;if(chapter>=0){ground();resize();draw(performance.now());}}};im.onerror=function(){loadFailed=true;storageError=true;$('saveStatus').hidden=false;$('saveStatus').firstChild.textContent='⚠️ Une image est absente. Recharge la page pour réessayer.';};im.src=images[name];});
(function(){
 document.title='Bible Aventure · '+cfg.shortTitle+' Pixel v0.3 · 5 chapitres';
 document.querySelector('.identity span').textContent=cfg.tagline;
 document.querySelector('.experimental').textContent='LAB · PIXEL 0.4';
 document.querySelector('.intro .eyebrow').textContent=cfg.reference+' · 7–11 ANS';
 document.querySelector('.intro h1').textContent=cfg.title;document.querySelector('.intro-text>p').textContent=cfg.intro;
 document.querySelector('.sourceNote').textContent=cfg.note;
 document.querySelector('.intro-cover-art').src=images[cfg.cover]||images.book;
 document.querySelector('.intro-cover-art').alt='Illustration artistique du récit de '+cfg.shortTitle;
 document.querySelector('.side-intro img').src=images[cfg.theme==='eden'?'eden-tree':cfg.theme==='noah'?'ark':'book']||images.book;
 document.querySelector('#dialogArt').src=images.book;
 document.querySelector('#sceneIllustration').src=images[cfg.chapterArts[0]]||images.book;
 document.querySelector('.world-note').textContent='Décors imaginés. Référence : '+cfg.reference+'.';
 document.querySelector('.readNote').textContent='Les illustrations servent à comprendre le récit, sans ajouter de faits à la Bible.';
 document.querySelector('footer span').textContent='ELC Foi · Moteur Pixel commun v0.4';
 var sl=$('avatar');sl.innerHTML='';
 cfg.avatars.forEach(function(id){var op=document.createElement('option');op.value=id;op.textContent=id==='eve'?'Ève (chap. 3+)':id==='adam'?'Adam':id==='explorer'?'Explorateur':id==='noah'?'Noé':id==='joseph'?'Joseph':id;sl.appendChild(op);});
 if(cfg.avatars.length<2){sl.hidden=true;document.querySelector('.avatar-label').hidden=true;$('switchAvatar').hidden=true;}
}());
settings();updateHome();if(storageError)$('saveStatus').hidden=false;
requestAnimationFrame(tick);
window.PixelEngineTest={snapshot:function(){return {ready:loaded,error:loadFailed,chapter:chapter,moving:!!motion,player:{x:player.x,y:player.y},books:chapter>=0?level().books.slice():[],complete:chapter>=0?level().complete:false,cells:cells.slice(),width:W,height:H,targets:books.map(function(b){return {x:b.x,y:b.y};}),exit:{x:exit.x,y:exit.y},storage:STORAGE,frames:frames,world:cfg.id,visualVersion:'shared-0.4',worldProps:(cfg.worldProps||[]).length,decorations:decor.length,heroAtlas:cfg.avatarAtlas||null,heroAtlasLoaded:cfg.avatarAtlas?!!(assets[cfg.avatarAtlas]&&assets[cfg.avatarAtlas].naturalWidth===256&&assets[cfg.avatarAtlas].naturalHeight===400):true,sceneImages:cfg.chapterArts.length,footsteps:footsteps,trail:trail.length,camera:{x:camera.x,y:camera.y},avatar:cfg.id==='eden'&&chapter<2?'adam':data.avatar,direction:player.dir};},path:function(x,y){return path(player,{x:x,y:y});},validate:function(){var result=[];for(var i=0;i<C.length;i++){var old=chapter,prev=Object.assign({},player),oldDifficulty=data.difficulty;['discovery','adventure'].forEach(function(d){data.difficulty=d;chapter=i;generate(i);var start={x:(Math.floor(W/2)|1),y:H-4},all=books.every(function(b){return !!path(start,b);})&&!!path(start,exit);result.push({chapter:i+1,mode:d,valid:all,width:W,height:H,books:books.length});});data.difficulty=oldDifficulty;chapter=old;if(old>=0){generate(old);player=prev;}}return result;},start:startChapter};
}());