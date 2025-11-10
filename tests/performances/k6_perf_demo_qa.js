import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 10,          // 10 users
  duration: "30s",  // run for 30 seconds

  thresholds: {
    http_req_duration: ["p(95)<500"],   // 95% request < 500ms
    http_req_failed: ["rate<0.01"],     // failed request <1%
  },
};

export default function () {
  const res = http.get("https://demoqa.com/text-box");

  sleep(1); // wait 1s before the next iteration
}
