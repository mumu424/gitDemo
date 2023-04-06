// 引用router下的index文件
import {router,addRoutes } from "~/router";

import { getToken } from "~/composables/auth"
import { 
    toast,

} from "~/composables/util"
import store from "./store"

// 全局前置守卫
// 解决加载慢的问题
let hasGetInfo = false
router.beforeEach(async(to, from, next) => {
    // to and from are both route objects. must call `next`.
    console.log("全局前置守卫")
    const token = getToken()

    // 没有登录，强制跳转回登录页
    if(!token && to.path != "/login"){
        toast("请先登录","error")
        return next({ path:"/login" })
    }

    // 防止重复登录
    // if(token && to.path == "/login"){
    //     toast("请勿重复登录","error")
    //     return next({ path:from.path ? from.path : "/" })
    // }

    // 如果用户登录了，自动获取用户信息，并存储在vuex当中
    let hasNewRoutes = false
    if(token && !hasGetInfo){
        let {menus} = await store.dispatch("getinfo")

        // 动态添加路由
        hasNewRoutes = addRoutes(menus)
    }

    // // 设置页面标题信息
    // let title = (to.meta.title ? to.meta.title : "") = "商城后台"
    // document.title = title
    // 如果有新路由，添加，旧路由直接跳转
    hasNewRoutes ? next(to.fullPath) : next()
})