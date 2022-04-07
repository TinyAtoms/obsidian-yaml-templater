
import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, TFile, TFolder, TAbstractFile, FrontMatterCache, FuzzySuggestModal } from 'obsidian';

// Remember to rename these classes and interfaces!


interface MyPluginSettings {
	path: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	path: 'default'
}



export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	getFrontmatter(): FrontMatterCache {
		return this.app.metadataCache.getFileCache(this.app.workspace.getActiveFile()).frontmatter;
	}
	checkModalCondition(): boolean {
		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (markdownView) {
			const fileCache = this.app.metadataCache.getFileCache(this.app.workspace.getActiveFile());
			return (fileCache !== null && fileCache.frontmatter && true);
		}
		return false;
	}

	async onload() {
		await this.loadSettings();
		this.addCommand({
			id: 'yaml-templater-editor-command',
			name: 'Insert template',
			editorCallback: (editor: Editor, view: MarkdownView) => {

				if (!this.checkModalCondition()) { return; }
				const frontmatter = this.getFrontmatter();
				new TemplateSuggest(this, frontmatter, editor).open();

			}
		});
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new YamlSettingsTab(this.app, this));
	}
	onunload() {
	}
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class TemplateSuggest extends FuzzySuggestModal<TFile> {
	plugin: MyPlugin;
	path: string;
	vars: FrontMatterCache;
	editor: Editor;
	constructor(plugin: MyPlugin, data: FrontMatterCache, editor: Editor) {
		super(plugin.app);
		this.plugin = plugin;
		this.path = plugin.settings.path;
		this.vars = data;
		this.editor = editor
	}

	getItems(): TFile[] {
		const files: TFile[] = [];
		const folder = this.app.vault.getAbstractFileByPath(this.path);
		if (folder instanceof TFolder) {
			folder.children.forEach((f) => {
				if (f instanceof TFile) {
					files.push(f);
				}
			});
		}
		return files;
	}
	getItemText(template: TFile): string { return template.basename; }
	onChooseItem(template: TFile, evt: MouseEvent | KeyboardEvent) {
		new Notice(`Selected ${template.name}`);
		this.app.vault.cachedRead(template).then(
			(text) => {
				console.log(text);
				const reg = /{{([a-zA-Z-]+)}}/g;
				const replaced = text.replace(reg, (m, i) => (i in this.vars && this.vars[i] != undefined) ? this.vars[i].trim() : "{{not found}}");
				console.log(replaced);
				this.editor.replaceSelection(replaced);
			}
		)
	}
}
class YamlSettingsTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings for my awesome plugin.' });

		new Setting(containerEl)
			.setName('YAML-template path')
			.setDesc('This specifies the path where the templates for this plugin are stored')
			.addText(text => text
				.setPlaceholder('Enter your path')
				.setValue(this.plugin.settings.path)
				.onChange(async (value) => {
					this.plugin.settings.path = value;
					await this.plugin.saveSettings();
				}));

	}
}


