# Required tools for running the API locally

**Important:** The API in this folder is not fully-featured enough yet to replace the original mock API. As in, *doing this will not work*.

Run these from an admin command prompt:

* To upgrade to NPM v7:
	* Windows: `npx npm-windows-upgrade`
	* Other OS: `npm update -g npm`
* `npm install -g @azure/static-web-apps-cli`
* `npm install -g azure-functions-core-tools@3 --unsafe-perm true`

Optionally:

* [Visual Studio](https://visualstudio.microsoft.com/)

Once those dependencies are installed, do one of the following to start the site instead of `npm start`.

If you don't plan on changing the API code:
* `npm run startwithapi`

If you do plan on changing the API code:
* Open [api.csproj](api.csproj) in Visual Studio
* Press F5 to start
* `npm run startwithvs`
