/**
 * Chrome extensions don't seem to have `String.prototype.startsWith`.
 */
if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(searchString, position) {
      position = position || 0;
      return this.lastIndexOf(searchString, position) === position;
    }
  });
}

/**
 * Fetch the favicon from Google.
 */
var favicon = function(bookmark) {
	var parser =  document.createElement('a');
	parser.href = bookmark.url;
	return '<img src="http://www.google.com/s2/favicons?domain=' + parser.hostname + '">';
};

/**
 * Print the list item if it's a web address. 
 *
 * Bookmarklets, `javascript:` & and `chrome://` don't work well here. It's a permissions problem.
 */
var listItem = function(bookmark) {
	if (bookmark.url.startsWith('http')) {
		return '<li><a href="' + bookmark.url + '">' + favicon(bookmark) + bookmark.title + '</a></li>';
	} 
	return '';
};

/**
 * Make the iframe full window height.
 */
var resizeIframe = function () {
	var iframeHeight = window.innerHeight - document.getElementById('bookmarks').offsetHeight - 2; // why 2, huh?
	document.getElementById('etz').style.height = iframeHeight + 'px';	
};


/**
 * Loading bookmarks works best on page load.
 */
window.onload = function () {
	var ulBookmarks = document.getElementById('bookmarks');
	var items = '';
	chrome.bookmarks.getChildren('1', function(children) {
		children.forEach(function(bookmark) { 
			items = items + listItem(bookmark);
		});
		ulBookmarks.innerHTML = items;
	});	
	resizeIframe();
}