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
					const datafile = readJekyllPostSync(pathDrafts + file);
					json.push({
						filename: file,
						path: pathDrafts + file,
						data: datafile.data,
						info: datafile.info
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

			const filename		= postData['filename'];
			const fileheader	= postData['header'];
			const filedata		= postData['data'];

			const headAndBody = "---\n" 
								+ jsyml.safeDump(fileheader) 
								+ "\n---\n"
								+ filedata;

			fs.lstat(filename, (err)=>{
				if (!!err) {
					res.write(JSON.stringify({
						err: true,
						msg: "file doesn't exists"
					}));
					res.end();
					return;
				}

				fs.writeFile(filename, headAndBody, (err)=>{
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

/**
 * 
 * @param {String} path 
 * @param {Function} callback 
 */
function readJekyllPostSync(path)
{
	const fileData = fs.readFileSync(path, 'utf8');
	const headerInfo = {
		title: null,
		author: null,
		img: null,
		categories: null,
		tags: null
	}

	const header_regex = /^(\s+)?\-\-\-\n+([\S\s]+)\n+\-\-\-\n/;
	
	let yaml_header;
	const yaml_match = fileData.match(header_regex);
	if (!yaml_match) {
		yaml_header = "";
	}
	else {
		yaml_header = yaml_match[2];
	}

	const header_data = jsyml.safeLoad(yaml_header);
	for (const key in header_data)
	{
		headerInfo[key] = header_data[key];
	}


	const body_data = fileData.replace(header_regex, '');

	return {
		info: headerInfo,
		data: body_data
	};
}