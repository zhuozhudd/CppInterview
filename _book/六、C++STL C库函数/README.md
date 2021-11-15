## 六、STL & C库函数：



### 1 - 什么是STL？STL有哪些容器？分别有什么特点？

#### 1.1 STL组成

##### 简单概括：

**C++STL从广义上来讲包括了三类：算法，容器和迭代器**

- 算法包括排序，拷贝等常用算法，以及不同容器特定的算法
- 容器就是数据的存放形式，包括序列容器和关联式容器
  - 序列容器：list、vector等
  - 关联容器：set、map等
- 迭代器就是在不暴露容器内部结构的情况下对容器的遍历

##### 详细说明：

- **容器：**一些封装数据结构的模板类，例如 vector 向量容器、list 列表容器等。
- **算法：**STL 提供了非常多（大约 100 个）的数据结构算法，它们都被设计成一个个的模板函数，这些算法在 std 命名空间中定义，其中大部分算法都包含在头文件` <algorithm>` 中，少部分位于头文件 `<numeric>` 中。
- **迭代器：**在C++STL 中，对容器中数据的读和写，是通过迭代器完成的，扮演着容器和算法之间的胶合剂。
- **函数对象：**如果一个类将 () 运算符重载为成员函数，这个类就称为函数对象类，这个类的对象就是函数对象（又称仿函数）。
- **适配器：**可以使一个类的接口（模板的参数）适配成用户指定的形式，从而让原本不能在一起工作的两个类工作在一起。值得一提的是，容器、迭代器和函数都有适配器。
- **内存分配器：**为容器类模板提供自定义的内存申请和释放功能，由于往往只有高级用户才有改变内存分配策略的需求，因此内存分配器对于一般用户来说，并不常用。

其中**迭代器、函数对象、适配器、内存分配器**这四部分是为**容器和算法**服务的：

- 算法通过**迭代器**获取容器中的内容
- **函数对象**可以协助算法完成各种操作
- **适配器**用来套接适配仿函数
- **内存分配器**给容器分配存储空间

在惠普实验室最初发行的版本中，STL 被组织成 48 个头文件；但在 C++ 标准中，它们被重新组织为 13 个头文件：

| `<iterator>` | `<functional>` | `<vector>`  | `<deque>`  |
| ------------ | -------------- | ----------- | ---------- |
| `<list>`     | `<queue>`      | `<stack>`   | `<set>`    |
| `<map>`      | `<algorithm>`  | `<numeric>` | `<memory>` |
| `<utility>`  |                |             |            |

#### 1.2 STL容器分类

标准库的容器分为三类：顺序容器、关联容器、容器适配器

- 顺序容器有五种
  - `array<T, N>` 数组：固定大小数组，支持快速随机访问，但不能插入或删除元素
  - `vector<T>` 动态数组：支持快速随机访问，尾部插入和删除的速度快
  - `deque<T>` 双向队列：支持快速随机访问，首尾位置插入和删除速度快
  - `list<T>`双向链表：只支持双向顺序访问，任何位置插入和删除速度都很快
  - `forward_list<T>` 单向链表：只支持单向顺序访问，任何位置插入和删除的速度都很快
- 关联容器有两种
  - map容器：
    - `map<K, T>` 
    - `multimap<K, T>` 
    - `unordered_map<K, T>`
    - `unordered_multimap<K, T>`
  - set容器：
    - `set<T>`
    - `multiset<T>`
    - `unordered_set<T>`
    - `unordered_multiset<T>`
- 容器适配器有三种：
  - `stack<T>`
  - `queue<T>`
  - `priority_queue<T>`



### 2 - 什么时候用hash_map，什么时候用map？

- hash_map查找速度比map快，查找速度属于常数级别；map的查找速度是 $\log{n}$ 级别
- **删除和插入操作较多的情况下，map比hash_map的性能更好，数据量越大越明显**
- map的遍历性能高于hash_map，
- hash_map 查找性能 比map要好，数据量越大，查找次数越多，hash_map表现就越好。

但是并不一定常数就比$\log{n}$ 小，hash还有hash函数的耗时。当元素达到一定的数量级时，优先考虑hash_map；若对内存使用量有严格要求，hash_map需要慎选，而且hash_map构造速度较慢。所以如何选择，主要权衡三个因素：查找速度、数据量、内存使用



### 3 - STL中哈希表的底层实现

Hashtable在C++的STL里占据着重要的一席之地。其中的hash_set、hash_map、hash_multiset、hash_multimap四个关联容器都是以hashtable为底层实现方法（技巧）

- Hashtable底层实现是通过**开链法**来实现的，hash table表格内的元素称为桶（bucket)，bucket是hashtable_node数据结构组成的链表，定义如下，通过当前节点，可以方便地通过节点自身的next指针来获取下一链表节点的元素。

  ```cpp
  template<class Value>
  struct __hashtable_node
  {
      __hashtable_node *next;
      Value val;
  };
  ```

  

- **存入桶元素的容器是vector**。选择vector为存放桶元素（bucket）的基础容器，是因为vector容器本身具有动态扩容能力，无需人工干预。

- 在开链方法中，用于装载桶元素（bucket）的vector容器大小恒定为一个质数大小，哈希表内置了28个质数（53,97,193，...，429496729）。在创建哈希表时，会根据存入的元素个数选择大于等于元素个数的质数作为哈希表的容量，即vector的长度，其中每个桶（bucket）所维护的链表长度也等于哈希表的容量。如果插入哈希表的元素超过了桶（bucket）的容量，就要重建哈希表，即找出下一个质数，创建新的buckets 、vector，重新计算元素在新哈希表的位置，然后再delete掉old hashtable的所有元素。



hash_table的一些细节：

- 其迭代器没有减操作，也没有逆向迭代器。
- 不能处理 string double float等类型。



### 4 - 哈希构造函数和哈希冲突算法有哪些？

#### 哈希构造函数（记住前四个）：

- 除留余数法

- 直接定址法
- 数字分析法
- 平方取中法
- 折叠法、基数转换法、随机数法、随机乘数法、字符串数值哈希法、旋转法

#### 哈希处理冲突方法：

- 开链法
- 开放定址法
- 再哈希法



### 5 - vector底层是怎么实现的？vector相关问题

#### 5.0 - vector底层

vector底层是一个动态数组，包含三个迭代器，start 和 finish 之间是已经被使用的空间范围，end_of_storage是整块连续空间包括备用空间的尾部。

当空间不够装下数据（v.push_back(val)）时，会自动申请另一片更大的空间（1.5或2倍），然后把原来的数据拷贝到新的内存空间，然后释放原来的空间

当释放或删除（v.clear()）vector中的数据时，其存储空间不释放，只是清空了里面的数据

对vector的任何操作一旦引起了空间的重新分配，指向源vector的所有迭代器都会失效

<img src="https://gitee.com/song-zhuozhu/my_image/raw/master/img/image-20210910184701486.png" alt="image-20210910184701486" style="zoom:67%;" />



#### 5.1 - vector中的 size 和 capacity 的区别

- size 表示当前vector有多少个元素（finish - start），而capacity函数则表示它已经分配的内存中可以容纳多少元素（end_of_storage - start）



#### 5.2 - vector 中的 reserve  和 resize 的区别？

- reserve是直接扩充到已经确定的大小（newSize = capacity），可以减少多次开辟、释放空间的问题（优化push_back）。就可以提高效率，其次还可以减少多次拷贝数据的问题。reserve只是保证vector中的空间大小（capacity，end_of_storage - start）最少达到参数所指定的大小n。
  - reserve (int n)
- resize( ) 可以改变有效空间的大小(newSize = newCapacity)，也能改变默认值的功能。capacity的大小也会随着改变。
  - resize（int n，element），扩容后每个元素的值为element，默认为0



#### 5.3 - vector的元素类型可以是引用吗？vector如何查找一个元素？

不能，因为vector的底层实现要求连续的对象排列，引用并非对象，没有实际地址，因此vector的元素类型不能是引用。

```cpp
find(vec.begin(),vec.end(),1);  // 查找1
```

#### 5.4 - vector 迭代器失效的情况？

- 当插入一个元素到vector中，由于引起了内存的重新分配，所以指向原内存的迭代器全部失效。

- 当删除容器中的一个元素后，该迭代器所指向的元素已经被删除，那么夜造成迭代器的失效。
  - erase方法会返回下一个有效的迭代器，所以当我们要删除某个元素时，需要 it = vec.erase(it)

```cpp
it = vec.erase(it);
```



#### 5.5 - vector如何正确释放内存？

- vec.clear( ) : 清空内容，但不释放内存
- vector( ).swap(vec) : 清空内容，且释放内存，得到一个全新的vector
- vec.shrink_to_fit ( ) : 请求容器降低其capacity 和 size 匹配
- vec.clear( ) ; vec.shrink_to_fit ( ) : 清空内容，且释放内存。



#### 5.6 - vector扩容为什么要以 1.5 或 2 倍 扩容？

以2倍方式扩容，导致下一次申请的内存必然大于之前分配的内存总和，导致之前分配的内存不能再被使用，所以最好倍增长因子设置为1和2之间，即（1,2）

$$k\sum^n_{i=0}2^i = k(2^{n+1}-1)<k2^{n+1}$$



#### 5.7 - 频繁对vector调用push_back()对性能的影响和原因？

在一个vector的尾部之外的任何位置添加元素，都需要重新移动元素。而且，想一个vector添加元素可能会引起整个对象存储空间的重新分配。重新分配一个对象的存储空间需要分配新的内存，并将元素从旧的空间移到新的空间，影响性能。



### 6 - list 底层是怎么实现的？list相关问题

#### 6.0 list底层

- **list底层是一个双向链表，**以节点为单位存放数据，结点的地址在内存中不一定连续，每次插入或删除一个元素，就分配或释放一个元素空间。

- **list不支持随机存取，**适合需要大量的插入和删除，而不关心随机存取的应用场景。

  

<img src="https://gitee.com/song-zhuozhu/my_image/raw/master/img/image-20210910211801644.png" alt="image-20210910211801644" style="zoom: 50%;" />

#### 6.1 list常用函数

```cpp
list.push_back(elem);
list.pop_back();
list.push_front(elem);
list.size();
list.sort();
list.unique();   // 移除数值相同的连续元素
list.back();	 // 取尾迭代器
list.erase(it);  // 删除一个元素，返回删除元素的下一个迭代器
```



### 7 - map、set、multiset、multimap底层是怎么实现的？及相关问题

#### 7.0 - map、set、multiset、multimap的底层原理

map、set、multiset、multimap的底层实现都是红黑树，epoll模型的底层数据结构也是红黑树，Linux系统中CFS进程调度算法也用到了红黑树

#### 7.1 - 红黑树的特性：

- 每个节点是红色或黑色的
- 根节点是黑色的
- 每个叶子节点是黑色的
- 如果一个节点是红的，则它的两个儿子均是黑色的
- **每个结点到其子孙节点NULL指针的所有路径上包含相同数目的黑色节点**

[红黑树详解：](https://www.iamshuaidi.com/2061.html)

#### 7.2 - map、set、multiset、multimap的特点

set和multiset会根据特定的排序准则自动将元素排序，set中元素不重复，multiset可以重复

map和multimap将 key 和 value 组成的 pair 作为元素，根据key的排序准则自动将元素排序，map中key不允许重复，multimap可以重复



#### 7.3 - 为何map和set的插入删除效率比其他序列容器高，而且每次insert之后，以前保存的迭代器不会失效？

因为存储的是节点，不需要内存的拷贝和移动

因为插入操作知识节点指针的换来换去，节点内存没有改变。而迭代器就像指向节点的指针，内存没变，指向内存的指针也不会变。



#### 7.4 - 为何map和set不能像vector一样有一个reserve函数来预分配数据？

因为在map和set内部存储的已经不是元素本身了，而是包含元素的节点。也就是说map内部使用的Alloc并不是map<Key,Data,Compare,Alloc>声明的时候从参数传入的Alloc.



#### 7.5 - map、set、multiset、multimap 常用函数？

```cpp
mp.count(key) > 0;       // 统计的是key出现的次数，只能是0或1
mp.find(key) != mp.end() //表示key存在

// 均返回迭代器
it map.begin();
it map.end();
it mp.find(k);

bool map.empty();
int map.size();
map.insert({it,string});

for (it = mp.begin();it != mp.end())
{
	if (it->second == "target")
        mp.erase(it++);
    else ++it;
}
```

### 8 - unordered_map、unordered_set 底层是怎么实现的？

#### 8.0 - unordered_map、unordered_set 底层原理

- unordered_map的底层是一个防冗余的哈希表（采用除留余数法）。哈希表最大的优点就是把数据的存储和查找小号的时间大大降低，时间复杂度为$O(1)$；而代价是消耗比较多的内存
- 使用一个下标范围比较大的数组来存储元素。设计哈希函数（一般使用除留余数法），使得每个元素的key都与一个函数值（即数组下标，hash值）相对应，于是这个数组单元用来存储这个元素，这个数组单元一般称为桶。
- 不能保证每个元素的key与函数值是一一对应的，因此极有可能出现对于不同的元素，却计算出了相同的函数值，这就产生了冲突，一般用开链法解决冲突



#### 8.1 unordered_map 和 map的区别？使用场景？

- 构造函数：unordered_map 需要hash函数，等于函数；map只需要比较（小于）函数
- 存储结构：unordered_map 采用hash表存储，map一般采用红黑树（RB Tree）实现。因此其memory数据结构上不一样的。
- 总体来说，unordered_map查找速度比map快，属于常数级别；而map的查找速度上是 $\log{n}$ 级别。 但是并不一定常数就比$\log{n}$ 小，hash还有hash函数的耗时。当元素达到一定的数量级时，优先考虑hash_map；若对内存使用量有严格要求，hash_map需要慎选，而且hash_map构造速度较慢。所以如何选择，主要权衡三个因素：查找速度、数据量、内存使用



#### 8.2 unordered_map、unordered_set常用函数有哪些？

```cpp
unordered_map.begin();   // 起始位置迭代器
unordered_map.end();	   // 末尾迭代器
unordered_map.cbegin();  // 起始位置常迭代器 const_iterator
unordered_map.cend();    // 末尾常迭代器
unordered_map.size();    // 有效元素个数
unordered_map.insert(key); // 插入元素
unordered_map.find(key);   // 查找元素，返回迭代器
unordered_map.count(key);  // 返回匹配给定主键的元素的个数
```



### 9 - 迭代器的底层机制和失效问题

#### 9.0 - 迭代器的底层原理

迭代器上连接容器和算法的一个桥梁，通过迭代器可以在不了解容器的内部原理的情况下遍历容器。

它的底层实现包含两个重要的部分：

- 萃取技术
- 模板便特化

萃取技术（traits）可以进行类型推导，根据不同类型可以执行不同的处理流程，比如容器是vector，那么traits必须推导出其迭代器类型位随机访问迭代器，而list则位双向迭代器。

- 例如STL算法库中的distance函数，distance函数接受两个迭代器参数，然后计算他们两者之间的距离。显然对于不同的迭代器计算效率差别很大。比如对于vector容器来说，对于内存是连续分配的，因此指针直接相减即可获得两者的距离；而list容器是链式表，内存一般都不是连续分配，因此只能通过一级一级调用next() 或 其他函数，没调用一次再判断迭代器是否相等来计算距离。vector迭代器计算distance的效率为$O(1)$ ,而list则为$O(n)$, n为距离的大小。
- 使用萃取技术（traits）进行类型推导的过程中会使用到模板偏特化。模板偏特化可以用来推导参数，如果我们自定义多个类型，除非我们把这些自定义类型的特化版本写出来，否则我们只能判断他们是内置类型，并不能判断他们具体属于哪个类型。

```cpp
template <typename T>
struct TraitsHelper
{
  static const bool isPointer = false;
};
template <typename T>
struct TraitsHelper<T*>
{
  static const bool isPointer = true;
}

if (TraitsHelper<T>::isPointer)
   .... // 可以得出当前类型int*为指针类型
else
   .... // 可以得出当前类型int非指针类型
```



#### 9.1 - 迭代器的种类

- 输入迭代器：是只读迭代器，在每个被遍历的位置上只能读取一次。如find函数的参数就是输入迭代器
- 输出迭代器：是只写迭代器，在每个被遍历的位置上只能被写一次。
- 前向迭代器：兼具有输入和输出迭代器的能力，但是它可以对同一个位置重逢进行读和写。但它不支持operator-，所以只能向前移动。
- 双向迭代器：很像前向迭代器，只是它向后移动和向前移动同样容易
- 随机访问迭代器：有双向迭代器的所有功能。而且还提供“迭代器算数”，即一步内可以向前或向后跳跃任意位置，包含指针的所有操作。并另外支持it+n、it-n、it+=n、it-=n、it1-it2 和 it[n]等操作。



#### 9.2 - 迭代器的失效问题

（1）插入操作：

对于vector和string来说，如果容器内存被重新分配。则迭代器（iterators）、pointers（指针）、references（引用）都失效；如果没有重新分配，那么插入点之前的iterator有效， 插入节点之后的iterator失效；

对于deque，如果插入点位于front和back的其他位置，iterator、pointers、references失效；当插入元素到front和back时，deque的迭代器失效，但references和pointers有效。

对于list和forward_list，所有的iterator、pointers、references都有效。

（2）删除操作

对于vector和string，删除节点之前的iterators、pointers、references有效；off_the_end迭代器总是失效的；

对于deque，如果删除节点位置除front和back的其他位置，iterators、pointers、references失效；当插入元素到front和back时，off_the_end失效，其他的iterators、pointers、references有效。

对于list和forward_list，所遇的iterator、pointers、references有效。

对于关联容器map来说，如果一个元素已经被删除，那么其对应的迭代器就是失效了，不应该再被使用，否则会导致程序无定义的行为。



### 10 - deque底层是怎么实现的？

#### 10.0 deque的底层原理

deque是双端队列，在头尾进行插入和删除都是O(1)时间复杂度

deque的底层则是**若干个**数组的集合，单个数组内是连续物理空间，但不同数组间却不连续；

deque的动态拓展或动态缩减，是通过新增或者释放物理空间片段来实现的，不发生数据的转移。

deque内部维护了所有元素的必要信息，保证能够通过统一的接口直接访问所有的元素，且访问耗时相等，访问者无需关心各个元素是否位于同一个物理空间上。deque的底层设计决定了deque的以下特性：

- ① **支持高效的双端增减操作**（因为无需移动数据）
- ② **在元素数量很大时，总体来说比vector更高效**（大量数据的移动很耗时）
- ③ **不支持“指针+offset”的访问方式**（物理空间不连续）
- ④ 当需要在首尾之外的位置频繁插入/移除元素时，deque比list/forward_list表现更差。
- ⑤ 迭代器访问或者引用访问的连续性不如 list 和 forward_list。



#### 10.1 deque常用函数

```cpp
deque.push_back(elem);
deque.pop_back();
deque.push_front(elem);
deque.pop_front();
deque.size();
deque.at(idx)  // 传回索引idx所指的数据，如果idx越界，抛出out_of_range
```



### 11 - vector 和 list 的区别是什么？

#### vector

- 是连续存储的容器，动态数组，在堆上分配空间
- 底层实现：数组
- 两倍容量增长：
  - vector 增加（插入）新元素时，如果未超过当时的容量，则还有剩余空间，那么直接添加到最后（插入指定位置），然后调整迭代器。
  - 如果没有剩余空间了，则会重新配置给其原有元素个数的两倍空间，然后将原空间元素通过复制的方式初始化新空间，再向新空间增加元素，最后析构并释放原空间，之前的迭代器会失效。
- 性能：
  - 随机存取访问，$O(1)$
  - 插入：
    - 在最后插入（空间够）：$O(1)$
    - 在最后插入（空间不够）：需要内存申请和释放，以及对之前数据进行拷贝
    - 在中间和头部插入（空间够）：内存拷贝，需要挪动大量的数据，时间复杂度为$o(n)$
  - 删除：
    - 末尾删除：$O(1)$
    - 中间删除：内存拷贝，$O(n)$
- 适用场景：经常随机访问，且不经常对非尾结点进行插入删除

#### list

- 动态链表，在堆上分配空间，没插入一个元素都会分配相应空间，每删除一个元素都会释放相应空间。
- 底层实现：双向链表
- 性能：
  - 访问：$O(n)$
  - 插入：$O(1)$
  - 删除：$O(1)$
- 适用场景：经常插入删除大量数据

#### vector 和 list 区别

- vector底层是现实数组，list底层实现是双向链表

- vector支持随机访问性能好，插入删除性能差；list不支持随机访问，但插入删除性能好。 

- vector是顺序存储，list不是

- vector在非尾节点进行插入删除会导致内存拷贝，list不会

- vector是一次性分配好内存，不够时进行2倍扩容，list每次插入新结点都会进行内存申请。





### 12 - 什么情况下用vector、list、deque？

- vector可以随机存储元素（即可以通过公式直接计算出元素地址，不需要挨个查找），但在非尾部插入删除数据时，效率很低，适合对象简单，对象数据量变化不大，随机访问频繁。除非特殊情况，尽可能的使用vector而非deque，因为deque的迭代器比vector复杂很多。

- list不支持随机存储，适用于对象大、对象数量变化频繁，插入和产出频繁，写多读少的情景

- 需要从首尾两端进行插入或删除操作的时候用deque



### 13 - map 和 set 的区别？为何使用红黑树实现？

map和set都是C++的关联容器，底层实现都是红黑树（RB-Tree）。由于map和set开放各种借口操作，RB-Tree也都提供，所以几乎所有的map和set的操作行为，都只是转调RB-Tree的操作行为。

#### 13.1 - map 和 set 的区别：

- map中的元素是 key - value 键值对；Set则只是关键字的简单集合，set中每个元素的值都唯一。
- set的迭代器是const的，不允许修改元素的值，而map允许修改value，但不允许修改key。
  - 原因是因为map和set是根据关键字排序来保证其有序性的。如果允许修改key 的话，那么首先需要删除该键，然后调节平衡，再插入修改后的键值，调节平衡，如此一来，严重破坏了map 和set 的结构，导致iterator 失效，不知道应该指向改变前的位置，还是指向改变后的位置。所以STL 中将set 的迭代器设置成const，不允许修改迭代器的值；而map 的迭代器则不允许修改key 值，允许修改value 值。
- map 支持下标操作，set 不支持下标操作。map 可以用key 做下标，map 的下标运算符[ ]将关键码作为下标去执行查找，如果关键码不存在，则插入一个具有该关键码和mapped_type类型默认值的元素至map 中。
  - 因此下标运算符[ ]在map 应用中需要慎用，const_map 不能用，只希望确定某一个关键值是否存在而不希望插入元素时也不应该使用，mapped_type 类型没有默认值也不应该使用。如果find 能解决需要，尽可能用find。

#### 13.2 - 红黑树是怎么能够同时实现这两种容器？ 为什么使用红黑树？

-  他们的底层都是以红黑树的结构实现，因此插入删除等操作都在O(logn)时间内完成，因此可以完成高效的插入删除；
-  在这里定义了一个模版参数，如果它是key那么它就是set，如果它是map，那么它就是map；底层是红黑树，实现map的红黑树的节点数据类型是key+value，而实现set的节点数据类型是value
-  因为map和set要求是自动排序的，红黑树能够实现这一功能，而且时间复杂度比较低。

#### 13.3 - 适用场景：

- map：有序键值对不重复映射
- set：有序不重复集合



### 14 - map 和 unordered_map底层存放形式

- map：红黑树
- unordered_map：哈希表



### 15 - map插入方式有哪几种？

1. 用insert函数插入pair数据

```cpp
mapStudent.insert(pair<int, string>(1,"student_one"));;
```

2. 用insert函数插入value_type数据

```cpp 
mapStudent.insert(map<int,string>::value_type(1,"student_one"));
```

3. 在insert函数中使用make_pair()函数

```cpp
mapStudent.insert(make_pair(1,"student_one"));
```

4. 用数组方式插入

```cpp
mapStudent[1] = "student_one";
```



### 16 - map中[]和find的区别是什么？

- map的下标运算[]的作用是：将key作为下标去执行查找，并返回相应的值；如果不存在这个key，就将一个具有该key和value的键值对插入map
- find函数是用关键字执行查找，找到了返回该位置的迭代器，如果不存在返回尾迭代器



### 17 - vector越界访问下标，map越界访问下标？vector删除元素时会不会释放空间？

1. 通过下标访问vector中的元素会做边界检查，但该处的实现方式要看具体的IDE，不同IDE的实现方式不一样，确保不可访问越界地址

2. map的下标运算[]的作用是：将key作为下标去执行查找，并返回相应的值；如果不存在这个key，就将一个具有该key和value的键值对插入map

erase函数只能删除内容，不能改变vector容量的大小，它删除了it迭代器指向的元素，并且返回被删除的it之后的下一个迭代器

clear函数只能清空内容，也不能改变capacity容量大小；

如果想要在删除内容的时候同时释放内存，可以选用deque容器



### 18 - 使用有序容器插入自定义对象要怎么做？

标准库里一共有四种有序容器：set/multiset 和 map/multimap。set 是集合，map 是关联数组（在其他语言里也叫“字典”）。

因为有序容器的数量很少，所以使用的关键就是要理解它的“有序”概念，也就是说，**容器是如何判断两个元素的“先后次序”，知道了这一点，才能正确地排序。**

这就导致了有序容器与顺序容器的另一个根本区别，在定义容器的时候必须要指定 key 的比较函数。只不过这个函数通常是默认的 less，表示小于关系，不用特意写出来：

```cpp
template<
    class T                          // 模板参数只有一个元素类型
> class vector;                      // vector

template<
    class Key,                      // 模板参数是key类型，即元素类型
    class Compare = std::less<Key>  // 比较函数
> class set;                        // 集合

template<
    class Key,                      // 第一个模板参数是key类型
    class T,                        // 第二个模板参数是元素类型
    class Compare = std::less<Key>  // 比较函数
> class map;                        // 关联数组
```

C++ 里的 int、string 等基本类型都支持比较排序，放进有序容器里毫无问题。但很多自定义类型没有默认的比较函数，要作为容器的 key 就有点麻烦。

**解决这个问题有两种办法：一个是重载“<”，另一个是自定义模板参数。**

比如说我们有一个 Point 类，它是没有大小概念的，但只要给它重载“<”操作符，就可以放进有序容器里了：

```cpp
bool operator<(const Point& a, const Point& b)
{
    return a.x < b.x;            // 自定义比较运算
}

set<Point> s;                    // 现在就可以正确地放入有序容器
s.emplace(7);
s.emplace(3);
```

另一种方式是编写专门的函数对象或者 lambda 表达式，然后在容器的模板参数里指定。这种方式更灵活，而且可以实现任意的排序准则：

```cpp
set<int> s = {7, 3, 9};           // 定义集合并初始化3个元素

for(auto& x : s) {                // 范围循环输出元素
    cout << x << ",";              // 从小到大排序，3,7,9
}   

auto comp = [](auto a, auto b)  // 定义一个lambda，用来比较大小
{   
    return a > b;                // 定义大于关系
};  

set<int, decltype(comp)> gs(comp)  // 使用decltype得到lambda的类型

std::copy(begin(s), end(s),          // 拷贝算法，拷贝数据
          inserter(gs, gs.end()));  // 使用插入迭代器

for(auto& x : gs) {                // 范围循环输出元素
    cout << x << ",";                // 从大到小排序，9,7,3
}  
```



### 19 - 使用无序容器插入自定义对象要怎么做？

无序容器也有四种，名字里也有 set 和 map，只是加上了 unordered（无序）前缀，分别是unordered_set/unordered_multiset、unordered_map/unordered_multimap。

无序容器虽然不要求顺序，但是对 key 的要求反而比有序容器更“苛刻”一些，例如unordered_map 的声明：

```cpp
template<
    class Key,                          // 第一个模板参数是key类型
    class T,                            // 第二个模板参数是元素类型
    class Hash = std::hash<Key>,        // 计算散列值的函数对象
    class KeyEqual = std::equal_to<Key> // 相等比较函数
> class unordered_map; 
```

**它要求 key 具备两个条件，一是可以计算 hash 值，二是能够执行相等比较操作。**

第一个是因为散列表的要求，只有计算 hash 值才能放入散列表，第二个则是因为 hash 值可能会冲突，所以当 hash 值相同时，就要比较真正的 key 值。

**与有序容器一样，要把自定义类型作为 key 放入无序容器，必须要实现这两个函数：**

- **“==”函数 ：**可以用与“<”函数类似的方式，通过重载操作符来实现

```cpp
bool operator==(const Point& a, const Point& b)
{
    return a.x == b.x;              // 自定义相等比较运算
}
```

- **散列函数：**可以用函数对象或者 lambda 表达式实现，内部最好调用标准的 std::hash 函数对象，而不要自己直接计算，否则很容易造成 hash 冲突：

```cpp
auto hasher = [](const auto& p)    // 定义一个lambda表达式
{
    return std::hash<int>()(p.x);  // 调用标准hash函数对象计算
};
```

有了相等函数和散列函数，自定义类型也就可以放进无序容器了：

```cpp
unordered_set<Point, decltype(hasher)> s(10, hasher);

s.emplace(7);
s.emplace(3);

```



### 20 - 容器内删除一个元素

- **对于顺序容器`vector`,`deque `来说**，使用`erase(itertor)`后，后边的每个元素的迭代器都会失效（` list`除外），但是后边每个元素都会往前移动一个位置，`erase` 会返回下一个有效的迭代器，见如下代码，返回的是删除的后一个元素的迭代器

```cpp
int main()
{
    vector<int> v{1, 2, 3};
    for (auto it = v.begin(); it != v.end(); ++it)
        cout << *it << " ";
    auto it = v.begin() + 1;
    auto res = v.erase(it); 
    cout << endl << *res << endl;
    return 0;
}
```

输出：

```
1 2 3
3
```

- **对于关联容器`map` ,`set` 来说**，使用了`erase(iterator)`后，当前元素的迭代器失效，但是其结构是红黑树，删除当前元素不会影响到下一个元素的迭代器，返回值是`void`，所以要采用`erase(it++)`的方式删除迭代器；这样`it`就记录了下一个元素的迭代器

- **对于list来说**，它使用了不连续分配的内存，并且它的`erase `方法也会返回下一个有效的iterator，下述两种写法均可

```cpp
int main()
{
    list<int> lst{1, 2, 3, 4, 5};
    for (auto it = lst.begin(); it != lst.end(); ++it)
        cout << *it << " ";
    auto res1 = lst.erase(lst.begin());  // 写法一
    cout << endl
         << *res1 << endl;
    
    auto res2 = lst.begin();
    lst.erase(res2++);                   // 写法二
    cout << *res2 << endl;    
    for (auto it = lst.begin(); it != lst.end(); ++it)
        cout << *it << " ";
    return 0;
}
```

输出：

```
1 2 3 4 5 
2
3
3 4 5
```



### 21 - 迭代器 ++ it 与 it++

- 前置（++ it）返回一个引用，后置（ it ++）返回一个对象
- 前置（++ it）不会产生临时变量，后置（ it ++）必须产生临时对象，临时对象会导致效率降低

```cpp
// 前缀形式：
int& int::operator++() //这里返回的是一个引用形式，就是说函数返回值也可以作为一个左值使用
{//函数本身无参，意味着是在自身空间内增加1的
  *this += 1;  // 增加
  return *this;  // 取回值
}

//后缀形式:函数返回值是一个非左值型的，与前缀形式的差别所在。
const int int::operator++(int)  //函数带参，说明有另外的空间开辟
{
  int oldValue = *this;  // 取回值
  ++ (*this);  // 增加
  return oldValue;  // 返回被取回的值
}
```



### 22 - 指针和迭代器

#### 迭代器：

- Iterator（迭代器）是一种抽象的设计理念，通过迭代器可以在不了解容器内部原理的情况下遍历容器。

#### 迭代器与指针的区别：

- **迭代器不是指针，是类模板**，表现的像指针。它只是模拟了指针的一些功能，通过重载了指针的一些操作符，`->`、`*`、`++`、`--`等。迭代器封装了指针，是一个**可遍历STL（ Standard TemplateLibrary）容器内全部或部分元素**的对象， 本质是封装了原生指针，是指针概念的一种提升（lift），提供了比指针更高级的行为，相当于一种智能指针，它可以根据不同类型的数据结构来实现不同的`++`，`--`等操作。
- 迭代器返回的是对象引用而不是对象的值，所以cout 只能输出迭代器使用`*`取值后的值而不能直接输出其自身。

#### 迭代器产生的原因

- Iterator 类的访问方式就是把不同集合类的访问逻辑抽象出来，使得不用暴露集合内部的结构而达到循环遍历集合的效果。



### 23 - 如果在共享内存上使用STL标准库？

假设进程A在共享内存中放入了数个容器，进程B如何找到这些容器呢？

一个方法是进程A把容器放在共享内存的确定地址上（fixed offsets），则进程可以从该已知地址上获取容器。

另一个改进的办法是，进程A现在共享内润某快确定地址上放一个map容器，然后进程A再创建其他容器，然后给它取个名字，和地址一并保存到这个map容器里。

进程B知道如何获取该保存了地址映射的map容器，然后统一再根据名字取得其他容器的地址。



### 24 - 常用算法

#### 24.1 函数式编程

统计某个元素的出现次数：

```cpp
vector<int> v = {1,3,1,7,5};    // vector容器

auto n1 = std::count(          // count算法计算元素的数量 
    begin(v), end(v), 1        // begin()、end()获取容器的范围
);   
```

使用就地定义函数的lambda表达式，函数式编程，统计大于2的元素个数

```cpp
auto n = std::count_if(      // count_if算法计算元素的数量
    begin(v), end(v),       // begin()、end()获取容器的范围
    [](auto x) {            // 定义一个lambda表达式
        return x > 2;       // 判断条件
    }
);                          // 大函数里面套了三个小函数
```



#### 24.2 迭代器使用

容器一般会提供begin()，end()函数，但更建议使用更加通用的全局函数begin()，end()，另外还有cbegin(), rbegin()

```cpp
vector<int> v = {1,2,3,4,5};    // vector容器

auto iter1 = v.begin();        // 成员函数获取迭代器，自动类型推导
auto iter2 = v.end();

auto iter3 = std::begin(v);   // 全局函数获取迭代器，自动类型推导
auto iter4 = std::end(v);

auto iter5 = v.rbegin();     // 反向迭代器，前开后闭区间
auto iter6 = v.rend();		 //

auto iter7 = v.cbegin();     // 常量迭代器，只读
```

迭代器和指针类似，也可以前进和后退，但不能假设它一定支持“++”“--”操作符，最好也要用函数来操作，常用的有这么几个：

- distance()，计算两个迭代器之间的距离；
- advance()，前进或者后退 N 步；
- next()/prev()，计算迭代器前后的某个位置。

```cpp
array<int, 5> arr = {0,1,2,3,4};  // array静态数组容器

auto b = begin(arr);          // 全局函数获取迭代器，首端
auto e = end(arr);            // 全局函数获取迭代器，末端

assert(distance(b, e) == 5);  // 迭代器的距离

auto p = next(b);              // 获取“下一个”位置
assert(distance(b, p) == 1);    // 迭代器的距离
assert(distance(p, b) == -1);  // 反向计算迭代器的距离

advance(p, 2);                // 迭代器前进两个位置，指向元素'3'
assert(*p == 3);
assert(p == prev(e, 2));     // 是末端迭代器的前两个位置
```



#### 24.3 排序算法

一些常见问题对应的算法：

- 要求排序后仍然保持元素的相对顺序，应该用 stable_sort，它是稳定的；

- 选出前几名（TopN），应该用 partial_sort；
- 选出前几名，但不要求再排出名次（BestN），应该用 nth_element；
- 中位数（Median）、百分位数（Percentile），还是用 nth_element；
- 按照某种规则把元素划分成两组，用 partition；
- 第一名和最后一名，用 minmax_element。

```cpp
// top3
std::partial_sort(
    begin(v), next(begin(v), 3), end(v));  // 取前3名

// best3
std::nth_element(
    begin(v), next(begin(v), 3), end(v));  // 最好的3个

// Median
auto mid_iter =                            // 中位数的位置
    next(begin(v), v.size()/2);
std::nth_element( begin(v), mid_iter, end(v));// 排序得到中位数
cout << "median is " << *mid_iter << endl;
    
// partition
auto pos = std::partition(                // 找出所有大于9的数
    begin(v), end(v),
    [](const auto& x)                    // 定义一个lambda表达式
    {
        return x > 9;
    }
); 
for_each(begin(v), pos, print);         // 输出分组后的数据  

// min/max
auto value = std::minmax_element(        //找出第一名和倒数第一
    cbegin(v), cend(v)
);
```

如果是 list 容器，应该调用成员函数 sort()，它对链表结构做了特别的优化。有序容器 set/map 本身就已经排好序了，直接对迭代器做运算就可以得到结果。



#### 24.4 查找算法

算法 binary_search，顾名思义，就是在已经排好序的区间里执行二分查找。但只返回一个 bool 值，告知元素是否存在，而更多的时候是想定位到那个元素，所以 binary_search 几乎没什么用。

```cpp
vector<int> v = {3,5,1,7,10,99,42};  // vector容器
std::sort(begin(v), end(v));        // 快速排序

auto found = binary_search(         // 二分查找，只能确定元素在不在
    cbegin(v), cend(v), 7
); 
```

在已序容器上执行二分查找，要用到：**lower_bound**，它返回第一个**“大于或等于”**值的位置：

```cpp
decltype(cend(v)) pos;            // 声明一个迭代器，使用decltype

pos = std::lower_bound(          // 找到第一个>=7的位置
    cbegin(v), cend(v), 7
);  
found = (pos != cend(v)) && (*pos == 7); // 可能找不到，所以必须要判断
assert(found);                          // 7在容器里
```

lower_bound 的返回值是一个迭代器，所以就要做一点判断工作，才能知道是否真的找到了。判断的条件有两个，一个是迭代器是否有效，另一个是迭代器的值是不是要找的值。

 lower_bound 的查找条件是“大于等于”，而不是“等于”，所以它的真正含义是“大于等于值的第一个位置”。相应的也就有**“大于等于值的最后一个位置”**，算法叫 **upper_bound**，返回的是第一个“大于”值的元素。

```cpp
pos = std::upper_bound(             // 找到第一个>9的位置
    cbegin(v), cend(v), 9
);
```

两者的区分可以借助一个简单的不等式：

```
begin < x <= lower_bound < upper_bound < end
```

有序容器 set/map，就不需要调用这三个算法了，它们有等价的成员函数find/lower_bound/upper_bound，效果是一样的。

```cpp
multiset<int> s = {3,5,1,7,7,7,10,99,42};  // multiset，允许重复

auto pos = s.find(7);                      // 二分查找，返回迭代器
assert(pos != s.end());                   // 与end()比较才能知道是否找到

auto lower_pos = s.lower_bound(7);       // 获取区间的左端点
auto upper_pos = s.upper_bound(7);       // 获取区间的右端点

for_each(                                // for_each算法
    lower_pos, upper_pos, print          // 输出7,7,7
);
```



