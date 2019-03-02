async function getStates() {
    const res = await fetch('https://api.airvisual.com/v2/city?city=Los Angeles&state=California&country=USA&key=CPaiW6P6xGxFyrP3D')
    const data = await res.json()
    console.log(data.data)
}