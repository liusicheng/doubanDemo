(function() {

    /**
     * doubanApp Module
     *
     * Description
     */
    var doubanApp = angular.module('doubanApp', ['ngRoute', 'doubanApp.detail', 'doubanApp.listModule']);

    //路由  每个模块的路由单独放到子模块中配置
    doubanApp.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        otherwise({
            redirectTo: '/in_theaters'
        })
    }]);
    //定义一个不变的值
    doubanApp.constant('appConfig', {
        listUrl: "https://api.douban.com/v2/movie/",
        detaiUrl: "https://api.douban.com/v2/movie/subject/",
        pageCount: 5
    });

    doubanApp.directive('search', ['JsonpService', '$route', '$routeParams', '$location', '$timeout', function(JsonpService, $route, $routeParams, $location, $timeout) {
        // Runs during compile
        return {
            template: '<form ng-submit="search()" class="navbar-form navbar-right">\
                    <input ng-model="input" type="text" class="form-control" placeholder="Search...">\
                </form>',
            // replace: true,
            link: function($scope, iElm, iAttrs, controller) {
                $scope.search = function() {
                    if ($routeParams.category) {
                        $route.updateParams({ category: 'search', q: $scope.input });
                    } else {
                        $location.path('search');
                        $timeout(function() {
                            $route.updateParams({ category: 'search', q: $scope.input });
                        }, 0)

                        // $location.path('search');
                        // console.log($scope.input)
                        // $routeParams.q = $scope.input;
                    }
                }
            }
        };
    }]);

    doubanApp.directive('page', ['$document', function($document) {
        // Runs during compile
        return {
            replace: true,
            template: '<ul class="pagination"></ul>',
            link: function($scope, iElm, iAttrs, controller) {
                // console.log(iElm)
                // console.log(iAttrs.pageconfig+'1111111111');
                $scope.$watch(iAttrs.pageconfig, function(n) {
                    if (n) {

                        // 当前页
                        var current = n.current; //  1
                        // 共有几页
                        var total = n.total;
                        // 显示几个(单数)
                        var show = n.show; // 5:2 7:3
                        // 1. 根据显示数量算出正常情况当前页的左右各有几个
                        var region = Math.floor(show / 2);
                        
                        // 2. 计算出当前界面上的起始值
                        var begin = current - region; // 可能小于 1
                        begin = begin < 1 ? 1 : begin;
                        var end = begin + show; // end必须小于total
                        if (end > total) {
                            end = total + 1;
                            begin = end - show;
                            begin = begin < 1 ? 1 : begin;
                        }
                        for (var i = begin; i < end; i++) {
                            var liElement = $document[0].createElement('li');
                            liElement.innerHTML = '<a>' + i + '</a>';
                            liElement.i = i;
                            if (i == current) {
                                // 此时是当前页
                                angular.element(liElement).addClass('active');
                            }
                            angular.element(liElement).on('click',function  () {
                                n.click(this.i);
                            })
                            iElm.append(liElement);
                        }

                        // console.log(iElm)
                    }
                });


            }
        };
    }]);



})();
