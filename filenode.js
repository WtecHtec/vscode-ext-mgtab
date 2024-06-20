const vscode = require('vscode');
// class FileNode extends vscode.TreeItem {
// 	constructor(label, resource, collapsibleState, children = []) {
// 			super(label, collapsibleState);
// 			this.resource = resource;
// 			this.children = children;
// 			this.command = collapsibleState === vscode.TreeItemCollapsibleState.None ? {
// 					command: 'extension.openFile',
// 					title: 'Open File',
// 					arguments: [vscode.Uri.file(resource)]
// 			} : undefined;
// 			this.resourceUri = vscode.Uri.file(resource);
// 			this.contextValue = 'file';
// 	}

// 	getChildren() {
// 			return this.children;
// 	}
// }


class FileNode extends vscode.TreeItem {
	constructor(label, resource, collapsibleState, commandOrChildren) {
			super(label, collapsibleState);
			this.resource = resource;
			this.resourceUri = vscode.Uri.file(resource);

			if (Array.isArray(commandOrChildren)) {
					this.children = commandOrChildren;
			} else {
					this.command = commandOrChildren;
			}

			this.contextValue = 'file';
	}

	getChildren() {
			return this.children || [];
	}
}

module.exports = FileNode;