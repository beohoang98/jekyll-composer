// import * as $ from 'jquery';
const _FileView = class {
    constructor() {
        this.root = $('<div/>').addClass('tree-view')[0];
        this.folders = {};
        this.files = {};
    }
    addFolder(name) {
        const newFolder = this._createFolder(name);
        this.folders[name] = newFolder;
        this.root.appendChild(newFolder);
    }
    addFile(name, folder, path) {
        const newFile = this._createFile(name, path);
        this.files[name] = newFile;
        this.folders[folder].appendChild(newFile);
    }
    getElement() {
        return this.root;
    }
    _createFolder(name) {
        const folder = $('<details/>').addClass('folder')
            .attr('path', name);
        $('<summary/>').text(name).appendTo(folder);
        return folder[0];
    }
    fileClick(func) {
        this._fileClick = func;
    }
    _createFile(name, path) {
        const file = $('<div/>').addClass('file')
            .attr('path', path)
            .text(name);
        file.on('click', (e) => this._fileClick(file[0]));
        return file[0];
    }
};
export { _FileView as FileView };
