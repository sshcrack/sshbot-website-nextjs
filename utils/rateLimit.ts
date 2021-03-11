import LRU from 'lru-cache';
import { NextApiResponse } from 'next';
import mexp from "math-expression-evaluator";


const rateLimit = () => {
  return customRateLimit({
    interval: parseInt(mexp.eval(process.env.RATE_INTERVAL as string)),
    uniqueTokenPerInterval: parseInt(process.env.RATE_UNIQUE as string)
  })
}

const customRateLimit = (options: Options) => {
  const tokenCache = new LRU({
    max: parseInt((options.uniqueTokenPerInterval || 500).toString(), 10),
    maxAge: parseInt((options.interval || 60000).toString(), 10),
  })

  return {
    check: (res: NextApiResponse, limit: number, token: string): Promise<Result | undefined> =>
      new Promise(resolve => {
        const tokenCount = (tokenCache.get(token) || [0]) as number[];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount)
        }
        tokenCount[0] += 1


        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= parseInt(limit.toString(), 10)
        const remaining = isRateLimited ? 0 : limit - currentUsage;
        res.setHeader('X-RateLimit-Limit', limit)
        res.setHeader(
          'X-RateLimit-Remaining',
          remaining
        )

        return resolve(isRateLimited ? {
          limit: limit,
          rateLimitRemaining: remaining,
          error: "Rate Limited. Try again in a few seconds."
        } : undefined);
      }),
  }
}

interface Options {
    interval: number,
    uniqueTokenPerInterval: number //Max users per second
}

interface Result {
  limit: number,
  rateLimitRemaining: number,
  error: string
}

export default rateLimit
