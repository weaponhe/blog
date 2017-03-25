大概有这么几种用来判断一个变量的类型的方法：
typeof
instanceof
Object.prototype.toString()

### typeof
typeof操作符返回一个字符串,表示未经求值的操作数(unevaluated operand)的类型。typeof操作符适用于检测基本数据类型，但在检测引用类型的值时，这个操作符的用处不大。typeof操作符对不同数据类型的返回值如下表：

类型  |返回值
------------- | -------------
Undefined  | "undefined"
布尔值  | "boolean"
数值 | "number"
字符串 | "string"
对象或null | "object"

typeof操作符存在问题是，在比较老版本的Chrome和Safari浏览器上，对正则表达式使用typeof会返回"function"，而我们理解的情况应该要返回"object"。因此，用typeof来判断一个变量是不是函数会出现兼容性问题。
### instanceof
通常，我们并不是想知道某个值时对象，而是想知道它是什么类型的对象。为此ECMAScript提供了instanceof操作符，其语法如下：
```javascript
result = variable instanceof constructor
```
如果变量是给定引用类型的实例，那么instanceof操作符返回`true`。更具体地讲，如果`variable`的原型链上的某个对象的`constructor`属性指向上述代码中的`constructor`，那么返回`true`。
instanceof操作符的问题在于，它假定只有一个全局执行环境。如果网页中包含多个框架，那实际上就存在两个以上不同的全局执行环境，从而存在两个以上不同版本的Array构造函数。如果你从一个框架向另一个框架传入一个数组，那么传入的数组与在第二个框架中的原生创建的数组分别具有各自不同的构造函数。比如下面的代码：
```javascript
var isArray = value instanceof Array;
```
以上代码要返回`true`，`value`必须是一个数组，而且还必须与Array构造函数在同个全局作用域中。如果value是在另一个frame中定义的数组，那么上述代码会返回`false`。因此，通常也不能够用instanceof操作符来检测一个变量是否是一个原生类型的实例，比如判断一个变量是不是函数、一个变量是不是数组等等。
为了解决这个问题，ES5新增了Array.isArray这个方法。
### Object.prototype.toString()
在任何值上调用Object原生的toString(方法)，都会返回一个[object NativeConstructorName]格式的字符串。由于原生类型的构造函数名与全局作用域无关，因此使用toString()就能保证返回一致的值。以你次，我们可以使用Object.prototype.toString()来检测一个变量属于哪种原生类型，如下所示：
```javascript
var isArray = Object.prototype.toString().call(variable);
```


总结一下，如果要检测一个基本数据类型时（function除外），可以使用typeof操作符；如果要检测一个引用类型是否继承自某个自定义类型时，可以使用instanceof操作符；如果要检测一个变量是哪个原生类型的实例时，可以使用Object.prototype.toString()。