# 简介
Vistual Formatting Model(VFM,可视化格式模型)描述的是浏览器如何将文档树展示在屏幕上。文档树中的每一个元素都会根据Box Model生成零到多个盒子，这些盒子的布局由下列因素决定：
- 盒子的尺寸和种类
- 定位的模式（正常流，浮动和绝对定位）
- 元素在文档树中的关系
- 外部信息（视口大小，图片的固有尺寸等等）

##  Containing Blocks
一般情况下，一个盒子的位置和尺寸是根据一个矩形边框计算得出的，这个矩形称为Containing Block。Containing Block的定义如下：
- 根元素的Containing Block称为Initial Containing Block,它和视口的大小一致。
- position属性为'static'和'relative'的元素的Containing Block是最近的Block Container祖先。
- position属性为'fixed'的Containing Block为Initial Containing Block
- position属性为'absolute'的Containing Block是最近的position属性为'absolute','relative'或'fixed的祖先元素。
kuai
# 盒子的生成
## 块级元素和Block Box
'display'属性为'block','list-item'和'table'的元素称为块级元素。
参与BFC(Block Formatting Context)的盒子称为Block-level Box。每一个块级元素生成一个主要Block-level Box，有一些块级元素还会生成额外的盒子，比如'list-item'元素。
除了表格盒子和可替换元素，所有的Block-level Box都是一个block container box.一个block container box要么只包含块级盒子，要么建立一个IFC(Inline Formatting Context)只包含行级盒子。
Not all block container boxes are block-level boxes: non-replaced inline blocks and non-replaced table cells are block containers but not block-level boxes. Block-level boxes that are also block containers are called block boxes.


When an inline box contains an in-flow block-level box, the inline box (and its inline ancestors within the same line box) are broken around the block-level box (and any block-level siblings that are consecutive or separated only by collapsible whitespace and/or out-of-flow elements), splitting the inline box into two boxes (even if either side is empty), one on each side of the block-level box(es). The line boxes before the break and after the break are enclosed in anonymous block boxes, and the block-level box becomes a sibling of those anonymous boxes. When such an inline box is affected by relative positioning, any resulting translation also affects the block-level box contained in the inline box.