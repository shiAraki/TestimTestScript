"use strict";

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({headless: false});
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://demo.testim.io/");
  await ログイン処理();
  await browser.close();
})();

// move to utils.js

async function waitForText(page, selector, expectedText) {
  await page.waitForFunction(([selector, expectedText]) => {
    const element = document.querySelector(selector);
    return element && element.textContent.replace(/[\r\n]+/g, "").trim() === expectedText.trim();
  }, [selector, expectedText]);
}

async function sendSpecialCharacter(page, selector, key) {
  const elementHandle = await page.$(selector);
  await elementHandle.press(key);
}


// shared steps \\
async function 画面に表示されている最大金額が$1_500以下であることを確認() {
  await page.evaluate(() => {
    const maxValue = Math.max(...Array.from(document.querySelectorAll('.GalleryItem__price-tag___3q0Al'), el => Number(el.innerText.replace(/[^\-0-9.]+/g, ''))));
    
    if(maxValue >= 1500) {
      throw new Error('Maximum value should be less than $1500! Actual value: ' + maxValue);
    }
    
    return true;
    
  });
}

async function ログアウト処理() {
  await page.click(".mui-btn > :nth-child(1)");
  await page.click("[class^='theme__appBar'], [class*=' theme__appBar'] a");
}

async function ログイン処理() {
  await page.click("#app > div > header > div > div:nth-child(2) > ul > li > button");
  await page.type("[tabindex='1']", testData[TESTIM_ITERATOR].Username);
  await sendSpecialCharacter(page, "[tabindex='1']", 'Tab');
  await page.type("[type='password']", testData[TESTIM_ITERATOR].Password);
  await page.click("[form='login']");
  await waitForText(page, ".mui-btn > :nth-child(1)", /^Hello, /);
  // Converting a 'css-prop-validation' step has to be done manually at this time
  await 画面に表示されている最大金額が$1_500以下であることを確認();
  await ログアウト処理();
}

