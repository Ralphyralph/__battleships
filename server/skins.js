const fs = require('fs');
const _ = require('underscore');

const default_skin = 'space_atomic';

exports.list = getSkins(getDirectories('../public/skins/'));

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

function readConfigJson(path) {
	return JSON.parse(require('fs').readFileSync('../public/skins/'+path+'/configuration.js', 'utf8'));
}

function getSkins(dirs) {
	return _.map(dirs, function(item) {
		return {
			name: item,
			...readConfigJson(item)
		}
	})
}
