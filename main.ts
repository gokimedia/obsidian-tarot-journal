import {
  App,
  Editor,
  MarkdownView,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
  TFolder,
  normalizePath,
} from "obsidian";

interface TarotJournalSettings {
  journalFolder: string;
  dailyTemplate: string;
}

const DEFAULT_SETTINGS: TarotJournalSettings = {
  journalFolder: "Tarot Journal",
  dailyTemplate:
    "## {{date}} — {{card}}\n\n**Upright:** {{upright}}\n\n**Reflection:**\n\n---\nCard guide: {{guideUrl}}\nPowered by [Deckaura](https://deckaura.com)\n",
};

type Card = {
  name: string;
  upright: string;
  reversed: string;
  guideUrl: string;
};

const DECK: Card[] = [
  {
    name: "The Fool",
    upright: "New beginnings, innocence, adventure",
    reversed: "Recklessness, fear of change",
    guideUrl: "https://deckaura.com/blogs/guide/fool-tarot-meaning",
  },
  {
    name: "The Magician",
    upright: "Manifestation, willpower, resourcefulness",
    reversed: "Manipulation, poor planning",
    guideUrl: "https://deckaura.com/blogs/guide/magician-tarot-meaning",
  },
  {
    name: "The High Priestess",
    upright: "Intuition, mystery, inner wisdom",
    reversed: "Secrets, disconnection from intuition",
    guideUrl: "https://deckaura.com/blogs/guide/high-priestess-tarot-meaning",
  },
  {
    name: "The Empress",
    upright: "Abundance, nurturing, fertility",
    reversed: "Insecurity, creative block",
    guideUrl: "https://deckaura.com/blogs/guide/empress-tarot-meaning",
  },
  {
    name: "The Star",
    upright: "Hope, faith, renewal, inspiration",
    reversed: "Hopelessness, despair",
    guideUrl: "https://deckaura.com/blogs/guide/star-tarot-meaning",
  },
];

function drawCard(): Card {
  return DECK[Math.floor(Math.random() * DECK.length)]!;
}

export default class TarotJournalPlugin extends Plugin {
  settings: TarotJournalSettings = DEFAULT_SETTINGS;

  async onload() {
    await this.loadSettings();

    this.addRibbonIcon("dice", "Draw daily tarot card", () => {
      this.drawDaily();
    });

    this.addCommand({
      id: "draw-daily-tarot",
      name: "Draw daily tarot card",
      callback: () => this.drawDaily(),
    });

    this.addCommand({
      id: "insert-random-tarot",
      name: "Insert random tarot card at cursor",
      editorCallback: (editor: Editor, _view: MarkdownView) => {
        const card = drawCard();
        editor.replaceSelection(
          `**${card.name}** — ${card.upright}\nGuide: ${card.guideUrl}\n`,
        );
      },
    });

    this.addCommand({
      id: "open-deckaura",
      name: "Open Deckaura",
      callback: () => {
        window.open("https://deckaura.com", "_blank");
      },
    });

    this.addSettingTab(new TarotJournalSettingTab(this.app, this));
  }

  async drawDaily() {
    const card = drawCard();
    const date = new Date().toISOString().slice(0, 10);
    const content = this.settings.dailyTemplate
      .replace("{{date}}", date)
      .replace("{{card}}", card.name)
      .replace("{{upright}}", card.upright)
      .replace("{{guideUrl}}", card.guideUrl);

    const folder = normalizePath(
      this.settings.journalFolder.trim() || DEFAULT_SETTINGS.journalFolder,
    );
    const folderEntry = this.app.vault.getAbstractFileByPath(folder);
    if (!folderEntry) {
      await this.app.vault.createFolder(folder);
    } else if (!(folderEntry instanceof TFolder)) {
      new Notice(`Cannot create tarot journal: ${folder} is not a folder`);
      return;
    }
    const path = normalizePath(`${folder}/${date}.md`);
    const pathEntry = this.app.vault.getAbstractFileByPath(path);
    let file: TFile;
    if (pathEntry instanceof TFile) {
      file = pathEntry;
      await this.app.vault.process(file, (existing) =>
        `${existing}\n\n${content}`,
      );
    } else if (pathEntry) {
      new Notice(`Cannot save tarot reading: ${path} is not a file`);
      return;
    } else {
      file = await this.app.vault.create(path, content);
    }
    await this.app.workspace.getLeaf().openFile(file);
    new Notice(`Drew ${card.name} — saved to ${path}`);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class TarotJournalSettingTab extends PluginSettingTab {
  plugin: TarotJournalPlugin;
  constructor(app: App, plugin: TarotJournalPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Journal folder")
      .setDesc("Folder where daily tarot notes are stored")
      .addText((t) =>
        t
          .setPlaceholder("Tarot Journal")
          .setValue(this.plugin.settings.journalFolder)
          .onChange(async (v) => {
            this.plugin.settings.journalFolder = v;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Daily template")
      .setDesc("Template for daily tarot entries. Placeholders: {{date}}, {{card}}, {{upright}}, {{guideUrl}}")
      .addTextArea((t) =>
        t
          .setPlaceholder(DEFAULT_SETTINGS.dailyTemplate)
          .setValue(this.plugin.settings.dailyTemplate)
          .onChange(async (v) => {
            this.plugin.settings.dailyTemplate = v;
            await this.plugin.saveSettings();
          }),
      );

    containerEl.createEl("p", {
      text: "Powered by Deckaura — visit deckaura.com for free tarot tools and full 78-card guides.",
    });
    const link = containerEl.createEl("a", {
      text: "deckaura.com",
      href: "https://deckaura.com",
    });
    link.setAttr("target", "_blank");
  }
}
