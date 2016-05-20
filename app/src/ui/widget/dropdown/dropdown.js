/**
 * Created by caiw on 7/4/2015.
 */
/*
 how to use:
 CDropDown.create($("<li></li>")[0], {
     id: "", //string.
     defaultKey: "", //string. existed id in options.
     options: [{
         id: "",
         label: "",
         icon: ""
     }, {}]
     prompt: "", //if fail to find item in options by defautlKey, use prompt string.
     onchange: function(){} //event triggered when selected item change.
 });



case 1:
 $("body").append("<div id='dropdowntest' style='position:absolute; top:0; left:0;z-index:10000'></div>");
 CDropDown.create($("#dropdowntest")[0], {
    id: "id", //string.
    defaultKey: "", //string. existed id in options.
    options: [{
        id: "op1Id",
        label: "op1 label",
        icon: "res/svgs/private.svg"
    },{
        id: "op2Id",
        label: "op2 label",
        icon: "res/svgs/private.svg"
    }],
    prompt: "drop down test", //if fail to find item in options by defautlKey, use prompt string.
    onchange: function(){} //event triggered when selected item change.
 });

 case 2:
 $("body").append("<div id='dropdowntest' style='position:absolute; top:0; left:0;z-index:10000'></div>");
 CDropDown.create($("#dropdowntest")[0], {
 id: "id", //string.
 defaultKey: "op1Id", //string. existed id in options.
 options: [{
 id: "op1Id",
 icon: "res/svgs/private.svg"
 },{
 id: "op2Id",
 icon: "res/svgs/private.svg"
 }],
 prompt: "", //if fail to find item in options by defautlKey, use prompt string.
 onchange: function(){} //event triggered when selected item change.
 });
*/
import './style.less';

var CDropDown = function(container, param){
    this.instance = $(container).cdropdown(param);
    this.container = $(container);
    this.param = param;
}

CDropDown.create = function(container, param){
    return new CDropDown(container, param);
}

CDropDown.prototype.instance = undefined;
CDropDown.prototype.container = undefined;
CDropDown.prototype.param = undefined;

CDropDown.prototype.toggleOptions = function(){
    this.instance.cdropdown("toggleOptions");
}
CDropDown.prototype.destroy = function(){
    this.instance.cdropdown("destroy");
}
CDropDown.prototype.update = function(param){
    this.destroy();
    $.extend(this.param, param);
    this.instance = this.container.cdropdown(this.param);
}
CDropDown.prototype.getValue = function() {
    return this.instance.cdropdown("getValue");



}
module.exports = CDropDown;

$.widget("custom.cdropdown", {
    widgetEventPrefix: "cdropdown",
    options: {
        id: "",
        defaultKey: "",
        options: [],
        prompt: "",
        disabled: false,
        onchange: undefined,
        onopenpopup: undefined,
        onclosepopup: undefined,
    },
    loseFocusHandler:null,

    _create: function () {
        this.update();
        this.loseFocusHandler = (function(e){
            var isHit = function(itm){
                var isPosInRect = function (pos, rect) {
                    return (rect.left < pos.x && pos.x < rect.right &&
                    rect.top < pos.y && pos.y < rect.bottom);
                }

                var cursorPos = {x: e.clientX, y: e.clientY};

                var left = itm.offset().left;
                var top = itm.offset().top;
                var right = left + itm.outerWidth();
                var bottom = top + itm.outerHeight();

                var rect = {
                    left: left,
                    top: top,
                    right: right,
                    bottom: bottom
                };
                if (isPosInRect(cursorPos, rect)) {
                    return true;
                }else return false;
            }

            if(!(isHit(this.element.find(">button")))
                && !(isHit(this.element.find(">ul")))
            ){
                this.close();
            }
        }).bind(this);
    },

    _destroy:function(){
        this.close();

        this.element.html('');
    },

    getOptionByKey:function(key){
        var self = this;
        var option;
        $.each(this.options.options, function(){
            if(this.id == key){
                option = this;
                return false;
            }
        })
        return option;
    },

    update:function(){
        var self = this;
        self.element.addClass("cdropdown").addClass(self.options.id);
        self.element.html("");

        var option;
        var label, icon;
        if(typeof self.options.defaultKey != "undefined")
            option = self.getOptionByKey(self.options.defaultKey);

        label = option ? option.label : self.options.prompt;
        label = label ? label : "";
        icon = option ? option.icon: icon;

        var html = '<button type="button" ></button>';
        self.element.append($(html));
        self.element.find("button").attr("title", label);

        if(icon){
            self.element.find("button").append($("<span class='icon'></span>"));
            self.element.find("button .icon").attr("data-src", icon);
            if(icon.endsWith("svg")){
                ResourceManager.injectSVGImage(self.element.find("button .icon")[0]);
            }
        }

        self.element.find("button").append($("<span class='utext'></span>"));
        self.element.find("button .utext").html(label);
        self.element.find("button").append($("<span class='caret'></span>"));

        self.element.removeClass('disable');
        if (self.options.disabled) {
            this.element.addClass('disable');
        }

        if (!self.options.disabled) {
            self.element.find("button").click(function(){
                var ul = self.element.find("ul");
                var isopen = !self.element.find("ul").is(":visible");

                if(isopen){
                    self.open();
                }else{
                    self.close();
                }
            });
        }

        html = '<ul role="menu"></ul>';
        self.element.append($(html));

        for(var i=0; i<self.options.options.length; i++){
            var option = self.options.options[i];
            var container = self.element.find(">ul");
            self.createOptionDom(option, container);
        }
    },
    open: function(){
        var ul = this.element.find(">ul");
        ul.show();

        this.options.onopenpopup && this.options.onopenpopup({
            id: this.options.id,
            bound: {
                left: ul.offset().left,
                top: ul.offset().top,
                width: ul.outerWidth(),
                height: ul.outerHeight()
            }
        });
        $.capture($("body"), "mousedown", this.loseFocusHandler);
        $.capture($("body"), "mousewheel", this.dropdownOnScroll);
    },
    close: function(){
        this.element.find(">ul").hide();
        this.options.onclosepopup && this.options.onclosepopup({id: this.options.id});
        $.unbindcapture($("body"), "mousedown", this.loseFocusHandler);
        $.unbindcapture($("body"), "mousewheel", this.dropdownOnScroll);
    },

    dropdownOnScroll: function(e) {
        e.stopPropagation();
    },

    toggleOptions: function(){
        if (this.element.find('>ul').is(':visible')) {
            this.close();
        } else {
            this.open();
        }
    },
    createOptionDom: function(option, container){
        var self = this;

        var id = option.id;
        var label = option.label ? option.label:"";
        var icon = option.icon ? option.icon:"";

        var html = "<li data='#id' role='presentation' title='#label'><span data-src='#icon' class='icon'></span><a role='menuitem' href='javascript:void(0);'>#label</a></li>";
        html = html.replace(/#id/g, id).replace(/#label/g, label).replace(/#icon/g, icon);

        container.append($(html));

        var selector = "li[data=#id]".replace(/#id/g, id);
        if(!icon){
            container.find(selector).find(".icon").remove();
        }else if(icon.endsWith("svg")){
            ResourceManager.injectSVGImage(container.find(selector).find(".icon")[0]);
        }

        container.find(selector).bind("mousedown", function(e){
            var key = $(this).attr("data");
            self.options.defaultKey = key;
            self.update();
            
            self.close();
            self.options.onchange && self.options.onchange(key);
        });
    },

    getValue: function() {
        return this.option.defaultKey;
    }
});

