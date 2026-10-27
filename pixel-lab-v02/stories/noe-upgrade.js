/* Pixel LAB v0.2: visual upgrade for Noé; source images are created locally by art-factory.js. */
(function(){'use strict';
var cfg=window.PIXEL_CONFIG,images=window.PIXEL_IMAGES,factory=window.PixelArtFactory;
if(!cfg||cfg.id!=='noe'||!factory)throw Error('v0.2 noe: story or art factory missing');
cfg.visualVersion='0.2';cfg.avatarAtlas='noe-atlas-v02';
cfg.avatars=['noah'];cfg.assetNames.push('noe-atlas-v02');
images['noe-atlas-v02']=factory.atlas('noah');
for(var i=1;i<=5;i++){var key='noe-scene-'+i;images[key]=factory.scene('noah',i-1);}
cfg.cover='noe-scene-1';
cfg.chapterArts=[1,2,3,4,5].map(function(i){return 'noe-scene-'+i;});
cfg.areas=["Le chantier de l’arche","Tous à bord","La pluie et l’attente","L’eau se retire","La promesse"];
cfg.tagline='NOÉ · AVENTURE PIXEL V0.2';
cfg.intro="Une arche à construire, des animaux à accueillir, la traversée du déluge et la promesse de Dieu. Explore cinq chapitres aux décors renouvelés.";
}());
