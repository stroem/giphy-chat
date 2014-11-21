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

    // List users
    $scope.isLoggedIn = false;
    $scope.mine = {};
    $scope.users = $users.getUsersRef().$asObject();
    $scope.sendMessage = $users.send;

    $scope.addUser = function(username) {
        $users.add(username);
        $scope.mine = $users.getUserRef().$asObject();
        $scope.isLoggedIn = true;
    };

    // Search
    $scope.result = [];
    $scope.search = function(q) {
        $giphy.search(q).then(function(data) {
            $scope.result = data;
        });
    };
})

.service('$users', function($firebase) {
    var ref = new Firebase("https://giphychat.firebaseio.com/users");
    var addedUser = undefined;

    return {
        add: function(nickname) {
            var data = {};
            data[nickname] = {
                awesome: true
            };

            ref.update(data);
            addedUser = nickname;
        },

        send: function(nickname, message) {
            var messagesRef = ref.child(nickname).child('messages');
            messagesRef.push(message);
        },

        getUserRef: function(nickname) {
            return $firebase(ref.child(nickname || addedUser));
        },

        getUsersRef: function() {
            return $firebase(ref);
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
