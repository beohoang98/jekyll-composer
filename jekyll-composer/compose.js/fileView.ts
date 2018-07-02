// import * as $ from 'jquery';

const _FileView = class {
	private root 		: HTMLElement;
	private folders 	: Object;
	private files		: Object;
	private _fileClick	: Function;

	constructor()
	{
		this.root 		= $('<div/>').addClass('tree-view')[0];
		this.folders 	= {};
		this.files 		= {};
	}

	public addFolder(name: string)
	{
		const newFolder = this._createFolder(name);
		this.folders[name] = newFolder;
		this.root.appendChild(newFolder);
	}

	public addFile(name: string, folder: string, path: string)
	{
		const newFile = this._createFile(name, path);

		this.files[name] = newFile;
		this.folders[folder].appendChild(newFile);
	}

	public getElement(): HTMLElement
	{
		return this.root;
	}

	private _createFolder(name: string): HTMLElement
	{
		const folder = $('<details/>').addClass('folder')
									.attr('path', name);

		$('<summary/>').text(name).appendTo(folder);

		return folder[0];
	}

	public fileClick(func: Function)
	{
		this._fileClick = func;
	}

	private _createFile(name : string, path: string): HTMLElement
	{
		const file = $('<div/>').addClass('file')
								.attr('path', path)
								.text(name);
		
		file.on('click', (e)=>this._fileClick(file[0]));
		
		return file[0];
	}
}

export {_FileView as FileView};