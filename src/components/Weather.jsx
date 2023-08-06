import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MDBContainer,
  MDBTypography,
  MDBInput,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBSpinner,
} from 'mdb-react-ui-kit';

import toast from 'react-hot-toast';
const Weather = () => {
  const [searchValue, setSearchValue] = useState('Kolkata');
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
    const debounce = setTimeout(() => {
      const getData = async () => {
        try {
          setIsLoading(true);
          const res = await axios.get(apiUrl, {
            method: 'GET',
            headers: { accept: 'application/json' },
          });
          const jsonData = await res.data;
          // if (!jsonData) {
          //   return toast.error('Something went wrong!');
          // }
          setData(jsonData);
          setIsLoading(false);
        } catch (error) {
          // console.log(error.message);
          toast.error(error.message, {
            duration: 2000,
          });
          toast.error(error.data.message, {
            duration: 2000,
          });
        }
      };
      getData();
    }, 10000);

    return () => clearTimeout(debounce);
  }, [searchValue]);

  // console.log(data);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  if (!data) return toast.error('Loading...!');

  const { name, dt, main, sys, weather, wind, coord } = data;
  if (!coord && !main && !sys && !weather) {
    return toast.loading('Loading!', {
      duration: 2000,
      position: 'top-center',

      // Styling
      className: 'bg-warning',

      // Custom Icon
      icon: '',

      // Change colors of success/error/loading icon
      iconTheme: {
        primary: '#000',
        secondary: '#fff',
      },

      // Aria
      ariaProps: {
        role: 'status',
        'aria-live': 'polite',
      },
    });
  }
  const { lat, lon } = coord;
  const { humidity, pressure, temp } = main;
  const { country, sunrise, sunset } = sys;
  const { description, icon } = weather[0];
  const { speed } = wind;

  const currentTimeStamp = dt * 1000;
  const currentDate = new Date(currentTimeStamp).toLocaleDateString(
    `en-${country}`,
    {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    }
  );

  const sunriseTimeStamp = sunrise * 1000;
  const currentSunriseTime = new Date(sunriseTimeStamp).toLocaleTimeString(
    `en-${country}`,
    {
      timeStyle: 'short',
    }
  );

  const sunsetTimeStamp = sunset * 1000;
  const currentSunsetTime = new Date(sunsetTimeStamp).toLocaleTimeString(
    `en-${country}`,
    {
      timeStyle: 'short',
    }
  );

  return (
    <>
      {isLoading ? (
        <MDBContainer className='hstack justify-content-center text-center mt-5'>
          <MDBSpinner role='status'>
            <span className='visually-hidden'>Loading...</span>
          </MDBSpinner>
        </MDBContainer>
      ) : (
        <>
          <MDBContainer fluid className='gx-0 box'>
            <MDBTypography
              variant='h1'
              className='mb-0 p-3 text-center text-dark'>
              Weather App
            </MDBTypography>
            <MDBTypography className='text-center text-dark fw-bold'>
              {currentDate}
            </MDBTypography>

            <MDBContainer className='py-3 gx-0 d-flex justify-content-center align-items-center gap-2 flex-lg-nowrap flex-md-nowrap flex-sm-wrap flex-wrap'>
              <MDBRow className='d-flex gx-0'>
                <MDBCol lg={12} md={12} sm={12} className='col-12 m-auto'>
                  <form action='' method='get'>
                    <MDBInput
                      wrapperClass='mb-4'
                      className='text-dark'
                      label='Search'
                      id='search'
                      name='search'
                      type='text'
                      value={searchValue}
                      onChange={handleChange}
                    />
                  </form>
                </MDBCol>
              </MDBRow>
              <MDBBtn className='mb-4'>Search</MDBBtn>
            </MDBContainer>

            <MDBContainer className='p-1 gx-0'>
              {/* weather logo */}
              <MDBContainer className='hstack justify-content-center mt-3'>
                <MDBRow className='gx-0'>
                  <MDBCol lg={12} md={12} sm={10} className='col-12 m-auto'>
                    <figure className='figure'>
                      <img
                        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                        style={{ backgroundColor: '#9e9e9e' }}
                        className='figure-img img-fluid rounded-circle shadow-3-strong mb-3'
                        alt='...'
                      />
                      <figcaption className='figure-caption text-center text-capitalize text-dark fw-bold'>
                        {description}
                      </figcaption>
                    </figure>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>

              <MDBTypography variant='h3' className='ms-2 text-light'>
                Location: {name}
              </MDBTypography>
              <MDBContainer className='p-2 hstack justify-content-around gap-2 mb-3 flex-lg-nowrap flex-md-nowrap flex-sm-wrap flex-wrap'>
                <MDBContainer className='bg-dark shadow-3-strong rounded-3 p-1 text-light text-center left-side'>
                  <MDBTypography>Sunrise: {currentSunriseTime}</MDBTypography>
                  <MDBTypography>Humadity: {humidity}%</MDBTypography>
                  <MDBTypography>Temp: {temp}&deg;C</MDBTypography>
                  <MDBTypography>Latitude: {lat.toFixed(2)}</MDBTypography>
                </MDBContainer>
                <MDBContainer className='bg-dark shadow-3-strong rounded-3 p-1 text-light text-center right-side'>
                  <MDBTypography>Sunset: {currentSunsetTime}</MDBTypography>
                  <MDBTypography>Pressure: {pressure}</MDBTypography>
                  <MDBTypography>Wind: {speed}km/h</MDBTypography>
                  <MDBTypography>Longitude: {lon.toFixed(2)}</MDBTypography>
                </MDBContainer>
              </MDBContainer>
            </MDBContainer>
          </MDBContainer>
        </>
      )}
    </>
  );
};

export default Weather;
