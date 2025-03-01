/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {Colors} from '../../../assets/Colors';
import {Fonts} from '../../../assets/Fonts';
import {Images} from '../../../assets/Image';
import {SCREEN_SIZE} from '../../../configs/variables.config';
import LinearGradient from 'react-native-linear-gradient';

export const ListProduct = ({handlePay}) => {
  const items = [
    {
      amount: 299000,
      display: '299,000 đ',
      payCode: 'PAYME',
    },
    {
      amount: 299000,
      display: '299,000 đ',
      payCode: 'ATM',
    },
    {
      amount: 299000,
      display: '299,000 đ',
      payCode: 'CREDIT',
    },
    {
      amount: 3999000,
      display: '3,999,000 đ',
      payCode: 'MANUAL_BANK',
    },
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.txtTitle}>Thanh toán sản phẩm của bạn</Text>

      <ScrollView
        contentContainerStyle={styles.listProduct__container}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        horizontal>
        {items.map((item, index) => (
          <View style={styles.item__container} key={item.payCode}>
            <View style={styles.item__content__container}>
              <Image
                source={Images.BannerSample}
                style={{
                  width: SCREEN_SIZE.WIDTH * 0.6,
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                }}
              />

              <View style={styles.item__content}>
                <Text style={styles.txtNameProduct}>{`Sản phẩm ${index + 1}`}</Text>
                <Text style={styles.txtPriceProduct}>{item.display}</Text>
              </View>
            </View>

            <LinearGradient
              start={{x: 0.0, y: 0.25}}
              end={{x: 0.5, y: 1.0}}
              colors={[Colors.vibrantGreen, Colors.emeraldGreenThree]}
              style={{marginTop: 10, borderRadius: 20}}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handlePay?.(item.amount, item.payCode)}>
                <Text style={styles.txtBtn}>Thanh toán ngay</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingLeft: 15,
    marginBottom: 70,
  },

  txtTitle: {
    fontFamily: Fonts.MainSemiBold,
    fontSize: 16,
    color: Colors.blackSeven,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: Colors.vividBlue,
  },
  item__container: {
    marginRight: 20,
  },

  listProduct__container: {
    marginVertical: 20,
  },
  item__content__container: {
    backgroundColor: Colors.white,
    borderRadius: 15,
  },
  item__content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  txtBtn: {
    fontFamily: Fonts.MainMedium,
    fontSize: 14,
    color: Colors.white,
  },
  txtNameProduct: {
    fontFamily: Fonts.MainMedium,
    fontSize: 16,
    color: Colors.warmGrey,
  },
  txtPriceProduct: {
    fontFamily: Fonts.MainMedium,
    fontSize: 24,
    color: Colors.greyishBrown,
  },
});
