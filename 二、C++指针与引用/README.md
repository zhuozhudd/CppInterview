## 二、指针与引用：



### 1 - 指针和引用有什么区别？

**指针是内存地址，指针变量是用来存放内存地址的变量，通过指针寻址到这块内存**。不同类型的指针变量所占用的存储单元长度是相同的，而存放数据的变量因数据的类型不同，所占用的存储空间长度也不同。有了指针以后，不仅可以对数据本身，也可以对存储数据的变量地址进行操作

引用是C++对C语言的重要扩充。**引用就是某一变量的一个别名，对引用的操作与对变量直接操作完全相同**。

两者的主要区别在于：

- **第一、指针有自己的一块内存空间，而引用只是一个变量的别名，无需分配内存空间。**
- **第二、使用sizeof看一个指针的大小是4字节，而sizeof引用得到的是所引用的变量（对象）的大小。**
- 第三、对于指针来说，它是一个地址，地址是一个数值，所以这个数值可以初始化为nullptr，也可以是其他，不初始化时会指向一块随机的内存，而且指针在使用时也可以指向其他对象；但**引用是一个对象的别名，所以不能为空，必须被初始化，且不能改变！**
- 第四、从访问上看，引用访问一个变量是直接访问，而指针访问一个变量是间接访问。
- 第五、作为参数时也不同，指针需要被**解引用**（引用它指向的变量的值）才可以对对象进行操作；直接对引用的修改都会改变引用所指向的对象。
- 最后在使用上的细节上，也有不同，比如：
  - 自增++运算，指针是指向下一个空间，而引用是引用的变量值+1
  - 可以有const指针，但是没有const引用
  - 指针可以有多级，引用不行。
  - **如果返回动态内存分配的对象或者内存，必须使用指针，引用可能引起内存泄露**



### 2 - 什么是智能指针？智能指针有什么作用？分为几种？各自有什么特点？

**（1）什么是智能指针？**

智能指针是一个`RAII`（Resource Acquisition Is Initialization，资源获取就是初始化）类模型，用于动态分配内存，其**设计思想是将基本类型指针封装为类对象指针，并在离开作用域时调用析构函数，使用 delete 删除指针所指向的内存空间。**

**（2）智能指针有什么作用？**

智能指针能够处理 **内存泄露问题** 和 **空悬指针** 问题

**（3）智能指针分为几种？各自有什么特点？**

分为`auto_ptr`、`unique_ptr`、`shared_ptr`、`weak_ptr` 四种

- 对于**`auto_ptr`，实现独占式拥有的概念**，同一时间只能有一个智能指针可以指向该对象；但在C++11中被弃用，主要是因为两点：
  - 对象所有权转移问题，在函数传参过程中，对象所有权不会返还，从而存在潜在的内存崩溃问题
  - 不能指向数组，也不能作为STL容器的成员。
- 对于**`unique_ptr`，实现了独占式拥有的概念**，同一时间只能有一个智能指针可以指向该对象，所以无法进行拷贝构造和拷贝赋值，但是可以进行移动构造和移动赋值
- 对于**`shared_ptr`，实现了共享式拥有的概念**，即多个智能指针可以指向相同的对象，该对象及相关资源会在其所指对象不在使用后自动释放相关资源。
- 对于`weak_ptr`，解决了shared_ptr相互引用时，两个指针的引用计数永远不会减少为0，从而导致死锁的问题。`weak_ptr`是对 对象的一种弱引用，可以绑定到`shared_ptr`上，但不会增加对象的引用计数。



### 3 - 对`auto_ptr`、`unique_ptr`、`shared_ptr`、`weak_ptr` 的理解？

#### auto_ptr

auto_ptr是C++98方案，C++11已经弃用，它采用所有权模式，对于这样的代码：

```cpp
auto_ptr<string> p1 (new string("hello world"));
auto_ptr<string> p2;
p2 = p1; // auto_ptr 不会报错
```

此时不会报错，p2剥夺了p1的所有权，当程序运行访问p1将会报错。所以auto_ptr的缺点是存在潜在的内存崩溃问题。

#### unique_ptr

可以用unique_ptr替换auto_ptr，unique_ptr实现了独占拥有的概念，保证同一时间只能有一个智能指针可以指向该对象。

```cpp
unique_ptr<string> p3 (new string ("unique_ptr"));
unique_ptr<string> p4;
p4 = p3; //　unique_ptr会报错
```

编译器认为 p4 = p3 是非法的，这样就避免了 p3 不再指向有效数据的问题。所以 unique_ptr比auto_ptr更安全。

另外unique_ptr还有一个特性：当程序试图将一个unique_ptr赋值给另一个时，如果源unique_ptr是个临时右值，编译器是允许这么做的；如果源unique_ptr将存在一段时间，编译器还是会禁止，比如：

```cpp
unique_ptr<string> pu1(new string ("hello world"));
unique_ptr<string> pu2;
pu2 = pu1; // # 1 非法
unique_ptr<string> pu3;
pu3 = unique_ptr<string>(new string("OK!"));  // # 2合法
```

#1留下了悬挂的`unique_ptr(pu1)`，这可能导致危害。而#2不会留下悬挂的`unique_ptr`，因为它调用`unique_ptr` 的构造和函数，该构造函数创建的临时对象在其所有权让给 `pu3`后就会销毁。

再比如，定义如下函数：

```cpp
unique_ptr<string> demo(const char * s)
{
    unique_ptr<string> temp(new string(s));
    return temp;
}
```

并编写以下代码：

```cpp
unique_ptr<string> ps;
ps = demo('Uniquely special")；
```

demo()返回一个临时unique_ptr，然后ps接管了原本归返回的unique_ptr所有的对象，而返回时临时的 unique_ptr 被销毁，也就是说没有机会使用 unique_ptr 来访问无效的数据，换句话来说，这种赋值是不会出现任何问题的，即没有理由禁止这种赋值。实际上，编译器允许这种赋值，这正是unique_ptr更聪明的地方。



如果确实想执行类似与#1的操作，可以使用`std::move()`，将一个`unique_ptr`赋给另一个，使用move后，原来的指针仍转让所有权变成空指针，可以对其重新赋值。比如：

```cpp
#include <iostream>
#include <string>
#include <memory>
using namespace std;


int main()
{
    unique_ptr<string> ps1, ps2;
    ps1 = demo("hello");
    ps2 = move(ps1);
    ps1 = demo("world");
    cout << "*ps1 = " << *ps1 << endl;
    cout << "*ps2 = " << *ps2 << endl;
    return 0;
}
```

输出：

```
*ps1 = world
*ps2 = hello
```

#### share_ptr

shared_ptr 实现了共享式拥有概念。多个智能指针可以指向相同对象，该对象和其相关资源会在”最后一个引用被销毁“时释放。它使用计数机制来表明资源被几个指针共享。可以通过 `use_count()`函数来查看资源的所有者的个数。除了可以通过new来构造，还可以通过传入 auto_ptr，unique_ptr，weak_ptr 构造，当调用 release() 时，当前指针会释放资源所有权，计数减去1.当计数等于0时，资源会被释放。

shared_ptr是为了解决auto_ptr在对象所有权上的局限性（auto_ptr是独占的），在使用引用计数的机制上提供了可以共享所有权的智能指针。

成员函数包括：

- `use_count()` 返回引用计数的个数
- `unique()` 返回是否是独占所有权（`use_count() == 1`）
- `swap()` 交换两个 shared_ptr对象（即交换所拥有的对象）
- `reset()` 放弃内部对象的所有权或拥有对象的变更，会引起原有对象的引用计数的减少
- `get()` 返回内部对象（指针），由于已经重载了 `()` 方法，因此和直接使用对象是一样的，如 `shared_ptr sp(new int(1));` `sp` 与`sp.get()` 是等价的



#### weak_ptr

weak_ptr是一种不控制对象声明周期的智能指针，它指向一个shared_ptr管理的对象，进行该对象的内存管理的是那个强引用的shared_ptr，而**weak_ptr只是提供了对管理对象的一个访问手段**。weak_ptr 设计的目的是为配合shared_ptr而引入的一种智能指针来协助shared_ptr工作，它只可以从一个shared_ptr或另一个weak_ptr对象构造，**它的构造和析构不会引起引用计数的增加或减少。**

weak_ptr是用来解决shared_ptr互相引用时的死锁问题，如果两个shared_ptr相互引用，那么这两个指针的引用计数永远不可能下降为0，资源永远不会释放。它是对对象的一种弱引用，不会增加对象的引用计数，和shared_ptr之间可以相互转化，shared_ptr可以直接赋值给它，它也可以通过调用`lock()`函数来获得shared_ptr

```cpp
#include <iostream>
#include <string>
#include <memory>
using namespace std;

class B;

class A
{
public:
    // shared_ptr<B> pb_;
    weak_ptr<B> pb_;
    ~A()
    {
        cout << "A delete" << endl;
    }
};

class B
{
public:
    shared_ptr<A> pa_;
    ~B()
    {
        cout << "B delete" << endl;
    }
};

void test()
{
    shared_ptr<B> pb(new B());
    shared_ptr<A> pa(new A());
    pb->pa_ = pa;
    pa->pb_ = pb;
    cout << "pb.use_count() = " << pb.use_count() << endl;
    cout << "pa.use_count() = " << pa.use_count() << endl;
}
 main()
{
    test();
    return 0;
}
```

如果 class B 中 使用的是 `shared_ptr<A> pa_;`，则输出是

```
pb.use_count() = 2
pa.use_count() = 2
```

没有调用析构函数，发生了死锁，将 class A 中的  `shared_ptr<B> pb_;`改成`weak_ptr<B> pb_;`，则输出是

```
pb.use_count() = 1
pa.use_count() = 2
B delete
A delete
```

这样的话，资源B的引用开始就只有1，当pb析构时，B的计数变为0，B得到释放，B释放的同时也会使A的计数减去1，同时pa析构时A的计数再减去1，那么A的计数为0，A得到释放。

注意：不能通过 weak_ptr直接访问对象的方法，比如B对象中有一个方法print()，`pa->pb->print()`是非法的，pb是一个weak_ptr，应先把它转化为shared_ptr，正确写法：

```cpp
shared_ptr p = pa->pb.lock();
p->print();
```



### 4 - shared_ptr 是如何实现的？

shared_ptr的原理：**通过引用计数的方式来实现多个shared_ptr对象之间共享资源**。

具体情况是这样的：

- 第一，构造函数中计数值初始化为1
- 第二，拷贝构造函数中计数值 加1
- 第三，赋值运算中，左边的对象引用计数减去1，右边的对象引用计数加上1
- 第四，析构函数中引用计数要减去1
- 最后，在赋值和析构函数中，如果计数值减去1后为0，则调用`delete`释放对象



### 5 - 悬挂指针和野指针有什么区别？



悬挂指针：是指当**指针所指向的对象被释放，但是该指针没有任何改变**，以至于其仍然指向已经被回收的内存地址。

野指针：野指针就是指针指向的位置是不可知的，比如指**针变量在定义时如果未初始化，其值是随机的，**



### 6 - 什么情况下会产生”野指针“？如何避免”野指针“？

- 使用未初始化的指针
  - 解决办法：初始化，可以是具体的地址值，也可以指向NULL
- 指针p被free或delete后没有置为NULL
  - 解决办法：指针指向的内存空间被释放后指针要指向NULL
- 指针操作超越了变量的作用范围：
  - 解决办法：在变量的作用域结束前释放掉变量的地址空间并让指针指向NULL



### 7 - 句柄和指针的区别和联系是什么？

这是两个截然不同的概念。

Windows系统用句柄标记系统资源，隐藏系统的信息，是个32bit的uint。

指针则标记某个物理内存的地址。



### 8 - 指针常量（顶层const）和常量指针（底层const）有什么区别？

**typename * const ：**

- 指针常量是定义了一个指针，这个指针的值只能在定义时初始化，其他地方不能改变。

**const typename *  **以及 **const * typename ：**

- 常量指针是指定义了一个指针，这个指针指向了一个只读的对象，不能通过常量指针改变这个对象的值

指针常量强调的是指针的不可改变性，常量指针强调的是指针对其所指对象的不可改变性。



### 9 - 说一下函数指针？         

#### 什么是函数指针？：

- 函数指针本身首先是一个指针变量，该指针变量指向一个具体的函数。在编译时，每一个函数都有一个入口地址，该入口地址就是函数指针所指向的地址。有了指向函数的指针变量后，可用该函数指针变量调用函数。
- 一个具体函数的名字，如果后面不跟调用符号(即括号)，则该名字就是该函数的指针(注意：大部分情况下，可以这么认为，但这种说法并不很严格)。

#### 函数指针有什么用途？：

- 调用函数和做函数的参数，比如回调函数

#### 函数指针的声明与赋值：

```cpp
int (*pf)(const int&, const int&);
```

`pf`就是一个函数指针，指向返回类型为`int`，并带有两个`const int&`参数的函数。***pf两边的括号是必须的**，否则上面的定义就变成了：

```cpp
int *pf(const int&, const int&);
```

这是声明了一个函数名为`pf`，其返回类型为`int *`， 带有两个`const int&`参数。

**两种赋值方法：**

- 指针名 = 函数名;
- 指针名 = &函数名;

**调用示例：**

```cpp
char* test(char *p) {...}  // 函数test,返回类型为char*
char* (*ptest)(char *p);   // 函数指针ptest
ptest = test;			   // 函数指针ptest指向函数test		
ptest(p);				   // 通过函数指针ptest调用函数test
```



### 10 - 设置地址为 0x67a9的整型变量的值为 0xaa66

考察强制类型转换，**无论在什么平台地址长度和整型数据的长度是一样的，**即一个整型数据可以强制转换成地址指针类型，只要有意义就行。

```cpp
int *ptr;
ptr = (int *)0x67a9;
*ptr = 0xaa66
```



### 11 - 右值引用有什么作用？

右值引用的主要目的是为了实现转移语义和完美转发，它可以消除两个对象交互时不必要的对象拷贝，提高效率，也能够更简洁明确地定义泛型函数

