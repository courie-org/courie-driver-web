import React, { useCallback, useRef, useState } from 'react';
import './index.scss';
import { MAP_STYLES } from './map.styles'
import {
  GoogleMap,
  Marker
} from "@react-google-maps/api";
import {w3cwebsocket as W3CWebSocket } from 'websocket';
import DeliveryInfoPanel from '../DeliveryInfoPanel'
import DriverControls from '../DriverControls';
import axios from 'axios';
import {
  useParams
} from "react-router-dom";

const options = {
  styles: MAP_STYLES,
  disableDefaultUI: true
};

const CourieMap = () => {

  let { driverId } = useParams();

  const [deliveryInfo, setDeliveryInfo] = useState({
    deliveryId: "",
    pickupAddress: "",
    dropoffAddress: "",
    isActive: false
  });

  const [driverInfo, setDriverInfo] = useState({
    currentLatLng: {
      lat: "0",
      lng: "0"
    }
  });
  const [availableDeliveries, setAvailableDeliveries] = useState([]);

  const fetchAvailableDeliveries = async () => {
    let deliveries = await axios.get(`http://${process.env.REACT_APP_DELIVERIES_HOST}/deliveries?status=NEW`);
    return deliveries.data;
  };

  const fetchDriverInfo = async () => {
    let response = await axios.get(`http://${process.env.REACT_APP_DRIVERS_HOST}/drivers/${driverId}`);
    return response.data;
  };

  const mapRef = useRef();
  const onMapLoad = async (map) => {
    mapRef.current = map;
    await initMap()
  };

  const initMap = async () => {

    const locationClient = W3CWebSocket(`ws://${process.env.REACT_APP_DRIVERS_HOST}/events/location-updates/${driverId}`);
    locationClient.onmessage = panTo;
    
    let driver = await fetchDriverInfo();
    let newDeliveries = await fetchAvailableDeliveries();

    let position = {lat: Number(driver.currentLatLng.lat), lng: Number(driver.currentLatLng.lng) };
    mapRef.current.panTo(position);
    driverMarkerRef.current.setPosition(position);
    driverMarkerRef.current.setVisible(true);

    setDriverInfo(driver);
    setAvailableDeliveries(newDeliveries);
  };

  const driverMarkerRef = useRef();
  const onDriverMarkerLoad = useCallback((marker) => {
    driverMarkerRef.current = marker;
  }, []);

  const pickupMarkerRef = useRef();
  const onPickupMarkerLoad = useCallback((marker) => {
    pickupMarkerRef.current = marker;
  }, []);

  const dropoffMarkerRef = useRef();
  const onDropoffMarkerLoad = useCallback((marker) => {
    dropoffMarkerRef.current = marker;
  }, []);

  const panTo = async (message) => {

    let {driver} = JSON.parse(message.data);

    driverMarkerRef.current.setPosition({ lat: Number(driver.currentLatLng.lat), lng: Number(driver.currentLatLng.lng) });
    mapRef.current.panTo({ lat: Number(driver.currentLatLng.lat), lng: Number(driver.currentLatLng.lng) });

    if (driver.currentDelivery) {
      displayAssignmentOverlay(driver.currentDelivery);
    }

    setDriverInfo(driver);

    let availDeliveryUpdate = await fetchAvailableDeliveries();
    setAvailableDeliveries(availDeliveryUpdate);

  };

  const onDiliveryPanelComplete = async (deliveryId) => {
    
    await axios.post(`http://${process.env.REACT_APP_DRIVERS_HOST}/drivers/${driverId}/assignments/${deliveryId}/dropoff`);
    
    pickupMarkerRef.current.setVisible(false);
    dropoffMarkerRef.current.setVisible(false);

    setDeliveryInfo({
      deliveryId: "",
      pickupAddress: "",
      dropoffAddress: "",
      isActive: false
    });
  };

  const onDiliveryPickup = async (deliveryId) => {
    await axios.post(`http://${process.env.REACT_APP_DRIVERS_HOST}/drivers/${driverId}/assignments/${deliveryId}/pickup`);
  };

  const displayAssignmentOverlay = useCallback((delivery) => {

    pickupMarkerRef.current.setPosition({ lat: Number(delivery.pickupLatLng.lat), lng: Number(delivery.pickupLatLng.lng) });
    dropoffMarkerRef.current.setPosition({ lat: Number(delivery.dropoffLatLng.lat), lng: Number(delivery.dropoffLatLng.lng) });

    pickupMarkerRef.current.setVisible(true);
    dropoffMarkerRef.current.setVisible(true);

    setDeliveryInfo({
      deliveryId: delivery.id,
      pickupAddress: delivery.pickupAddress,
      dropoffAddress: delivery.dropoffAddress,
      isActive: true
    });

  }, []);

  return (
    <div>
      <GoogleMap 
        id="map"
        mapContainerClassName="map-container"
        zoom={17} 
        options={options}
        onLoad={onMapLoad}
      >
    
        <Marker 
          onLoad={onDriverMarkerLoad}
          visible={true}
          icon={{
            url: `${process.env.PUBLIC_URL}/courie-car-icon-sm.png`,
            scaledSize: new window.google.maps.Size(80, 80),
          }} 
        />
        <Marker 
          onLoad={onPickupMarkerLoad}
          visible={false}
          icon={{
            url: `${process.env.PUBLIC_URL}/courie-box-icon-sm.png`,
            scaledSize: new window.google.maps.Size(80, 80),
          }}
        />
        <Marker 
          onLoad={onDropoffMarkerLoad}
          visible={false}
          icon={{
            url: `${process.env.PUBLIC_URL}/courie-box-icon-sm2.png`,
            scaledSize: new window.google.maps.Size(70, 70),
          }}
        />
      </GoogleMap>
      <DeliveryInfoPanel onComplete={onDiliveryPanelComplete} onPickup={onDiliveryPickup} deliveryInfo={deliveryInfo} />
      <DriverControls driver={driverInfo} deliveries={availableDeliveries} />
    </div>
    
  );

};

export default CourieMap;
