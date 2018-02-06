var ROOT_URL = 'http://wskj020.com:89';

angular.module('starter.services', [])

.factory('Login', function ($http, $q, Storage) {
    var user = Storage.getUser();

    return {
        update: function (currUser) {
            var deferred = $q.defer();
            $http({
                method: 'JSONP',
                url: '/App/UserEdit.ashx?callback=JSON_CALLBACK',
                params: currUser,
            })
            .success(function (data) {
                if (data) {
                    if (data.success) {
                        user = currUser;
                        Storage.setUser(currUser);
                        deferred.resolve(data);
                    } else {
                        deferred.reject(data.message);
                    }
                } else {
                    deferred.reject('访问服务器错误');
                }
            }).error(function () {
                deferred.reject('访问服务器错误');
            });
            return deferred.promise;
        },

        login: function (loginCode, loginPwd) {
            var deferred = $q.defer();
            $http({
                method: 'JSONP',
                url: '/App/UserLogin.ashx?callback=JSON_CALLBACK',
                params: {
                    loginCode: loginCode,
                    loginPwd: loginPwd,
                },
            })
            .success(function (data, status, header, config) {
                if (data) {
                    if (data.success) {
                        user = data.item;
                        Storage.setUser(user);

                        deferred.resolve(data);
                    } else {
                        deferred.reject(data.message);
                    }
                } else {
                    deferred.reject('访问服务器错误');
                }
            }).error(function () {
                deferred.reject('访问服务器错误');
            });
            return deferred.promise;
        },

        logout: function () {
            user = null;
            Storage.removeUser();
        },

        getUser: function () {
            return user;
        },

        getUserId: function () {
            return user ? user.id : '';
        },

        getUserName: function () {
            return user ? user.name : '';
        },

        changeName: function (name) {
            if (user != null) {
                user.name = name;
                Storage.setUser(user);
                this.update(user);
            }
        },

        changeRemark: function (remark) {
            if (user != null) {
                user.remark = remark;
                Storage.setUser(user);
                this.update(user);
            }
        }
    };
})

.factory('SignService', function ($http, $q, Utils, Login) {

    var months = [];
    var monthMap = {};
    var billMap = {};
    var lastTime = 0;
    var hasMore = true;

    function replaceBill(bill) {
        var exists = billMap[bill.id];
        billMap[bill.id] = bill;

        var billMonth = bill.date.substr(0, 7);
        var month = monthMap[billMonth];
        if (month) {
            if (exists) {
                for (var j = 0, len = month.bills.length; j < len; ++j) {
                    if (month.bills[j].id == bill.id) {
                        month.bills.splice(j, 1, bill);
                        break;
                    }
                }
            } else {
                month.bills.push(bill);
            }
            /*
            month.bills.sort(function (bill1, bill2) {
                return bill1.inTime > bill2.inTime ? -1 : 1;
            });*/
        } else {
            month = {
                month: billMonth,
                bills: [bill],
            };
            months.push(month);
            monthMap[billMonth] = month;
        }
    }

    return {
        load: function () {
            var deferred = $q.defer();
            $http({
                method: 'JSONP',
                url: '/App/SignLoad.ashx?callback=JSON_CALLBACK',
                params: {
                    userId: Login.getUserId(),
                },
            })
            .success(function (data) {
                if (data) {
                    if (data.success) {
                        deferred.resolve(data);
                    } else {
                        deferred.reject(data.message);
                    }
                } else {
                    deferred.reject('访问服务器错误');
                }
            }).error(function () {
                deferred.reject('访问服务器错误');
            });
            return deferred.promise;
        },

        sign: function (bill) {
            var deferred = $q.defer();
            $http({
                method: 'JSONP',
                url: '/App/SignSave.ashx?callback=JSON_CALLBACK',
                params: {
                    userId: Login.getUserId(),
                    submitDistance: bill.submitDistance,
                },
            })
            .success(function (data, status, header, config) {
                if (data) {
                    if (data.success) {
                        replaceBill(data.item);
                        deferred.resolve(data);
                    } else {
                        deferred.reject(data.message);
                    }
                } else {
                    deferred.reject('访问服务器错误');
                }
            }).error(function () {
                deferred.reject('访问服务器错误');
            });
            return deferred.promise;
        },

        loadMore: function (refresh) {
            if (refresh) {
                lastTime = 0;
            }
            var deferred = $q.defer();
            $http({
                method: 'JSONP',
                url: '/App/SignMore.ashx?callback=JSON_CALLBACK',
                params: {
                    time: lastTime,
                    userId: Login.getUserId(),
                },
            })
            .success(function (data, status, header, config) {
                if (data) {
                    if (data.success) {
                        if (refresh) {
                            months.length = 0;
                            billMap = {};
                            monthMap = {};
                        }
                        var list = data.list;
                        for (var i = 0, len = list.length; i < len; ++i) {
                            var bill = list[i];
                            if (billMap[bill.id]) {
                                continue;
                            }
                            billMap[bill.id] = bill;

                            var billMonth = bill.date.substr(0, 7);
                            var month = monthMap[billMonth];
                            if (month) {
                                month.bills.push(bill);
                            } else {
                                month = {
                                    month: billMonth,
                                    bills: [bill],
                                };
                                months.push(month);
                                monthMap[billMonth] = month;
                            }
                        }

                        lastTime = data.lastTime;
                        hasMore = list.length >= 50;
                        deferred.resolve(data);
                    } else {
                        deferred.reject(data.message);
                    }
                } else {
                    deferred.reject('访问服务器错误');
                }
            }).error(function () {
                deferred.reject('访问服务器错误');
            });
            return deferred.promise;
        },

        clear: function () {
            months.length = 0;
            monthMap = {};
            billMap = {};
            lastTime = 0;
            hasMore = true;
        },

        isHasMore: function () {
            return hasMore;
        },

        getMonths: function () {
            return months;
        },

        getSign: function (signId) {
            return billMap[signId];
        }

    };
})

.factory('DeliveryService', function ($http, $q, Login) {

    var months = [];
    var monthMap = {};
    var billMap = {};
    var lastTime = '';
    var hasMore = true;
    
    function replaceBill(bill) {
        var exists = billMap[bill.id];
        billMap[bill.id] = bill;

        var billMonth = bill.dateTime.substr(0, 7);
        var month = monthMap[billMonth];
        if (month) {
            if (exists) {
                for (var j = 0, len = month.bills.length; j < len; ++j) {
                    if (month.bills[j].id == bill.id) {
                        month.bills.splice(j, 1, bill);
                        break;
                    }
                }
            } else {
                month.bills.push(bill);
            }
            /*
            month.bills.sort(function (bill1, bill2) {
                        return bill1.dateTime > bill2.dateTime ? -1 : 1;
            });*/
        } else {
            month = {
                month: billMonth,
                bills: [bill],
            };
            months.push(month);
            monthMap[billMonth] = month;
        }
    }

    function removeBill(bill) {
        delete billMap[bill.id];

        var billMonth = bill.dateTime.substr(0, 7);
        var month = monthMap[billMonth];
        if (!month) {
            return;
        }

        for (var j = 0, len = month.bills.length; j < len; ++j) {
            if (month.bills[j].id == bill.id) {
                month.bills.splice(j, 1);
                if (month.bills.length <= 0) {
                    var index = months.indexOf(month);
                    if (index >= 0) {
                        months.splice(index, 1);
                    }
                    delete monthMap[billMonth];
                }
                return;
            }
        }
    }

    return {
        loadMore: function (refresh) {
            if (refresh) {
                lastTime = '';
            }
            var deferred = $q.defer();
            $http({
                method: 'JSONP',
                url: '/App/DeliveriesLoad.ashx?callback=JSON_CALLBACK',
                params: {
                    time: lastTime,
                    userId: Login.getUserId(),
                },
            })
            .success(function (data, status, header, config) {
                if (data) {
                    if (data.success) {
                        if (refresh) {
                            months.length = 0;
                            billMap = {};
                            monthMap = {};
                        }
                        var list = data.list;
                        for (var i = 0, len = list.length; i < len; ++i) {
                            var bill = list[i];
                            if (billMap[bill.id]) {
                                continue;
                            }
                            billMap[bill.id] = bill;

                            var billMonth = bill.dateTime.substr(0, 7);
                            var month = monthMap[billMonth];
                            if (month) {
                                month.bills.push(bill);
                            } else {
                                month = {
                                    month: billMonth,
                                    bills: [bill],
                                };
                                months.push(month);
                                monthMap[billMonth] = month;
                            }
                        }

                        lastTime = data.lastTime;
                        hasMore = list.length >= 50;
                        deferred.resolve(data);
                    } else {
                        deferred.reject(data.message);
                    }
                } else {
                    deferred.reject('访问服务器错误');
                }
            }).error(function () {
                deferred.reject('访问服务器错误');
            });
            return deferred.promise;
        },

        save: function (bill) {
            var deferred = $q.defer();
            $http({
                method: 'JSONP',
                url: '/App/DeliverySave.ashx?callback=JSON_CALLBACK',
                params: bill,
            })
            .success(function (data, status, header, config) {
                if (data) {
                    if (data.success) {
                        replaceBill(bill);
                        deferred.resolve(data);
                    } else {
                        deferred.reject(data.message);
                    }
                } else {
                    deferred.reject('访问服务器错误');
                }
            }).error(function () {
                deferred.reject('访问服务器错误');
            });
            return deferred.promise;
        },

        remove: function (bill) {
            var deferred = $q.defer();
            $http({
                method: 'JSONP',
                url: '/App/DeliveryRemove.ashx?callback=JSON_CALLBACK',
                params: {
                    billId: bill.id,
                },
            })
            .success(function (data, status, header, config) {
                if (data) {
                    if (data.success) {
                        removeBill(bill);
                        deferred.resolve(data);
                    } else {
                        deferred.reject(data.message);
                    }
                } else {
                    deferred.reject('访问服务器错误');
                }
            }).error(function () {
                deferred.reject('访问服务器错误');
            });
            return deferred.promise;
        },

        clear: function () {
            months.length = 0;
            monthMap = {};
            billMap = {};
            lastTime = '';
            hasMore = true;
        },

        isHasMore: function () {
            return hasMore;
        },

        getMonths: function () {
            return months;
        },
        
        getBill: function (billId) {
            return billMap[billId];
        }

    };
})

.factory('LocationService', function ($http, $q, Login) {

    var months = [];
    var monthMap = {};
    var hasMore = true;
    var lastDate = '';

    return {
        loadMore: function (refresh) {
            if (refresh) {
                lastDate = '';                
            }
            var deferred = $q.defer();
            $http({
                method: 'JSONP',
                url: '/App/LocationsLoad.ashx?callback=JSON_CALLBACK',
                params: {
                    date: lastDate,
                    userId: Login.getUserId(),
                },
            })
            .success(function (data, status, header, config) {
                if (data) {
                    if (data.success) {
                        if (refresh) {
                            months.length = 0;
                            monthMap = {};
                        }
                        var list = data.list;
                        for (var i = 0, len = list.length; i < len; ++i) {
                            var date = list[i];
                            lastDate = date;

                            var billMonth = date.substr(0, 7);
                            var month = monthMap[billMonth];
                            if (month) {
                                month.bills.push(date);
                            } else {
                                month = {
                                    month: billMonth,
                                    bills: [date],
                                };
                                months.push(month);
                                monthMap[billMonth] = month;
                            }
                        }

                        hasMore = list.length >= 50;
                        deferred.resolve(data);
                    } else {
                        deferred.reject(data.message);
                    }
                } else {
                    deferred.reject('访问服务器错误');
                }
            }).error(function () {
                deferred.reject('访问服务器错误');
            });
            return deferred.promise;
        },

        clear: function () {
            months.length = 0;
            monthMap = {};
            hasMore = true;
        },

        isHasMore: function () {
            return hasMore;
        },

        getMonths: function () {
            return months;
        }

    };
})

.factory('Users', function ($http, $q, $timeout) {
    var users = [];
    var userMap = {};
    var codeMap = {};

    function doLoad() {
        $http({
            method: 'JSONP',
            url: '/App/SalersLoad.ashx?callback=JSON_CALLBACK',
        })
        .success(function (data, status, header, config) {
            if (data && data.success) {
                users.length = 0;
                var list = data.list;
                for (var i = 0, len = list.length; i < len; ++i) {
                    var user = list[i];
                    users.push(user);
                    userMap[user.id] = user;
                    if (user.barcode) {
                        codeMap[user.barcode] = user;
                    }
                }
            } else {
                $timeout(function () {
                    doLoad();
                }, 5000);
            }
        }).error(function () {
            $timeout(function () {
                doLoad();
            }, 5000);
        });
    }

    return {
        load: function () {
            doLoad();
        },

        addUserNotExists: function (user) {
            var exists = userMap[user.id];
            if (!exists) {
                userMap[user.id] = user;
            }
        },

        getUser: function (userId) {
            return userMap[userId];
        },

        getUserByCode: function (code) {
            return codeMap[code];
        }

    };
})

.factory('DaemonService', function ($http, $q, $timeout, Login, Users) {

    function doInit() {
        Users.load();

        $http({
            method: 'JSONP',
            url: '/App/ParamLoad.ashx?callback=JSON_CALLBACK',
            params: {
                url: location.href.split('#')[0]
            }
        })
        .success(function (data, status, header, config) {
            if (data.success) {
                wxConfig(data.item);
            } else {
                alert(data.message);
                $timeout(function () {
                    doInit();
                }, 5000);
            }
        })
        .error(function () {
            $timeout(function () {
                doInit();
            }, 5000);
        });
    }

    function wxConfig(param) {
        wx.config({
            debug: false,
            appId: param.appId,
            timestamp: param.timestamp,
            nonceStr: param.nonceStr,
            signature: param.signature,
            jsApiList: [
                'openLocation',
                'getLocation',
                'scanQRCode',
            ]
        });

        wx.ready(function () {
            uploadLocation();
        });
    }

    function uploadLocation() {
        var userId = Login.getUserId();
        if (!userId) {
            reUpload();
            return;
        }

        wx.getLocation({
            type: 'wgs84',
            success: function (res) {

                $http({
                    method: 'JSONP',
                    url: '/App/LocationUpload.ashx?callback=JSON_CALLBACK',
                    params: {
                        userId: userId,
                        latitude: res.latitude,
                        longitude: res.longitude,
                    }
                })
                .success(function (data, status, header, config) {
                    reUpload();
                })
                .error(function () {
                    reUpload();
                });

            },
            fail: function (res) {
                if (res.errMsg.indexOf('function not exist') > -1) {
                    alert('微信版本过低请升级');
                } else {
                    reUpload();
                }
            }
        });

        function reUpload() {
            $timeout(function () {
                uploadLocation();
            }, 5000);
        }
    }

    return {

        init: function () {
            doInit();
        },

    };
})

.factory('Storage', function () {
    return {
        getUser: function () {
            return this.get('user');
        },

        setUser: function (user) {
            return this.update('user', user);
        },

        removeUser: function () {
            return this.remove('user');
        },

        get: function (key, defaultValue) {
            var stored = localStorage.getItem(key);
            try {
                stored = angular.fromJson(stored);
            } catch (error) {
                stored = null;
            }
            if (defaultValue && stored === null) {
                stored = defaultValue;
            }
            return stored;
        },

        update: function (key, value) {
            if (value) {
                localStorage.setItem(key, angular.toJson(value));
            }
        },

        remove: function (key) {
            localStorage.removeItem(key);
        }
    };
})

.factory('Utils', function () {
    return {
        guid: function () {
            function _p8(s) {
                var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
            }
            return _p8() + _p8(true) + _p8(true) + _p8();
        },

        copy: function (item) {
            try {
                return angular.fromJson(angular.toJson(item));
            } catch (error) {
                return null;
            }
        },

        getUrlParam: function (name) {
            var args = this.getUrlParams();
            return args[name];
        },

        getUrlParams: function () {
            var args = new Object();
            var query = location.search.substring(1); //获取查询串   
            var pairs = query.split("&"); //在逗号处断开   
            for (var i = 0; i < pairs.length; i++) {
                var pos = pairs[i].indexOf('='); //查找name=value   
                if (pos == -1) continue; //如果没有找到就跳过   
                var argname = pairs[i].substring(0, pos); //提取name   
                var value = pairs[i].substring(pos + 1); //提取value   
                args[argname] = unescape(value); //存为属性   
            }
            return args;
        },

        setUrlParam: function (name, value) {
            var url = window.location.href;
            var newUrl = "";

            var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
            var tmp = name + "=" + value;
            if (url.match(reg) != null) {
                newUrl = url.replace(eval(reg), tmp);
            } else {
                if (url.match("[\?]")) {
                    newUrl = url + "&" + tmp;
                } else {
                    newUrl = url + "?" + tmp;
                }
            }

            location.href = newUrl;
        },

        updateUrlParam: function (url, name, value) {
            var newUrl = "";

            var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
            var tmp = name + "=" + value;
            if (url.match(reg) != null) {
                newUrl = url.replace(eval(reg), tmp);
            } else {
                var index = url.indexOf('?');
                if (index >= 0) {
                    newUrl = url.substring(0, index + 1) + tmp + '&' + url.substring(index + 1);
                } else {
                    newUrl = url + "?" + tmp;
                }
            }

            return newUrl;
        },

        parseUrl: function (url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {},
                    seg = a.search.replace(/^\?/, '').split('&'),
                    len = seg.length, i = 0, s;
                    for (; i < len; i++) {
                        if (!seg[i]) { continue; }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        }

    };
})
;