import { StyleSheet,View } from 'react-native'
import React, { useMemo } from 'react'

import {Calendar, CalendarUtils, LocaleConfig} from 'react-native-calendars';
import moment from 'moment';
import 'moment/locale/es';
import { useCallback } from 'react';
import { Modal, Text } from 'native-base';
import Colors from '../../util/styles/colors';

// Obtiene los nombres de los días en el idioma deseado
const weekdays = moment.weekdays();

const INITIAL_DATE = moment().format('YYYY-MM-DD');

LocaleConfig.defaultLocale = 'es';
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
};


export const AgendaService = ({setDaySelected,handleCalendar,showCalendar,daySelected}) => {


  const onDayPress = useCallback((day) => {
    
    setDaySelected(day.dateString);
    handleCalendar(false)
  }, []);

  const marked = useMemo(() => {
    return {
      // [getDate(0)]: {
      //   dotColor: 'red',
      //   marked: true
      // },
      [daySelected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: Colors.primaryColor,
        selectedTextColor: Colors.white
      }
    };
  }, [daySelected]);

  const getDate = (count) => {
    const date = new Date(INITIAL_DATE);
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  };

  return (
    <Modal
    isOpen={showCalendar}
    onClose={() => handleCalendar(false)}
    >
        <Calendar
          style={styles.calendar}
          hideExtraDays
          current={INITIAL_DATE}
          minDate={getDate(0)}
          onDayPress={onDayPress}
          markedDates={marked}
          // maxDate={getDate(6)}
          disableAllTouchEventsForDisabledDays
          renderDay={(day, item) => (
            <View>
              <Text>{weekdays[day.weekday()]}</Text>
              <Text>{day.day}</Text>
            </View>
          )}
        />


    </Modal>
  )
}



const styles = StyleSheet.create({
  calendar: {
    marginBottom: 10
  },
})