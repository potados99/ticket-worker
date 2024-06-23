import {sleep} from '../../lib/common/util';
import {Scenario} from '../../lib/common/TicketingSite';

export const pentaport2024: Scenario = {
  steps: [
    {
      name: '공연 페이지 진입',
      instructions: [
        {
          name: '공연 페이지로 이동',
          execute: async (page) => {
            await page.goto('https://tickets.interpark.com/goods/24005722');
          }
        }
      ]
    },
    {
      name: '예매 페이지로 넘어가기',
      instructions: [
        {
          name: '8월 3일 선택',
          execute: async (page) => {
            const s = `#productSide > div > div.sideMain > div.sideContainer.containerTop.sideToggleWrap > div.sideContent.toggleCalendar > div > div > div > div > ul:nth-child(3) > li:nth-child(7)`;
            await page.waitForSelector(s, {visible: true});
            await page.click(s);
          }
        },
        {
          name: '예매 페이지로 이동',
          execute: async (page) => {
            const s = `#productSide > div > div.sideBtnWrap > a.sideBtn.is-primary`;
            await page.waitForSelector(s, {visible: true});
            await page.$eval(s, e => e.click());

            return await new Promise(x => page.once('popup', x));
          }
        }
      ]
    },
    {
      name: '기다리고 시도하기',
      instructions: [
        {
          name: '나올 때까지 새로고침하기',
          execute: async (page) => {
            while (true) {
              await page.reload();

              const iframe = await page.$('iframe[id="ifrmBookStep"]');
              if (!iframe) {
                continue;
              }
              const frame = await iframe.contentFrame();

              await frame.waitForSelector('#PriceRow002');

              const text = await frame.$eval('#PriceRow005 > td.taL > select', e => e.innerText);
              if (text === '매진') {
                await sleep(1000); // 기다리자...
                console.log('매진...');
              } else {
                break; // 드디어 갈 수 있다.
              }
            }
          }
        },
        {
          name: '1매 선택하기',
          execute: async (page) => {
            const iframe = await page.$('iframe[id="ifrmBookStep"]');
            if (!iframe) {
              throw new Error('iframe not found');
            }
            const frame = await iframe.contentFrame();

            const s = '#PriceRow005 > td.taL > select';
            await frame.waitForSelector(s);
            await frame.select(s, '1');
          }
        },
        {
          name: '다음으로 넘어가기',
          execute: async (page) => {
            await sleep(1000);
            const s = 'a#SmallNextBtnLink';
            await page.$eval(s, e => e.click());
          }
        }
      ]
    },
    {
      name: '주문자 정보 입력하기',
      instructions: [
        {
          name: '생년월일 쓰기',
          execute: async (page) => {
            const iframe = await page.$('iframe[id="ifrmBookStep"]');
            if (!iframe) {
              throw new Error('iframe not found');
            }
            const frame = await iframe.contentFrame();

            const s = '#YYMMDD';
            await frame.waitForSelector(s);
            await frame.type(s, '990211');
          }
        },
        {
          name: '다음으로 넘어가기',
          execute: async (page) => {
            await sleep(1000);
            const s = 'a#SmallNextBtnLink';
            await page.$eval(s, e => e.click());
          }
        }
      ]
    },
    {
      name: '결제하기',
      instructions: [
        {
          name: '무통장입금 선택하기',
          execute: async (page) => {
            const iframe = await page.$('iframe[id="ifrmBookStep"]');
            if (!iframe) {
              throw new Error('iframe not found');
            }
            const frame = await iframe.contentFrame();

            const s = '#Payment_22004 > td > input'; // 무통장입금
            await frame.waitForSelector(s);
            await frame.click(s);
          }
        },
        {
          name: '국민은행 선택하기',
          execute: async (page) => {
            const iframe = await page.$('iframe[id="ifrmBookStep"]');
            if (!iframe) {
              throw new Error('iframe not found');
            }
            const frame = await iframe.contentFrame();

            const s = '#BankCode';
            await frame.waitForSelector(s);
            await frame.select(s, '38051'); // 국민은행
          }
        },
        {
          name: '다음으로 넘어가기',
          execute: async (page) => {
            await sleep(1000);
            const s = 'a#SmallNextBtnLink';
            await page.$eval(s, e => e.click());
          }
        }
      ]
    },
    {
      name: '진짜 결제하기(취소 수수료 동의)',
      instructions: [
        {
          name: '동의하기',
          execute: async (page) => {
            const iframe = await page.$('iframe[id="ifrmBookStep"]');
            if (!iframe) {
              throw new Error('iframe not found');
            }
            const frame = await iframe.contentFrame();

            const s = 'input#checkAll';
            await frame.waitForSelector(s);
            await frame.click(s);
          }
        },
        {
          name: '다음으로 넘어가기',
          execute: async (page) => {
            await sleep(1000);
            const s = 'a#SmallNextBtnLink';
            // await page.$eval(s, e => e.click());
          }
        }
      ]
    }
  ]
};

