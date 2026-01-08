export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    // Placeholder for future cart actions (ADD/REMOVE)
    // Currently just maintaining state structure for Navbar
    case 'CART_CLEAR_ITEMS':
      return { ...state, cartItems: [] };
    default:
      return state;
  }
};