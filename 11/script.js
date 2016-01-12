// http://xgrommx.github.io/rx-book/content/how_do_i/existing_api.html
/* For testing example you can use
https://chrome.google.com/webstore/detail/change-geolocation/njjpmclekpigefnogajiknnheheacoaj/related?hl=en
chrome extension
*/

var watchId;

function watchPositionChanged(position) {
  // Do something with the coordinates
  document.querySelector('#location').innerHTML = `${position.coords.latitude}, ${position.coords.longitude}`;
  console.log('watchPositionChanged', position);
}

function watchPositionError(e) {
  var message = '';
  switch (err.code) {
    case err.PERMISSION_DENIED:
      message = 'Permission denied';
      break;
    case err.POSITION_UNAVAILABLE:
      message = 'Position unavailable';
      break;
    case err.PERMISSION_DENIED_TIMEOUT:
      message = 'Position timeout';
      break;
  }
  console.log('watchPositionError: ' + message, e);
}

function watchPosition(geolocationOptions) {
  return Rx.Observable.create(observer => {
    watchId = window.navigator.geolocation.watchPosition(
      function successHandler (loc) {
        observer.onNext(loc);
      },
      function errorHandler (err) {
        observer.onError(err);
      },
      geolocationOptions);

    return () => {
      window.navigator.geolocation.clearWatch(watchId);
    };
  }).publish().refCount();
}

var source = watchPosition();

var subscription = source.subscribe(
  watchPositionChanged,
  watchPositionError,
  () => console.log('Completed')
);

var stopWatching = document.querySelector('#stopWatching');
stopWatching.addEventListener('click', stopWatchingClicked, false);

// Clear watching upon click
function stopWatchingClicked(e) {
  console.log('stopWatchingClicked', watchId);
  navigator.geolocation.clearWatch(watchId);
  document.querySelector('#stopWatching').remove();
}