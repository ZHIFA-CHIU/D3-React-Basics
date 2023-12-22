import _ from 'lodash'
import { ChartProps } from '../../types'
import * as d3 from 'd3'

const RadialChart = ({ data, height, width, range }: ChartProps) => {
  const minTemp = d3.min(data, d => d.low)
  const maxTemp = d3.max(data, d => d.high)

  if (!minTemp || !maxTemp) return <h1>Something goes wrong</h1>

  const rScale = d3
    .scaleLinear()
    .domain([minTemp, maxTemp])
    .range([0, width / 3])

  const avgExtent = d3.extent(data, d => d.avg)

  if (!avgExtent[0] || !avgExtent[1]) return <h1>Something goes wrong</h1>

  const colorScale = d3
    .scaleSequential()
    .domain(avgExtent.reverse())
    .interpolator(d3.interpolateRdYlBu)

  const perSliceAngle = (2 * Math.PI) / data.length

  const arcGen = d3.arc()

  const paths = _.map(data, (d, i) => {
    let isColored = true
    if (range && range.length) {
      const dd = new Date(d.date)
      isColored = dd < range[0] || dd > range[1] ? false : true
    }
    return {
      path: arcGen({
        startAngle: i * perSliceAngle,
        endAngle: (i + 1) * perSliceAngle,
        innerRadius: rScale(d.low),
        outerRadius: rScale(d.high),
      }),
      fill: isColored ? colorScale(d.avg) : '#ccc',
    }
  })

  return (
    <>
      <svg height={height} width={width}>
        {paths.map((p, i) => (
          <path
            key={i}
            transform={`translate(${width / 2}, ${height / 2})`}
            fill={p.fill}
            d={p.path ?? ''}
          />
        ))}
      </svg>
    </>
  )
}

export default RadialChart
