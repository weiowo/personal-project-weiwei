import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import {
  onAuthStateChanged, getAuth,
} from 'firebase/auth';
import Schedule from './pages/SchedulePlan';
import Home from './pages/Home';
import ChooseDate from './pages/ChooseDate';
import MySchedules from './pages/MySchedules';
import Map from './pages/Map';
import SearchHome from './pages/SearchHome';
import City from './pages/City';
import PlaceModal from './components/PlaceModal';
import CardsCarousel from './pages/CardCarousel';
import CityAreaInHomePage from './components/CityInHome';
import CategoryAreaInHome from './pages/CategoryInHome';
import Category from './pages/Category';
import SignIn from './components/SignIn';
import { app } from './utils/firebase-init';
import UserContext from './components/UserContextComponent';
import EditPage from './pages/Edit';
import ShowArticle from './pages/SingleArticle';
import MyArticles from './pages/MyArticles';
import AllArticlePage from './pages/AllArticles';

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    };
    body {
        margin: 0;
        font-family: NotoSansTC;
      }
    `;

function App() {
  // state  current location
  const [currentLatLng, setCurrentLatLng] = useState({});
  console.log(currentLatLng);

  // 使用者現在的登入資訊
  const [user, setUser] = useState('');
  console.log(user);
  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (userData) => {
      if (userData) {
        setUser(userData);
        console.log('您已登入囉(app.js)!', userData.uid, userData.providerId, userData.email);
        const now = auth.currentUser;
        console.log('onAuthStateChanged', now);
      } else {
        console.log('您尚未登入唷(app.js)!');
      }
    });
  }, [auth, setUser]);

  // 拿使用者現有位置

  function getCurrentLatLng() {
    if ('geolocation' in navigator) {
      console.log('geolocation is available');
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        setCurrentLatLng({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    } else {
      console.log('geolocation is not available');
    }
  }
  useEffect(() => {
    getCurrentLatLng();
  }, []);

  // 在app.js宣告一個存user的state，如果已經有登入的時候，就把user的資料傳下去
  // sign in/up/out的components若有人註冊，就會傳到firestore，再回到上面的那行

  return (
    <div className="App">
      <GlobalStyle />
      <UserContext.Provider value={user}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home currentLatLng={currentLatLng} />} />
            <Route path="/choose-date" element={<ChooseDate />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/my-schedules" element={<MySchedules />} />
            <Route path="/map-new" element={<Map />} />
            <Route path="/home-search" element={<SearchHome />} />
            <Route path="/city" element={<City />} />
            <Route path="/place-modal" element={<PlaceModal />} />
            <Route path="/category-in-home" element={<CategoryAreaInHome currentLatLng={currentLatLng} />} />
            <Route path="/carousel" element={<CardsCarousel />} />
            <Route path="/city-home" element={<CityAreaInHomePage />} />
            <Route path="/category" element={<Category currentLatLng={currentLatLng} />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/edit" element={<EditPage />} />
            <Route path="/article" element={<ShowArticle />} />
            <Route path="/my-articles" element={<MyArticles />} />
            <Route path="/all-articles" element={<AllArticlePage />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
