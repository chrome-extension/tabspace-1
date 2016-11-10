//Initialize Angular app
var app = angular.module('myApp', []);

// create angular controller
app.controller('createController', function($scope) {
    
  // function to submit the form after all validation has occurred            
  $scope.submitForm = function(isValid) {

    // check to make sure the form is completely valid
    if (isValid) {
      alert('our form is amazing');
    }

  };

});