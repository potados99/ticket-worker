import {Page} from 'puppeteer';
import TicketingSite from '../common/TicketingSite';

export default class Interpark extends TicketingSite {
  public async loginIfNeeded(newPage: Page): Promise<void> {
    const loginUrl = 'https://accounts.interpark.com/login/form';
    await newPage.goto(loginUrl);

    if (newPage.url() !== loginUrl) {
      // 이미 로그인된 것으로 간주합니다.
      return;
    }

    await newPage.type('#userId', this.credential.username);
    await newPage.type('#userPwd', this.credential.password);
    await newPage.keyboard.press('Enter');

    await newPage.waitForNavigation();
  }
}