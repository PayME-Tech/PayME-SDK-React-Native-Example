/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../assets/Colors';
import {Layout} from '../../components/layout/Layout';
import LinearGradient from 'react-native-linear-gradient';
import {Fonts} from '../../assets/Fonts';
import {Images, ImagesSVG} from '../../assets/Image';
import {Header} from './sub-items/Header';
import {ServiceUtilPayme} from './sub-items/ServiceUtilPayme';
import {ListProduct} from './sub-items/ListProduct';
import {Footer} from './sub-items/Footer';
import {PopupInputPhone} from './sub-items/PopupInputPhone';
import payME from 'react-native-payme-sdk';
import {
  checkValidPhoneNumber,
  createConnectToken,
  formatNumber,
} from '../../helpers';
import {useDispatch, useSelector} from 'react-redux';
import {updateApp} from '../../redux/slices/app.slice';
import {PopupChangField} from './sub-items/PopupChangeField';
import {FIELDS} from '../../configs/variables.config';
import {ContentDefault} from './sub-items/ContentDefault';
import {ContentFieldFAndB} from './sub-items/ContentFieldFAndB';
import {ContentHotel} from './sub-items/ContentHotel';
import {ContentSuperMarket} from './sub-items/ContentSuperMarket';

const appToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6MX0.wNtHVZ-olKe7OAkgLigkTSsLVQKv_YL9fHKzX9mn9II';
const publicKey =
  'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKWcehEELB4GdQ4cTLLQroLqnD3AhdKi\nwIhTJpAi1XnbfOSrW/Ebw6h1485GOAvuG/OwB+ScsfPJBoNJeNFU6J0CAwEAAQ==\n';
const privateKey =
  'MIIBPAIBAAJBAKWcehEELB4GdQ4cTLLQroLqnD3AhdKiwIhTJpAi1XnbfOSrW/Eb\nw6h1485GOAvuG/OwB+ScsfPJBoNJeNFU6J0CAwEAAQJBAJSfTrSCqAzyAo59Ox+m\nQ1ZdsYWBhxc2084DwTHM8QN/TZiyF4fbVYtjvyhG8ydJ37CiG7d9FY1smvNG3iDC\ndwECIQDygv2UOuR1ifLTDo4YxOs2cK3+dAUy6s54mSuGwUeo4QIhAK7SiYDyGwGo\nCwqjOdgOsQkJTGoUkDs8MST0MtmPAAs9AiEAjLT1/nBhJ9V/X3f9eF+g/bhJK+8T\nKSTV4WE1wP0Z3+ECIA9E3DWi77DpWG2JbBfu0I+VfFMXkLFbxH8RxQ8zajGRAiEA\n8Ly1xJ7UW3up25h9aa9SILBpGqWtJlNQgfVKBoabzsU=\n';
// const configColor = ['#75255b', '#9d455f'];

export const Home = () => {
  const {phone, balance, colors, field} = useSelector(
    (state) => state.appReducer,
  );
  console.log({field, colors});
  const configColor = colors || ['#75255b', '#9d455f'];
  const dispatch = useDispatch();

  const popupInputPhoneRef = useRef(null);
  const popupChangFieldRef = useRef(null);

  const openPopupInputPhone = () => popupInputPhoneRef?.current?.open();
  const openPopupChangField = () => popupChangFieldRef?.current?.open();

  useEffect(() => {
    if (checkValidPhoneNumber(phone)) {
      //do sonmething
      const connectToken = createConnectToken(phone);

      payME.init(
        appToken,
        publicKey,
        connectToken,
        privateKey,
        configColor, // change here
        'sandbox',
      );

      payME.getWalletInfo(
        (response) => {
          console.log('response', response);
          dispatch(
            updateApp({
              balance: formatNumber(`${response?.walletBalance?.balance || 0}`),
            }) || '0',
          );
        },
        (error) => {
          console.log('error', error);
          dispatch(updateApp({balance: '0'}));
          alert('Thông tin xác thực không hợp lệ');
        },
      );
    }
  }, [phone]);

  const openWallet = () => {
    const connectToken = createConnectToken(phone);
    payME.init(
      appToken,
      publicKey,
      connectToken,
      privateKey,
      configColor, // change here
      'sandbox',
    );

    payME.openWallet(
      10000,
      'a',
      '',
      (res) => {
        console.log(res);
      },
      (message) => {
        console.log(message);
      },
    );
  };

  const renderContent = () => {
    switch (field) {
      case FIELDS.DEFAULT:
        return <ContentDefault />;
      case FIELDS.FIELD_FANDB:
        return <ContentFieldFAndB />;
      case FIELDS.HOTEL:
        return <ContentHotel />;
      case FIELDS.SUPERMARKET:
        return <ContentSuperMarket />;
      case FIELDS.TRAVELTOUR:
        return <ContentDefault />;

      default:
        return <ContentDefault />;
    }
  };

  return (
    <Layout backgroundColor={'#E5E6ED'}>
      <View style={styles.layoutHeader}>
        <LinearGradient
          start={{x: 0.0, y: 0.25}}
          end={{x: 0.5, y: 1.0}}
          colors={colors}
          style={styles.linearGradient}
        />
      </View>

      <Header
        openPopupInputPhone={openPopupInputPhone}
        openPopupChangField={openPopupChangField}
        phone={phone}
        balance={balance}
        openWallet={openWallet}
        colors={colors}
      />

      {renderContent()}

      <Footer colors={colors} />

      <PopupInputPhone modalRef={popupInputPhoneRef} />
      <PopupChangField modalRef={popupChangFieldRef} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  layoutHeader: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '41%',
  },
  linearGradient: {
    height: '100%',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
});
