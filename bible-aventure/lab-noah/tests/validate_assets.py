from pathlib import Path
from PIL import Image
import hashlib,json
root=Path(__file__).resolve().parents[1]
a=root/'assets';checks=[]
def check(label,value):
 assert value,label
 checks.append(label)
 print('PASS',label)
atlas=Image.open(a/'explorer.png')
check('Atlas animation 4 x 4 cellules 48 x 64',atlas.size==(192,256))
frames=list((a/'frames').glob('*.png'))
check('16 sprites séparés',len(frames)==16)
for direction in ['down','left','right','up']:
 hashes=[]
 for n in range(4):
  im=Image.open(a/'frames'/f'explorer-{direction}-{n}.png').convert('RGBA');box=im.getbbox()
  assert im.size==(48,64) and box and box[3]==60,(direction,n,box)
  assert not any(r>180 and b>180 and g<70 and alpha>0 for r,g,b,alpha in im.getdata())
  hashes.append(hashlib.sha256(im.tobytes()).hexdigest())
 check('Marche '+direction+': poses distinctes, pieds alignés, transparence',len(set(hashes))>=2)
for n in ['cedar','flowers','boulder','ark','noah','sheep','book','doves','chest']:
 im=Image.open(a/(n+'.png')).convert('RGBA')
 assert im.getbbox() and min(im.getchannel('A').getextrema())==0,n
 assert not any(r>180 and b>180 and g<70 and alpha>0 for r,g,b,alpha in im.getdata()),n
check('9 objets détourés sans fond magenta visible',True)
for n in ['grass','sand','water','planks']:
 assert Image.open(a/(n+'.png')).size==(96,96),n
check('4 matériaux réutilisables de 96 px',True)
runtime=[p for p in a.glob('*.png') if not p.name.startswith('concept-')]
size=sum(p.stat().st_size for p in runtime)
check('Budget images runtime inférieur à 400 Kio',size<400*1024)
files=[]
for p in sorted(a.rglob('*.png')):
 im=Image.open(p);files.append({'file':str(p.relative_to(root)),'size':list(im.size),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(root/'docs'/'asset-manifest.json').write_text(json.dumps({'runtimeImageBytes':size,'files':files},ensure_ascii=False,indent=2))
(root/'captures'/'asset-tests.json').write_text(json.dumps({'status':'PASS','checks':checks,'runtimeImageBytes':size},ensure_ascii=False,indent=2))
print('TOTAL',len(checks),'PASS; runtime',size,'bytes')
