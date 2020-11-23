import Vue from "vue";
import VueRouter from "vue-router";
import PermissionList from '../components/PermissionList'
import Permission from '../components/Permission'
Vue.use(VueRouter);

export default new VueRouter({
    mode: "history",
    routes: [
        { path: "/", component: PermissionList },
        { path: "/permission/:op(create|edit)/:id(\\d+)?", component: Permission },
        { path: "*", redirect: "/" }
    ]
})