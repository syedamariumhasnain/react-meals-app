import React, { useState, useContext } from "react";

import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import Checkout from "./Checkout";
import CartContext from "../../context/cart-context";
import useHttp from "../../hooks/use-http";
import classes from "./Cart.module.css";

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const cartCtx = useContext(CartContext);
  const { isLoading, error, sendRequest, clearError } = useHttp();

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };

  // HTTP REQUEST - USING useHttp hook

  const submitOrderHandler = async (userData) => {
    const data = await sendRequest({
      url: "https://react-meals-app-ac8ea-default-rtdb.firebaseio.com/orders.json",
      method: "POST",
      headers: {
        "Content-Type": "application.json",
      },
      body: { user: userData, orderedItems: cartCtx.items },
    });

    // data.name --> generated Id of order
    if (data.name) {
      setOrderSubmitted(true);
      cartCtx.clearCart();
    }
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          // bind - pre-configure the function for future execution
          // and allows to pre-configure the arguments that function will
          // receive when it's being executed.
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartCtx.items.length > 0 && cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{cartCtx.totalAmount > 0 ? totalAmount : "$0.00"}</span>
      </div>
      {isCheckout && (
        <Checkout onCancel={props.onClose} onConfirm={submitOrderHandler} />
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );

  const submittingModalContent = <p>Sending order data ...</p>;

  const submittedModalContent = (
    <React.Fragment>
      <p>Successfully sent the order!</p>
      <div className={classes.actions}>
        <button className={classes.button} onClick={props.onClose}>
          Close
        </button>
      </div>
    </React.Fragment>
  );

  console.log("isLoading: ", isLoading, "orderSubmitted: ", orderSubmitted);

  return (
    <Modal onClose={props.onClose}>
      {!isLoading && !orderSubmitted && cartModalContent}
      {isLoading && submittingModalContent}
      {!isLoading && orderSubmitted && submittedModalContent}
    </Modal>
  );
};

export default Cart;
