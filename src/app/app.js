angular.module( 'ngBoilerplate', [
    'templates-app',
    'templates-common',
    'ngBoilerplate.home',
    'ngBoilerplate.about',
    'ui.router',
    'firebase'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
    $urlRouterProvider.otherwise('/home');
})

.run( function run () {
    // THSI IS EMPTY
})

.controller('AppCtrl', function AppCtrl($scope, $giphy, $users, $firebase) {
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if(angular.isDefined( toState.data.pageTitle)) {
            $scope.pageTitle = toState.data.pageTitle + ' | giphyChat' ;
        }
    });

    $scope.loggedIn = false

    $scope.addUser = function (username) {
        $users.add(username);
        $scope.loggedIn = true;
    }

    // List users
    var ref = new Firebase("https://giphychat.firebaseio.com/");
    var sync = $firebase(ref);
    $scope.users = sync.$asObject();

    var ref2 = new Firebase("https://giphychat.firebaseio.com/stroem");
    var sync2 = $firebase(ref2);
    $scope.mine = sync2.$asObject();

    // Search
    $scope.result = [];
    $scope.search = function(q) {
        $giphy.search(q).then(function(data) {
            $scope.result = data;
        });
    };
})

.service('$users', function($firebase) {
    var ref = new Firebase("https://giphychat.firebaseio.com/");
    var child = ref.child('users');

    return {
        add: function(nickname) {
            var data = {};
            data[nickname] = {
                messages: [],
                awesome: true
            };

            child.update(data);
        },

        send: function(nickname, message) {

        },

        user: function(nickname) {

        }
    }
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
                limit: limit || 10,
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
