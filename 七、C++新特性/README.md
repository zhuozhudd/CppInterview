## 七、C++新特性：

### 0 - 新特性概览

#### C++11新特性（按重要程度排序）

- Automatic Type Deduction with auto 自动类型推导 auto decltype（1）

- nullptr and nullptr_t （2）
- ranged-based for statement  for循环 （3）
- STL 新增容器 （4）
- shared_ptr、weak_ptr （5）
- 多线程库 （6）
- lambda （7）
- final （8）
- =default = delete  （9）
- delegating constructor 委托构造（10）
- In-class member initializer 成员变量初始化  （11）
- Type Alias  类型别名 using 关键字 （12）
- uniform_initialization 一致性初始化 （13）
- initializer_list  列表初始化容器 （14）
- override (15)
- noexcept （16）
- turple（17）
- Variadic Templates 可变参数模板
- Rvalue reference 右值引用

#### C++14的一些新特性

-  decltype(auto)

-  auto 推导函数返回值

-  智能指针创建 make_unique()

-  泛型的 lambda



### 1 - auto / decltype 自动类型推导（auto type deduction）

这其实是一个非常“老”的特性，C++ 之父 Bjarne Stroustrup（B·S ) 早在 C++ 诞生之初就设计并实现了它，但因为与早期 C 语言的语义有冲突，所以被“雪藏”了近三十年。直到 C99 消除了兼容性问题，C++11 才让它再度登场亮相。

- auto 的“自动推导”能力只能用在“初始化”的场合。
- 在类成员变量初始化的时候，目前的 C++ 标准不允许使用 auto 推导类型



#### auto 推导规则

- auto 总是推导出“值类型”，绝不会是“引用”；
- auto 可以附加上 const、volatile、*、& 这样的类型修饰符，得到新的类型

```cpp
auto        x = 10L;    // auto推导为long，x是long
auto&       x1 = x;      // auto推导为long，x1是long&
auto*       x2 = &x;    // auto推导为long，x2是long*
const auto& x3 = x;        // auto推导为long，x3是const long&
auto        x4 = &x3;    // auto推导为const long*，x4是const long*
```

auto 的“最佳实践”，就是“range-based for”，不需要关心容器元素类型、迭代器返回值和首末位置，就能完成遍历操作。为了保证效率，最好使用“const auto&”或者“auto&”。

```cpp
vector<int> v = {2,3,5,7,11};  // vector顺序容器

for(const auto& i : v) {      // 常引用方式访问元素，避免拷贝代价
     cout << i << ",";          // 常引用不会改变元素的值
 }

for(auto& i : v) {          // 引用方式访问元素
     i++;                      // 可以改变元素的值
     cout << i << ",";
 }
```



#### decltype

- decltype 的形式很像函数，后面的圆括号里就是可用于计算类型的表达式（和 sizeof 有点类似），其他和 auto 一样，也能加上 c



### 2 - nullptr nullptr_t

#### C 的 NULL

C语言中使用NULL表示空指针，NULL通常被定义为：

```cpp
#define NULL ((void *)0)

int *i = NULL;
foo_t *f = NULL;
```

NULL实际上是一个void *的指针，如果void *指针赋值给int *和foo_t *的指针的时候，隐式转换成相应的类型。而如果换做一个C++编译器来编译的话是要出错的，**因为C++是强类型的，void *是不能隐式转换成其他指针类型的，**所以通常情况下，编译器提供的头文件会这样定义NULL：

```cpp
#ifdef __cplusplus ---简称：cpp c++ 文件
#define NULL 0
#else
#define NULL ((void *)0)
#endif
```

#### C++ 的 0

C++中引入0来表示空指针，但是在函数重载时会发生问题，代码如下：

```cpp
void fun(type1 a, type2 *b);
void fun(type1 a, int i);
```

#### C++11 的 nullptr

由于用NULL代替空指针在C++程序中的存在二义性问题，在C++11版本中引入了nullptr这一新的关键字来代指空指针

nullptr并非整型类别，甚至也不是指针类型，但是能转换成任意指针类型。nullptr的实际类型是std:nullptr_t



### 3 - range-based for statement - for循环

```cpp
for(decl:col) {
    statement
}
```



### 4 - STL 新增容器

- std::array
- std::forward_list
- std::unordered_map
- std::unordered_set

### 5 - 智能指针内存管理

- std::shared_ptr
- std::wear_ptr

### 6 - 多线程

- std::thread
- std::atomic
- std::condition_variable

### 7 - lambda 函数式编程

#### lambda 的形式

C++ 没有为 lambda 表达式引入新的关键字，并没有“lambda”这样的词汇，而是用了一个特殊的形式“[]”，术语叫“lambda 引出符”（lambda introducer）。在 lambda 引出符后面，就可以像普通函数那样，用圆括号声明入口参数，用花括号定义函数体。

```cpp
auto f1 = [](){};      // 相当于空函数，什么也不做


auto f2 = []()                 // 定义一个lambda表达式
{
    cout << "lambda f2" << endl;

    auto f3 = [](int x)         // 嵌套定义lambda表达式
    {
        return x*x;
    };// lambda f3              // 使用注释显式说明表达式结束

    cout << f3(10) << endl;
};  // lambda f2               // 使用注释显式说明表达式结束
```

 C++ 里，每个 lambda 表达式都会有一个独特的类型，而这个类型只有编译器才知道，我们是无法直接写出来的，所以必须用 auto。

不过，因为 lambda 表达式毕竟不是普通的变量，所以 C++ 也鼓励程序员**尽量“匿名”使用 lambda 表达式。**也就是说，它不必显式赋值给一个有名字的变量，直接声明就能用。

**由于“匿名”，lambda 表达式调用完后也就不存在了（也有被拷贝保存的可能），这就最小化了它的影响范围，让代码更加安全。**

```cpp
vector<int> v = {3, 1, 8, 5, 0};     // 标准容器

cout << *find_if(begin(v), end(v),   // 标准库里的查找算法
            [](int x)                // 匿名lambda表达式，不需要auto赋值
            {
                return x >= 5;        // 用做算法的谓词判断条件 
            }                        // lambda表达式结束
        )
     << endl;                        // 语句执行完，lambda表达式就不存在了
```

- `find_if() `的第三个参数是一个 lambda 表达式的谓词。这个 lambda 表达式以值的方式捕获 value，并在 lambda 参数大于 value 时返回 true。

#### lambda的变量捕获

lambda 的“捕获”功能需要在“[]”里做文章，由于实际的规则太多太细，记忆、理解的成本高，所以记住几个要点：

- “[=]”表示按值捕获所有外部变量，表达式内部是值的拷贝，并且不能修改；
- “[&]”是按引用捕获所有外部变量，内部以引用的方式使用，可以修改；
- 也可以在“[]”里明确写出外部变量名，指定按值或者按引用捕获，C++ 在这里给予了非常大的灵活性。

```cpp
int x = 33;               // 一个外部变量

auto f1 = [=]()           // lambda表达式，用“=”按值捕获
{
    //x += 10;            // x只读，不允许修改
};

auto f2 = [&]()         // lambda表达式，用“&”按引用捕获
{
    x += 10;            // x是引用，可以修改
};

auto f3 = [=, &x]()       // lambda表达式，用“&”按引用捕获x，其他的按值捕获
{
    x += 20;              // x是引用，可以修改
};
```

在使用捕获功能的时候要小心，对于“就地”使用的小 lambda 表达式，可以用“[&]”来减少代码量，保持整洁；而对于非本地调用、生命周期较长的 lambda 表达式应慎用“[&]”捕获引用，而且，最好是在“[]”里显式写出变量列表，避免捕获不必要的变量。

```cpp
class DemoLambda final
{
private:
    int x = 0;
public:
    auto print()              // 返回一个lambda表达式供外部使用
    {
        return [this]()      // 显式捕获this指针
        {
            cout << "member = " << x << endl;
        };
    }
};
```

#### 泛型的 lambda

C++14 里，lambda 表达式可以实现“泛型化”，相当于简化了的模板函数，具体语法利用了 auto：

```cpp
auto f = [](const auto& x)        // 参数使用auto声明，泛型化
{
    return x + x;
};

cout << f(3) << endl;             // 参数类型是int
cout << f(0.618) << endl;         // 参数类型是double

string str = "matrix";
cout << f(str) << endl;          // 参数类型是string
```



### 8 - final 关键字

C++11 新增了一个特殊的标识符 `final`（注意，它不是关键字），把它用于类定义，可以显式地禁用继承，防止其他人有意或者无意地产生派生类。无论是对人还是对编译器，效果都非常好，建议积极使用。

```cpp
class DemoClass final    // 禁止任何人继承我
{ ... };
```

在必须使用继承的场合，建议你只使用` public `继承，避免使用 `virtual`、`protected`，因为它们会让父类与子类的关系变得难以捉摸，带来很多麻烦。当到达继承体系底层时，也要及时使用`final`，终止继承关系。

```cpp
class Interface        // 接口类定义，没有final，可以被继承
{ ... };           

class Implement final : // 实现类，final禁止再被继承
      public Interface    // 只用public继承
{ ... };
```



### 9 - = default  和 = delete

`= default` 和 `=delete` 是 C++11 新增的专门用于六大基本函数的用法，对于比较重要的构造函数和析构函数，应该用`= default`的形式，明确地告诉编译器（和代码阅读者）：“应该实现这个函数，但我不想自己写。”这样编译器就得到了明确的指示，可以做更好的优化。

```cpp
class DemoClass final 
{
public:
    DemoClass() = default;  // 明确告诉编译器，使用默认实现
   ~DemoClass() = default;  // 明确告诉编译器，使用默认实现
};
```

另一种 `= delete` 的形式。表示明确地禁用某个函数形式，且不限于构造 / 析构，可以用于任何函数（成员函数、自由函数）。

比如说，如果想要禁止对象拷贝，就可以用这种语法显式地把拷贝构造和拷贝赋值`delete`掉，让外界无法调用。

```cpp
class DemoClass final 
{
public:
    DemoClass(const DemoClass&) = delete;              // 禁止拷贝构造
    DemoClass& operator=(const DemoClass&) = delete;  // 禁止拷贝赋值
};
```

### 10 - 委托构造 （delegating constructor）

如果类有多个不同形式的构造函数，为了初始化成员肯定会产生大量的重复代码。为了避免重复，可以使用“委托构造”的新特性，一个构造函数直接调用另一个构造函数，把构造工作“委托”出去，既简单又高效。

```cpp
class DemoDelegating final
{
private:
    int a;                              // 成员变量
public:
    DemoDelegating(int x) : a(x)        // 基本的构造函数
    {}  

    DemoDelegating() :                 // 无参数的构造函数
        DemoDelegating(0)               // 给出默认值，委托给第一个构造函数
    {}  

    DemoDelegating(const string& s) : // 字符串参数构造函数
        DemoDelegating(stoi(s))        // 转换成整数，再委托给第一个构造函数
    {}  
};
```

### 11 - 成员变量初始化  （In-class member initializer）

如果类中有很多成员变量，那么在写构造函数的时候就比较麻烦，必须写出一长串的名字来逐个初始化，易遗漏成员，造成未初始化的隐患。在 C++11 里，可以在类里声明变量的同时给它赋值，实现初始化。

```cpp
class DemoInit final                  // 有很多成员变量的类
{
private:
    int                 a = 0;        // 整数成员，赋值初始化
    string              s = "hello";  // 字符串成员，赋值初始化
    vector<int>         v{1, 2, 3};   // 容器成员，使用花括号的初始化列表
public:
    DemoInit() = default;             // 默认构造函数
   ~DemoInit() = default;             // 默认析构函数
public:
    DemoInit(int x) : a(x) {}         // 可以单独初始化成员，其他用默认值
};

```



### 12 - 类型别名（Type Alias）using 关键字

C++11 扩展了关键字 using 的用法，增加了 typedef 的能力，可以定义类型别名。它的格式与 typedef 正好相反，别名在左边，原名在右边，是标准的赋值形式，所以易写易读。

```cpp
using uint_t = unsigned int;        // using别名
typedef unsigned int uint_t；      // 等价的typedef
```

应用举例：在用到一些外部类型，如标准库中的string、vector，带上名字空间、模板参数会使名字很长，使用类型别名可以进行简化，增强可读性。

```cpp
class DemoClass final
{
public:
    using this_type         = DemoClass;          // 给自己也起个别名
    using kafka_conf_type   = KafkaConfig;        // 外部类起别名

public:
    using string_type   = std::string;            // 字符串类型别名
    using uint32_type   = uint32_t;              // 整数类型别名

    using set_type      = std::set<int>;          // 集合类型别名
    using vector_type   = std::vector<std::string>;// 容器类型别名

private:
    string_type     m_name  = "tom";              // 使用类型别名声明变量
    uint32_type     m_age   = 23;                  // 使用类型别名声明变量
    set_type        m_books;                      // 使用类型别名声明变量

private:
    kafka_conf_type m_conf;                       // 使用类型别名声明变量
};
```



- onst、*、& 来修饰。

- 因为它已经自带表达式，所以不需要变量后面再有表达式，也就是说可以直接声明变量。

```cpp
int x = 0;          // 整型变量

decltype(x)     x1;      // 推导为int，x1是int
decltype(x)&    x2 = x;    // 推导为int，x2是int&，引用必须赋值
decltype(x)*    x3;      // 推导为int，x3是int*
decltype(&x)    x4;      // 推导为int*，x4是int*
decltype(&x)*   x5;      // 推导为int*，x5是int**
decltype(x2)    x6 = x2;  // 推导为int&，x6是int&，引用必须赋值
```

- 完全可以把 decltype 看成是一个真正的类型名，用在变量声明、函数参数 / 返回值、模板参数等任何类型能出现的地方，只不过这个类型是在编译阶段通过表达式“计算”得到的。
- **decltype 不仅能够推导出值类型，还能够推导出引用类型，也就是表达式的“原始类型”。**

decltype是 auto 的高级形式，更侧重于编译阶段的类型计算，所以常用在泛型编程里，获取各种类型，配合 typedef 或者 using 会更加方便。

```cpp
// UNIX信号函数的原型，看着就让人晕，你能手写出函数指针吗？
void (*signal(int signo, void (*func)(int)))(int)

// 使用decltype可以轻松得到函数指针类型
using sig_func_ptr_t = decltype(&signal) ;
```

由于类中不能使用auto，所以可以使用decltype变通实现auto功能

```cpp
class DemoClass final
{
public:
    using set_type = std::set<int>;  // 集合类型别名
private:
    set_type      m_set;                   // 使用别名定义成员变量

    // 使用decltype计算表达式的类型，定义别名
    using iter_type = decltype(m_set.begin());
    iter_type     m_pos;                   // 类型别名定义成员变量
};
```



### 13 - uniform_initialization 一致性初始化

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main() {
    int value[]{1, 2, 3};       // initializer_list<T> 会关联一个array<T,n> 里面元素被编译器逐一分解传给函数
    vector<int> v{2, 3, 5};
    return 0;
}
```



### 14 - initializer_list

```cpp
#include<iostream>
#include<vector>

using namespace std;
int main() {
	vector<int> vc({ 1,2,3,4 });	//这里调用了构造函数，实参为{1,2,3,4}
	return 0;
}
```



### 15 - Override

```cpp
#include <iostream>

using namespace std;

class Base {
public:
    Base(){}
    virtual void func() {}
};
class Derivered:public Base{
    virtual void func(int) override {}  //error: ‘virtual void Derivered::func(int)’ marked ‘override’, but does not override
};
// override用于虚函数，上面的virtual void func(int)实际上不是重写父类的虚函数，而是定义一个新的虚函数，
// 我们的本意是重写虚函数，当不加overrride的时候,这样写编译器不会报错，
// 那如果像下面加上override的话，则会报错，表示告诉了编译器，我确实要重写，但写错了，没有重写，于是就报错了,
// 这样就能给我们对虚函数的重写做检查!

int main() {
}
```

### 16 - noexcept

```cpp
#include <iostream>
#include <vector>

using namespace std;

// noexcepte ()中可以加条件
// 异常可传递  a调用b b抛出异常,a没处理,就会抛出异常
// 1.异常的回传机制:调用foo如果抛出异常，foo会接着往上层抛出异常，
// 如果最上层没有处理，则会调用terminate函数，terminate函数内部调用abort，使程序退出


// 2.在使用vector deque等容器的移动构造和移动赋值的时候，如果移动构造和移动赋值没有加上noexcept，
// 则容器增长的时候不会调用move constructor，效率就会偏低，所以后面需要加上noexcept，安心使用。

void foo() noexcept(true) {
}

int main() {
    foo();
    vector<int> vec;
    return 0;
}
```

### 17 - turple

```cpp
#include <iostream>
#include <tuple>

using namespace std;

// tuple使用
int main() {
    tuple<int, int, string> t, t1, t2;
    t = make_tuple(1, 2, "qwe");
    t1 = make_tuple(3, 2, "qwe");
    t2 = make_tuple(3, 2, "qwe");
    int a = get<0>(t);
    get<0>(t) = get<1>(t);   // 可以修改
    cout << a << endl;
    cout << (get<0>(t) > get<1>(t) ? "true" : "false") << endl; // 比较大小
    cout << (t1 == t2 ? "true" : "false") << endl;
    typedef tuple<int, int, int, string> T;
    cout << tuple_size<T>::value << endl;   // meta programming 处理类型
    cout << tuple_size<T>::value << endl;
    tuple_element<1, T>::type a1 = 10;
    cout << a1 << endl;
    return 0;
}
```

