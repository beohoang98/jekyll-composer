const _File = class {
	private _listFile 	: Array<any>;
	private _mapFile 	: Object;
	private _get_url	: string;
	private _save_url	: string;
	private _type		: string;
	
	public constructor(type : string = 'drafts') {
		this._listFile = [];
		this._mapFile = {};
		this._type = type;
		this._get_url = 'http://127.0.0.1:8081/get/' + type;
		this._save_url = 'http://127.0.0.1:8081/save/' + type + "/";
	}

	/**
	 * get all file of type
	 * @param errCallback Function(err)
	 */
	public async getFiles(errCallback : Function): Promise<void>
	{
		const res = (await fetch(this._get_url).catch(err=>{
			errCallback(err);
			return;
		})) as Response;

		const json = await res.json().catch(err=>{
			errCallback(err);
			return;
		});

		this._listFile = json;
		for (const file of json)
		{
			this._mapFile[file.path] = file.data;
		}
	}

	/**
	 * 
	 * @param file filename
	 * @return {String} data of file
	 */
	public getDataFile(file : string): string
	{
		return this._mapFile[file];
	}

	public get list()
	{
		return this._listFile;
	}

	/**
	 * update data to file data
	 * @param file filename
	 * @param data new raw data
	 */
	public updateDataFile(file : string, data: string): void
	{
		this._mapFile[file] = data;
	}

	public async saveFile(file: string, errFunc)
	{
		const res = await fetch(this._save_url, {
			method: "POST",
			body: JSON.stringify({
				filename: file,
				data: this._mapFile[file]
			})
		}).catch(err=>{
			errFunc(err);
			return;
		}) as Response;

		const json = await res.json().catch(err=>{
			errFunc(err);
			return;
		});

		if (!!json.err) {
			errFunc(json.msg);
		}
	}
}

export { _File as File };