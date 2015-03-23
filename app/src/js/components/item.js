define([
  'common/component',
  'common/tooltip'
], function(Component, Tooltip) {
  return Component.subclass({
    constructor : function(item) {
      var props = {
        dimmed : false
      };

      Object.keys(item).forEach(function(key) {
        if(typeof item[key] !== 'function') {
          props[key] = item[key];
        }
      });

      this.set(props, true);
      this.extend({ item : item });
    },

    weaponStatsView : function() {
      var primaryStatId = this.get('primaryStatId');
      var magazineStatId = 'STAT_MAGAZINE_SIZE';
      var rows = [];
      var stats = this.get('stats');

      if(stats) {
        rows = [];

        Object.keys(stats).filter(function(key) {
          return key !== primaryStatId && key !== magazineStatId;
        }).forEach(function(key) {
          var stat = stats[key];

          rows.push(
            m('tr', [
              m('td.name', stat.name),
              m('td', [
                m('div.value', [
                  m('div.current', {
                    style : {
                      width : stat.percentage + '%'
                    }
                  })
                ])
              ])
            ])
          );
        }, this);

        var magazineStat = stats[magazineStatId];

        if(magazineStat) {
          rows.push(
            m('tr', [
              m('td.name', magazineStat.name),
              m('td', m('strong', magazineStat.value))
            ])
          );
        }
      }

      return rows.length ? m('table.weaponStatsTable', rows) : void 0;
    },

    armorStatsView : function() {
      var stats = this.get('stats');
      var primaryStatId = this.get('primaryStatId');
      var rows = [];

      Object.keys(stats).filter(function(key) {
        var stat = stats[key];

        return key !== primaryStatId && stat.value > 0;
      }).forEach(function(key) {
        var stat = stats[key];

        rows.push(
          m('div.stat', [
            m('img.icon', {
              src : stat.icon,
              width : 20,
              height : 20
            }),
            stat.name + ' ',
            m('strong', '+' + stat.value)
          ])
        );
      });

      return rows.length ? m('div.armorStats', rows) : void 0;
    },

    primaryStatView : function() {
      var stats = this.get('stats');
      var primaryStatId = this.get('primaryStatId');
      var primaryStat = stats[primaryStatId];

      if(primaryStat) {
        var damage = this.get('damage');
        var heroClasses = ['heroStat'];

        if(damage) { heroClasses.push('damageType' + damage.type); }

        return m('div.' + heroClasses.join('.'), [
          damage ?
            m('div.damageType', {
              style : {
                backgroundImage : 'url(' + damage.icon + ')'
              }
            }) :
            void 0,
          m('div.primaryStat', [
            m('div.stat', primaryStat.value),
            m('div.statName', primaryStat.name)
          ])
        ]);
      }
    },

    setDimming : function(dimmed) {
      this.set('dimmed', dimmed);
    },

    view : function() {
      var type = this.get('type');
      var tier = this.get('tier');

      var itemName = this.get('name');
      var tierName = tier.name;
      var typeName = type.name;
      var itemDesc = this.get('description');
      var iconUrl = this.get('icon');
      var stackSize = this.get('stackSize') || 1;

      var isStackable = this.item.isStackable();
      var isComplete = this.item.isComplete();
      var isDimmed = this.get('dimmed');
      var hasStats = !! this.get('stats');
      var hasDetails = itemDesc || hasStats;

      var itemClasses = ['item'];

      if(isDimmed) { itemClasses.push('dimmed'); }
      if(isComplete) { itemClasses.push('complete'); }

      return m('div.' + itemClasses.join('.'), {
        config : function(el, initialized) {
          if(! initialized) {
            var tooltip = el.querySelector('.itemTooltip');

            new Tooltip(el, tooltip, 100);
          }
        }
      }, [
        m('div.iconWrapper', [
          m('img.icon', {
            src : iconUrl,
            width : 46,
            height : 46
          }),
        ]),
        isStackable ?
          m('div.stack', stackSize) :
          void 0,
        m('div.itemTooltip.tier' + tierName, [
          m('div.header', [
            m('div.name', itemName),
            m('div.meta', [
              m('div.type', typeName),
              m('div.tier', tierName)
            ])
          ]),
          hasDetails ?
            m('div.details', [
              hasStats ?
                this.primaryStatView() :
                void 0,
              m('div.description', itemDesc),
              hasStats ?
                m('div.stats',
                  this.item.isWeapon() ?
                    this.weaponStatsView() :
                    this.armorStatsView()
                ) :
                void 0
            ]) :
            void 0
        ]),
      ]);
    }
  });
});
