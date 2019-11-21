/**
 * Created by DEV005 on 2017/5/5.
 */
!function (a, b) {
  module.exports = b(a)
  /*  const wx = require('weixin-js-sdk')

   const plugin = {
   install (Vue) {
   Vue.prototype.$wechat = wx
   Vue.wechat = wx
   },
   $wechat: wx
   }

   export default plugin
   export const install = plugin.install*/
}(window, function (a, b) {
  "use strict";
  if (window.WebViewJavascriptBridge) { return }
  var messagingIframe;
  var sendMessageQueue = [];
  var receiveMessageQueue = [];
  var messageHandlers = {};

  var CUSTOM_PROTOCOL_SCHEME = 'wvjbscheme';
  var QUEUE_HAS_MESSAGE = '__WVJB_QUEUE_MESSAGE__';

  var responseCallbacks = {};
  var uniqueId = 1;
  var flag = true;

  function _createQueueReadyIframe(doc) {
    messagingIframe = doc.createElement('iframe');
    messagingIframe.style.display = 'none';
    doc.documentElement.appendChild(messagingIframe);
  }

  function init(messageHandler) {
    if (WebViewJavascriptBridge._messageHandler) {
      throw new Error('WebViewJavascriptBridge.init called twice')
    }
    WebViewJavascriptBridge._messageHandler = messageHandler;
    var receivedMessages = receiveMessageQueue;
    receiveMessageQueue = null;
    for (var i=0; i<receivedMessages.length; i++) {
      _dispatchMessageFromObjC(receivedMessages[i]);
    }
  }

  function send(data, responseCallback) {
    _doSend({ data:data }, responseCallback);
  }

  function registerHandler(handlerName, handler) {
    messageHandlers[handlerName] = handler;
  }

  function callHandler(handlerName, data, responseCallback) {
    _doSend({ handlerName:handlerName, data:data }, responseCallback);
  }

  function _doSend(message, responseCallback) {
    if (responseCallback) {
      var callbackId = 'cb_'+(uniqueId++)+'_'+new Date().getTime();
      responseCallbacks[callbackId] = responseCallback;
      message['callbackId'] = callbackId;
    }
    sendMessageQueue.push(message);
    messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
  }

  function _fetchQueue() {
    var messageQueueString = JSON.stringify(sendMessageQueue);
    sendMessageQueue = [];
    return messageQueueString;
  }

  function _dispatchMessageFromObjC(messageJSON) {
    setTimeout(function _timeoutDispatchMessageFromObjC() {
      var message = JSON.parse(messageJSON);
      var messageHandler;

      if (message.responseId) {
        var responseCallback = responseCallbacks[message.responseId];
        if (!responseCallback) { return; }
        responseCallback(message.responseData);
        delete responseCallbacks[message.responseId];
      } else {
        var responseCallback;
        if (message.callbackId) {
          var callbackResponseId = message.callbackId;
          responseCallback = function(responseData) {
            _doSend({ responseId:callbackResponseId, responseData:responseData });
          }
        }

        var handler = WebViewJavascriptBridge._messageHandler;
        if (message.handlerName) {
          handler = messageHandlers[message.handlerName]
        }

        try {
          handler(message.data, responseCallback)
        } catch(exception) {
          if (typeof console != 'undefined') {
            console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception)
          }
        }
      }
    })
  }

  function _handleMessageFromObjC(messageJSON) {
    if (receiveMessageQueue) {
      receiveMessageQueue.push(messageJSON);
    } else {
      _dispatchMessageFromObjC(messageJSON);
    }
  }

  window.WebViewJavascriptBridge = {
    init: init,
    send: send,
    registerHandler: registerHandler,
    callHandler: callHandler,
    _fetchQueue: _fetchQueue,
    _handleMessageFromObjC: _handleMessageFromObjC
  };

  var doc = document;
  _createQueueReadyIframe(doc);
  var readyEvent = doc.createEvent('Events');
  readyEvent.initEvent('WebViewJavascriptBridgeReady');
  readyEvent.bridge = WebViewJavascriptBridge;
  doc.dispatchEvent(readyEvent);
  var callAppMethod = function(methodName,callback,data){
    if (window.WebViewJavascriptBridge) {
      connectWebViewJavascriptBridge(WebViewJavascriptBridge,methodName,callback)
    } else {
      document.addEventListener('WebViewJavascriptBridgeReady', function() {
        connectWebViewJavascriptBridge(WebViewJavascriptBridge,methodName,callback)
      }, false)
    }
    function connectWebViewJavascriptBridge(bridge,methodName,callback) {
      if(flag){
        bridge.init(function(methodName, callback) {});
        flag = false;
      }
      bridge.callHandler(methodName,data,function(response) {
        callback(response);
      })

    }
  };

  var XnAppNative=function() {
    this.isDebug = false;
    if(this.isDebug == true)
    {
      return;
    }

    //  获取Passport
    this.getPassportId = function (callback) {
      callAppMethod("xn_getPassportId",function(data){
        callback(data);
      });
    };

    this.getLocation = function (callback) {
      callAppMethod("xn_getLocation",function(data){
        callback(data);
      });
    };

    this.setNavbarRight = function (parameter, callback) {
      callAppMethod("xn_setNavbarRight",function(data){
        callback(data);
      }, parameter);
    };
    //隐藏顶部蓝条
    this.hidenBlueTitle = function (callback) {
      callAppMethod("xn_hidenBlueTitle",function(data){
        callback(data);
      });
    };
    //隐藏信号区
    this.autoScrollViewInsets = function (callback) {
      callAppMethod("xn_autoScrollViewInsets",function(data){
        callback(data);
      });
    };

    //导航右侧按钮隐藏
    this.setNavbarRightHide = function (parameter, callback) {
      callAppMethod("xn_setNavbarRightHide",function(data){
        callback(data);
      }, parameter);
    };
    this.getIdentityId = function (callback) {
      callAppMethod("xn_getIdentityId",function(data){
        callback(data);
      });
    };

    this.setNavbarTitle = function (parameter, callback) {
      callAppMethod("xn_setNavbarTitle", function(data){
        callback(data);
      }, parameter);
    };
    this.resetNavbarTitle = function (callback) {
      callAppMethod("xn_resetNavbarTitle",function(data){
        callback(data);
      });
    };
    this.getUnionId = function (callback) {
      callAppMethod("xn_getUnionId",function(data){
        callback(data);
      });
    };
    this.getTenantId = function (callback) {
      callAppMethod("xn_getTenantId",function(data){
        callback(data);
      });
    };
    this.getTenantName = function (callback) {
      callAppMethod("xn_getTenantName",function(data){
        callback(data);
      });
    };
    this.getPhotoOrCamera = function (callback) {
      callAppMethod("xn_getPhotoOrCamera",function(data){
        callback(data);
      });
    };
    this.getUUID = function (callback) {
      callAppMethod("xn_getUUID",function(data){
        callback(data);
      });
    };
    this.getDatePicker = function (callback) {
      callAppMethod("xn_getDatePicker",function(data){
        callback(data);
      });
    };
    this.getTimePicker = function (callback) {
      callAppMethod("xn_getTimePicker",function(data){
        callback(data);
      });
    };
    this.getDateTimePicker = function (callback) {
      callAppMethod("xn_getDateTimePicker",function(data){
        callback(data);
      });
    };
    this.call = function (parameter, callback) {
      console.log(111111111)
      callAppMethod("xn_call", function(data){
        callback(data);
      }, parameter);
    };

    this.message = function (callback) {
      callAppMethod("xn_message",function(data){
        callback(data);
      });
    };

    this.mailto = function (parameter, callback) {
      callAppMethod("xn_mailto",function(data){
        callback(data);
      }, parameter);
    };
    this.tenant = function (parameter,callback) {
      callAppMethod("xn_tenant",function(data){
        callback(data);
      },parameter);
    };
    this.openWaitDialog = function (callback) {
      callAppMethod("xn_openWaitDialog",function(data){
        callback(data);
      });
    };

    this.closeWaitDialog = function (callback) {
      callAppMethod("xn_closeWaitDialog",function(data){
        callback(data);
      });
    };

    this.getUnionName = function (callback) {
      callAppMethod("xn_getUnionName",function(data){
        callback(data);
      });
    };
    this.getDeviceIMEI = function (callback) {
      callAppMethod("xn_getDeviceIMEI",function(data){
        callback(data);
      });
    };

    this.launchApp = function (callback) {
      callAppMethod("xn_launchApp",function(data){
        callback(data);
      });
    };
    this.scan = function (callback) {
      callAppMethod("xn_scan",function(data){
        callback(data);
      });
    };
    this.setNavbarLeftBack = function (callback) {
      callAppMethod("xn_setNavbarLeftBack",function(data){
        callback(data);
      });
    };

    this.setNavbarLeftClose = function (callback) {
      callAppMethod("xn_setNavbarLeftClose",function(data){
        callback(data);
      });
    };

    this.hideNavbar = function (callback) {
      callAppMethod("xn_hideNavbar",function(data){
        callback(data);
      });
    };

    this.getIsExpiredTime = function (callback) {
      callAppMethod("xn_getIsExpiredTime",function(data){
        callback(data);
      });
    };

    this.getMobileCategory = function (callback) {
      callAppMethod("xn_getMobileCategory",function(data){
        callback(data);
      });
    };

    this.getBuddy = function (callback) {
      callAppMethod("xn_getBuddy",function(data){
        callback(data);
      });
    };

    this.setNavbarHide = function (callback) {
      callAppMethod("xn_setNavbarHide",function(data){
        callback(data);
      });
    };

    this.getCallBackState = function (callback) {
      callAppMethod("xn_getCallBackState",function(data){
        callback(data);
      });
    };

    this.setLeftNavbarBack = function (callback) {
      callAppMethod("xn_setLeftNavbarBack",function(data){
        callback(data);
      });
    };

    this.setLeftNavbarClose = function (callback) {
      callAppMethod("xn_setLeftNavbarClose",function(data){
        callback(data);
      });
    };

    this.getDoTenant = function (callback) {//根据承租人选择人员
      callAppMethod("xn_getDoTenant",function(data){
        callback(data);
      });
    };
////////
    this.sendMessageBatchAttach = function (callback) {
      callAppMethod("xn_sendMessageBatchAttach",function(data){
        callback(data);
      });
    };
    this.getHtmlEditText = function (callback) {
      callAppMethod("xn_getHtmlEditText",function(data){
        callback(data);
      });
    };
    this.setNavbarLeftCloseHide = function (callback) {
      callAppMethod("xn_setNavbarLeftCloseHide",function(data){
        callback(data);
      });
    };
    this.share = function (callback) {
      callAppMethod("xn_share",function(data){
        callback(data);
      });
    };
    this.screenshot = function (callback) {
      callAppMethod("xn_screenshot",function(data){
        callback(data);
      });
    };
    this.photoBrowse = function (parameter, callback) {
      callAppMethod("xn_photo_browse",function(data){
        callback(data);
      }, parameter);
    };
  };
  return new XnAppNative();
});
