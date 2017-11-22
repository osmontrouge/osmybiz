var jsonfile = require('jsonfile')

var fields = 'assets/fields.json';
var filtered_presets = 'assets/filtered_presets.json';

jsonfile.readFile(fields, function (err, obj) {
    jsonfile.readFile(filtered_presets, function (err2, obj2) {
        var with_Options = {}

        var preset_data = obj2
        var fields_data = obj.fields

        var presets_keys = Object.keys(preset_data)
        var fields_keys = Object.keys(fields_data)

        presets_keys.forEach(function (preset_key) {
            var preset = preset_data[preset_key]
            var fields = []
            if (preset_data[preset_key].fields){
                preset_data[preset_key].fields.forEach(function (field) {
                    fields_keys.forEach(function (field_key) {
                        if(field === field_key) {
                            var field_data = fields_data[field_key]
                            if (field_data.options) {
                                fields.push({
                                    key: field,
                                    type: field_data.type,
                                    label: field_data.label,
                                    options: field_data.options
                                })
                            } else if (field_data.strings) {
                                fields.push({
                                    key: field,
                                    type: field_data.type,
                                    label: field_data.label,
                                    options: field_data.strings.options
                                })
                            } else {
                                fields.push({
                                    key: field,
                                    type: field_data.type,
                                    label: field_data.label
                                })
                            }
                        }
                    })
                })
            }
            with_Options[preset_key] = {
                name: preset.name,
                fields: fields
            }
        })

        //var output = '../../frontend/osmybiz/src/assets/tags_de.json';
        var output = './assets/with_Options.json';

        jsonfile.writeFile(output, with_Options, function (err) {
            console.error(err)
        })
    })
});