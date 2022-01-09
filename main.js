import Vue from "vue";
import App from "./App";
import router from './router' //index.js는 생략해도 된다.

new Vue({
  el: "#app",
  router,
  render: (h) => h(App),
});
