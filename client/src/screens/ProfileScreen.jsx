import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import axios from 'axios';
import { logout } from '../actions/userActions'; // Ensure you import logout

const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails || {});
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin || {});
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile || {});
  const { success } = userUpdateProfile;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: 'USER_UPDATE_PROFILE_RESET' });
        dispatch(getUserDetails('profile'));
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, history, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  const deleteHandler = async () => {
    if (window.confirm('ARE YOU SURE? This will permanently delete your account and ALL your order history. This action cannot be undone.')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        // This calls the backend route we created: DELETE /api/auth/profile
        await axios.delete('/api/auth/profile', config);
        alert('Account deleted successfully.');
        dispatch(logout());
        history.push('/');
      } catch (error) {
        const errMessage = error.response && error.response.data.message ? error.response.data.message : error.message;
        alert(`Error deleting account: ${errMessage}`);
      }
    }
  };

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <h2>User Profile</h2>
          {message && <div className="alert alert-danger">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">Profile Updated</div>}
          {loading && <p>Loading...</p>}
          
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary mt-3">
              Update Profile
            </button>
          </form>

          <hr className="my-4" />

          <div className="d-grid gap-2">
            {/* Button to go to the new History Page */}
            <Link to="/history" className="btn btn-info text-white">
              View My Order History
            </Link>

            {/* Button to Delete Account */}
            <button className="btn btn-danger mt-2" onClick={deleteHandler}>
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;