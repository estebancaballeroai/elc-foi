from pathlib import Path
import re,base64
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
css=(root/'style.css').read_text()
js=(root/'game.js').read_text()
names=['cedar','flowers','boulder','ark','noah','sheep','book','doves','chest','explorer','grass','sand','water','planks']
images={n:'data:image/png;base64,'+base64.b64encode((root/'assets'/(n+'.png')).read_bytes()).decode() for n in names}
import json
js=js.replace("var names=['cedar'",'var embeddedImages='+json.dumps(images)+';\nvar names=[\'cedar\'')
js=js.replace("im.src='assets/'+name+'.png'","im.src=embeddedImages[name]")
js=js.replace("$('dialogArt').src='assets/'+(art||'book')+'.png'","$('dialogArt').src=embeddedImages[art||'book']")
html=html.replace('<link rel="stylesheet" href="style.css">','<style>'+css+'</style>')
html=html.replace('<script src="game.js"></script>','<script>'+js+'</script>')
for n,url in images.items():html=html.replace('src="assets/'+n+'.png"','src="'+url+'"')
html=html.replace('href="../"','href="#"').replace('← Les 10 récits et 50 chapitres','Version autonome · retour aux récits dans le dépôt')
(root/'noah-autonome.html').write_text(html)
print('Standalone:',len(html.encode()),'bytes')
