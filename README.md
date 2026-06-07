# Open HackUI
[Hack Club](https://hackclub.com)'s free Open WebUI instance, with automatic key insertion from [ai.hackclub.com](https://ai.hackclub.com)!

## how?
Non-exhaustive list of setup steps:
1. Clone the repo (duh) (dw we are not cloning Open WebUI just config and inserther)
2. Run `cp .env.example .env`
3. Fill in these vars:
    - a
    - a
4. Run `docker compose up -d`

Open HackUI should be up and running on `localhost:1927` and the proxy on `localhost:9173`. Deploy both to an domain/url, and make sure to edit `EXTERNAL_PWA_MANIFEST_URL`, `WEBUI_URL` and `PROXY_URL` in `.env` to what you deployed to. (you might need to `docker compose down && docker compose up -d` for the changes to apply!)

## what?
This will sound a bit cunfusing. 
Open WebUI has an admin webhook feature, wich fires when a new user is made. This webhook is configured to inserther. Wehn inserther recieves the webhook, these setps are made: <!-- made? -->
1. We make an JWT (Json Web Token) with the given `userId` and the signing secret that Open HackUI uses.
2. aaaaaaaa
3. It fetches the current user settings (wich is `null` but we dont care) on behalf of the user (with the JWT), and set the direct connections to the nginx proxy and the api key to the api key of step 2. 
4. (when an user is not an verified teen, we dont get an key from ai.hackclub.com and stop there.)

# who?
[ai.hackclub.com](https://ai.hackclub.com) exists, but there is no general ui. A lot of Hack Clubbers made some (including [me](https://github.com/MatthiasLubbertsen/HatGPT)!), but none have all features. I used Open WebUI in the past and it feels super good polished. <!-- crazy scentence, update it -->

After months of DMS with @skyfallwastaken, Open HackUI was born. A free UI for Hack Clubbers, with some more convienence. 

TODO: 
- [ ] make readme from memos
- [x] webmanifest
- [ ] init
- [ ] vars to fill in .env - dont forget url