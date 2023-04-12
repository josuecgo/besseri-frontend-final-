import { StyleSheet, Text, View } from 'react-native'
import React, { useMemo, useState } from 'react'

import {Calendar, CalendarUtils} from 'react-native-calendars';
import moment from 'moment';
import { useCallback } from 'react';
import { Modal } from 'native-base';

const INITIAL_DATE = moment().format('YYYY-MM-DD');

// const INITIAL_DATE = '1-04-2023';
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
        selectedColor: 'orange',
        selectedTextColor: 'red'
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
        />


    </Modal>
  )
}



const styles = StyleSheet.create({
  calendar: {
    marginBottom: 10
  },
})