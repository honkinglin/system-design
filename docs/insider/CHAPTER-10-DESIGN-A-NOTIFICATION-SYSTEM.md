# 第十章：设计一个通知系统 (Design A Notification System)

近年来，通知系统已经成为许多应用程序中非常流行的功能。通知向用户传递重要信息，如突发新闻、产品更新、事件、优惠等，已成为我们日常生活中不可或缺的一部分。在本章中，你将被要求设计一个通知系统。

通知不仅仅是移动推送通知。通知有三种主要的格式：移动推送通知、短信消息和电子邮件。图 10-1 显示了每种通知的示例。

![图10-1](/insider/f10-1.png)

## 第 1 步 - 理解问题并确定设计范围
构建一个每天发送数百万条通知的可扩展系统并非易事。这需要对通知生态系统有深入的理解。这个面试问题有意设置得开放且模糊，需要你主动提问以澄清需求。

**候选人**：系统支持哪种类型的通知？  
**面试官**：推送通知、短信消息和电子邮件。  

**候选人**：这是一个实时系统吗？  
**面试官**：我们可以说这是一个软实时系统。我们希望用户尽快收到通知。然而，如果系统负载较高，稍微有些延迟是可以接受的。  

**候选人**：支持哪些设备？  
**面试官**：iOS 设备、安卓设备和笔记本/台式机。  

**候选人**：通知由什么触发？  
**面试官**：通知可以由客户端应用程序触发，也可以在服务器端进行调度。  

**候选人**：用户是否可以选择不接收通知？  
**面试官**：是的，选择退出的用户将不再接收通知。  

**候选人**：每天发送多少条通知？  
**面试官**：每天发送 1000 万条移动推送通知、100 万条短信和 500 万封电子邮件。

## 第 2 步 - 提出高层设计并达成共识
本节展示了支持多种通知类型的高层设计：iOS 推送通知、Android 推送通知、短信消息和电子邮件。其结构如下：

- 不同类型的通知
- 联系信息收集流程
- 通知发送/接收流程

### 不同类型的通知
我们首先从高层面来看每种通知类型是如何工作的。

#### IOS 推送通知 (IOS push notification)
发送 iOS 推送通知主要需要三个组件：

![图10-2](/insider/f10-2.png)

- **Provider（提供者）**：提供者构建并发送通知请求到 Apple 推送通知服务 (APNS)。构建推送通知时，提供者提供以下数据：
  - **设备令牌（Device token）**：用于发送推送通知的唯一标识符。
  - **有效载荷（Payload）**：这是一个包含通知有效载荷的 JSON 字典。以下是一个示例：
  ```
    {
      "aps": {
        "alert": {
          "title": "Game Request",
          "body": "Bob wants to play chess",
          "action-loc-key": "PLAY",
        },
        "badge": 5
      }
    }
  ```
  
- **APNS**：这是 Apple 提供的一个远程服务，用于将推送通知传递到 iOS 设备。
- **iOS 设备**：这是接收推送通知的终端客户端。

#### Android 推送通知 (Android push notification)
Android 采用类似的通知流程。不同之处在于，Android 设备通常使用 Firebase 云消息传递（Firebase Cloud Messaging, FCM）来发送推送通知，而不是使用 APNs。

![图10-3](/insider/f10-3.png)

#### 短信消息 (SMS message)
对于短信消息，通常使用第三方短信服务，如 Twilio [[1]](https://www.twilio.com/sms)、Nexmo [[2]](https://www.nexmo.com/products/sms) 等。这些大多数都是商业服务。

![图10-4](/insider/f10-4.png)

#### 电子邮件 (Email)
尽管公司可以自行设置电子邮件服务器，许多公司选择使用商业电子邮件服务。Sendgrid [[3]](https://sendgrid.com/) 和 Mailchimp [[4]](https://mailchimp.com/) 是最受欢迎的电子邮件服务之一，它们提供更高的投递率和数据分析功能。

![图10-5](/insider/f10-5.png)

图 10-6 显示了在包含所有第三方服务后的设计。

![图10-6](/insider/f10-6.png)

### 联系信息收集流程 (Contact info gathering flow)
为了发送通知，我们需要收集移动设备令牌、电话号码或电子邮件地址。如图 10-7 所示，当用户安装我们的应用程序或首次注册时，API 服务器会收集用户的联系信息并将其存储在数据库中。

![图10-7](/insider/f10-7.png)

图 10-8 显示了用于存储联系信息的简化数据库表。电子邮件地址和电话号码存储在用户表中，而设备令牌存储在设备表中。一个用户可以拥有多个设备，这意味着可以向该用户的所有设备发送推送通知。

![图10-8](/insider/f10-8.png)

### 通知发送/接收流程 (Notification sending/receiving flow)
我们将首先展示初步设计，然后提出一些优化建议。

#### 高层设计
图 10-9 展示了设计，下面解释了每个系统组件。

![图10-9](/insider/f10-9.png)

**服务 1 到 N**：一个服务可以是一个微服务、定时任务（cron job）或一个分布式系统，用于触发通知发送事件。例如，一个账单服务通过电子邮件提醒客户支付到期账单，或者一个购物网站通过短信告诉客户他们的包裹将在明天送达。

**通知系统**：通知系统是发送/接收通知的核心。为了简化起见，最初只使用一个通知服务器。它为服务 1 到 N 提供 API，并为第三方服务构建通知有效负载。

**第三方服务**：第三方服务负责将通知传递给用户。在集成第三方服务时，需要特别注意可扩展性。良好的可扩展性意味着系统灵活，能够轻松插入或移除第三方服务。另一个重要的考虑是，第三方服务在某些新市场或未来可能不可用。例如，FCM 在中国不可用，因此在中国使用了 Jpush、PushY 等替代的第三方服务。

**iOS、Android、SMS、Email**：用户在其设备上接收通知。

在此设计中发现了三个问题：
- **单点故障 (SPOF)**：使用一个通知服务器意味着存在单点故障风险。
- **难以扩展**：通知系统将与推送通知相关的所有处理都集中在一台服务器上，独立扩展数据库、缓存和不同的通知处理组件具有挑战性。
- **性能瓶颈**：处理和发送通知可能消耗大量资源。例如，构建 HTML 页面并等待第三方服务响应可能需要时间。在一个系统中处理所有这些任务，特别是在高峰时段，可能导致系统过载。

#### 高层设计（改进版）
在列出初始设计中的挑战后，我们进行了如下改进：
  - 将数据库和缓存从通知服务器中移出。
  - 增加更多的通知服务器并设置自动水平扩展。
  - 引入消息队列以解耦系统组件。

**图 10-10** 显示了改进后的高层设计。

![图10-10](/insider/f10-10.png)

从左到右理解上述图表是最好的方式：

**服务 1 到 N**：它们代表通过通知服务器提供的 API 发送通知的不同服务。

**通知服务器**：它们提供以下功能：
- 为服务提供发送通知的 API。这些 API 仅内部可用或由经过验证的客户端访问，以防止垃圾信息。
- 进行基本验证，如验证电子邮件、电话号码等。
- 查询数据库或缓存以获取渲染通知所需的数据。
- 将通知数据放入消息队列中以进行并行处理。

以下是发送电子邮件 API 的示例：

```
POST https://api.example.com/v/sms/send
```

**请求体**: 

```
{
  "to": [
    {
      "user_id": 12345,
    }
  ],
  "from": {
    "email": "from_address@example.com"
  },
  "subject": "Hello World!",
  "content": [
    {
      "type": "text/plain",
      "value": "Hello World!"
    }
  ]
}
```

**缓存**：用户信息、设备信息和通知模板都会被缓存。

**数据库 (DB)**：存储用户、通知、设置等相关数据。

**消息队列**：它们用于解除组件之间的依赖关系。在需要发送大量通知时，消息队列充当缓冲区。每种通知类型都分配有独立的消息队列，因此某一第三方服务的故障不会影响其他通知类型。

**工作节点**：工作节点是一组服务器，它们从消息队列中拉取通知事件并将其发送给相应的第三方服务。

**第三方服务**：已在初始设计中解释。

**iOS、Android、SMS、Email**：已在初始设计中解释。

接下来，我们来看一下每个组件如何协同工作来发送通知：

1. 一个服务通过通知服务器提供的 API 来发送通知。
2. 通知服务器从缓存或数据库中获取元数据，如用户信息、设备令牌和通知设置。
3. 一个通知事件被发送到相应的队列进行处理。例如，iOS 推送通知事件被发送到 iOS PN 队列。
4. 工作节点从消息队列中拉取通知事件。
5. 工作节点将通知发送到第三方服务。
6. 第三方服务将通知发送到用户设备。

## 第 3 步 - 设计深入探讨

在高层设计中，我们讨论了不同类型的通知、联系信息的收集流程以及通知发送/接收的流程。我们将在以下几个方面进行深入剖析：
- 可靠性
- 额外组件和注意事项：通知模板、通知设置、速率限制、重试机制、推送通知的安全性、监控队列中的通知和事件跟踪
- 更新后的设计

### 可靠性 (Reliability)
在设计分布式环境中的通知系统时，我们必须回答几个关于可靠性的重要问题。

#### 如何防止数据丢失？
在通知系统中，最重要的要求之一就是不能丢失数据。通知通常可以被延迟或重新排序，但绝不能丢失。为了满足这一要求，通知系统会将通知数据持久化到数据库中，并实现重试机制。为了实现数据持久化，通知日志数据库被引入，如图 10-11 所示。

![图10-11](/insider/f10-11.png)

#### 接收者会收到通知恰好一次吗？  

简短的回答是不会。虽然大多数情况下通知是恰好一次送达，但分布式的特性可能导致重复通知。为了减少重复发生的情况，我们引入了去重机制，并仔细处理每个失败案例。以下是一个简单的去重逻辑：  
当通知事件首次到达时，我们通过检查事件ID来判断是否之前已见过。如果之前见过，则将其丢弃。否则，我们将发送该通知。有关为什么我们无法实现恰好一次传递的原因，感兴趣的读者可以参考参考文献 [[5]](https://bravenewgeek.com/you-cannot-haveexactly-once-delivery/)。

### 附加组件和考虑因素  
我们已经讨论了如何收集用户联系信息、发送和接收通知。一个通知系统远不止于此。这里我们讨论额外的组件，包括模板重用、通知设置、事件跟踪、系统监控、限流等。

#### 通知模板  (Notification template)
一个大型通知系统每天发送数百万条通知，其中许多通知遵循类似的格式。引入通知模板是为了避免从头开始构建每条通知。通知模板是一个预格式化的通知，可以通过自定义参数、样式、跟踪链接等来创建您独特的通知。以下是一个推送通知的示例模板：  

**正文：**  
您梦寐以求的事情，我们敢于实现。[ITEM NAME] 回来了——仅限于 [DATE]。  

**行动号召：**  
立即订购。或者，保存我的 [ITEM NAME]。  

使用通知模板的好处包括保持格式一致、减少错误率和节省时间。

#### 通知设置  (Notification setting)
用户通常每天会收到过多的通知，容易感到不堪重负。因此，许多网站和应用程序为用户提供了精细的通知设置控制。这些信息存储在通知设置表中，包含以下字段：  
- `user_id`：`bigInt`，用户ID  
- `channel`：`varchar`，通知渠道，如推送通知、电子邮件或短信  
- `opt_in`：`boolean`，是否选择接收通知  

在向用户发送任何通知之前，我们首先检查用户是否选择接收该类型的通知。

#### 限流  (Rate limiting)
为了避免用户收到过多的通知，我们可以限制用户接收通知的数量。这非常重要，因为如果我们发送得太频繁，接收者可能会完全关闭通知。

#### 重试机制  (Retry mechanism)
当第三方服务未能成功发送通知时，该通知将被添加到消息队列中进行重试。如果问题持续存在，则会向开发人员发送警报。

#### 推送通知的安全性  (Security in push notifications)
对于iOS或Android应用，`appKey`和`appSecret`用于保护推送通知API的安全 [[6]](https://cloud.ibm.com/docs/services/mobilepush?topic=mobile-pushnotification-security-in-push-notifications)。只有经过身份验证或验证的客户端才能使用我们的API发送推送通知。感兴趣的用户可以参考参考文献 [[6]](https://cloud.ibm.com/docs/services/mobilepush?topic=mobile-pushnotification-security-in-push-notifications)。

#### 监控排队通知  (Monitor queued notifications)
一个关键的监控指标是排队通知的总数。如果数量过多，说明通知事件处理速度不够快。为了避免通知延迟，需要增加更多的工作线程。图10-12（感谢 [[7]](https://bit.ly/2sotIa6)）展示了排队消息待处理的示例。

![图10-12](/insider/f10-12.png)

#### 事件跟踪  
通知指标，如打开率、点击率和参与度，对于理解客户行为非常重要。分析服务实现了事件跟踪。通常需要在通知系统和分析服务之间进行集成。图10-13展示了为分析目的可能跟踪的事件示例。

![图10-13](/insider/f10-13.png)

### 更新设计  
将所有内容整合在一起，图10-14展示了更新后的通知系统设计。

![图10-14](/insider/f10-14.png)

在这个设计中，与之前的设计相比，增加了许多新组件。  
- 通知服务器配备了两个关键特性：身份验证和限流。  
- 我们还增加了重试机制以处理通知失败。如果系统未能发送通知，这些通知将被放回消息队列，工作线程将根据预定义的次数进行重试。  
- 此外，通知模板提供了一种一致且高效的通知创建过程。  
- 最后，增加了监控和跟踪系统，以进行系统健康检查和未来改进。

## 第 4 步 - 总结 

通知是不可或缺的，因为它们让我们了解重要信息。这可以是关于您最喜欢的Netflix电影的推送通知、有关新产品折扣的电子邮件，或是关于您在线购物付款确认的消息。

在本章中，我们描述了一个可扩展通知系统的设计，该系统支持多种通知格式：推送通知、短信和电子邮件。我们采用消息队列来解耦系统组件。

除了高层设计，我们还深入探讨了更多组件和优化。  
- **可靠性**：我们提出了一种强大的重试机制，以最小化失败率。  
- **安全性**：使用`AppKey`和`AppSecret`对，确保只有经过验证的客户端才能发送通知。  
- **跟踪和监控**：在通知流程的任何阶段实现这些功能，以捕获重要统计数据。  
- **尊重用户设置**：用户可以选择不接收通知。我们的系统在发送通知之前首先检查用户设置。  
- **限流**：用户将感激我们对接收通知数量的频率限制。

恭喜你走到这一步！现在给自己一个鼓励。做得好！

## 参考文献

[1] Twilio SMS: https://www.twilio.com/sms

[2] Nexmo SMS: https://www.nexmo.com/products/sms

[3] Sendgrid: https://sendgrid.com/

[4] Mailchimp: https://mailchimp.com/

[5] You Cannot Have Exactly-Once Delivery: https://bravenewgeek.com/you-cannot-haveexactly-once-delivery/

[6] Security in Push Notifications: https://cloud.ibm.com/docs/services/mobilepush?topic=mobile-pushnotification-security-in-push-notifications

[7] RadditMQ: https://bit.ly/2sotIa6
