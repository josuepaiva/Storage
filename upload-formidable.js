//Form parssing
var formidable = require('formidable');

//Express module
var express = require('express');
var app = express();

//File and path tools
var path = require('path');
var fs = require('fs');

//Conection info
var port = 3030;
var address = "localhost:"+port+"/";


//Auxiliary parameters
var name, ext;
var localUploadPath = "/upload";

//Make localPath public
app.use(express.static(__dirname + localUploadPath));

//Local path to save image of upload
var image_upload_path_new = '.'+ localUploadPath;

//Send index.html of test of system
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

//Post Image
app.post('/upload/',function (reg, res){
  upload(reg, res);
});

//Generate string aleatory
function makeid(valor)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < valor; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

//Call of fuction makeid, and set the new name of file.
function newPath(image){
  var image_upload_name = makeid(20);
  var extension = path.extname(image.name);
  console.log(image_upload_path_new);
  var image_upload_path_name = image_upload_path_new +"/"+image_upload_name + extension;

  name = image_upload_name;
  ext = extension;

  return image_upload_path_name;
}

//verify if file already exists
function checkFile(image){
  var image_upload_path_name = newPath(image);
  while( true ){
    if (fs.existsSync(image_upload_path_name)) {
      console.log("Erro");
      image_upload_path_name = newPath(image);
    }else{
      return image_upload_path_name;
    }
  } 
}

//Put the file than sent by way of post request, and rename in new path
function upload(req, res){
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    var image = files.image;
    var image_upload_path_old = image.path;
    var image_upload_path_name = checkFile(image);
    
      fs.rename(image_upload_path_old, image_upload_path_name,function (err) {
        if (err) {
          console.log('Err: ', err);
          res.end('Deu merda na hora de mover a imagem!');
        }
        var msg = 'Imagem salva em: ' + image_upload_path_name;
        address = address + name + ext;
        console.log(name);
        //Return JSON with address of image
        var result = {
          "link" : address
        };

        console.log(result);
        res.end(JSON.stringify(result));
        address = "localhost:"+port+"/";
      });
  });
}
app.listen(3030);
