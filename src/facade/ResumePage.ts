import { ResumeImporter } from "../importer/ResumeImporter";

/**
 * Патерн Facade (Фасад).
 *
 * Надає спрощений інтерфейс до складної системи генерації резюме:
 * клієнту достатньо викликати init(jsonPath), а вся складність —
 * завантаження JSON, валідація, мапінг у модель і рендеринг у DOM —
 * прихована за фасадом.
 */
export class ResumePage {
  async init(jsonPath: string): Promise<void> {
    try {
      const raw = await this.fetchData(jsonPath);
      // Делегуємо обробку Template Method-імпортеру.
      new ResumeImporter(raw).import();
    } catch (err) {
      console.error("Не вдалося згенерувати резюме:", err);
      const root = document.getElementById("resume-content");
      if (root) {
        const msg = err instanceof Error ? err.message : String(err);
        root.innerHTML = `<p class="highlight">Помилка завантаження резюме: ${msg}</p>`;
      }
    }
  }

  /** Завантажує JSON з вказаного шляху. */
  private async fetchData(path: string): Promise<unknown> {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} під час завантаження ${path}`);
    }
    return res.json();
  }
}
