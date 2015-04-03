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
// console.log(dailyHashes);
//     this.daily = [
//       {
//         name : definitions.activities[dailyHashes[0]].activityName,
//         description : definitions.activities[dailyHashes[0]].activityDescription,
//         icon : 'https://www.bungie.net' + definitions.activities[dailyHashes[0]].icon
//       },
//       {
//         name : definitions.activities[dailyHashes[1]].activityName,
//         description : definitions.activities[dailyHashes[1]].activityDescription,
//         icon : 'https://www.bungie.net' + definitions.activities[dailyHashes[1]].icon
//       },
//       {
//         name : definitions.activities[dailyHashes[2]].activityName,
//         description : definitions.activities[dailyHashes[2]].activityDescription,
//         icon : 'https://www.bungie.net' + definitions.activities[dailyHashes[2]].icon
//       }
//     ];

    this.crucible = {
      name : definitions.activities[dailyCrucibleHash].activityName,
      description : definitions.activities[dailyCrucibleHash].activityDescription,
      icon : 'https://www.bungie.net' + definitions.activities[dailyCrucibleHash].icon
    };

    this.weekly = [
      {
        name : definitions.activities[weeklyHashes[0]].activityName,
        description : definitions.activities[weeklyHashes[0]].activityDescription,
        icon : 'https://www.bungie.net' + definitions.activities[weeklyHashes[0]].icon,
        hash : weeklyHashes[0]
      },
      {
        name : definitions.activities[weeklyHashes[1]].activityName,
        description : definitions.activities[weeklyHashes[1]].activityDescription,
        icon : 'https://www.bungie.net' + definitions.activities[weeklyHashes[1]].icon,
        hash : weeklyHashes[1]
      },
      {
        name : definitions.activities[weeklyHashes[2]].activityName,
        description : definitions.activities[weeklyHashes[2]].activityDescription,
        icon : 'https://www.bungie.net' + definitions.activities[weeklyHashes[2]].icon,
        hash : weeklyHashes[2]
      }
    ];

    this.nightfall = {
      name : definitions.activities[nightfallHash].activityName,
      description : definitions.activities[nightfallHash].activityDescription,
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
