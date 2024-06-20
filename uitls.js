const vscode = require('vscode');
const path = require('path');
/** 获取当前项目路径 */
function getCurrentWorkspace() {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders) {
			const folderPaths = workspaceFolders.map(folder => folder.uri.fsPath);
			return folderPaths[0];
	} else {
			return null;
	}
}

	/** 获取所有打开的文件 */
function	getAllTabs() {
		const tabGroups = vscode.window.tabGroups.all;
		const filePaths = [];
		tabGroups.forEach(group => {
			group.tabs.forEach(tab => {
					if (tab.input instanceof vscode.TabInputText) {
							filePaths.push(tab.input.uri.fsPath);
					}
			});
		});
		return filePaths;
	}
	/**
	 * 
	 * @param {*} filePaths 
	 * @returns 
	 */
function 	buildFileTree(filePaths) {
	const tree = {};
	filePaths.forEach(filePath => {
			const dir = path.dirname(filePath);
			const fileName = path.basename(filePath);

			if (!tree[dir]) {
					tree[dir] = [];
			}
			tree[dir].push(fileName);
	});
	return tree
}
module.exports  = {
	getCurrentWorkspace,
	getAllTabs,
	buildFileTree,
}
