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
    await page.goto('https://accounts.google.com/signin/v2/identifier', { waitUntil: 'networkidle2' })
    await page.waitForSelector('#identifierId')
    //Log in
    console.log('Logging in')
    await page.type('#identifierId', process.env.NEW_GMAIL_EMAIL)
    await page.waitFor(500)
    await page.keyboard.press('Enter')
    await page.waitFor(2000)
    await page.type('input[type="password"]', process.env.NEW_GMAIL_PASSWORD)
    await page.waitFor(500)
    await page.keyboard.press('Enter')
    //Skip security notice
    await page.waitForSelector('.U26fgb')
    await page.click('.U26fgb')
    await page.waitFor(2000)
    //Load subscriptions from Subscription.csv
    console.log('Loading Subscriptions.csv')
    const channels = fs.readFileSync('Subscriptions.csv')
        .toString()
        .split(/([^,\r\n\"\}]+)/g)
        .map(e => e.trim())
        .filter(e => e !== null && e !== '')

    //Loop through url's
    console.log('Subscribing to channels')
    for (const channel of channels) {
        console.log('Subscribing to ', channel)
        await page.goto(channel, { waitUntil: 'networkidle2' })
        await page.waitForSelector('.ytd-c4-tabbed-header-renderer > .ytd-subscribe-button-renderer')
        //Error checking to see if already subscribed
        const isSubscribed = await page.$eval(
            '.ytd-c4-tabbed-header-renderer > .ytd-subscribe-button-renderer',
            el => el.getAttribute('subscribed')
        ) !== null
        //Subscribe if required
        if (!isSubscribed) await page.click('.ytd-c4-tabbed-header-renderer > .ytd-subscribe-button-renderer')
    }

    //Close browser
    console.log('Browser will close in 10 seconds')
    await page.waitFor(10000)
    console.log('Finished')
    browser.close()
})
