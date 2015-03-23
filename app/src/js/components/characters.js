define([
  'common/component',
  'components/character'
], function(Component, CharacterComp) {
  return Component.subclass({
    constructor : function(characters) {
      this.set({
        characters : characters.map(function(character) {
          return new CharacterComp(character);
        }) || []
      }, true);

      this.sync();
    },

    view : function() {
      return this.get('characters').map(function(character) {
        return character.view();
      });
    },

    sync : function() {
      var self = this;
      var comps = this.get('characters');

      if(! this.hasOwnProperty('__syncIdx')) {
        this.__syncIdx = 0;
      }

      if(this.__syncIdx >= comps.length) {
        delete this.__syncIdx;
      } else {
        comps[this.__syncIdx].sync().then(function() {
          self.__syncIdx++;
          self.sync();
        });
      }
    }
  });
});
