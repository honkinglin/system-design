# 设计 Pastebin

让我们设计一个类似Pastebin的网络服务，用户可以在其中存储纯文本。服务的用户将输入一段文本，并获取一个随机生成的URL以访问该文本。

类似服务：pastebin.com、pasted.co、chopapp.com  
难度级别：简单

## 1. 什么是 Pastebin？ (What is Pastebin?)
Pastebin类服务允许用户通过网络（通常是互联网）存储纯文本或图像，并生成独特的URL以访问上传的数据。这类服务也用于快速分享网络上的数据，因为用户只需传递URL即可让其他用户查看。

如果您之前没有使用过 [pastebin.com](https://pastebin.com/)，请尝试在那里创建一个新的“Paste”，并花一些时间浏览他们服务提供的不同选项。这将有助于您更好地理解本章内容。

## 2. 系统的需求和目标  (Requirements and Goals of the System)
我们的Pastebin服务应满足以下需求：

**功能性需求：**  
1. 用户应能够上传或“粘贴”他们的数据，并获得一个唯一的URL以访问该数据。  
2. 用户只能上传文本。  
3. 数据和链接将在特定时间段后自动过期；用户也应能够指定过期时间。  
4. 用户应可以选择为他们的粘贴指定一个自定义别名（可选）。

**非功能性需求：**  
1. 系统应具有高度可靠性，任何上传的数据都不应丢失。  
2. 系统应具有高可用性。这是必需的，因为如果我们的服务出现故障，用户将无法访问他们的粘贴内容。  
3. 用户应能够实时访问他们的粘贴，且延迟最低。  
4. 粘贴链接不应可猜测（不可预测）。

**扩展需求：**  
1. 分析功能，例如，一个粘贴被访问的次数。  
2. 我们的服务应通过REST API供其他服务访问。

## 3. 一些设计考虑因素 (Some Design Considerations)  
Pastebin与URL缩短服务共享一些需求，但我们还需考虑其他一些设计因素。

**用户一次最多可以粘贴多少文本？**  
我们可以限制用户的粘贴内容不得超过10MB，以防止滥用服务。  

**我们是否应该对自定义URL施加大小限制？**  
由于我们的服务支持自定义URL，用户可以选择他们喜欢的任何URL，但提供自定义URL并不是强制性的。然而，对自定义URL施加大小限制是合理的（并且通常是可取的），以便我们能够保持一致的URL数据库。

## 4. 容量估算与约束  (Capacity Estimation and Constraints)
我们的服务将以读取为主；读取请求将多于新粘贴的创建。我们可以假设读取与写入的比例为5:1。

**流量估算**：Pastebin服务的流量预计不会与Twitter或Facebook相似。我们假设每天有一百万个新粘贴被添加到我们的系统中。这使得我们每天有五百万次读取请求。

每秒新粘贴数量：  
`1M / (24小时 * 3600秒) ≈ 12个粘贴/秒`

每秒粘贴读取次数：  
`5M / (24小时 * 3600秒) ≈ 58次读取/秒`  

**存储估算**：用户最多可以上传10MB的数据；类似Pastebin的服务通常用于分享源代码、配置文件或日志。这类文本通常不大，因此我们假设每个粘贴平均包含10KB。  
按此速率，我们每天将存储10GB的数据。  
`1M * 10KB => 10GB/天`  

如果我们想要在十年内存储这些数据，则总存储容量需求为36TB。  
每天100万次粘贴，十年后我们将有36亿个粘贴。我们需要生成和存储唯一标识这些粘贴的密钥。如果我们使用base64编码（[A-Z, a-z, 0-9, ., -]），我们将需要六个字符的字符串：  
`64^6 ≈ 687亿个唯一字符串`  

如果一个字符占用一个字节，那么存储36亿个密钥所需的总大小为：  
`3.6B * 6 => 22GB`  

与36TB相比，22GB是微不足道的。为了留出一些余量，我们假设使用70%的容量模型（即我们不希望在任何时刻使用超过70%的总存储容量），这将使我们的存储需求增加到51.4TB。

**带宽估算**：对于写入请求，我们预计每秒有12个新粘贴，因此每秒将有120KB的流入。  
`12 * 10KB => 120KB/s`  

至于读取请求，我们预计每秒58个请求。因此，发送给用户的总数据流出将为0.6MB/s。  
`58 * 10KB => 0.6MB/s`  

尽管总流入和流出数据量不大，但我们在设计服务时应记住这些数字。

**内存估算**：我们可以缓存一些频繁访问的热门粘贴。根据80-20法则，即20%的热门粘贴产生80%的流量，我们希望缓存这20%的粘贴。  
由于我们每天有500万次读取请求，为了缓存这20%的请求，我们需要：  
`0.2 * 5M * 10KB ≈ 10GB`  

## 5. 系统API  (System APIs)
我们可以使用SOAP或REST API来暴露我们服务的功能。以下是创建/检索/删除粘贴的API定义：

`addPaste(api_dev_key, paste_data, custom_url=None user_name=None, paste_name=None, expire_date=None)`

**参数：**  
- **api_dev_key（字符串）：** 注册账户的API开发者密钥。该密钥将用于根据用户分配的配额对用户进行限流等操作。  
- **paste_data（字符串）：** 粘贴的文本数据。  
- **custom_url（字符串）：** 可选的自定义URL。  
- **user_name（字符串）：** 可选的用户名，用于生成URL。  
- **paste_name（字符串）：** 可选的粘贴名称。  
- **expire_date（字符串）：** 可选的粘贴过期日期。  

**返回：**（字符串）  
成功插入将返回可访问粘贴的URL，否则将返回错误代码。

同样，我们可以定义检索和删除粘贴的API：  

`getPaste(api_dev_key, api_paste_key)`

其中“api_paste_key”是一个表示要检索的粘贴密钥的字符串。该API将返回粘贴的文本数据。  

`deletePaste(api_dev_key, api_paste_key)`

成功删除将返回“true”，否则返回“false”。

## 6. 数据库设计  (Database Design)
关于我们存储的数据性质，有几点观察：  
1. 我们需要存储数十亿条记录。  
2. 每个我们存储的元数据对象都很小（小于100字节）。  
3. 每个我们存储的粘贴对象可以是中等大小（可能为几MB）。  
4. 记录之间没有关系，除非我们要存储哪个用户创建了哪个粘贴。  
5. 我们的服务以读取为主。  

**数据库架构：**  
我们需要两个表，一个用于存储粘贴的信息，另一个用于存储用户的数据。  

![图3-1](/grokking/f3-1.png)

在这里，“URLHash”是TinyURL的URL等效项，而“ContentKey”是存储粘贴内容的对象密钥。  

## 7. 高级设计  (High Level Design)
在高级层面上，我们需要一个应用层来处理所有的读写请求。应用层将与存储层进行交互，以存储和检索数据。我们可以将存储层分隔为一个数据库，用于存储与每个粘贴、用户等相关的元数据，另一个则用于在某些对象存储（如Amazon S3）中存储粘贴内容。数据的这种划分还将使我们能够单独扩展它们。

![图3-2](/grokking/f3-2.png)

## 8. 组件设计  (Component Design)

### a. 应用层  (Application layer)
我们的应用层将处理所有传入和传出的请求。应用服务器将与后端数据存储组件进行通信以服务请求。

**如何处理写入请求？**  
在接收到写入请求后，我们的应用服务器将生成一个六个字母的随机字符串，作为粘贴的密钥（如果用户没有提供自定义密钥）。应用服务器将粘贴的内容和生成的密钥存储在数据库中。成功插入后，服务器可以将密钥返回给用户。这里一个可能的问题是，插入可能会因重复密钥而失败。由于我们生成的是随机密钥，新生成的密钥有可能与现有密钥匹配。在这种情况下，我们应该重新生成一个新密钥并重试。我们应该继续重试，直到不再出现由于重复密钥导致的失败。如果用户提供的自定义密钥已在数据库中存在，我们应返回错误。

上述问题的另一种解决方案是运行一个独立的**密钥生成服务（KGS）**，该服务提前生成随机的六个字母字符串并将其存储在数据库中（我们称之为key-DB）。每当我们想存储一个新的粘贴时，只需使用已经生成的密钥之一。这种方法将简化流程并提高速度，因为我们不再需要担心重复或冲突。KGS将确保所有插入到key-DB中的密钥都是唯一的。KGS可以使用两个表来存储密钥，一个用于未使用的密钥，另一个用于所有已使用的密钥。KGS一旦将某些密钥提供给应用服务器，就可以将其移动到已使用密钥表中。KGS可以始终在内存中保留一些密钥，以便每当服务器需要它们时，可以快速提供。KGS将某些密钥加载到内存后，可以将其移动到已使用密钥表中，这样我们可以确保每个服务器获得唯一的密钥。如果KGS在使用内存中加载的所有密钥之前崩溃，我们将浪费这些密钥。考虑到我们有大量密钥，我们可以忽略这些密钥。

**KGS不是单点故障吗？** 是的，它是。为了解决这个问题，我们可以有一个KGS的备用副本，每当主服务器崩溃时，它可以接管生成和提供密钥。

**每个应用服务器能否从key-DB缓存一些密钥？** 是的，这确实可以加快速度。尽管在这种情况下，如果应用服务器在消耗所有密钥之前崩溃，我们将丢失这些密钥。由于我们有680亿个独特的六个字母的密钥，这可能是可以接受的。

**如何处理粘贴读取请求？**  
在接收到读取粘贴请求后，应用服务层将联系数据存储层。数据存储层搜索密钥，如果找到，则返回粘贴的内容。否则，将返回错误代码。

### b. 数据存储层 (Datastore layer)

我们可以将数据存储层分为两部分：  
1. **元数据数据库：** 我们可以使用关系数据库如MySQL，或使用分布式键值存储如Dynamo或Cassandra。  
2. **对象存储：** 我们可以将内容存储在对象存储中，如Amazon S3。每当我们感觉内容存储达到满容量时，我们可以通过添加更多服务器轻松增加存储容量。

![图3-3](/grokking/f3-3.png)

## 9. 清理或数据库清理  
请参见[设计URL缩短服务](./chapter-2)。

## 10. 数据分区和复制  
请参见[设计URL缩短服务](./chapter-2)。

## 11. 缓存和负载均衡器  
请参见[设计URL缩短服务](./chapter-2)。

## 12. 安全性和权限  
请参见[设计URL缩短服务](./chapter-2)。