function Router($stateProvider) {
    $stateProvider.state('search', {
        templateUrl: 'search/search.html',
        controller: 'SearchController',
        controllerAs: 'search',
        url: '/'
    })
}
export default Router;