import {Scenario} from '../../lib/common/TicketingSite';
import Tesseract from 'tesseract.js';

export function ydbb2024(params: {date: Date, block: string, delay: number}): Scenario {
  const goodsCode = `24016375`;
  const {date, block, delay} = params;

  return {
    steps: [
      {
        name: '공연 페이지 진입하기',
        instructions: [
          {
            name: '공연 페이지로 이동',
            execute: async (page) => {
              await page.goto(`https://tickets.interpark.com/goods/${goodsCode}`);
            }
          }
        ]
      },
      {
        name: '예매 페이지로 넘어가기',
        instructions: [
          {
            name: '날짜 선택',
            execute: async (page) => {
              const s = `#productSide > div > div.sideMain > div.sideContainer.containerTop.sideToggleWrap > div.sideContent.toggleCalendar > div > div > div > div > ul:nth-child(3) > li:nth-child(${date.getDate()})`;
              await page.waitForSelector(s, {visible: true});
              await page.$eval(s, e => (e as HTMLElement).click());
            }
          },
          {
            name: '회차 선택',
            execute: async (page) => {
              const s = `#productSide > div > div.sideMain > div.sideContainer.containerMiddle.sideToggleWrap > div.sideContent > div.sideTimeTable.toggleTimeTable > ul > li > a`;
              await page.waitForSelector(s, {visible: true});
              await page.$eval(s, e => (e as HTMLElement).click());
            }
          },
          {
            name: '예매 페이지로 이동',
            execute: async (page) => {
              const s = `#productSide > div > div.sideBtnWrap > a.sideBtn.is-primary`;
              await page.waitForSelector(s, {visible: true});
              await page.click(s); // 진짜 클릭을 유발시켜야 클릭 이벤트의 isTrusted가 true가 됩니다. 그래야 헤드리스 브라우저 탐지를 속일 수 있음 ㅋㅎㅋㅎ

              return await new Promise(x => page.once('popup', x));
            }
          }
        ]
      },
      {
        name: '캡챠 회피기동',
        instructions: [
          {
            name: '코드 읽고 입력',
            execute: async (page) => {
              const frameSelector = 'iframe[id="ifrmSeat"]';
              await page.waitForSelector(frameSelector, {visible: true});

              const iframe = await page.$(frameSelector);
              const contentFrame = await iframe!.contentFrame();

              const imgSelector = `#imgCaptcha`;
              await contentFrame.waitForSelector(imgSelector, {visible: true});
              const src = await contentFrame.$eval(imgSelector, e => (e as HTMLImageElement).src);
              const result = await Tesseract.recognize(src, 'eng', {logger: console.log});

              console.log(result.data.text);
            }
          }
        ]
      }
    ]
  };
}