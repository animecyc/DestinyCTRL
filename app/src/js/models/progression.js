define(function() {
  function Progression(definitions, repo) {
    //console.log(definitions);
    var referenceId = repo.progressionHash;
    var proMeta = definitions.progressions[referenceId];
    var proTypeHash = proMeta.progressionHash;
    //console.log(proMeta);


  }

  return Progression;
});
