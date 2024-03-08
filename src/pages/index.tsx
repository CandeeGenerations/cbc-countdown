import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import {useEffect, useState} from 'react'

dayjs.extend(duration)
dayjs.extend(relativeTime)

export const classNames = (...classes) => classes.filter(Boolean).join(' ')

const StartPage = () => {
  const [countdown, setCountdown] = useState<string>()

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs()
      const serviceTimes = [
        now
          .add((7 - now.day()) % 7, 'day')
          .hour(9)
          .minute(45)
          .second(0)
          .format(),
        now
          .add((7 - now.day()) % 7, 'day')
          .hour(11)
          .minute(0)
          .second(0)
          .format(),
        now
          .add((7 - now.day()) % 7, 'day')
          .hour(18)
          .minute(30)
          .second(0)
          .format(),
        now
          .add(now.day() <= 3 ? 3 - now.day() : 10 - now.day(), 'day')
          .hour(19)
          .minute(30)
          .second(0)
          .format(),
      ]
      const upcomingServices = serviceTimes.map(time => dayjs(time)).filter(time => time.isAfter(now))

      if (upcomingServices.length === 0) {
        setCountdown(undefined)
        return
      }

      const nextService = upcomingServices[0]
      const duration = dayjs.duration(nextService.diff(now))

      if (nextService.diff(now, 'day') >= 1) {
        const diff = nextService.diff(now, 'day')
        setCountdown(`${diff} day${diff === 1 ? '' : 's'}`)
      } else {
        let countdownText = ''
        if (duration.hours() > 0) {
          countdownText += `${duration.hours()}:`
        }
        countdownText += `${duration.format('mm:ss')}`
        setCountdown(countdownText)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center space-y-4">
      <p className="uppercase font-bold text-xl">The next service begins{countdown ? ' in' : ''}</p>

      <p
        className={classNames(
          'font-black text-7xl mb-0',
          (countdown?.toLowerCase() || '').includes('day') || !countdown ? '' : 'font-mono',
        )}
      >
        {countdown || 'Soon'}
      </p>
    </div>
  )
}

export default StartPage
