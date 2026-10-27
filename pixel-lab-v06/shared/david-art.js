/* David Pixel v0.6 · original vector-pixel assets, no external services.
   Artistic reconstruction only: Samuel 16-17 does not specify colors, faces or buildings. */
(function(){'use strict';
const R=(x,y,w,h,c)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+c+'"/>';
const E=(x,y,rx,ry,c)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+c+'"/>';
const P=(d,c)=>'<path d="'+d+'" fill="'+c+'"/>';
const L=(d,c,w=3)=>'<path d="'+d+'" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
const G=(x,y,k,s)=>'<g transform="translate('+x+' '+y+') scale('+k+')">'+s+'</g>';
const url=(w,h,markup,pixel=false)=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'"'+(pixel?' shape-rendering="crispEdges"':'')+'>'+markup+'</svg>');
function character(row,col){
 const back=row===4,left=row===2,right=row===3,moving=col%2!==0,pace=col===1?-4:col===3?4:0;
 let s=E(32,76,19,3,'#29382b55')+R(20+pace,62,8,11,'#604c3d')+R(37-pace,62,8,11,'#604c3d')+R(18+pace,72,12,4,'#483a34')+R(35-pace,72,12,4,'#483a34');
 // Sandy tunic, colored shepherd's sash and a sling over the shoulder.
 s+=P('M19 37 L45 37 L52 66 L12 66Z','#b58f68')+R(18,40,28,5,'#d9b17b')+R(17,54,30,6,'#6c7f69')+R(25,52,15,4,'#e0c080');
 s+=R(13,42,8,20,'#ac8a70')+R(43,42,8,20,'#ac8a70')+R(14,55+pace,7,8,'#c58e70')+R(45,55-pace,7,8,'#c58e70');
 s+=R(27,32,10,9,'#bd8c6a')+E(32,23,15,17,'#483b32')+E(32,24,14,15,'#c7936f');
 // Young shepherd's curly hair, no beard, visibly unlike Joseph/Moses.
 s+=E(23,14,9,9,'#48352d')+E(33,10,10,8,'#4c3830')+E(44,14,7,9,'#513b32')+E(18,21,5,8,'#4d392f');
 if(back){s+=R(20,17,25,21,'#4b372d');}
 else if(left||right){s+=R(left?21:39,23,3,4,'#27292d')+R(left?17:43,29,5,3,'#a66e52');}
 else{s+=R(24,24,4,3,'#27292d')+R(37,24,4,3,'#27292d')+R(29,32,7,2,'#96654e');}
 // The shepherd's staff is an invented prop; sling is symbolic and never used as a weapon in-game.
 if(!back){s+=L('M'+(left?11:53)+' 73 L'+(left?10:53)+' 18 Q'+(left?5:48)+' 4 '+(left?15:58)+' 7','#86694a',4);}
 s+=R(20,47,4,9,'#eed3aa')+R(41,47,3,9,'#e6bd84');if(moving)s+=R(30,37,3,5,'#f3debb');
 return s;
}
function atlas(){let s='';for(let row=0;row<5;row++)for(let col=0;col<4;col++)s+=G(col*64,row*80,1,character(row,col));return url(256,400,s,true);}
function hill(x,y,w,h,c){return P('M'+x+' '+y+' Q'+(x+w*.46)+' '+(y-h)+' '+(x+w)+' '+y+'Z',c);}
function olive(x,y,k){let a=R(-5,-12,10,93,'#7b6246')+L('M0 24 L-26 6 M0 25 L27 2','#775b42',5)+E(-24,0,45,29,'#6c9267')+E(22,-12,42,30,'#739c6c')+E(-2,-25,39,33,'#87ab75');for(let i=0;i<13;i++)a+=E((i*19)%68-33,(i*11)%42-31,3,3,i%3?'#344c36':'#889b55');return G(x,y,k,a);}
function sheep(x,y,k){let s=E(0,3,27,17,'#f5edd7')+E(-14,-7,17,15,'#fff8e3')+E(14,-7,15,13,'#fff9e8')+E(28,3,15,15,'#b9997c')+R(34,0,4,3,'#262a2c')+R(-15,17,6,13,'#785c4d')+R(10,17,6,13,'#785c4d');return G(x,y,k,s);}
function hut(x,y,k){let s=P('M-64 21 L-64 -67 L64 -67 L64 21Z','#d5b58d')+P('M-78 -63 L0 -135 L80 -63Z','#94704b')+R(-9,-27,21,48,'#785745')+R(-52,-34,23,25,'#9d8e6b')+R(31,-34,23,25,'#9d8e6b');return G(x,y,k,s);}
function figure(x,y,k,col){let a=E(0,3,15,4,'#36423744')+P('M-12 -48 L13 -48 L19 1 L-19 1Z',col)+E(0,-61,13,15,'#b48462')+P('M-13 -62 Q-12 -80 2 -78 Q17 -76 14 -60Z','#463a34')+R(-12,0,9,15,'#4f433a')+R(4,0,9,15,'#4f433a');return G(x,y,k,a);}
function atmosphere(n){
 const c=[['#9ec6ca','#fff3bc'],['#d8b68f','#f3deb3'],['#a6c0c1','#ebd4a4'],['#93c5d1','#f4dbb0'],['#e5b98f','#f9eac7']][n];
 let s='<defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="'+c[0]+'"/><stop offset="1" stop-color="'+c[1]+'"/></linearGradient><linearGradient id="earth" x2="0" y2="1"><stop stop-color="#c9be8d"/><stop offset="1" stop-color="#857855"/></linearGradient></defs>'+R(0,0,800,600,'url(#sky)')+E(665,95,53,53,n===2?'#f6e7cc':'#fff0b0');
 for(let i=0;i<13;i++){let x=(i*129+n*53)%880-50,y=40+i*43%133;s+=E(x,y,50+i%3*9,12+i%4*4,'#fff6dd77');}
 for(let i=0;i<9;i++)s+=hill(i*120-72,353,215,126+(i*47+n*17)%90,i%2?'#95a39a':'#b4b29a');
 s+=P('M0 392 Q170 336 319 402 T800 385 V600H0Z','#abb28a')+
 P('M0 458 Q210 388 480 447 T800 431 V600H0Z','url(#earth)');
 for(let i=0;i<280;i++){let x=(i*151+n*67)%800,y=378+(i*73)%220;s+=R(x,y,2+i%3,1+i%2,i%2?'#d4c692':'#e9d5a6');}
 return s;
}
function scene(n){
 let s=atmosphere(n);
 if(n===0){
   s+=hill(0,507,430,130,'#89a577')+hill(352,518,520,113,'#96ad7d')+
   hut(550,387,1.1)+olive(115,390,1.05)+olive(755,401,.64);
   for(let i=0;i<10;i++)s+=sheep(53+i*70,458+(i%3)*22,.52+i%2*.06);
   s+=figure(296,453,1.35,'#b6966c');
 }else if(n===1){
   s+=hut(421,391,1.5)+olive(131,435,.9)+olive(732,435,.9);
   s+=figure(286,475,1.42,'#648b88')+figure(514,476,1.2,'#b18b6c')+figure(615,470,1.1,'#b29670');
   s+=E(520,333,53,32,'#fff2b166')+E(520,350,28,17,'#ffe2aa77');
 }else if(n===2){
   // Two distant camps and the geographical dip of the valley of Elah.
   s+=hill(0,480,360,153,'#879a81')+hill(440,480,400,166,'#8f987a')+
      P('M0 510 Q168 454 282 500 Q392 562 504 500 Q657 442 800 504 L800 600H0Z','#c8b98a');
   for(let i=0;i<6;i++){let x=34+i*59;s+=P('M'+x+' 407 l25 -49 l24 49Z','#c49b73');}
   for(let j=0;j<5;j++){let x=517+j*57;s+=P('M'+x+' 410 l26 -57 l28 57Z','#ad866a');}
   s+=figure(342,494,1.3,'#ac9572')+figure(703,461,1.6,'#7b6d64');
 }else if(n===3){
   s+=P('M0 510 Q150 450 299 492 T800 459V600H0Z','#d1ba8e')+
     P('M0 468 Q130 435 276 475 T563 456 T800 477 L800 515 Q650 489 512 521 T210 515 T0 518Z','#69b1b2');
   for(let w=0;w<37;w++){let x=(w*61)%800,y=460+w%4*12;s+=L('M'+x+' '+y+' q13 -5 27 0','#c9e7da',2);}
   for(let j=0;j<13;j++){let x=(j*73)%800,y=528+j%3*11;s+=E(x,y,10+j%3*4,5,j%2?'#947d65':'#b5a28c');}
   s+=olive(122,386,.83)+sheep(630,500,.8)+figure(367,470,1.45,'#ad9873');
 }else{
   // After the confrontation, no violence is depicted. The narrative closes with a sunrise.
   s+=E(395,293,166,107,'#fff1bd66')+
     P('M0 488 Q185 448 294 498 T570 476 T800 476V600H0Z','#a4aa7c')+
     hill(0,489,320,103,'#819878')+hill(500,495,350,114,'#8c9c77');
   s+=olive(95,435,.84)+olive(755,420,.78)+figure(397,471,1.45,'#b89a74');
   for(let p=0;p<32;p++){let x=(p*89)%800,y=318+(p*43)%173;s+=E(x,y,2+p%3,2,'#fff1c388');}
 }
 s+=P('M0 558 Q171 535 338 558 T800 542V600H0Z',n===3?'#988b68':'#637e5b');
 for(let q=0;q<57;q++){let x=(q*139+n*53)%800,y=531+(q*31)%69;s+=P('M'+x+' '+y+' l-3 -13 l5 10 l3 -18 l2 23Z',q%2?'#789361':'#c7b77d');}
 return url(800,600,s);
}
function prop(type){
 let s='';
 if(type==='sheep')s=E(30,37,24,18,'#f8f3e3')+E(46,34,12,12,'#bfa184')+R(50,31,3,3,'#33302b')+R(15,51,5,12,'#947d69')+R(38,51,5,12,'#947d69');
 else if(type==='staff')s=L('M20 61 L39 5 Q47 0 43 13','#8e714c',6);
 else if(type==='oil')s=E(32,58,18,4,'#79583a')+P('M18 22 L46 22 Q56 39 42 56 L22 56 Q8 39 18 22Z','#cba15e')+R(24,15,16,9,'#e7c17a');
 else if(type==='scroll')s=R(14,18,38,38,'#e9d4a6')+R(12,14,42,7,'#ac8452')+R(12,54,42,7,'#ac8452')+L('M23 29 H45 M23 37H41 M23 45H43','#937953',2);
 else if(type==='shield')s=P('M32 3 L57 12 L53 42 Q43 56 32 63 Q18 56 11 43 L8 12Z','#8a816a')+L('M31 9 V54 M16 20 H48','#e4c78c',4);
 else if(type==='provisions')s=E(32,53,26,9,'#926943')+P('M10 28 L54 28 L50 49 Q31 60 14 49Z','#ba8b5e')+E(27,27,12,11,'#e0bf7a')+E(42,27,10,9,'#efc783');
 else if(type==='armour')s=P('M19 9 L45 9 L52 26 L45 53 L19 53 L12 26Z','#899799')+R(25,17,14,31,'#b6c2bd')+L('M23 15 L32 25 L41 15','#e2cf9c',3);
 else if(type==='stones'){for(let i=0;i<5;i++)s+=E(11+i*11,44+(i%2)*5,7,5,i%2?'#a6a394':'#d4c7ab');}
 else if(type==='sling')s=L('M17 8 Q14 20 31 34 M48 8 Q50 19 32 34','#76573e',4)+P('M19 31 Q31 24 45 32 L39 45 L25 45Z','#b48d62');
 else if(type==='sun')s=E(32,29,16,16,'#f7d176')+E(32,29,7,7,'#fff0ae');
 else s=R(16,18,32,38,'#bdaa89');
 return url(64,64,s,true);
}
window.DavidPixelArt={version:'0.6',atlas:atlas,scene:scene,prop:prop};
}());