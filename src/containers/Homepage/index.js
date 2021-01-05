import React, {useState} from 'react';
import './index.scss'
import axios from 'axios';
import { useHistory } from "react-router-dom";
import AddressDropdown from '../../components/AddressDropdown';

const Homepage = () => {

  const [driverId, setDriverId] = useState();
  const [driverName, setDriverName] = useState();
  const [license, setLicense] = useState();
  const [carDescription, setCarDescription] = useState();
  const [homebase, setLocation] = useState({});

  const history = useHistory();

  const registerDriver = async () => {

    let request = {
      id: driverId,
      name: driverName,
      licenseNumber: license,
      carDescription: carDescription,
      currentLatLng : {
        lat: homebase.lat,
        lng: homebase.lng
      }
    };

    console.log(request);

    const resp = await axios.post(`http://${process.env.REACT_APP_DRIVERS_HOST}/drivers`, request);
    
    history.push(`${process.env.PUBLIC_URL}/drivers/${resp.data.id}`);
  };

  return (
    <div className='homepage-container'>
      <section className='homepage-hero'>
        <div className='delivery-form-container'>
          <h3 className='delivery-form-heading'>Become a Courier</h3>
          <div className='delivery-form-body'>
            <div className='delivery-form-input'>
              <label>Driver ID</label>
              <input value={driverId} onChange={(e) => setDriverId(e.target.value)} required={true} />
            </div>
            <div className='delivery-form-input'>
              <label>Name</label>
              <input value={driverName} onChange={(e) => setDriverName(e.target.value)} required={true} />
            </div>
            <div className='delivery-form-input'>
              <label>License Number</label>
              <input value={license} onChange={(e) => setLicense(e.target.value)} required={true} />
            </div>
            <div className='delivery-form-input'>
              <label>Car Description</label>
              <input value={carDescription} onChange={(e) => setCarDescription(e.target.value)} required={true} />
            </div>
            <AddressDropdown label="Homebase: " onSelected={setLocation} />
          </div>
          <button className='button' onClick={registerDriver}>Register</button>
        </div>
      </section>
    </div>
  );
};

export default Homepage;