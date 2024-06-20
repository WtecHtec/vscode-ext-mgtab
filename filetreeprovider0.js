


const vscode = require('vscode');
const path = require('path');
const FileNode = require('./filenode');

class FileTreeProvider {
	constructor() {
			this._onDidChangeTreeData = new vscode.EventEmitter();
			this.onDidChangeTreeData = this._onDidChangeTreeData.event;
			this.treeData = [];
	}

	refresh() {
			this._onDidChangeTreeData.fire();
	}

	getTreeItem(element) {
			return element;
	}

	// 多层目录计算
	getChildren(element) {
			if (!element) {
					return this.getOpenTabs();
			}
			return this.getFiles(element.resource);
	}

	getFiles(resource) {
		console.log(resource);
	}
	getOpenTabs() {
			// const openEditors = vscode.window.visibleTextEditors;
		// const filePaths = openEditors.map(editor => editor.document.uri.fsPath);
			const tabGroups = vscode.window.tabGroups.all;
			const filePaths = [];
			tabGroups.forEach(group => {
				group.tabs.forEach(tab => {
						if (tab.input instanceof vscode.TabInputText) {
								filePaths.push(tab.input.uri.fsPath);
						}
				});
			});
			const tree = this.buildFileTree(filePaths);
			this.treeData = tree;
			console.log(tree);
			return Promise.resolve(tree);
	}

	buildFileTree(filePaths) {
			const tree = {};
			filePaths.forEach(filePath => {
					const dir = path.dirname(filePath);
					const fileName = path.basename(filePath);

					if (!tree[dir]) {
							tree[dir] = [];
					}
					tree[dir].push(fileName);
			});

			const nodes = [];
			for (const dir in tree) {
					const files = tree[dir].map(fileName => {
							const resourceUri = vscode.Uri.file(path.join(dir, fileName));
							return new FileNode(fileName, resourceUri.fsPath, vscode.TreeItemCollapsibleState.None, {
									// @ts-ignore
									command: 'extension.openFile',
									title: 'Open File',
									arguments: [resourceUri]
							});
					});
					nodes.push(new FileNode(dir, dir, vscode.TreeItemCollapsibleState.Collapsed, files));
			}
			return nodes;
	}
}

module.exports = FileTreeProvider;