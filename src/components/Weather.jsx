import React, { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import {
  MDBContainer,
  MDBTypography,
  MDBInput,
  MDBBtn,
  MDBRow,
  MDBCol,
} from 'mdb-react-ui-kit';
import toast from 'react-hot-toast';
import { ClockLoader, HashLoader } from 'react-spinners';

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
          // check res.status 200 or not
          if (res.status !== 200) {
            return toast.error('Something went wrong !!!', {
              duration: 2000,
              position: 'bottom-center',
            });
          }
          // check if res.data is empty object or not
          if (_.isEmpty(res.data)) {
            return toast.loading('Loading!', {
              duration: 2000,
              position: 'top-left',
              // Aria
              ariaProps: {
                role: 'status',
                'aria-live': 'polite',
              },
            });
          } else {
            setData(res.data);
            toast.success('success', {
              duration: 2500,
              position: 'bottom-right',
            });
            setIsLoading(false);
          }
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
    }, 8000);

    // clear the debounce
    return () => clearTimeout(debounce);
  }, [searchValue]);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  // check data is {} return
  if (_.isEmpty(data)) {
    return (
      <MDBContainer tag={'div'} className='hstack justify-content-center mt-5'>
        <ClockLoader size={100} color='#36d7b7' />
      </MDBContainer>
    );
  }

  const { name, dt, main, sys, weather, wind, coord } = data;
  const { lat, lon } = coord;
  const { humidity, pressure, temp } = main;
  const { country, sunrise, sunset } = sys;
  const { description, icon } = weather[0];
  const { speed } = wind;

  // get current date
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

  // get sunrise time
  const sunriseTimeStamp = sunrise * 1000;
  const currentSunriseTime = new Date(sunriseTimeStamp).toLocaleTimeString(
    `en-${country}`,
    {
      timeStyle: 'short',
    }
  );

  // get sunset time
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
        <MDBContainer
          tag={'div'}
          className='hstack justify-content-center mt-5'>
          <HashLoader size={50} color={'royalblue'} />
        </MDBContainer>
      ) : (
        <>
          {!_.isEmpty(data) ? (
            <MDBContainer tag={'div'} fluid className='gx-0 box'>
              <MDBTypography
                variant='h1'
                className='mb-0 p-3 text-center text-dark'>
                Weather App
              </MDBTypography>
              <MDBTypography className='text-center text-dark fw-bold'>
                {currentDate}
              </MDBTypography>

              <MDBContainer
                tag={'div'}
                className='py-3 gx-0 d-flex justify-content-center align-items-center gap-2 flex-lg-nowrap flex-md-nowrap flex-sm-wrap flex-wrap'>
                <MDBRow tag={'div'} className='d-flex gx-0'>
                  <MDBCol
                    tag={'div'}
                    lg={12}
                    md={12}
                    sm={12}
                    className='col-12 m-auto'>
                    {/* <form action='#' method='GET'> */}
                    <MDBInput
                      wrapperClass='mb-4'
                      className='text-dark'
                      label='Search your location'
                      id='search'
                      name='search'
                      type='text'
                      value={searchValue}
                      onChange={handleChange}
                    />
                    {/* </form> */}
                  </MDBCol>
                </MDBRow>
                <MDBBtn className='mb-4'>Search</MDBBtn>
              </MDBContainer>

              <MDBContainer tag={'div'} className='p-1 gx-0'>
                {/* weather logo */}
                <MDBContainer
                  tag={'div'}
                  className='hstack justify-content-center mt-3'>
                  <MDBRow tag={'div'} className='gx-0'>
                    <MDBCol
                      tag={'div'}
                      lg={12}
                      md={12}
                      sm={10}
                      className='col-12 m-auto'>
                      <figure className='figure'>
                        <img
                          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                          style={{ backgroundColor: '#9e9e9e' }}
                          loading='lazy'
                          className='figure-img img-fluid rounded-circle shadow-3-strong mb-3'
                          alt='weather_icon'
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
                <MDBContainer
                  tag={'div'}
                  className='p-2 hstack justify-content-around gap-2 mb-3 flex-lg-nowrap flex-md-nowrap flex-sm-wrap flex-wrap'>
                  <MDBContainer
                    tag={'div'}
                    className='bg-dark shadow-3-strong rounded-3 p-1 text-light text-center left-side'>
                    <MDBTypography>Sunrise: {currentSunriseTime}</MDBTypography>
                    <MDBTypography>Humadity: {humidity}%</MDBTypography>
                    <MDBTypography>Temp: {temp}&deg;C</MDBTypography>
                    <MDBTypography>Latitude: {lat.toFixed(2)}</MDBTypography>
                  </MDBContainer>
                  <MDBContainer
                    tag={'div'}
                    className='bg-dark shadow-3-strong rounded-3 p-1 text-light text-center right-side'>
                    <MDBTypography>Sunset: {currentSunsetTime}</MDBTypography>
                    <MDBTypography>Pressure: {pressure}</MDBTypography>
                    <MDBTypography>Wind: {speed}km/h</MDBTypography>
                    <MDBTypography>Longitude: {lon.toFixed(2)}</MDBTypography>
                  </MDBContainer>
                </MDBContainer>
              </MDBContainer>
            </MDBContainer>
          ) : (
            setIsLoading(true)
          )}
        </>
      )}
    </>
  );
};

export default Weather;
