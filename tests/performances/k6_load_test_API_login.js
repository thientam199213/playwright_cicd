import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 50,                 // 20 virtual users
    duration: '30s',         // run for 30 seconds
    thresholds: {
        http_req_duration: ['p(95)<800'], // 95% requests < 800ms
    },
};

export default function () {

    // Dynamic data (you can change or parameterize later)
    const url = 'https://demoqa.com/Account/v1/GenerateToken';

    const payload = JSON.stringify({
        userName: 'testuser123',
        password: 'Password!23'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // 🔹 Send POST request
    let res = http.post(url, payload, params);

    // 🔹 Validate response
    check(res, {
        'status is 200': (r) => r.status === 200,
        'token exists': (r) => r.json('token') !== undefined,
        'result is success': (r) => typeof r.json('status') === 'string',
    });

    sleep(1); // simulate user wait time
}

/***
 * PERFORMANCE TEST REPORT

Test Target: API Login – POST /Account/v1/GenerateToken
Report Date: DD/MM/YYYY
Prepared by: Tam (QA Engineer)

1. Test Objective (Mục tiêu kiểm thử)

Mục tiêu của bài kiểm thử hiệu năng là:
Xác định khả năng đáp ứng của API login khi có nhiều người dùng truy cập đồng thời.
Đánh giá thời gian phản hồi và độ ổn định của hệ thống.
Kiểm tra hệ thống có đáp ứng được yêu cầu SLA/SLI hay không.
Xác định giới hạn tải và khả năng chịu tải của API.

2. Test Scope (Phạm vi kiểm thử)

Kiểm thử tập trung vào một endpoint Authentication:
POST https://demoqa.com/Account/v1/GenerateToken
Payload:
{
  "userName": "string",
  "password": "string"
}

Các chỉ số được đo:
Response Time (avg, p90, p95)
Throughput (req/sec)
Error Rate
Server Stability under Load

3️ Test Tools (Công cụ)

k6 v0.52.0 – load testing framework
Node.js (local machine)
Windows PowerShell – chạy test

4️ Test Scenario (Kịch bản kiểm thử)

Scenario: Constant Load – 50 Virtual Users liên tục trong 30 giây
scenarios:
  default:
    executor: constant-vus
    vus: 50
    duration: 30s

Thresholds yêu cầu (SLA):
http_req_duration: p(95) < 800ms
Mục tiêu: 95% request phải < 0.8 giây.

5️ Test Results (Kết quả kiểm thử)
🔹 5.1 Summary
Metric	Result
Total Requests	94
Avg Response Time	22.66s
p90	29.47s
p95	29.75s
Error Rate	0%
Threshold	FAILED
🔹 5.2 Detailed Observations
API phản hồi rất chậm dưới tải 50 VUs.
95% response mất ~30 giây, gấp 37 lần so với giới hạn 800ms.
Không có request nào bị lỗi HTTP → hệ thống không bị crash, nhưng xử lý chậm.
Throughput thấp: ~1.59 req/s cho 50 VUs.

6️ Analysis (Phân tích nguyên nhân)

Dựa vào pattern thời gian phản hồi, có thể đưa ra một số giả định:
❗ Hiện tượng bottleneck: Authentication service quá chậm hoặc queue bị nghẽn.
Server có thể đang áp dụng: Rate limiting
Request throttling
Low resources (CPU/RAM)
API demo không được thiết kế để chịu tải cao.
❗ Không có lỗi timeout hoặc connection error
→ Điều này cho thấy server vẫn hoạt động nhưng mất rất nhiều thời gian để xử lý request.

7️ Conclusion (Kết luận)

API không đạt yêu cầu hiệu năng.
Với chỉ 50 VUs, hệ thống đã phản hồi chậm ~30 giây/request.
Không đáp ứng SLA: p95 < 800ms.
Server vẫn hoạt động, nhưng throughput thấp → dễ dẫn đến nghẽn trong môi trường thực.
***/