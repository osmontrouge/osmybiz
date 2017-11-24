var jsonfile = require('jsonfile')

var presets_json = 'assets/with_Options.json';
var translation = 'assets/locales/'+ process.argv[2] +'.json';

console.log("test")

jsonfile.readFile(presets_json, function (err, obj) {

    jsonfile.readFile(translation, function (err2, obj2) {
        console.log("start translate")
        var data = obj2[process.argv[2]].presets;
        var tags = {};

        var filtered_keys = Object.keys(obj)
        var keys_presets = Object.keys(data.presets);
        var keys_fields = Object.keys(data.fields);

        keys_presets.forEach(function (key) {
            filtered_keys.forEach(function (filtered_key) {
                if (key === filtered_key) {
                    var val = data.presets[key];
                    var fields = []

                    keys_fields.forEach(function (field_key) {
                        if (obj[filtered_key].fields) {
                            obj[filtered_key].fields.forEach(function (filtered_field_key) {
                                if (field_key === filtered_field_key.key) {
                                    if (filtered_field_key.options) {
                                        fields.push({
                                            key: filtered_field_key.key,
                                            type: filtered_field_key.type,
                                            label: data.fields[field_key].label,
                                            options: data.fields[field_key].options
                                        })
                                    } else {
                                        fields.push({
                                            key: filtered_field_key.key,
                                            type: filtered_field_key.type,
                                            label: data.fields[field_key].label
                                        })
                                    }
                                }
                            })
                        }
                    })
                    tags[key] = {
                        name: val.name,
                        fields: fields
                    }
                }
            })
        });

        var output = './assets/tags.json';

        console.log("finish translate")

        jsonfile.writeFile(output, tags, function (err) {
            console.error(err)
        })
    });
});