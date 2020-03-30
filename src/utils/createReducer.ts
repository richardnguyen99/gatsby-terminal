/**
 * Action type that takes one type parameterto be that payload type.
 * The type parameter should be taken from the type parameter of the
 * `createReducer` below
 *
 * Example structure:
 * action = {
 *   type: 'UPDATED_SUCCESS',
 *   payload: {
 *     token: ...,
 *   },
 * }
 */
export interface Action<Payload> {
  type: string
  payload: Payload
}

// Reducer a function return type taking two parameters (state, action)
// and return a new updated state using data from `action.payload`.
type ReducerFunctionReturnType<State> = (
  state: State,
  action: Action<State>
) => State

/**
 * Reducer function to avoid the switch-case usage.
 *
 * @template StateValue - Define value for the global state, usually Object.
 * @param {StateValue} initialState - Default state to initiate the global context.
 * @param {Record<string, (state: StateValue, payload: StateValue) => StateValue>} reducerMap - Replacement of switch-case.
 * @returns {FType<StateValue>} - Return a function that maps `action.type` to `reducerMap`
 */
const createReducer = <StateValue>(
  initialState: StateValue,
  reducerMap: Record<
    string,
    (state: StateValue, payload: StateValue) => StateValue
  >
): ReducerFunctionReturnType<StateValue> => {
  // Normally, useReducer will take two parameters, reducer (Function) and initialState.
  // useReducer((state, action) => { return newState; }, initialState).
  // Usually, reducer will use switch-case statements to catch the upcoming actions.
  // But it seems personally not clean, so there will be an object to do that job.
  return (state = initialState, action: Action<StateValue>): StateValue => {
    // `reducerMap` parameter is an object that stores `action.type`s as its keys
    // and the part inside the cases of switch statement will be its values.
    //
    // Example:
    // switch(action.type) {
    //   case 'UPDATED_SUCCESS':
    //     return newState
    // }
    // will be equal to
    // const reducerMap = {
    //   'UPDATED_SUCCESS': (state, payload) => newState
    // }
    const reducer = reducerMap[action.type]

    // If a type of action isn't currently registered, reducer function will be undefined
    // so will return initialState. If not, reducer function will take two arguments to
    // return a new object of state.
    return reducer ? reducer(state, action.payload) : state
  }
}

export default createReducer
