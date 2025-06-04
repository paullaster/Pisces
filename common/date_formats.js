export default (
    () => ({
        /**
         * 
         * @param {string | number | Date } date 
         * @returns 
         */
        formatToMySQLDateTime: (date) => {
            console.log('created date: ', date)
            if (!date) return null
            const d = new Date(date)
            return d.toISOString().slice(0, 19).replace('T', ' ')
        },
    })
)()