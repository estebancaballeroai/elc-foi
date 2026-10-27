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
 await page.goto(address+'pixel-lab-v03/'+id+'/',{waitUntil:'load'});
 await page.waitForFunction(()=>window.PixelEngineTest&&document.querySelectorAll('#chapters button').length===5,{timeout:7000}).catch(async()=>{throw Error(id+' initialization failed: '+JSON.stringify(await page.evaluate(()=>({pack:!!window.PIXEL_CONFIG,chapters:window.PIXEL_CHAPTERS?.length,engine:!!window.PixelEngineTest,cardCount:document.querySelectorAll('#chapters button').length,html:document.querySelector('#chapters')?.innerText?.slice(0,100)})))+' | errors: '+errors.join(' | '));});
 check((await page.locator('#chapters button').count())===5,id+' five chapters '+width);
 check(await page.locator('.intro h1').innerText() !=='Les sentiers d’Éden'||id==='eden',id+' correct title '+width);
 check((await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth))<=3,id+' home no overflow '+width);
 await page.locator('#resume').click();
 await page.waitForFunction(()=>window.PixelEngineTest.snapshot().ready||window.PixelEngineTest.snapshot().error,{timeout:12000}).catch(async err=>{throw Error(id+' assets never became ready: '+JSON.stringify(await page.evaluate(()=>window.PixelEngineTest.snapshot()))+' | '+errors.join(' | '));});check(!(await page.evaluate(()=>window.PixelEngineTest.snapshot().error)),id+' no missing embedded asset '+width+': '+errors.join(' | '));
 await page.waitForTimeout(240);
 let s=await page.evaluate(()=>window.PixelEngineTest.snapshot());
 check(s.world===id,id+' correct engine config '+width);
 check(s.visualVersion==='shared-0.3',id+' runs Pixel engine 0.3 '+width);
 if(id!=='eden'){
  check(s.heroAtlas===id+'-atlas-v03',id+' original hero art loaded '+width);
  check(s.heroAtlasLoaded,id+' 20 pose hero atlas 256x400 decoded '+width);
  check(s.avatar===(id==='noe'?'noah':'joseph'),id+' story-specific hero selected '+width);
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
 fs.mkdirSync(path.resolve(root,'pixel-lab-v03-screenshots'),{recursive:true});
 await page.screenshot({path:path.resolve(root,'pixel-lab-v03-screenshots/'+id+'-'+width+'.png'),animations:'disabled'});
 if(width===390&&id!=='eden'){
   const distinct=await page.evaluate(async()=>{const imgs=window.PIXEL_IMAGES;const cfg=window.PIXEL_CONFIG;const sizes=[];for(let j=0;j<5;j++){const image=new Image();image.src=imgs[cfg.chapterArts[j]];await image.decode();const c=document.createElement('canvas');c.width=64;c.height=48;const g=c.getContext('2d');g.drawImage(image,0,0,64,48);sizes.push(Array.from(g.getImageData(0,0,64,48).data).filter((x,i)=>i%4!==3&&x>10).length);}return sizes;});
   check(distinct.every(n=>n>1000),id+' five illustrated covers contain real visual detail');
 }
 check(errors.length===0,id+' no JS errors '+width+': '+errors.join(' | '));
 await context.close();
}
(async()=>{await new Promise(ok=>server.listen(0,'127.0.0.1',ok));const address='http://127.0.0.1:'+server.address().port+'/';const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});try{for(const id of ['eden','noe','joseph']){await world(browser,address,id,390,844);await world(browser,address,id,360,740);await world(browser,address,id,768,1024);}console.log('PIXEL V0.3 QA PASS: '+checks.length+' checks');checks.forEach(x=>console.log(' ✓ '+x));}finally{await browser.close();server.close();}})().catch(e=>{console.error('PIXEL V0.3 QA FAIL:',e.stack||e);process.exitCode=1;server.close();});
