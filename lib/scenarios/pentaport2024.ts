import { Scenario } from '../common/types';

export const pentaport2024: Scenario = { // copilot suggested this code
  loginUrl: 'https://ticket.interpark.com/Gate/TPLogin.asp',
  productUrl: 'https://ticket.interpark.com/TPGoodsList.asp?Ca=Con&SubCa=Rock',
  steps: [
    {
      name: 'login',
      instructions: [
        {
          name: 'input username',
          execute: async (page) => {
            await page.type('#userId', 'test');
          }
        },
        {
          name: 'input password',
          execute: async (page) => {
            await page.type('#userPwd', 'test');
          }
        },
        {
          name: 'click login',
          execute: async (page) => {
            await page.click('#btn_login');
          }
        }
      ]
    },
    {
      name: 'select product',
      instructions: [
        {
          name: 'click product',
          execute: async (page) => {
            await page.click('.goodsImg');
          }
        }
      ]
    },
    {
      name: 'buy product',
      instructions: [
        {
          name: 'click buy',
          execute: async (page) => {
            await page.click('#LargeNextBtn');
          }
        }
      ]
    }
  ]
}