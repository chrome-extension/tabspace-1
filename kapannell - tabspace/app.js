//Initialize Angular app
var app = angular.module('myApp', []);

// create angular controller
app.controller('createController', function($scope) {
    
  // function to submit the form after all validation has occurred            
  $scope.submitForm = function(event) {

    event.preventDefault();
    alert("Prevent default?");
    return false;
  };

});