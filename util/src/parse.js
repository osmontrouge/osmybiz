var jsonfile = require('jsonfile')

var file = 'assets/all_tags.json';

jsonfile.readFile(file, function(err, obj) {
    var data = obj;

    data.presets.item.forEach(function(item, i) {
        item["value"] = i;
        item["text"] = item["name"];
        delete item["name"];
    })

    console.log(data.presets.item)

    var output = '../../frontend/osmmybiz/src/assets/tags.json';

    jsonfile.writeFile(output, data, function (err) {
        console.error(err)
    })
});