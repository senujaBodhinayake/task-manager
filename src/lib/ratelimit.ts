import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let _ratelimit: Ratelimit | null = null;

export function getAuthRatelimit(): Ratelimit {
  if (!_ratelimit) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    _ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      analytics: true,
    });
  }
  return _ratelimit;
}