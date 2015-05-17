# Hivemind Chrome Extension

This is a Chrome extension to add a browser action which fetches technology information about the site in the currently active tab. 

![image](https://s3.amazonaws.com/f.cl.ly/items/3y441y3T3v3w0G3o3U3c/Screen%20Shot%202015-05-16%20at%2023.05.42.png =600x)

## Development

Extension development is very easy as it's essentially HTML, CSS and JS with an additional `manifest.json` which specifies the functionality and permissions required. 

The JS could use improving and making into a prototype. For now, on DOMContent loaded (of the popup), the JS will get the current URL and request site information from `api.askhivemind.com` using the `hivemind-chrome` API key.  

The callback will then render this information in the popup. 

The ordering of technologies is undefined and currently returns in technology group alphabetical order.

No templating library is used at the moment with the thinknig that it would be overkill. 

All technology favicons and country flags are packaged within the extension rather than using the hosted version to minimise lag in loading. 

