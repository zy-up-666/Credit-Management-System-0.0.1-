<template>
    <el-breadcrumb separator="/">
        <!--第一个面包屑默认首页-->
        <el-breadcrumb-item>
            <router-link to="/home" style="color: black;">首页</router-link>
        </el-breadcrumb-item>
        <!--第二个取路由route的页面栈matched的最后一个-->
        <el-breadcrumb-item v-if="route">
            {{ route }}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    computed: {
        /**
         * 这段代码的作用是根据当前路由的最后一个路由记录的 meta.title 值来动态计算并返回一个新的值给计算属性 route，
         * 用于在页面中展示当前路由的标题。
         * 如果最后一个路由记录的标题是 "首页"，则返回空字符串，以避免显示标题为 "首页" 的情况。
         */
        route() {
            let matched = this.$route.matched;
            return matched[matched.length - 1].meta.title !== "首页" ? matched[matched.length - 1].meta.title : "";
        }
    }
}
</script>

<style lang="scss" scoped></style>
