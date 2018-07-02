const fs = require('fs');
const http = require('http');
const qs = require('querystring');
const jsyml = require('js-yaml');

const file404 = fs.readFileSync('404.html');
const pathDrafts = "../_drafts/";
const pathPosts = "../_posts/";
const pathImage = "../images/";


//web server
http.createServer((req, res)=>{
	if (req.url == '/' || req.url == '/index.html')
	{
		const index = fs.readFileSync('index.html');
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(index);
		res.end();
	}
	else {
		fs.readFile('.' + req.url, (err, data)=>{
			if (err) {
				res.writeHead(404);
				res.write(file404);
				res.end();
				return;
			}
			let type = '';
			let fileEx = req.url.match(/.\w+$/);
			if (fileEx == '.css') {
				type = "text/css";		
			}
			else if (fileEx == '.js') {
				type = 'text/javascript';
			}
			
			res.writeHead(200, {"Content-Type": type});
			res.write(data);
			res.end();
		});	
	}
	
}).listen(8080);


//file server
const fileserver = http.createServer((req, res)=>{
	const cmd = req.url.split('/')[1];
	const path = req.url.split('/')[2];

	handleCmd(cmd, path, req, res);
}).listen(8081);



function handleCmd(cmd, path, req, res)
{
	if (cmd == 'get') {
		if (path == 'drafts')
		{
			res.writeHead(200, {
				'Access-Control-Allow-Origin':'*',
				'Content-Type':'application/json'
			});
			fs.readdir(pathDrafts, (err, files) => {
				const json = [];
				
				files.forEach(file => {
					if (!file) return;
					const datafile = fs.readFileSync(pathDrafts + file);
					json.push({
						filename: file,
						path: pathDrafts + file,
						data: datafile.toString('utf8')
					});
				});

				res.write(JSON.stringify(json));
				res.end();
			});	
		}
		else if (path == 'posts')
		{
			res.writeHead(200, {
				'Access-Control-Allow-Origin' : '*',
				'Content-Type':'application/json'
			});
			fs.readdir(pathPosts, (err, files) => {
				const json = [];
				
				files.forEach(file => {
					if (!file) return;
					const datafile = fs.readFileSync(pathPosts + file);
					json.push({
						filename: file,
						path: pathPosts + file,
						data: datafile.toString('utf8')
					});
				});

				res.write(JSON.stringify(json));
				res.end();
			});	
		}
		else {
			res.writeHead(404);
			res.write(file404);
			res.end();
		}
	}
	else if (cmd == 'save') {
		if (req.method !== "POST") {
			res.writeHead(404);
			res.write(file404);
			res.end();
			return;
		}
		let data = "";

		req.on('data', chunk=>{
			data += chunk;
		});

		req.on('end', ()=>{

			res.writeHead(200, {
				'Content-Type': "application/json",
				'Access-Control-Allow-Origin' : '*'
			});

			const postData = JSON.parse(data);

			const filename 	= postData['filename'];
			const filedata	= postData['data'];

			fs.lstat(filename, (err)=>{
				if (!!err) {
					res.write(JSON.stringify({
						err: true,
						msg: "file doesn't exists"
					}));
					res.end();
					return;
				}

				fs.writeFile(filename, filedata, (err)=>{
					if (!!err) {
						res.write(JSON.stringify({
							err: true,
							msg: "Cannot write file"
						}));
						res.end();
						return;
					}

					console.log(`File ${filename} has updated`);
					res.write(JSON.stringify({
						err: false,
						msg: "save successfully"
					}));
					res.end();
				});
			});
		});
	}
	else {
		res.writeHead(404);
		res.write(file404);
		res.end();
	}
}

function readJekyllPost(path, callback)
{
	fs.readFile(path, (err, data)=>{
		if (!!err) {
			callback(err, null);
			return;
		}

		const header_regex = /^\s+---(.*)---/;
		const yaml_header = data.match(header_regex)[1];
		const header_data = jsyml.parse(yaml_header);
		const body_data = data.replace(header_regex, '');

		callback(null, {
			info: header_data,
			
		});
		return;
	});
}