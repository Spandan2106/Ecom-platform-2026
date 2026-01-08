export const orderListMyReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case 'ORDER_LIST_MY_REQUEST':
      return { loading: true };
    case 'ORDER_LIST_MY_SUCCESS':
      return { loading: false, orders: action.payload };
    case 'ORDER_LIST_MY_FAIL':
      return { loading: false, error: action.payload };
    case 'ORDER_LIST_MY_RESET':
      return { orders: [] };
    default:
      return state;
  }
};