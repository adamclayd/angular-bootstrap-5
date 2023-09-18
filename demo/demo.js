let fake = {
    collapse: faker.lorem.paragraph(10)
};

angular.module('app', ['bs5.dom'])

    .controller('MainController', ['$scope', '$bs5DOM', function($scope,  $bs5Modal) {
        $scope.collapse = new (function() {
            this.collapsed = false;
            this.horizontal = false;
            this.content = fake.collapse,
            this.toggle = function()  {
                this.collapsed = !this.collapsed;
            }
        })();

    }]);


