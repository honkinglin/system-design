# 系统设计基础  

在设计大型系统时，我们需要考虑以下几个方面：  

1. **可用的架构组件**有哪些？  
2. **这些组件如何协同工作**？  
3. **如何最佳地利用这些组件**：应该做出怎样的权衡？  

在扩展尚未成为必要时就投入大量资源进行扩展，通常不是明智的商业决策。然而，在设计阶段进行适当的前瞻性思考，可以在未来节省宝贵的时间和资源。  

在接下来的章节中，我们将尝试定义可扩展系统的一些核心构建模块。熟悉这些概念将有助于更好地理解分布式系统。  

在下一节中，我们将依次介绍**一致性哈希、CAP 定理、负载均衡、缓存、数据分区、索引、代理、消息队列、副本机制，以及 SQL 与 NoSQL 之间的选择**。  

让我们从**分布式系统的关键特性**开始。
