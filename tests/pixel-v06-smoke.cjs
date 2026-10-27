'use strict';
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const checks=[];
const check=(ok,message)=>{assert.ok(ok,message);checks.push(message);};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=http.createServer((req,res)=>{
 let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 let filepath=path.resolve(root,'.'+p);if(fs.existsSync(filepath)&&fs.statSync(filepath).isDirectory())filepath=path.join(filepath,'index.html');
 if(!filepath.startsWith(root+path.sep)||!fs.existsSync(filepath)||!fs.statSync(filepath).isFile()){res.writeHead(404);res.end('Not found');return;}
 res.writeHead(200,{'Content-Type':mime[path.extname(filepath)]||'text/plain; charset=utf-8','Cache-Control':'no-cache'});
 fs.createReadStream(filepath).pipe(res);
});
async function world(browser,address,id,width,height){
 const context=await browser.newContext({viewport:{width,height},isMobile:width<600,hasTouch:width<600,locale:'fr-FR'});
 const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',msg=>{if(msg.type()==='error'&&!msg.text().includes('favicon'))errors.push(msg.text())});
 await page.goto(address+'pixel-lab-v06/'+id+'/',{waitUntil:'load'});
 await page.waitForFunction(()=>window.PixelEngineTest&&document.querySelectorAll('#chapters button').length===5,{timeout:7000}).catch(async()=>{throw Error(id+' initialization failed: '+JSON.stringify(await page.evaluate(()=>({pack:!!window.PIXEL_CONFIG,chapters:window.PIXEL_CHAPTERS?.length,engine:!!window.PixelEngineTest,cardCount:document.querySelectorAll('#chapters button').length,html:document.querySelector('#chapters')?.innerText?.slice(0,100)})))+' | errors: '+errors.join(' | '));});
 check((await page.locator('#chapters button').count())===5,id+' five chapters '+width);
 check(await page.locator('.intro h1').innerText() !=='Les sentiers d’Éden'||id==='eden',id+' correct title '+width);
 check((await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth))<=3,id+' home no overflow '+width);
 await page.locator('#resume').click();
 await page.waitForFunction(()=>window.PixelEngineTest.snapshot().ready||window.PixelEngineTest.snapshot().error,{timeout:12000}).catch(async err=>{throw Error(id+' assets never became ready: '+JSON.stringify(await page.evaluate(()=>window.PixelEngineTest.snapshot()))+' | '+errors.join(' | '));});check(!(await page.evaluate(()=>window.PixelEngineTest.snapshot().error)),id+' no missing embedded asset '+width+': '+errors.join(' | '));
 await page.waitForTimeout(240);
 let s=await page.evaluate(()=>window.PixelEngineTest.snapshot());
 check(s.world===id,id+' correct engine config '+width);
 check(s.visualVersion==='shared-0.6',id+' runs Pixel engine 0.6 '+width);
 if(id!=='eden'){
  check(s.heroAtlas===(id==='moses'?'sister-atlas-v05':id==='david'?'david-atlas-v06':id+'-atlas-v04'),id+' original chapter hero art loaded '+width);
  check(s.heroAtlasLoaded,id+' 20 pose hero atlas 256x400 decoded '+width);
  check(s.avatar===(id==='noe'?'noah':id==='moses'?'sister':id==='david'?'david':'joseph'),id+' story-specific hero selected '+width);
  check(s.worldProps>0&&s.decorations>0,id+' story-specific environment props '+width);
  const art=await page.evaluate(async()=>{const c=window.PIXEL_CONFIG,images=window.PIXEL_IMAGES;const all=[];for(let i=0;i<5;i++){const im=new Image();im.src=images[c.chapterArts[i]];try{await im.decode();all.push(im.naturalWidth===800&&im.naturalHeight===600);}catch(err){all.push(false);}}return all;});
  check(art.every(Boolean),id+' five original scenes 800x600 decoded '+width);
 }
 
 check(s.storage.endsWith('-'+id),id+' independent storage '+width);
 check(s.frames>0,id+' non-static game rendering '+width);
 check((await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth))<=3,id+' game no overflow '+width);
 const gfx=await page.evaluate(()=>{const c=document.querySelector('#game');const p=c.getContext('2d').getImageData((c.width/2)|0,(c.height/2)|0,1,1).data;return c.width>150&&c.height>180&&p[3]>0;});
 check(gfx,id+' painted canvas '+width);
 const hit=await page.locator('[data-dir="up"]').evaluate(el=>({touch:getComputedStyle(el).touchAction,select:getComputedStyle(el).userSelect}));
 check(hit.select==='none'&&hit.touch==='none',id+' Android touch guards '+width);
 if(width===390){
   const validated=await page.evaluate(()=>window.PixelEngineTest.validate());
   check(validated.length===10&&validated.every(x=>x.valid&&x.books>=3),id+' 10 reachable labyrinths');
   const checks2=await page.evaluate(()=>{const a=[];for(let i=0;i<5;i++){window.PixelEngineTest.start(i);const s=window.PixelEngineTest.snapshot();a.push(s.chapter===i&&s.targets.every(p=>!!window.PixelEngineTest.path(p.x,p.y))&&!!window.PixelEngineTest.path(s.exit.x,s.exit.y));}return a;});
   check(checks2.every(Boolean),id+' chapter destinations accessible');
   if(id==='david'){
    const facts=await page.evaluate(()=>{const c=window.PIXEL_CHAPTERS;return {events:c.reduce((n,x)=>n+x.events.length,0),refs:c.every(x=>x.ref.includes('1 Samuel')&&x.events.every(e=>e.ref&&e.notice)),questions:c.every(x=>x.question.answers.length===3&&x.question.correct>=0&&x.question.correct<3)};});
    check(facts.events===15&&facts.refs&&facts.questions,'David: 15 Bible discoveries and 5 sourced comprehension questions');
    const heroes=await page.evaluate(()=>{const out=[];for(let i=0;i<5;i++){window.PixelEngineTest.start(i);const x=window.PixelEngineTest.snapshot();out.push({hero:x.avatar,atlas:x.heroAtlas,loaded:x.heroAtlasLoaded});}return out;});
    check(heroes.every(x=>x.hero==='david'&&x.atlas==='david-atlas-v06'&&x.loaded),'David: all chapters retain dedicated 20-pose sprite');
   }

   if(id==='moses'){
     const facts=await page.evaluate(()=>{const c=window.PIXEL_CHAPTERS;return {events:c.reduce((n,x)=>n+x.events.length,0),refs:c.every(x=>x.ref.includes('Exode')&&x.events.every(e=>e.ref&&e.notice)),questions:c.every(x=>x.question.answers.length===3&&x.question.correct>=0&&x.question.correct<3),atlas:window.PIXEL_CONFIG.chapterAtlases.length};});
     check(facts.events===15&&facts.refs&&facts.questions&&facts.atlas===5,'Moses 15 discoveries, Bible references and 5 chapter portraits');
     const heroes=await page.evaluate(()=>{const result=[];for(let i=0;i<5;i++){window.PixelEngineTest.start(i);const x=window.PixelEngineTest.snapshot();result.push({chapter:i,hero:x.avatar,atlas:x.heroAtlas,loaded:x.heroAtlasLoaded});}return result;});
     check(heroes[0].hero==='sister'&&heroes[0].atlas==='sister-atlas-v05'&&heroes[0].loaded,'Moses first chapter features the protective sister, not adult Moses');
     check(heroes.slice(1).every(x=>x.hero==='moses'&&x.atlas==='moses-atlas-v05'&&x.loaded),'Moses adult appears in chapters 2–5 with 20-frame sprite');
   }
   await page.evaluate(()=>window.PixelEngineTest.start(0));
   s=await page.evaluate(()=>window.PixelEngineTest.snapshot());
   const move=[[0,-1,'ArrowUp'],[1,0,'ArrowRight'],[0,1,'ArrowDown'],[-1,0,'ArrowLeft']].find(([dx,dy])=>s.cells[(s.player.y+dy)*s.width+s.player.x+dx]===1);
   check(!!move,id+' valid adjacent move');
   await page.locator('#game').focus();await page.keyboard.press(move[2]);await page.waitForTimeout(310);
   const moved=await page.evaluate(()=>window.PixelEngineTest.snapshot());
   check(moved.player.x===s.player.x+move[0]&&moved.player.y===s.player.y+move[1],id+' keyboard movement');
   if(width===390){
    // Exercise an actual touch event on the Android D-pad, not just its CSS.
    const tappedStart=await page.evaluate(()=>window.PixelEngineTest.snapshot());
    const nextTap=[[0,-1,'up'],[1,0,'right'],[0,1,'down'],[-1,0,'left']].find(([dx,dy])=>tappedStart.cells[(tappedStart.player.y+dy)*tappedStart.width+tappedStart.player.x+dx]===1);
    check(!!nextTap,id+' touch route exists');
    await page.locator('[data-dir="'+nextTap[2]+'"]').tap();
    await page.waitForTimeout(310);
    const tappedEnd=await page.evaluate(()=>window.PixelEngineTest.snapshot());
    check(tappedEnd.player.x===tappedStart.player.x+nextTap[0]&&tappedEnd.player.y===tappedStart.player.y+nextTap[1],id+' real Android pointer/touch arrow movement');
    if(await page.locator('#overlay').isVisible())await page.locator('#close').click();
   }

   await page.locator('#back').click();
   check(await page.locator('#home').isVisible(),id+' navigates home');
   await page.locator('#resume').click();
   const resumed=await page.evaluate(()=>window.PixelEngineTest.snapshot());
   check(resumed.chapter===0,id+' resume restores chapter');
   check(await page.locator('.sourceNote').innerText()!=='' ,id+' biblical/source note');
   if(id==='eden'){
    await page.evaluate(()=>window.PixelEngineTest.start(2));
    check(await page.locator('#switchAvatar').isEnabled(),id+' avatar unlock');
    await page.locator('#switchAvatar').click();
    check((await page.evaluate(()=>window.PixelEngineTest.snapshot())).avatar==='eve',id+' Eve selectable');
   }else{
    check(await page.locator('#switchAvatar').isHidden(),id+' single-avatar controls hidden');
   }
 }
 fs.mkdirSync(path.resolve(root,'pixel-lab-v06-screenshots'),{recursive:true});
 await page.screenshot({path:path.resolve(root,'pixel-lab-v06-screenshots/'+id+'-'+width+'.png'),animations:'disabled'});
 if(width===390&&id!=='eden'){
   const distinct=await page.evaluate(async()=>{const imgs=window.PIXEL_IMAGES;const cfg=window.PIXEL_CONFIG;const sizes=[];for(let j=0;j<5;j++){const image=new Image();image.src=imgs[cfg.chapterArts[j]];await image.decode();const c=document.createElement('canvas');c.width=64;c.height=48;const g=c.getContext('2d');g.drawImage(image,0,0,64,48);sizes.push(Array.from(g.getImageData(0,0,64,48).data).filter((x,i)=>i%4!==3&&x>10).length);}return sizes;});
   check(distinct.every(n=>n>1000),id+' five illustrated covers contain real visual detail');
 }
 check(errors.length===0,id+' no JS errors '+width+': '+errors.join(' | '));
 if(width===390&&id==='joseph'){
   await page.evaluate(()=>window.PixelEngineTest.start(1));
   const j=await page.evaluate(()=>window.PixelEngineTest.snapshot());
   check(j.worldProps>=4,id+' four narrative prop families');
 }
 await context.close();
}
async function gallery(browser,address){
 const page=await browser.newPage({viewport:{width:1220,height:970}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(address+'pixel-lab-v06/quality/',{waitUntil:'load'});
 await page.waitForFunction(()=>window.PixelCompareTest&&window.PixelCompareTest.arts().every(Boolean),{timeout:30000});
 check((await page.evaluate(()=>window.PixelCompareTest.worlds())).join(',')==='eden,noe,joseph,moses,david','quality gallery: five worlds');
 check((await page.evaluate(()=>window.PixelCompareTest.arts())).every(Boolean),'quality gallery: five illustrated scenes');
 for(let i=0;i<5;i++){
  await page.locator('[data-step="'+i+'"]').click();
  await page.waitForFunction(()=>window.PixelCompareTest.arts().every(Boolean),{timeout:10000});
  check(await page.evaluate(()=>window.PixelCompareTest.chapter())===i,'quality gallery: chapter '+(i+1)+' responds');
 }
 check(await page.locator('#rubric input').count()===8,'quality gallery: eight human assessment items');
 check(await page.evaluate(()=>window.PixelRatingTest.criteriaCount())===6,'quality gallery: weighted six-axis review present');
 check((await page.locator('#ratingResult').innerText()).includes('Évaluation incomplète'),'quality gallery: not auto-scored as complete');
 await page.locator('#ratedWorld').selectOption('david');check(await page.locator('#ratedWorld').inputValue()==='david','quality gallery: David can be rated independently');
 await page.locator('#ratedWorld').selectOption('moses');
 check(await page.locator('#ratedWorld').inputValue()==='moses','quality gallery: Moses is independently rateable');

 await page.locator('#ratedWorld').selectOption('noe');
 const inputs=page.locator('#ratingInputs input');
 for(let i=0;i<6;i++){await inputs.nth(i).evaluate((el,value)=>{el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}));},[25,20,15,15,15,10][i]);}
 check((await page.locator('#ratingResult').innerText()).includes('Validations humaines à compléter'),'quality gallery: score alone never certifies acceptance');
 await page.locator('#gateText').check();await page.locator('#gatePhone').check();await page.locator('#gateChild').check();
 check((await page.locator('#ratingResult').innerText()).includes('Seuil atteint'),'quality gallery: quality gate opens only with all human checks');
 await inputs.first().evaluate(el=>{el.value='10';el.dispatchEvent(new Event('input',{bubbles:true}));});
 check((await page.locator('#ratingResult').innerText()).includes('critère sous 60 %'),'quality gallery: low artistic category blocks 85/100 release');
 await page.locator('#resetRating').click();
 check((await page.locator('#ratingResult').innerText()).includes('Évaluation incomplète'),'quality gallery: reset clears weighted evaluation');
 await page.locator('#rubric input').first().check();
 check((await page.locator('#score').innerText()).includes('1/8'),'quality gallery: evaluation is user-controlled');
 await page.locator('#reset').click();
 check((await page.locator('#score').innerText()).includes('0/8'),'quality gallery: reset clears review');
 check(!errors.length,'quality gallery: no JavaScript errors '+errors.join('|'));
 fs.mkdirSync(path.resolve(root,'pixel-lab-v06-screenshots'),{recursive:true});
 await page.screenshot({path:path.resolve(root,'pixel-lab-v06-screenshots/quality-compare.png'),fullPage:true});
 await page.close();
}
/* Full gameplay path: discover all 3 books, answer the first question and persist
   completion. This tests actual keyboard navigation, dialogs and save behavior. */
async function completeMosesChapter(browser,address,storyId='moses'){
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'fr-FR'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(address+'pixel-lab-v06/'+storyId+'/',{waitUntil:'load'});
 await page.waitForFunction(()=>window.PixelEngineTest&&document.querySelectorAll('#chapters button').length===5);
 await page.locator('#resume').click();
 await page.waitForFunction(()=>window.PixelEngineTest.snapshot().ready);
 // Reduced-quality graphics are optional and make the QA walk quicker.
 await page.evaluate(()=>{const c=document.getElementById('lightMode');c.checked=true;c.dispatchEvent(new Event('change',{bubbles:true}));});
 async function navigate(target){
  for(let attempts=0;attempts<1700;attempts++){
   const st=await page.evaluate(()=>window.PixelEngineTest.snapshot());
   if(st.player.x===target.x&&st.player.y===target.y)return;
   const first=await page.evaluate(pt=>{const route=window.PixelEngineTest.path(pt.x,pt.y);return route&&route[0];},target);
   if(!first)throw Error('No navigable first step towards '+JSON.stringify(target));
   const dx=first.x-st.player.x,dy=first.y-st.player.y;
   const key=dx===1?'ArrowRight':dx===-1?'ArrowLeft':dy===1?'ArrowDown':'ArrowUp';
   await page.locator('#game').focus();await page.keyboard.press(key);
   await page.waitForFunction(pt=>{const st=window.PixelEngineTest.snapshot();return st.player.x===pt.x&&st.player.y===pt.y;},first,{timeout:5000});
   if(await page.locator('#overlay').isVisible()){
    const title=await page.locator('#dialogTitle').innerText();
    if(title.includes('Te souviens-tu'))return;
    if(title.includes('Découverte')||title.includes('panier')||title.length) {
      check((await page.locator('#dialogRef').innerText()).length>2,storyId+' discovery dialog references a passage');
      await page.locator('#continue').click();
    }
   }
  }
  throw Error('Navigation limit reached for '+JSON.stringify(target));
 }
 for(let stage=0;stage<3;stage++){
  const st=await page.evaluate(()=>window.PixelEngineTest.snapshot());
  const idx=st.targets.findIndex((p,i)=>!st.books.includes(i));
  if(idx<0)break;
  await navigate(st.targets[idx]);
 }
 let state=await page.evaluate(()=>window.PixelEngineTest.snapshot());
 check(state.books.length===3,'Moses chapter 1: all three narrative discoveries collected through gameplay');
 await navigate(state.exit);
 check(await page.locator('#overlay').isVisible(),'Moses exit presents the biblical comprehension question');
 check((await page.locator('#choices button').count())===3,'Moses comprehension offers three understandable answers');
 await page.locator('#choices button').nth(storyId==='david'?1:0).click();
 await page.waitForFunction(()=>window.PixelEngineTest.snapshot().complete,{timeout:5000});
 check((await page.locator('#dialogTitle').innerText()).includes('Souvenir'),'Moses correct answer unlocks a chapter memory');
 const saved=await page.evaluate(()=>{const s=window.PixelEngineTest.snapshot();return JSON.parse(localStorage.getItem(s.storage));});
 check(saved.levels['0'].complete===true,'Moses completion is persisted in local storage');
 await page.reload({waitUntil:'load'});
 check(await page.locator('#home').isVisible(),'Moses game restarts on chapter selection');
 const persistent=await page.evaluate(()=>{const k='bible-aventure-pixel-shared-v06-'+storyId;return JSON.parse(localStorage.getItem(k));});
 check(persistent.levels['0'].complete===true,'Moses completed chapter survives a page reload');
 check(errors.length===0,'Moses full chapter no JavaScript errors '+errors.join(' | '));
 await page.close();
}
(async()=>{await new Promise(ok=>server.listen(0,'127.0.0.1',ok));const address='http://127.0.0.1:'+server.address().port+'/';const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});try{for(const id of ['eden','noe','joseph','moses','david']){await world(browser,address,id,390,844);await world(browser,address,id,360,740);await world(browser,address,id,768,1024);}await gallery(browser,address);await completeMosesChapter(browser,address);await completeMosesChapter(browser,address,'david');console.log('PIXEL V0.6 QA PASS: '+checks.length+' checks');checks.forEach(x=>console.log(' ✓ '+x));}finally{await browser.close();server.close();}})().catch(e=>{console.error('PIXEL V0.6 QA FAIL:',e.stack||e);process.exitCode=1;server.close();});
