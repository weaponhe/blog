### 基本类型和引用类型
首先，Javascript中变量有两种类型：基本类型和引用类型。其中基本类型又分为五种：Undefined，Null，Boolean，Number和String；而引用类型说得通俗一点其实就是以Object.prototype为源头的“字典类型”。这两者的的根本区别在于：
- 基本类型是直接操作内存中的值
- 引用类型操作的是对象的引用（更准确的说法是：当复制保存在对象的某个变量时，操作的是对象的引用；当在为对象添加属性时，操作的时实际的对象）

### 变量复制和参数传递
参数传递本质上就是变量复制，因此，要搞清楚为什么Javascript中函数参数都是值传递，就先要理解变量复制时怎么一回事。
不同于基本类型，保存引用类型的变量所在的内存区域其实保存的不是对象本身，而是一个类似指针的东西。举个栗子。
基本类型：
```javascript
var num1 = 5;
var num2 = num1;
```
![](http://i1.piimg.com/567571/c768730653468a09.jpg)
引用类型：
```javascript
var obj1 = new Object();
var obj2 = obj1;
```
![](http://i4.buimg.com/567571/521680c98876e1ba.jpg)

既然参数传递本质上就是变量复制，那么函数参数和调用函数时的实际参数的行为就应该和变量复制时一样。
```javascript
//基本类型
function fun1(num2){
	num2 += 1;
	return num2;
}
var num1 = 5;
console.log(fun1(num1)); //6
console.log(num1);       //5

//引用类型
function fun2(obj2){
	obj2.num = 2;
}
var obj1 = new Object();
obj1.num = 1;
fun2(obj1);
console.log(obj1.num);  //2
```
这样的例子也许并不能完全说明函数参数时按值传递的，因为在C++里按引用传递也能达到这样的效果。为了证明对象时按值传递的，我们看看下面这个修改过的例子。
```javascript
function setName(obj){
	obj.name = "weapon";
	obj = new Object();
	obj.name = "rio";
}
var person = new Object();
setName(person);
console.log(person.name); //weapon
```
如果时如C++中按应用传递的，那么输出的结果应该是“rio”。可以证明，对象确实是按值传递的。

于是我们可以回答标题中的问题：参数传递时，基本变量传的是值，引用变量传的是引用的值，因此都是按值传递的。