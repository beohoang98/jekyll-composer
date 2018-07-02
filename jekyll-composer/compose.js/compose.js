var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { File } from './file.js';
import { FileView } from './fileView.js';
const _Compose = class {
    constructor() {
        this._url = 'http://127.0.0.1:8081/compose/';
        this._drafts = new File('drafts');
        this._posts = new File('posts');
        this._current = null;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._drafts.getFiles();
            yield this._posts.getFiles();
        });
    }
    addTreeView(element) {
        this._treeView = element;
        const fileView = new FileView();
        fileView.addFolder('drafts');
        fileView.addFolder('posts');
        fileView.fileClick((target) => {
            const path = $(target).attr('path');
            const content = this._drafts.getDataFile(path);
            this.MDE.value(content);
            this._current = path;
        });
        for (const file of this._drafts.list) {
            fileView.addFile(file['filename'], 'drafts', file['path']);
        }
        for (const file of this._posts.list) {
            fileView.addFile(file['filename'], 'posts', file['path']);
        }
        this._treeView.appendChild(fileView.getElement());
    }
    addMDE(simpleMDE) {
        this.MDE = simpleMDE;
    }
    update() {
        const content = this.MDE.value();
        this._drafts.updateDataFile(this._current, content);
    }
    save() {
        this._drafts.saveFile(this._current, (err) => {
            console.log(err);
        });
    }
};
export { _Compose as Compose };
