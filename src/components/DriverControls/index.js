import React , {useState} from 'react';
import './index.scss';
import { ReactComponent as MenuIcon } from './menu.svg';
import { ReactComponent as MapIcon } from './map.svg';
import { ReactComponent as QueueIcon } from './upload.svg';
import axios from 'axios';

// TODO: This needs some refactor love. Shame. :) 
const DriverControls = (props) => {

  const [isMenuActive, setMenuActive] = useState(false);
  const [isCurrentQueueActive, setCurrentQueueActive] = useState(true);
  const [activeClassCurrentAssignment, setSctiveClassCurrentAssignment] = useState("active");
  const [activeClassAvailable, setSctiveClassAvailable] = useState("");

  const toggleMenu = () => {
    setMenuActive(!isMenuActive);
  };

  const toggleAvailable = () => {
    setSctiveClassCurrentAssignment("");
    setSctiveClassAvailable("active");
    setCurrentQueueActive(false);
  };

  const toggleQueue = () => {
    setSctiveClassCurrentAssignment("active");
    setSctiveClassAvailable("");
    setCurrentQueueActive(true);
  };

  const startDelivery = async (driverId, deliveryId) => {
    await axios.post(`http://${process.env.REACT_APP_DRIVERS_HOST}/drivers/${driverId}/assignments/${deliveryId}/start`);
  };

  const acceptDelivery = async (driverId, deliveryId) => {
    await axios.post(`http://${process.env.REACT_APP_DRIVERS_HOST}/drivers/${driverId}/assignments/${deliveryId}`);
  };

  const buildAssignedDeliveries = () => {

    let deliveries;

    if (props.driver.assignments) {
      deliveries = props.driver.assignments.map((delivery) => {

        return (
          <li key={delivery.id} className='delivery-list-item'>
            <div className='location'>
              <h3>Pickup</h3>
              <p>{delivery.pickupAddress}</p>
            </div>
            <div className='location'>
              <h3>Destination</h3>
              <p>{delivery.dropoffAddress}</p>
            </div>
            <div className='delivery-list-controls'>
              <button className='button' onClick={() => { startDelivery(props.driver.id, delivery.id) } }>Start</button>
            </div>
        </li>
        )
      })
    }

    return (
      <div className='delivery-list'>
        <h2 className='delivery-list-heading'>Assigned Deliveries</h2>
        <ul className='delivery-list-content'>
          {deliveries}
        </ul>
      </div>
    );
  };

  const buildNewDeliveries = () => {

    let deliveries;

    if (props.deliveries) {
      deliveries = props.deliveries.map((delivery) => {

        return (
          <li key={delivery.id} className='delivery-list-item'>
            <div className='location'>
              <h3>Pickup</h3>
              <p>{delivery.pickupAddress}</p>
            </div>
            <div className='location'>
              <h3>Destination</h3>
              <p>{delivery.dropoffAddress}</p>
            </div>
            <div className='delivery-list-controls'>
              <button className='button' onClick={() => { acceptDelivery(props.driver.id, delivery.id) } }>Accept</button>
            </div>
        </li>
        )
      })
    }

    return (
      <div className='delivery-list'>
        <h2 className='delivery-list-heading'>New Deliveries</h2>
        <ul className='delivery-list-content'>
          {deliveries}
        </ul>
      </div>
    );
  };
  
  return (
    <div className="driver-controls">
      <div className={`driver-controls-panel ${isMenuActive ? "active" : ""} `} >
        <div className='driver-info'>
          <div className="driver-name">
            <h1>{props.driver.name}</h1>
            <p>{props.driver.carDescription}</p>
          </div>
        </div>
        <div className='driver-buttons'>

          <div onClick={toggleQueue} className={`driver-button ${activeClassCurrentAssignment}`}>
            <QueueIcon />
            { props.driver.assignments && props.driver.assignments.length > 0 &&
              <span className='notification'>{props.driver.assignments.length}</span>
            } 
          </div>

          <div onClick={toggleAvailable} className={`driver-button ${activeClassAvailable}`}>
            <MapIcon />
            { props.deliveries &&  props.deliveries.length > 0 && 
              <span className='notification'>{props.deliveries.length }</span>
            }
          </div>
      
        </div>
        <div onClick={toggleMenu} className={`driver-menu-button`} >
          <MenuIcon />
        </div>
       { 
          isCurrentQueueActive ? buildAssignedDeliveries() : buildNewDeliveries()
       }
      </div>
    </div>
  )
}

export default DriverControls;
