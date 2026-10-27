/* Bible Aventure Pixel - hand-authored SVG sprite and scene factory v0.2.
   Assets are deterministic, offline, do not call third-party providers.
   Original illustrations: artistic interpretation, not biblical evidence. */
(function(){
'use strict';
function r(x,y,w,h,c,rx){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"'+(rx?' rx="'+rx+'"':'')+' fill="'+c+'"/>';}
function e(x,y,rx,ry,c){return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+c+'"/>';}
function p(d,c){return '<path d="'+d+'" fill="'+c+'"/>';}
function svg(w,h,contents){return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" shape-rendering="crispEdges">'+contents+'</svg>');}
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
function scene(who,n){
 var isNoah=who==='noah',sky=isNoah?(n===2?'#6e92ae':n===3?'#a6c3c9':'#8bcbd7'):(n<2?'#9dd1de':'#a6c6d0');
 var ground=isNoah?(n===2?'#466575':'#75a15b'):(n>=2?'#d7b47b':'#a8ac69');
 var out=r(0,0,800,600,sky)+e(652,95,55,55,n===2&&isNoah?'#ced3cc':'#fff0aa')+
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
 // Dark pixel vignette / layered scenery, no text baked into art.
 out+=r(0,565,800,35,isNoah?'#5e876b':'#b59b6b');
 return svg(800,600,out);
}
window.PixelArtFactory={atlas:makeAtlas,scene:scene,version:'0.2',spriteWidth:64,spriteHeight:80,cols:4,rows:5};
}());
