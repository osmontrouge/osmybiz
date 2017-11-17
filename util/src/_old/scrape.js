var request = require('request');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile')

var collection = [];

request('http://wiki.openstreetmap.org/wiki/Map_Features', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);

        var amenity = [];

        $('tr td:first-child').each(function (i, element) {

            var tag = $(this).text().trim();
            var element = $(this).next();

            if (tag === "amenity") {
                amenity.push({
                    text: element.text().trim(),
                    value: i
                })
            }
            if (tag === "shop") {
                amenity.push({
                    text: element.text().trim(),
                    value: i
                })
            }

            collection = amenity
        })

        var file = '../../frontend/osmmybiz/src/assets/locales.json';
        var data = {
            data: collection
        };

        jsonfile.writeFile(file, data, function (err) {
            console.error(err)
        })
    }
});


/* request('http://wiki.openstreetmap.org/wiki/Key:shop', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);

        var shop = [];

        $('tr td:first-child').each(function (i, element) {

            var tag = $(this).text().trim();
            var element = $(this).next();

            if(tag === "shop"){
                shop.push({
                    text: element.text().trim(),
                    value: i
                })
            }
        });

        shop.forEach(function (t) {
            console.log(t)
        });

        collection.concat(shop);
    }
}); */
