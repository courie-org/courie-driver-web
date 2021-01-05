import React from 'react'
import './index.scss';

const DeliveryInfoPanel = ({deliveryInfo, onComplete, onPickup}) => {
  
  const isActive = deliveryInfo.isActive ? "active" : "";
  
  return (
    <div className={`delivery-info-container ${isActive}`}>
      <div className="delivery-info-container-heading">
        <h1 className="heading">Current Delivery Details</h1>
        <p>{deliveryInfo.deliveryId}</p>
      </div>
      <div className="delivery-info-container-info">
        <div className="delivery-info-container-body">
          
          <div className="delivery-info-data">
            <h3>Pickup Location: </h3>
            <p>{deliveryInfo.pickupAddress}</p>
          </div>
          <div className="delivery-info-data">
            <h3>Dropoff Location: </h3>
            <p>{deliveryInfo.dropoffAddress}</p>
          </div>
        </div>
        <div className="delivery-info-container-controls">
          <button onClick={() => onPickup(deliveryInfo.deliveryId)} className="button">Pickup</button>
          <button onClick={() => onComplete(deliveryInfo.deliveryId)} className="button">Drop Off</button>
        </div>
      </div>
    </div>
  )
}

export default DeliveryInfoPanel
