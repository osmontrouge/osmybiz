var exec = require("child_process").exec

exec('node filter_presets')
exec('node addOptions')
exec('node translate ' + process.argv[2])