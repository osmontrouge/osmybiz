var jsonfile = require('jsonfile')

var file = 'assets/de.json';

var groups = ['amenity', 'shop', 'leisure', 'office', 'tourism'];

function isNeeded(key) {

    return groups.some(function(g) {
        return key.indexOf(g+ "/") > -1;
    })
}

jsonfile.readFile(file, function(err, obj) {
    var data = obj;
    var translations = {};

    var keys = Object.keys(data.de.presets);

    keys.forEach(function (key) {

        if (isNeeded(key)) {
            console.log("found key " + key);
            var val = data.de.presets[key];
            translations[key] = val.name;
        }
    });

    var output = '../../frontend/osmmybiz/src/assets/tags_de.json';

    jsonfile.writeFile(output, translations, function (err) {
        console.error(err)
    })
});