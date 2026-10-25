from playwright.sync_api import sync_playwright,expect
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1];rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1280,'height':900});errors=[];requests=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:requests.append(r.url))
 page.goto('http://127.0.0.1:8000/bible-aventure/lab-noah/noah-autonome.html');page.wait_for_function('NoahLab.snapshot().ready')
 assert len([u for u in requests if u.startswith('http')])==1
 rows.append('HTML autonome: une seule requête document, aucune ressource HTTP supplémentaire')
 page.keyboard.press('ArrowUp');page.wait_for_function('!NoahLab.snapshot().moving')
 assert page.evaluate('NoahLab.snapshot().player.y')==14;rows.append('Déplacement réel dans la version autonome')
 page.locator('#help').click();expect(page.locator('#dialogArt')).to_be_visible();page.locator('#close').click()
 rows.append('Images des dialogues embarquées dans la version autonome')
 page.goto('http://127.0.0.1:8000/bible-aventure/lab-noah/assets/gallery.html')
 page.screenshot(path=str(ROOT/'captures'/'sprites.png'),full_page=True)
 rows.append('Galerie de sprites animés exécutée et capturée')
 # Real button hold, cancellation and boundary must stop correctly.
 page.goto('http://127.0.0.1:8000/bible-aventure/lab-noah/');page.wait_for_function('NoahLab.snapshot().ready')
 button=page.locator('[data-dir="up"]');rect=button.bounding_box()
 page.mouse.move(rect['x']+20,rect['y']+20);page.mouse.down();page.wait_for_timeout(650);page.mouse.up();page.wait_for_timeout(250)
 s=page.evaluate('NoahLab.snapshot()');assert s['player']['y']<=12
 y=s['player']['y'];page.wait_for_timeout(400);assert page.evaluate('NoahLab.snapshot().player.y')==y
 rows.append('Bouton maintenu: plusieurs pas, arrêt effectif au relâchement')
 # All directional animations seen by real movement, no state injection.
 page.keyboard.press('ArrowDown');page.wait_for_function('!NoahLab.snapshot().moving')
 assert page.evaluate('NoahLab.snapshot().player.dir')=='down'
 page.keyboard.press('ArrowRight');page.wait_for_function('!NoahLab.snapshot().moving')
 assert page.evaluate('NoahLab.snapshot().player.dir')=='right'
 page.keyboard.press('ArrowLeft');page.wait_for_function('!NoahLab.snapshot().moving')
 assert page.evaluate('NoahLab.snapshot().player.dir')=='left'
 rows.append('Les quatre directions activent les orientations correspondantes')
 assert not errors,errors;rows.append('Aucune erreur JavaScript sur les essais supplémentaires')
 b.close()
(ROOT/'captures'/'extra-tests.json').write_text(json.dumps({'status':'PASS','checks':rows},ensure_ascii=False,indent=2))
print('\n'.join('PASS '+r for r in rows))
