var jsonfile = require('jsonfile')

var presets = 'assets/filtered_presets.json';
var fields = 'assets/fields.json';

jsonfile.readFile(presets, function (err, obj) {
    jsonfile.readFile(fields, function (err2, obj2) {
        var presets = obj;
        var fields = obj2.fields;
        var tags = {}

        var presets_keys = Object.keys(presets);
        var field_keys = Object.keys(fields);

        field_keys.forEach(function (field_key) {
            presets_keys.forEach(function (preset_key) {
                var fields = []
                var val = presets[preset_key];
                if (presets[preset_key].fields && presets[preset_key].fields.length !== 0) {
                    presets[preset_key].fields.forEach(function (field) {
                        if (field_key === field) {
                            val.fields.forEach(function (field) {
                                if(field.options){
                                    fields.push({
                                        name: field,
                                        options: field.options
                                    })
                                }
                                if(field.strings.options){
                                    fields.push({
                                        name: field,
                                        options: field.strings.options
                                    })
                                }
                            })
                            tags[preset_key] = {
                                name: val.name,
                                fields: val.fields
                            }
                        }
                    })
                } else {
                    if (val.fields){
                        val.fields.forEach(function (field) {
                            fields.push({
                                name: field,
                                options: {}
                            })
                        })
                        tags[preset_key] = {
                            name: val.name,
                            fields: fields
                        }
                    }
                }
            })
        })


        var output = 'assets/tags_withOptions.json';

        jsonfile.writeFile(output, tags, function (err) {
            console.error(err)
        })
    });
});