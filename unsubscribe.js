import puppeteer from 'puppeteer-extra'
import pluginStealth from 'puppeteer-extra-plugin-stealth'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

//Stealth used to allow google login
puppeteer.use(pluginStealth())

puppeteer.launch({ headless: false }).then(async (browser) => {
    //Init browser
    const page = await browser.newPage()
    const pages = await browser.pages()
    pages[0].close()
    //Load google login
    await page.goto('https://accounts.google.com/signin/v2/identifier', { waitUntil: 'networkidle2' });
    await page.waitForSelector('#identifierId');
    //Log in
    console.log('Logging in')
    await page.type('#identifierId', process.env.OLD_GMAIL_EMAIL);
    await page.waitFor(500);
    await page.keyboard.press('Enter');
    await page.waitFor(2000);
    await page.type('input[type="password"]', process.env.OLD_GMAIL_PASSWORD);
    await page.waitFor(500);
    await page.keyboard.press('Enter');
    //Skip security notice
    await page.waitForSelector('.U26fgb');
    await page.click('.U26fgb')
    await page.waitFor(2000)
    //Go to channel list
    await page.goto('https://www.youtube.com/feed/channels', { waitUntil: 'networkidle2' })
    //Get url's of subscribed channels
    console.log('Exporting subscriptions')
    const urlArr = await page.evaluate(() => Array.from(
        document.querySelectorAll('#main-link'),
        a => a.href
    ))
    //Output URL's to csv (will add onto existing list)
    urlArr.forEach(link => {
        fs.appendFile('Subscriptions.csv', `${link},\n`, err => {
            if (err) throw err
        })
    })
    //Unsubscribe from all channels if no --export-only flag
    if (process.argv.indexOf('--export-only') === -1) {
        await page.waitFor(1000)
        console.log('Unsubscribing')
        const unsubButtons = await page.$$('#subscribe-button > ytd-subscribe-button-renderer > paper-button')
        for (const unsub of unsubButtons) {
            await unsub.click()
            await page.waitForSelector('#confirm-button >  a.yt-button-renderer > #button')
            await page.click(' #confirm-button >  a.yt-button-renderer > #button')
            await page.waitFor(500)
        }
    }
    //Close browser
    console.log('Browser will close in 10 seconds')
    await page.waitFor(10000)
    console.log('Finished')
    browser.close()
})
       