define(function() {
  function Raid(definitions, repo) {

    var referenceId = repo.activityDetails.referenceId;
    var actMeta = definitions.activities[referenceId];
    var actTypeHash = actMeta.activityTypeHash;
    var actTypeMeta = definitions.activityTypes[actTypeHash];

    this.period = new Date(repo.period);

    this.type = {
      id : actTypeMeta.identifier,
      name : actMeta.activityName,
      description : actTypeMeta.activityTypeDescription,
      icon : actTypeMeta.icon,
      level : actMeta.activityLevel,
      completed : repo.values.completed.basic.value // 0 no, 1 yes
    };
  }

  return Raid;
});
