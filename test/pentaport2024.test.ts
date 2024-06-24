import {pentaport2024} from '../src/scenarios/pentaport2024';
import Interpark from '../lib/sites/Interpark';

describe('펜타포트 2024 시나리오 테스트', () => {

  it('해보자! 8월 3일 바로예매', async () => {
    const scenario = pentaport2024({
      date: new Date('2024-08-03'),
      birthday: '990211',
      priceGrade: '입장권_KB국민카드 결제15%',
      delay: 1000
    });

    const interpark = new Interpark({
      username: process.env.USERNAME || '',
      password: process.env.PASSWORD || ''
    });

    await interpark.run(scenario);
  });

  it('기다려보자! 8월 4일 취소표', async () => {
    const scenario = pentaport2024({
      date: new Date('2024-08-04'),
      birthday: '990211',
      priceGrade: '입장권_KB국민카드 결제15%',
      delay: 1000
    });

    const interpark = new Interpark({
      username: process.env.USERNAME || '',
      password: process.env.PASSWORD || ''
    });

    await interpark.run(scenario);
  }, 1000000);
});