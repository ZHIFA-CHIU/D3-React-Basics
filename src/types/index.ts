export type Temperature = {
  date: string
  high: number
  avg: number
  low: number
}

export type ChartProps = {
  data: Temperature[]
  width: number
  height: number
  margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
  range?: Date[]
  rangeDispatch?: React.Dispatch<{
    type: string
    payload: Date[]
  }>
}
