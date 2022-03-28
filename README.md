# IvoryTower 3

*IvoryTower is a private site for members only. Only friends of existing members are considered for membership.*

## Project status

Welcome! Here's where I'm developing the third version of IvoryTower. I'm trying to balance greater transparency than in the past with my own need to stay motivated and engaged while working on IvoryTower, and for this to be an educational experience for me. Here are some things I ask you to keep in mind:

### What's done?

* The new website (for which you are currently looking at the source code)
* An incomplete, rough API hosted by the old site (the source code for which is *not* visible here)

### What's next?

* Soon: Starting a full project tracker here on GitHub

The long tail of things to do after that is long indeed—it'll take a while. Welcome aboard!

### Project management

For now, I'd prefer it if you could keep suggestions and reports of missing features and the like to a minimum—just stuff that's either an obvious tiny fix like a typo, or stuff that's really blocking you from using the new site like some text being invisible in dark mode, or a legacy feature you really miss. That should help me keep this feeling like a fun, educational side project instead of just work I do after work.

Right now, I'm **not really interested in PRs** unless otherwise requested. I know that it's a little selfish to deny improvements until I address them on my own schedule, but I need that sense of ownership and control for this to be enjoyable. Maybe I'll feel differently someday when I'm not working a full-time job on other peoples' stuff.

Don't try to build anything on top of the new IvoryTower API or SDK. I'm still making lots of **breaking changes** and not versioning anything. I might entirely replace the SDK with AutoRest or something similar before I consider it "v1". That's something I'll probably be wanting feedback on.

Right now my issue tracker is just a private page in OneNote with no explanations for anything. I'll transfer that over to GitHub Issues at some point when the list isn't so long, but right now this is really convenient and fast for me. (Keeping the issues list private for now also helps obscure the fact that I'm often just kind of cherry-picking whatever feels fun at the moment.)

---

## Dev environment setup

If you feel like trying things out locally, you'll need the latest stable versions of these:

1. [Visual Studio Code](https://code.visualstudio.com)
2. [Node](https://nodejs.org/en/)

## Choosing your API endpoint

By default, the site will use the live IvoryTower API at `api.ivorytower.com`. That won't work when hosting this site from http://localhost due to browser security rules. Instead, you can code against a dummy API that serves static JSON from `src/routes/api/v1`:

1. Create a file at the root of this repo called `.env.local`
2. Add this line:
	```
	VITE_API_SERVER=http://localhost
	```

`.env.local` is ignored by Git, and overrides variables in `.env` which *is* in source control.

## Starting the site

Once you've changed your API endpoint, run the site locally with these two handy commands. 

1. `npm install`
2. `npm start`

---

IvoryTower 3 © 2021-2022 Travis Spomer, All Rights Reserved.
