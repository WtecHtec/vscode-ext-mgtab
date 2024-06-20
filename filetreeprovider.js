


const vscode = require('vscode');
const path = require('path');
const { getAllTabs, buildFileTree, getCurrentWorkspace } = require('./uitls');
const FileNode = require('./filenode');
class FileTreeProvider {
	constructor() {
			this._onDidChangeTreeData = new vscode.EventEmitter();
			this.onDidChangeTreeData = this._onDidChangeTreeData.event;
	}

	refresh() {
			this._onDidChangeTreeData.fire();
	}

	getTreeItem(element) {
			return element;
	}

	getChildren(element) {
			if (!element) {
					return this.getOpenTabs();
			}
			return this.getFiles(element);
	}

	async getOpenTabs() {
			// const openEditors = vscode.window.visibleTextEditors;
			// const filePaths = openEditors.map(editor => editor.document.uri.fsPath);
			const filePaths = getAllTabs();
			const tree = this.buildFileTab(filePaths);
			console.log('getOpenTabs', filePaths, tree);
			return tree;
	}

	async getFiles(element) {
	// 		const entries = await vscode.workspace.fs.readDirectory(vscode.Uri.file(dir));
	// 		return entries.map(([name, type]) => {
	// 				const resourcePath = path.join(dir, name);
	// 				const resourceUri = vscode.Uri.file(resourcePath);
	// 				if (type === vscode.FileType.Directory) {
	// 						return new FileNode(name, resourceUri.fsPath, vscode.TreeItemCollapsibleState.Collapsed);
	// 				} else {
	// 						return new FileNode(name, resourceUri.fsPath, vscode.TreeItemCollapsibleState.None, {
	// 								command: 'extension.openFile',
	// 								title: 'Open File',
	// 								arguments: [resourceUri]
	// 						});
	// 				}
	// 		});
		if (element) {
			if ( element.getChildren().length > 0) {
				console.log( element.getChildren())
				return element.getChildren();
			}
			console.log('getFiles---', element)
			return new FileNode(element.label, element.resourceUri, vscode.TreeItemCollapsibleState.None, {
					command: 'extension.openFile',
					title: 'Open File',
					arguments: [element.resourceUri]
			});
		}
		return null;
	}


	buildFileTab(filePaths) {
			const tree = buildFileTree(filePaths);
			return this.convertToNodes(tree, '');
	}

	convertToNodes(tree, parentPath) {
			return Object.keys(tree).map(key => {
					const fullPath = path.join(parentPath, Array.isArray(tree) ? '' : key);
					let label = Array.isArray(tree) ?  tree[key] : key;
					const value = tree[key];
					const currentWork = getCurrentWorkspace();
					if (currentWork) {
						console.log('convertToNodes---', currentWork, label)
						label = label.split(currentWork);
						label = label.length > 1 ? label[1] : label[0];
						console.log('convertToNodes--- labels', label)
					}
					if (typeof value === 'string') {
						// console.log('convertToNodes---', fullPath, value)
					
							return new FileNode(label, fullPath, vscode.TreeItemCollapsibleState.None, {
									command: 'extension.openFile',
									title: 'Open File',
									arguments: [vscode.Uri.file(fullPath + '/' + value)]
							});
					} else {
							return new FileNode(label, fullPath, vscode.TreeItemCollapsibleState.Collapsed, this.convertToNodes(value, fullPath));
					}
			});
	}
}

module.exports = FileTreeProvider;