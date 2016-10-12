function SearchController(SerialService, $log, $scope) {

    $scope.seachText = '';

    $scope.loading = false;

    function search() {
        $scope.loading = true;
        SerialService.search($scope.searchText).then((response) => {
            $scope.result = response;
            $scope.loading = false;
        }, error => {
            $log.error(error);
            $scope.result = [];
            $scope.loading = false;
        });

    }

    function showSerial(serial) {
        SerialService.getSerial(serial).then(response => {
            $scope.serial = response;
        })
    }

    $scope.search = search;
    $scope.showSerial = showSerial;

}

export default SearchController;