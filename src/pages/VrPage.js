/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components/macro';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useImmer } from 'use-immer';
import { useNavigate } from 'react-router-dom';
import {
  doc, getDoc, updateDoc, arrayRemove, arrayUnion, setDoc,
} from 'firebase/firestore';
import SwiperCore, { EffectCoverflow, Navigation } from 'swiper/core';
import produce from 'immer';
import UserContext from '../components/UserContextComponent';
import db from '../utils/firebase-init';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import 'swiper/components/effect-coverflow/effect-coverflow.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';
import './style.css';
import leftArrow from './images/left-arrow.jpg';
import vrPlaces from './vr-place-data';
import rightArrow from './images/up-arrow.png';
import BlackHeaderComponent from '../components/BlackHeader';
import unfilledStar from './images/unfilled_star.jpg';
import filledStar from './images/filled_star.jpg';

const PageTitle = styled.div`
width:100%;
height:30px;
font-size:30px;
color:white;
text-shadow:2px 2px 3px black;
font-weight:600;
@media screen and (max-width:768px){
  width:85%;
  height:30px;
  font-size:25px;
}
`;

const TitleStarArea = styled.div`
width:100%;
height:auto;
display:flex;
align-items:center;
justify-content:center;
`;

const ConfirmChooseDayButton = styled.button`
width:20%;
height:35px;
background: linear-gradient(
  312deg,
  rgb(178, 228, 238) 0%,
  rgb(161, 176, 246) 100%
);
border-radius:25px;
border:none;
color:black;
font-weight:600;
font-size:16px;
cursor:pointer;
`;

const PlaceBox = styled.div`
width:100%;
height:100%;
border-radius:5px;
cursor:pointer;
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.15);
background-blend-mode: multiply;
background-position:center;
`;

const PlaceTitle = styled.div`
position:absolute;
left:15px;
top:12px;
font-size:20px;
font-weight:600;
color:white;
text-shadow:1px 1px 2px black;
`;

const AddFavoriteIcon = styled.img`
width:25px;
height:25px;
cursor:pointer;
position:absolute;
right:15%;
justify-self:right;
`;

const PlaceCountryTitle = styled.div`
@import url("https://fonts.googleapis.com/css2?family=Pangolin&display=swap");
font-family: "Pangolin", sans-serif;
position:absolute;
right:15px;
bottom:12px;
font-size:26px;
font-weight:600;
color:#CEE8F0;
text-shadow:1px 1px 2px black;
`;

const PlaceEngishTitle = styled.div`
position:absolute;
left:15px;
top:40px;
font-size:16px;
font-weight:600;
color:#F4E6D3;
text-shadow:1px 1px 2px black;
`;

const RemindArrow = styled.img`
width:50px;
height:auto;
position:absolute;
bottom:20px;
right:20px;
animation: bounce 1600ms infinite cubic-bezier(0.445, 0.05, 0.55, 0.95);
@media screen and (max-width:882px){
  display:none;
  }
`;

const RemindText = styled.div`
width:60px;
height:auto;
position:absolute;
bottom:-10px;
right:20px;
font-weight:550;
font-size:12px;
border-radius:3px;
border:1px solid black;
// animation: bounce 1600ms infinite cubic-bezier(0.445, 0.05, 0.55, 0.95);
@media screen and (max-width:882px){
  display:none;
  }
`;

const VRModalBackground = styled.div`
width:100vw;
height:100vh;
position:fixed;
top:0;
bottom:0;
left:0;
right:0;
background-color:rgba(0, 0, 0, 0.7);
display:flex;
justify-content:center;
align-items:center;
display:${(props) => (props.active ? 'flex' : 'none')};
z-index:500;
`;

const ModalBox = styled.div`
display:flex;
width:80vw;
height:40vw;
background-color:white;
z-index:10;
border-radius:10px;
z-index:200;
position: relative;
align-items:center;
z-index:500;
flex-direction:row;
@media screen and (max-width:1344px){
  height:70vh;
}
@media screen and (max-width:1133px){
  height:70vh;
  width:90vw;
}
@media screen and (max-width:882px){
  height:85vh;
  width:90vw;
  flex-direction:column;
}
`;

const ModalImgArea = styled.div`
width:60%;
height:100%;
display:flex;
flex-wrap:wrap;
align-items:center;
gap:10px;
@media screen and (max-width:882px){
  width:100%;
  justify-content:center;
}
`;

const ModalLeftArea = styled.div`
width:40%;
height:85%;
display:flex;
flex-direction:column;
align-items:center;
justify-content:left;
gap:15px;
position:relative;
@media screen and (max-width:945px){
  height:90%;
}
@media screen and (max-width:882px){
  margin-top:30px;
  width:100%;
  height:50%;
}
`;

const IFrame = styled.iframe`
width:90%;
height:90%;
border:0;
border-radius:13px;
cursor:pointer;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
@media screen and (max-width:882px){
  width:90%;
  height:95%;
}
`;

const ModalPlaceTitle = styled.div`
font-size:30px;
font-weight:600;
width:75%;
`;

const ModalPlaceSubtitle = styled.div`
font-size:18px;
font-weight:550;
width:75%;
color:grey;
@media screen and (max-width:1344px){
  font-size:16px;
}
@media screen and (max-width:1133px){
  font-size:15px;
}
@media screen and (max-width:945px){
  font-size:14px;
}
@media screen and (max-width:882px){
display:none;
}
`;

const ModalPlaceDescription = styled.div`
font-size:15px;
width:75%;
text-align: justify;
height:auto;
@media screen and (max-width:882px){
  width:85%;
}
`;

const SeperateLine = styled.div`
width:75%;
height:1.5px;
margin-top:10px;
margin-bottom:10px;
background-color:black;
flex-shrink:0;
@media screen and (max-width:882px){
  width:85%;
  margin-top:5px;
  margin-bottom:5px;
}
`;

const ModalPlaceAddress = styled.div`
width:75%;
color:#696969;
font-size:13px;
display:flex;
flex-direction:column;
align-items:flex-start;
gap:10px;
text-align:justify;
@media screen and (max-width:882px){
  display:none;
  }
  `;

const ModalPlaceCountry = styled.div`
width:20%;
display:flex;
align-items:center;
justify-content:center;
height:20px;
background-color:black;
padding:5px 5px 5px 5px;
border-radius:3px;
color:white;
font-weight:500;
`;

const AddToScheduleButton = styled.button`
width:20%;
height:40px;
border-radius:5px;
background-color:grey;
font-weight:500;
border:none;
color:white;
cursor:pointer;
font-size:15px;
@media screen and (max-width:1133px){
  width:35%;
}
@media screen and (max-width:882px){
  display:none;
  }
`;

const SmallScreenAddButton = styled.button`
display:none;
@media screen and (max-width:882px){
  display:block;
  width:200px;
  height:40px;
  flex-shrink:0;
  border-radius:25px;
  background-color:grey;
  font-weight:500;
  border:none;
  color:white;
  cursor:pointer;
  font-size:17px;
  margin-bottom:30px;
  margin-top:10px;
  }
`;

const CloseModalButton = styled.button`
height:25px;
width:25px;
position:absolute;
right:20px;
top:20px;
text-align:center;
border:none;
border-radius:50%;
background-color:black;
color:white;
cursor:pointer;
`;

const LeftButton = styled.button`
height:25px;
width:25px;
position:absolute;
background-image: url(${leftArrow});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.2);
background-blend-mode: multiply;
left:20px;
top:20px;
text-align:center;
border:none;
border-radius:50%;
color:white;
cursor:pointer;
`;

const TransparentBackground = styled.div`
width:100vw;
height:450px;
background-color:white;
opacity:0.4;
z-index:100;
position:absolute;
top:30%
`;

const CurrentSchedulesTitle = styled.div`
width:100%;
height:30px;
font-size:17px;
font-weight:600;
margin-top:20px;
margin-bottom:10px;
`;

const ScheduleChoicesBoxWrapper = styled.div`
display:flex;
flex-flow:wrap;
height:auto;
width:80%;
align-items:center;
justify-content:center;
gap:15px;
padding-top:10px;
padding-bottom:20px;
padding-left:2px;
&:after {
  content: "";
  width:455px;
}
overflow:auto;
&::-webkit-scrollbar-track {
  -webkit-box-shadow: transparent;
  border-radius: 10px;
  background-color:transparent;
}
&::-webkit-scrollbar {
  width: 5px;
  background-color:transparent;
}
&::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: transparent;
  background-color:#D3D3D3;
}
`;

const Loading = styled.div`
  margin: auto;
  border: 10px solid #EAF0F6;
  border-radius: 50%;
  border-top: 10px solid #FF7A59;
  width: 70px;
  height: 70px;
  animation: spinner 3s linear infinite;
`;

const ScheduleChoicesBox = styled.div`
display:flex;
align-items:center;
width:220px;
height:60px;
border-radius:10px;
cursor:pointer;
background-color:${(props) => (props.clicked ? '#E6D1F2' : '#e7f5fe')};
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
&:hover {
  background-color:#E6D1F2;
}`;

const ScheduleChoiceTitle = styled.div`
width:170px;
text-align:left;
height:auto;
font-weight:500;
font-size:15px;
margin-left:20px;
`;

const ModalContentWrapper = styled.div`
width:80%;
height:80%;
display:flex;
flex-direction:column;
align-items:center;
z-index:500;
overflow:auto;
&::-webkit-scrollbar-track {
  -webkit-box-shadow: transparent;
  border-radius: 10px;
  background-color:transparent;
}
&::-webkit-scrollbar {
  width: 5px;
  background-color:transparent;
}
&::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: transparent;
  background-color:#D3D3D3;
}
`;

SwiperCore.use([EffectCoverflow, Navigation]);

function VR() {
  const [dayIndex, setDayIndex] = useState();
  const [modalIsActive, setModalIsActive] = useState(false);
  const [chooseScheduleModalIsActive, setChooseScheduleModalIsActive] = useState(false);
  const [chooseDayModalIsActive, setChooseDayModalIsActive] = useState(false);
  const [vrPageScheduleData, setVrPageScheduleData] = useImmer([]); // 是這個人所有的行程哦！不是單一筆行程!
  const [clickedScheduleIndex, setClickedScheduleIndex] = useState(); // 點到的那個行程的index!
  const [clickedScheduleId, setClickedScheduleId] = useState(); // 點到的那個行程的ID!
  const [modalIndex, setModalIndex] = useState(0);
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [clickedPlaceUrl, setClickedPlaceUrl] = useState('');
  const [clickedPlaceName, setClickedPlaceName] = useState('');
  const [clickedPlaceAddress, setClickedPlaceAddress] = useState('');

  // 按下加入行程時先判斷有否登入，有的話才能繼續

  function handleUserOrNot() {
    if (!user.uid) {
      alert('請先登入唷～');
      navigate({ pathname: '/profile' });
    } else {
      setModalIsActive(false); setChooseScheduleModalIsActive(true);
    }
  }

  // 打開modal時先確認有沒有追蹤過
  // 有的話就讓星星亮起，沒有的話就讓星星空的
  // 有登入的話才判斷，沒登入的話就不亮，按下去會執行另一個叫他登入的function

  async function checkLikeOrNot(placeId) {
    const userArticlesArray = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userArticlesArray);
    console.log(docSnap.data());
    if (docSnap.data().loved_attraction_ids.indexOf(placeId) > -1) {
      setLiked(true);
      console.log('已經追蹤過嚕!');
    } else {
      console.log('沒有哦');
      setLiked(false);
    }
  }

  function ShowDetailNCheckLikedOrNot(clickedPlaceId, clickedPlaceIndex) {
    if (user.uid) {
      checkLikeOrNot(clickedPlaceId);
    } else {
      setLiked(false);
    }
    setModalIsActive(true);
    setModalIndex(clickedPlaceIndex);
  }

  // 按下星星後把此景點加入收藏清單，也會先確認是否有登入～
  // 按下星星後就先把這個位置存到db的attractions資料庫中～

  async function handleFavorite(placeId) {
    if (!user.uid) {
      alert('請先登入唷～');
      navigate({ pathname: '/profile' });
    } else {
      const userArticlesArray = doc(db, 'users', user.uid);
      if (liked) {
        setLiked(false);
        await updateDoc(userArticlesArray, {
          loved_attraction_ids: arrayRemove(placeId),
        });
        console.log('已退追此景點!');
      } else if (!liked) {
        setLiked(true);
        await updateDoc(userArticlesArray, {
          loved_attraction_ids: arrayUnion(placeId),
        });
        console.log('已追蹤此景點!');
        const createAttraction = doc(db, 'attractions', placeId);
        await setDoc(createAttraction, ({
          place_id: placeId,
          place_title: clickedPlaceName,
          place_address: clickedPlaceAddress,
          place_url: clickedPlaceUrl,
        }));
      }
    }
  }

  // 當使用者按下modal中的「加入行程」時，拿出此使用者的所有行程給他選
  // 先把行程拿回來存在immer裡面，等使用者按的時候再render modal
  // 按下哪一個行程後，用那個index去抓那天的細節

  useEffect(() => {
    async function getUserArrayList() {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data().owned_schedule_ids);
      } else {
        console.log('No such document!');
      }
      function getSchedulesFromList() {
        docSnap.data().owned_schedule_ids.forEach(async (item, index) => {
          const docs = doc(db, 'schedules', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            if (Snap.data().deleted === false) {
              console.log('這位使用者的行程', index, Snap.data());
              setVrPageScheduleData((draft) => {
                draft.push(Snap.data());
              });
            }
          } else {
            console.log('沒有這個行程！');
          }
        });
      }
      getSchedulesFromList();
    }
    getUserArrayList();
  }, [setVrPageScheduleData, user.uid]);

  // 選好行程跟天數時，會把行程的名稱跟地址加到immer中，並送到database中

  function ComfirmedAdded() {
    console.log('已經加入囉！');
    const newPlace = {
      place_title: vrPlaces[modalIndex].place_title,
      place_address: vrPlaces[modalIndex].place_address,
      stay_time: 60,
    };
      // 用 immer 產生出新的行程資料
    const newScheduleData = produce(vrPageScheduleData, (draft) => {
      draft[clickedScheduleIndex]?.trip_days[dayIndex]?.places?.push(newPlace);
    });
    setVrPageScheduleData(newScheduleData);
    async function passAddedDataToFirestore() {
      const scheduleRef = doc(db, 'schedules', clickedScheduleId);
      await updateDoc(scheduleRef, { ...newScheduleData[clickedScheduleIndex] });
    }
    passAddedDataToFirestore();
  }
  return (
    <>
      <BlackHeaderComponent />
      <VRModalBackground active={modalIsActive}>
        <ModalBox>
          {vrPlaces
            ? (
              <>
                <ModalLeftArea>
                  <TitleStarArea>
                    <ModalPlaceTitle>
                      {vrPlaces?.[modalIndex]?.place_title}
                    </ModalPlaceTitle>
                    <AddFavoriteIcon
                      onClick={() => { handleFavorite(vrPlaces?.[modalIndex]?.place_id); }}
                      src={liked ? filledStar : unfilledStar}
                    />
                  </TitleStarArea>
                  <ModalPlaceSubtitle>{vrPlaces?.[modalIndex]?.place_subtitle}</ModalPlaceSubtitle>
                  <SeperateLine />
                  <ModalPlaceDescription>
                    {vrPlaces?.[modalIndex]?.place_description}
                  </ModalPlaceDescription>
                  <SeperateLine />
                  <ModalPlaceAddress>
                    <ModalPlaceCountry>
                      {vrPlaces?.[modalIndex]
                        ?.place_country_title}
                    </ModalPlaceCountry>
                    地址：
                    {vrPlaces?.[modalIndex]
                      ?.place_address}
                  </ModalPlaceAddress>
                  <AddToScheduleButton
                    onClick={() => { handleUserOrNot(); }}
                  >
                    加入行程
                  </AddToScheduleButton>
                  <RemindArrow src={rightArrow} />
                  <RemindText>
                    360°滑動
                    <br />
                    探索當地
                  </RemindText>
                </ModalLeftArea>
                <ModalImgArea>
                  <IFrame title={vrPlaces?.[modalIndex]?.place_title} src={vrPlaces?.[modalIndex]?.vr_embed_link} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </ModalImgArea>
                <SmallScreenAddButton
                  onClick={() => { handleUserOrNot(); }}
                >
                  加入行程
                </SmallScreenAddButton>
                <CloseModalButton
                  type="button"
                  onClick={() => setModalIsActive(false)}
                >
                  X
                </CloseModalButton>

              </>
            )
            : <Loading />}
        </ModalBox>
      </VRModalBackground>
      <VRModalBackground active={chooseScheduleModalIsActive}>
        <ModalBox style={{ display: 'flex', flexDirection: 'column' }}>
          <LeftButton
            type="button"
            onClick={() => {
              setModalIsActive(true);
              setChooseScheduleModalIsActive(false);
            }}
          />
          <ModalContentWrapper>
            <CurrentSchedulesTitle>您的現有行程</CurrentSchedulesTitle>
            <ScheduleChoicesBoxWrapper>
              {vrPageScheduleData ? vrPageScheduleData.map((item, index) => (
                <ScheduleChoicesBox
                  onClick={() => {
                    setClickedScheduleId(item.schedule_id);
                    setClickedScheduleIndex(index);
                    setChooseDayModalIsActive(true); setChooseScheduleModalIsActive(false);
                  }}
                  id={item.schedule_id}
                >
                  <ScheduleChoiceTitle>
                    {item.title}
                  </ScheduleChoiceTitle>
                </ScheduleChoicesBox>
              )) : ''}
            </ScheduleChoicesBoxWrapper>
          </ModalContentWrapper>
          <CloseModalButton
            type="button"
            onClick={() => setChooseScheduleModalIsActive(false)}
          >
            X
          </CloseModalButton>
        </ModalBox>
      </VRModalBackground>
      <VRModalBackground active={chooseDayModalIsActive}>
        <ModalBox style={{ display: 'flex', flexDirection: 'column' }}>
          <LeftButton
            type="button"
            onClick={() => {
              setChooseDayModalIsActive(false);
              setChooseScheduleModalIsActive(true);
            }}
          />
          <ModalContentWrapper>
            <CurrentSchedulesTitle>請選擇天數</CurrentSchedulesTitle>
            <ScheduleChoicesBoxWrapper>
              {vrPageScheduleData
                ? vrPageScheduleData[clickedScheduleIndex]?.trip_days.map((item, index) => (
                  <ScheduleChoicesBox
                    clicked={dayIndex === index}
                    onClick={() => {
                      setDayIndex(index);
                    }}
                    style={{ display: 'flex' }}
                  >
                    <ScheduleChoiceTitle>
                      第
                      {index + 1}
                      天
                    </ScheduleChoiceTitle>
                  </ScheduleChoicesBox>
                )) : ''}
            </ScheduleChoicesBoxWrapper>
            <ConfirmChooseDayButton type="button" onClick={() => { ComfirmedAdded(); setChooseDayModalIsActive(false); }}>完成選擇</ConfirmChooseDayButton>
          </ModalContentWrapper>
          <CloseModalButton
            type="button"
            onClick={() => setChooseDayModalIsActive(false)}
          >
            X
          </CloseModalButton>
        </ModalBox>
      </VRModalBackground>
      <div className="vr-container">
        {/* <div className="title_wrapper"> */}
        <PageTitle>
          With VR, The world is just in front of you.
        </PageTitle>
        {/* </div> */}
        <TransparentBackground />
        <Swiper
          navigation
          effect="coverflow"
          centeredSlides
          slidesPerView={window.innerWidth < 768 ? 1 : 'auto'}
          loop
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          // pagination={{
          //   clickable: true,
          // }}
          className="mySwiper"
        >
          {vrPlaces?.map((item, index) => (
            <SwiperSlide onClick={() => {
              ShowDetailNCheckLikedOrNot(item.place_id, index);
              setClickedPlaceUrl(item?.cover_photo);
              setClickedPlaceName(item?.place_title);
              setClickedPlaceAddress(item?.place_address);
            }}
            >
              <PlaceBox style={{ backgroundImage: `url(${item.cover_photo})` }}>
                <PlaceTitle>{item.place_title}</PlaceTitle>
                <PlaceEngishTitle>{item.place_english_title}</PlaceEngishTitle>
                <PlaceCountryTitle>{item.place_country_title}</PlaceCountryTitle>
              </PlaceBox>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </>
  );
}

export default VR;

// https://www.google.com.tw/maps/place/%E5%90%89%E8%96%A9%E9%87%91%E5%AD%97%E5%A1%94/@29.9781206,31.1356161,3a,75y,278.58h,96.1t/data=!3m8!1e1!3m6!1sAF1QipNCyOBNckTjHzRNqyZkTRMPeBzjWAqeRnP42CGw!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipNCyOBNckTjHzRNqyZkTRMPeBzjWAqeRnP42CGw%3Dw203-h100-k-no-pi-14.067524-ya292.68488-ro-0-fo100!7i6912!8i3456!4m11!1m2!2m1!1spyramid+egypt!3m7!1s0x14584f7de239bbcd:0xca7474355a6e368b!8m2!3d29.9772962!4d31.1324955!14m1!1BCgIgARICCAI!15sCg1weXJhbWlkIGVneXB0Wg8iDXB5cmFtaWQgZWd5cHSSARNhcmNoYWVvbG9naWNhbF9zaXRlmgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVVJWTUZscVN6bDNSUkFC?hl=zh-TW
// 埃及 gyyHSAc1ygMeWsAdh4KH5APF74q2
// https://www.google.com.tw/maps/@29.9750375,31.1379389,3a,75y,300.97h,111.27t/data=!3m8!1e1!3m6!1sAF1QipM2i-bm9uaGP0nLNERM3IohR7o70spzUdseiE0c!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipM2i-bm9uaGP0nLNERM3IohR7o70spzUdseiE0c%3Dw203-h100-k-no-pi-16.993568-ya359.88745-ro-0-fo100!7i11264!8i5632?hl=zh-TW

// 羅馬競技場 ChIJrRMgU7ZhLxMRxAOFkC7I8Sg

// 吳哥窟 ChIJLSea6ooWEDERjUGwVxGoqz4
// https://www.google.com/maps/@13.4128744,103.867579,3a,75y,274.71h,114.45t/data=!3m6!1e1!3m4!1sgTlAssf57LjWHTdaye-G7w!2e0!7i13312!8i6656
// https://www.google.com.tw/maps/place/%E5%90%B3%E5%93%A5%E7%AA%9F/@13.4124693,103.8669857,3a,75y,231.65h,132.9t/data=!3m8!1e1!3m6!1sAF1QipPQQoaugOQNo6f-cqEV6mQrFKSLR6VBSfKSnTg!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPQQoaugOQNo6f-cqEV6mQrFKSLR6VBSfKSnTg%3Dw224-h298-k-no-pi-16.435272-ya345.2533-ro0-fo100!7i6000!8i3000!4m7!3m6!1s0x3110168aea9a272d:0x3eaba81157b0418d!8m2!3d13.4124693!4d103.8669857!14m1!1BCgIgARICCAI?hl=zh-TW

// 阿根廷冰河國家公園 ChIJVZJRWSiypL0R3dHwpGmtXeY
// https://www.google.com.tw/maps/place/%E5%86%B0%E5%B7%9D%E5%9C%8B%E5%AE%B6%E5%85%AC%E5%9C%92/@-49.2782402,-72.987236,3a,75y,207.4h,81.32t/data=!3m8!1e1!3m6!1sAF1QipOm4sIVWDIACW-AMUQiSJPPpNQphcXHyq6Yw7UG!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOm4sIVWDIACW-AMUQiSJPPpNQphcXHyq6Yw7UG%3Dw203-h100-k-no-pi-9.643528-ya356.6604-ro-0-fo100!7i8704!8i4352!4m7!3m6!1s0xbda4b22859519255:0xe65dad69a4f0d1dd!8m2!3d-50.3305556!4d-73.2341667!14m1!1BCgIgARICCAI?hl=zh-TW

// 里約熱內盧基督像 ChIJP6FKmNV_mQAR3gKVAdeEyZ0
// https://www.google.com.tw/maps/place/%E9%87%8C%E7%B4%84%E7%86%B1%E5%85%A7%E7%9B%A7%E5%9F%BA%E7%9D%A3%E5%83%8F/@-22.9511126,-43.209472,3a,75y,272.16h,115.96t/data=!3m8!1e1!3m6!1sAF1QipMqlAh8IQxVXn9wGPQvHZ-Vnt8xvMaJEyDSPUKI!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMqlAh8IQxVXn9wGPQvHZ-Vnt8xvMaJEyDSPUKI%3Dw224-h298-k-no-pi-0-ya47.563538-ro-0-fo100!7i13312!8i6656!4m7!3m6!1s0x997fd5984aa13f:0x9dc984d7019502de!8m2!3d-22.951916!4d-43.2104872!14m1!1BCgIgARICCAI?hl=zh-TW

// 艾非爾鐵塔 ChIJLU7jZClu5kcR4PcOOO6p3I0
// https://www.google.com.tw/maps/place/%E8%89%BE%E8%8F%B2%E7%88%BE%E9%90%B5%E5%A1%94/@48.8583701,2.2944813,3a,75y,23.43h,128.29t/data=!3m8!1e1!3m6!1sAF1QipPMkr2R5rWFEtyFSP19ofBgJpq2Tfd501Stp9z5!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPMkr2R5rWFEtyFSP19ofBgJpq2Tfd501Stp9z5%3Dw203-h100-k-no-pi0-ya0-ro0-fo100!7i6080!8i3040!4m7!3m6!1s0x47e66e2964e34e2d:0x8ddca9ee380ef7e0!8m2!3d48.8583701!4d2.2944813!14m1!1BCgIgARICCAI?hl=zh-TW
// https://www.google.com.tw/maps/place/%E8%89%BE%E8%8F%B2%E7%88%BE%E9%90%B5%E5%A1%94/@48.8596148,2.2950967,3a,75y,205.41h,128.24t/data=!3m8!1e1!3m6!1sAF1QipPUry_uA6SZQjIugwGkIatJW88TZCh9v7swT5Da!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPUry_uA6SZQjIugwGkIatJW88TZCh9v7swT5Da%3Dw203-h100-k-no-pi-20-ya14.000004-ro-0-fo100!7i6144!8i3072!4m7!3m6!1s0x47e66e2964e34e2d:0x8ddca9ee380ef7e0!8m2!3d48.8583701!4d2.2944813!14m1!1BCgIgARICCAI?hl=zh-TW
// https://www.google.com.tw/maps/place/%E8%89%BE%E8%8F%B2%E7%88%BE%E9%90%B5%E5%A1%94/@48.8553422,2.2989991,3a,69.9y,184.53h,102.93t/data=!3m8!1e1!3m6!1sAF1QipPWASA98CqqlS4uOHFmfvSQ4te7RamazQsqvDRV!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPWASA98CqqlS4uOHFmfvSQ4te7RamazQsqvDRV%3Dw203-h100-k-no-pi-11.369606-ya353.80862-ro0-fo100!7i7000!8i3500!4m7!3m6!1s0x47e66e2964e34e2d:0x8ddca9ee380ef7e0!8m2!3d48.8583701!4d2.2944813!14m1!1BCgIgARICCAI?hl=zh-TW

// 聖家堂 ChIJk_s92NyipBIRUMnDG8Kq2Js
// https://www.google.com.tw/maps/place/%E8%81%96%E5%AE%B6%E5%A0%82/@41.4031964,2.1737517,3a,75y,346.84h,117.97t/data=!3m8!1e1!3m6!1sAF1QipMa3RNMdLRnbRJ1P17sHcvPcDMEqVHHEc2zmJSm!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMa3RNMdLRnbRJ1P17sHcvPcDMEqVHHEc2zmJSm%3Dw203-h100-k-no-pi-30.000002-ya4.2401505-ro-0-fo100!7i5376!8i2688!4m11!1m2!2m1!1z5be06LO96ZqG57SN5pWZ5aCC!3m7!1s0x12a4a2dcd83dfb93:0x9bd8aac21bc3c950!8m2!3d41.4036299!4d2.1743558!14m1!1BCgIgARICCAI!15sChLlt7Tos73pmobntI3mlZnloIJaGCIW5be0IOizvSDpmoYg57SNIOaVmeWggpIBCGJhc2lsaWNhmgEjQ2haRFNVaE5NRzluUzBWSlEwRm5TVU5WYVY5aGFVeG5FQUU?hl=zh-TW

// 尼加拉瓜
// https://www.google.com.tw/maps/place/%E5%B0%BC%E4%BA%9E%E5%8A%A0%E6%8B%89%E7%80%91%E5%B8%83%E5%B7%9E%E7%AB%8B%E5%85%AC%E5%9C%92/@43.0837674,-79.0639941,3a,75y,177.77h,108.76t/data=!3m8!1e1!3m6!1sAF1QipO_Yf_imjqPEQyK5iAB6yK3VtDw71rppZVUA6bt!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipO_Yf_imjqPEQyK5iAB6yK3VtDw71rppZVUA6bt%3Dw203-h100-k-no-pi-30.000002-ya183.93996-ro0-fo100!7i5660!8i2830!4m7!3m6!1s0x89d342e2ed27a75d:0xd556b548abcc0817!8m2!3d43.0834256!4d-79.06434!14m1!1BCgIgARICCAI?hl=zh-TW

// 泰姬瑪哈  ChIJbf8C1yFxdDkR3n12P4DkKt0
// https://www.google.com.tw/maps/place/%E6%B3%B0%E5%A7%AC%E7%91%AA%E5%93%88%E9%99%B5/@27.1742143,78.0420098,3a,75y,0.79h,123.07t/data=!3m8!1e1!3m6!1sAF1QipOYuOIxBwdgTstcxSTOHH1wf-GRutnVxwOFw3FO!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOYuOIxBwdgTstcxSTOHH1wf-GRutnVxwOFw3FO%3Dw224-h298-k-no-pi-19.13696-ya334.5366-ro-0-fo100!7i4608!8i2304!4m7!3m6!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422!14m1!1BCgIgARICCAI?hl=zh-TW
// https://www.google.com.tw/maps/place/%E6%B3%B0%E5%A7%AC%E7%91%AA%E5%93%88%E9%99%B5/@27.1751269,78.0420541,3a,75y,353.66h,95.96t/data=!3m8!1e1!3m6!1sAF1QipM5eGWheh1J7TKknxuvw0j4ydsQN0eL1yY9byhV!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipM5eGWheh1J7TKknxuvw0j4ydsQN0eL1yY9byhV%3Dw203-h100-k-no-pi-6.6376433-ya341.38223-ro0.32461366-fo100!7i8960!8i4480!4m7!3m6!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422!14m1!1BCgIgARICCAI?hl=zh-TW

// 瑪雅金字塔
// https://www.google.com.tw/maps/place/%E5%8D%A1%E6%96%AF%E8%92%82%E7%95%A5%E9%87%91%E5%AD%97%E5%A1%94/@20.6835125,-88.56918,3a,75y,357.41h,97.99t/data=!3m8!1e1!3m6!1sAF1QipOL2O2RpuOQgArQOmyI5v17AEz-9_vPPMSvm1OT!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOL2O2RpuOQgArQOmyI5v17AEz-9_vPPMSvm1OT%3Dw203-h100-k-no-pi-11.25402-ya346.72025-ro-0-fo100!7i9728!8i4864!4m7!3m6!1s0x8f5138b88e232523:0x1ef4200c7824ddf!8m2!3d20.6829859!4d-88.5686491!14m1!1BCgIgARICCAI?hl=zh-TW

// 伏見稻荷 ChIJIW0uPRUPAWAR6eI6dRzKGns
// https://www.google.com.tw/maps/place/%E4%BC%8F%E8%A6%8B%E7%A8%BB%E8%8D%B7%E5%A4%A7%E7%A4%BE/@34.9671402,135.7726717,3a,75y,354.83h,79.17t/data=!3m8!1e1!3m6!1sAF1QipOhZDyGyI-UFdcmVonSThXhStZN2C6cCh7tKE7L!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOhZDyGyI-UFdcmVonSThXhStZN2C6cCh7tKE7L%3Dw203-h100-k-no-pi-14.738657-ya349.71097-ro-2.3594007-fo100!7i5376!8i2688!4m5!3m4!1s0x60010f153d2e6d21:0x7b1aca1c753ae2e9!8m2!3d34.9671402!4d135.7726717?hl=zh-TW

// 羚羊峽谷
// https://www.google.com.tw/maps/place/%E7%BE%9A%E7%BE%8A%E5%B3%BD%E8%B0%B7/@36.9352201,-111.4245015,3a,75y,4.34h,91.01t/data=!3m8!1e1!3m6!1sAF1QipOp5zYnHvuVzKNFoX0zusp5iqVy96pbEBeH9mae!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOp5zYnHvuVzKNFoX0zusp5iqVy96pbEBeH9mae%3Dw203-h100-k-no-pi-10-ya166-ro0-fo100!7i11264!8i5632!4m7!3m6!1s0x873411f49ba00e0b:0x98361608ad6aa79b!8m2!3d36.8619103!4d-111.3743302!14m1!1BCgIgARICCAI?hl=zh-TW

// 總統山 拉什摩爾山 ChIJ39Y-tdg1fYcRQcZcBb499do
// https://www.google.com.tw/maps/place/%E6%8B%89%E4%BB%80%E8%8E%AB%E7%88%BE%E5%B1%B1/@43.8791025,-103.4590667,3a,66.8y,344.04h,120.96t/data=!3m8!1e1!3m6!1sAF1QipOwS3Hfu21inJ8ZNOxeMiBpCZxgD0rYX0vRIYw8!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOwS3Hfu21inJ8ZNOxeMiBpCZxgD0rYX0vRIYw8%3Dw203-h100-k-no-pi-17.10611-ya13.054676-ro-0-fo100!7i8704!8i4352!4m7!3m6!1s0x877d35d8b53ed6df:0xdaf53dbe055cc641!8m2!3d43.8791025!4d-103.4590667!14m1!1BCgIgARICCAI?hl=zh-TW
