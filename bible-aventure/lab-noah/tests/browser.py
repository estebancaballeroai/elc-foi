"""Real-input Chromium acceptance tests. Start HTTP server at repo root on :8000.
Run: python bible-aventure/lab-noah/tests/browser.py
Requires Playwright Python + Chromium. Output contains evidence, not a simulated completion.
"""
from playwright.sync_api import sync_playwright, expect
from pathlib import Path
import json, time, hashlib, subprocess
ROOT=Path(__file__).resolve().parents[1]
BASE='http://127.0.0.1:8000/bible-aventure/'
URL=BASE+'lab-noah/'
REPORT={'browser':'Chromium via Playwright','viewports':[],'checks':[], 'errors':[]}
KEY='bible-aventure-lab-noah-pixel-v1'
PROD='bible-aventure-eden-premium-v01'
SENTINEL='{"production":"preserve-byte-for-byte","levels":{"5":{"seen":[0]}}}'
def check(name,condition=True):
 assert condition,name
 REPORT['checks'].append(name)
 print('PASS',name,flush=True)
def ready(page):
 page.goto(URL)
 page.wait_for_function('window.NoahLab && NoahLab.snapshot().ready')
def snap(page):return page.evaluate('NoahLab.snapshot()')
def close(page):
 if page.locator('#overlay').is_visible():page.locator('#close').click()
def walk(page,x,y,capture=None):
 path=page.evaluate('p=>NoahLab.path(p[0],p[1])',[x,y])
 assert path is not None,(x,y)
 for dest in path:
  close(page)
  s=snap(page)['player'];dx=dest['x']-s['x'];dy=dest['y']-s['y']
  k='ArrowRight' if dx>0 else 'ArrowLeft' if dx<0 else 'ArrowDown' if dy>0 else 'ArrowUp'
  page.keyboard.press(k)
  page.wait_for_function('p=>{var s=NoahLab.snapshot();return !s.moving&&s.player.x===p.x&&s.player.y===p.y}',arg=dest,timeout=4000)
  if page.locator('#overlay').is_visible():
   if capture:page.screenshot(path=str(ROOT/'captures'/capture),full_page=True)
   close(page)
 return len(path)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 # Existing application: map accessibility and actual chapter startup on all 50.
 context=browser.new_context()
 page=context.new_page()
 page.on('pageerror',lambda e:REPORT['errors'].append(str(e)))
 page.goto(BASE)
 data={'stories':page.evaluate('__BIBLE_TEST__.stories.length'),'levels':page.evaluate('__BIBLE_TEST__.levels.length'),'results':[],'started':[]}
 for mode,button in [('decouverte','#modeDiscovery'),('aventure','#modeAdventure')]:
  page.locator(button).click()
  data['results'].append({'mode':mode,'maps':page.evaluate('__BIBLE_TEST__.validateBoards()')})
 data['started']=page.evaluate('''()=>{var started=[];for(var i=0;i<50;i++){__BIBLE_TEST__.startChapter(i,false);started.push({n:i,events:__BIBLE_TEST__.board.events.length});}return started;}''')
 check('Original: 10 récits et 50 chapitres',data['stories']==10 and data['levels']==50)
 check('Original: 100 cartes accessibles, livres, énigmes, souvenirs et sortie',sum(len(r['maps']) for r in data['results'])==100)
 check('Original: les 50 chapitres démarrent',len(data['started'])==50)
 (ROOT/'captures'/'legacy-maps.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
 context.close()
 for width,height in [(320,568),(390,844),(768,1024),(1280,900)]:
  context=browser.new_context(viewport={'width':width,'height':height},has_touch=True)
  page=context.new_page();page.on('pageerror',lambda e:REPORT['errors'].append(str(e)))
  ready(page)
  page.evaluate('p=>localStorage.setItem(p[0],p[1])',[PROD,SENTINEL])
  page.wait_for_timeout(3600)
  page.screenshot(path=str(ROOT/'captures'/f'gameplay-{width}.png'),full_page=True)
  geometry=page.evaluate('''()=>{var a=[];document.querySelectorAll('[data-dir],#interact').forEach(function(b){var r=b.getBoundingClientRect();a.push({x:r.x,y:r.y,w:r.width,h:r.height});});return {overflow:document.documentElement.scrollWidth>innerWidth,controls:a};}''')
  check(f'{width}px: aucune barre horizontale',not geometry['overflow'])
  check(f'{width}px: 5 commandes visibles et cibles >= 48px',all(r['w']>=48 and r['h']>=48 and r['x']>=0 and r['y']>=0 and r['y']+r['h']<=height for r in geometry['controls']))
  # A real touch tap, followed by collision against the unwalkable river.
  page.locator('[data-dir="left"]').tap();page.wait_for_function('!NoahLab.snapshot().moving')
  check(f'{width}px: déplacement tactile',snap(page)['player']['x']==2)
  page.locator('[data-dir="left"]').tap();page.wait_for_timeout(250)
  check(f'{width}px: collision de la rivière',snap(page)['player']['x']==2)
  page.locator('[data-dir="right"]').tap();page.wait_for_function('!NoahLab.snapshot().moving')
  # Touch a nearby visible path. Camera projection derives from diagnostics, never mutates game state.
  s=snap(page);rect=page.locator('#game').bounding_box();internal=page.locator('#game').evaluate('(c)=>({w:c.width,h:c.height})')
  target={'x':3,'y':14}
  tx=rect['x']+((target['x']*32+16)-s['camera']['x'])*rect['width']/internal['w'];ty=rect['y']+((target['y']*32+16)-s['camera']['y'])*rect['height']/internal['h']
  page.touchscreen.tap(tx,ty)
  page.wait_for_function('NoahLab.snapshot().player.y===14&&!NoahLab.snapshot().moving')
  check(f'{width}px: navigation par toucher du chemin')
  steps=0
  for n,(x,y) in enumerate([(3,3),(11,11),(23,15)]):
   steps+=walk(page,x,y,f'discovery-{width}.png' if n==0 else None)
   check(f'{width}px: livre {n+1} découvert avec vraies touches clavier',n in snap(page)['books'])
  # Reload must restore exact position and books without touching the production save.
  before=snap(page);page.reload();page.wait_for_function('NoahLab.snapshot().ready')
  after=snap(page)
  check(f'{width}px: reprise de position et livres',before['player']['x']==after['player']['x'] and before['player']['y']==after['player']['y'] and before['books']==after['books'])
  steps+=walk(page,22,8)
  page.wait_for_timeout(3500)
  page.screenshot(path=str(ROOT/'captures'/f'ark-{width}.png'),full_page=True)
  actor_clear=page.evaluate("""()=>{var s=NoahLab.snapshot(),c=document.getElementById('game'),r=c.getBoundingClientRect(),sx=r.width/c.width,sy=r.height/c.height;var actors=[{x:s.player.x*32+16,y:s.player.y*32+27,w:32,h:40},{x:20*32+16,y:8*32+29,w:26,h:39}];var buttons=Array.from(document.querySelectorAll('[data-dir],#interact')).map(b=>b.getBoundingClientRect());return actors.every(a=>{var left=r.x+(a.x-a.w/2-s.camera.x)*sx,right=left+a.w*sx,bottom=r.y+(a.y-s.camera.y)*sy,top=bottom-a.h*sy;return buttons.every(b=>right<=b.left||left>=b.right||bottom<=b.top||top>=b.bottom);});}""")
  check(f'{width}px: Noé et explorateur dégagés des commandes devant l’arche',actor_clear)
  if width==1280:page.locator('#game').screenshot(path=str(ROOT/'captures'/'ark-world.png'))

  # Keyboard action opens final quiz. Wrong answer never traps the child.
  page.keyboard.press(' ')
  expect(page.locator('#dialogTitle')).to_have_text('Te souviens-tu de l’histoire ?')
  page.locator('#choices button').nth(1).click()
  expect(page.locator('#feedback')).to_contain_text('Tu peux réessayer')
  page.locator('#choices button').first.click()
  expect(page.locator('#dialogTitle')).to_have_text('Le souvenir du bâtisseur')
  check(f'{width}px: mauvaise réponse puis fin et médaille',snap(page)['complete'])
  page.screenshot(path=str(ROOT/'captures'/f'reward-{width}.png'),full_page=True)
  close(page)
  page.locator('#library').click();page.locator('#choices button').first.click()
  expect(page.locator('#dialogTitle')).to_have_text('Un homme appelé Noé')
  check(f'{width}px: carnet relisible')
  page.keyboard.press('Escape')
  check(f'{width}px: dialogue fermé au clavier',page.locator('#overlay').is_hidden())
  page.reload();page.wait_for_function('NoahLab.snapshot().ready')
  check(f'{width}px: médaille conservée au rechargement',snap(page)['complete'])
  check(f'{width}px: sauvegarde production préservée',page.evaluate('k=>localStorage.getItem(k)',PROD)==SENTINEL)
  REPORT['viewports'].append({'width':width,'height':height,'stepsThroughRealInput':steps,'geometry':geometry})
  context.close()
 # Robustness: storage disabled, corrupt record, reduced motion, absent pointer events.
 context=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce',has_touch=True)
 context.add_init_script('''Object.defineProperty(window,'PointerEvent',{value:undefined});var set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='bible-aventure-lab-noah-pixel-v1')throw new DOMException('full','QuotaExceededError');return set.call(this,k,v);};''')
 page=context.new_page();page.on('pageerror',lambda e:REPORT['errors'].append(str(e)));ready(page)
 page.locator('[data-dir="up"]').tap();page.wait_for_function('!NoahLab.snapshot().moving');page.wait_for_timeout(450)
 check('Repli tactile sans PointerEvent',snap(page)['player']['y']==14)
 check('prefers-reduced-motion respecté',snap(page)['reduced'])
 expect(page.locator('#saveStatus')).to_be_visible();check('Quota localStorage: avertissement visible, jeu fonctionnel')
 page.locator('#help').click();page.locator('#continue').focus();page.keyboard.press('Tab')
 check('Focus contenu dans le dialogue',page.locator('#close').evaluate('(b)=>b===document.activeElement'))
 context.close()
 context=browser.new_context();context.add_init_script("localStorage.setItem('"+KEY+"','{broken-json')")
 page=context.new_page();ready(page);check('JSON altéré: démarrage récupérable',snap(page)['books']==[])
 context.close()
 context=browser.new_context();context.add_init_script("localStorage.setItem('"+KEY+"',JSON.stringify({version:1,books:[99,0,0,'x'],position:{x:0,y:0},complete:true}))")
 page=context.new_page();ready(page);s=snap(page);check('Champs altérés normalisés sans fausse récompense',s['books']==[0] and not s['complete'] and s['player']['x']==3)
 context.close()
 context=browser.new_context();page=context.new_page();page.route('**/assets/cedar.png',lambda route:route.abort());page.goto(URL)
 page.wait_for_function('NoahLab.snapshot().failed');expect(page.locator('#mission')).to_contain_text('Images indisponibles');check('Ressource manquante signalée')
 context.close()
 check('Aucune erreur JavaScript dans les parcours',not REPORT['errors'])
 browser.close()
REPORT['passed']=len(REPORT['checks']);REPORT['status']='PASS'
(ROOT/'captures'/'test-results.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2))
print('TOTAL',REPORT['passed'],'PASS',flush=True)
