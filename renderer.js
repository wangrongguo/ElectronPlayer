const remote = require('electron').remote;
const dialog = remote.dialog;

function oncliclFile(){
    console.log("------------------------")
    var path = dialog.showOpenDialog({ properties: [ 'openFile' ]});
    console.log(path)
}