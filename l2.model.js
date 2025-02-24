window.l2 = window.l2 || {};

(function () {

	var handlers = {};
	var globalHandlers = [];

	var notifyPropertyChanged = function (property, value, sender, isSummon) {
		if (handlers[property])
			handlers[property].forEach(function (handler) {
				handler(value, sender, isSummon);
			});
		globalHandlers.forEach(function (handler) {
			handler(property, value);
		});
	};

	var addHandler = function (property, handler) {
		if (!handlers[property])
			handlers[property] = [];
		handlers[property].push(handler);
	};

	var addGlobalHandler = function (handler) {
		globalHandlers.push(handler);
	};

	var getValue = function (model) {

	};

	var setValue = function (model, value) {
		var obj = l2.model;
		var parts = model.split('.');
		for (var i = 0; i < parts.length - 1; i++)
			obj = obj[parts[i]];
		if (obj[parts[parts.length - 1]] === undefined)
			throw 'Invalid property';
		obj[parts[parts.length - 1]] = value;
	};

	var toBool = function (val) {
		if (val == 'false')
			return false;
		return !!val;
	};

	var L2Item = function (itemType) {
		var grade = null;
		Object.defineProperty(this, 'grade', {
			get: function () { return grade; },
			set: function (value) {
				if (value)
					value = value.toLowerCase();
				if (['d', 'c', 'b', 'a', 's', 's80', 's84'].indexOf(value) >= 0)
					grade = value;
				else
					if (value == 'none' || value == null || value == '')
						grade = null;
					else
						throw 'Invalid grade';
				notifyPropertyChanged(itemType + '.grade', grade);
			}
		});
		var enchant = -1;
		Object.defineProperty(this, 'enchant', {
			get: function () { return enchant; },
			set: function (value) {
				var old = enchant;
				if (value == null || value == '')
					enchant = 0;
				else {
					var intVal = parseInt(value);
					if (!isNaN(intVal) && intVal.toString() == value.toString() && intVal >= 0)
						enchant = intVal;
					else
						throw 'Invalid enchant';
				}
				if (old != enchant)
					notifyPropertyChanged(itemType + '.enchant', enchant);
			}
		});
		var id = -1;
		Object.defineProperty(this, 'id', {
			get: function () { return id; },
			set: function (value) {
				var old = id;
				if (value == null || value == '')
					id = null;
				else {
					var intVal = parseInt(value);
					if (!isNaN(intVal) && intVal.toString() == value.toString())
						id = intVal;
					else
						throw 'Invalid id';
				}
				if (old != id)
					notifyPropertyChanged(itemType + '.id', id);
			}
		});
		Object.defineProperty(this, 'item', {
			get: function () {
				if (this.id)
					return l2.data.tools.getItem(this.id);
				else
					return null;
			}
		});
		var canEnchant = false;
		Object.defineProperty(this, 'canEnchant', {
			get: function () { return canEnchant; },
			set: function (value) {
				canEnchant = !!value;
				if (!canEnchant)
					this.enchant = 0;
				notifyPropertyChanged(itemType + '.canEnchant', canEnchant);
			}
		});
		var disabled = false;
		Object.defineProperty(this, 'disabled', {
			get: function () { return disabled; },
			set: function (value) {
				disabled = !!value;
				if (disabled) {
					this.id = null;
					this.enchant = 0;
				}
				notifyPropertyChanged(itemType + '.disabled', disabled);
			}
		});
	};

	var L2Weapon = function () {
		L2Item.call(this, 'weapon');

		var type = 'bigsword';
		Object.defineProperty(this, 'type', {
			get: function () { return type; },
			set: function (value) {
				type = value.toLowerCase();
				notifyPropertyChanged('weapon.type', type);
			}
		});
	};

	var L2TatooPart = function (part) {
		var stat = null;
		Object.defineProperty(this, 'stat', {
			get: function () { return stat; },
			set: function (value) {
				stat = value;
				notifyPropertyChanged(part + '.stat', stat);
			}
		});
		var val = null;
		Object.defineProperty(this, 'value', {
			get: function () { return val; },
			set: function (value) {
				val = parseInt(value);
				notifyPropertyChanged(part + '.value', val);
			}
		});
		var min = 1;
		Object.defineProperty(this, 'minValue', {
			get: function () { return min; },
			set: function (value) {
				min = parseInt(value);
				notifyPropertyChanged(part + '.minValue', min);
			}
		});
		var max = 1;
		Object.defineProperty(this, 'maxValue', {
			get: function () { return max; },
			set: function (value) {
				max = parseInt(value);
				notifyPropertyChanged(part + '.maxValue', max);
			}
		});
		var enableStr = false;
		Object.defineProperty(this, 'enableStr', {
			get: function () { return enableStr; },
			set: function (value) {
				enableStr = value;
				notifyPropertyChanged(part + '.enableStr', enableStr);
			}
		});
		var enableDex = false;
		Object.defineProperty(this, 'enableDex', {
			get: function () { return enableDex; },
			set: function (value) {
				enableDex = value;
				notifyPropertyChanged(part + '.enableDex', enableDex);
			}
		});
		var enableCon = false;
		Object.defineProperty(this, 'enableCon', {
			get: function () { return enableCon; },
			set: function (value) {
				enableCon = value;
				notifyPropertyChanged(part + '.enableCon', enableCon);
			}
		});
		var enableInt = false;
		Object.defineProperty(this, 'enableInt', {
			get: function () { return enableInt; },
			set: function (value) {
				enableInt = value;
				notifyPropertyChanged(part + '.enableInt', enableInt);
			}
		});
		var enableWit = false;
		Object.defineProperty(this, 'enableWit', {
			get: function () { return enableWit; },
			set: function (value) {
				enableWit = value;
				notifyPropertyChanged(part + '.enableWit', enableWit);
			}
		});
		var enableMen = false;
		Object.defineProperty(this, 'enableMen', {
			get: function () { return enableMen; },
			set: function (value) {
				enableMen = value;
				notifyPropertyChanged(part + '.enableMen', enableMen);
			}
		});
		this.enableAll = function () {
			this.enableStr = true;
			this.enableDex = true;
			this.enableCon = true;
			this.enableInt = true;
			this.enableWit = true;
			this.enableMen = true;
		};
	};

	var L2Tatoo = function (slot) {
		this.add = new L2TatooPart(slot + '.add');
		this.sub = new L2TatooPart(slot + '.sub');
		var enabled = true;
		Object.defineProperty(this, 'enabled', {
			get: function () { return enabled; },
			set: function (value) {
				enabled = toBool(value);
				if (!enabled)
					this.checked = false;
				notifyPropertyChanged(slot + '.enabled', enabled);
			}
		});
		var checked = false;
		Object.defineProperty(this, 'checked', {
			get: function () { return checked; },
			set: function (value) {
				checked = toBool(value);
				notifyPropertyChanged(slot + '.checked', checked);
			}
		});
	};

	var L2Skill = function (id, data, skillList, _level) {
		this.id = id;
		this.data = data;
		var list = skillList;
		var checked = false;
		Object.defineProperty(this, 'checked', {
			get: function () { return checked; },
			set: function (value) {
				checked = value;
				notifyPropertyChanged(list.type + '[].checked', checked, this);
			}
		});
		var level = _level || 0;
		Object.defineProperty(this, 'level', {
			get: function () { return level; },
			set: function (value) {
				level = parseInt(value);
				notifyPropertyChanged(list.type + '[].level', level, this);
			}
		});
		var skill = null;
		Object.defineProperty(this, 'skill', {
			get: function () {
				if (!skill)
					skill = l2.data.tools.getSkill(this.id);
				return skill;
			}
		})
	};

	var L2SkillList = function (type, isSummon) {
		this.type = type;
		this.isSummon = !!isSummon;
		var list = [];
		this.add = function (id, data, level) {
			var skill = new L2Skill(id, data, this, level);
			list.push(skill);
			notifyPropertyChanged(type + '.add', skill, null, this.isSummon);
		};
		this.clear = function () {
			list.forEach(function (s) {
				notifyPropertyChanged(type + '.remove', s, null, this.isSummon);
			});
			list = [];
			notifyPropertyChanged(type + '.clear');
		};
		this.forEach = function (callback) {
			list.forEach(callback);
		};
		this.filter = function (callback) {
			return list.filter(callback);
		};
		this.map = function (callback) {
			return list.map(callback);
		};
		this.findById = function (id) {
			for (var i = 0; i < list.length; i++)
				if (list[i].id == id)
					return list[i];
			return null;
		};
		this.removeById = function (id) {
			var index = -1;
			for (var i = 0; i < list.length; i++)
				if (list[i].id == id) {
					index = i;
					break;
				}
			if (index >= 0) {
				var removed = list.splice(index, 1);
				notifyPropertyChanged(type + '.remove', removed[0], null, this.isSummon);
			}
		};
		this.toJSON = function () {
			return JSON.stringify(list.filter(function (s) {
				return s.level > 0;
			}).map(function (s) {
				return { id: s.id, level: s.level };
			}));
		};
	};

	var characterModel = {
		addHandler: addHandler,
		addGlobalHandler: addGlobalHandler,
		getValue: getValue,
		setValue: setValue,
		weapon: new L2Weapon(),
		shield: new L2Item('shield'),
		helmet: new L2Item('helmet'),
		bodyUpper: new L2Item('bodyUpper'),
		bodyLower: new L2Item('bodyLower'),
		gloves: new L2Item('gloves'),
		boots: new L2Item('boots'),
		cloak: new L2Item('cloak'),
		underwear: new L2Item('underwear'),
		belt: new L2Item('belt'),
		necklace: new L2Item('necklace'),
		earring1: new L2Item('earring1'),
		earring2: new L2Item('earring2'),
		ring1: new L2Item('ring1'),
		ring2: new L2Item('ring2'),
		tatoo1: new L2Tatoo('tatoo1'),
		tatoo2: new L2Tatoo('tatoo2'),
		tatoo3: new L2Tatoo('tatoo3'),
		selfBuffs: new L2SkillList('selfBuffs'),
		toggles: new L2SkillList('toggles'),
		triggers: new L2SkillList('triggers'),
		commonBuffs: new L2SkillList('commonBuffs'),		
		songs: new L2SkillList('songs'),
		dances: new L2SkillList('dances'),
		clanSkills: new L2SkillList('clanSkills'),
		subClassSkills: new L2SkillList('subClassSkills'),
		transforms: new L2SkillList('transforms'),
		transformBuffs: new L2SkillList('transformBuffs'),
		transformPassives: new L2SkillList('transformPassives'),
		passives: new L2SkillList('passives')
	};

	window.l2.model = characterModel;

	var addModel = function (property, getter, setter) {
		Object.defineProperty(window.l2.model, property, {
			get: getter,
			set: setter
		});
	};

	var enemyPdef = 1;
	addModel('enemyPdef', function () { return enemyPdef; }, function (value) {
		var intVal = parseInt(value);
		if (!isNaN(intVal) && intVal >= 0) {
			enemyPdef = intVal
			notifyPropertyChanged('enemyPdef', enemyPdef);
		} else
			throw 'Invalid enemyPdef';
	});

	var enemyMdef = 1;
	addModel('enemyMdef', function () { return enemyMdef; }, function (value) {
		var intVal = parseInt(value);
		if (!isNaN(intVal) && intVal >= 0) {
			enemyMdef = intVal;
			notifyPropertyChanged('enemyMdef', enemyMdef);
		} else
			throw 'Invalid enemyMdef';
	});
	window.l2.model.enemyMdef = enemyMdef;

	var enemyEvas = 1;
	addModel('enemyEvas', function () { return enemyEvas; }, function (value) {
		var intVal = parseInt(value);
		if (!isNaN(intVal) && intVal >= 0) {
			enemyEvas = intVal;
			notifyPropertyChanged('enemyEvas', enemyEvas);
		} else
			throw 'Invalid enemyEvas';
	});

	var skillPw = 1;
	addModel('skillPw', function () { return skillPw; }, function (value) {
		var intVal = parseInt(value);
		if (!isNaN(intVal) && intVal >= 0) {
			skillPw = intVal;
			notifyPropertyChanged('skillPw', skillPw);
		} else
			throw 'Invalid skillPw';
	});

	var enemyResistLvl = 0;
	addModel('enemyResistLvl', function () { return enemyResistLvl; }, function (value) {
		var intVal = parseInt(value);
		if (!isNaN(intVal) && intVal >= -5 && intVal <= 5) {
			enemyResistLvl = intVal;
			notifyPropertyChanged('enemyResistLvl', enemyResistLvl);
		} else
			throw 'Invalid enemyResistLvl';
	});

	var shotsType = 'Off';
	addModel('shotsType', function () { return shotsType; }, function (value) {
		if (['Off', 'On', 'Bless'].indexOf(value) >= 0) {
			shotsType = value;
			notifyPropertyChanged('shotsType', shotsType);
		} else
			throw 'Invalid shotsType';
	});

	var raceId = 1;
	addModel('raceId', function () { return raceId; }, function (value) {
		var intVal = parseInt(value);
		if (!isNaN(intVal) && intVal >= 0 && intVal <= 5) {
			raceId = intVal;
			notifyPropertyChanged('raceId', raceId);
		} else
			throw 'Invalid raceId';
	});

	var prof = 0;
	addModel('prof', function () { return prof; }, function (value) {
		var intVal = parseInt(value);
		if (!isNaN(intVal) && intVal >= 0 && intVal <= 3) {
			prof = intVal;
			notifyPropertyChanged('prof', prof);
		} else
			throw 'Invalid prof';
	});

	var classId = 0;
	addModel('classId', function () { return classId; }, function (value) {
		var intVal = parseInt(value);
		if (!isNaN(intVal) && intVal >= 0) {
			classId = intVal;
			notifyPropertyChanged('classId', classId);
		} else
			throw 'Invalid classId';
	});

	var level = 0;
	addModel('level', function () { return level; }, function (value) {
		var intVal = parseInt(value);
		if (!isNaN(intVal) && intVal >= 1 && intVal <= 85) {
			level = intVal;
			notifyPropertyChanged('level', level);
		} else
			throw 'Invalid level';
	});

	var hpPercent = 100;
	addModel('hpPercent', function () { return hpPercent; }, function (value) {
		var intVal = parseInt(value);
		if (!isNaN(intVal) && [30, 60, 100].indexOf(intVal) >= 0) {
			hpPercent = intVal;
			notifyPropertyChanged('hpPercent', hpPercent);
		} else
			throw 'Invalid hpPercent';
	});

	var position = 'front';
	addModel('position', function () { return position; }, function (value) {
		if (['front', 'behind', 'side'].indexOf(value) >= 0) {
			position = value;
			notifyPropertyChanged('position', position);
		} else
			throw 'Invalid position';
	});

	var moving = 'staying';
	addModel('moving', function () { return moving; }, function (value) {
		if (['staying', 'running', 'walking', 'sitting'].indexOf(value) >= 0) {
			moving = value;
			notifyPropertyChanged('moving', moving);
		} else
			throw 'Invalid moving';
	});

	var setGrade = null;
	addModel('setGrade', function () { return setGrade; }, function (value) {
		if (['d', 'c', 'b', 'a', 's', 's80', 's84'].indexOf(value) >= 0)
			setGrade = value;
		else
			if (value == 'none')
				setGrade = null;
			else
				throw 'Invalid grade';
		notifyPropertyChanged('setGrade', setGrade);
	});

	var residence = null;
	addModel('residence', function () { return residence; }, function (value) {
		if (value == '') {
			residence = null;
			notifyPropertyChanged('residence', residence);
		} else {
			var intVal = parseInt(value);
			if (!isNaN(intVal) && intVal >= 0) {
				residence = intVal;
				notifyPropertyChanged('residence', residence);
			} else
				throw 'Invalid residence';
		}
	});

	var transformId = null;
	addModel('transformId', function () { return transformId; }, function (value) {
		if (value == '' || value == null) {
			transformId = null;
			notifyPropertyChanged('transformId', transformId);
		} else {
			var intVal = parseInt(value);
			if (!isNaN(intVal) && intVal >= 0) {
				transformId = intVal;
				notifyPropertyChanged('transformId', transformId);
			} else
				throw 'Invalid transformId';
		}
	});

	var summonId = null;
	addModel('summonId', function () { return summonId; }, function (value) {
		summonId = value;
		notifyPropertyChanged('summonId', summonId);
	});

	var summonLevel = null;
	addModel('summonLevel', function () { return summonLevel; }, function (value) {
		summonLevel = value;
		notifyPropertyChanged('summonLevel', summonLevel);
	});

	var autoSelectPassives = true;
	addModel('autoSelectPassives', function () { return autoSelectPassives; }, function (value) {
		autoSelectPassives = toBool(value);
		notifyPropertyChanged('autoSelectPassives', autoSelectPassives);
	});

	var checkboxes1 = {};
	l2.ui.fieldsets.forEach(function (fs) {
		checkboxes1[fs] = true;
		addModel(fs + 'Visible', function () {
			return checkboxes1[fs];
		}, function (value) {
			checkboxes1[fs] = toBool(value);
			notifyPropertyChanged(fs + 'Visible', checkboxes1[fs]);
		});
	});

	var summonModel = {
		selfBuffs: new L2SkillList('selfBuffs', 1),
		triggers: new L2SkillList('triggers', 1),
		commonBuffs: new L2SkillList('commonBuffs', 1),
		songs: new L2SkillList('songs', 1),
		dances: new L2SkillList('dances', 1)
	};

	window.l2.model = summonModel;

	var checkboxes2 = {};
	l2.ui.fieldsets.forEach(function (fs) {
		checkboxes2[fs] = true;
		addModel(fs + 'Visible', function () {
			return checkboxes2[fs];
		}, function (value) {
			checkboxes2[fs] = toBool(value);
			notifyPropertyChanged(fs + 'Visible', checkboxes2[fs]);
		});
	});

	window.l2.model = characterModel;

	summonModel.summonModel = summonModel;
	summonModel.characterModel = characterModel;

	characterModel.summonModel = summonModel;
	characterModel.characterModel = characterModel;

})();