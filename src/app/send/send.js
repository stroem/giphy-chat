angular.module( 'ngBoilerplate.send', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'send', {
    url: '/send',
    views: {
      "main": {
        controller: 'SendCtrl',
        templateUrl: 'send/send.tpl.html'
      }
    },
    data:{ pageTitle: 'Send?' }
  });
})

.controller( 'SendCtrl', function AboutCtrl( $scope ) {
  // This is simple a demo for UI Boostrap.

})

;
