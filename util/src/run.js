var exec = require("child_process").exec

exec('node filter_presets', function () {
    exec('node addOptions', function () {
        exec('node translate ' + process.argv[2], function () {
            exec('node filter_unnecessary ' + process.argv[2])
        })
    })
})