// resume-cli has no way of exporting with a local theme yet, export it manually

var fs = require('fs');

var file = process.cwd() + '/resume.json';
fs.readFile(file, function(err, resumeJson) {
    var resumeJson;
    if (err) {
        console.log(chalk.yellow('resume.json does not exist'));
        return;
    } else {
        resumeJson = JSON.parse(resumeJson);
    }
	
    var render = require(process.cwd() + '/index').render;
    fs.writeFileSync('resume.html', render(resumeJson));
});
