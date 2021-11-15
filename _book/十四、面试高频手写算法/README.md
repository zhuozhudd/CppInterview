## 十四、面试高频手写算法

### 1 - 合并有序链表

```cpp
#include <iostream>

using namespace std;

struct ListNode
{
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode *mergeTwoLists(ListNode *l1, ListNode *l2)
{
    ListNode *dumb = new ListNode(0);
    ListNode *p = dumb;
    while (l1 && l2)
    {

        if (l1->val <= l2->val)
        {
            p->next = l1;
            l1 = l1->next;
        }
        else
        {
            p->next = l2;
            l2 = l2->next;
        }
        p = p->next;
    }

    if (l1 == nullptr)
        p->next = l2;
    if (l2 == nullptr)
        p->next = l1;
    p = dumb->next;
    delete dumb;
    return p;
}

int main()
{
    ListNode *node1 = new ListNode(1);
    ListNode *node2 = new ListNode(2);
    ListNode *node3 = new ListNode(3);
    ListNode *node4 = new ListNode(4);
    ListNode *node5 = new ListNode(5);

    // list1: 1 3 5
    node1->next = node3;
    node3->next = node5;
    node5->next = nullptr;
    // list2: 2 4
    node2->next = node4;
    node4->next = nullptr;

    ListNode *newList = mergeTwoLists(node1, node2);
    while (newList)
    {
        cout << newList->val << " ";
        newList = newList->next;
    }
    return 0;
}
```



### 2 - 反转链表

```cpp
#include <iostream>

using namespace std;

struct ListNode
{
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode *reverseList(ListNode *head)
{
    ListNode *pre = nullptr;
    ListNode *cur = head;
    while (cur)
    {
        ListNode *temp = cur->next;
        cur->next = pre;
        pre = cur;
        cur = temp;
    }
    return pre;
}

ListNode *init();

int main()
{
    auto head = init();
    head = reverseList(head);
    while (head != nullptr)
    {
        cout << head->val << " ";
        head = head->next;
    }
    return 0;
}

ListNode *init()
{
    ListNode *head = new ListNode(1);
    ListNode *node1 = new ListNode(2);
    ListNode *node2 = new ListNode(3);
    ListNode *node3 = new ListNode(4);
    ListNode *node4 = new ListNode(5);

    head->next = node1;
    node1->next = node2;
    node2->next = node3;
    node3->next = node4;
    node4->next = nullptr;

    return head;
}
```

### 3 - 排序：冒泡、直插、选择、快排、堆排序、归并排序

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// 冒泡排序
void bubbleSort(vector<int> &nums)
{
    for (int i = 0; i < nums.size(); ++i)
        for (int j = 0; j + 1 < nums.size() - i; ++j)
            if (nums[j] > nums[j + 1])
                swap(nums[j], nums[j + 1]);
}

// 选择排序
void selectionSort(vector<int> &nums)
{
    for (int i = 0; i < nums.size(); ++i)
        for (int j = i + 1; j < nums.size(); ++j)
            if (nums[i] > nums[j])
                swap(nums[i], nums[j]);
}

// 插入排序
void insertionSort(vector<int> &nums)
{
    for (int i = 1; i < nums.size(); i++)
    {
        int t = nums[i];
        int j;
        for (j = i - 1; j >= 0; --j)
        {
            if (nums[j] > t)
                nums[j + 1] = nums[j];
            else
                break;
        }
        nums[j + 1] = t;
    }
}

// 快速排序
void quickSort(vector<int> &nums, int left, int right)
{
    if (left >= right)
        return;
    int i = left, j = right;
    while (i < j)
    {
        // 取最左边的数做基准数
        while (nums[left] <= nums[j] && i < j)
            j--;
        while (nums[left] >= nums[i] && i < j)
            i++;
        if (i < j)
            swap(nums[i], nums[j]);
    }
    swap(nums[left], nums[i]);
    quickSort(nums, left, i - 1);
    quickSort(nums, i + 1, right);
}

// 堆排序

// 递归方式构建大根堆，len是arr长度，index是第一个非叶子节点的下标
void adjust(vector<int> &arr, int len, int index)
{
    int left = 2 * index + 1;  // index的左子节点
    int right = 2 * index + 2; // index的右子节点

    int maxIdx = index; // 找出最大值的索引
    if (left < len && arr[left] > arr[maxIdx])
        maxIdx = left;
    if (right < len && arr[right] > arr[maxIdx])
        maxIdx = right;

    if (maxIdx != index)
    {
        swap(arr[maxIdx], arr[index]); // 将最大值放到父节点位置
        adjust(arr, len, maxIdx);      // 递归调整互换后的树
    }
}
// heapSort
void heapSort(vector<int> &arr, int size)
{
    // 构建大根堆，第一个非叶子结点 arr.length / 2 - 1
    for (int i = size / 2 - 1; i >= 0; --i)
        adjust(arr, size, i);

    // 调整大根堆
    for (int i = size - 1; i >= 1; --i)
    {
        swap(arr[0], arr[i]);
        adjust(arr, i, 0);
    }
}

// 归并排序
void merge(vector<int> &nums, vector<int> &temp, int left, int right)
{
    if (left >= right)
        return; //终止条件
    // 递归划分
    int mid = left + (right - left) / 2;
    //int res = mergeSort(nums, temp, left, mid) + mergeSort(nums, temp, mid + 1, right);
    merge(nums, temp, left, mid);
    merge(nums, temp, mid + 1, right);
    // 将原数组拷贝到辅助空间
    for (int k = left; k <= right; ++k)
        temp[k] = nums[k];
    // 合并阶段
    int i = left, j = mid + 1;
    for (int k = left; k <= right; ++k)
    {
        if (i == mid + 1)
            nums[k] = temp[j++];
        else if (j == right + 1 || temp[i] <= temp[j])
            nums[k] = temp[i++];
        else
            nums[k] = temp[j++];
    }
}

void mergeSort(vector<int>& nums)
{
    if (nums.size() <=1)
        return;
    vector<int> temp(nums.size());
    merge(nums, temp, 0, nums.size() - 1);
}


// 测试代码

int main()
{
    vector<int> nums{3, 15, 5, 26, 2, 12, 6, 33, 17};
    for (int x : nums)
        cout << x << " ";
    cout << endl;
    // bubbleSort(nums);
    // selectionSort(nums);
    // insertionSort(nums);
    // heapSort(nums, nums.size());
    mergeSort(nums);
    for (int x : nums)
        cout << x << " ";
    // lambda匿名函数遍历，需要C++11支持
    // for_each(nums.begin(), nums.end(), [](const auto &a)  { cout << a << " "; });

    cout << endl;
    return 0;
}

```

### 4 - LRU缓存

```cpp
#include <iostream>
#include <unordered_map>
using namespace std;

class LRUCache
{
public:
    // 定义链表
    struct Node
    {
        int key, value;
        Node *left, *right;
        Node(int _key, int _value) : key(_key), value(_value), left(nullptr), right(nullptr) {}
    } * L, *R;

    int n; // 缓存大小
    unordered_map<int, Node *> hash;

    void remove(Node *p)
    {
        p->left->right = p->right;
        p->right->left = p->left;
    }

    void insert(Node *p)
    {
        p->left = L;
        p->right = L->right;
        L->right->left = p;
        L->right = p;
    }

    LRUCache(int capacity)
    {
        n = capacity;
        L = new Node(-1, -1);
        R = new Node(-1, -1);
        L->right = R;
        R->left = L;
    }

    int get(int key)
    {
        if (hash.count(key) == 0)
            return -1; // 不存在
        auto p = hash[key];
        remove(p);
        insert(p);
        return p->value;
    }

    void put(int key, int value)
    {
        if (hash.count(key))
        {
            auto p = hash[key];
            p->value = value;
            remove(p);
            insert(p);
        }
        else
        {
            if (n == hash.size())
            {
                auto p = R->left;
                remove(p);
                hash.erase(p->key);
                delete p;
            }
            auto p = new Node(key, value);
            hash[key] = p;
            insert(p);
        }
    }
};

int main()
{
    cout << "LRUCache lRUCache(2);" << endl;
    LRUCache lRUCache(2);
    cout << "lRUCache.put(1, 1) " << endl;
    cout << "lRUCache.put(2, 2)" << endl;
    lRUCache.put(1, 1);              // 缓存是 {1=1}
    lRUCache.put(2, 2);              // 缓存是 {1=1, 2=2}
    cout << "lRUCache.get(1): "<< lRUCache.get(1) << endl; // 返回 1
    cout << "lRUCache.put(3, 3)" << endl;
    lRUCache.put(3, 3);              // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
    cout << "lRUCache.get(2): "<< lRUCache.get(2) << endl; // 返回 -1 (未找到)
    cout << "RUCache.put(4, 4)" << endl;
    lRUCache.put(4, 4);              // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
    cout << "lRUCache.get(1): "<< lRUCache.get(1) << endl; // 返回 -1 (未找到)
    cout << "lRUCache.get(3): "<< lRUCache.get(3) << endl; // 返回 3
    cout << "lRUCache.get(4): "<< lRUCache.get(4) << endl; // 返回 4
}
```

### 5 - Top K 问题

**求第k大或第k小的数：**

```cpp
#include <iostream>
#include <vector>
using namespace std;

int quickSort(vector<int> &nums, int left, int right, int k)
{
    int i = left, j = right;
    while (i < j)
    {
        while (i < j && nums[left] <= nums[j])
            j--;
        while (i < j && nums[left] >= nums[i])
            i++;
        swap(nums[i], nums[j]);
    }
    swap(nums[i], nums[left]);
    if (i == k)
        return nums[i];
    else if (i > k)
        return quickSort(nums, left, i - 1, k);
    else
        return quickSort(nums, i + 1, right, k);
}


int main()
{
    vector<int> nums{3, 15, 5, 26, 2, 12, 6, 33, 17};
    int k = 2;
    // 2 3 5 6 12 15 17 26 33
    int KthSamllest = quickSort(nums, 0, nums.size() - 1, k - 1);
    int KthLargest = quickSort(nums, 0, nums.size() - 1, nums.size() - k);
    cout << "k=2，第2大为：" << KthLargest << endl;
    cout << "k=2，第2小为：" << KthSamllest << endl;
}
```

**求k个最小的数或最大的数：**

以下代码是求k个最小的数，如求最大的数，让快排从大到小排序即可，即

```cpp
while (i < j && arr[j] <= arr[left])
	j--;
while (i < j && arr[i] >= arr[left])
	i++;
```

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<int> quickSort(vector<int> &arr, int left, int right, int k)
{
    int i = left, j = right;
    while (i < j)
    {
        while (i < j && arr[j] >= arr[left])
            j--;
        while (i < j && arr[i] <= arr[left])
            i++;
        swap(arr[i], arr[j]);
    }
    swap(arr[i], arr[left]);
    if (i > k)
        return quickSort(arr, left, i - 1, k);
    if (i < k)
        return quickSort(arr, i + 1, right, k);
    vector<int> res;
    res.assign(arr.begin(), arr.begin() + k);
    return res;
}

int main()
{
    vector<int> nums{3, 15, 5, 26, 2, 12, 6, 33, 17};
    int k = 2;
    // 2 3 5 6 12 15 17 26 33
    vector<int> KthSamllest = quickSort(nums, 0, nums.size() - 1, k);
    cout << "k = 2，k小为：" << endl;
    for_each(KthSamllest.begin(), KthSamllest.end(), [](const auto &a)
             { cout << a << " "; });
    return 0;
}
```



### 6 - 重排链表

[LeetCode134. 重排链表](https://leetcode-cn.com/problems/reorder-list/)

$$L_0 \rightarrow L_1 \rightarrow L_2 \rightarrow L_3 ... \rightarrow L_n $$ 

重排后

$$L_0 \rightarrow L_n \rightarrow L_1 \rightarrow L_{n-1} \rightarrow L_2 \rightarrow L_{n-2}... $$ 

```cpp
#include <iostream>
#include <deque>

using namespace std;

struct ListNode
{
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode *reorderList(ListNode *head)
{
    deque<ListNode *> dq;
    ListNode *cur = head;
    if (cur == nullptr)
        return nullptr;

    while (cur->next)
    {
        dq.push_back(cur->next);
        cur = cur->next;
    }

    int cnt = 0;
    ListNode *node = nullptr;
    cur = head;
    while (dq.size())
    {
        if (cnt % 2 == 0)
        {
            node = dq.back();
            dq.pop_back();
        }
        else
        {
            node = dq.front();
            dq.pop_front();
        }
        cnt++;
        cur->next = node;
        cur = cur->next;
    }
    cur->next = nullptr;
    return head;
}

int main()
{
    ListNode *head = new ListNode(1);
    ListNode *node1 = new ListNode(2);
    ListNode *node2 = new ListNode(3);
    ListNode *node3 = new ListNode(4);
    ListNode *node4 = new ListNode(5);
    ListNode *node5 = new ListNode(6);

    head->next = node1;
    node1->next = node2;
    node2->next = node3;
    node3->next = node4;
    node4->next = node5;
    node5->next = nullptr;

    head = reorderList(head);

    while (head)
    {
        cout << head->val << " ";
        head = head->next;
    }

    return 0;
}
```

### 7 - 多线程交替打印

#### 三个线程交替打印ABC

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
using namespace std;

mutex mymutex;
condition_variable cv;
int flag = 0;

void printa()
{
    unique_lock<mutex> lk(mymutex);
    int count = 0;
    while (count < 10)
    {
        while (flag != 0)
            cv.wait(lk);
        cout << "thread 1: a" << endl;
        flag = 1;
        cv.notify_all();
        count++;
    }
    cout << "my thread 1 finish" << endl;
}
void printb()
{
    unique_lock<mutex> lk(mymutex);
    for (int i = 0; i < 10; i++)
    {
        while (flag != 1)
            cv.wait(lk);
        cout << "thread 2: b" << endl;
        flag = 2;
        cv.notify_all();
    }
    cout << "my thread 2 finish" << endl;
}
void printc()
{
    unique_lock<mutex> lk(mymutex);
    for (int i = 0; i < 10; i++)
    {
        while (flag != 2)
            cv.wait(lk);
        cout << "thread 3: c" << endl;
        flag = 0;
        cv.notify_all();
    }
    cout << "my thread 3 finish" << endl;
}
int main()
{
    thread th2(printa);
    thread th1(printb);
    thread th3(printc);

    th1.join();
    th2.join();
    th3.join();
    cout << " main thread " << endl;
}

```



#### 双线程交替打印

```cpp
#include <string>
#include <thread>
#include <mutex>
#include <iostream>
using namespace std;

std::mutex data_mutex;
int flag = 0;

void printA(int *a, int size)
{
    for (int i = 0; i < size;)
    {
        data_mutex.lock();
        if (flag == 0)
        {
            cout << a[i] << endl;
            flag = 1;
            ++i;
        }
        data_mutex.unlock();
    }
}

void printB(char *b, int size)
{
    for (int i = 0; i < size;)
    {
        data_mutex.lock();
        if (flag == 1)
        {
            cout << b[i] << endl;
            flag = 0;
            ++i;
        }
        data_mutex.unlock();
    }
}

int main()
{
    int a[4] = {1, 2, 3, 4};
    char b[4] = {'a', 'b', 'c', 'd'};
    std::thread tA(&printA, a, 4);
    std::thread tB(&printB, b, 4);
    tA.join();
    tB.join();

    return 0;
}
```





### 8 - 单例模式

**饿汉模式：**

```cpp
class singlePattern {
private:
    singlePattern() {};
    static singlePattern* p;
public:
    static singlePattern* instance();

    class GC {
    public:
        ~GC() {
            if (singlePattern::p != nullptr) {
                delete singlePattern::p;
                singlePattern::p = nullptr;
            } // Garbage Collection
        }
    };
};

singlePattern* singlePattern::p = new singlePattern();
singlePattern* singlePattern::instance() {
    return p;
}
```

**懒汉模式：**

```cpp
class singlePattern {
private:
    static singlePattern* p;
    singlePattern(){}
public:
    static singlePattern* instance();
    class CG {
    public:
        ~CG() {
            if (singlePattern::p != nullptr) {
                delete singlePattern::p;
                singlePattern::p = nullptr;
            }
        }
    };
};
singlePattern* singlePattern::p = nullptr;
singlePattern* singlePattern::instance() {
    if (p == nullptr) {
        return new singlePattern();
    }
    return p;
}
```

### 9 - 简单工厂模式

```cpp
typedef enum productType {
    TypeA,
    TypeB,
    TypeC
} productTypeTag;

class Product {

public:
    virtual void show() = 0;
    virtual ~Product() = 0;
};

class ProductA :public Product {
public:
    void show() {
        cout << "ProductA" << endl;
    }
    ~ProductA() {
        cout << "~ProductA" << endl;
    }
};

class ProductB :public Product {
public:
    void show() {
        cout << "ProductB" << endl;
    }
    ~ProductB() {
        cout << "~ProductB" << endl;
    }
};

class ProductC :public Product {
public:
    void show() {
        cout << "ProductC" << endl;
    }
    ~ProductC() {
        cout << "~ProductC" << endl;
    }
};

class Factory {

public:
    Product* createProduct(productType type) {
        switch (type) {
        case TypeA:
            return new ProductA();
        case TypeB:
            return new ProductB();
        case TypeC:
            return new ProductC();
        default:
            return nullptr;
        }
    }
};
```

