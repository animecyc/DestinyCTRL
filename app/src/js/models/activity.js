define(function() {
  function Activity(definitions, repo) {
    var referenceId = repo.activityDetails.referenceId;
    var actMeta = definitions.activities[referenceId];
    var actTypeHash = actMeta.activityTypeHash;
    var actTypeMeta = definitions.activityTypes[actTypeHash];
    var placeHash = actMeta.placeHash;
    var placeMeta = definitions.places[placeHash];
    var destHash = actMeta.destinationHash;
    var destMeta = definitions.destinations[destHash];

    this.period = new Date(repo.period);
    // 
    // this.place = {
    //   name : placeMeta.placeName,
    //   description : placeMeta.placeDescription
    // };
    //
    // this.destination = {
    //   id : destMeta.destinationIdentifier,
    //   name : destMeta.destinationName,
    //   description : destMeta.destinationDescription,
    //   icon : destMeta.icon,
    //   locationId : destMeta.locationIdentifier
    // };

    this.type = {
      id : actTypeMeta.identifier,
      name : actMeta.activityName,
      description : actTypeMeta.activityTypeDescription,
      icon : actTypeMeta.icon,
      level : actMeta.activityLevel,
      completed : repo.values.completed.basic.value // 0 no, 1 yes
    };
  }

  return Activity;
});
