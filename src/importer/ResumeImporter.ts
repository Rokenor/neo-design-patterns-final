/**
 * Конкретна реалізація імпортера резюме.
 * Наслідується від AbstractImporter (Template Method) і реалізує
 * конкретні кроки алгоритму: validate → map → render.
 */

import { AbstractImporter } from "./AbstractImporter";
import {
  ResumeModel,
  Experience,
  Education,
  Project,
  Skills,
  Contact,
} from "../models/ResumeModel";
import { BlockFactory, BlockType } from "../blocks/BlockFactory";

/** Обов'язкові блоки верхнього рівня. */
const REQUIRED_BLOCKS: BlockType[] = [
  "header",
  "summary",
  "experience",
  "education",
  "skills",
];

export class ResumeImporter extends AbstractImporter<ResumeModel> {
  /**
   * Крок 1: валідація.
   * Перевіряє наявність обов'язкових блоків: header, summary,
   * experience, education, skills.
   */
  protected validate(): void {
    if (typeof this.raw !== "object" || this.raw === null) {
      throw new Error("Неприпустимий формат JSON: очікувався об'єкт");
    }

    const data = this.raw as Record<string, unknown>;
    const missing = REQUIRED_BLOCKS.filter((key) => !(key in data));
    if (missing.length > 0) {
      throw new Error(
        `Відсутні обов'язкові блоки резюме: ${missing.join(", ")}`
      );
    }

    if (!Array.isArray(data.experience)) {
      throw new Error("Блок 'experience' повинен бути масивом");
    }
    if (!Array.isArray(data.education)) {
      throw new Error("Блок 'education' повинен бути масивом");
    }
  }

  /**
   * Крок 2: мапінг.
   * Трансформує «сирий» JSON на внутрішні типи ResumeModel.
   */
  protected map(): ResumeModel {
    const data = this.raw as Record<string, any>;

    const contacts: Contact = {
      email: data.header.contacts?.email,
      phone: data.header.contacts?.phone,
      location: data.header.contacts?.location,
    };

    const experience: Experience[] = (data.experience as any[]).map((e) => ({
      position: e.position,
      company: e.company,
      start: e.start,
      end: e.end,
      projects: ((e.projects ?? []) as any[]).map(
        (p): Project => ({
          name: p.name,
          description: p.description,
          isRecent: Boolean(p.isRecent),
        })
      ),
    }));

    const education: Education[] = (data.education as any[]).map((e) => ({
      degree: e.degree,
      field: e.field,
      institution: e.institution,
      graduation: e.graduation,
    }));

    const skills: Skills = {
      core: data.skills.core ?? [],
      tools: data.skills.tools ?? [],
      languages: data.skills.languages ?? [],
    };

    return {
      header: {
        fullName: data.header.fullName,
        title: data.header.title,
        contacts,
      },
      summary: { text: data.summary.text },
      experience,
      education,
      skills,
    };
  }

  /**
   * Крок 3: рендеринг.
   * Створює BlockFactory (Factory Method), генерує всі блоки у
   * визначеному порядку та додає їх у #resume-content.
   */
  protected render(model: ResumeModel): void {
    const root = document.getElementById("resume-content");
    if (!root) {
      throw new Error("Не знайдено контейнер #resume-content");
    }
    root.innerHTML = "";

    const factory = new BlockFactory();

    // Додавання нового блоку зводиться до одного рядка в цьому масиві.
    const order: BlockType[] = [
      "header",
      "summary",
      "experience",
      "education",
      "skills",
    ];

    for (const type of order) {
      const block = factory.createBlock(type, model);
      root.appendChild(block.render());
    }
  }
}
