var APPS, MAIN_DIV, USER_EMAIL, include_session, launch_softdemo, new_session;
MAIN_DIV = document.body;
USER_EMAIL = "";
APPS = new Lst;
include_session = function(td) {};
new_session = function() {
  var td;
  td = new DemoTreeAppData;
  td.new_session();
  include_session(td);
  return td;
};
launch_softdemo = function(main) {
  var ApplicationItem, bs, fs, hash, new_archive, new_demo_session, this_demo_app;
  if (main == null) {
    main = document.body;
  }
  FileSystem._userid = "168";
  MAIN_DIV = main;
  bs = new BrowserState;
  hash = bs.location.hash.get();
  if (hash.length > 1) {
    ApplicationItem = decodeURIComponent(hash.slice(1));
    console.log(ApplicationItem);
  } else {
    alert("erreur");
  }
  eval("var demo_application = new " + ApplicationItem + ";");
  this_demo_app = demo_application;
  APPS = this_demo_app.associated_application();
  FileSystem._home_dir = "__archives__/" + this_demo_app.directory.get();
  bs = new BrowserState;
  fs = new FileSystem;
  new_demo_session = new_session();
  new_archive = "";
  return fs.load_or_make_dir(FileSystem._home_dir, function(current_dir, err) {
    var dir, nd;
    nd = new Directory;
    new_archive = current_dir.force_add_file(this_demo_app.demo_app.get(), nd);
    dir = "__archives__/" + (this_demo_app.directory.get()) + "/" + (new_archive.name.get());
    FileSystem._home_dir = dir;
    console.log(dir);
    return fs.load_or_make_dir(dir, function(actual_dir, err) {
      var current_session;
      actual_dir.add_file("Session", new_demo_session, {
        model_type: "Session",
        icon: "session"
      });
      return current_session = fs.load("" + dir + "/Session", function(td, err) {
        var app;
        td.modules.push(new TreeAppModule_UndoManager);
        td.modules.push(new TreeAppModule_PanelManager);
        td.modules.push(new TreeAppModule_File({
          name: "Demo files",
          home_dir: "__demos__/" + this_demo_app.directory.get(),
          use_icons: false,
          use_upload: false,
          use_manage: false
        }));
        td.modules.push(new TreeAppModule_File({
          name: "Test with my files",
          home_dir: dir,
          use_icons: false,
          use_upload: true
        }));
        td.modules.push(new TreeAppModule_Apps(false));
        td.modules.push(new TreeAppModule_Animation);
        td.modules.push(new TreeAppModule_TreeView);
        this_demo_app.run_demo(td);
        return app = new TreeApp(main, td, false);
      });
    });
  });
};var DemoTreeAppData;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
DemoTreeAppData = (function() {
  __extends(DemoTreeAppData, TreeAppData);
  function DemoTreeAppData() {
    DemoTreeAppData.__super__.constructor.call(this);
  }
  DemoTreeAppData.prototype.display_framework = function() {
    var d;
    d = new DisplaySettingsItem({
      sep_norm: 0,
      children: [
        {
          panel_id: "ContextBar",
          immortal: true,
          min_size: [60, 0],
          max_size: [65, 1e5]
        }, {
          sep_norm: 0,
          children: [
            {
              sep_norm: 1,
              children: [
                {
                  panel_id: "TreeView",
                  immortal: true
                }, {
                  strength: 1,
                  panel_id: "EditView",
                  immortal: true
                }
              ]
            }, {
              panel_id: "MainView",
              strength: 3
            }
          ]
        }
      ]
    });
    return d;
  };
  return DemoTreeAppData;
})();