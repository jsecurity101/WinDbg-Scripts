"use strict";
function iterateList(firstAddress) {
    let listEntry = host.getModuleType("nt", "_LIST_ENTRY");
    let currentEntry = firstAddress

    const preoffset = 0x028;
    const postoffset = 0x030;
    let blink = host.createTypedObject(firstAddress, listEntry).Blink;
    host.diagnostics.debugLog(`Blink address: ${blink.address.toString(16)}\n`);
    while (currentEntry.toString(16) !== blink.address.toString(16)){
        let precallback = currentEntry.add(preoffset);
        let postcallback = currentEntry.add(postoffset);
        host.diagnostics.debugLog(`Address: ${currentEntry.toString(16)} has Precallback address: ${precallback.toString(16)} PostCallback address: ${postcallback.toString(16)}\n`);
       
        let nextEntry = host.createTypedObject(currentEntry, listEntry);
        currentEntry = nextEntry.Flink.address;

        
    }
    let precallback = blink.address.add(preoffset);
    let postcallback = blink.address.add(postoffset);
    host.diagnostics.debugLog(`Address: ${blink.address.toString(16)} has Precallback address: ${precallback.toString(16)} PostCallback address: ${postcallback.toString(16)}\n`);

    return 0;
}