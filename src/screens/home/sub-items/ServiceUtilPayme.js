import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../../assets/Colors';
import {Fonts} from '../../../assets/Fonts';
import {SCREEN_SIZE} from '../../../configs/variables.config';
import {checkLoginSDK, getIconService, handleErrorSDK} from '../../../helpers';
import payME from 'react-native-payme-sdk';
import {ImagesSVG} from '../../../assets/Image';
import {useDispatch} from 'react-redux';
import {updateApp} from '../../../redux/slices/app.slice';

export const ServiceUtilPayme = ({data, popupNotifyRef}) => {
  const dispatch = useDispatch();

  const [toggle, setToggle] = React.useState(false);

  const getList = () => {
    if (toggle) {
      return data;
    } else {
      return data?.slice(0, 4);
    }
  };

  const payMELogin = () => {
    console.log('+++++++++++paymeLogin');
    return new Promise((resolve) => {
      payME.login(
        (response) => {
          console.log('response login', response);
          dispatch(updateApp({isLoginSDK: true}));
          resolve(true);
        },
        (error) => {
          console.log('error login', error);
          Alert.alert(
            'Thông báo',
            `${error?.message || ''} ${error?.code ? `(${error?.code})` : ''}`,
          );
          resolve(false);
          dispatch(updateApp({isLoginSDK: false}));
        },
      );
    });
  };

  const openService = (item) => {
    payME.openService(
      {
        code: item.code,
        description: item.description,
      },
      (response) => {
        console.log('response openService', response);
      },
      (error) => {
        console.log('error openService', error);
        handleErrorSDK(error);
        if (error?.code === -4) {
          popupNotifyRef.current?.open('ACTIVE');
        } else if (error?.code === -5) {
          popupNotifyRef.current?.open('KYC');
        } else {
          Alert.alert(
            'Thông báo',
            `${error?.message || ''} ${error?.code ? `(${error?.code})` : ''}`,
          );
        }
      },
    );
  };

  const handlePressItem = (item) => {
    if (!checkLoginSDK()) {
      payMELogin().then((res) => {
        if (res) {
          openService(item);
        }
      });
    } else {
      openService(item);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.txtServicePaymeLable}>Dịch vụ tiện ích PayME</Text>
        <TouchableOpacity
          hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}
          onPress={() => setToggle(!toggle)}>
          {toggle ? (
            <ImagesSVG.iconMoreService />
          ) : (
            <ImagesSVG.iconMoreServiceDown />
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.txtDes}>
        Bạn có thể tích hợp các dịch vụ thanh toán, ứng dụng có thể tích hợp vào
        giao diện ứng dụng của bạn.
      </Text>

      <View style={styles.listService__container}>
        {getList()?.map((item) => (
          <TouchableOpacity
            key={item.code}
            style={styles.item__container}
            onPress={() => handlePressItem(item)}>
            {getIconService(item.code)}
            <Text style={styles.txtNameService}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingVertical: 10,
    width: SCREEN_SIZE.WIDTH - 30,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    borderRadius: 20,
  },
  listService__container: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  item__container: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  txtServicePaymeLable: {
    fontFamily: Fonts.MainSemiBold,
    fontSize: 16,
    color: Colors.blackSeven,
  },
  txtDes: {
    fontFamily: Fonts.MainMedium,
    fontSize: 11,
    color: Colors.warmGrey,
  },
  txtNameService: {
    fontFamily: Fonts.MainRegular,
    fontSize: 12,
    color: Colors.blackSeven,
    marginTop: 5,
  },
});
