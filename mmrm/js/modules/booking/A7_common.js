function getBookingDay(bookingDateStr) {
    if (!bookingDateStr) {
        return "";
    }

    let day = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
    let bookingDate = dayjs(bookingDateStr).toDate();
    let index = bookingDate.getDay();

    if (index > 6) {
        return "";
    }
    else {
        return day[index];
    }
}
