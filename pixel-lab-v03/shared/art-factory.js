/* Bible Aventure Pixel - hand-authored SVG sprite and scene factory v0.3.
   Assets are deterministic, offline, do not call third-party providers.
   Original illustrations: artistic interpretation, not biblical evidence. */
(function(){
'use strict';
function r(x,y,w,h,c,rx){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"'+(rx?' rx="'+rx+'"':'')+' fill="'+c+'"/>';}
function e(x,y,rx,ry,c){return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+c+'"/>';}
function p(d,c){return '<path d="'+d+'" fill="'+c+'"/>';}
function svg(w,h,contents){return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" shape-rendering="crispEdges">'+contents+'</svg>');}
/* v0.3: richer figure layering, directional readability, handmade details. */
function avatarFrame(who,row,col){
 var old=who==='noah',young=!old,front=row<2,back=row===4,left=row===2,right=row===3;
 var step=(col===0?0:col===1?-3:col===2?1:3);
 var skin=old?'#e8b48a':'#d7a17b',shadow=old?'#bd805e':'#a77457';
 var hair=old?'#f0eee4':'#2e2630',hairDark=old?'#aaa69b':'#1b2028';
 var coat=old?'#a4513d':'#2767a4',coatLight=old?'#c6754c':'#458acc';
 var dark=old?'#5a3430':'#1c385c',trim=old?'#e7be76':'#f4d17e';
 var x=32+(left?-2:right?2:0),y=0,parts='';
 parts+=e(32,75,18,4,'#111f27',);
 // feet move symmetrically as the frame advances
 var leg1=front||back?x-12:x-9,leg2=front||back?x+4:x+3;
 parts+=r(leg1+step,62,9,11,dark,1)+r(leg2-step,62,9,11,dark,1);
 parts+=r(leg1+step-2,70,13,5,'#4c3029',1)+r(leg2-step-2,70,13,5,'#4c3029',1);
 // tunic silhouette and decorated belt
 parts+=p('M'+(x-14)+' 38 L'+(x+13)+' 38 L'+(x+17)+' 67 L'+(x-17)+' 67 Z',coat);
 parts+=r(x-14,39,28,6,coatLight,1);
 parts+=r(x-16,55,32,5,dark,1)+r(x-4,54,8,6,trim,1);
 if(!old){parts+=r(x-12,43,4,16,trim)+r(x+8,43,3,16,trim);}
 else{parts+=r(x-16,43,3,22,trim)+r(x+13,43,3,22,trim);}
 // arms in walking positions, with outline for clarity
 var ay=col===1?44:col===3?51:48;
 if(left){parts+=r(x-17,41,10,22,coatLight,3)+r(x-19,ay,8,9,skin,2);}
 else if(right){parts+=r(x+9,41,10,22,coatLight,3)+r(x+13,ay,8,9,skin,2);}
 else{parts+=r(x-21,41,9,22,coatLight,3)+r(x+12,41,9,22,coatLight,3)+r(x-21,ay,7,8,skin,2)+r(x+14,ay,7,8,skin,2);}
 // neck + head
 parts+=r(x-6,32,12,9,skin,3);
 parts+=e(x,23,16,17,hairDark);
 parts+=e(x,24,14,15,skin);
 if(back){
  parts+=p('M'+(x-17)+' 15 Q'+x+' -1 '+(x+17)+' 15 L'+(x+16)+' 36 L'+(x-16)+' 36 Z',hair);
  if(old)parts+=r(x-8,29,16,11,'#dcdacf',3);
 }else if(left||right){
  var fx=left?x-7:x+7;
  parts+=p('M'+(x-16)+' 24 Q'+(x-13)+' 3 '+x+' 6 Q'+(x+17)+' 7 '+(x+16)+' 22 L'+(x+10)+' 17 L'+(x-15)+' 20 Z',hair);
  parts+=r(fx-2,23,3,3,'#22202b');
  parts+=r(fx+(left?-5:4),27,5,4,shadow,1);
  if(old)parts+=p('M'+(x-10)+' 29 L'+(x+11)+' 29 L'+(x+8)+' 46 L'+(x-8)+' 45 Z','#e6e5d8');
 }else{
  parts+=p('M'+(x-16)+' 21 Q'+(x-18)+' 4 '+x+' 6 Q'+(x+16)+' 4 '+(x+17)+' 22 L'+(x+9)+' 15 L'+(x-8)+' 17 Z',hair);
  if(old){parts+=r(x-11,15,22,4,'#ffffff',1);parts+=p('M'+(x-13)+' 31 L'+(x+12)+' 31 L'+(x+10)+' 45 L'+(x-10)+' 45 Z','#e7e7d9');parts+=r(x-8,30,16,5,'#bdbab2',1);}
  parts+=r(x-9,24,4,3,'#1b2630')+r(x+5,24,4,3,'#1b2630');
  if(young){parts+=r(x-4,32,8,3,shadow,1);parts+=r(x-8,11,8,4,hairDark);}
 }

 // Face highlights and embroidered clothing: small pixels, no animation-related layout shift.
 if(back){
  parts+=r(x-12,22,6,4,old?'#faf4dc':'#4f3e43',1);
  parts+=r(x+5,13,6,5,old?'#f8f3de':'#61484b',1);
 }else if(left||right){
  parts+=r(x+(left?-7:3),16,6,3,old?'#fff5df':'#6b4950',1);
  parts+=r(x+(left?-8:5),31,5,3,old?'#d9d7c7':'#b8795a',1);
 }else{
  parts+=r(x-13,14,7,3,old?'#fffaf0':'#664a45',1);
  parts+=r(x+6,13,6,3,old?'#fffaf0':'#694c47',1);
  parts+=r(x-8,28,3,2,'#fff2d0',1);
  parts+=r(x+6,28,3,2,'#fff2d0',1);
 }
 parts+=r(x-11,48,3,7,old?'#f3c888':'#79b0d5',1);
 parts+=r(x+9,48,3,7,old?'#d79a6b':'#e9bf5b',1);
 parts+=r(x-7,58,15,2,old?'#e5aa77':'#e5bd72',1);
 parts+=r(leg1+step,73,8,2,'#e7bd8f',1);
 parts+=r(leg2-step,73,8,2,'#e7bd8f',1);
 return parts;
}
function makeAtlas(who){
 var content='';
 for(var row=0;row<5;row++)for(var col=0;col<4;col++){content+='<g transform="translate('+(col*64)+' '+(row*80)+')">'+avatarFrame(who,row,col)+'</g>';}
 return svg(256,400,content);
}
function tree(x,y,scale){
 return '<g transform="translate('+x+' '+y+') scale('+scale+')">'+
 r(-8,-10,16,98,'#69492e')+r(-5,1,7,74,'#a57243')+
 e(0,-28,61,53,'#2d774c')+e(-37,-18,37,36,'#398f53')+e(35,-17,38,34,'#347c49')+
 e(0,-50,44,32,'#58a864')+r(-25,-59,9,10,'#80b95d')+r(32,-40,8,8,'#b9d368')+'</g>';
}
function ark(x,y,scale){
 return '<g transform="translate('+x+' '+y+') scale('+scale+')">'+
 p('M-190 20 L190 20 L159 104 L-154 104 Z','#6c4a35')+
 p('M-174 22 L-156 -75 L0 -148 L158 -75 L174 22 Z','#b67d4d')+
 p('M-194 -67 L0 -174 L195 -67 L175 -57 L0 -143 L-174 -57 Z','#754f36')+
 r(-159,-55,319,16,'#d09c61')+r(-159,-6,319,11,'#714b30')+
 r(-80,-36,59,52,'#49372a')+r(-65,-31,21,29,'#eec078')+
 r(42,-37,54,32,'#49392c')+r(52,-28,34,17,'#e4c58a')+
 r(-155,45,310,6,'#c49661')+r(-148,73,298,6,'#c49661')+
 '</g>';
}
function sheep(x,y,scale){
 return '<g transform="translate('+x+' '+y+') scale('+scale+')">'+e(0,0,25,18,'#ecead9')+e(-13,-7,14,13,'#fff8e1')+e(13,-7,12,13,'#fff8e1')+r(16,-7,18,17,'#a97e5b',3)+r(22,-2,3,3,'#21282c')+r(-13,12,5,15,'#785743')+r(13,12,5,15,'#785743')+'</g>';
}
function figure(x,y,who,scale){return '<g transform="translate('+x+' '+y+') scale('+scale+')">'+avatarFrame(who,0,1)+'</g>';}

/* Background and foreground are separated so subjects remain recognizable.
   Deterministic scenery: five distinct visual environments per story. */
function hills(who,n){
 var noah=who==='noah',col=noah?'#688b83':'#b39870',out='';
 for(var k=0;k<8;k++){
  var hx=k*117-58,top=185+(k*41+n*23)%92;
  out+=p('M'+hx+' 358 L'+(hx+82)+' '+top+' L'+(hx+184)+' 358 Z',k%2?col:(noah?'#83aaa0':'#c8b18a'));
  out+=p('M'+(hx+68)+' '+(top+33)+' L'+(hx+82)+' '+top+' L'+(hx+101)+' '+(top+35)+' Z','#e7ddbd');
 }
 return out;
}
function sparkle(x,y,size,col){
 return p('M'+x+' '+(y-size)+' L'+(x+size*.22)+' '+(y-size*.22)+' L'+(x+size)+' '+y+' L'+(x+size*.22)+' '+(y+size*.22)+' L'+x+' '+(y+size)+' L'+(x-size*.22)+' '+(y+size*.22)+' L'+(x-size)+' '+y+' L'+(x-size*.22)+' '+(y-size*.22)+' Z',col);
}
function palm(x,y,scale){
 var out='<g transform="translate('+x+' '+y+') scale('+scale+')">'+p('M-9 111 L7 111 L2 5 L-6 3 Z','#917047')+
 p('M-4 9 Q-86 -72 -119 7 Q-63 -27 -8 19Z','#407d50')+
 p('M0 9 Q94 -85 125 5 Q61 -25 5 24Z','#377d52')+
 p('M0 9 Q-26 -99 19 -98 Q6 -38 6 17Z','#5c9d5e')+
 p('M0 9 Q51 -70 92 -66 Q32 -13 5 20Z','#2d714c')+
 p('M0 9 Q-75 -60 -83 -45 Q-30 -10 2 22Z','#7eb266');
 for(var c=0;c<5;c++)out+=e(-19+c*9,21+(c%2)*6,7,9,'#9b7044');
 return out+'</g>';
}
function cactus(x,y,scale){
 return '<g transform="translate('+x+' '+y+') scale('+scale+')">'+
 p('M-13 43 L-13 -8 Q-13 -30 0 -30 Q14 -30 14 -8 L14 43 Z','#3e855b')+
 p('M-13 8 L-37 8 Q-42 8 -42 -5 L-42 -24 L-32 -24 L-32 -8 L-10 -8 Z','#57a06e')+
 p('M14 4 L34 4 L34 -18 L45 -18 L45 11 Q45 18 33 18 L14 18 Z','#4b9467')+
 r(-4,-19,5,56,'#8abe73')+'</g>';
}
function baseAtmosphere(who,n){
 var noah=who==='noah',storm=noah&&n===2,desert=!noah&&(n===1||n===3),out='';
 out+='<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="'+(storm?'#405975':desert?'#9dbdc4':noah?'#67afc2':'#80bfd2')+'"/><stop offset="1" stop-color="'+(storm?'#b1c6ce':desert?'#f6d7a6':noah?'#f7e2b3':'#f7e5bd')+'"/></linearGradient><linearGradient id="earth" x1="0" y1="0" x2="0" y2="1"><stop stop-color="'+(noah?'#92b369':'#e1bf81')+'"/><stop offset="1" stop-color="'+(noah?'#5e956a':'#ac7b56')+'"/></linearGradient></defs>';
 out+=r(0,0,800,600,'url(#sky)');
 for(var cl=0;cl<12;cl++){
  var cx=(cl*113+n*63)%900-55,cy=56+(cl*37)%119;
  out+=e(cx,cy,56+(cl%3)*16,17+(cl%4)*4,storm?'#acbfc5':'#fff3d4');
  out+=e(cx+28,cy-10,39,20,storm?'#93aebc':'#fff8e5');
 }
 out+=e(678,113,42,42,storm?'#d9d9c9':'#ffe2a0');
 out+=hills(who,n);
 for(var dust=0;dust<90;dust++){var dx=(dust*157+n*89)%800,dy=335+(dust*83)%265;out+=r(dx,dy,2+(dust%3)*2,1,dust%2?(noah?'#deba80':'#e2b479'):'#f4e0b7');}
 if(!storm)for(var ray=0;ray<13;ray++)out+=sparkle((ray*101+n*38)%800,55+((ray*47)%267),2+ray%4,'#fff7da');
 return out;
}
function foreground(who,n){
 var noah=who==='noah',out='';
 out+=p('M0 546 Q145 519 248 547 T500 540 T800 548 V600 H0Z',noah?'#44755c':'#98724e');
 for(var g=0;g<45;g++){
  var x=(g*137+n*79)%800,y=538+(g*41)%61;
  if(noah){out+=p('M'+x+' '+(y+9)+' l-3 -14 l5 11 l3 -18 l2 27 Z',g%2?'#62a45e':'#a5c06e');}
  else{out+=p('M'+x+' '+(y+8)+' l-3 -14 l5 11 l3 -18 l2 25 Z',g%2?'#e3bd74':'#b89452');}
 }
 if(noah&&n===1)for(var a=0;a<5;a++)out+=sheep(45+a*171,555-(a%3)*12,.6);
 if(noah&&n===3)for(var b=0;b<8;b++)out+=e((b*121)%800,555+(b%2)*14,35,5,'#8bc9d0');
 if(!noah&&(n===0||n===1))for(var c=0;c<14;c++)out+=r(c*58,555+(c%3)*9,2,19,'#e7c779');
 return out;
}
function prop(who,type){
 var noah=who==='noah',s='';
 if(type==='reeds'){
  for(var i=0;i<9;i++){var x=8+i*6,y=52+(i%3)*5;s+=p('M'+x+' 62 L'+(x+2)+' '+(y-24)+' L'+(x+5)+' '+(y-3)+' Z','#50946c')+r(x+2,y-27,5,15,'#b58c58',1);}
 }else if(type==='sheaf'){
  for(var j=0;j<9;j++){var x2=12+j*5,y2=16+(j%4)*5;s+=p('M32 59 L'+x2+' '+y2+' L'+(x2+4)+' '+(y2-4)+' L35 59 Z','#b98640');s+=r(x2,y2-12,4,12,'#f0ce76',1);}
  s+=p('M19 48 L44 48 L39 57 L24 56 Z','#8b5a3d');
 }else if(type==='jar'){
  s=e(31,58,20,4,'#352e2b')+r(19,11,25,7,'#9d694b',1)+p('M17 20 L46 20 Q57 35 47 57 Q32 68 17 57 Q7 35 17 20 Z','#c88b55')+r(22,31,18,5,'#f0bc71',1)+r(25,43,14,4,'#a66d43');
 }else if(type==='timber'){
  for(var t=0;t<3;t++)s+=r(7+(t%2)*5,43-t*13,52,10,t%2?'#9d6b43':'#c58a55',2)+r(11+(t%2)*5,45-t*13,28,2,'#e3bb79');
 }else if(type==='tent'){
  s=p('M5 57 L32 9 L59 57 Z','#c49a6a')+p('M30 14 L59 57 L32 57 Z','#a77e52')+p('M24 57 L32 34 L41 57 Z','#654c3b')+r(31,12,2,46,'#e4ba7e');
 }else if(type==='palm'){
  s=p('M28 59 L36 59 L35 24 L30 23 Z','#9a744a')+
  p('M31 24 Q3 -8 1 21 L28 30 Z','#4f915b')+p('M31 24 Q59 -6 63 19 L33 31Z','#3f8354')+p('M31 24 Q14 0 32 2 L37 31Z','#78af62');
 }else if(type==='fish'){
  s=e(32,39,20,10,'#7bafb6')+p('M14 39 L3 27 L3 52 Z','#5996a9')+r(42,36,3,3,'#16394f')+r(23,37,12,3,'#bde6d9');
 }else{ s=r(15,31,35,26,'#9aa899',3)+r(19,27,24,6,'#d0d5bf',2)+r(42,48,6,7,'#607e78');}
 return svg(64,64,s);
}

function scene(who,n){
 var isNoah=who==='noah',sky=isNoah?(n===2?'#6e92ae':n===3?'#a6c3c9':'#8bcbd7'):(n<2?'#9dd1de':'#a6c6d0');
 var ground=isNoah?(n===2?'#466575':'#75a15b'):(n>=2?'#d7b47b':'#a8ac69');
 var out=baseAtmosphere(who,n)+
 p('M0 342L120 220 230 328 383 205 510 322 650 209 800 315V600H0Z',isNoah?'#85a1a0':'#d4b88b')+
 p('M0 417Q200 340 425 392T800 369V600H0Z',ground);
 for(var i=0;i<120;i++){var x=(i*173+57)%800,y=375+(i*61+23)%205;out+=r(x,y,4+(i%3)*3,2,i%2?'#bdad80':'#6e9e68');}
 if(isNoah){
  if(n===0){out+=ark(480,340,.9)+tree(112,386,.74);for(var a=0;a<7;a++)out+=r(46+a*35,467+(a%2)*13,55,17,'#9c653e');out+=figure(267,391,'noah',1.6);}
  if(n===1){out+=ark(475,338,.98);for(var b=0;b<4;b++)out+=sheep(126+b*87,447+(b%2)*35,.8);out+=figure(285,383,'noah',1.4);}
  if(n===2){out+=r(0,365,800,235,'#456b89')+ark(453,345,1.18);for(var c=0;c<85;c++){out+=r((c*97)%800,(c*53)%425,3,14,'#d4e7ee');}for(var d=0;d<10;d++)out+=p('M'+(d*110)+' 530q32 -20 64 0q32 18 64 0','none');}
  if(n===3){out+=r(0,429,800,171,'#629bba')+ark(455,331,.84)+tree(103,381,.63);for(var j=0;j<16;j++)out+=e((j*59)%800,522+(j%3)*21,38,6,'#a0d1d1');}
  if(n===4){out+=ark(420,371,.64)+tree(105,390,.8);var cc=['#dd7e75','#f9bc6b','#eac55a','#7dbf88','#669cc5','#9676ae'];for(var k=0;k<cc.length;k++)out+='<path d="M140 288 Q400 '+(-30+k*27)+' 670 288" stroke="'+cc[k]+'" stroke-width="17" fill="none"/>';out+=figure(547,437,'noah',1.5);}
 }else{
  // Joseph: Canaan, caravan, challenges, royal granary, reconciliation.
  if(n===0){out+=tree(123,383,.85)+r(370,320,180,138,'#b58c5f')+p('M350 332l110 -100 110 100Z','#9b6e49');for(var t=0;t<10;t++)out+=r(45+t*59,477+(t%3)*8,7,64,'#e4c37e');}
  if(n===1){out+=p('M0 475 Q340 435 800 485 L800 600H0Z','#e7c98e');for(var t=0;t<5;t++)out+=e(t*173+70,461,69,22,'#b2a67f');out+=r(560,275,105,175,'#bd9c75')+r(596,255,33,31,'#aa805c');}
  if(n===2){out+=r(200,285,400,195,'#dac29a')+r(185,270,430,25,'#a67e57');for(var t=0;t<5;t++)out+=r(226+t*75,303,24,174,'#b08a63');out+=r(385,353,85,128,'#694b3a');}
  if(n===3){for(var t=0;t<4;t++){out+=r(95+t*173,264+(t%2)*22,127,211,'#d5ab6a')+r(102+t*173,254+(t%2)*22,112,18,'#9c744d')+r(122+t*173,319,74,10,'#f0d28c');}out+=r(0,476,800,124,'#caaa72');}
  if(n===4){out+=r(135,250,550,236,'#d6b88c')+r(125,230,560,32,'#986a4d');for(var t=0;t<5;t++)out+=r(164+t*101,267,25,217,'#b2835b');out+=figure(460,387,'joseph',1.5);}
  out+=figure(n===4?310:356,385,'joseph',1.7);
 }
 // Narrative environments, handcrafted miniature details and final foreground.
 if(isNoah){
  if(n===0){out+=tree(747,420,.55)+p('M605 499 L660 438 L701 499Z','#9c7552');for(var log=0;log<5;log++)out+=r(85+log*40,485+(log%2)*12,56,13,'#b67c47');}
  if(n===1){out+=tree(738,425,.60);for(var sheepIndex=0;sheepIndex<3;sheepIndex++)out+=sheep(55+sheepIndex*85,493,.53);}
  if(n===2){for(var waveNo=0;waveNo<18;waveNo++)out+=e((waveNo*67)%800,498+(waveNo%3)*19,32,3,'#c2e4e6');out+=p('M0 300 Q150 240 270 303 T510 260 T800 285V0H0Z','#64758e');}
  if(n===3){out+=tree(731,427,.62);for(var w=0;w<12;w++)out+=e((w*103)%800,470+(w%5)*14,21,4,'#d3e8d2');}
  if(n===4){out+=tree(726,409,.70);out+=sheep(128,492,.7);}
 }else{
  if(n===0){out+=tree(724,431,.63);for(var sp=0;sp<10;sp++)out+=sparkle(130+sp*51,115+sp%3*31,2+sp%2,'#fff2b1');}
  if(n===1){out+=palm(715,375,.7)+palm(104,404,.65);for(var dd=0;dd<11;dd++)out+=p('M'+(dd*80)+' 486 q48 -32 95 6','#dbb47a');}
  if(n===2){out+=palm(752,413,.75);for(var aw=0;aw<4;aw++)out+=r(290+aw*69,298,8,151,'#c9ac82');}
  if(n===3){out+=palm(45,411,.6);for(var ct=0;ct<7;ct++)out+=r(94+ct*106,492,39,22,'#b47e4d',3);}
  if(n===4){out+=palm(749,420,.55);out+=palm(72,417,.55);out+=sparkle(465,170,8,'#fff0a7');}
 }
 out+=foreground(who,n);
 return svg(800,600,out);
}
window.PixelArtFactory={atlas:makeAtlas,scene:scene,prop:prop,version:'0.3',spriteWidth:64,spriteHeight:80,cols:4,rows:5};
}());
