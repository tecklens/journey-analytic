import {startOfDay, startOfMonth, startOfWeek, subDays, subHours, subMonths} from "date-fns";

export enum DateRange {
  'today' = 'today',
  '24hour' = '24hour',
  '0week' = '0week',
  '7day' = '7day',
  '0month' = '0month',
  '30day' = '30day',
  '90day' = '90day',
  '6month' = '6month',
  '12month' = '12month',
  'custom' = 'custom',
}

export function getDateRange(range: DateRange): { start: Date | undefined, end: Date | undefined } {
  const now = new Date();
  switch (range) {
    case DateRange.today:
      return {
        start: startOfDay(now),
        end: undefined
      }
    case DateRange['24hour']:
      return {
        start: subHours(now, 24),
        end: undefined
      }
    case DateRange['0week']:
      return {
        start: startOfWeek(now),
        end: undefined
      }
    case DateRange['7day']:
      return {
        start: subDays(now, 7),
        end: undefined
      }
    case DateRange['0month']:
      return {
        start: startOfMonth(now),
        end: undefined
      }
    case DateRange['30day']:
      return {
        start: subDays(now, 30),
        end: undefined
      }
    case DateRange['90day']:
      return {
        start: subDays(now, 90),
        end: undefined
      }
    case DateRange['6month']:
      return {
        start: subMonths(now, 6),
        end: undefined
      }
    case DateRange['12month']:
      return {
        start: subMonths(now, 12),
        end: undefined
      }
    default:
      return {
        start: subMonths(now, 12),
        end: undefined
      }
  }
}

export function getDateRangeWithQuarterPoint(range: DateRange, epoch: number) {
  const time = getDateRange(range)

  return {
    start: time.start ? calculateJobId(time.start.getTime(), epoch) : undefined,
    end: time.end ? calculateJobId(time.end.getTime(), epoch) : undefined,
  }
}

export function calculateJobId(time: number, epoch: number): number {
  const numMinutes = (time - epoch) / (1000 * 60) //số phút từ thời điểm epoch
  return Math.floor(numMinutes / 15); // cứ 15p theo cron thì tính là 1 key
}