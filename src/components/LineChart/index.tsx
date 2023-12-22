import { ChartProps, Temperature } from '../../types'
import * as d3 from 'd3'

const LineChart = ({ data, height, width }: ChartProps) => {
  const dateScale = d3.extent(data, d => new Date(d.date))

  if (!dateScale[0] || !dateScale[1]) return <h1>Something goes wrong</h1>

  const xScale = d3.scaleTime().domain(dateScale).range([0, width])

  const maxHigh = d3.max(data, d => d.high)
  const minLow = d3.min(data, d => d.low)
  if (!minLow || !maxHigh) return <h1>Something goes wrong</h1>

  const yScale = d3.scaleLinear().domain([minLow, maxHigh]).range([height, 0])

  const lineGen = d3.line<Temperature>().x(d => xScale(new Date(d.date)))

  const lines = [
    {
      d: lineGen.y(d => yScale(d.high))(data),
      fill: 'red',
    },
    {
      d: lineGen.y(d => yScale(d.low))(data),
      fill: 'blue',
    },
  ]

  return (
    <>
      <svg height={height} width={width}>
        {lines.map((l, i) => (
          <path
            key={i}
            d={l.d ?? ''}
            fill={'none'}
            strokeWidth={2}
            stroke={l.fill}
          />
        ))}
      </svg>
    </>
  )
}

export default LineChart
