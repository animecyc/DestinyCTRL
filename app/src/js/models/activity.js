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

    // this.isCompleted = repo.isCompleted;

    this.place = {
      name : placeMeta.placeName,
      description : placeMeta.placeDescription
    };

    this.destination = {
      id : destMeta.destinationIdentifier,
      name : destMeta.destinationName,
      description : destMeta.destinationDescription,
      icon : destMeta.icon,
      locationId : destMeta.locationIdentifier
    };

    this.type = {
      id : actTypeMeta.identifier,
      name : actTypeMeta.activityTypeName,
      description : actTypeMeta.activityTypeDescription,
      icon : actTypeMeta.icon
    };
  }



  return Activity;
});
