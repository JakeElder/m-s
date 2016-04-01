import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import _ from 'lodash';

const products = [{
  id: 'J01',
  description: 'Jeans',
  imgSrc: "http://asset1.marksandspencer.com/is/image/mands/SD_01_T62_1700K_P6_X_EC_90?$PRODVIEWER_SUB$",
  price: 32.95
}, {
  id: 'B01',
  description: 'Blouse',
  imgSrc: 'http://asset1.marksandspencer.com/is/image/mands/SD_01_T41_1424C_Z4_X_EC_90?$PRODVIEWER_SUB$',
  price: 24.95
}, {
  id: 'S01',
  description: 'Socks',
  imgSrc: 'http://asset1.marksandspencer.com/is/image/mands/SD_02_T60_5650_T4_X_EC_1?$PRODVIEWER_SUB$',
  price: 7.95
}];

function basket(state = [], action) {
  switch (action.type) {
    case 'ADD_PRODUCT':
      if (_.some(state, { id: action.id })) {
        return state.map((item) => {
          if (item.id === action.id) {
            return {
              id: item.id,
              quantity: item.quantity + 1
            };
          }
          return item;
        });
      }
      else {
        return [
          ...state,
          { id: action.id, quantity: 1 }
        ];
      }

    default:
      return state;
  }
};

function getProduct(id) {
  return _.find(products, { id: id });
}

export function roundToTwo(num) {    
    return +(Math.round(num + 'e+2')  + 'e-2');
}

export function getDiscount(state) {
  let discount = 0;
  let jeansEntry = _.find(state, { id: 'J01' });
  if (jeansEntry) {
    let discountedJeans = Math.floor(jeansEntry.quantity / 2);
    discount += roundToTwo(discountedJeans * (getProduct('J01').price / 2));
  }
  return discount;
}

export function getDelivery(state) {
  return getDeliveryFromTotal(getProductTotal(state) - getDiscount(state));
}

export function getDeliveryFromTotal(total) {
  if (total < 50) {
    return 4.95;
  } else if (total < 90) {
    return 2.95;
  }
  return 0;
}

export function getProductTotal(state) {
  return _.reduce(state, (sum, item) => {
    let product = getProduct(item.id);
    return sum + (product.price * item.quantity);
  }, 0);
}

export function getTotal(state) {
  return roundToTwo(getProductTotal(state) - getDiscount(state) + getDelivery(state)); 
}

const store = createStore(basket);

class Product extends Component {
  render() {
    return (
      <div>
        <img src={this.props.imgSrc} />
        <span>£{this.props.price}</span>
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_PRODUCT',
            id: this.props.id
          });
        }}>Add</button>
      </div>
    );
  }
}

class Basket extends Component {
  render() {
    let state = store.getState();
    return (
      <table>
        <thead>
          <tr>
            <td>Item</td>
            <td>Quantity</td>
            <td>Price</td>
          </tr>
        </thead>
        <tbody>
          {state.map((entry) => {
            let p = getProduct(entry.id);
            return <tr key={entry.id}>
              <td>{p.description}</td>
              <td>{entry.quantity}</td>
              <td>£{(p.price * entry.quantity).toFixed(2)}</td>
            </tr>
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan='2'>Discount:</td>
            <td>£{getDiscount(state).toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan='2'>Delivery:</td>
            <td>£{getDelivery(state).toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan='2'>Total:</td>
            <td>£{getTotal(state).toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
     );
  }
}

export default class App extends Component {
  constructor() {
    store.subscribe(() => { this.forceUpdate() });
    super();
  }

  render() {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              {products.map(product => (<td key={product.id}><Product {...product} /></td>))}
            </tr>
           </tbody>
        </table>
        <Basket items={store.getState()} />
      </div>
    );
  }
}
