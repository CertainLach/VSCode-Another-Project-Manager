import * as  vscode from "vscode";
import * as path from "path";
import * as pathUtil from './pathUtil';

export class ProjectsNodeProvider {
	projects: any[];
	_onDidChangeTreeData: vscode.EventEmitter<any>;
	onDidChangeTreeData: vscode.Event<any>;

	constructor(public workspaceRoot?: string) {
		this.projects = [];
		this._onDidChangeTreeData = new vscode.EventEmitter();
		this.onDidChangeTreeData = this._onDidChangeTreeData.event;
		const projectFilePath = pathUtil.getProjectFilePath();
		this.projects = pathUtil.loadProjects(projectFilePath);
	}
	refresh() {
		const projectFilePath = pathUtil.getProjectFilePath();
		this.projects = pathUtil.loadProjects(projectFilePath);
		this._onDidChangeTreeData.fire();
	}
	getTreeItem(element: any) {
		return element;
	}
	getChildren(element: any) {
		if (element) {
			const node = element.node;
			const nodes = node.nodes;
			return Promise.resolve(nodes.map(this.toDep));
		}
		else {
			return Promise.resolve(this.projects.map(this.toDep));
		}
	}
	toDep(node: any) {
		if (!node.hasOwnProperty('path'))
			return new Dependency(node);
		const command = {
			command: 'extension.open',
			title: '',
			arguments: [node['path']]
		};
		return new Dependency(node, command);
	}
}
export class Dependency extends vscode.TreeItem {
	node: any;
	constructor(node: any, command?: vscode.Command) {
		super(node.title, node.hasOwnProperty('nodes') ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
		this.node = node;
		this.command = command;
		this.iconPath = {
			light: path.join(__filename, '..', '..', 'resources', 'light', this.icon),
			dark: path.join(__filename, '..', '..', 'resources', 'dark', this.icon)
		};
		this.contextValue = this.node.hasOwnProperty('nodes') ? 'dependency' : 'project';
	}
	get tooltip() {
		return `${this.label}-${this.node.title}`;
	}
	get description() {
		return this.node.description || '';
	}
	get icon() {
		let icon = 'project.svg';
		if (this.node.hasOwnProperty('nodes'))
			icon = 'folder.svg';
		if (this.node.hasOwnProperty('type')) {
			if (this.node.type === 'remote')
				icon = 'vm-remote.svg';
			else
				icon = 'vm-default.svg';
		}
		return icon;
	}
}
