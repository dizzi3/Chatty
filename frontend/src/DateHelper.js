class DateHelper {

    static getShortDateString = (date) => {
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()

        if(hours < 10)
            hours = '0' + hours
        
        if(minutes < 10)
            minutes = '0' + minutes

        if(seconds < 10)
            seconds = '0' + seconds

        return hours + ':' + minutes + ':' + seconds
    }

    static getLongDateString = (date) => {

        const shortDate = this.getShortDateString(date)

        let day = date.getDate()
        let month = date.getMonth()
        let year = date.getFullYear()

        if(day < 10)
            day = '0' + day

        if(month < 10)
            month = '0' + month

        if(year < 10)
            year = '0' + year

        return day + '/' + month + '/' + year + ' ' + shortDate

    }

    static getDateString = (date) => {

        if(this.isDateFromToday(date))
            return this.getShortDateString(date)
            
        return this.getLongDateString(date)
    }

    static isDateFromToday = (date) => {

        const todayDate = new Date()

        if(date.getDate() === todayDate.getDate() &&
           date.getMonth() === todayDate.getMonth() &&
           date.getFullYear() === todayDate.getFullYear())
            return true

        return false
    }

}

module.exports = DateHelper