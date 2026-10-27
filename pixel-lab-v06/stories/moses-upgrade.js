/* Moïse Pixel v0.5 — assemble the reusable core with story-specific art.
   Five chapter illustrations and two sprite atlases are local SVG resources. */
(function(){'use strict';
var cfg=window.PIXEL_CONFIG,images=window.PIXEL_IMAGES,art=window.MosesPixelArt;
if(!cfg||cfg.id!=='moses'||!art||!window.PIXEL_CHAPTERS||window.PIXEL_CHAPTERS.length!==5)throw Error('Missing Moses content or art module');
cfg.visualVersion='0.5';
cfg.avatarAtlas='moses-atlas-v05';
cfg.chapterAtlases=['sister-atlas-v05','moses-atlas-v05','moses-atlas-v05','moses-atlas-v05','moses-atlas-v05'];
cfg.worldProps=['basket','reeds','bush','staff','pillar','bread','wave','lamp','cloud'];
cfg.worldProps.forEach(function(type){var key='prop-'+type;images[key]=art.prop(type);cfg.assetNames.push(key);});
images['moses-atlas-v05']=art.atlas('moses');
images['sister-atlas-v05']=art.atlas('sister');
cfg.assetNames.push('moses-atlas-v05','sister-atlas-v05');
for(var i=0;i<5;i++){var k='moses-scene-'+(i+1);images[k]=art.scene(i);}
cfg.chapterArts=['moses-scene-1','moses-scene-2','moses-scene-3','moses-scene-4','moses-scene-5'];
cfg.cover=cfg.chapterArts[0];
cfg.visualNotes=[
 'Le Nil, les roseaux, le panier et une sœur attentive. Les bâtiments sont imaginés.',
 'Le buisson ardent est illustré symboliquement sans représenter Dieu.',
 'Le palais d’Égypte est une interprétation graphique, pas une reconstitution.',
 'La Pâque et le départ sont racontés avec gravité, sans mise en spectacle des souffrances.',
 'La mer est représentée ouverte selon le récit : le joueur ne provoque pas le miracle.'
];
}());
