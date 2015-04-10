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
          levelProgress : character.levelProgression,
          banner : character.background,
          emblem : character.emblem,
          class : character.characterClass.name,
          race : character.characterClass.race,
          gender : character.characterClass.gender,
          isPrestige : character.isPrestige,
          equipment : [],
          progression : [],
          activities : [],
          raids : []
        }, true);

        var equipment = character.getEquipment(true);
        var progression = character.getProgression();
        var activities = character.getActivities();
        var raids = character.getRaids();
        // console.log(character);

        if(equipment.length) {
          self.set('equipment', equipment.reduce(function(memo, equipment) {
            return memo.concat(equipment);
          }, []).map(function(item) {
            return new ItemComp(item, true);
          }), true);
        }

        if(progression.length) {
          self.set('progression', progression);
        }

        if(activities.length) {
          self.set('activities', activities
          .filter(function(activity) {
            var start = Date.parse(character.advisors.start.nightfall),
                reset = Date.parse(character.advisors.reset.nightfall),
                time = Date.parse(character.lastPlayed),
                valid;

            if (time > start && time < reset ){
              valid = activity;
              return valid;
            }
          })
          .reduce(function(memo, activity) {
              return memo.concat(activity);
          }, []));
        }

        if(raids.length) {
          self.set('raids', raids
          .filter(function(raid) {
            var start = Date.parse(character.advisors.start.nightfall),
                reset = Date.parse(character.advisors.reset.nightfall),
                time = Date.parse(raid.period),
                valid;

            if (time > start && time < reset ){
              valid = raid;
              return valid;
            }
          })
          .reduce(function(memo, raid) {
              return memo.concat(raid);
          }, []));
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
      var progression = this.get('progression');

      return m('div.character.twelve', [
        m('div.card.character-details.four', [
          m('div.card-header.character-header', {
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
          m('div.card-copy.character-equipment', [
            m('ul.items',
              this.get('equipment').map(function(item) {
                return item.view();
              })
            )
          ])
        ]),
        m('div.factions.card.three', [
          m('ul',
          this.get('progression').map(function(faction){
            return m('div.faction', [
              m('div', [
                m('img.faction-icon', {src: faction.icon}),
              ]),
              m('div.faction-level', 'Level ' + faction.level),
              m('div', faction.progress + '/' + faction.next),
            ]);
          })
          )
        ]),
        m('div.activities.card.five.last', [
          m('div.weekly', [
            m('div.icon', [
              m('img', {src : this.character.advisors.weekly[0].icon}),
            ]),
            m('div.info', [
              m('div.title', this.character.advisors.weekly[0].name),
              m('div.description', this.character.advisors.weekly[0].description),
            m('div', (this.get('activities').length !== 0) ?

            m('div.complete',
              this.get('activities').map(function(activity) {
                if(activity.type.id == 'STRIKE_WEEKLY' && activity.type.completed === true) {
                   return 'Level ' + activity.type.level + ' ';
                }
              })
            )
              : '' ),
            ])
          ]),
          m('div.weekly.nightfall', [
            m('div.icon', [
              m('img', {src : this.character.advisors.nightfall.icon}),
            ]),
            m('div.info', [
              m('div.title', this.character.advisors.nightfall.name),
              m('div.description', this.character.advisors.nightfall.description),
              m('div', (this.get('activities').length !== 0) ?
                this.get('activities').map(function(activity) {
                  if(activity.type.id == 'ACTIVITY_TYPE_NIGHTFALL' && activity.type.completed === true) {
                     return m('div.complete','Complete');
                  }
                })
                : '' )
            ]),
          ]),
          m('div.raid.vault', [
            m('img', {src : this.character.raidInfo.vault.icon}),
            m('div.info', [
              m('div.title', 'Vault of Glass'),

              m('div', (this.get('raids').length !== 0) ?
                this.get('raids').map(function(raid) {
                  if(raid.type.id == 'ACTIVITY_TYPE_RAID' && raid.type.completed === 1) {
                     return m('div.complete','Completed at level ' + raid.type.level);
                  }
                })
                : '' )
              ])
          ]),
          m('div.raid.crota', [
            m('img', {src : this.character.raidInfo.crota.icon}),
            m('div.info', [
              m('div.title', 'Crota\'s End'),

              m('div', (this.get('raids').length !== 0) ?
                this.get('raids').map(function(raid) {
                  if(raid.type.id == 'RAID_MOON1' && raid.type.completed === 1) {
                     return m('div.complete','Completed at level ' + raid.type.level);
                  }
                })
                : '' )
              ])
          ])
        ])
      ]);
    }
  });
});
