import {File} from './file.js';
import {FileView} from './fileView.js';

const _Compose = class {
	private _url 		: string;
	private _current 	: any;

	private _drafts 	: any;
	private _posts		: any;
	private _treeView 	: HTMLElement;
	private MDE			: any;

	public fileClick	: Function;

	public constructor() {
		this._url = 'http://127.0.0.1:8081/compose/';

		this._drafts = new File('drafts');
		this._posts = new File('posts');

		this._current = null;
	}

	public async init()
	{
		await this._drafts.getFiles();
		await this._posts.getFiles();
	}

	public addTreeView(element : HTMLElement): void
	{
		this._treeView = element;

		const fileView = new FileView();
		fileView.addFolder('drafts');
		fileView.addFolder('posts');
		fileView.fileClick((target)=>{
			const path = $(target).attr('path');
			const content = this._drafts.getDataFile(path);
			this.MDE.value(content);

			this._current = path;
		});

		for (const file of this._drafts.list)
		{
			fileView.addFile(file['filename'], 'drafts', file['path']);
		}
		for (const file of this._posts.list)
		{
			fileView.addFile(file['filename'], 'posts', file['path']);
		}

		this._treeView.appendChild(fileView.getElement());
	}

	public addMDE(simpleMDE: any)
	{
		this.MDE = simpleMDE;
	}

	public update()
	{
		const content = this.MDE.value();
		this._drafts.updateDataFile(this._current, content);
	}

	public save()
	{
		this._drafts.saveFile(this._current, (err)=>{
			console.log(err);
		});
	}
}

export {_Compose as Compose};