from PIL import Image
from pathlib import Path
import json
root=Path('bible-aventure/lab-noah/assets')
def key(im):
 im=im.convert('RGBA'); pix=im.load()
 for y in range(im.height):
  for x in range(im.width):
   r,g,b,a=pix[x,y]
   if r>140 and b>120 and g<110 and min(r,b)>g*1.5:pix[x,y]=(0,0,0,0)
 return im
src=key(Image.open(root/'source/explorer-generated.png'))
# Equal cells from the generated sheet. Normalize the individual silhouette to a shared baseline.
atlas=Image.new('RGBA',(192,256)); meta={}
for row,d in enumerate(['down','left','right','up']):
 for col in range(4):
  cell=src.crop((round(col*1254/4),round(row*1254/4),round((col+1)*1254/4),round((row+1)*1254/4)))
  # Ignore tiny pixels from a neighboring row at the generated grid boundaries.
  alpha=cell.getchannel('A'); occupied={(x,y) for y in range(cell.height) for x in range(cell.width) if alpha.getpixel((x,y))>0}
  largest=[]
  while occupied:
   seed=occupied.pop(); component=[seed]; head=0
   while head<len(component):
    x,y=component[head];head+=1
    for dx,dy in [(1,0),(-1,0),(0,1),(0,-1),(1,1),(-1,1),(1,-1),(-1,-1)]:
     q=(x+dx,y+dy)
     if q in occupied:occupied.remove(q);component.append(q)
   if len(component)>len(largest):largest=component
  box=(min(x for x,y in largest),min(y for x,y in largest),max(x for x,y in largest)+1,max(y for x,y in largest)+1)
  cell=cell.crop(box);cell.thumbnail((36,54),Image.Resampling.NEAREST);cell=cell.crop(cell.getbbox())
  frame=Image.new('RGBA',(48,64)); frame.alpha_composite(cell,((48-cell.width)//2,60-cell.height))
  frame.save(root/f'frames/explorer-{d}-{col}.png'); atlas.alpha_composite(frame,(48*col,64*row))
  meta[f'explorer-{d}-{col}']={'x':48*col,'y':64*row,'w':48,'h':64,'anchor':[24,60]}
atlas.save(root/'explorer.png')
src=key(Image.open(root/'source/garden-generated.png'))
# Generation ignored regular grid around the large ark: explicit reviewed boxes avoid slicing its hull.
boxes={'cedar':(35,8,443,451),'flowers':(496,135,808,442),'boulder':(871,135,1230,440),'ark':(14,467,510,842),'noah':(559,480,778,817),'sheep':(856,561,1233,794),'book':(30,879,444,1201),'doves':(449,865,875,1177),'chest':(899,843,1229,1211)}
sizes={'cedar':(80,96),'flowers':(48,48),'boulder':(56,56),'ark':(256,194),'noah':(32,48),'sheep':(64,40),'book':(32,26),'doves':(52,40),'chest':(48,52)}
for name,box in boxes.items():
 im=src.crop(box); im=im.crop(im.getbbox()); im.thumbnail(sizes[name],Image.Resampling.NEAREST);im.save(root/(name+'.png'));meta[name]={'file':name+'.png','w':im.width,'h':im.height,'sourceBox':box}
(root/'atlas.json').write_text(json.dumps({'frameSize':[48,64],'directions':['down','left','right','up'],'frames':meta},indent=2))
# Extract two real gameplay concepts from the generated board, without resampling.
Image.open(root/'source/concepts.png').crop((239,0,1672,442)).save(root/'concept-01.png')
Image.open(root/'source/concepts.png').crop((239,455,1672,941)).save(root/'concept-02.png')
print('16 normalized animation cells, 9 reviewed object cuts, two concepts')
# Four generated material tiles. This is deterministic asset slicing, not new artwork.
im=Image.open(root/'source/terrain-generated.png');w,h=im.size
for name,(x,y) in zip(['grass','sand','water','planks'],[(0,0),(1,0),(0,1),(1,1)]):
 im.crop((x*w//2,y*h//2,(x+1)*w//2,(y+1)*h//2)).resize((96,96),Image.Resampling.NEAREST).save(root/(name+'.png'))
