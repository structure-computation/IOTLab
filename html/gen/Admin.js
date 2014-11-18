var USER_EMAIL, create_admin_desk_view, launch_admin_desk, load_if_cookie_admin_desk;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
USER_EMAIL = "";
load_if_cookie_admin_desk = function() {
  var email, password, xhr_object;
  if ($.cookie("email") && $.cookie("password")) {
    email = $.cookie("email");
    password = $.cookie("password");
    USER_EMAIL = email;
    xhr_object = FileSystem._my_xml_http_request();
    xhr_object.open('GET', "get_user_id?u=" + (encodeURI(email)) + "&p=" + (encodeURI(password)), true);
    xhr_object.onreadystatechange = function() {
      var lst, user_id;
      if (this.readyState === 4 && this.status === 200) {
        lst = this.responseText.split(" ");
        user_id = parseInt(lst[0]);
        if (user_id > 0) {
          return launch_admin_desk(user_id, decodeURIComponent(lst[1].trim()));
        } else {
          return window.location = "login.html";
        }
      }
    };
    return xhr_object.send();
  } else {
    return window.location = "login.html";
  }
};
launch_admin_desk = function(userid, home_dir, main) {
  var MAIN_DIV, bs, config_dir, fs;
  if (main == null) {
    main = document.body;
  }
  MAIN_DIV = main;
  FileSystem._home_dir = "";
  FileSystem._userid = userid;
  bs = new BrowserState;
  fs = new FileSystem;
  config_dir = FileSystem._home_dir + "/__config__";
  return fs.load_or_make_dir(config_dir, function(current_dir, err) {
    var config, config_file;
    config_file = current_dir.detect(function(x) {
      return x.name.get() === ".config";
    });
    if (!(config_file != null)) {
      config = new AdminDeskConfig;
      current_dir.add_file(".config", config, {
        model_type: "Config"
      });
      return create_admin_desk_view(config, main);
    } else {
      return config_file.load(__bind(function(config, err) {
        return create_admin_desk_view(config, main);
      }, this));
    }
  });
};
create_admin_desk_view = function(config, main) {
  var app, dd, login_bar;
  if (main == null) {
    main = document.body;
  }
  login_bar = new LoginBar(main, config);
  dd = new AdminDeskData(config);
  return app = new AdminDeskApp(main, dd);
};var AdminDeskConfig;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
AdminDeskConfig = (function() {
  __extends(AdminDeskConfig, Model);
  function AdminDeskConfig() {
    AdminDeskConfig.__super__.constructor.call(this);
    this.add_attr({
      name: "configuration desk",
      list_desk_items: new Lst,
      selected_list_desk_items: new Lst,
      account: new UserModel,
      list_contact: new Lst,
      selected_organisation: new Lst
    });
    this.list_desk_items.push(new DeskItem("Files"));
    this.selected_list_desk_items.push(this.list_desk_items[0]);
  }
  return AdminDeskConfig;
})();var AdminDeskData;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
AdminDeskData = (function() {
  __extends(AdminDeskData, Model);
  function AdminDeskData(config) {
    AdminDeskData.__super__.constructor.call(this);
    this.add_attr({
      config: config
    });
    this.add_attr({
      list_desk_items: this.config.list_desk_items,
      selected_list_desk_items: this.config.selected_list_desk_items
    });
    this.layout = new LayoutManagerData({
      sep_norm: 0,
      children: [
        {
          panel_id: "DeskListView",
          immortal: true
        }, {
          panel_id: "AdminDeskNavigatorView",
          strength: 3
        }
      ]
    });
  }
  return AdminDeskData;
})();var AdminDeskApp;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
AdminDeskApp = (function() {
  __extends(AdminDeskApp, View);
  function AdminDeskApp(bel, data) {
    this.bel = bel;
    this.data = data != null ? data : new TreeAppData;
    this.user_email = $.cookie("email");
    this.layout = this.data.layout;
    this.el = new_dom_element({
      parentNode: this.bel,
      id: "organisation_container",
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        top: "32px",
        bottom: 0
      }
    });
    this.lm = new LayoutManager(this.el, this.layout);
    this.lm.new_panel_instance = __bind(function(data) {
      return this._new_panel_instance(data);
    }, this);
    this.lm.show();
  }
  AdminDeskApp.prototype._new_panel_instance = function(data) {
    var res;
    if (data.panel_id === "DeskListView") {
      res = new LayoutManagerPanelInstance(this.el, data, "Desk");
      res.div.className = "PanelInstanceTreeView";
      new DeskListView(res.div, this);
      return res;
    }
    if (data.panel_id === "DeskNavigatorView") {
      res = new LayoutManagerPanelInstance(this.el, data);
      res.div.className = "PanelInstanceContextBar";
      new DeskNavigatorView(res.div, this);
      return res;
    }
    if (data.panel_id === "MessageListView") {
      res = new LayoutManagerPanelInstance(this.el, data);
      res.div.className = "PanelInstanceContextBar";
      new MessageListView(res.div, this);
      return res;
    }
    if (data.panel_id === "AdminDeskNavigatorView") {
      res = new LayoutManagerPanelInstance(this.el, data);
      res.div.className = "PanelInstanceContextBar";
      new AdminDeskNavigatorView(res.div, this);
      return res;
    }
    res = new LayoutManagerPanelInstance(this.el, data);
    res.div.className = "PanelInstanceContextBar";
    return res;
  };
  return AdminDeskApp;
})();var AdminModelEditorItem_Directory;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
AdminModelEditorItem_Directory = (function() {
  var sort_dir, sort_numerically;
  __extends(AdminModelEditorItem_Directory, ModelEditorItem);
  AdminModelEditorItem_Directory._action_list = {
    "Directory": [
      function(file, path, browser) {
        return browser.load_folder(file);
      }
    ]
  };
  AdminModelEditorItem_Directory._action_list_2 = [];
  function AdminModelEditorItem_Directory(params) {
    this.onPopupClose = __bind(this.onPopupClose, this);;    var key_map, title;
    AdminModelEditorItem_Directory.__super__.constructor.call(this, params);
    this.use_breadcrumb = params.use_breadcrumb != null ? params.use_breadcrumb : true;
    this.use_icons = params.use_icons != null ? params.use_icons : true;
    this.initial_path = params.initial_path != null ? params.initial_path : "Root";
    this.use_upload = params.use_upload != null ? params.use_upload : true;
    this.display_button_line = params.display_button_line != null ? params.display_button_line : true;
    this.use_manage = params.use_manage != null ? params.use_manage : true;
    this.display = params.display != null ? params.display : "all";
    this.breadcrumb = new Lst;
    this.breadcrumb.push(this.model);
    this.breadcrumb.bind(this);
    this.initial_path = this.make_initial_path_as_dom(this.initial_path);
    this.index_sorted = new Lst;
    this.selected_file = new Lst;
    this.clipboard = new Lst;
    this.selected_file.bind(this);
    this.clipboard.bind(this);
    this.allow_shortkey = false;
    this.line_height = 30;
    this.ed.ondrop = __bind(function(evt) {
      return this.cancel_natural_hotkeys(evt);
    }, this);
    this.container = new_dom_element({
      parentNode: this.ed,
      nodeName: "div",
      className: "directory_container",
      ondragover: __bind(function(evt) {
        return false;
      }, this),
      ondragout: __bind(function(evt) {
        return false;
      }, this),
      ondragleave: __bind(function(evt) {
        return false;
      }, this),
      ondrop: __bind(function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        this.handle_files(evt.dataTransfer.files);
        this.cancel_natural_hotkeys(evt);
        return false;
      }, this)
    });
    if (this.use_icons || this.use_upload) {
      this.icon_scene = new_dom_element({
        parentNode: this.container,
        nodeName: "div",
        className: "icon_scene"
      });
      title = new_dom_element({
        parentNode: this.icon_scene,
        nodeName: "div",
        txt: "Files",
        style: {
          cssFloat: "left",
          padding: "6px 40px 0 30px"
        }
      });
    }
    if (this.use_icons) {
      this.icon_up = new_dom_element({
        parentNode: this.icon_scene,
        nodeName: "img",
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94FGw8oBY1zlQkAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABoElEQVQ4y6WUP3ITMRTGv2c2csKY3ewCKdPTcgK4Bwdg6DZ1inCBpCMX4DwcgI5JAwOWVnKGsZ7NfinsxFl75bGJKs378+n3/oyAPc73nw5POo1XAID18X0z0XcA0Ez0aWIuaO2C0vpIF2INAP529n+i92IuaOtCbJf3ej+ycE8WL+yDmNIFpQ3aLkj1c6p8SZB9JHAtANdjCBCkiMinMjfX67mDjZ55vViK9T4ogIgISH5Zkc66hI1XHBcGLsSaxKWIMEXfQ3pW5ubK385QjA5WSc7HGiKXWAZCZHuzSWD18FmZm6sHQhviqUB+dOMJSYkuxNatp2VubsR5RVmYjudm/FdGB5kH8CJR7uTXdF68OXnOx3YbFIOyMPhtp52EkcmOCMqWcuXkMDt6bPrTRFS5WUz5dXW4/9azA4dXx8Pu2myux5ahbBnYIL0W3JluB0FuXDpOSW9pvyCzqUBapvFbmSPuLFjmz1qS5wIK+9oLOa+q4b/+3vcc6xVVYTD2+nYg+AAiAwAK5iC/VsXw2zgoXuZm962wIf2Jjptp0ncHS8XpIDn7KIUAAAAASUVORK5CYII=",
        alt: "Parent",
        title: "Parent",
        style: {
          cssFloat: "left",
          height: 20
        },
        onclick: __bind(function(evt) {
          return this.load_model_from_breadcrumb(this.breadcrumb.length - 2);
        }, this)
      });
      this.icon_new_folder = new_dom_element({
        parentNode: this.icon_scene,
        nodeName: "img",
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94FGw8qM3D/YhIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAACvklEQVRIx72Wu2tUaxTFf+vkOKMYz5mJryLgVa42FpaCzoj4qAURba5ol4uN4P9gdQWNhVbio7CRgCYoiKCNxsZG8FVZSBQfmDmZgwZPLjnrFnNmzI2POElwV4fvg7X2Xnt/ax8l6dQK8EmjvwVl/h+2eYU4Lnxz3PLGuES3oSSdOgscb4MCmsWDLYS3VOPyk27AG82MvriMkjT7Aip/n6DNgiwuyv4HqTw3vP+tRuUXbSI1mpkl/Yhghm4YbEm/Wsgzm/19cemlknTKRRWvgM8sPAwsM/5TMGRzOCwu3tg+BDwTWjCJ8UrEU9Au5OVhQZ0I3lbj8uQiVEKjmb3GJIjVGIVFMzRXT7oaWRHMhAv4DRHgDv+ig9st8KAzkVpM8FmV+Ec3C+tJkbaCWXJ1HzvyCtvz6JvzyrtSbvuc5DcSCr8+4O70quUR94MJAOqO12N2IiLguaS7wKnx5pdhoYnwq5/8ekk1R4wqpZ7Hq43PGR+UBG4ZXc3xhMzRlcHSEYCwW4lqeYug5mgVcFNoa8dN1FJEdsXScD2PBoAL8x9hcx6ztS2B0aDRIeExJMvG0mlL64JuJ3c0SKk5+gM4iFroRaKPgCFg0nbb1nsFR0PENLDMcrWRZslPDdLOC3/b3bJ8YzQIPJK5b2zQCYkq5oztNYg9IeYG8gGhy8D7OTx8DBgAemccPwSG2vsTuG3cA5wsds9yNZpZv6QrwJ45t4RoVCaX9G9f27stcM89JGSPISZBJ4xvC13HbERsAkrGVzvajE9klWLOf/aWp/u85J0qmq47TmxXJNm2JP1lfE3WY8ubhVQktlcfkylWVbv/A6nl0T5Jw3bHRj4Um7XfuFRId8v2gWA+BHXHjAbpiM2A5E9ujdcazAagJAvbtzDHRoM0C+fnsnn76wJwR9YRYK/lXswL4JKkBw/UzAD+A9XaQDGhzUlDAAAAAElFTkSuQmCC",
        alt: "New folder",
        title: "New folder",
        style: {
          cssFloat: "left",
          height: 20
        },
        onclick: __bind(function(evt) {
          var t;
          t = new Directory;
          return this.model.add_file("New folder", t);
        }, this)
      });
      this.icon_cut = new_dom_element({
        parentNode: this.icon_scene,
        nodeName: "img",
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAZCAYAAAAxFw7TAAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94FGw8vEdjo17MAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAEGElEQVQ4y42VT4hlxRXGf99reLdntN/td3uh4jgz+eOfSETUUUxQiC5cmEUSDEiMwYkQN8oEFy5UUBQFdRAxZDHMRlCjCxFUDLgPhJAgEZLIBI1OIGKidFVX9fTMVPV0fy7ufT2dmSg5myrqnPPVOd85p4pjaycACKleH3M5yCCrxzf4Komp9Guu3wqpPHiWQUj1UMzVMZdbAZZXypeD5V4Xct0ZUjkSc/1DzLUFGA0GF0i+xgbQoZjr3qXFZstxu6R0kumkAUD2YUmX2uwxXLIFiNkN2i2B7YuAp0IqczPH7dK287OUf2pxG4Dk87F3nwaUdmDv6LfC9g8k/Xg7VwAx1lmqe4wekpnHM60WTgPiFaTcp4wlzdt+OqZy4bRtWF7pC+c5E1MZAQ8JLkfCGBDg9S3A6aR5z+a30un7kPYgHQYYj+cJqdBNGkDfx9yDBrJ6+UjwLsAopDr4c8Dmbz3XuKfTt8Zc71vYKbq2IeSyaPmlAWcITSdsH5y2zRGAUdeOibkynYyL5Vts3pfcxyoZeCrmcsUQ9utYrSSbIUZ8sGubQ33rlVnKY0KuLE2aT7Fvw/rIsmSwfcroeMz1Adnf0+wqwPbjXds8OgPr2mZWFOgmY2Jap1tsjhjvF/rcWEj3A2PgwMD5wJ6fQ3pyO9j/lGN1fZicsj+k8vLQOq+FXB1S2ezX+puYS8P/I2GlnjFm9UBMxf1YVsdUXo+pLAy6s/xHZx50iz2fw0jus/2sZ4zZIJVp26x+FteYTsZnASqtrXOqnGKp2/Hfka5tjNnY+Cv2xeqrjfvOL8BPurZ546w5X62z0kM6Vs/Z3OTbQAus2d4P3C1pZPv3wMeS7sDI+D1JDw69eAL8j+mk+YRZxWKuVwFPgG+0WRgUm/RgfwJu79rm45jqY4hHTufPCNiQ9D7419NJc1gx1wts/xHYJelT228jfVNwEz1nL04n47uGyl+NeFcI2x8C70i6BvMdYyT9nJDKczEXx1xf+Wx5batIy6n8KKSaQyrHQyrXDq/Mn2OumyHXF9Lq+pZtyPVnMdeTIddIyGU55PLvmOqV/Ut9cvsz/2bMZTOk+nBIdVdMZTWkshxTOW+7bUhlLqTydszVI6FumIoEsLQ4v9VfhiMDzx2wSD9269O2+c/MFqBrmw1JwTYj4KjtvZK+Pots1l+SbrJ1SvI/gX/1e+1cyXXfGX/Mku1vSGIE/ErSubafCancEHLdFXP5Wsz1aZt9gs8xb3TteAV4B1gwfj7mel1I9cKY66WgR4DvGv6ikOoEOCz5dqMi+++GRcFupFXbd3Zt81bPWe0kvybpZpsscdT2FOki4BPsH2ogdQdwl6RfApcBa4bfYR/o2uaD2be6tNiwnEor8Quhe4G9wLLtVwXPzs3p6BceOpI2Xx8WxAAAAABJRU5ErkJggg==",
        alt: "cut",
        title: "Cut",
        style: {
          cssFloat: "left",
          height: 20
        },
        onclick: __bind(function(evt) {
          return this.cut();
        }, this)
      });
      this.icon_copy = new_dom_element({
        parentNode: this.icon_scene,
        nodeName: "img",
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94FGw80LCm2UDgAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAC5UlEQVRIx62WP4hcVRTGf9/srsTBOXdERESxMYVobxBJ0ICILtqIlcRGEGJEGwu1ESvRQgQLQcTCQhFhmwSsZCGwEUUMggREYZFoP/fuZnbdN/M+i30PdseZ2cnigcf7d9/5zvm+c8954oBtbW3R6/UopdwPfAg8Y1ssYNL+Mtu/SnotItYBtre3+Y+DUsq9tjck3Wf7W0m7CwJZ0hJw2vbtkp6NiIs558Mgw+GQqqr6kp6y/ZekjYiop3nMOQtYaTNogWw/KmkdWI+Is8A+SCkF26SUyDmfknTKtg9QMEnNEvBDRHw/I4ARcBU4k1LaWS6lEBHknG8tpXwDrM7ieyJkSimfAK9HRNX6mfbNcvtC0nu2V4E14EtJnsF9ZftJSRdsn5dUA69ubm7OFGu5oWsFeEQSdV2/0O/3d+cpnHO+o43W9oVSSkTEi7PWd5rUl5rr+iiAxm4coMXAuVLKF3NBjmEXgV+aANWcz+Wc35pJ15S9csL205K6Plxa46asr+ecV4FVSXfbHkl60/YTOzs77+/t7R0NArws6QNgaUpQn5VSXomIv3POnwJKKbmUch7ojkajlYUyAa7Y/hGIiee17Y2UUgWQUgLwUdxOBYmIn4Az/E82KxOGw+FKXde3zPu40+n80+12R0eBdGYI/1xVVTfG4/H2vKOqqr2mAI6ViYHfJZ2Y7FsT7aa2PT4WiKQ121dtz6XL9q6k68cC6fV6AJvH1NmLbsaHbL8D3DatA7ddWNKW7XdTStda+uq6vktSx3YNjOZp8rCk5xcZt03XvtYMrDuBz5s5daXdT7NAvrb987wSb2wk6Y8DNJ2UdNL2JeBtgMFgsO9kkpKIGLYN8CasI+lP4KWU0nelFAaDAf1+fx8kInZzzltAp5TyWPMjsbjS9gPAPcCa7cs550NTcvnA2PxI0uPAmqTLQL2A85aF0839V60Oh/TLObeNjpzzWeBjSQ/eRBYAvwFvpJQuTVvzL1ehmJFssZ5TAAAAAElFTkSuQmCC",
        alt: "copy",
        title: "Copy",
        style: {
          cssFloat: "left",
          height: 20
        },
        onclick: __bind(function(evt) {
          return this.copy();
        }, this)
      });
      this.icon_paste = new_dom_element({
        parentNode: this.icon_scene,
        nodeName: "img",
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94FGw8zCFr0Ii4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADK0lEQVRIx52VT4gcRRTGf1/v4O5O7OoVo8GsuJCgByGeDOLFICJKhBg2KCqIXkRCEMFDjnowIMaT4CkgguJFMTksHrxFPCmehJxEjOD6BwIzVZNd1zjTn5futaedmc3uBwVd9frVV+9771VBC5ubm/T7/e15SulwjPFyjHEQY1yLMd5Z2waDATeDrP6IMQLQ7XZZWloipTSXUsqBt4A/gCeBeUlvxhgXAfI852YIlVLCNkVR1Ce/D+gA79u+DTgi6fkQwsUY4+uS3rV9RVLP9gtAtyiKq5UvIYT/kzRkWbX9EfA1cEHSZ8CibSQNgG+qaDIA2zckPWX7DUkP2j5eFMX3k4iySqrHbH8iKUg6ICkCQwBJADlwvEGApAy4BiwBdwCXU0oPTIokSyndArwsqWvbwO22r9n+FtgArreHpL9srwFJ0kp1mH3Aq3Vum+gAC5Lub5z6EHBG0qptVWtjsE2WZZRl+SFwsOF7T0W20SYB6FQSCLCkM7ZfkvR7M291HiWVZVkelpRVfjV5DnSBjWZuOpMqDjBwq+17Gxsg6VfbP1X5+K2St7bNSzoGfJBSeiWEkGqizrTSbsskacv2I5L+tJ217bbvlnTF9rPA/pTSiRDCRkppWyYmad/CL0VR/DzNmFK6DoyqKB8FvowxngghpKwpxw6Y+YPtnu0vgC3gb+CYpLdTSp0Ou0RK6RngaINUQAohnIsxngY+r5L/BPA40N2NXDWeA1ZbayPgXFEUfeBi1eC5pIdtsxu5AFhfXz9VluViWZbdauwLIXRa0dY3gqeV8EwsLy/vBw60NlXVuLKdQghXY4zb6uyaBDgPnATKVokDZJKG/X5/uSn/XnKyZrvUZIc54MfRaPRPlmX/kbQ6ekeGEMIl4NIOFTi2315K+CTw0JS+yYB+WZbnxyLZg1wvTijhNt4bu4UluerQuqtnsvV6vVN5ns9Nsw+Hw9HCwsK4XLa3gO8kHZ1FUL33rKys1M03EzHGg8ANwKoWjkj6yvZdknDrtarntj+V9ENVRdMOY0mF7dckXQDOqsF8CHgHeFrS/ARHANkeNfpiGtFI0sfA2RBC718AbrkqtNBKYwAAAABJRU5ErkJggg==",
        alt: "paste",
        title: "Paste",
        style: {
          cssFloat: "left",
          height: 20
        },
        onclick: __bind(function(evt) {
          return this.paste();
        }, this)
      });
      this.icon_del_folder = new_dom_element({
        parentNode: this.icon_scene,
        nodeName: "img",
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94FGw84NeFot/QAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAB3ElEQVRIx62WMYsUQRCFv7d3CCfak4gIpyYmirG5cGCi0f4AvVR/iD/DxFQwFAQRLjg480sMRDhEA2XpxnVP72afgT2wjjszvetVNNPVVdX16nV1wYDEGIkxdupTSkMuEIWSUroH3ATm2e5zCOFFie3mspOFEP7ZaHsX2AaclyYppdchhNTOvKqq4Uym0+lGXde7tm8DlgQwsv23sTRf8PMReBZC+D4IV0rpvO3nwDg7LxbbB5LuhxC+9cJle1vSLdvvM/6lIknXbd8A+oMAH4AxcNf2uRWCnEraBw6L2BVjvAO8kXTRNouwNXVpr0k6BsYhhFdtf6MueCWdADVwYPtLXj8G9oCmuBNgT9IpcNIF76gD3OaEPyU9kfTWf+SrpIeSjvLWQ+ARMOvDcdTDlObzRz4l+Y7MgHnW17ZnbnO7JEi7Dn3ZZlaxViYr3o/V2kpzyiHDRf1amZTCVdoRzgSutYKs0bNWr0mJ4ZD+zGvyvxR2q100/00ac+DXuhRWNtwEdoCruZlu5f8LWX9J0k7eV3c1XHW859eAd7avlJAgwzux/aCqqv3SN/4oxvhU0mPbGwW1se2XywJ0Pb8AhBBIKV22vbVQgy661yGET32DyNJZqmSeWjajLZPf5lf2OD9SK7MAAAAASUVORK5CYII=",
        alt: "Delete",
        title: "Delete",
        style: {
          cssFloat: "left",
          height: 22
        },
        onclick: __bind(function(evt) {
          return this.delete_file();
        }, this),
        ondragover: __bind(function(evt) {
          return false;
        }, this),
        ondrop: __bind(function(evt) {
          this.delete_file();
          evt.stopPropagation();
          return false;
        }, this)
      });
    }
    if (this.use_upload) {
      this.upload_form = new_dom_element({
        parentNode: this.icon_scene,
        nodeName: "form",
        style: {
          cssFloat: "left",
          padding: "0px 0px 0 30px"
        }
      });
      this.upload = new_dom_element({
        parentNode: this.icon_scene,
        nodeName: "input",
        type: "file",
        multiple: "true",
        style: {
          cssFloat: "left",
          fontWeight: "normal",
          fontSize: 14,
          padding: "0px 0px 0 0px",
          border: "none",
          background: "#4dbce9"
        },
        onchange: __bind(function(evt) {
          return this.handle_files(this.upload.files);
        }, this)
      });
    }
    if (this.use_breadcrumb) {
      this.breadcrumb_line = new_dom_element({
        parentNode: this.container,
        nodeName: "div",
        style: {
          width: "100%",
          borderBottom: "1px solid #262626"
        }
      });
      this.breadcrumb_dom = new_dom_element({
        parentNode: this.breadcrumb_line,
        nodeName: "div",
        style: {
          fontWeight: "normal",
          fontSize: 14,
          padding: "5px 0px 0 20px",
          border: "none"
        }
      });
    }
    this.all_file_container = new_dom_element({
      parentNode: this.container,
      nodeName: "div"
    });
    key_map = {
      8: __bind(function(evt) {
        return this.load_model_from_breadcrumb(this.breadcrumb.length - 2);
      }, this),
      13: __bind(function(evt) {
        var ind_sel_file, index, _i, _len, _ref, _results;
        if (this.selected_file.length > 0) {
          _ref = this.selected_file.get();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            ind_sel_file = _ref[_i];
            index = this.search_ord_index_from_id(ind_sel_file);
            _results.push(this.open(this.model[index], this.path()));
          }
          return _results;
        }
      }, this),
      37: __bind(function(evt) {
        var ind, index_last_file_selected;
        if (this.selected_file.length > 0) {
          if (evt.shiftKey) {
            index_last_file_selected = this.selected_file[this.selected_file.length - 1].get();
            if (!(this.reference_file != null)) {
              this.selected_file.clear();
              this.selected_file.push(index_last_file_selected);
              this.reference_file = index_last_file_selected;
            }
            if (index_last_file_selected > 0) {
              if (index_last_file_selected <= this.reference_file) {
                return this.selected_file.push(index_last_file_selected - 1);
              } else {
                return this.selected_file.pop();
              }
            }
          } else {
            ind = this.selected_file[this.selected_file.length - 1].get();
            if (ind !== 0) {
              this.selected_file.clear();
              this.selected_file.push(ind - 1);
            } else {
              this.selected_file.clear();
              this.selected_file.push(0);
            }
            return this.reference_file = void 0;
          }
        } else {
          this.selected_file.push(0);
          return this.reference_file = void 0;
        }
      }, this),
      38: __bind(function(evt) {
        if (evt.altKey) {
          return this.load_model_from_breadcrumb(this.breadcrumb.length - 2);
        }
      }, this),
      39: __bind(function(evt) {
        var ind, index_last_file_selected;
        if (this.selected_file.length > 0) {
          if (evt.shiftKey) {
            index_last_file_selected = this.selected_file[this.selected_file.length - 1].get();
            if (!(this.reference_file != null)) {
              this.selected_file.clear();
              this.selected_file.push(index_last_file_selected);
              this.reference_file = index_last_file_selected;
            }
            if (index_last_file_selected < this.model.length - 1) {
              if (index_last_file_selected >= this.reference_file) {
                return this.selected_file.push(index_last_file_selected + 1);
              } else {
                return this.selected_file.pop();
              }
            }
          } else {
            ind = this.selected_file[this.selected_file.length - 1].get();
            if (ind < this.model.length - 1) {
              this.selected_file.clear();
              this.selected_file.push(ind + 1);
            } else {
              this.selected_file.clear();
              this.selected_file.push(this.model.length - 1);
            }
            return this.reference_file = void 0;
          }
        } else {
          return this.selected_file.push(0);
        }
      }, this),
      40: __bind(function(evt) {
        var ind_sel_file, index, _i, _len, _ref, _results;
        if (evt.altKey) {
          if (this.selected_file.length > 0) {
            _ref = this.selected_file.get();
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              ind_sel_file = _ref[_i];
              index = this.search_ord_index_from_id(ind_sel_file);
              _results.push(this.open(this.model[index], this.path()));
            }
            return _results;
          }
        }
      }, this),
      65: __bind(function(evt) {
        var child, i, _len, _ref, _results;
        if (evt.ctrlKey) {
          this.selected_file.clear();
          _ref = this.model;
          _results = [];
          for (i = 0, _len = _ref.length; i < _len; i++) {
            child = _ref[i];
            _results.push(this.selected_file.push(i));
          }
          return _results;
        }
      }, this),
      88: __bind(function(evt) {
        if (evt.ctrlKey) {
          return this.cut();
        }
      }, this),
      67: __bind(function(evt) {
        if (evt.ctrlKey) {
          return this.copy();
        }
      }, this),
      86: __bind(function(evt) {
        if (evt.ctrlKey) {
          return this.paste();
        }
      }, this),
      46: __bind(function(evt) {
        return this.delete_file();
      }, this),
      113: __bind(function(evt) {
        var file_contain, _ref;
        file_contain = (_ref = document.getElementsByClassName('selected_file')[0]) != null ? _ref.getElementsByClassName('linkDirectory') : void 0;
        if ((file_contain != null) && file_contain.length > 0) {
          return this.rename_file(file_contain[0], this.model[this.search_ord_index_from_id(this.selected_file[0].get())]);
        }
      }, this)
    };
    document.onkeydown = __bind(function(evt) {
      if (this.allow_shortkey === true) {
        if (key_map[evt.keyCode] != null) {
          evt.stopPropagation();
          evt.preventDefault();
          key_map[evt.keyCode](evt);
          return true;
        }
      }
    }, this);
  }
  AdminModelEditorItem_Directory.prototype.cut = function() {
    var ind_children, real_ind, _i, _len, _ref;
    if (this.use_manage) {
      if (this.selected_file.length > 0) {
        this.clipboard.clear();
        _ref = this.selected_file.get();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ind_children = _ref[_i];
          real_ind = this.search_ord_index_from_id(ind_children);
          this.clipboard.push(this.model[real_ind]);
        }
        return this.cutroot = this.model;
      }
    }
  };
  AdminModelEditorItem_Directory.prototype.copy = function() {
    var ind_children, real_ind, _i, _len, _ref;
    if (this.use_manage) {
      if (this.selected_file.length > 0) {
        this.clipboard.clear();
        _ref = this.selected_file.get();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ind_children = _ref[_i];
          real_ind = this.search_ord_index_from_id(ind_children);
          this.clipboard.push(this.model[real_ind]);
        }
        return this.cutroot = void 0;
      }
    }
  };
  AdminModelEditorItem_Directory.prototype.paste = function() {
    var file, mod, new_file, pos, _i, _j, _len, _len2, _ref, _ref2, _results;
    if (this.use_manage) {
      if (this.cutroot != null) {
        _ref = this.clipboard.get();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          mod = _ref[_i];
          pos = this.cutroot.indexOf(mod);
          if (pos !== -1) {
            this.cutroot.splice(pos, 1);
          }
        }
      }
      _ref2 = this.clipboard;
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        file = _ref2[_j];
        new_file = file.deep_copy();
        _results.push(this.model.push(new_file));
      }
      return _results;
    }
  };
  AdminModelEditorItem_Directory.prototype.rename_file = function(file, child_index) {
    if (this.use_manage) {
      this.allow_shortkey = false;
      file.contentEditable = "true";
      file.focus();
      return file.onblur = __bind(function(evt) {
        var title;
        this.allow_shortkey = true;
        title = file.innerHTML;
        child_index.name.set(title);
        file.contentEditable = "false";
        return this.selected_file.clear();
      }, this);
    }
  };
  AdminModelEditorItem_Directory.prototype.onchange = function() {
    if (this.selected_file.has_been_directly_modified()) {
      this.draw_selected_file();
    }
    if (this.model.has_been_modified() || this.breadcrumb.has_been_modified()) {
      return this.refresh();
    }
  };
  AdminModelEditorItem_Directory.prototype.refresh = function() {
    this.empty_window();
    this.init();
    return this.draw_selected_file();
  };
  AdminModelEditorItem_Directory.prototype.empty_window = function() {
    return this.all_file_container.innerHTML = "";
  };
  AdminModelEditorItem_Directory.prototype.load_folder = function(file) {
    this.model.unbind(this);
    return file._ptr.load(__bind(function(m, err) {
      this.model = m;
      this.model.bind(this);
      this.breadcrumb.push(file);
      return this.selected_file.clear();
    }, this));
  };
  AdminModelEditorItem_Directory.prototype.open = function(file, path) {
    var l;
    if (file._info.model_type != null) {
      l = ModelEditorItem_Directory._action_list[file._info.model_type];
      if ((l != null) && l.length) {
        return l[0](file, path, this);
      }
    }
  };
  AdminModelEditorItem_Directory.prototype.open_2 = function(file, path) {
    var l;
    if (file._info.model_type != null) {
      l = ModelEditorItem_Directory._action_list_2[file._info.model_type];
      if ((l != null) && l.length) {
        return l[0](file, path, this);
      }
    }
  };
  AdminModelEditorItem_Directory.prototype.handle_files = function(files) {
    var file, fs, _i, _len, _results;
    if (files.length > 0) {
      if (typeof FileSystem != "undefined" && FileSystem !== null) {
        fs = FileSystem.get_inst();
        _results = [];
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          _results.push(this.model.add_file(file.name, new Path(file)));
        }
        return _results;
      }
    }
  };
  AdminModelEditorItem_Directory.prototype.make_initial_path_as_dom = function(initial_path) {
    var path, reg;
    reg = new RegExp("[\/]+", "g");
    path = initial_path.split(reg);
    return path;
  };
  AdminModelEditorItem_Directory.prototype.draw_breadcrumb = function() {
    var folder, i, _len, _ref, _results;
    this.breadcrumb_dom.innerHTML = "";
    _ref = this.breadcrumb;
    _results = [];
    for (i = 0, _len = _ref.length; i < _len; i++) {
      folder = _ref[i];
      _results.push(__bind(function(i) {
        var f, l;
        if (i === 0) {
          return f = new_dom_element({
            parentNode: this.breadcrumb_dom,
            nodeName: "span",
            className: "breadcrumb",
            txt: "Root",
            onclick: __bind(function(evt) {
              return this.load_model_from_breadcrumb(0);
            }, this)
          });
        } else {
          l = new_dom_element({
            parentNode: this.breadcrumb_dom,
            nodeName: "span",
            txt: " > "
          });
          return f = new_dom_element({
            parentNode: this.breadcrumb_dom,
            nodeName: "span",
            className: "breadcrumb",
            txt: folder.name,
            onclick: __bind(function(evt) {
              return this.load_model_from_breadcrumb(i);
            }, this)
          });
        }
      }, this)(i));
    }
    return _results;
  };
  AdminModelEditorItem_Directory.prototype.load_model_from_breadcrumb = function(ind) {
    if (ind !== -1) {
      this.delete_breadcrumb_from_index(ind);
      if (ind === 0) {
        return this.model = this.breadcrumb[0];
      } else {
        return this.breadcrumb[ind]._ptr.load(__bind(function(m, err) {
          return this.model = m;
        }, this));
      }
    }
  };
  AdminModelEditorItem_Directory.prototype.delete_breadcrumb_from_index = function(index) {
    var i, _ref, _results;
    _results = [];
    for (i = _ref = this.breadcrumb.length - 1; (_ref <= index ? i < index : i > index); (_ref <= index ? i += 1 : i -= 1)) {
      _results.push(this.breadcrumb.pop());
    }
    return _results;
  };
  AdminModelEditorItem_Directory.prototype.search_ord_index_from_id = function(id) {
    var i, id_, pos, sorted, _i, _len, _ref;
    sorted = this.model.sorted(sort_dir);
    id_ = this.index_sorted[id];
    _ref = this.model;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      pos = this.model.indexOf(sorted[id_]);
      if (pos !== -1) {
        return pos;
      }
    }
  };
  sort_numerically = function(a, b) {
    return a - b;
  };
  AdminModelEditorItem_Directory.prototype.delete_file = function() {
    var i, index, index_array, _i, _len, _ref, _ref2;
    if (this.use_manage) {
      if (this.selected_file.length) {
        index_array = [];
        _ref = this.selected_file.get();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          index = this.search_ord_index_from_id(i);
          index_array.push(index);
        }
        index_array.sort(this.sort_numerically);
        for (i = _ref2 = index_array.length - 1; (_ref2 <= 0 ? i <= 0 : i >= 0); (_ref2 <= 0 ? i += 1 : i -= 1)) {
          this.model.splice(index_array[i], 1);
        }
        return this.selected_file.clear();
      }
    }
  };
  AdminModelEditorItem_Directory.prototype.draw_selected_file = function() {
    var file, file_contain, j, _len, _results;
    file_contain = document.getElementsByClassName('file_container');
    _results = [];
    for (j = 0, _len = file_contain.length; j < _len; j++) {
      file = file_contain[j];
      _results.push(parseInt(this.selected_file.indexOf(j)) !== -1 ? add_class(file, 'selected_file') : rem_class(file, 'selected_file'));
    }
    return _results;
  };
  AdminModelEditorItem_Directory.prototype.cancel_natural_hotkeys = function(evt) {
    if (!evt) {
      evt = window.event;
    }
    evt.cancelBubble = true;
    if (typeof evt.stopPropagation === "function") {
      evt.stopPropagation();
    }
    if (typeof evt.preventDefault === "function") {
      evt.preventDefault();
    }
    if (typeof evt.stopImmediatePropagation === "function") {
      evt.stopImmediatePropagation();
    }
    return false;
  };
  sort_dir = function(a, b) {
    if (a.name.get().toLowerCase() > b.name.get().toLowerCase()) {
      return 1;
    } else {
      return -1;
    }
  };
  AdminModelEditorItem_Directory.prototype.init = function() {
    var bottom, elem, i, sorted, _fn, _len, _len2, _len3, _sorted;
    _sorted = this.model.sorted(sort_dir);
    this.index_sorted.clear();
    sorted = new Array;
    if (this.display === "all") {
      for (i = 0, _len = _sorted.length; i < _len; i++) {
        elem = _sorted[i];
        sorted.push(elem);
        this.index_sorted.push(i);
      }
    } else if (this.display === "Session") {
      for (i = 0, _len2 = _sorted.length; i < _len2; i++) {
        elem = _sorted[i];
        if (elem._info.model_type.get() === "Session" || elem._info.model_type.get() === "Directory") {
          sorted.push(elem);
          this.index_sorted.push(i);
        }
      }
    }
    this.allow_shortkey = true;
    _fn = __bind(function(elem, i) {
      var button_line, download_button, file_container, picture_container, r, share_button, stext, text, u, _ref, _ref2;
      file_container = new_dom_element({
        parentNode: this.all_file_container,
        nodeName: "div",
        className: "file_container",
        ondragstart: __bind(function(evt) {
          if (document.getElementById('popup_closer') != null) {
            this.popup_closer_zindex = document.getElementById('popup_closer').style.zIndex;
            document.getElementById('popup_closer').style.zIndex = -1;
          }
          this.drag_source = [];
          this.drag_source = this.selected_file.slice(0);
          if (parseInt(this.selected_file.indexOf(i)) === -1) {
            this.drag_source.push(i);
          }
          evt.dataTransfer.effectAllowed = evt.ctrlKey ? "copy" : "move";
          console.log(this.drag_source.get(), this.selected_file);
          return evt.dataTransfer.setData('text/plain', this.selected_file.get());
        }, this),
        ondragover: __bind(function(evt) {
          return false;
        }, this),
        ondragend: __bind(function(evt) {
          if (document.getElementById('popup_closer') != null) {
            return document.getElementById('popup_closer').style.zIndex = this.popup_closer_zindex;
          }
        }, this),
        ondrop: __bind(function(evt) {
          var ind, index, sorted_ind, _i, _j, _len, _len2, _ref, _ref2;
          if (sorted[i]._info.model_type.get() === "Directory") {
            _ref = this.drag_source.get();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              ind = _ref[_i];
              if (sorted[ind] === sorted[i]) {
                return false;
              }
              sorted[i]._ptr.load(__bind(function(m, err) {
                return m.push(sorted[ind]);
              }, this));
            }
            _ref2 = this.drag_source.get();
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              sorted_ind = _ref2[_j];
              index = this.search_ord_index_from_id(sorted_ind);
              this.model.splice(index, 1);
            }
            this.selected_file.clear();
          } else {
            evt.stopPropagation();
            evt.preventDefault();
            this.handle_files(evt.dataTransfer.files);
          }
          return this.cancel_natural_hotkeys(evt);
        }, this),
        onmousedown: __bind(function(evt) {
          var ind, index_last_file_selected, j, _results;
          if (evt.ctrlKey) {
            ind = parseInt(this.selected_file.indexOf(i));
            if (ind !== -1) {
              return this.selected_file.splice(ind, 1);
            } else {
              return this.selected_file.push(i);
            }
          } else if (evt.shiftKey) {
            if (this.selected_file.length === 0) {
              return this.selected_file.push(i);
            } else {
              index_last_file_selected = this.selected_file[this.selected_file.length - 1].get();
              this.selected_file.clear();
              _results = [];
              for (j = index_last_file_selected; (index_last_file_selected <= i ? j <= i : j >= i); (index_last_file_selected <= i ? j += 1 : j -= 1)) {
                _results.push(this.selected_file.push(j));
              }
              return _results;
            }
          } else {
            this.selected_file.clear();
            return this.selected_file.push(i);
          }
        }, this)
      });
      if (elem._info.img != null) {
        picture_container = new_dom_element({
          parentNode: file_container,
          nodeName: "span",
          ondblclick: __bind(function(evt) {
            this.open(sorted[i], this.path());
            return this.cancel_natural_hotkeys(evt);
          }, this),
          style: {
            maxWidth: 100,
            height: 100,
            display: "inline-block"
          }
        });
        this.picture = new_dom_element({
          parentNode: picture_container,
          className: "picture",
          nodeName: "img",
          src: elem._info.img.get(),
          alt: elem.name.get(),
          title: elem.name.get(),
          style: {
            maxWidth: 100,
            maxHeight: 100
          }
        });
      } else if (elem._info.icon != null) {
        this.picture = new_dom_element({
          parentNode: file_container,
          className: "picture" + " " + "icon_" + elem._info.icon.get() + "_128",
          title: elem.name.get(),
          ondblclick: __bind(function(evt) {
            this.open(sorted[i], this.path());
            return this.cancel_natural_hotkeys(evt);
          }, this),
          width: 100,
          height: 100
        });
      } else {
        this.picture = new_dom_element({
          parentNode: file_container,
          nodeName: "img",
          src: "data:image/png;base64,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",
          alt: "",
          title: "",
          ondblclick: __bind(function(evt) {
            this.open(sorted[i], this.path());
            return this.cancel_natural_hotkeys(evt);
          }, this)
        });
      }
      stext = "";
      if ((_ref = elem._info) != null ? (_ref2 = _ref.remaining) != null ? _ref2.get() : void 0 : void 0) {
        r = elem._info.remaining.get();
        u = elem._info.to_upload.get();
        stext += " (" + ((100 * (u - r) / u).toFixed(0)) + "%)";
      }
      if (this.display_button_line) {
        button_line = new_dom_element({
          parentNode: file_container,
          className: "line_button",
          nodeName: "div"
        });
        share_button = new_dom_element({
          parentNode: button_line,
          className: "share_button",
          nodeName: "div",
          alt: "Share",
          title: "Share",
          onclick: __bind(function(evt) {
            return this.share_popup(evt, elem, elem.name.get());
          }, this)
        });
        if (elem._info.model_type.get() === "Session" || elem._info.model_type.get() === "Directory") {} else {
          download_button = new_dom_element({
            parentNode: button_line,
            className: "download_button",
            nodeName: "div",
            alt: "Download",
            title: "Download",
            onclick: __bind(function(evt) {
              return elem.load(__bind(function(model, err) {
                if ((typeof Path != "undefined" && Path !== null) && (model instanceof Path)) {
                  evt.preventDefault();
                  return window.open("/sceen/_?u=" + model._server_id, "_blank");
                } else {
                  return alert("TODO: download models");
                }
              }, this));
            }, this)
          });
        }
      } else {
        button_line = new_dom_element({
          parentNode: file_container,
          className: "line_button",
          nodeName: "div"
        });
        text = new_dom_element({
          parentNode: button_line,
          nodeName: "div",
          className: "use_button",
          txt: "use",
          style: {
            color: "#4dbce9"
          },
          onclick: __bind(function(evt) {
            this.open_2(sorted[i], this.path());
            return this.cancel_natural_hotkeys(evt);
          }, this)
        });
      }
      return text = new_dom_element({
        parentNode: file_container,
        className: "linkDirectory",
        nodeName: "div",
        txt: elem.name.get() + stext,
        onclick: __bind(function(evt) {
          return this.rename_file(text, sorted[i]);
        }, this)
      });
    }, this);
    for (i = 0, _len3 = sorted.length; i < _len3; i++) {
      elem = sorted[i];
      _fn(elem, i);
    }
    if (this.use_breadcrumb) {
      this.draw_breadcrumb();
    }
    return bottom = new_dom_element({
      parentNode: this.all_file_container,
      nodeName: "div",
      style: {
        clear: "both"
      }
    });
  };
  AdminModelEditorItem_Directory.prototype.path = function() {
    return "test_need_to_be_complete";
  };
  AdminModelEditorItem_Directory.prototype.share_popup = function(evt, elem, name_folder) {
    var Pheight, Pleft, Ptop, Pwidth, email, fs, ia, line_div, link_modifie_informations, login, name_div, p, value_div;
    email = prompt("share '" + name_folder + "' with (is'sim login) ?");
    ia = email.indexOf("@");
    if (ia < 0) {
      return alert("Please enter a valid login (email adress)");
    }
    login = email;
    console.log(email, ia, login);
    fs = FileSystem.get_inst();
    fs.load("/" + login, function(home, err) {
      if (err) {
        return alert("Please enter a valid login (email adress --)");
      }
      return fs.load_or_make_dir("/" + login + "/inbox", function(inbox, err) {
        var ip, nn;
        if (err) {
          return alert("??");
        }
        nn = name_folder;
        while (inbox.has(nn)) {
          ip = nn.indexOf(".");
          if (ip < 0) {
            ip = nn.length;
          }
          nn = nn.slice(0, ip) + "_" + nn.slice(ip, nn.length);
        }
        return inbox.push(elem);
      });
    });
    return;
    this.popup_share_div = new_dom_element({
      id: "popup_share_div"
    });
    Ptop = 100;
    Pleft = 100;
    Pwidth = 800;
    Pheight = 260;
    this.container_share_div = new_dom_element({
      parentNode: this.popup_share_div,
      className: "container_share_div",
      nodeName: "div",
      style: {
        height: 200,
        width: 200,
        margin: "0px 0 0 10px"
      }
    });
    this.share_user_information_div = new_dom_element({
      parentNode: this.popup_share_div,
      className: "share_user_information_div",
      nodeName: "div",
      style: {
        cssFloat: "left",
        height: 200,
        width: 560,
        margin: "0px 0 0 0px"
      }
    });
    line_div = new_dom_element({
      parentNode: this.share_user_information_div,
      nodeName: "div",
      style: {
        cssFloat: "left",
        height: 40,
        width: "100%",
        fontSize: "18px",
        background: "#262626",
        margin: "60px 0 0 0px"
      }
    });
    name_div = new_dom_element({
      parentNode: line_div,
      nodeName: "div",
      txt: " email : ",
      style: {
        cssFloat: "left",
        height: 30,
        width: 100,
        margin: "10px 0 0 10px"
      }
    });
    value_div = new_dom_element({
      parentNode: line_div,
      nodeName: "input",
      id: "share_email_input",
      style: {
        cssFloat: "left",
        height: 30,
        width: 400,
        margin: "5px 0 0 0px",
        fontWeight: "bold"
      }
    });
    link_modifie_informations = new_dom_element({
      parentNode: this.share_user_information_div,
      nodeName: "button",
      txt: "Share",
      className: "user_line",
      style: {
        height: 40,
        width: 100,
        border: "none",
        margin: "15px 60px 0 0",
        cssFloat: "right",
        fontSize: "18px",
        color: "#262626",
        cursor: "pointer",
        background: "#4dbce9",
        onmousedown: __bind(function(evt) {}, this)
      }
    });
    return p = new_popup("Share: " + name_folder, {
      event: evt,
      child: this.popup_share_div,
      top_x: Pleft,
      top_y: Ptop,
      width: Pwidth,
      height: Pheight,
      background: "#262626",
      onclose: __bind(function() {
        return this.onPopupClose();
      }, this)
    });
  };
  AdminModelEditorItem_Directory.prototype.onPopupClose = function() {
    document.onkeydown = void 0;
    return this.clear_page(this.popup_share_div);
  };
  AdminModelEditorItem_Directory.prototype.clear_page = function(div_to_clear) {
    var _results;
    _results = [];
    while (div_to_clear.firstChild != null) {
      _results.push(div_to_clear.removeChild(div_to_clear.firstChild));
    }
    return _results;
  };
  AdminModelEditorItem_Directory.add_action = function(model_type, fun) {
    if (!(ModelEditorItem_Directory._action_list[model_type] != null)) {
      ModelEditorItem_Directory._action_list[model_type] = [];
    }
    return ModelEditorItem_Directory._action_list[model_type].push(fun);
  };
  AdminModelEditorItem_Directory.add_action_2 = function(model_type, fun) {
    if (!(ModelEditorItem_Directory._action_list_2[model_type] != null)) {
      ModelEditorItem_Directory._action_list_2[model_type] = [];
    }
    return ModelEditorItem_Directory._action_list_2[model_type].push(fun);
  };
  return AdminModelEditorItem_Directory;
})();
ModelEditorItem.default_types.unshift(function(model) {
  if (model instanceof Directory) {
    return ModelEditorItem_Directory;
  }
});var AdminDeskNavigatorView;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
AdminDeskNavigatorView = (function() {
  __extends(AdminDeskNavigatorView, View);
  function AdminDeskNavigatorView(el, tree_app, params) {
    this.el = el;
    this.tree_app = tree_app;
    if (params == null) {
      params = {};
    }
    this.AdminDeskNavigatorView = __bind(this.AdminDeskNavigatorView, this);;
    this.AdminDeskNavigatorView = __bind(this.AdminDeskNavigatorView, this);;
    this.get_fs_instance = __bind(this.get_fs_instance, this);;
    this.app_data = this.tree_app.data;
    AdminDeskNavigatorView.__super__.constructor.call(this, this.app_data);
    this.icon_container = new_dom_element({
      nodeName: "div",
      parentNode: this.el,
      style: {
        padding: "0 0 0 0"
      }
    });
  }
  AdminDeskNavigatorView.prototype.onchange = function() {
    var Organisation_dir, Projects_dir, admin_list, application_list, block, config, fs, user_list;
    if (this.app_data.selected_list_desk_items.has_been_directly_modified) {
      while (this.icon_container.firstChild != null) {
        this.icon_container.removeChild(this.icon_container.firstChild);
      }
      block = new_dom_element({
        parentNode: this.icon_container,
        nodeName: "span"
      });
      if (this.app_data.selected_list_desk_items[0]._name.get() === "Projects") {
        Projects_dir = FileSystem._home_dir + "/__projects__";
        fs = this.get_fs_instance();
        return fs.load_or_make_dir(Projects_dir, function(current_dir, err) {
          var test;
          return test = new ModelEditorItem_Project({
            el: block,
            model: current_dir
          });
        });
      } else if (this.app_data.selected_list_desk_items[0]._name.get() === "Files") {
        fs = this.get_fs_instance();
        return fs.load_or_make_dir(FileSystem._home_dir, function(session_dir, err) {
          var test;
          return test = new AdminModelEditorItem_Directory({
            el: block,
            model: session_dir,
            use_icons: true,
            use_upload: true,
            use_breadcrumb: true,
            display: "all"
          });
        });
      } else if (this.app_data.selected_list_desk_items[0]._name.get() === "Organisations") {
        Organisation_dir = FileSystem._home_dir + "/__organisations__";
        config = this.app_data.config;
        fs = this.get_fs_instance();
        return fs.load_or_make_dir(Organisation_dir, function(current_dir, err) {
          var test;
          return test = new ModelEditorItem_Organisation({
            el: block,
            model: current_dir,
            config: config
          });
        });
      } else if (this.app_data.selected_list_desk_items[0]._name.get() === "Applications") {
        return application_list = new ModelEditorItem_Application({
          el: block,
          model: this.app_data.config.selected_organisation[0].list_applications,
          use_icons: true,
          config: this.app_data.config
        });
      } else if (this.app_data.selected_list_desk_items[0]._name.get() === "Admin") {
        DeskNavigatorView.new_admin_button(block, this);
        return admin_list = new ModelEditorItem_User({
          el: block,
          model: this.app_data.config.selected_organisation[0].admin_users
        });
      } else if (this.app_data.selected_list_desk_items[0]._name.get() === "Users") {
        DeskNavigatorView.new_users_button(block, this);
        return user_list = new ModelEditorItem_User({
          el: block,
          model: this.app_data.config.selected_organisation[0].list_users
        });
      }
    }
  };
  AdminDeskNavigatorView.prototype.get_fs_instance = function() {
    var fs;
    if ((typeof FileSystem != "undefined" && FileSystem !== null) && (FileSystem.get_inst() != null)) {
      fs = FileSystem.get_inst();
      return fs;
    } else {
      fs = new FileSystem;
      FileSystem._disp = false;
      return fs;
    }
  };
  AdminDeskNavigatorView.new_users_button = function(block, dnv) {
    var div_top;
    div_top = new_dom_element({
      parentNode: block,
      className: "desk_panel_title"
    });
    return new_dom_element({
      parentNode: div_top,
      nodeName: "div",
      txt: "Users",
      style: {
        margin: "5px 20px 0px 0px",
        height: "30px",
        cssFloat: "left"
      }
    });
  };
  AdminDeskNavigatorView.new_admin_button = function(block, dnv) {
    var div_top;
    div_top = new_dom_element({
      parentNode: block,
      className: "desk_panel_title"
    });
    return new_dom_element({
      parentNode: div_top,
      nodeName: "div",
      txt: "Admin users",
      style: {
        margin: "5px 20px 0px 0px",
        height: "30px",
        cssFloat: "left"
      }
    });
  };
  return AdminDeskNavigatorView;
})();