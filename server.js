const http = require('http');
var express = require('express');
var app = express();
var exec = require('child_process').execFile;

const hostname = '127.0.0.1';
const port = 3000;
const path = require("path");

app.get('/simulate/:id', function (req, res) {
	var simulateID = req.params.id;
	var simExeName = "sim" + simulateID + ".exe";
	console.log("Execute : " + simExeName);

	exec('sims/' + simExeName, function(err, data) {
		var plainText = data.toString();
		var lines = plainText.split('\r\n');
		var states = new Array();
		lines.forEach(function(line){
			if(line != ""){
				var items = line.split('\t');
				var time = items[0];
				var input = items[1];
				var motorPosition = items[2];
				var state = {
					time : time,
					input : input,
					motorPosition : motorPosition
				};
				states.push(state);				
			}
 
		});
		var jsonResult = {
			simulate:states
		};
		res.end(JSON.stringify(jsonResult));	  
	    console.log(err)              
	}); 	
})

app.get('/view', function (req, res) {
	res.sendFile(path.join(__dirname + '/view/gaugeView.html'));
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)

})