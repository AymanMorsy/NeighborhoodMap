
const app ={
    url:'https://api.foursquare.com/v2/venues/search',
    location :'40.7243,-74.0018',
    query : 'coffee',
    limit : 10,
    v:20180323,
    id : '4TETLOO440V40H34OXK3T3ITK3XLNTSEIIOHPLQ2ZZUVFETH',
    key : 'E1FXU5525LJO01DMKJP4JQHKZEHP0GNKKGIVAMKPCF5LAGQI'
}
export const getAll = () =>
    fetch(`${app.url}?client_id=${app.id}&client_secret=${app.key}&v=${app.v}&limit=${app.limit}&ll=${app.location}&query=${app.query}`)
    .then(res => res.json())
    .then(data => data.response.venues)
    .catch(res => res)

