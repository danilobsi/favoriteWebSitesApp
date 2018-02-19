var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {


    var localStorageKey = "webSites";
    $scope.webSites = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    UpdateProperties();

    $scope.Add = function(item, category){
        if (!item.name)
            item.name = item.url;
        if (category)
            item.category = category;
        if (item.category)
            item.category = item.category.toLowerCase();
        $scope.webSites.push(item);
        
        UpdateWebSites($scope.webSites);
    }

    $scope.Delete = function(item){
        if (confirm(`Are you sure you want to delete item "${item.name}"`)){
            $scope.webSites = $scope.webSites.filter((site) => {
                return site.url != item.url;
            });
            UpdateWebSites($scope.webSites);
        }
    }

    $scope.DeleteAllIn = function(category){
        if (confirm(`Are you sure you want to delete all items in category "${category}"`)){
            $scope.webSites = $scope.webSites.filter((site) => {
                return site.category != category;
            });
            UpdateWebSites($scope.webSites);
        }
    }
    $scope.UpdateCategory = function (previousName, newName){
        $scope.webSites = $scope.webSites.map((item) => {
            if (item.category == previousName)
                item.category = newName;
            return item;
        });
        UpdateWebSites($scope.webSites);
    }

    function UpdateWebSites(sites){
        UpdateProperties();
        AddToLocalStorage(sites);
    }

    function UpdateProperties(){        
        $scope.categories = groupBy($scope.webSites, "category");
        $scope.categoriesNames = Object.keys($scope.categories);
    }

    function AddToLocalStorage(webSites){
        localStorage.setItem(localStorageKey, JSON.stringify(webSites));
    }

    $scope.Download = function(){
        try{
            let uriContent = "data:application/octet-stream," + encodeURIComponent(JSON.stringify($scope.webSites));
            let newWindow = window.open(uriContent, 'newDocument');
        }
        catch (e) {

        }
    }
});