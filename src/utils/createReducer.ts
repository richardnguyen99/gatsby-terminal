interface Action<Payload> {
  type: string
  payload: Payload
}

type FType<State> = (state: State, action: Action<State>) => State

const createReducer = <StateValue>(
  initialState: StateValue,
  reducerMap: Record<
    string,
    (state: StateValue, payload: StateValue) => StateValue
  >
): FType<StateValue> => {
  return (state = initialState, action: Action<StateValue>): StateValue => {
    const reducer = reducerMap[action.type]

    return reducer ? reducer(state, action.payload) : state
  }
}

export default createReducer
