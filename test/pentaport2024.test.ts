import {pentaport2024} from '../src/scenarios/pentaport2024';
import Interpark from '../lib/sites/Interpark';

describe('펜타포트 2024 시나리오 테스트', () => {

  it('해보자! 8월 3일 바로예매', async () => {
    const scenario = pentaport2024({
      date: new Date('2024-08-03'),
      birthday: '990211',
      delay: 1000
    });

    const interpark = new Interpark({
      username: process.env.USERNAME || '',
      password: process.env.PASSWORD || ''
    });

    await interpark.run(scenario);
  });
});