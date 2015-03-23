define([
  'common/component',
  'components/item',
  'components/filter'
], function(Component, ItemComp, FilterComp) {
  return Component.subclass({
    constructor : function(character) {
      this.set({
        initialized : false
      }, true);

      this.extend({
        character : character
      });
    },

    sync : function() {
      var self = this;
      var character = this.character;

      m.startComputation();

      return character.sync().then(function() {
        self.set({
          initialized : true,
          level : character.level,
          banner : character.background,
          emblem : character.emblem,
          class : character.characterClass.name,
          race : character.characterClass.race,
          gender : character.characterClass.gender,
          isPrestige : character.isPrestige,
          equipment : []
        }, true);

        var equipment = character.getEquipment(true);

        if(equipment.length) {
          self.set('equipment', equipment.reduce(function(memo, equipment) {
            return memo.concat(equipment);
          }, []).map(function(item) {
            return new ItemComp(item, true);
          }), true);
        }

        m.endComputation();

        return self;
      });
    },

    view : function() {
      if(! this.get('initialized')) {
        return void 0;
      }

      var charLevel = this.get('level');
      var charGender = this.get('gender');
      var charRace = this.get('race');
      var charBanner = this.get('banner');
      var charEmblem = this.get('emblem');
      var charClass = this.get('class');
      var isPrestige = this.get('isPrestige');

      return m('div.character.twelve', [
        m('div.character-details.four', [
          m('div.character-header', {
            style : {
              backgroundImage : 'url(' + charBanner + ')'
            }
          }, [
            m('img.character-emblem', {
              src : charEmblem,
              width : 50,
              height : 50
            }),
            m('div.character-about', [
              m('div.class', charClass),
              m('div.race',  [charRace, charGender].join(' ')),
              m('div.level.' + (isPrestige ? 'prestige' : ''), charLevel),
            ])
          ]),
          m('div.character-equipment', [
            m('ul.items',
              this.get('equipment').map(function(item) {
                return item.view();
              })
            )
          ])
        ]),

      ]);
    }
  });
});
