import { useReducer } from 'react'
import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
import RadialChart from './components/RadialChart'
import data from './data/data.json'
import { Temperature } from './types'

const dd: Temperature[] = data

const WIDTH = 650

const HEIGHT = 400

const margin = {
  top: 20,
  right: 5,
  bottom: 20,
  left: 35,
}

const rangeReducer = (
  state: Date[],
  action: { type: string; payload: Date[] },
) => {
  if (action.type === 'SET_RANGE') {
    return action.payload
  }
  return state
}

function App() {
  const [range, dispatchRange] = useReducer(rangeReducer, null, () => [])

  return (
    <div className="flex flex-col">
      {/* <PureSvg /> */}
      <div className="border-2 p-2 m-2 w-fit h-fit">
        <BarChart
          data={dd}
          width={WIDTH}
          height={HEIGHT}
          margin={margin}
          range={range}
          rangeDispatch={dispatchRange}
        />
      </div>
      <div className="border-2 p-2 m-2 w-fit h-fit">
        <LineChart data={dd} width={WIDTH} height={HEIGHT} margin={margin} />
      </div>
      <div className="border-2 p-2 m-2 w-fit h-fit">
        <RadialChart
          data={dd}
          width={WIDTH}
          height={HEIGHT}
          margin={margin}
          range={range}
        />
      </div>
    </div>
  )
}

export default App
