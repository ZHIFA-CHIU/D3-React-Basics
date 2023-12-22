import { useEffect, useRef } from 'react'
import { ChartProps, Temperature } from '../../types'
import * as d3 from 'd3'

const BarChart = ({
  data,
  width,
  height,
  margin,
  rangeDispatch,
  range,
}: ChartProps) => {
  const xAxisRef = useRef<SVGGElement>(null)
  const yAxisRef = useRef<SVGGElement>(null)
  const brushRef = useRef<SVGGElement>(null)

  const dateExtent = d3.extent(data, d => new Date(d.date))

  const xScale = d3
    .scaleTime()
    .domain(dateExtent as unknown as [Date, Date])
    .range([margin.left, width - margin.right])

  const maxTemp = d3.max(data, d => d.high)

  const minTemp = d3.min(data, d => d.low)

  const yScale = d3
    .scaleLinear()
    .domain([minTemp, maxTemp] as unknown as [number, number])
    .range([height - margin.bottom, 0 + margin.top])

  const colorExtent = d3.extent(data, d => d.avg).reverse()

  const colorScale = d3
    .scaleSequential()
    .domain(colorExtent as unknown as [number, number])
    .interpolator(d3.interpolateRdYlBu)

  const bars = data.map(d => {
    let isColored = true
    if (range && range.length) {
      const dd = new Date(d.date)
      isColored = dd < range[0] || dd > range[1] ? false : true
    }
    return {
      x: xScale(new Date(d.date)),
      y: yScale(d.high),
      height: yScale(d.low) - yScale(d.high),
      fill: isColored ? colorScale(d.avg) : '#ccc',
    }
  })

  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  useEffect(() => {
    try {
      xAxisRef.current && d3.select(xAxisRef.current).call(xAxis)

      yAxisRef.current && d3.select(yAxisRef.current).call(yAxis)

      const brush = d3
        .brushX()
        .extent([
          [margin.left, margin.top], // top left pos
          [width - margin.right, height - margin.top], // bottom right pos
        ])
        .on('end', (e: d3.D3BrushEvent<Temperature>) => {
          if (!e.selection) return
          const [left, right] = e.selection
          const range = [
            xScale.invert(left as unknown as number),
            xScale.invert(right as unknown as number),
          ]
          rangeDispatch &&
            rangeDispatch({
              type: 'SET_RANGE',
              payload: range,
            })
        })

      brushRef.current && d3.select(brushRef.current).call(brush)
    } catch (err) {
      console.error(err)
    }
  }, [])

  return (
    <>
      <svg width={width} height={height}>
        {bars.map((bar, i) => (
          <rect
            key={i}
            x={bar.x}
            y={bar.y}
            width={2}
            height={bar.height}
            fill={bar.fill}
          />
        ))}
        <g
          ref={xAxisRef}
          transform={`translate(0, ${height - margin.bottom})`}
        />
        <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
        <g ref={brushRef} />
      </svg>
    </>
  )
}

export default BarChart
