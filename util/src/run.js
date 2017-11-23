var exec = require("child_process").exec

exec('node filter_presets')
exec('node addOptions')
exec('node translate ' + process.argv[2])
exec('node filter_unnecessary ' + process.argv[2])