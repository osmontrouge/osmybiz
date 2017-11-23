var jsonfile = require('jsonfile')

var presets = 'assets/presets.json';

const groups = ['amenity', 'shop', 'leisure', 'office', 'tourism'];

function isNeeded(key) {
    return groups.some(function (g) {
        return key.indexOf(g + "/") > -1;
    })
}

jsonfile.readFile(presets, function (err, obj) {
    var data = obj;
    var filtered_presets = {};

    var keys = Object.keys(data.presets);

    keys.forEach(function (key) {
        if (isNeeded(key)) {
            var val = data.presets[key];
            filtered_presets[key] = {
                name: val.name,
                fields: val.fields
            }
        }
    });

    var filtered_keys = Object.keys(filtered_presets);

    filtered_keys.forEach(function (key) {
        var filtered_fields = []
        if (filtered_presets[key].fields) {
            filtered_fields = filtered_presets[key].fields.filter(function(field){
                switch (field){
                    case "name": return false;
                    case "address": return false;
                    case "building_area": return false;
                    case "opening_hours": return false;
                    case "website": return false;
                    case "phone": return false;
                    case "wheelchair": return false;
                    default: return true;
                }
            })
            filtered_presets[key].fields = filtered_fields
        }
    })

    var output = './assets/filtered_presets.json';

    jsonfile.writeFile(output, filtered_presets, function (err) {
        console.error(err)
    })
});