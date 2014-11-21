angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise('/home');
})

.run( function run () {
})

.controller('AppCtrl', function AppCtrl($scope, $giphy) {
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if(angular.isDefined( toState.data.pageTitle)) {
            $scope.pageTitle = toState.data.pageTitle + ' | giphyChat' ;
        }
    });

    $scope.result = [];
    $scope.search = function(q) {
        $giphy.search(q).then(function(data) {
            $scope.result = data;
        });
    };
})

.service('$giphy', function($q, $http) {
    var requestApi = function(uri, params) {
        var defer = $q.defer();
        var url = 'http://api.giphy.com/v1/gifs/' + uri;

        params.api_key = 'dc6zaTOxFJmzC';

        $http.get(url, {params: params}).success(function(data, status) {
            if(typeof data == 'object') {
                defer.resolve(data.data);
            } else
                defer.reject(data);
        }).error(defer.reject);

        return defer.promise;
    };

    return {
        search: function(searchTerm, limit, offset, rating) {
            var params = {
                q: searchTerm,
                limit: limit || 100,
                offset: offset || 0,
                rating: rating // Can be: y, g, pg, pg-13, r
            };

            return requestApi('search', params);
        },

        random: function(tag, rating) {
            var params = {
                tag: tag || 'David Hasselhoff',
                rating: rating // Can be: y, g, pg, pg-13, r
            };

            return requestApi('random', params);
        }
    };
})
;
