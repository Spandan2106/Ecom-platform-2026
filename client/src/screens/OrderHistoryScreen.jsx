import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// Ensure you have this action created in your orderActions file
import { listMyOrders } from '../actions/orderActions'; 

const OrderHistoryScreen = ({ history }) => {
  const dispatch = useDispatch();

  const orderListMy = useSelector((state) => state.orderListMy || {});
  const { loading, error, orders } = orderListMy;

  const userLogin = useSelector((state) => state.userLogin || {});
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch(listMyOrders());
    }
  }, [dispatch, history, userInfo]);

  return (
    <div className="container mt-3">
      <div className="row align-items-center mb-3">
        <div className="col">
            <h2>My Order History</h2>
        </div>
        <div className="col-auto">
            <Link to="/profile" className="btn btn-outline-secondary">Back to Profile</Link>
        </div>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.isPaid ? (
                      <span className="text-success">{order.paidAt.substring(0, 10)}</span>
                    ) : (
                      <span className="text-danger">Not Paid</span>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <span className="text-success">{order.deliveredAt.substring(0, 10)}</span>
                    ) : (
                      <span className="text-danger">Not Delivered</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`} className="btn btn-sm btn-info">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryScreen;