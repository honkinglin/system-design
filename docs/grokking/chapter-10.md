# 设计API限流器  

我们来设计一个API限流器，用于根据用户发送请求的数量进行限流。  

**难度级别：中等**  

## 1. 什么是限流器？  
假设我们有一个服务正在接收大量请求，但只能处理有限数量的每秒请求。为了解决这一问题，我们需要某种限流机制，允许在特定时间内仅接收一定数量的请求，以确保服务能够正常响应所有请求。  

从高层次来看，限流器限制一个实体（用户、设备、IP等）在特定时间窗口内可以执行的事件数量。例如：  
- 用户每秒只能发送一条消息。  
- 用户每天最多允许三次信用卡交易失败。  
- 单个IP每天只能创建二十个账户。  

通常，限流器会限制发送方在特定时间窗口内发出的请求数量，并在达到限制时阻止后续请求。

## 2. 为什么需要API限流？  
限流有助于保护服务免受针对应用层的滥用行为，例如拒绝服务（DOS）攻击、暴力破解密码、暴力破解信用卡交易等。这些攻击通常表现为大量的HTTP/S请求，看似来自真实用户，但通常是由机器（或机器人）生成的。因此，这些攻击通常更难被检测到，且更容易让服务、应用或API崩溃。  

限流还用于防止收入损失、减少基础设施成本、阻止垃圾邮件和防止在线骚扰。以下是一些可以通过限流使服务（或API）更可靠的场景：  

- **行为不当的客户端/脚本**：无论是故意还是无意，一些实体可能通过发送大量请求使服务超负荷运行。另一个场景是用户发送大量低优先级的请求，我们希望确保这些请求不会影响到高优先级的流量。例如，发送大量请求以获取分析数据的用户不应妨碍其他用户的关键交易。  
- **安全性**：通过限制用户可以进行的二次验证尝试次数（如2FA中的错误密码尝试次数），可以有效防止暴力破解。  
- **防止滥用行为和糟糕的设计实践**：如果没有API限流，客户端应用的开发者可能会使用不良的开发策略，例如不断重复请求相同的信息。  
- **控制成本和资源使用**：服务通常是为正常的输入行为设计的，例如用户每分钟发布一条帖子。计算机可以轻松通过API推送成千上万的请求。限流器能够控制服务API的访问频率。  
- **收入**：某些服务可能希望根据客户服务的层级来限制操作，并基于限流创建收入模型。对于服务提供的所有API，可以设定默认的请求限制。超出限制时，用户需要购买更高的限额。  
- **消除流量波动**：确保服务为所有用户保持可用，避免流量尖峰影响其他用户的体验。

## 3. 系统的需求和目标  
我们的限流器应满足以下要求：  

**功能需求：**  
1. 限制实体在一个时间窗口内向API发送的请求数量，例如每秒最多15个请求。  
2. 由于API通过集群访问，因此限流需要跨不同服务器进行考虑。当用户在单个服务器或多个服务器的组合上超出定义的阈值时，应该返回错误信息。  

**非功能需求：**  
1. 系统应具备高可用性。限流器应始终有效，因为它保护我们的服务免受外部攻击。  
2. 限流器不应引入显著的延迟，以免影响用户体验。

## 4. 如何进行限流？  
限流是一个定义消费者访问API的速率和频率的过程。**限流（Throttling）**指的是在给定时间段内控制客户使用API的过程，限流可以在应用层或API层进行定义。当达到限流阈值时，服务器会返回HTTP状态码“429 - Too many requests”（请求过多）。  

## 5. 常见的限流类型  
以下是三种常见的限流类型，广泛应用于不同的服务：  

1. **硬限流（Hard Throttling）**：  
   API请求数量不能超过限流阈值。一旦达到限制，后续请求将被阻止。  

2. **软限流（Soft Throttling）**：  
   允许API请求数量超过阈值的一定百分比。例如，如果限流为每分钟100条消息，且允许10%的超额限度，限流器会允许每分钟最多发送110条消息。  

3. **弹性限流（Elastic/Dynamic Throttling）**：  
   当系统有可用资源时，请求数量可以超出阈值。例如，用户被允许每分钟发送100条消息，但如果系统有空闲资源，可以允许用户发送超过100条消息。
  
## 6. 用于限流的算法类型  
以下是用于限流的两种算法类型：  

**固定窗口算法（Fixed Window Algorithm）：**  
在此算法中，时间窗口以时间单位的起点到终点来衡量。例如，对于一分钟的时间段，即0-60秒，无论API请求是在该时间段的何时发送，都归入同一窗口。在下图中，0-1秒内有两条消息，1-2秒内有三条消息。如果限流为每秒两条消息，那么只有“m5”会被限流。  

![图10-1](/grokking/f10-1.png)

**滑动窗口算法（Rolling Window Algorithm）：**  
在此算法中，时间窗口从请求发生的那一刻开始计算，并持续时间窗口的长度。例如，如果在某一秒的第300毫秒和400毫秒各发送了一条消息，那么这两条消息将被统计为从该秒的300毫秒开始到下一秒的300毫秒结束这段时间内的两条消息。在上述图示中，如果限流为每秒两条消息，那么“m3”和“m4”将会被限流。

## 7. 限流器的高层设计  
限流器将负责决定由API服务器处理的请求以及应予拒绝的请求。当新请求到达时，Web服务器首先会询问限流器该请求是被允许还是应当被限流。如果请求未被限流，则会将其传递给API服务器。

![图10-2](/grokking/f10-2.png)

## 8. 基本系统设计与算法  
以下是一个示例场景：我们希望为每位用户限制每分钟的请求数。在这种情况下，对于每个唯一用户，我们需要维护一个计数器（表示该用户已发出的请求数）以及一个时间戳（表示开始计数的时间）。我们可以使用哈希表来实现，其中“键”（key）是用户ID（UserID），而“值”（value）是一个包含计数（Count）和起始时间（Epoch Time）的结构。  

假设我们的限流器允许每位用户每分钟最多3次请求。当新请求到来时，限流器将执行以下步骤：  
1. 如果哈希表中不存在该`UserID`：  
   - 插入此`UserID`记录  
   - 将`Count`设为1  
   - 将`StartTime`设为当前时间（归一化到分钟级别）  
   - 允许该请求通过  

2. 否则（如果哈希表中已存在该`UserID`记录）：  
   - 如果 `CurrentTime – StartTime >= 1 min`：  
     - 将`StartTime`重置为当前时间  
     - 将`Count`设为1  
     - 允许该请求通过  
   
   - 如果 `CurrentTime - StartTime < 1 min` 且：  
     - 当 `Count < 3` 时：  
       - 将`Count`加1  
       - 允许该请求通过  
     - 当 `Count >= 3` 时：  
       - 拒绝该请求

![图10-3](/grokking/f10-3.png)