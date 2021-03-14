"use strict";
const Mfrc522 = require("mfrc522-rpi")
const SoftSPI = require("rpi-softspi")
const softSPI = new SoftSPI({
  clock: 23, // pin number of SCLK
  mosi: 19, // pin number of MOSI
  miso: 21, // pin number of MISO
  client: 24 // pin number of CS
})

// GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
// I believe that channing pattern is better for configuring pins which are optional methods to use.
const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);
const decoder = new TextDecoder()
module.exports = (callback, workToDo) => {
    setInterval(() => {
        //# reset card
        mfrc522.reset()
    
        //# Scan for cards
        let response = mfrc522.findCard()

        if (!response.status) 
            return callback({status: 0})
    
        response = mfrc522.getUid()

        if (!response.status) return

        const uid =  response.data
        mfrc522.selectCard(uid)

        if (!mfrc522.authenticate(8, [0xff, 0xff, 0xff, 0xff, 0xff, 0xff], uid)) return

        if(workToDo.hasWork) {
            workToDo.hasWork = false
            const data = Array.from(workToDo.data)
            mfrc522.writeDataToBlock(8, data)
            return workToDo.callback()
        }
        const code = decoder.decode(new Uint8Array(mfrc522.getDataForBlock(8)))

        mfrc522.stopCrypto()
    
        return callback({ status: 1, code })

            // console.log("Card detected, CardType: " + response.bitSize);
    
        //# Get the UID of the card
        // response = mfrc522.getUid();
        // if (!response.status) {
        //   console.log("UID Scan Error");
        //   return;
        // }
        //# If we have the UID, continue
        // const uid = response.data;
        // console.log(
        //   "Card read UID: %s %s %s %s",
        //   uid[0].toString(16),
        //   uid[1].toString(16),
        //   uid[2].toString(16),
        //   uid[3].toString(16)
        // );
    
        //# Select the scanned card
        // const memoryCapacity = mfrc522.selectCard(uid);
        // console.log("Card Memory Capacity: " + memoryCapacity);
    
        //# This is the default key for authentication
        // const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
    
        // //# Authenticate on Block 8 with key and uid
        // if (!mfrc522.authenticate(8, key, uid)) {
        //   console.log("Authentication Error");
        //   return;
        // }
    
        //# Dump Block 8
        // console.log("Block: 8 Data: " + );
    
        //# Stop
    }, 500)
}
