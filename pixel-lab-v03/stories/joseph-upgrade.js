/* Pixel LAB v0.3: visual upgrade for Joseph; source images are created locally by art-factory.js. */
(function(){'use strict';
var cfg=window.PIXEL_CONFIG,images=window.PIXEL_IMAGES,factory=window.PixelArtFactory;
if(!cfg||cfg.id!=='joseph'||!factory)throw Error('v0.3 joseph: story or art factory missing');
cfg.visualVersion='0.3';cfg.avatarAtlas='joseph-atlas-v03';
cfg.avatars=['joseph'];cfg.assetNames.push('joseph-atlas-v03');
images['joseph-atlas-v03']=factory.atlas('joseph');
cfg.worldProps=["sheaf","jar","tent","palm"];
 cfg.worldProps.forEach(function(type){var key='prop-'+type;images[key]=factory.prop('joseph',type);if(cfg.assetNames.indexOf(key)<0)cfg.assetNames.push(key);});
 for(var i=1;i<=5;i++){var key='joseph-scene-'+i;images[key]=factory.scene('joseph',i-1);}
cfg.cover='joseph-scene-1';
cfg.chapterArts=[1,2,3,4,5].map(function(i){return 'joseph-scene-'+i;});
cfg.areas=["Les rêves de Joseph","Le chemin vers l’Égypte","Les épreuves de Joseph","Le palais et les récoltes","Le pardon et les retrouvailles"];
cfg.tagline='JOSEPH · AVENTURE PIXEL V0.3';
cfg.intro="Une aventure de rêves, de routes, de difficultés et de pardon, avec Joseph désormais animé. Découvre cinq chapitres bibliques.";
}());
