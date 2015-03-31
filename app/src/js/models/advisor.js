define(function() {
  function Advisor(definitions, repo) {
    function startDate(date) {
      var d = new Date(date);
      d.setDate(d.getDate()-7);
      return d;
    }

    var nightfallHash = repo.nightfallActivityHash;
    var weeklyHashes = [repo.heroicStrikeHashes[0], repo.heroicStrikeHashes[1], repo.heroicStrikeHashes[2]];
    var dailyHashes = [repo.dailyChapterHashes[0], repo.dailyChapterHashes[1], repo.dailyChapterHashes[2]];
    var dailyCrucibleHash = repo.dailyCrucibleHash;

    this.nightfall = {
      name : definitions.activities[nightfallHash].activityName,
      icon : 'https://www.bungie.net' + definitions.activities[nightfallHash].icon
    };

    this.start = {
      nightfall : startDate(repo.nightfallResetDate),
      weekly : startDate(repo.nightfallResetDate),
    };

    this.reset = {
      nightfall : new Date(repo.nightfallResetDate),
      weekly : new Date(repo.nightfallResetDate),
      dailyStory : new Date(repo.dailyChapterResetDate),
      dailyCrucible : new Date(repo.dailyCrucibleResetDate),
    };

  }

return Advisor;

});
