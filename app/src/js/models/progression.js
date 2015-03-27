define(function() {
  function Progression(definitions, repo) {
    var referenceId = repo.progressionHash;
    var proMeta = definitions.progressions[referenceId];

    this.type = {
      id : proMeta.identifier,
      name : proMeta.name,
      level : repo.level,
      icon : proMeta.icon,
      progress: repo.progressToNextLevel,
      next: repo.nextLevelAt
    };
  }

  return Progression;
});
