function SerialService($http) {
    this.search = (text) => {
        return new Promise((resolve, reject) => {
            $http({
                url: '/api/search',
                method: 'GET',
                params: {
                    q: text
                }
            }).then(response => resolve(response.data), error => reject(error));
        });
    }
    this.getSerial = (serial) => {
        return new Promise((resolve, reject) => {
            $http.get(`/api/serial/${serial.seo_url}`).then(response => {
                resolve(response)
            }, error => {
                reject(error);
            })
        })
    }
}
export default SerialService;