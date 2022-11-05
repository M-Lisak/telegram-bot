const axios = require('axios')

const baseUrl = 'https://suppliers-stats.wildberries.ru/api/'

const Api = {
    reports: {
        reportDetailByPeriod: async (params) => 
            await axios.get(`${baseUrl}v1/supplier/reportDetailByPeriod`, { params }).then((response) => response?.data)
    }
}

module.exports = Api