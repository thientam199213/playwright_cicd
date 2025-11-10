import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 20 },   // Warm-up
    { duration: '20s', target: 50 },   // Medium load
    { duration: '20s', target: 100 },  // High load
    { duration: '20s', target: 200 },  // Very high load
    { duration: '30s', target: 500 },  // Peak stress level
    { duration: '10s', target: 0 },    // Recovery
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'], // Stress test allows higher threshold
    http_req_failed: ['rate<0.05'],    // <5% errors acceptable under stress
  },
};

export default function () {
  const url = "https://demoqa.com/Account/v1/GenerateToken";

  const payload = JSON.stringify({
    userName: "test",
    password: "1234@1234",
  });

  const params = {
    headers: { "Content-Type": "application/json" },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "status OK or overloaded": (r) =>
      r.status === 200 || r.status === 429 || r.status === 500,

    "response not empty": (r) => r.body !== "",
  });

  sleep(1);
}

/***
STRESS TEST REPORT — API Generate Token

Target API: POST https://demoqa.com/Account/v1/GenerateToken
Test Tool: k6
Test Type: Stress Test
Test Goal: Xác định ngưỡng chịu tải tối đa và thời điểm API bắt đầu mất ổn định.


1. Test Scenario
Ramp-up to 500 VUs for 2 minutes
Virtual Users: 1 → 500
Duration: 2 minutes
Requests per VU: Continuous

2. Thresholds
p(95) < 1500ms (FAILED)
http_req_failed < 5% (FAILED)

3. Key Metrics Summary
Metric	Result	Status
p(95) Response Time	54.71s	❌ Failed
Error Rate	84.19%	❌ Failed
Avg Response Time	15.66s	❌ Failed
Max Response Time	60s	❌ Timeout
Requests Sent	1253	–

4. Observations

API bắt đầu mất ổn định từ ~200 VUs.
Đến 500 VUs server không còn phản hồi, dẫn đến timeout hàng loạt.
Server có dấu hiệu nghẽn I/O hoặc throttling từ phía DemoQA.
API không phải production service → không được thiết kế cho load cao.

5. Bottlenecks
Server không scale hoặc thiếu tài nguyên.
Nhiều request bị treo > 30–60s.
Stress test quá lớn cho môi trường demo.

6. Conclusion
API không thể xử lý hơn 200 VUs.
Tại 500 VUs: server overload hoàn toàn.
Stress test đạt mục tiêu → tìm ra ngưỡng vỡ tải.

***/
