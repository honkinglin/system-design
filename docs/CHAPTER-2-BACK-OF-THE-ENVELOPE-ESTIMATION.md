# 第二章：粗略估算 (Back-Of-The-Envelope Estimation)

在系统设计面试中，有时会要求您通过初步估算来估算系统的容量或性能需求。根据谷歌资深研究员杰夫·迪恩（Jeff Dean）的说法，“初步估算是您使用思维实验和常见性能数据的组合进行的估算，以便对满足您需求的设计有一个良好的感觉”[[1]](http://highscalability.com/blog/2011/1/26/google-pro-tip-use-back-of-the-envelopecalculations-to-choo.html)。

要有效地进行初步估算，您需要对可扩展性的基本概念有良好的理解。以下概念应当熟知：二的幂 [[2]](https://github.com/donnemartin/system-design-primer)，每个程序员都应该知道的延迟数字以及可用性指标。

## 二的幂 (Power of two)

尽管在处理分布式系统时，数据量可能会变得非常庞大，但所有计算归根结底都是基础知识。为了获得正确的计算结果，了解以二的幂为单位的数据量至关重要。一个字节是由8位组成的序列，一个ASCII字符占用一个字节的内存（8位）。下表解释了数据量单位（表2-1）。

![表2-1](/t2-1.png)

## 每个程序员都应该了解的延迟数值

谷歌的Dean博士在2010年揭示了典型计算机操作的时间长度[[1]](http://highscalability.com/blog/2011/1/26/google-pro-tip-use-back-of-the-envelopecalculations-to-choo.html)。尽管随着计算机变得更快、更强大，有些数值已经过时，但这些数据仍然能够让我们了解不同计算机操作的快慢差异。

![表2-1](/t2-1.png)

> Notes
> - ns = nanosecond, µs = microsecond, ms = millisecond
> - 1 ns = 10^-9 seconds
> - 1 µs= 10^-6 seconds = 1,000 ns
> - 1 ms = 10^-3 seconds = 1,000 µs = 1,000,000 ns

谷歌的一位软件工程师开发了一款工具来可视化Dean博士的延迟数据。该工具还考虑了时间因素。图2-1展示了截至2020年的可视化延迟数值（图表来源：参考文献[[3]](https://colin-scott.github.io/personal_website/research/interactive_latency.html)）。

![图2-1](/f2-1.png)

通过分析图2-1中的数据，我们得出以下结论：

- 内存速度很快，但磁盘速度较慢。
- 尽量避免磁盘查找操作。
- 简单的压缩算法速度很快。
- 尽量在通过互联网发送数据之前先进行压缩。
- 数据中心通常位于不同的区域，数据在它们之间传输需要时间。

## 可用性数值  (Availability numbers)

高可用性是指系统能够在较长一段时间内持续运行的能力。高可用性以百分比表示，100% 表示服务无任何停机时间。大多数服务的可用性介于 99% 和 100% 之间。

服务等级协议（SLA）是服务提供商常用的术语。这是你（服务提供商）与客户之间的协议，正式定义了你提供的服务的正常运行时间水平。云服务提供商如亚马逊[[4]](https://aws.amazon.com/compute/sla/)、谷歌[[5]](https://cloud.google.com/compute/sla)和微软[[6]](https://azure.microsoft.com/enus/support/legal/sla/summary/)的 SLA 都设定在 99.9% 或以上。正常运行时间通常用“几个 9”来衡量，越多的 9 表示服务越好。正如表 2-3 所示，9 的数量与系统预期的停机时间相关。

## 示例：估算 Twitter 的每秒查询数（QPS）和存储需求

请注意，以下数字仅用于本练习，并非 Twitter 的真实数据。

**假设：**
- 3 亿月活跃用户。
- 50% 的用户每天使用 Twitter。
- 用户平均每天发布 2 条推文。
- 10% 的推文包含媒体内容。
- 数据存储 5 年。

**估算：**

**每秒查询数（QPS）估算：**
- 每日活跃用户（DAU）= 3 亿 * 50% = 1.5 亿
- 推文的 QPS = 1.5 亿 * 2 条推文 / 24 小时 / 3600 秒 ≈ 3500
- 峰值 QPS = 2 * QPS ≈ 7000

**这里只估算媒体存储需求。**

**平均推文大小：**
- 推文 ID：64 字节
- 文本：140 字节
- 媒体：1 MB

**媒体存储：**
- 1.5 亿 * 2 条推文 * 10% * 1 MB = 每天约 30 TB
- 5 年的媒体存储：30 TB * 365 天 * 5 年 ≈ 55 PB

## 提示

“信封背面估算”注重的是过程。解决问题比获得结果更重要。面试官可能会考察你的问题解决能力。以下是一些建议：

- **四舍五入与近似计算**：在面试中进行复杂的数学运算很困难。例如，“99987 / 9.1”的结果是多少？没有必要花费宝贵的时间去解决复杂的数学问题。面试时不需要精确的答案。利用四舍五入和近似计算。比如可以将除法简化为：“100,000 / 10”。
  
- **写下你的假设**：写下你的假设以便稍后参考是个好主意。

- **标注单位**：当你写下“5”时，它是指 5 KB 还是 5 MB？这可能会让你自己混淆。标明单位，因为“5 MB”可以消除歧义。

- **常见的信封背面估算问题**：QPS（每秒查询数）、峰值 QPS、存储、缓存、服务器数量等。你可以在准备面试时练习这些计算。熟能生巧。

恭喜你走到了这一步！现在请给自己一个鼓励。做得很好！

## 参考文献

[1] J. Dean.Google Pro Tip: Use Back-Of-The-Envelope-Calculations To Choose The Best Design: http://highscalability.com/blog/2011/1/26/google-pro-tip-use-back-of-the-envelopecalculations-to-choo.html

[2] System design primer: https://github.com/donnemartin/system-design-primer

[3] Latency Numbers Every Programmer Should Know: https://colin-scott.github.io/personal_website/research/interactive_latency.html

[4] Amazon Compute Service Level Agreement: https://aws.amazon.com/compute/sla/

[5] Compute Engine Service Level Agreement (SLA): https://cloud.google.com/compute/sla

[6] SLA summary for Azure services: https://azure.microsoft.com/enus/support/legal/sla/summary/
