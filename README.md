# IvoryTower 3

*IvoryTower is a private site for members only. Only friends of existing members are considered for membership.*

## Project status

Welcome! Here's where I'm developing the third version of IvoryTower. I'm trying to balance greater transparency than in the past with my own need to stay motivated and engaged while working on IvoryTower, and for this to be an educational experience for me.

Check out the [IvoryTower project board](https://github.com/users/TravisSpomer/projects/1) if you're curious what I plan on doing and approximately in what order.

### Project management

For now, I'd prefer it if you could keep suggestions and reports of missing features and the like to a minimum—just stuff that's either an obvious tiny fix like a typo, or stuff that's really blocking you from using the new site like some text being invisible in dark mode, or a legacy feature you really miss. That should help me keep this feeling like a fun, educational side project instead of just work I do after work. You can post bug reports in the IvoryTower Suggestion Box thread.

Right now, I'm **not really interested in PRs** unless otherwise requested. I know that it's a little selfish to deny improvements until I address them on my own schedule, but I need that sense of ownership and control for this to be enjoyable. Maybe I'll feel differently someday when I'm not working a full-time job on other peoples' stuff.

Don't try to build anything on top of the new IvoryTower API or SDK. I'm still making lots of **breaking changes** and not versioning anything. I might entirely replace the SDK with an automatically-generated one before I consider it "v1". That's something I'll probably be wanting feedback on.

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

<!-- This should work once there's an /api folder at the root. -->
<!--
### Debugging in Visual Studio Code

To set up debugging in Visual Studio Code:

1. Install the [Azure Static Web Apps extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)
2. Open the Run and Debug panel (View > Run)
3. From the dropdown at the top, choose "Debug in Edge with API"

Then, you can press F5 or otherwise start debugging normally.
-->

---

IvoryTower 3 © 2021-2022 Travis Spomer, All Rights Reserved.
