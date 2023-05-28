# <img src="public/icons/icon_48.png" width="45" align="left"> Anime Art Forwarder

<a target="_blank" href="https://github.com/Octoober/anime-art-forwarder/releases">Download build</a>

This Chrome browser extension simplifies the process of sharing anime art to a Telegram channel with just one click. It serves as a helpful tool for channel administrators who want to quickly send anime art from their browser to a designated Telegram channel.
<br>
<div align="center">
    <img width="500" align="center" src="./assets/example.gif">
</div>
<br><br>

## Supported:
- donmai.us
- rule34.xxx

Currently, the extension does NOT support adding multiple Telegram channels, but this feature is planned for future implementation.

## Features
- Easy setup and integration with your Telegram bot
- Intuitive interface with a dedicated button for instant forwarding
- Compatibility with popular anime art websites

## Browser Extension Installation
1. <a target="_blank" href="https://github.com/Octoober/anime-art-forwarder/releases">Download the zip archive</a> of the extension to your computer.
2. Extract the zip archive to any folder.
3. Open Google Chrome browser.
4. Type `chrome://extensions` in the address bar and press Enter.
5. Enable the Developer Mode located in the top right corner of the page.
6. Find the option "Load unpacked" and click on it.
7. Choose the folder where you extracted the archive.
## Steps to set up the bot
2. Create a Telegram bot following the instructions provided by <a target="_blank" href="https://t.me/BotFather">@BotFather</a>.
3. Add the created bot to your Telegram channel and grant it permission to post messages.


### Steps to configure the extension in your browser:
1. Copy the API key provided by <a target="_blank" href="https://t.me/BotFather">@BotFather</a> and paste it into the "Token Key" field in the extension settings.
2. In the "Chat ID" field, specify the public name of your channel in the format **@channelName**.
   - **If your channel is private**, instead of the public name, you need to provide the unique identifier of your channel.
     To obtain the unique identifier, follow these steps:
     - Temporarily make your channel public.
     - Go to the following link: `https://api.telegram.org/bot<YOUR_TOKEN_KEY>/getChat?chat_id=@channelName`
       Replace **<YOUR_TOKEN_KEY>** with your API key, and replace **@channelName** with the name of your channel.
     - Copy the negative number from the "id" field in the API response and paste it into the "Chat ID" field in the extension settings.
     - After configuring the extension, you can revert your channel back to private mode.

It is **recommended** to always use the unique identifier (Chat ID) as the bot will continue to work even if you switch your channel to private mode.


## Installation For Developers
1. Clone the repository using the command:

    ```sh
    git clone https://github.com/Octoober/anime-art-forwarder.git
    ```

2. Navigate to the project directory:

    ```sh
    cd anime-art-forwarder
    ```

3. Install dependencies using npm:

    ```sh
    npm install
    ```

### Auxiliary Commands

- `npm run watch`: Run the watch command to track file changes and automatically rebuild the project

- `npm run build`: Builds the app for production to the build folder

- `npm run pack`: Packs the build folder into a zip file under release folder

- `npm run repack`: Repackage the project

- `npm run format`: Formats all the HTML, CSS, JavaScript, TypeScript and JSON files

    


## Upcoming Features
- [ ] UI improvements
- [x] Displaying errors and notifications
- [ ] Support for multiple Chat IDs
- [ ] Adding custom descriptions
- [x] Image grouping
- [ ] Ability to disable automatic tags
