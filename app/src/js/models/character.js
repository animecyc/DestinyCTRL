define([
  'common/api',
  'models/equipment',
  'models/bucket',
  'models/activity',
  'models/progression',
  'models/advisor'
], function(API, Equipment, Bucket, Activity, Progression, Advisor) {
  var equipmentBuckets = [
    'BUCKET_BUILD','BUCKET_PRIMARY_WEAPON',
    'BUCKET_SPECIAL_WEAPON','BUCKET_HEAVY_WEAPON',
    'BUCKET_HEAD','BUCKET_ARMS',
    'BUCKET_CHEST', 'BUCKET_LEGS',
    'BUCKET_CLASS_ITEMS', 'BUCKET_GHOST',
    'BUCKET_VEHICLE', 'BUCKET_SHIP',
    'BUCKET_SHADER', 'BUCKET_EMBLEM'
  ];

  var itemsBuckets = [
    'BUCKET_BUILD','BUCKET_PRIMARY_WEAPON',
    'BUCKET_SPECIAL_WEAPON','BUCKET_HEAVY_WEAPON',
    'BUCKET_HEAD','BUCKET_ARMS',
    'BUCKET_CHEST', 'BUCKET_LEGS',
    'BUCKET_CLASS_ITEMS', 'BUCKET_GHOST',
    'BUCKET_VEHICLE', 'BUCKET_SHIP',
    'BUCKET_SHADER', 'BUCKET_EMBLEM'
  ];

  var activityTypes = [
    'ACTIVITY_TYPE_NIGHTFALL', 'ACTIVITY_TYPE_RAID',
    'RAID_MOON1', 'STRIKE_WEEKLY'
  ];

  var progressionTypes = [
    'faction_fotc_vanguard', 'faction_pvp', 'faction_cryptarch',
    'faction_pvp_dead_orbit','faction_pvp_future_war_cult',
    'faction_pvp_new_monarchy','faction_eris',
    'faction_event_iron_banner','faction_event_queen'
  ];

  function Character(account, data) {
    this.account = account;

    this.id = data.characterId;
    this.emblem = null;
    this.background = null;
    this.level = 0;
    this.buckets = [];
    this.activities = [];
    this.progressions = [];
    this.advisors = null;
  }

  Character.prototype.sync = function() {
    return Promise.all([
      this._syncClass(),
      this._syncInventory(),
      this._syncActivities(),
      this._syncProgression(),
      this._syncAdvisor()
    ]);
  };

  Character.prototype.getInventory = function() {
    return this.buckets.reduce(function(memo, bucket) {
      return memo.concat(bucket.getItems());
    }, []);
  };

  Character.prototype.getProgression = function() {
    return this.progressions.filter(function(type) {
      return progressionTypes.indexOf(type.name) > -1;
    }).reduce(function(memo, type) {
      var i = progressionTypes.indexOf(type.name);
      if(i > -1) {
        memo[i] = type;
      }
      return memo;
    }, []);
  };

  Character.prototype.getActivities = function() {
    return this.activities.filter(function(activity) {
      return activityTypes.indexOf(activity.type.id) > -1;
    }).reduce(function(memo, activity) {
      var activities = activity;
      return memo.concat(activities);
    }, []);
  };

  Character.prototype.getCache = function(isEquipped) {
    return this.buckets.filter(function(bucket) {
      return itemsBuckets.indexOf(bucket.type) > -1;
    }).reduce(function(memo, bucket) {
      var items = bucket.getItems();

      if(typeof isEquipped === 'boolean') {
        items = items.filter(function(item) {
          return item.isEquipped === isEquipped;
        });
      }

      return memo.concat(items);
    }, []);
  };

  Character.prototype.getEquipment = function(isEquipped) {
    return this.buckets.filter(function(bucket) {
      return equipmentBuckets.indexOf(bucket.type) > -1;
    }).reduce(function(memo, bucket) {
      var items = bucket.getItems();

      if(typeof isEquipped === 'boolean') {
        items = items.filter(function(item) {
          return item.isEquipped === isEquipped;
        });
      }

      return memo.concat(items);
    }, []);
  };

  Character.prototype.getMarks = function(type) {
    if(type === 'pvp') {
      return this._getBucketByType('BUCKET_CURRENCY_FACTION_PVP');
    }

    return this._getBucketByType('BUCKET_CURRENCY_FACTION_PVE');
  };

  Character.prototype.getMessages = function() {
    return this._getBucketByType('BUCKET_MESSAGES');
  };

  Character.prototype.getRecovery = function() {
    return this._getBucketByType('BUCKET_RECOVERY');
  };

  Character.prototype.getBuild = function() {
    return this._getBucketByType('BUCKET_BUILD');
  };

  Character.prototype.getPrimaryWeapons = function() {
    return this._getBucketByType('BUCKET_PRIMARY_WEAPON');
  };

  Character.prototype.getSpecialWeapons = function() {
    return this._getBucketByType('BUCKET_SPECIAL_WEAPON');
  };

  Character.prototype.getHeavyWeapons = function() {
    return this._getBucketByType('BUCKET_HEAVY_WEAPON');
  };

  Character.prototype.getHeadArmor = function() {
    return this._getBucketByType('BUCKET_HEAD');
  };

  Character.prototype.getArmArmor = function() {
    return this._getBucketByType('BUCKET_ARMS');
  };

  Character.prototype.getChestArmor = function() {
    return this._getBucketByType('BUCKET_CHEST');
  };

  Character.prototype.getLegArmor = function() {
    return this._getBucketByType('BUCKET_LEGS');
  };

  Character.prototype.getClassItems = function() {
    return this._getBucketByType('BUCKET_CLASS_ITEMS');
  };

  Character.prototype.getGhosts = function() {
    return this._getBucketByType('BUCKET_GHOST');
  };

  Character.prototype.getVehicles = function() {
    return this._getBucketByType('BUCKET_VEHICLE');
  };

  Character.prototype.getShips = function() {
    return this._getBucketByType('BUCKET_SHIP');
  };

  Character.prototype.getShaders = function() {
    return this._getBucketByType('BUCKET_SHADER');
  };

  Character.prototype.getEmblems = function() {
    return this._getBucketByType('BUCKET_EMBLEM');
  };

  Character.prototype.getMaterials = function() {
    return this._getBucketByType('BUCKET_MATERIALS');
  };

  Character.prototype.getConsumables = function() {
    return this._getBucketByType('BUCKET_CONSUMABLES');
  };

  Character.prototype.getMissions = function() {
    return this._getBucketByType('BUCKET_MISSION');
  };

  Character.prototype.getBounties = function() {
    return this._getBucketByType('BUCKET_BOUNTIES');
  };

  Character.prototype._syncClass = function() {
    var self = this;

    return API.requestWithToken(
      'GET',
      '/Destiny/' + self.account.type +
      '/Account/' + self.account.id +
      '/Character/' + self.id,
      { definitions : true }
    ).then(function(resp) {
      var repo = resp.data;
      var definitions = resp.definitions;

      self.level = repo.characterLevel;
      self.isPrestige = repo.isPrestigeLevel;
      self.emblem = 'https://www.bungie.net/' +
        repo.emblemPath.replace(/^\//, '');
      self.background = 'https://www.bungie.net/' +
        repo.backgroundPath.replace(/^\//, '');

      var classHash = repo.characterBase.classHash;
      var classDef = definitions.classes[classHash];
      var raceHash = repo.characterBase.raceHash;
      var raceDef = definitions.races[raceHash];
      var genderHash = repo.characterBase.genderHash;
      var genderDef = definitions.genders[genderHash];

      self.characterClass = {
        type : repo.characterBase.classType,
        name : classDef.className,
        gender : genderDef.genderName,
        race : raceDef.raceName
      };
      self.levelProgression = {
        progress : repo.levelProgression.progressToNextLevel,
        nextLevel : repo.levelProgression.nextLevelAt,
        lightProgress : repo.characterBase.stats.STAT_LIGHT.value,
        lightNextLevel : repo.characterBase.stats.STAT_LIGHT.value
      };
    });
  };

  Character.prototype._syncInventory = function() {
    var self = this;

    return API.requestWithToken(
      'GET',
      '/Destiny/' + self.account.type +
      '/Account/' + self.account.id +
      '/Character/' + self.id +
      '/Inventory',
      { definitions : true }
    ).then(function(resp) {
      var data = resp.data.buckets;
      var definitions = resp.definitions;

      Object.keys(data).forEach(function(key) {
        Object.keys(data[key] || {}).map(function(bucketKey) {
          return data[key][bucketKey];
        }).forEach(function(bucket) {
          self.buckets.push(new Bucket(definitions, bucket));
        });
      });
    });
  };

  Character.prototype._syncActivities = function() {
    var self = this;

    return API.requestWithToken(
      'GET',
      '/Destiny/' + self.account.type +
      '/Account/' + self.account.id +
      '/Character/' + self.id +
      '/Activities',
      { definitions : true }
    ).then(function(resp) {
      var activities = resp.data.available;
      var definitions = resp.definitions;

      activities.forEach(function(repo) {
        self.activities.push(new Activity(definitions, repo));
      });
    });
  };

  Character.prototype._syncProgression = function() {
    var self = this;

    return API.requestWithToken(
      'GET',
      '/Destiny/' + self.account.type +
      '/Account/' + self.account.id +
      '/Character/' + self.id +
      '/Progression',
      { definitions : true }
    ).then(function(resp) {
      var progressions = resp.data.progressions;
      var definitions = resp.definitions;

      progressions.forEach(function(repo) {
        self.progressions.push(new Progression(definitions, repo));
      });

    });
  };

  Character.prototype._syncAdvisor = function() {
    var self = this;

    return API.request(
      'GET',
      '/Destiny/' +
      '/Advisors/',
      { definitions : true }
    ).then(function(resp) {
      var advisors = resp.data;
      var definitions = resp.definitions;
      self.advisors = new Advisor(definitions, advisors);

    });
  };


  Character.prototype._getBucketByType = function(type) {
    var _bucket = null;

    this.buckets.some(function(bucket) {
      if(bucket.type === type) {
        _bucket = bucket;

        return true;
      }

      return false;
    });

    return _bucket;
  };

  return Character;
});
