import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  signOut,
} from 'firebase/auth';
import UserContext from '../UserContextComponent';
import RWD_ICON from './rwd.const';
import SmallScreenNavBar, {
  HamburgerMenuLink, CreateScheduleWrapper, SmallLogOutButton, HamburgerProfileLink,
  ProfileBackground, SmallProfilePhoto, SmallNavIcon, SmallProfileName,
  SmallNavText, Menu, CloseIcon, Background,
} from './RwdMenu';
import { auth } from '../../utils/firebase-init';

const Header = styled.header`
  position:absolute;
  display:flex;
  justify-content:space-between;
  align-items:center;
  width:100vw;
  height:60px;
  background-color:#a9a9a9;
  @media screen and (max-width:800px){
    display:none;
}`;

const SmallGreyHeader = styled.div`
  display:none;
  @media screen and (max-width:800px){
    display:flex;
    justify-content:space-between;
    align-items:center;
    width:100vw;
    position:fixed;
    top:0;
    z-index:1000;
    height:${(props) => (props.active ? '60px' : '65px')};
    background-color:#a9a9a9;
    box-shadow: ${(props) => (props.active ? '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);' : 'none')};
}`;

const Logo = styled.div`
  width:150px;
  height:30px;
  font-weight:700;
  font-size:25px;
  margin-left:20px;
  color:white;
  margin-top:0px;
  @media screen and (max-width:800px){
    width:auto;
    height:100%;
    font-size:20px;
    z-index:10;
    position:absolute;
    top:20px;
}`;

const NavBar = styled.div`
  display:flex;
  align-items:center;
  gap:15px;
  width:500px;
  height:30px;
  color:${(props) => (props.active ? 'black' : 'white')};
  font-weight:600;
  margin-top:0px;
  @media screen and (max-width:800px){
    display:none;
}`;

const ProfilePageNav = styled.div`
  width:auto;
  padding:8px 10px;
  border-radius:10px;
  border:1px solid white;
  cursor:pointer;
`;

const StyleNavLink = styled(Link)`
  cursor:pointer;
  text-decoration:none;
  color:white;
  &:hover {
    border-bottom:1.5px solid white;
  }
`;

const ProfileNavLink = styled(Link)`
  cursor:pointer;
  text-decoration:none;
  color:white;
`;

function GreyHeaderComponent() {
  const user = useContext(UserContext);
  const [clicked, setClicked] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false);
  const navigate = useNavigate();

  function signOutFunction() {
    signOut(auth).then(() => {
      navigate({ pathname: '/' });
    }).catch((error) => {
      Swal.fire({
        title: '????????????????????????',
        text: error,
        icon: 'warning',
      });
    });
  }

  function CheckLoginBeforeCreateSchedule() {
    if (!user.uid) {
      Swal.fire({
        title: '??????????????????',
        text: '?????????????????????????????????~',
        icon: 'warning',
      });
      navigate({ pathname: '/profile' });
    } else if (user.uid) {
      navigate({ pathname: '/choose-date' });
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => { setHeaderBackground(document.body.scrollTop > 200 || document.documentElement.scrollTop > 200); });
    }
  }, []);

  const currentUrl = useLocation();
  return (
    <>
      <Header active={headerBackground?.toString()}>
        <ProfileNavLink to="/">
          <Logo active={headerBackground?.toString()}>Bon Voyage</Logo>
        </ProfileNavLink>
        <NavBar active={headerBackground?.toString()}>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/vr-page' ? '1.5px solid white' : '' }}
            active={headerBackground?.toString()}
            to="/vr-page"
          >
            VR??????
          </StyleNavLink>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/city' ? '1.5px solid white' : '' }}
            active={headerBackground?.toString()}
            to="/city?lat=25.0329694&lng=121.5654177&city=??????&option=all"
          >
            ????????????
          </StyleNavLink>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/all-articles' ? '1.5px solid white' : '' }}
            active={headerBackground?.toString()}
            to="/all-articles"
          >
            ????????????
          </StyleNavLink>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/category' ? '1.5px solid white' : '' }}
            active={headerBackground?.toString()}
            to="/category?lat=25.0498583&lng=121.5172606&category=food"
          >
            ????????????
          </StyleNavLink>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/my-schedules' ? '1.5px solid white' : '' }}
            active={headerBackground?.toString()}
            to="/my-schedules"
          >
            ????????????
          </StyleNavLink>
          <ProfileNavLink active={headerBackground?.toString()} to="/profile">
            <ProfilePageNav active={headerBackground?.toString()}>????????????</ProfilePageNav>
          </ProfileNavLink>
        </NavBar>
      </Header>
      <SmallGreyHeader active={headerBackground}>
        <Menu
          style={{ top: 20 }}
          src={headerBackground ? RWD_ICON?.BLACK_MENU_ICON : RWD_ICON?.WHITE_MENU_ICON}
          active={clicked}
          onClick={() => setClicked(true)}
        />
        <StyleNavLink active={headerBackground?.toString()} to="/">
          <Logo active={headerBackground?.toString()}>Bon Voyage</Logo>
        </StyleNavLink>
        <Background active={clicked}>
          <SmallScreenNavBar active={clicked}>
            <ProfileBackground>
              <HamburgerProfileLink to="/profile">
                <SmallProfilePhoto src={user.photoURL || RWD_ICON?.USER_IMG} />
                <SmallProfileName>{user.displayName || '??????????????????'}</SmallProfileName>
              </HamburgerProfileLink>
            </ProfileBackground>
            <CreateScheduleWrapper onClick={() => CheckLoginBeforeCreateSchedule()}>
              <SmallNavIcon src={RWD_ICON?.PLAN_ICON} />
              <SmallNavText>????????????</SmallNavText>
            </CreateScheduleWrapper>
            <HamburgerMenuLink to="/vr-page">
              <SmallNavIcon src={RWD_ICON?.VR_ICON} />
              <SmallNavText>VR ??????</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/city?lat=25.0329694&lng=121.5654177&city=??????&option=all">
              <SmallNavIcon src={RWD_ICON?.ATTRACTION_ICON} />
              <SmallNavText>????????????</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/all-articles">
              <SmallNavIcon src={RWD_ICON?.BLOG_ICON} />
              <SmallNavText>????????????</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/category?lat=25.0498583&lng=121.5172606&category=food">
              <SmallNavIcon src={RWD_ICON?.DISH_ICON} />
              <SmallNavText>????????????</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/my-schedules">
              <SmallNavIcon src={RWD_ICON?.TRIP_ICON} />
              <SmallNavText>????????????</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/my-articles">
              <SmallNavIcon src={RWD_ICON?.ARTICLE_ICON} />
              <SmallNavText>????????????</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/my-favorites">
              <SmallNavIcon src={RWD_ICON?.FAVO_ICON} />
              <SmallNavText>????????????</SmallNavText>
            </HamburgerMenuLink>
            <SmallLogOutButton
              onClick={() => {
                signOutFunction();
              }}
            >
              ??????
            </SmallLogOutButton>
            <CloseIcon
              src={RWD_ICON?.CLOSE_ICON}
              active={clicked}
              onClick={() => setClicked(false)}
            />
          </SmallScreenNavBar>
        </Background>
      </SmallGreyHeader>
    </>
  );
}

export default GreyHeaderComponent;
