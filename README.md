### Discord.js Handler TS

## Features

- We currently using MongoDB for databases
- Command list: Help, ping, eval

## Setup

Follow these step to setup the bot:

1. Download and install Node.js (v16.6+) from the official website.

2. Install the required dependencies by running the command:
```
npm install
```

3. Modify the configuration in the `src/config.json` file according to your requirements. 

4. Rename the file `.env.example` to `.env` and provide your secret information in this file.

5. Run the bot:
- Development (requries ts-node on your system):
```
ts-node .
``` 
- Production:
```
npm start
```

The bot will be started.