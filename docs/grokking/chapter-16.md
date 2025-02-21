# 设计 Ticketmaster

让我们设计一个像 Ticketmaster 或 BookMyShow 一样的在线售票系统，用于出售电影票。

相似服务：bookmyshow.com, ticketmaster.com

难度等级：困难

## 1. 什么是在线电影票预订系统？  
在线电影票预订系统为用户提供在线购买影院座位的功能。电子票务系统允许用户随时随地浏览当前上映的电影并预订座位。  

## 2. 系统的需求与目标  
我们的票务预订服务应满足以下要求：  

**功能性需求：**  
1. 票务预订服务应能列出其合作影院所在的不同城市。  
2. 用户选择城市后，系统应展示该城市上映的电影。  
3. 用户选择电影后，系统应展示播放该电影的影院及可用场次。  
4. 用户应能选择特定影院的场次并预订电影票。  
5. 系统应显示影厅的座位分布情况，用户可根据自己的偏好选择多个座位。  
6. 用户应能区分可用座位和已预订座位。  
7. 用户在支付前可暂时锁定座位，锁定时间为 5 分钟。  
8. 用户应能选择等待座位释放，例如当其他用户的锁定时间到期时。  
9. 等待用户应按公平的“先到先得”原则进行服务。  

**非功能性需求：**  
1. 系统需要支持高并发。同一座位可能会在同一时间收到多个预订请求，系统应能公平且稳定地处理。  
2. 票务预订涉及金融交易，因此系统需具备安全性，并确保数据库符合 ACID 特性。  

## 3. 设计考量  
1. 为简化设计，假设系统不要求用户身份验证。  
2. 系统不支持部分订单处理，用户要么获取全部所选票，要么无法成功预订。  
3. 系统必须确保公平性。  
4. 为防止滥用，系统可限制用户单次最多预订 10 张票。  
5. 预计热门电影上映时流量会激增，座位将迅速被预订。因此，系统应具备良好的可扩展性和高可用性，以应对流量高峰。

## 4. **容量估算**  

**流量估算**  
假设我们的服务每月有 **30 亿** 次页面浏览量，并售出 **1000 万** 张电影票。  

**存储估算**  
假设系统覆盖 **500 个城市**，每个城市平均有 **10 家影院**，每家影院有 **2000 个座位**，且每天平均有 **2 场放映**。  

假设每个座位预订需要 **50 字节**（包含 ID、座位数量、场次 ID、电影 ID、座位号、座位状态、时间戳等）。同时，还需要存储关于电影和影院的信息，假设这些信息也需要 **50 字节**。  

那么，存储所有城市、所有影院、所有场次的每天数据量为：  

```
500 cities * 10 cinemas * 2000 seats * 2 shows * (50+50) bytes = 2GB / day
```

若要存储 **5 年** 的数据，所需总存储量约为 3.6TB

## 5. **系统 API 设计**  

我们可以使用 **SOAP 或 REST API** 来提供服务功能。以下是用于 **搜索电影场次和预订座位** 的 API 设计示例。

```
SearchMovies(api_dev_key, keyword, city, lat_long, radius, start_datetime, end_datetime, postal_code, includeSpellCheck, results_per_page, sorting_order)
```

**系统 API 设计**  

**请求参数**  
- `api_dev_key` (string)：API 开发者密钥，用户必须使用注册账户的密钥进行身份验证，并用于根据分配的配额限制请求频率。  
- `keyword` (string)：搜索关键词。  
- `city` (string)：按城市筛选电影。  
- `lat_long` (string)：按经纬度筛选电影。  
- `radius` (number)：搜索范围半径（单位：公里），用于限定搜索区域。  
- `start_datetime` (string)：筛选放映时间在该时间之后的电影。  
- `end_datetime` (string)：筛选放映时间在该时间之前的电影。  
- `postal_code` (string)：按邮政编码筛选电影。  
- `includeSpellcheck` (Enum: “yes” 或 “no”)：是否在返回结果中包含拼写检查建议。  
- `results_per_page` (number)：每页返回的结果数，最大值为 30。  
- `sorting_order` (string)：搜索结果的排序方式，可选值包括：  
  - `name,asc`（按名称升序排列）  
  - `name,desc`（按名称降序排列）  
  - `date,asc`（按日期升序排列）  
  - `date,desc`（按日期降序排列）  
  - `distance,asc`（按距离升序排列）  
  - `name,date,asc`（按名称和日期升序排列）  
  - `name,date,desc`（按名称和日期降序排列）  
  - `date,name,asc`（按日期和名称升序排列）  
  - `date,name,desc`（按日期和名称降序排列）  

**返回数据格式 (JSON)**  
以下是示例返回数据，包含电影信息及其放映场次：  

```json
[
  {
    "MovieID": 1,
    "ShowID": 1,
    "Title": "Cars 2",
    "Description": "About cars",
    "Duration": 120,
    "Genre": "Animation",
    "Language": "English",
    "ReleaseDate": "8th Oct. 2014",
    "Country": "USA",
    "StartTime": "14:00",
    "EndTime": "16:00",
    "Seats": [
      {
        "Type": "Regular",
        "Price": 14.99,
        "Status": "Almost Full"
      },
      {
        "Type": "Premium",
        "Price": 24.99,
        "Status": "Available"
      }
    ]
  },
  {
    "MovieID": 1,
    "ShowID": 2,
    "Title": "Cars 2",
    "Description": "About cars",
    "Duration": 120,
    "Genre": "Animation",
    "Language": "English",
    "ReleaseDate": "8th Oct. 2014",
    "Country": "USA",
    "StartTime": "16:30",
    "EndTime": "18:30",
    "Seats": [
      {
        "Type": "Regular",
        "Price": 14.99,
        "Status": "Full"
      },
      {
        "Type": "Premium",
        "Price": 24.99,
        "Status": "Almost Full"
      }
    ]
  }
]
```

```
ReserveSeats(api_dev_key, session_id, movie_id, show_id, seats_to_reserve[])
```

**座位预订 API 设计**  

**请求参数**  
- `api_dev_key` (string)：API 开发者密钥，与上述 API 相同，用于身份验证和访问控制。  
- `session_id` (string)：用户会话 ID，用于追踪本次预订。当预订时间到期，系统会根据此 ID 释放未完成的预订。  
- `movie_id` (string)：要预订的电影 ID。  
- `show_id` (string)：要预订的场次 ID。  
- `seats_to_reserve` (array)：包含要预订的座位 ID 的数组。  

**返回数据格式 (JSON)**  
API 返回预订状态，可能的结果包括：  
```json
{
  "status": "Reservation Successful"
}
```
```json
{
  "status": "Reservation Failed - Show Full"
}
```
```json
{
  "status": "Reservation Failed - Retry, as other users are holding reserved seats"
}
```

## 6. 数据库设计  
以下是关于我们将要存储的数据的一些观察：  
1. 每个城市可以有多个影院。  
2. 每个影院将包含多个影厅。  
3. 每部电影将对应多个放映场次，每个场次将包含多个预订。  
4. 用户可以拥有多个预订。

![图16-1](/grokking/f16-1.png)

## 7. 高层设计  
在高层架构中，Web 服务器将管理用户会话，而应用服务器将处理所有票务管理，包括将数据存储到数据库，以及与缓存服务器协作处理预订。

![图16-2](/grokking/f16-2.png)

## 8. 详细组件设计  
首先，我们假设服务运行在单台服务器上，并构建系统。  

**票务预订流程：**  
典型的票务预订流程如下：  
1. 用户搜索电影。  
2. 用户选择电影。  
3. 系统显示该电影的可用放映场次。  
4. 用户选择一个场次。  
5. 用户选择需要预订的座位数量。  
6. 如果所需数量的座位可用，系统会显示影院座位图供用户选座。否则，用户将跳转至“步骤 8”。  
7. 用户选座后，系统尝试预留所选座位。  
8. 如果座位无法预留，系统提供以下选项：  
   - 场次已满，向用户显示错误信息。  
   - 用户想要的座位已不可用，但仍有其他可选座位，用户将返回影院座位图重新选择。  
   - 目前没有可预订的座位，但部分座位被其他用户暂时保留在预订池中，尚未完成预订。用户将进入等待页面，直到所需座位释放。等待期间可能出现以下情况：  
     - 若所需座位变为可用，用户将返回影院座位图重新选座。  
     - 等待过程中，如果所有座位均被预订，或预订池中的座位数量不足以满足用户需求，用户将收到错误信息。  
     - 用户取消等待，返回电影搜索页面。  
     - 用户最多可等待 1 小时，超过时间后会话过期，用户将被重定向回电影搜索页面。  
9. 如果座位成功预留，用户有 5 分钟时间完成支付。支付成功后，预订标记为完成。若用户未能在 5 分钟内支付，所有预留座位将被释放，供其他用户预订。

![图16-3](/grokking/f16-3.png)

![图16-4](/grokking/f16-4.png)

![图16-5](/grokking/f16-5.png)

**服务器如何跟踪所有尚未预订的活跃预订？以及如何跟踪所有等待的用户？**

我们需要两个守护进程服务：  
1. 一个用于跟踪所有活跃的预订，并从系统中移除任何过期的预订，我们称之为 **ActiveReservationService**。  
2. 另一个服务用于跟踪所有等待的用户请求，一旦所需的座位数量变为可用，它将通知等待时间最长的用户选择座位，我们称之为 **WaitingUserService**。

**a. ActiveReservationsService**  
我们可以将每个“放映场次”的所有预订保存在内存中，使用类似于 Linked HashMap 或 TreeMap 的数据结构，同时将所有数据保存在数据库中。  
我们需要一个类似 Linked HashMap 的数据结构，允许我们直接访问任何预订，并在预订完成时将其移除。此外，由于每个预订都将与过期时间关联，HashMap 的头部将始终指向最旧的预订记录，以便在超时到达时过期该预订。  

为了存储每个放映场次的所有预订，我们可以使用 HashTable，其中‘key’为‘ShowID’，‘value’为包含‘BookingID’和创建‘Timestamp’的 Linked HashMap。  

在数据库中，我们将在‘Booking’表中存储预订记录，过期时间将存储在 Timestamp 列中。‘Status’字段的值为‘Reserved (1)’，当预订完成时，系统将更新‘Status’为‘Booked (2)’，并从相应放映场次的 Linked HashMap 中移除该预订记录。当预订过期时，我们可以将其从 Booking 表中移除，或者将其标记为‘Expired (3)’，并同时从内存中移除。  

**ActiveReservationsService** 还将与外部金融服务合作处理用户支付。每当预订完成或预订过期时，**WaitingUsersService** 将收到信号，通知其为任何等待的用户提供服务。

![图16-6](/grokking/f16-6.png)

**b. WaitingUsersService**  
与 **ActiveReservationsService** 类似，我们可以将每个放映场次的所有等待用户保存在内存中，使用 Linked HashMap 或 TreeMap。我们需要一个类似 Linked HashMap 的数据结构，这样我们就可以跳转到任何用户，当用户取消请求时将其从 HashMap 中移除。此外，由于我们采用先到先服务的方式，Linked HashMap 的头部将始终指向等待时间最长的用户，以便在座位可用时，能够以公平的方式为用户提供服务。  

我们将使用 HashTable 来存储每个放映场次的所有等待用户。‘key’ 为‘ShowID’，‘value’ 为包含 ‘UserIDs’ 和其等待开始时间的 Linked HashMap。  

客户端可以使用长轮询（Long Polling）来保持与预订状态的同步。当座位可用时，服务器可以利用此请求通知用户。  

**预订过期**  
在服务器端，**ActiveReservationsService** 会根据预订时间跟踪活跃预订的过期情况。由于客户端将显示一个计时器（表示过期时间），该计时器可能与服务器稍微不同步，我们可以在服务器端添加 5 秒的缓冲时间，以防止用户在服务器过期后仍然能成功购买，从而确保客户端的体验不受影响。

## 9. 并发处理  
如何处理并发，确保没有两个用户能预订同一个座位？我们可以在 SQL 数据库中使用事务来避免冲突。例如，如果我们使用 SQL 服务器，可以利用事务隔离级别在更新前锁定行。以下是示例代码：  

```
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

BEGIN TRANSACTION;

-- Suppose we intend to reserve three seats (IDs: 54, 55, 56) for ShowID=99
Select * From Show_Seat where ShowID=99 && ShowSeatID in (54, 55, 56) && Status=0 -- free

-- if the number of rows returned by the above statement is three, we can update to
-- return success otherwise return failure to the user.
update Show_Seat...
update Booking...

COMMIT TRANSACTION;
```

‘Serializable’ 是最高的隔离级别，能够保证防止脏读、不可重复读和幻读。需要注意的是，在一个事务中，如果我们读取了行数据，我们会对这些行加上写锁，以确保其他任何人无法更新这些数据。  

一旦上述数据库事务成功，我们可以开始在 **ActiveReservationService** 中跟踪该预订。

## 10. 故障容错  
当 **ActiveReservationsService** 或 **WaitingUsersService** 崩溃时会发生什么？  

每当 **ActiveReservationsService** 崩溃时，我们可以从‘Booking’表中读取所有活跃的预订。记住，我们将‘Status’列保持为‘Reserved (1)’，直到预订完成。另一种方法是采用主从配置，当主服务器崩溃时，从服务器可以接管。我们并未将等待用户存储在数据库中，因此当 **WaitingUsersService** 崩溃时，除非我们有主从设置，否则无法恢复这些数据。类似地，我们将为数据库配置主从架构，以使其具有故障容错能力。  

## 11. 数据分区  
数据库分区：如果我们按‘MovieID’进行分区，那么某个电影的所有放映将会集中在单个服务器上。对于一个热门电影，这可能会给该服务器带来很大的负载。一个更好的方法是按‘ShowID’进行分区，这样负载就会分布在不同的服务器上。  

**ActiveReservationService** 和 **WaitingUserService** 分区：我们的 web 服务器将管理所有活跃用户的会话，并处理与用户的所有通信。我们可以使用一致性哈希（Consistent Hashing）来根据‘ShowID’为 **ActiveReservationService** 和 **WaitingUserService** 分配应用服务器。这样，某个放映的所有预订和等待用户都将由一组特定的服务器处理。假设为了负载均衡，我们的 **一致性哈希** 为每个放映分配了三台服务器，那么每当预订过期时，持有该预订的服务器将执行以下操作：  

1. 更新数据库以移除预订（或将其标记为已过期），并更新‘Show_Seats’表中的座位状态。  
2. 从 Linked HashMap 中移除该预订。  
3. 通知用户他们的预订已过期。  
4. 向所有持有该放映等待用户的 **WaitingUserService** 服务器广播消息，找出等待时间最长的用户。**一致性哈希** 方案将告诉哪些服务器持有这些用户。  
5. 向持有等待时间最长用户的 **WaitingUserService** 服务器发送消息，处理该用户的请求（如果所需的座位已变为可用）。  

每当预订成功时，将发生以下操作：  
1. 持有该预订的服务器向所有持有该放映等待用户的服务器发送消息，这样这些服务器可以使所有需要更多座位的等待用户过期。  
2. 收到上述消息后，所有持有等待用户的服务器将查询数据库，查看现在有多少空余座位。这里使用数据库缓存可以大大提高效率，只需查询一次。  
3. 使所有需要预订超过可用座位数的等待用户过期。为此，**WaitingUserService** 需要遍历所有等待用户的 Linked HashMap。
