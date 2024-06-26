import {sleep} from './util';
import puppeteer, {Page} from 'puppeteer';

export type Credential = {
  username: string;
  password: string;
}

export type Scenario = {
  steps: Step[];
}

export type Step = {
  name: string;
  runIf?: (page: Page) => Promise<boolean>;
  instructions: Instruction[];
}

export type Instruction = {
  name: string;
  execute: (page: Page) => Promise<Page | void | null> | Promise<Page> | Promise<void>;
};

export default abstract class TicketingSite {
  constructor(protected readonly credential: Credential) {
  }

  public async run(scenario: Scenario): Promise<void> {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });

    while (true) {
      const loginPage = await browser.newPage();
      await this.loginIfNeeded(loginPage);
      await loginPage.close();

      try {
        await this.executeSteps(await browser.newPage(), scenario.steps);
        return; // 무사히 종료!
      } catch (e) {
        console.error(e); // 에러터지면 처음부터,,
        for (const page of await browser.pages()) {
          await page.close();
        }
      } finally {

      }
    }
  }

  public abstract loginIfNeeded(newPage: Page): Promise<void>;

  private async executeSteps(newPage: Page, steps: Step[]) {
    let currentPage = newPage;

    for (const step of steps) {
      console.log(`Step: ${step.name}`);

      if (step.runIf && !await step.runIf(newPage)) {
        continue;
      }

      for (const instruction of step.instructions) {
        console.log(`Instruction: ${instruction.name}`);

        currentPage = await instruction.execute(currentPage) || currentPage;
      }
    }
  }
}

