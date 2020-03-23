import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";

const homeDir = os.homedir();
const projectsFile = 'projects.json';
export function getProjectFilePath() {
	const configuration = vscode.workspace.getConfiguration('anotherProjectManager');
	const projectsLocation: string | undefined = configuration.get('projectsLocation');
	return projectsLocation
		? path.join(projectsLocation, projectsFile)
		: getFilePathFromAppData(projectsFile);
}
export function getFilePathFromAppData(file: string) {
	let addDataPath;
	let newFile;
	const channelPath = getChannelPath();
	if (process.env.VSCODE_PORTABLE) {
		addDataPath = process.env.VSCODE_PORTABLE;
		newFile = path.join(addDataPath, channelPath, 'User', file);
		return newFile;
	}
	// in macOS
	addDataPath = process.platform === 'darwin'
		? process.env.HOME + '/Library/Application Support'
		: '/var/local';
	addDataPath = process.env.APPDATA || addDataPath;
	newFile = path.join(addDataPath, channelPath, 'User', file);
	// in linux, it may not work with /var/local, then try to use /home/myuser/.config
	if ((process.platform === 'linux') && (!fs.existsSync(newFile))) {
		newFile = path.join(homeDir, '.config/', channelPath, 'User', file);
	}
	return newFile;
}
export function getChannelPath() {
	return process.env.VSCODE_PORTABLE
		? 'user-data'
		: vscode.env.appName.replace('Visual Studio ', '');
}
export function loadProjects(filename: string) {
	if (!fs.existsSync(filename))
		return [];
	try {
		const items = JSON.parse(fs.readFileSync(filename).toString());
		return items;
	}
	catch (error) {
		const optionOpenFile = { title: 'Open File' };
		vscode.window
			.showErrorMessage("Error loading projects.json file.", optionOpenFile)
			.then(option => {
				if (option?.title === 'Open File')
					vscode.commands.executeCommand('anotherProjectManager.exitProjects');
			});
		return [];
	}
}
//# sourceMappingURL=pathUtil.js.map
