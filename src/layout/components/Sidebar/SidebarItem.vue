<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
        <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
            <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
                <item :icon="onlyOneChild.meta.icon || (item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title"></item>
            </el-menu-item>
        </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" poppr-append-to-body>
        <template slot="title">
            <item v-if="item.meta" :icon="item.meta&&item.meta.icon" :title="item.meta.title"/>
        </template>
        <sidebar-item v-for="child in item.children" :key="child.path" :isNest="true" :item="child" :basePath="resolvePath(child.path)" class="nest-menu" />
    </el-submenu>
  </div>
</template>
// 情况一：如果只有一个子项；并且子项没有子项，或者子项的子项隐藏了；并且当前项的alwaysShow为false。
// 然后该子项的meta不为空，生成一个指向path地址的链接
// 再然后，根据item.children的meta.icon属性，或者item.meta.icon属性，设置item组件的图标。根据item.children.title设置item组件的标题

// 情况二，如果有至少2个子项，那么创建el-submenu子菜单
// 在顶级元素上使用插槽，设置标题
// 在submenu的子项中，递归使用sidebar组件，可能是el-menu-item，也可能是el-submenu，视情况而定

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item.vue";
import AppLink from "./AppLink.vue";

export default {
  name: "SidebarItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  components: {
    Item,
    AppLink,
  },
  data() {
    this.onlyOneChild = null;
    return {};
  },
  methods: {
    // 判断是否小于等于一个要显示的子项,如果多于一个，返回false。如果一个没有或者只有一个，返回true，并给onlyOneChild赋值
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false;
        } else {
          this.onlyOneChild = item;
          return true;
        }
      });
      if (showingChildren.length === 1) {
        return true;
      }
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }
      return false;
    },

    // 如果传入参数是外部链接，直接返回。如果basePath是外链，直接返回。否则返回basePath与参数合并后的路径
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
  }
};
</script>