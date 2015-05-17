/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 **/
function getCurrentTabUrl(callback) {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];

        callback(tab.url);
    });
}

/**
 * @param {string} url - Url to search Hivemind for
 * @param {function(string,object)} callback - Called when site result has
 *   been found. The callback gets the domain and response object.
 * @param {function(string)} errorCallback - Called when the site is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getSiteDataFromHivemind(url, callback, errorCallback) {

    var domain = url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
    var x = new XMLHttpRequest();

    x.open('GET', 'http://api.askhivemind.com/sites/' + domain);
    x.setRequestHeader("Authorization", "hivemind-chrome");
    x.responseType = 'json';
    
    x.onload = function() {

        if(x.response.error && x.response.error.message ) {
            errorCallback(x.response.error.message);
        }
    
        if (!x.response || !x.response.data) {
            errorCallback('No information found.');
            return;
        }

        callback(url, x.response.data);
    };

    x.onerror = function() {
        errorCallback('Error retrieving information from Hivemind');
    };

    x.send();
}

function renderStatus(statusText) {
  document.querySelector('.status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {

    renderStatus('Searching Hivemind for ' + url);

    getSiteDataFromHivemind(url, function(domain, result) {

        renderStatus('');
        var results = document.querySelector('.results');

        var html = " \
            <div class='summary'> \
                <h2>" + result.domain + "</h2> \
            </div> \
            <h3>Technologies</h3> \
            <ul class='technologies'>";

            var c = result.technologies.length;
            for (var i = 0; i < c; i++) {
                var tech = result.technologies[i];
                html += " \
                    <li> \
                        <a class='tech-link' href='" + tech.link + "'> \
                            <img class='favicon' src='images/favicons/" + tech.code + "-favicon.ico' width='16' height='16' /> \
                        </a> \
                        <a class='tech-link' href='" + tech.link + "'> \
                        <span class='label'>" + tech.label + "</label> \
                        </a> \
                    </li>";
            }

        html += "</ul> \
            <h3>Hosted by</h3> \
            <p><img class='flag' src='images/flags/" + result.country + "_2x.png' width='16' height='16' />" + result.asn + "</p> \
        ";

        results.innerHTML = html;

    }, function(errorMessage) {
        renderStatus(errorMessage);
    });
  });
});