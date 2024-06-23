import Interpark from './lib/sites/Interpark';
import {pentaport2024} from './src/scenarios/pentaport2024';

async function run() {
  const scenario = pentaport2024({
    date: new Date('2024-08-04'),
    birthday: '990211',
    delay: 800
  });

  const interpark = new Interpark({
    username: process.env.USERNAME || '',
    password: process.env.PASSWORD || ''
  });

  await interpark.run(scenario);
}

run().then(() => console.log('완료!'));