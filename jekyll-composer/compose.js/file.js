var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const _File = class {
    constructor(type = 'drafts') {
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
    getFiles(errCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = (yield fetch(this._get_url).catch(err => {
                errCallback(err);
                return;
            }));
            const json = yield res.json().catch(err => {
                errCallback(err);
                return;
            });
            this._listFile = json;
            for (const file of json) {
                this._mapFile[file.path] = file;
            }
        });
    }
    /**
     *
     * @param file filename
     * @return {String} data of file
     */
    getDataFile(file) {
        return this._mapFile[file]['data'];
    }
    getHeaderInfo(file) {
        return this._mapFile[file]['info'];
    }
    get list() {
        return this._listFile;
    }
    /**
     * update data to file data
     * @param file filename
     * @param data new raw data
     */
    updateDataFile(file, data, info) {
        console.log(file, this._mapFile[file]);
        this._mapFile[file]['info'] = info;
        this._mapFile[file]['data'] = data;
    }
    saveFile(file, errFunc) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(this._save_url, {
                method: "POST",
                body: JSON.stringify({
                    filename: file,
                    header: this._mapFile[file].info,
                    data: this._mapFile[file].data
                })
            }).catch(err => {
                errFunc(err);
                return;
            });
            const json = yield res.json().catch(err => {
                errFunc(err);
                return;
            });
            if (!!json.err) {
                errFunc(json.msg);
            }
        });
    }
};
export { _File as File };
