import { format } from "date-fns";
import { GroupedObservable, Observable } from "rxjs";
import { groupBy, map, mergeMap, scan, share } from "rxjs/operators";

const lastPriceMap = new Map<string, number>();

interface Options {
  intervalInMs: number;
  maxPriceChange: number;
}

const defaultOptions: Options = {
  intervalInMs: 1000,
  maxPriceChange: 0.01,
};

interface StockPrice {
  name: string;
  price: number;
  time: Date;
}

export interface StockPriceSession {
  key: string;
  name?: string;
  open?: number;
  close?: number;
  min?: number;
  max?: number;
  time?: Date;
}

export const getStockPrice$ = (
  stockName: string,
  options: Options = defaultOptions,
) => {
  const priceTick$ = new Observable<number>((subscriber) => {
    const lastPrice = lastPriceMap.get(stockName);
    let price = lastPrice ?? Math.random() * 10000;
    if (lastPrice === undefined) {
      lastPriceMap.set(stockName, price);
    }
    const _id = setInterval(() => {
      const changes = price * Math.random() * options.maxPriceChange;
      price += changes * (Math.random() > 0.5 ? 1 : -1);
      lastPriceMap.set(stockName, price);
      subscriber.next(price);
    }, options.intervalInMs);
    return () => {
      clearInterval(_id);
    };
  });
  return priceTick$.pipe(
    map(
      (val) =>
        ({ name: stockName, price: val, time: new Date() } as StockPrice),
    ),
    share(),
  );
};

export const getStockPriceInGroup$ = (
  stockName: string,
  maxGroup: number,
  options: Options = defaultOptions,
) => {
  return getStockPrice$(stockName, options).pipe(
    groupBy((val) => format(val.time, "yyyyMMddHHmm")),
    mergeMap((group$) => {
      return mapToStockPriceSession$(group$);
    }),
    scan((acc, val) => {
      const result = [...acc];
      if (result.length !== 0) {
        const lastIndex = result.length - 1;
        const lastItem = result[lastIndex];
        if (lastItem.key === val.key) {
          result.splice(lastIndex, 1, val);
        } else {
          result.push(val);
        }
      } else {
        result.push(val);
      }
      if (result.length > maxGroup) {
        const removeCount = result.length - maxGroup;
        result.splice(0, removeCount);
      }
      return result;
    }, [] as Required<StockPriceSession>[]),
  );
};

const mapToStockPriceSession$ = (
  groupedPrice$: GroupedObservable<string, StockPrice>,
) => {
  return groupedPrice$.pipe(
    scan(
      (groupStockPrice, val) => {
        const { price, time } = val;
        const open = groupStockPrice.open ?? price;
        let max = groupStockPrice.max;
        if (max === undefined || max < price) {
          max = price;
        }
        let min = groupStockPrice.min;
        if (min === undefined || min > price) {
          min = price;
        }
        const result: Required<StockPriceSession> = {
          ...groupStockPrice,
          name: val.name,
          open,
          close: price,
          max,
          min,
          time,
        };
        return result;
      },
      { key: groupedPrice$.key } as StockPriceSession,
    ),
  ) as Observable<Required<StockPriceSession>>;
};
