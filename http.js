(function() {

    /**
     * toubanApp.service Module
     *
     * Description
     */
    var serviceModule = angular.module('toubanApp.service', []);
    serviceModule.service('JsonpService', ['$window',function($window) {

        this.jsonp = function (url, params, fn) {
        	
            var queryString = '?';
            //1.拼接参数
            for (key in params) {
                queryString += key + '=' + params[key] + '&&';
            }

            //生成函数名 my_callback1475029690057
            var funName = 'my_callback' + new Date().getTime();
            queryString += 'callback' + '=' + funName;

            //挂载函数
            $window[funName] = function(res) {
            	console.log('请求成功');
                fn(res);

                //删除之前添加的script标签
                $window.document.body.removeChild(script);
            };

            //要向页面添加 script 标签
            var script = $window.document.createElement('script');
            script.src = url + queryString;
            $window.document.body.appendChild(script);
        }
    }])

})();
