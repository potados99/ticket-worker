import Interpark from './lib/sites/Interpark';
import {ydbb2024} from './src/scenarios/YdBB2024';

async function run() {
  const scenario = ydbb2024({
    date: new Date('2024-12-30'),
    block: '101',
    delay: 800
  });

  const interpark = new Interpark({
    username: process.env.USERNAME || '',
    password: process.env.PASSWORD || ''
  });

  await interpark.run(scenario);
}

run().then(() => console.log('완료!'));