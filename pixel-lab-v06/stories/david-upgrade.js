/* David Pixel v0.6 · world config, local SVG illustration packs. */
(function(){'use strict';
var c=window.PIXEL_CONFIG,im=window.PIXEL_IMAGES,art=window.DavidPixelArt;
if(!c||c.id!=='david'||!art||window.PIXEL_CHAPTERS.length!==5)throw Error('David v0.6 missing story or art module');
c.visualVersion='0.6';c.avatarAtlas='david-atlas-v06';
c.worldProps=['sheep','staff','oil','scroll','shield','provisions','armour','stones','sling','sun'];
c.worldProps.forEach(function(type){var key='prop-'+type;im[key]=art.prop(type);c.assetNames.push(key);});
im['david-atlas-v06']=art.atlas();c.assetNames.push('david-atlas-v06');
for(var i=1;i<=5;i++)im['david-scene-'+i]=art.scene(i-1);
c.chapterArts=[1,2,3,4,5].map(function(n){return 'david-scene-'+n;});
c.cover='david-scene-1';
c.areas=['Les collines de Bethléhem','La rencontre avec Samuel','La vallée d’Éla','Le torrent aux cinq pierres','Le chemin du courage'];
c.visualNotes=['Un berger et son troupeau : maisons et collines sont des décors imaginés.','L’onction de David est racontée, mais les visages et vêtements sont fictifs.','Les deux camps sont représentés sans reconstituer leur emplacement exact.','Le ruisseau et les cinq pierres sont bibliques ; aucune action violente n’est jouée.','Le récit évoque une victoire ; notre illustration montre seulement l’aube et le courage.'];
}());