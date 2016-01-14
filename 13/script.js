// http://xgrommx.github.io/rx-book/content/how_do_i/angular_with_rxjs.html

// Integration with Scopes

// Get the scope from somewhere
var scope = $rootScope;
scope.name = 'Reactive Extensions';
scope.isLoading = false;
scope.data = [];

// Watch for name change and throttle it for 1 second and then query a service
Rx.Observable.$watch(scope, 'name')
    .throttle(1000)
    .map(e => e.newValue)
    .do(() => {
        // Set loading and reset data
        scope.isLoading = true;
        scope.data = [];
    })
    .flatMapLatest(querySomeService)
    .subscribe(data => {

        // Set the data
        scope.isLoading = false;
        scope.data = data;
    });

// Integration with Deferred/Promise Objects

// Query data
var observable = Rx.Observable.fromPromise($http({
    method: 'GET',
    url: 'someurl',
    params: { searchString: $scope.searchString }
}));

// Subscribe to data and update UI
observable.subscribe(data => $scope.data = data, err => $scope.error = err.message);

// todo: add demo module to index.html