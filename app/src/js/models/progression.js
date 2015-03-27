define(function() {
  function Progression(definitions, repo) {
    var referenceId = repo.progressionHash;
    var proMeta = definitions.progressions[referenceId];

    this.id = proMeta.identifier;
    this.name = proMeta.name;
    this.level = repo.level;
    this.icon = 'https://www.bungie.net' + proMeta.icon;
    this.progress = repo.progressToNextLevel;
    this.next = repo.nextLevelAt;

  }

  return Progression;
});
