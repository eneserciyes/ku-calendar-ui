import Api from '~/service/Api'

export default {
  createEvent(club, eventTitle, eventDescription, date, startTime, endTime) {
    const start = date + 'T' + startTime + ':00+03:00'
    const end = date + 'T' + endTime + ':00+03:00'
    Api().post(
      'persistence/events',
      JSON.stringify({
        club,
        eventTitle,
        description: eventDescription,
        start,
        end
      })
    )
  }
}
