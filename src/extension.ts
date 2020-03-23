import * as fs from 'fs';
import * as vscode from 'vscode';
import * as anotherProjectManager from './anotherProjectManager';
import * as pathUtil from './pathUtil';

export function activate(_ctx: vscode.ExtensionContext) {
	const anotherProjectManagerProvider = new anotherProjectManager.ProjectsNodeProvider(vscode.workspace.rootPath);
	vscode.window.registerTreeDataProvider('anotherProjectManager', anotherProjectManagerProvider);
	vscode.commands.registerCommand('anotherProjectManager.refreshEntry', () => anotherProjectManagerProvider.refresh());
	vscode.commands.registerCommand('extension.open', async (path) => {
		const uri = vscode.Uri.parse(path);
		try {
			const value = await vscode.commands.executeCommand('vscode.openFolder', uri, false);
			return ({});
		}
		catch (value_1) {
			return await vscode.window.showInformationMessage("Could not open the project!");
		}
	});
	vscode.commands.registerCommand('anotherProjectManager.openNewWindow', async (v) => {
		const node = v.node;
		const uri = vscode.Uri.parse(node.path);
		try {
			const value = await vscode.commands.executeCommand('vscode.openFolder', uri, true);
			return ({});
		}
		catch (value_1) {
			return await vscode.window.showInformationMessage("Could not open the project!");
		}
	});
	vscode.commands.registerCommand('anotherProjectManager.exitProjects', async () => {
		const uri = vscode.Uri.parse(pathUtil.getProjectFilePath());
		try {
			const value = await vscode.commands.executeCommand('vscode.open', uri);
			return ({});
		}
		catch (value_1) {
			return await vscode.window.showInformationMessage("Could not open the projects file!");
		}
	});
	fs.watchFile(pathUtil.getProjectFilePath(), { interval: 100 }, () => {
		anotherProjectManagerProvider.refresh();
	});
}
