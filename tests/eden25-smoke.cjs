'use strict';
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const html = fs.readFileSync(path.resolve(__dirname, '../bible-aventure-eden-pixel-v25/index.html'), 'utf8');
const checked = [];
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/favicon')) { res.writeHead(204); res.end(); return; }
  res.writeHead(200, {'content-type':'text/html; charset=utf-8','cache-control':'no-cache'});
  res.end(html);
});
const check = (truth, message) => { assert.ok(truth, message); checked.push(message); };
const delay = (ms) => new Promise(resolve => setTimeout(resolve,ms));

async function testLayout(browser, width, height, reduced=false) {
  const ctx=await browser.newContext({viewport:{width,height},isMobile:width<600,hasTouch:width<600,reducedMotion:reduced?'reduce':'no-preference'});
  const page=await ctx.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error' && !m.text().includes('favicon'))errors.push(m.text());});
  await page.goto(address,{waitUntil:'load'});
  await page.waitForFunction(()=>window.EDEN_CHAPTERS && window.EDEN_CHAPTERS.length===5);
  check(await page.title() === 'Bible Aventure · Éden Pixel Art v2.5 · 5 chapitres','title v2.5 '+width);
  check((await page.locator('#chapters .chapter-card').count())===5,'five selectable chapters '+width);
  const homeOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  check(homeOverflow<=3, 'home no horizontal body overflow '+width+': '+homeOverflow);
  await page.locator('#resume').click();
  await page.waitForFunction(()=>window.EdenPixelTest && window.EdenPixelTest.snapshot().ready,{timeout:30000});
  await page.waitForTimeout(350);
  let snap=await page.evaluate(()=>window.EdenPixelTest.snapshot());
  check(snap.visualVersion==='2.5' && snap.chapter===0,'v2.5 engine initialized '+width);
  check(snap.storage==='bible-aventure-eden-pixel-v25','isolated save key '+width);
  check(snap.frames>0,'canvas painting frames '+width);
  const hit=await page.evaluate(()=>{
    const a=document.querySelector('[data-dir="up"]'),v=getComputedStyle(a);
    return {userSelect:v.userSelect,touchAction:v.touchAction,webkitUserSelect:v.webkitUserSelect};
  });
  check(hit.userSelect==='none'&&hit.touchAction==='none','Android directional buttons not selectable '+width);
  const errs=await page.evaluate(()=>{
    const c=document.querySelector('#game'),r=c.getBoundingClientRect();
    const i=c.getContext('2d').getImageData(Math.floor(c.width/2),Math.floor(c.height/2),1,1).data;
    return {canvasWidth:c.width,canvasHeight:c.height,visible:r.width>0 && r.height>0,pixel:[...i]};
  });
  check(errs.visible && errs.canvasWidth>150 && errs.canvasHeight>180 && errs.pixel[3]>0,'non-blank canvas and responsive stage '+width);
  const playOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  check(playOverflow<=3,'game no horizontal overflow '+width+': '+playOverflow);
  if(width===390) {
    const checks=await page.evaluate(()=>window.EdenPixelTest.validate());
    check(checks.length===10 && checks.every(v=>v.valid && v.books>=3),'10 maze variants reachable');
    await page.waitForTimeout(120);
    snap=await page.evaluate(()=>window.EdenPixelTest.snapshot());
    const neighbors=[[0,-1,'ArrowUp'],[1,0,'ArrowRight'],[0,1,'ArrowDown'],[-1,0,'ArrowLeft']];
    const move=neighbors.find(([dx,dy])=> {
      const nx=snap.player.x+dx,ny=snap.player.y+dy;
      return nx>=0&&ny>=0&&nx<snap.width&&ny<snap.height&&snap.cells[ny*snap.width+nx]===1;
    });
    check(!!move,'a traversable adjacent tile exists');
    await page.locator('#game').focus();
    await page.keyboard.press(move[2]);
    await page.waitForTimeout(400);
    const moved=await page.evaluate(()=>window.EdenPixelTest.snapshot());
    check(moved.player.x===snap.player.x+move[0]&&moved.player.y===snap.player.y+move[1],'keyboard tile movement');
    check(moved.direction===({ArrowUp:'up',ArrowRight:'right',ArrowDown:'down',ArrowLeft:'left'})[move[2]],'heading preserved after movement');
    check(moved.footsteps>=1,'footstep feedback after movement');
    await page.locator('#back').click();
    await page.waitForTimeout(150);
    await page.evaluate(()=>window.EdenPixelTest.start(2));
    await page.waitForTimeout(180);
    check(await page.locator('#switchAvatar').isEnabled(),'avatar toggle enabled after chapter 2');
    await page.locator('#switchAvatar').click();
    const avatar=await page.evaluate(()=>window.EdenPixelTest.snapshot().avatar);
    check(avatar==='eve','Eve selectable in chapter 3');
    await page.reload({waitUntil:'load'});
    await page.locator('#resume').click();
    await page.waitForFunction(()=>window.EdenPixelTest && window.EdenPixelTest.snapshot().ready);
    check((await page.evaluate(()=>window.EdenPixelTest.snapshot())).avatar==='eve','avatar preserved by v2.5 local save');
    const coverage=await page.evaluate(()=> {
      const levels=[];
      for(let i=0;i<5;i++){window.EdenPixelTest.start(i);const s=window.EdenPixelTest.snapshot();levels.push({i:s.chapter,goals:s.targets.length,reachable:s.targets.every(t=>!!window.EdenPixelTest.path(t.x,t.y)),exit:!!window.EdenPixelTest.path(s.exit.x,s.exit.y)});}
      return levels;
    });
    check(coverage.length===5 && coverage.every((s,i)=>s.i===i&&s.goals>=3&&s.reachable&&s.exit),'five chapters accessible with reachable objectives');
    await page.waitForTimeout(240);
  }
  fs.mkdirSync(path.resolve(__dirname, '../eden-v25-screenshots'),{recursive:true});
  await page.screenshot({path:path.resolve(__dirname,'../eden-v25-screenshots/mobile-'+width+'.png'),animations:'disabled'});
  check(errors.length===0,'no runtime JavaScript errors '+width+': '+errors.join(' / '));
  await ctx.close();
}
let address;
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  address='http://127.0.0.1:'+server.address().port+'/';
  const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage','--no-sandbox']});
  try{
    await testLayout(browser,390,844);
    await testLayout(browser,360,740);
    await testLayout(browser,768,1024);
    await testLayout(browser,1280,800);
    await testLayout(browser,390,844,true);
    console.log('EDEN V2.5 QA PASS: '+checked.length+' assertions');
    checked.forEach(v=>console.log(' ✓ '+v));
  } finally {
    await browser.close();
  }
})().catch(e=>{console.error('EDEN V2.5 QA FAILED:',e.stack||e);process.exitCode=1;}).finally(()=>server.close());
