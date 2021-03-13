const $=id=>document.getElementById(id)

const ws = new WebSocket('ws://' + document.location.host + '/socket')


const people = {
    0: 'Radu',
    1: 'Marin',
    2: 'Petrea'
}

const encoder = new TextEncoder()

$('writeButton').onclick = () => {
    $('writeButton').disabled = 'disabled'
    const encoded = encoder.encode($('code').value)
    const toSend = Uint8Array.from(Array(17).fill(0))
    for (let i = 0; i < toSend.length; i++) {
        toSend[i] = encoded[i]
    }

    ws.send(toSend)
}



ws.onmessage = msg => {
    msg = JSON.parse(msg.data)
    if (msg.status)
        $('read').innerHTML = `<span style='font-size: 23px; color: yellow'>Welcome back, ${msg.code}</span>`
    else
        $('read').innerHTML = `<span style='font-size: 23px; color: white'>Atingeti NFC Cartela ...</span>`


    console.log(msg)
    
    if (msg.written) {
        $('writeButton').removeAttribute('disabled')
        $('code').value = ''
    }
}