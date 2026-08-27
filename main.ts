import {
  App,
  Editor,
  MarkdownView,
  Notice,
  Plugin,
  PluginSettingTab,
  SettingDefinitionItem,
  TFile,
  TFolder,
  normalizePath,
} from "obsidian";

import deckData from "./cards.json";

interface TarotJournalSettings {
  journalFolder: string;
  dailyTemplate: string;
  includeReversed: boolean;
}

const DEFAULT_SETTINGS: TarotJournalSettings = {
  journalFolder: "Tarot Journal",
  dailyTemplate:
    "## {{card}} — {{date}}\n\n**Orientation:** {{orientation}}\n\n**Meaning:** {{meaning}}\n\n**Reflection:**\n\n**Guide:** [Read the card guide]({{guideUrl}})\n",
  includeReversed: true,
};

type Card = {
  name: string;
  upright: string;
  reversed: string;
  guideUrl: string;
};

type CardDraw = {
  card: Card;
  orientation: "upright" | "reversed";
  meaning: string;
};

const DECK: Card[] = deckData.cards.map((card) => ({
  name: card.card_name,
  upright: card.upright_meaning,
  reversed: card.reversed_meaning,
  guideUrl: card.guide_url,
}));

function drawCard(includeReversed: boolean): CardDraw {
  const card = DECK[Math.floor(Math.random() * DECK.length)];
  const orientation =
    includeReversed && Math.random() < 0.5 ? "reversed" : "upright";

  return {
    card,
    orientation,
    meaning: orientation === "upright" ? card.upright : card.reversed,
  };
}

function formatLocalDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const monthText = month < 10 ? `0${month}` : `${month}`;
  const dayText = day < 10 ? `0${day}` : `${day}`;
  return `${date.getFullYear()}-${monthText}-${dayText}`;
}

function renderTemplate(
  template: string,
  draw: CardDraw,
  date: string,
): string {
  const replacements: Record<string, string> = {
    "{{date}}": date,
    "{{card}}": draw.card.name,
    "{{orientation}}": draw.orientation,
    "{{meaning}}": draw.meaning,
    "{{upright}}": draw.card.upright,
    "{{reversed}}": draw.card.reversed,
    "{{guideUrl}}": draw.card.guideUrl,
  };

  let output = template;
  for (const placeholder of Object.keys(replacements)) {
    output = output.split(placeholder).join(replacements[placeholder]);
  }
  return output;
}

export default class TarotJournalPlugin extends Plugin {
  settings: TarotJournalSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.addRibbonIcon("dice", "Draw daily tarot card", () => {
      this.runDailyDraw();
    });

    this.addCommand({
      id: "draw-daily-tarot",
      name: "Draw daily tarot card",
      callback: () => this.runDailyDraw(),
    });

    this.addCommand({
      id: "insert-random-tarot",
      name: "Insert random tarot card",
      editorCallback: (editor: Editor, _view: MarkdownView) => {
        const draw = drawCard(this.settings.includeReversed);
        editor.replaceSelection(
          `**${draw.card.name} (${draw.orientation})** — ${draw.meaning}\n[Card guide](${draw.card.guideUrl})\n`,
        );
      },
    });

    this.addSettingTab(new TarotJournalSettingTab(this.app, this));
  }

  private runDailyDraw(): void {
    void this.drawDaily().catch((error: unknown) => {
      console.error("Tarot Journal failed to save a daily draw", error);
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      new Notice(`Could not save tarot reading: ${message}`);
    });
  }

  private async ensureFolder(folder: string): Promise<void> {
    const segments = folder.split("/").filter(Boolean);
    let currentPath = "";

    for (const segment of segments) {
      currentPath = normalizePath(
        currentPath ? `${currentPath}/${segment}` : segment,
      );
      const entry = this.app.vault.getAbstractFileByPath(currentPath);
      if (!entry) {
        await this.app.vault.createFolder(currentPath);
      } else if (!(entry instanceof TFolder)) {
        throw new Error(`${currentPath} exists and is not a folder`);
      }
    }
  }

  private async drawDaily(): Promise<void> {
    const draw = drawCard(this.settings.includeReversed);
    const date = formatLocalDate(new Date());
    const content = renderTemplate(this.settings.dailyTemplate, draw, date);
    const folder = normalizePath(
      this.settings.journalFolder.trim() || DEFAULT_SETTINGS.journalFolder,
    );

    await this.ensureFolder(folder);

    const path = normalizePath(`${folder}/${date}.md`);
    const pathEntry = this.app.vault.getAbstractFileByPath(path);
    let file: TFile;

    if (pathEntry instanceof TFile) {
      file = pathEntry;
      await this.app.vault.process(
        file,
        (existing) => `${existing}\n\n${content}`,
      );
    } else if (pathEntry) {
      throw new Error(`${path} exists and is not a file`);
    } else {
      file = await this.app.vault.create(path, content);
    }

    await this.app.workspace.getLeaf().openFile(file);
    new Notice(`Drew ${draw.card.name} — saved to ${path}`);
  }

  private async loadSettings(): Promise<void> {
    const saved =
      (await this.loadData()) as Partial<TarotJournalSettings> | null;
    this.settings = Object.assign({}, DEFAULT_SETTINGS, saved);
  }
}

class TarotJournalSettingTab extends PluginSettingTab {
  plugin: TarotJournalPlugin;

  constructor(app: App, plugin: TarotJournalPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  getSettingDefinitions(): SettingDefinitionItem<keyof TarotJournalSettings>[] {
    return [
      {
        name: "Journal folder",
        desc: "Folder where daily tarot notes are stored.",
        control: {
          type: "folder",
          key: "journalFolder",
          placeholder: DEFAULT_SETTINGS.journalFolder,
          validate: (value: string) =>
            value.trim() ? undefined : "Choose a journal folder.",
        },
      },
      {
        name: "Include reversed cards",
        desc: "Allow draws to use upright and reversed interpretations.",
        control: {
          type: "toggle",
          key: "includeReversed",
          defaultValue: true,
        },
      },
      {
        name: "Daily template",
        desc: "Available placeholders: {{date}}, {{card}}, {{orientation}}, {{meaning}}, {{upright}}, {{reversed}}, and {{guideUrl}}.",
        control: {
          type: "textarea",
          key: "dailyTemplate",
          placeholder: DEFAULT_SETTINGS.dailyTemplate,
          rows: 10,
          validate: (value: string) =>
            value.trim() ? undefined : "Enter a daily note template.",
        },
      },
    ];
  }
}
