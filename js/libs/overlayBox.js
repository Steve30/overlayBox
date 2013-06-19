(function($) {
    $.fn.extend({
        overlayBox : function(options, htmlData) {
            var self = this;

            this.defaults = {
                layoutId : '',
                closeBtnId : '#overlay-close',
                contentBlockWidth : '500',
                onOverlayLoaded : function(el) {
                    console.info(el);
                },
                onOverlayClosed : function() {
                    console.info('CLOSED OVERLAY');
                }
            };

            this.plugin = {
                el : undefined,
                options : undefined,
                htmlData : undefined,
                onOverlayLoaded : undefined,
                onOverlayClosed : undefined,
                overlayContentClass : undefined,
                contentBlockWidth : undefined,
                zIndexValue : undefined,
                closeBtnId : undefined,
                closeBtnEl : undefined,
                layoutEl : undefined,
                overlayContentEl: undefined,
                dataFromServer: undefined,

                initialize : function() {

                    this.el = $(arguments[0]);
                    this.options = arguments[1];
                    this.htmlData = arguments[2];

                    this.onOverlayLoaded = this.options.onOverlayLoaded;
                    this.onOverlayClosed = this.options.onOverlayClosed;
                    this.overlayContentClass = 'overlay-content';
                    this.contentBlockWidth = this.options.contentBlockWidth;
                    this.zIndexValue = this.options.zIndexValue;
                    this.closeBtnId = this.options.closeBtnId;
                    this.closeBtnEl = undefined;

                    if (this.options.layoutId !== '') {
                        this.layoutEl = $('#' + this.options.layoutId);
                    }


                    if($.isPlainObject(this.htmlData)) {
                        this.dataFromServer = this.htmlData.dataFromServer;
                    };

                    this.displayOverlay();

                },

                displayOverlay : function() {

                    var cssObj;

                    if (this.htmlData !== '' && this.layoutEl === undefined) {
                        cssObj = {
                            width : $(document).width(),
                            height : $(document).height(),
                            zIndex : this.zIndexValue
                        };
                    } else {
                        cssObj = {
                            width : this.layoutEl.width(),
                            height : this.layoutEl.height(),
                            zIndex : this.zIndexValue
                        };
                    }

                    this.el.css(cssObj).fadeIn(this.displayContent());

                },

                displayContent : function() {

                    if (typeof(this.htmlData) === 'string') {
                        this.el.append('<div class=' + this.overlayContentClass + '>' + this.htmlData + '</div>');
                        this.renderContent();
                    } else if (this.dataFromServer !== undefined) {
                        this.getHtmlData();
                    } else {
                        this.renderContent();
                    }

                },

                renderContent: function() {

                    if (this.closeBtnId !== undefined) {
                        this.closeBtnEl = $(this.closeBtnId);
                    }

                    this.addEvents();

                    $.when(this.setCenterContent()).done(this.setCenterDone());
                },

                getHtmlData: function() {
                    var self = this;

                    $.ajax({
                        beforeSend: this.generateLoader(),
                        type : this.dataFromServer.method,
                        dataType: this.dataFromServer.dataType,
                        url: this.dataFromServer.url,
                        pluginObj: this,
                        statusCode: {
                            404: function() {
                                self.error_404();
                            }
                        }
                    }).done(this.ajaxSuccess).fail(this.ajaxError);
                },

                generateLoader: function() {
                    this.el.append('<div class=' + this.overlayContentClass + '><img src=' + this.dataFromServer.loaderIcon + ' alt="" id=' + this.dataFromServer.loaderId + ' /></div>');
                },

                ajaxSuccess: function(msg) {

                    var plugin = this.pluginObj, loadedContentEl,
                        loaderEl = plugin.el.find('#' + plugin.dataFromServer.loaderId);

                    loaderEl.after("<div class='loaded-content serverdata'>" + msg + "</div>");
                    loadedContentEl = plugin.el.find('.loaded-content');

                    plugin.renderContent();

                    loaderEl.fadeOut(function(){
                        $(this).remove();
                        loadedContentEl.fadeIn();
                    })
                },

                ajaxError: function(msg) {
                    console.info(msg);
                },

                error_404: function() {
                    var loaderEl = this.el.find('#' + this.dataFromServer.loaderId);

                    loaderEl.after("<div class='error-content serverdata'>" + this.dataFromServer.error_404_html + "</div>");
                    loadedContentEl = this.el.find('.error-content');

                    this.renderContent();

                    loaderEl.fadeOut(function(){
                        $(this).remove();
                        loadedContentEl.fadeIn();
                    })
                },

                setCenterContent : function() {

                    var top, left, scrollTop, contentHeight,
                        contentEl = this.el.find('.' + this.overlayContentClass);

                    if (typeof(this.htmlData) === 'object' && this.dataFromServer === undefined) {
                        this.overlayContentEl = contentEl.eq(parseInt(this.htmlData.data('overlay-btn-id')) - 1);
                    } else {
                        this.overlayContentEl = contentEl.eq(0);
                    }

                    contentHeight = (this.overlayContentEl.children('.serverdata').size() > 0) ? this.dataFromServer.loadedContentHeight : this.overlayContentEl.height();

                    top = (this.el.height() - contentHeight) / 2;
                    left = (this.el.width() - this.contentBlockWidth) / 2;
                    scrollTop = $(document).scrollTop();

                    if (scrollTop > 0) {
                        top = scrollTop + this.overlayContentEl.height() / 4;
                    }

                    this.overlayContentEl.css({
                        margin : '0 auto',
                        position : 'absolute',
                        top : top,
                        left : left,
                        width : this.contentBlockWidth + 'px'
                    });

                },

                setCenterDone : function() {
                    this.overlayContentEl.css({
                        display: 'block'
                    });

                    this.el.trigger('onOverlayLoaded');
                },

                hideOverlay : function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var pluginObj = e.data.obj;

                    if (e.keyCode === 27 || e.target.id === 'overlay' || e.target.id === pluginObj.closeBtnId.split('#')[1]) {
                        pluginObj.el.fadeOut(function(){
                            pluginObj.animateHideCallback(pluginObj);
                        });
                    }

                },

                animateHideCallback : function(pluginObj) {

                    if (typeof(pluginObj.htmlData) === 'string' || pluginObj.dataFromServer !== undefined) {
                        pluginObj.overlayContentEl.remove();
                    } else {
                        pluginObj.overlayContentEl.css({
                            display: 'none'
                        });
                    }

                    pluginObj.el.css({
                        width : 0,
                        height : 0,
                        zIndex : 0
                    });

                    pluginObj.removeEvents();

                    if ( typeof (pluginObj.onOverlayClosed) === 'function') {
                        pluginObj.onOverlayClosed();
                    }

                },

                runOverlayLoaded : function(e) {
                    var pluginObj = e.data.obj;

                    if ( typeof (pluginObj.onOverlayLoaded) === 'function') {
                        pluginObj.onOverlayLoaded(pluginObj.overlayContentEl);
                    }
                },

                addEvents : function() {

                    if (this.closeBtnEl !== undefined) {
                        this.closeBtnEl.on({
                            'click.overlayEvent' : this.hideOverlay
                        }, {
                            obj: this
                        });
                    }

                    $(window).on({
                        'keydown.overlayEvent' : this.hideOverlay
                    }, {
                        obj: this
                    });

                    this.el.on({
                        'onOverlayLoaded.overlayEvent' : this.runOverlayLoaded,
                        'click.overlayEvent' : this.hideOverlay
                    }, {
                        obj: this
                    });

                },

                removeEvents : function() {
                    var eventName = '.overlayEvent';

                    this.el.off(eventName);
                    $(window).off(eventName);
                    if (this.closeBtnEl.size() > 0) {
                        this.closeBtnEl.off(eventName);
                    }

                }
            }

            this.init = function(opt) {
                $.proxy(self.plugin.initialize(this, opt, htmlData), self.plugin);
            };

            constructor = function() {
                self.options = $.extend(self.defaults, options);
                self.init(self.options);
            }();

        }
    });
})(jQuery);

