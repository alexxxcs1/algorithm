# 算法记录 #

## Geofencing.js ##

地理围栏 右射线 算法，判断坐标是否在地理围栏内，同样的右射线算法能判断触摸点是否在某个轮廓内（用于canvas点击sprite判断）

## canvas 多层级sprite性能优化思路 ##

当存在 多个（如10个） 不同层级的sprite的时候，想要修改中间层级的sprite的属性，往往需要重新渲染 N多次 精灵

原逻辑 : 遍历10个sprite，每个都重新渲染

优化逻辑 ： 获取 需要修改的sprite（下称S） 的层级，将精灵分为 层级大于S 的和 层级小于S 的两个组，将两个组合成两个sprite实例，先渲染 层级小于S的组实例 然后渲染 修改后的S 最后渲染 层级大于S的组实例
