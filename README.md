# Transferring youtube subscriptions to a new account

## Features
- Saving subscriptions to a .csv
- Unsubscribing from all subscriptions
- Subscribing to all channels in the csv with a different account

## How to use
1. Use `git clone` or the download button to create a local copy of this repo
2. `cd` into the repo and run `npm init`
3. Copy `.env.sample` to `.env` and fill in your account details (OLD being where the subscriptions currently are and NEW where you want them transferred to)
4. Run commands listed below
5. Profit

## Commands
- `node unsubscribe.js` This will download your subscriptions to `Subscriptions.csv` and unsubscribe you from all channels
- `node unsubscribe.js --export-only` This will give you a csv export of your subscriptions (this is limited to 100 channels)
- `node subscribe.js` this will read `Subscriptions.csv` and subscribe to all of the channels in it

## Known limitations
- The unsubscribe script is limited to 100 channels so may need to be run multiple times (This will just add on to the end of the csv)
- There has been very limited testing so **use at your own risk**
- The script doesn't contain much error catching so may crash
- If the YouTube UI or Google Login UI change this will likely break

## Dependencies
```   
	dotenv: ^8.2.0
    fs: 0.0.1-security
    puppeteer: ^3.1.0,
    puppeteer-extra: ^3.1.16,
    puppeteer-extra-plugin-stealth: ^2.4.5
```
Please note: The version numbers of the puppeteer packages is crucial or it will not run (npm i should install the correct ones)