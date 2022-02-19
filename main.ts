import { App, Plugin, PluginSettingTab, Setting, TFolder } from "obsidian";
import { CalendarView, FULL_CALENDAR_VIEW_TYPE } from "src/view";
import { renderCalendar } from "src/calendar";

import { EventModal } from "src/modal";
import { parseFrontmatter } from "src/frontmatter";
import {
	DEFAULT_SETTINGS,
	FullCalendarSettings,
	FullCalendarSettingTab,
} from "src/settings";

export default class FullCalendarPlugin extends Plugin {
	settings: FullCalendarSettings = DEFAULT_SETTINGS;

	renderCalendar = renderCalendar;
	processFrontmatter = parseFrontmatter;

	async activateView() {
		this.app.workspace.detachLeavesOfType(FULL_CALENDAR_VIEW_TYPE);

		await this.app.workspace.getUnpinnedLeaf().setViewState({
			type: FULL_CALENDAR_VIEW_TYPE,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(FULL_CALENDAR_VIEW_TYPE)[0]
		);
	}
	async onload() {
		await this.loadSettings();

		this.registerView(
			FULL_CALENDAR_VIEW_TYPE,
			(leaf) => new CalendarView(leaf, this)
		);
		this.addRibbonIcon(
			"calendar-glyph",
			"Open Full Calendar",
			(_: MouseEvent) => {
				this.activateView();
			}
		);

		this.addSettingTab(new FullCalendarSettingTab(this.app, this));

		this.addCommand({
			id: "full-calendar-new-event",
			name: "New Event",
			callback: () => {
				new EventModal(this.app, this, null).open();
			},
		});
		this.addCommand({
			id: "full-calendar-open",
			name: "Open Calendar",
			callback: () => {
				this.activateView();
			},
		});
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(FULL_CALENDAR_VIEW_TYPE);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
