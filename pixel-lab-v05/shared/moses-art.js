/* Bible Aventure Pixel v0.5 — original, deterministic SVG art for Exode 2–14.
   Figures, landscapes and colors are pedagogical interpretations, not evidence.
   No remote image service, scripts or licensed image assets. */
(function(){'use strict';
function rect(x,y,w,h,c,rx){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+c+'"'+(rx?' rx="'+rx+'"':'')+'/>';}
function ellipse(x,y,rx,ry,c){return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+c+'"/>';}
function path(d,c){return '<path d="'+d+'" fill="'+c+'"/>';}
function line(d,c,w,opacity){return '<path d="'+d+'" stroke="'+c+'" stroke-width="'+(w||2)+'" fill="none" stroke-linecap="round" stroke-linejoin="round"'+(opacity===undefined?'':' opacity="'+opacity+'"')+'/>';}
function group(x,y,scale,inner){return '<g transform="translate('+x+' '+y+') scale('+scale+')">'+inner+'</g>';}
function svg(w,h,s,sharp){return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'"'+(sharp?' shape-rendering="crispEdges"':'')+'>'+s+'</svg>');}
function sprite(who,row,col){
 var sister=who==='sister',back=row===4,left=row===2,right=row===3;
 var stride=col===0?0:col===1?-4:col===2?1:4,x=32,sk=sister?'#c99067':'#bd815b',shade=sister?'#945d44':'#89543e';
 var primary=sister?'#b46a58':'#6c918a',light=sister?'#db9980':'#96b1a3',dark=sister?'#674856':'#35545a',hem=sister?'#e8b879':'#d4b17a';
 var parts=ellipse(32,75,20,3,'#283b3340');
 // Shoes separate as each leg advances, with a ground shadow.
 parts+=rect(18+stride,63,9,11,'#5c4642',2)+rect(37-stride,63,9,11,'#5c4642',2);
 parts+=rect(15+stride,72,14,4,'#463c37',1)+rect(35-stride,72,14,4,'#463c37',1);
 // Distinct silhouettes: sister has long skirt and a braid; Moses has a wide robe.
 parts+=path(sister?'M20 39 L44 39 L53 69 L11 69 Z':'M17 37 L47 37 L52 68 L12 68 Z',primary);
 parts+=rect(19,42,26,5,light,2)+rect(17,54,30,5,dark,1)+rect(29,53,7,7,hem,1);
 parts+=rect(sister?13:11,42,8,21,light,3)+rect(sister?44:45,42,8,21,light,3);
 var armA=col%2?3:-1;parts+=rect(13,54+armA,8,8,sk,3)+rect(45,54-armA,8,8,sk,3);
 parts+=rect(27,35,10,8,sk,2)+ellipse(32,23,15,17,shade)+ellipse(32,23,14,15,sk);
 if(sister){
  // An imagined dress and braid: no claim that Exode describes appearance.
  parts+=path('M18 21 Q19 2 33 5 Q49 4 47 23 L43 16 L39 12 L22 17 Z','#423337');
  if(back)parts+=rect(19,17,27,24,'#473239',4)+rect(41,32,9,26,'#57393c',3)+rect(42,40,7,7,'#e7b681',2);
  else if(left)parts+=path('M19 14 L27 13 L29 37 L18 53 L13 46Z','#443238');
  else if(right)parts+=path('M39 13 L48 17 L52 46 L46 53 L37 37 Z','#443238');
  else parts+=rect(42,25,7,26,'#49383b',3)+rect(43,34,6,5,'#dab187');
 }else{
  parts+=path('M17 19 Q18 0 35 4 Q50 5 47 22 L42 15 L25 13 L18 26 Z','#393739');
  parts+=rect(24,31,17,6,'#754b3e',2);
  if(back){parts+=rect(18,13,28,25,'#3c3937',5);}
  else if(!left&&!right){parts+=path('M19 30 Q31 49 45 30 L41 44 Q32 51 23 42Z','#574439');parts+=rect(24,30,16,5,'#d1ab83',1);}
  else parts+=path('M23 29 Q33 40 45 31 L39 44 L28 41Z','#694a38');
  // A staff is drawn as an identifying artistic symbol in adult chapters.
  if(!back){var sx=left?10:53;parts+=line('M'+sx+' 74 L'+(sx+1)+' 8','#886042',4);parts+=rect(sx-2,8,6,5,'#c5965a',1);}
 }
 if(!back){
  if(left||right){parts+=rect(left?22:39,22,3,4,'#2c3032');parts+=rect(left?17:43,28,5,3,shade,1);}
  else{parts+=rect(24,23,4,3,'#202d30')+rect(37,23,4,3,'#202d30');parts+=rect(29,31,7,2,shade);}
 }
 parts+=rect(17+stride,71,8,2,hem,1)+rect(38-stride,71,8,2,hem,1);
 return parts;
}
function atlas(who){
 var body='';
 for(var row=0;row<5;row++)for(var col=0;col<4;col++)body+=group(col*64,row*80,1,sprite(who,row,col));
 return svg(256,400,body,true);
}
function palm(x,y,k){
 return group(x,y,k,rect(-8,-15,16,118,'#78573e')+rect(-5,-10,6,110,'#b88a54')+
 path('M0 -13 Q-86 -105 -125 -36 Q-72 -53 -3 3Z','#28694f')+path('M0 -15 Q82 -110 136 -46 Q79 -59 4 4Z','#367e50')+
 path('M-1 -15 Q-22 -112 28 -113 Q9 -48 4 3Z','#609d66')+
 path('M-2 -15 Q-72 -52 -103 -20 Q-42 -15 1 3Z','#72b178'));
}
function reeds(x,y,k){var inner='';for(var i=0;i<12;i++){var rx=-33+i*6,ry=(i%4)*7;inner+=line('M'+rx+' 0 L'+(rx+((i%3)-1)*6)+' '+(-52+ry),i%2?'#477b60':'#659b73',3)+rect(rx-2,-54+ry,5,16,'#94704f',2);}return group(x,y,k,inner);}
function human(x,y,scale,colour){return group(x,y,scale,ellipse(0,4,16,4,'#30403955')+path('M-8 -43 L8 -43 L13 -1 L-15 -1 Z',colour)+ellipse(0,-55,11,13,'#b98c68')+path('M-11 -58 Q-14 -75 2 -72 Q12 -69 13 -57 L5 -65 L-9 -61Z','#41343a')+rect(-11,0,9,12,'#4b3e38')+rect(3,0,9,12,'#4b3e38'));}
function glimmer(x,y,size){return path('M'+x+' '+(y-size)+' L'+(x+size*.19)+' '+(y-size*.19)+' L'+(x+size)+' '+y+' L'+(x+size*.19)+' '+(y+size*.19)+' L'+x+' '+(y+size)+' L'+(x-size*.19)+' '+(y+size*.19)+' L'+(x-size)+' '+y+' L'+(x-size*.19)+' '+(y-size*.19)+'Z','#fff0b6');}
function sky(n){
 var dawn=n===0,fire=n===1,royal=n===2,night=n===3,sea=n===4;
 var c1=night?'#243756':sea?'#316d83':royal?'#79abc1':fire?'#8da4b2':'#8bc9d3',c2=night?'#a17e7b':sea?'#b7d9d8':royal?'#f0d6a0':fire?'#efd1a0':'#f8dfaa';
 var s='<defs><linearGradient id="s" x2="0" y2="1"><stop stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient><linearGradient id="water" x2="0" y2="1"><stop stop-color="#4da9bd"/><stop offset=".5" stop-color="#277f9e"/><stop offset="1" stop-color="#1c5373"/></linearGradient><linearGradient id="dust" x2="0" y2="1"><stop stop-color="#f6dbaa"/><stop offset="1" stop-color="#b78a5d"/></linearGradient></defs>';
 s+=rect(0,0,800,600,'url(#s)');
 s+=ellipse(night?657:666,night?93:103,night?37:57,night?37:57,night?'#f3e6ca':'#fff2bd');
 for(var cloud=0;cloud<15;cloud++){
  var cx=(cloud*117+n*39)%880-40,cy=62+(cloud*43)%115;
  if(night){s+=ellipse(cx,cy,38,9,'#aeaeae33');continue;}
  s+=ellipse(cx,cy,40+(cloud%3)*13,12+(cloud%3)*4,'#f7edda88');
  s+=ellipse(cx+21,cy-6,30,13,'#fff6e899');
 }
 for(var m=0;m<9;m++){
  var mx=m*112-65,py=204+((m*49+n*37)%82);
  s+=path('M'+mx+' 369 L'+(mx+85)+' '+py+' L'+(mx+181)+' 369 Z',m%2?'#b4a38b':'#9ca6a0');
 }
 return s;
}
function earth(n){var g=n===0?'#8ab18d':n===1?'#ba9b6f':n===2?'#d4b487':n===3?'#af8c70':'#dcc9a2';return path('M0 360 Q180 285 420 364 T800 337 V600H0Z',g)+path('M0 423 Q230 370 470 410 T800 387 V600H0Z',n===4?'#e6d7b7':n===0?'#719f80':'#c1a075');}
function texture(n){var s='';for(var i=0;i<300;i++){var x=(i*193+n*59)%800,y=334+(i*83)%268,near=y>470;var c=n===0?(i%2?'#8db89c':'#c4c79a'):n===4?'#bfb29b':i%2?'#d9b682':'#e9cca0';s+=rect(x,y,near?5+i%3:2+i%2,1+(near?i%3:0),c);}return s;}
function riverScene(){
 var s=sky(0)+earth(0)+path('M-30 510 Q125 393 332 411 T845 393 L845 600 H-30 Z','url(#water)');
 for(var w=0;w<46;w++){var x=(w*87)%850,y=439+(w*39)%154;s+=line('M'+x+' '+y+' q18 -5 39 0','#a4dad5',2,.35+(w%3)*.1);}
 // Distant imagined buildings avoid asserting a historically exact location.
 s+=path('M554 318 L603 243 L659 318Z','#cfb18a')+rect(562,318,90,91,'#d7b993')+
 rect(575,324,11,83,'#ae9270')+rect(630,324,12,83,'#ae9270')+
 palm(99,405,.66)+palm(738,393,.7)+reeds(55,535,1.65)+reeds(281,508,1.15)+reeds(739,557,1.65);
 var basket=ellipse(449,442,80,16,'#295d6e66')+path('M382 431 Q386 482 453 479 Q523 474 527 430 L504 413 L405 413Z','#b9894c')+path('M386 429 Q459 453 523 428','#e0b875')+line('M403 433 Q455 445 504 430','#7f572e',5);
 for(var b=0;b<9;b++)basket+=line('M'+(401+b*13)+' 438 l-3 24','#edca85',3,.7);
 s+=basket+human(208,452,.96,'#b96758')+human(655,419,.9,'#56759a');
 s+=path('M0 568 Q238 534 404 558 T800 562 V600H0Z','#567f61')+texture(0);
 return s;
}
function burningBushScene(){
 var s=sky(1)+earth(1);
 s+=path('M0 401 L128 298 L212 358 L346 218 L438 337 L591 242 L800 372 V600H0Z','#8a856f');
 s+=path('M0 448 L154 369 L274 414 L435 332 L584 399 L800 346 V600H0Z','#c0a17a');
 for(var b=0;b<10;b++)s+=ellipse((b*109)%800,455+(b%4)*34,29,11,'#9e8d72');
 // The fiery bush is a symbolic light: no face or anthropomorphic image of God.
 s+=ellipse(582,310,124,122,'#fff1ab88')+ellipse(582,312,84,90,'#ffe8a78c');
 s+=path('M578 439 L578 314 M582 375 L540 333 M585 371 L626 340 M581 401 L535 383 M581 395 L621 378','none');
 s+=line('M580 430 L580 323 M580 379 L541 344 M580 378 L627 338','#654d39',10);
 for(var f=0;f<13;f++){var x=540+(f*17)%91,y=294+(f*23)%98;s+=path('M'+x+' '+(y+22)+' Q'+(x-17)+' '+y+' '+x+' '+(y-19)+' Q'+(x+21)+' '+y+' '+(x+8)+' '+(y+22)+'Z',f%2?'#f7ae50':'#ffe497');}
 s+=human(313,471,1.7,'#749184')+human(210,495,.8,'#a77c62');
 for(var i=0;i<4;i++)s+=ellipse(75+i*72,488+i%2*9,21,14,'#eee9d7')+ellipse(92+i*72,480+i%2*9,12,11,'#f3e6cb');
 s+=path('M0 548 Q210 520 405 556 T800 529V600H0Z','#9c8264')+texture(1);
 return s;
}
function palaceScene(){
 var s=sky(2)+earth(2);
 // Court inspired by Ancient Egyptian architecture; not a reconstruction of Pharaon's palace.
 s+=rect(108,202,585,309,'#d4ba92')+path('M95 215 L401 142 L710 213Z','#b78d64')+
 rect(122,226,555,35,'#a77751')+rect(140,261,516,232,'#dec49c');
 for(var i=0;i<6;i++){
  var x=163+i*87;s+=rect(x,258,31,235,'#a88056')+rect(x-10,246,52,15,'#e6ca9d')+rect(x-5,486,42,14,'#a5754e')+rect(x+11,270,6,211,'#eecf9d');
 }
 s+=path('M355 491 L355 354 Q401 312 445 354 L445 491 Z','#453b3a')+
 path('M0 492 L800 482 V600H0Z','#c4a077');
 for(var q=0;q<12;q++)s+=line('M'+(q*82)+' 507 l35 -13','#dcc193',3);
 s+=palm(84,441,.44)+palm(744,435,.48)+human(313,477,1.4,'#5f8d81')+human(257,490,1.2,'#8c694d')+
 human(505,446,1.28,'#7f6b74');
 s+=texture(2);
 return s;
}
function departureScene(){
 var s=sky(3)+earth(3);
 s+=path('M0 485 Q135 429 269 477 T551 450 T800 479 V600H0Z','#957962');
 for(var h=0;h<8;h++){
  var x=45+h*97,y=330+(h%3)*26;
  s+=rect(x,y,72,114,'#a88b74')+path('M'+(x-6)+' '+y+' L'+(x+37)+' '+(y-37)+' L'+(x+80)+' '+y+'Z','#886c5d')+
  rect(x+26,y+49,18,65,'#62554e')+rect(x+11,y+22,12,11,'#ecc48f');
 }
 // Pillar of fire and cloud are described in Exode 13; graphic is symbolic.
 s+=ellipse(642,296,81,172,'#f6cb8277')+
 path('M620 464 Q567 373 622 279 Q638 243 622 193 Q715 284 664 361 Q704 402 654 463Z','#f7b861')+
 path('M641 448 Q614 382 655 320 Q660 287 657 261 Q705 355 663 406Z','#fff0b5');
 s+=ellipse(660,150,160,46,'#aeb9b9')+ellipse(553,149,106,36,'#c6c8c4');
 for(var person=0;person<9;person++)s+=human(87+person*61,493+(person%3)*19,.7+(person%2)*.2,person%2?'#c18f68':'#8ba598');
 s+=path('M0 566 Q250 524 409 557 T800 559 V600H0Z','#7d6355')+texture(3);
 return s;
}
function seaScene(){
 var s=sky(4);
 s+=path('M0 253 Q120 219 259 267 T800 227 V600 H0Z','#6aafb9');
 // No interaction opens the waters. A fixed visual interpretation of Exode 14.
 s+=path('M0 332 Q93 227 250 312 Q285 372 290 593 L0 600 Z','url(#water)')+
 path('M800 321 Q720 228 550 312 Q520 389 518 600 L800 600 Z','url(#water)');
 s+=path('M286 330 Q313 269 400 293 Q482 267 519 330 L530 600 L280 600 Z','#e1cda4');
 s+=path('M351 332 L316 600 L473 600 L437 331Z','#f5dfb3');
 for(var w=0;w<40;w++){
  var leftX=(w*47)%288,rightX=520+(w*71)%280,y=338+(w*37)%245;
  s+=line('M'+leftX+' '+y+' q20 -8 37 0','#c3eaf1',3,.42)+line('M'+rightX+' '+y+' q24 -7 44 0','#c3eaf1',3,.42);
 }
 for(var i=0;i<16;i++){
  var xx=355+(i%4)*32,yy=364+Math.floor(i/4)*43;
  s+=human(xx,yy,.39+Math.floor(i/4)*.07,i%2?'#947357':'#608f8b');
 }
 s+=human(416,478,1.24,'#5d908b');
 for(var q=0;q<18;q++)s+=glimmer(288+(q*17)%228,233+(q%4)*21,2+q%3);
 s+=path('M0 566 Q155 535 279 571 L275 600H0Z','#1d6880')+
 path('M526 572 Q664 533 800 559V600H523Z','#1d6880');
 return s;
}
function scene(n){
 if(n!==0&&n!==1&&n!==2&&n!==3&&n!==4)throw Error('Exodus scene index out of range');
 return svg(800,600,[riverScene,burningBushScene,palaceScene,departureScene,seaScene][n](),false);
}
function prop(type){
 var s='';
 if(type==='basket'){s=ellipse(32,56,24,6,'#524129')+path('M10 28 L54 28 L48 51 Q31 61 17 51 Z','#bb8a55')+rect(15,27,34,6,'#e2ba78',3)+line('M19 38 L45 43','#83582e',3)+line('M24 34 L42 51','#e7b575',3);}
 else if(type==='bush'){s=rect(28,37,8,27,'#6f5042')+ellipse(32,31,24,23,'#65875d')+path('M8 43 Q21 28 21 14 Q33 30 34 7 Q54 29 48 42 Q56 50 42 54 L16 53Z','#f1a249')+path('M19 44 Q23 26 31 21 Q36 35 41 26 Q45 46 31 51 Z','#ffe0a0');}
 else if(type==='staff'){s=line('M23 60 L37 8','#886547',6)+rect(32,5,8,7,'#dcb27a',3)+ellipse(29,54,19,3,'#56533e');}
 else if(type==='pillar'){s=rect(20,8,24,51,'#ac8e65')+rect(11,5,42,9,'#e5c99e')+rect(11,55,42,7,'#b59160')+rect(26,17,7,32,'#d4b383');}
 else if(type==='bread'){s=ellipse(32,49,28,12,'#886748')+ellipse(32,40,22,15,'#e1bc73')+line('M20 39 q6 -7 12 0 m5 -4 q5 -7 11 0','#a57849',2);}
 else if(type==='wave'){s=path('M0 45 Q16 27 32 41 Q51 20 64 35 L64 63 H0Z','#438faf')+line('M3 47 Q17 39 31 48 T60 44','#ccefe8',4);}
 else if(type==='reeds'){for(var r=0;r<9;r++){var x=9+r*6;s+=line('M'+x+' 61 L'+(x+r%3*2)+' '+(14+r%4*5),r%2?'#57856c':'#7cac7c',3)+rect(x+r%3*2-2,12+r%4*5,5,17,'#9f7d56',2);}}
 else if(type==='lamp'){s=ellipse(32,60,18,5,'#775e4b')+rect(17,44,30,15,'#bf8a53',5)+path('M28 45 Q21 31 30 19 Q31 32 38 31 Q43 43 36 46Z','#f9d178');}
 else if(type==='cloud'){s=ellipse(31,40,25,13,'#dae0d3')+ellipse(17,33,16,15,'#f0eadd')+ellipse(43,29,17,18,'#e0e1dc')+rect(12,40,43,9,'#b5c6bb',4);}
 else{s=rect(16,30,30,26,'#aaa58d');}
 return svg(64,64,s,true);
}
window.MosesPixelArt={version:'0.5',atlas:atlas,scene:scene,prop:prop};
}());