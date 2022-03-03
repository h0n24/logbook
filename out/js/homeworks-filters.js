/**
 * Created by vovk on 07.10.2016.
 */
app_module = angular.module("app");
app_module.filter("statusHomeWorksView", [
  "$filter",
  function ($filter) {
    return function (item) {
      if (item && typeof item != "undefined" && item != null) {
        if (item.mark > 0) {
          return "done";
        }
        if (item.overdue && !item.filename) {
          return "notLoaded";
        }
      }
      if (typeof item == "undefined") {
        return "notLoaded";
      }
    };
  },
]);
