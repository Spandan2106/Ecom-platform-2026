import axios from 'axios';

export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: 'ORDER_LIST_MY_REQUEST' });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders/my-orders`, config);

    dispatch({ type: 'ORDER_LIST_MY_SUCCESS', payload: data.orders });
  } catch (error) {
    dispatch({
      type: 'ORDER_LIST_MY_FAIL',
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};