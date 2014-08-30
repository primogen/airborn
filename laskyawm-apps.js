var toggleAppsContainer = document.createElement('div');
toggleAppsContainer.className = 'loaderContainer';
var toggleApps = document.createElement('button');
toggleApps.textContent = 'apps';
toggleApps.addEventListener('click', function(evt) {
	$(apps).toggle();
	evt.stopPropagation();
});
toggleAppsContainer.appendChild(toggleApps);
var toggleAppsLoader = document.createElement('div');
toggleAppsLoader.className = 'loader';
toggleAppsContainer.appendChild(toggleAppsLoader);
document.body.appendChild(toggleAppsContainer);

var apps = document.createElement('div');
apps.className = 'apps';
document.body.appendChild(apps);

loadApps(function(fragment) {
	apps.appendChild(fragment);
});

function loadApps(callback) {
	var fragment = document.createDocumentFragment();
	getFile('/Apps/', {codec: 'dir'}, function(contents) {
		$.each(contents, function(line, attrs) {
			if(line.substr(-9) !== '.history/') {
				var app = document.createElement('div');
				app.className = 'app';
				app.textContent = line.substr(0, line.length - 1);
				app.tabIndex = '0';
				app.addEventListener('click', click);
				app.addEventListener('keypress', function(evt) {
					if(evt.which === 13) {
						click();
						$(apps).hide();
					}
				});
				function click() {
					openWindow('/Apps/' + line, {
						originDiv: $('.window.focused')[0],
						loaderElm: toggleAppsLoader
					});
				}
				fragment.appendChild(app);
			}
		});
		callback(fragment);
	});
}

function reload() {
	loadApps(function(fragment) {
		apps.innerHTML = '';
		apps.appendChild(fragment);
	});
}

listenForFileChanges(function(path, reason) {
	if(path === '/Apps/') reload();
});

document.documentElement.addEventListener('click', function(evt) {
	if(evt.target !== apps) $(apps).hide();
});