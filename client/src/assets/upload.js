
function hello(path) {
  console.log("path = " + path);
  var token = getToken();
  if(token=="null") {
    console.log("invalid credentials ..");
   return ;
}
   var dbx = new Dropbox({ accessToken: token });
  //var path = $('#get-file').val();
  dbx.filesDownload({ path: path }).then(function (res) {
    console.log(res); 
    var downloadUrl = URL.createObjectURL(res.fileBlob);
    console.log("url = " + downloadUrl);
    console.log( res.fileBlob);
    
    download1(res.name, res.fileBlob.type, downloadUrl);


  }).catch(function (error) {
    console.log(error);
  })
  function download1(filename, type, downloadUrl) {
    var element = document.createElement('a');
    element.setAttribute('href', downloadUrl);
    element.setAttribute('data', type);
    element.setAttribute('class', 'button');
    element.setAttribute('download', filename);
   // document.getElementById('down').appendChild(element);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  // dbx.filesListFolder({path: ''})
  //   .then(function(response) {
  //     console.log(response);
  //   })
  //   .catch(function(error) {
  //     console.log(error);
  //   });
}
function upload() {
  var token = getToken();
  var fileInput = document.getElementById('file-upload');
  var file = fileInput.files[0];
  var dbx = new Dropbox({ accessToken: token });
  dbx.filesUpload({ path: '/' + file.name, contents: file })
    .then(function (response) {
      $('#message-upload').html("file uploaded successfully.....!!!! ");
      console.log(response);
    })
    .catch(function (error) {
      console.error(error);
    });
}
function getToken() {
  var token;
  var user = JSON.parse(localStorage.getItem("user"));
  $.ajax({
    url: "http://localhost:8080/dropbox/getToken/" + user.id,
    type: "GET",
    dataType: 'json',
    async: false,
    success: function (res) {
      token = res.access_token;
    },
    error: function (err) {
      console.log(err);
    }
  });
  return token;

}
function getTokenByEmail(email) {
  var token;
  var user = JSON.parse(localStorage.getItem("user"));
  $.ajax({
    url: "http://localhost:8080/dropbox/getTokenByEmail/" + email,
    type: "GET",
    dataType: 'json',
    async: false,
    success: function (res) {
      token = res.access_token;
    },
    error: function (err) {
      console.log(err);
    }
  });
  return token;

}
function test(){
  var x=new XMLHttpRequest();
	x.open("GET", 'http://localhost:8080/drive/download/?id=');
	x.responseType = 'blob';
	x.onload=function(e){download(x.response, "dlBinAjax.gif", "image/gif" ); }
	x.send();
}