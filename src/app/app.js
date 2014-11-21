angular.module( 'ngBoilerplate', [
    'templates-app',
    'templates-common',
    'ngBoilerplate.home',
    'ngBoilerplate.about',
    'ui.router',
    'firebase',
    'LocalStorageModule'
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

    $scope.selectedUser = 'stroem';

    // List users
    $scope.isLoggedIn = $users.isLoggedIn;
    $scope.mine = $users.getUserRef().$asObject();
    $scope.users = $users.getUsersRef().$asObject();
    $scope.sendMessage = $users.send;

    $scope.addUser = function(username) {
        $users.login(username);
        $scope.mine = $users.getUserRef().$asObject();
    };

    // Search
    $scope.result = [];
    $scope.search = function(q) {
        $giphy.search(q).then(function(data) {
            $scope.result = data;
        });
    };
})

.service('$users', function($firebase, localStorageService) {
    var ref = new Firebase("https://giphychat.firebaseio.com/users");
    var signedInUser = localStorageService.get('user');

    var service = {
        isLoggedIn: function() {
            return signedInUser != undefined;
        },

        login: function(nickname) {
            localStorageService.set('user', nickname);
            signedInUser = nickname;
            service.add(nickname);
        },

        add: function(nickname) {
            var data = {
                awesome: true
            };

            ref.child(nickname).update(data);
        },

        send: function(nickname, message) {
            var messagesRef = ref.child(nickname).child('messages');
            messagesRef.push(message);
        },

        getUserRef: function(nickname) {
            if(!nickname && !signedInUser) {
                return {
                    '$asObject': function() {},
                    '$asArray': function() {}
                };
            }

            return $firebase(ref.child(nickname || signedInUser));
        },

        getUsersRef: function() {
            return $firebase(ref);
        }
    };

    return service;
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
