(function() {

    /**
     * hotModule Module
     *
     * Description
     */
    var listModule = angular.module('doubanApp.listModule', ['toubanApp.service']);
    listModule.config(['$routeProvider', function($routeProvider) {

        $routeProvider.when('/:category/:page?', {
            templateUrl: 'list/list.html',
            controller: 'ListController'
        })
    }]);

    listModule.controller('ListController', ['$timeout', '$scope', '$http', 'JsonpService', '$routeParams', '$route', '$rootScope', 'appConfig', function($timeout, $scope, $http, JsonpService, $routeParams, $route, $rootScope, appConfig) {

        //给根作用域设置当前的分类信息,控制左侧三个分类按钮的选中
        // index.html中的数据不属于ListController的 $scope 管理,所有只能加到$rootScope上
        $rootScope.category = $routeParams.category;

        // $rootScope.search = function  () {
        //     // console.log($rootScope.input);
        //     // 如果路由表中没有配置 q 参数,则会自动加到?后
        //     $route.updateParams({category:'search',q:$rootScope.input});
        // }

        var count = appConfig.pageCount;
        //得到当前的页码
        var currentPage = parseInt($routeParams.page || 1);
        $scope.currentPage = currentPage;

        //从第几条开始请求
        var start = (currentPage - 1) * count;

        //跨域请求豆瓣数据
        JsonpService.jsonp(appConfig.listUrl + $routeParams.category, { count: count, start: start, q: $routeParams.q }, function(res) {
            console.log(res);
            $scope.subjects = res.subjects;

            //数据的总条数
            $scope.total = res.total;

            $scope.title = res.title;

            //共有几页
            $scope.totalPage = Math.ceil($scope.total / count);
            $scope.config = {
                "show": 5,
                "current": currentPage,
                "total": $scope.totalPage,
                click: function(index) {
                    index = Math.min(Math.max(index, 1), $scope.totalPage);
                    console.log(index)
                        //更改路由的参数,控制分页,需要用到$route
                    $route.updateParams({ page: index })
                    $route.reload();
                }
            };

            //告诉 angular 刷新界面上的数据
            $scope.$apply();

            //分页   3
            $scope.hundlePage = function(page) {

                // if (page < 1 || page > $scope.totalPage) {
                //     return;
                // }
                /*
                if (page > 8) {
                    page = 8;
                }
                if (page < 1) {
                    page = 1;
                }
                */
                page = Math.min(Math.max(page, 1), $scope.totalPage);

                //更改路由的参数,控制分页,需要用到$route
                $route.updateParams({ page: page })
            }
        });

        /*
        setTimeout(function() {
            $scope.name = 'zhangsan';
            //告诉 angular 刷新界面上的数据
            $scope.$apply();
        }, 3000)

        //angular 会自动同步界面上的数据
        $timeout(function() {
            $scope.name = 'zhangsan';
        }, 3000);
        */
    }])

})()
