## 问题提出
最近在写一个tooltip组件的时候，发现了一个坑：一个position为fixed的元素，它的子元素无论z-index设置为多少，都无法覆盖另外一个position为fixed的元素（在html中后出现）。如下面的代码所示：
```
<div class="fixed position0"></div>
<div class="fixed position1">
	<div class="popup"></div>
</div>
<div class="fixed position3">
	<div class="popup"></div>
</div>
<div class="fixed position2"></div>

<style>
.fixed {
	position: fixed;
	width: 100px;
	height: 100px;
	background-color: rgba(0, 0, 255, 0.5);
}

.position0 {
	bottom: 100px;
	right: 110px;
}

.position1 {
	bottom: 0;
	right: 110px;
}

.position2 {
	bottom: 100px;
	right: 0;
}

.position3 {
	bottom: 0;
	right: 0;
}

.popup {
	position: relative;
	height: 100%;
	background-color: rgba(255, 0, 0, 0.5);
	bottom: 50%;
	z-index: 10000;
}
</style>
```


上述代码的效果如右下角所示。position0、position1、positio2、position3分别为左上、左下、右上、右下的蓝色正方形，其中position1、position3中各有一个`z-index:10000`popup的红色正方形，我们称之为popup1和popup3。经过测试发现，在chrome(54.0.2840.99)浏览器中，popup1可以遮盖position0而popup3不能遮盖position2;而在firefox(43.0.4)浏览器中，popup3可以遮盖position2。


<div class="fixed position0"></div>
<div class="fixed position1">
	<div class="popup"></div>
</div>
<div class="fixed position3">
	<div class="popup"></div>
</div>
<div class="fixed position2"></div>

<style>
.fixed {
	position: fixed;
	width: 100px;
	height: 100px;
	background-color: rgba(0, 0, 255, 0.5);
}

.position0 {
	bottom: 100px;
	right: 110px;
}

.position1 {
	bottom: 0;
	right: 110px;
}

.position2 {
	bottom: 100px;
	right: 0;
}

.position3 {
	bottom: 0;
	right: 0;
}

.popup {
	position: relative;
	height: 100%;
	background-color: rgba(255, 0, 0, 0.5);
	bottom: 50%;
	z-index: 10000;
}
</style>

## Preliminary:z-index
我们先来复习一下z-index这个属性吧。

根据[W3C](https://www.w3.org/TR/CSS22/visuren.html#layers)的规定，对于一个定位元素(positioned box), z-index属性指定了：
1. The stack level of the box in the current stacking context.
2. Whether the box establishes a stacking context.

有一个很重要的概念stacking context : The order in which the rendering tree is painted onto the canvas is described in terms of stacking contexts. Stacking contexts can contain further stacking contexts. A stacking context is atomic from the point of view of its parent stacking context; boxes in other stacking contexts may not come between any of its boxes.

stacking context按如下顺序自底而上渲染:
1. the background and borders of the element forming the stacking context.
1. the child stacking contexts with negative stack levels (most negative first).
1. the in-flow, non-inline-level, non-positioned descendants.
1. the non-positioned floats.
1. the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks.
1. the child stacking contexts with stack level 0 and the positioned descendants with stack level 0.
1. the child stacking contexts with positive stack levels (least positive first).

对于浮动的块元素来说，层叠顺序变得有些不同。浮动块元素被放置于非定位块元素与定位块元素之间：

MDN给出了一些[Stacking and float](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/Stacking_and_float)的例子，这些例子的展示其实是由问题的。在这些例子中positioned box和floated box是按在HTML出现的顺序来确定他们的渲染层次，看似不遵从我们上面描述的顺序。这是因为在这个例子中使用了CSS3中的[opacity](https://www.w3.org/TR/2011/REC-css3-color-20110607/)属性，这个属性会创建一个stacking context,原因如下：

>Since an element with opacity less than 1 is composited from a single offscreen image, content outside of it cannot be layered in z-order between pieces of content inside of it. For the same reason, implementations must create a new stacking context for any element with opacity less than 1.

因此，在[Stacking and float](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/Stacking_and_float)这个例子中，positioned box和floated box其实都是"the child stacking contexts with stack level 0 and the positioned descendants with stack level 0"。

## 解决问题

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context)列出了会生成stacking context的条件/场景：
1. 根元素 (HTML),
1. z-index 值不为 "auto"的 绝对/相对定位，
1. 一个 z-index 值不为 "auto"的 flex 项目 (flex item)，即：父元素 display: flex|inline-flex，
1. opacity 属性值小于 1 的元素（参考 the specification for opacity），
1. transform 属性值不为 "none"的元素，
1. mix-blend-mode 属性值不为 "normal"的元素，
1. filter值不为“none”的元素，
1. perspective值不为“none”的元素，
1. isolation 属性被设置为 "isolate"的元素，
1. position: fixed
1. 在 will-change 中指定了任意 CSS 属性，即便你没有直接指定这些属性的值
1. -webkit-overflow-scrolling 属性被设置 "touch"的元素

可以看到，除了上面提到的opacity属性小于1的元素，还有position属性设置为fixed的元素，这就解释了我们遇到的问题。

那么，怎么解决呢？

我目前使用的解决方案是用absolute来模拟fixed。






