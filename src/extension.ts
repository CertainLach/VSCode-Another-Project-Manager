import * as fs from 'fs';
import * as vscode from 'vscode';
import * as anotherProjectManager from './anotherProjectManager';
import * as pathUtil from './pathUtil';

export async function activate(_ctx: vscode.ExtensionContext) {
	const anotherProjectManagerProvider = new anotherProjectManager.ProjectsNodeProvider(vscode.workspace.rootPath);
	vscode.window.registerTreeDataProvider('anotherProjectManager', anotherProjectManagerProvider);
	vscode.commands.registerCommand('anotherProjectManager.refreshEntry', async () => {
		await anotherProjectManagerProvider.refresh();
	});
	vscode.commands.registerCommand('extension.open', async (path) => {
		const uri = vscode.Uri.parse(path);
		try {
			return await vscode.commands.executeCommand('vscode.openFolder', uri, false);
		} catch {
			return await vscode.window.showInformationMessage("Could not open the project!");
		}
	});
	vscode.commands.registerCommand('anotherProjectManager.openNewWindow', async (v) => {
		const node = v.node;
		const uri = vscode.Uri.parse(node.path);
		try {
			return await vscode.commands.executeCommand('vscode.openFolder', uri, true);
		} catch {
			return await vscode.window.showInformationMessage("Could not open the project!");
		}
	});
	vscode.commands.registerCommand('anotherProjectManager.editProjects', async () => {
		const uri = vscode.Uri.parse(pathUtil.getProjectFilePath());
		try {
			return await vscode.commands.executeCommand('vscode.open', uri);
		} catch {
			return await vscode.window.showInformationMessage("Could not open the projects file!");
		}
	});
	vscode.commands.registerCommand('anotherProjectManager.addCurrentWorkspace', async () => {
		if (!vscode.workspace.name)
			return await vscode.window.showErrorMessage('No workspace opened!');
		await pathUtil.modifyProjects(p => {
			p.push({
				"title": vscode.workspace.name,
				"path": vscode.workspace.workspaceFile?.toString() ?? vscode.workspace.workspaceFolders?.[0].uri.toString(),
			});
		});
	});
	vscode.commands.registerCommand('anotherProjectManager.createDirectory', async () => {
		await pathUtil.modifyProjects(p => {
			p.push({
				"title": "New directory",
				"nodes": [],
			});
		});
	});
	fs.watchFile(pathUtil.getProjectFilePath(), { interval: 100 }, async () => {
		await anotherProjectManagerProvider.refresh();
	});
	await anotherProjectManagerProvider.refresh();
}
