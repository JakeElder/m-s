import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import _ from 'lodash';

const products = [{
  id: 'J01',
  description: 'Jeans',
  category: 'Womens jeans',
  imgSrc: 'http://i.ngimg.com/resources/nastygal/images/products/processed/48513.0.detail.jpg',
  price: 32.95
}, {
  id: 'B01',
  description: 'Blouse',
  category: 'Womans blouse',
  imgSrc: 'https://cdn.lulus.com/images/product/xlarge/1185586_184890.jpg',
  price: 24.95
}, {
  id: 'S01',
  description: 'Socks',
  category: 'Some socks',
  imgSrc: 'http://cdn.lulus.com/images/product/xlarge/1677792_268722.jpg',
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

class MastHead extends Component {
  render() {
    return (
      <header className="masthead">
        <h1 className="masthead__heading">Milestone Collection</h1>
        <a className="masthead__cta" href="#">Shop Now</a>
      </header>
    )
  }
}

class Product extends Component {
  render() {
    return (
      <li className="product" onClick={() => {
          store.dispatch({ type: 'ADD_PRODUCT', id: this.props.id });
          }}>
        <div className="product__image-container">
          <img className="product__image" src={this.props.imgSrc} />
        </div>
        <div className="product__meta">
            <div className="product__copy-container">
            <h3 className="product__heading">{this.props.description}</h3>
            <span className="product__category">{this.props.category}</span>
          </div>
          <div className="product__price-container">
            <span className="product__price">£{this.props.price}</span>
          </div>
        </div>
      </li>
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
            <td colSpan="2">Discount:</td>
            <td>£{getDiscount(state).toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="2">Delivery:</td>
            <td>£{getDelivery(state).toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="2">Total:</td>
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
      <div className="container">
        <MastHead />
        <ol className="product-list">
          {products.map(product => <Product {...product} />)}
        </ol>
        <Basket items={store.getState()} />
      </div>
    );
  }
}
