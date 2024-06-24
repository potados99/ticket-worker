import {sleep} from '../../lib/common/util';
import {Instruction, Scenario} from '../../lib/common/TicketingSite';

export function pentaport2024(params: {date: Date, birthday: string, priceGrade: string, delay: number}): Scenario {
  const goodsCode = `24005722`;
  const {date, birthday, priceGrade, delay} = params;

  if (date < new Date('2024-08-03') || date > new Date('2024-08-05')) {
    throw new Error('펜타포트 2024는 8/3부터 8/5입니다~');
  }

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
              const s = `#productSide > div > div.sideMain > div.sideContainer.containerTop.sideToggleWrap > div.sideContent.toggleCalendar > div > div > div > div > ul:nth-child(3) > li:nth-child(${date.getDate() + 4})`;
              await page.waitForSelector(s, {visible: true});
              await page.$eval(s, e => (e as HTMLElement).click());
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

                const s = `select[pricegradename='${priceGrade}']`;
                await frame.waitForSelector(s);

                const text = await frame.$eval(s, e => (e as HTMLSelectElement).innerText);
                if (text === '매진') {
                  await sleep(10); // 기다리자...
                  console.log(new Date(), '매진...');
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

              const s = `select[pricegradename='${priceGrade}']`;
              await frame.waitForSelector(s);
              await frame.select(s, '1');
            }
          },
          {
            name: '잠시 기다리기',
            execute: async (page) => {
              await sleep(delay);
            }
          },
          {
            name: '다음으로 넘어가기',
            execute: async (page) => {
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
              await frame.type(s, birthday);
            }
          },
          {
            name: '잠시 기다리기',
            execute: async (page) => {
              await sleep(delay);
            }
          },
          {
            name: '다음으로 넘어가기',
            execute: async (page) => {
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
            name: '잠시 기다리기',
            execute: async (page) => {
              await sleep(delay);
            }
          },
          {
            name: '다음으로 넘어가기',
            execute: async (page) => {
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
            name: '취소수수료 동의하기',
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
            name: '잠시 기다리기',
            execute: async (page) => {
              await sleep(delay);
            }
          },
          {
            name: '다음으로 넘어가기',
            execute: async (page) => {
              const s = 'a#SmallNextBtnLink';
              await page.$eval(s, e => e.click());
            }
          }
        ]
      }
    ]
  };
}
