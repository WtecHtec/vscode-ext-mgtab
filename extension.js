// The module 'vscode' contains the VS Code extensibility API

const FileTreeProvider = require('./filetreeprovider.js');

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const treeDataProvider = new FileTreeProvider();
	vscode.window.createTreeView('fileTreeView', { treeDataProvider });
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	/** 监听刷新  */
  vscode.window.onDidChangeVisibleTextEditors(() => {
		treeDataProvider.refresh();
	});

	vscode.window.onDidChangeActiveTextEditor(() => {
			treeDataProvider.refresh();
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('sr7.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		const tabGroups = vscode.window.tabGroups.all;
		const filePaths = [];
		tabGroups.forEach(group => {
			group.tabs.forEach(tab => {
					if (tab.input instanceof vscode.TabInputText) {
							filePaths.push(tab.input.uri.fsPath);
					}
			});
	});
		// Display a message box to the user
		// // vscode.window.showInformationMessage('Hello World from !');
		// const editors = vscode.window.visibleTextEditors;
		// if (editors.length > 0) {
		// 		const filePaths = editors.map(editor => editor.document.uri.path);
		// 		const tree = buildFileTree(filePaths);
		// 		console.log(JSON.stringify(tree, null, 2));
		// 		vscode.window.showInformationMessage(`File tree:\n${JSON.stringify(tree, null, 2)}`);
		// } else {
		// 		vscode.window.showInformationMessage('No open editors');
		// }
	});
	context.subscriptions.push(disposable);
	const disposableOpenfile = vscode.commands.registerCommand('extension.openFile', (resource) => {
			vscode.window.showTextDocument(resource);
	});
	context.subscriptions.push(disposableOpenfile);
}

// This method is called when your extension is deactivated
function deactivate() {}



module.exports = {
	activate,
	deactivate
}
