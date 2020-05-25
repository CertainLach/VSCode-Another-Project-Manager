import * as path from "path";
import * as vscode from "vscode";
import * as pathUtil from './pathUtil';
import { Project } from "./project";

export class ProjectsNodeProvider implements vscode.TreeDataProvider<ProjectItem> {
	projects: Project[];
	_onDidChangeTreeData: vscode.EventEmitter<any>;
	onDidChangeTreeData: vscode.Event<any>;

	constructor(public workspaceRoot?: string) {
		this.projects = [];
		this._onDidChangeTreeData = new vscode.EventEmitter();
		this.onDidChangeTreeData = this._onDidChangeTreeData.event;
	}
	async refresh() {
		this.projects = await pathUtil.loadProjects();
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
		} else {
			return Promise.resolve(this.projects.map(this.toDep));
		}
	}
	toDep(node: Project) {
		if (!node.path)
			return new ProjectItem(node);
		const command = {
			command: 'extension.open',
			title: '',
			arguments: [node.path]
		};
		return new ProjectItem(node, command);
	}
}

const localIcon = (icon: string) => ({
	light: path.join(__filename, '..', '..', 'resources', 'light', icon),
	dark: path.join(__filename, '..', '..', 'resources', 'dark', icon),
});

export class ProjectItem extends vscode.TreeItem {
	constructor(public node: Project, public command?: vscode.Command) {
		super(node.title || 'Unnamed', node.hasOwnProperty('nodes') ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
	}
	get contextValue() {
		if (this.node.nodes) return 'projectList';
		else if (this.node.path) return 'project';
		else return 'broken';
	}
	get tooltip() {
		return `${this.label}-${this.node.title}`;
	}
	get description() {
		return this.node.description || '';
	}
	get iconPath() {
		if (!this.node.icon) {
			if (this.node.path) return localIcon('project.svg');
			else if (this.node.nodes) return localIcon('folder.svg');
			else return new vscode.ThemeIcon('dialog-error')
		}
		if (this.node.icon === 'vm-remote')
			return localIcon('vm-remote.svg');
		return new vscode.ThemeIcon(this.node.icon);
	}
}
