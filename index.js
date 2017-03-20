const Wreck = require('wreck')
const Pattern = />Kundenzentrum([^<]*)(?:<[^>]*>)*Frühester Termin ([^<]*)/g
const moment = require('moment')
const querystring = require('querystring')

const params = {
  casetype_343: '0', // Personalausweis
  casetype_344: '0', // Personalausweis (vorläufig)
  casetype_345: '0', // Reisepass
  casetype_342: '0', // Express Reisepass
  casetype_341: '0', // Kinderreisepass
  casetype_340: '0', // Anmeldung bei Zuzug nach HH
  casetype_347: '0', // Ummeldung bei Umzug innerhalb HH
  casetype_337: '0', // Anmeldung Hund
  casetype_356: '0', // Fischereischein
  casetype_362: '0', // Führerscheintausch
  casetype_363: '0', // Sitzplatzausweis, Neuantrag
  casetype_336: '0', // Verpflichtungserklärung
  sentcasetypes: 'Weiter'
}

Wreck.post(
  'https://netappoint.de/hamburg/index.php?company=hamburg&step=2',
  {
    headers: {
      'User-Agent': 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'max-age=0'
    },
    payload: querystring.stringify(params)
  },
  (error, res, payload) => {
    if (error) throw error
    let data = payload.toString()
    let match
    const results = []
    while ((match = Pattern.exec(data))) {
      const place = match[1].trim()
      const dateStr = match[2].trim().replace(' um', '')
      const date = moment(dateStr, 'DD.MM.YYYY HH:mm')
      results.push({place: place, date: date.toDate(), duration: date.fromNow()})
    }
    console.log(JSON.stringify(results, null, '  '))
  })
