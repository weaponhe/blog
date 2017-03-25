## 作用域链
先上例子，一例胜千言。
```javascript
function compare(value1,value2){
	if(value1 < value2){
		return -1;
	}else if(value1 > value2){
		return 1;
	}else{
		return 0;
	}
}
```
![](http://i4.buimg.com/567571/4d4571adc21ef13d.jpg)

要解释清楚什么是作用域链，要了解几个概念：
- 作用域：当然要先知道什么是作用域了。ES5中的作用域和其他常见语言的作用域有些不同，它没有块级作用域。在一个JS程序中，只有两种作用域，一种是全局作用域，另一种是函数作用域。当然，在最新的ES6中已经开始支持块级作用域了。
- 执行环境：执行环境定义了变量或函数有权访问的其他数据，决定了它们各自的行为。每个函数都有自己的执行环境。当执行流进入一个函数时，函数的执行环境就会被推入一个环境栈中，而在函数执行之后，栈将其环境弹出，把控制权交给之前的执行环境，原来的执行环境被销毁，保存在其中的所有变量和函数的定义也随之销毁。全局执行环境始终在栈的最底部。需要强调的时，执行环境是一个运行时概念，或者叫做动态概念，其创建的时机在调用函数时。
- 变量对象：每一个执行环境都有一个与之关联的变量对象，环境中定义的所有变量和函数都保存在这个对象中。

而作用域链，其实是在定义函数的时候创建的一个链表式的数据结构，保存在内部的[[Scope]]属性中，其中的每一项指向一个变量对象。当函数被调用时，作用域会被复制到刚创建的执行环境中。注意（敲黑板），作用域链是一个静态概念，其创建的时机是定义函数时，而执行环境是一个动态的概念，其创建的时机是函数调用时，两者产生关联的时机是函数调用时，作用域链被复制到执行环境中。

也许会有疑问，作用域链是静态的概念，也就是说函数一经定义，作用域链也随之确定，不会再发生改变。而执行环境是动态地随着函数的调用和退出而创建和销毁，变量和函数的定义又保存在和执行环境相关联的变量对象中，如何保证作用域链中指向的变量对象一定存在呢？
在一般情况下，我们在一个局部作用域中定义一个变量，访问这个变量一般在同一个作用域或者是在“更加局部”的作用域中。也就是说，在这种一般情况下，只要当前的函数在执行，它的作用域链上的函数执行环境一定在栈的下面，作用域所指向的变量对象一定存在。
还有一种情况，我们可以在一个函数中返回另一个一个函数，当调用外层函数并返回后，外层函数执行环境出栈并销毁，变量对象也随之销毁，而返回的内层函数却依然能访问外层函数定义的变量和函数，这又是为什么呢？这就引出了下一个概念：闭包。
## 闭包
依然先上例子。
```javascript
function createComparisonFunction(propertyName){
	return function(object1,object2){
		var value1 = object1[propertyName];
		var value2 = object2[propertyName];
		if(value1 < value2){
			return -1;
		}else if(value1 > value2){
			return 1;
		}else{
			return 0;
		}
	}
var compare = createComparisonFunction('age');
var obj1 = {age:1};
var obj2 = {age:2};
compare(obj1,obj2);
compare = null;
}
```
![](http://i4.buimg.com/567571/4a06a8f02b58258d.png)
闭包，是指有权访问另一个函数作用域中的变量的函数。在这个例子中，匿名函数就是一个闭包，因为它有权访问createComparisonFunction作用域中的变量propertyName。按照常规的思维，一个函数返回了，其作用域范围内的局部变量也应随之销毁，但在js中由于作用域链的存在，产生了闭包。
我们一步一步来剖析这个闭包是怎么产生的：
1. 执行流在全局执行环境中，定义createComparisonFunction函数，内部的作用域链[[Scope]]创建，指向了自身的变量对象和全局变量对象。
2. 在全局作用域中调用了createComparisonFunction函数，执行流进入createComparisonFunction函数，createComparisonFunction执行环境被创建，作用域链复制到执行环境中，并被推入栈的顶端。
3. 在定义createComparisonFunction函数中定义了匿名函数，内部的作用域链[[Scope]]创建，指向了自身的变量对象、createComparisonFunction的变量对象和全局变量对象。
3. createComparisonFunction返回了匿名函数赋值给compare，createComparisonFunction执行环境被弹出并销毁，执行流回到全局执行环境。但此时createComparisonFunction的变量对象并没有被销毁，因为匿名函数的作用域链还指向了它。
4. compare函数被调用，执行流进入compare函数，compare执行环境被创建，作用域链复制到执行环境中，并被推入栈的顶端。访问propertyName，最终在createComparisonFunction的活动对象中找到了。
5. compare返回，compare执行环境被弹出并销毁，执行流回到全局执行环境。
6. compare赋予null。此时没有指针指向createComparisonFunction的变量对象和compare的变量对象，等待引擎的回收。
7. 程序退出，全局执行环境被弹出并销毁，全局变量对象被销毁。