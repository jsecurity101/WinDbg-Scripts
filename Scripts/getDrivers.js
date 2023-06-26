"use strict";
function getDrivers(){
    let debugOutput = host.diagnostics.debugLog;
    let driverObjectType = host.getModuleType("nt", "_DRIVER_OBJECT");
    let objectDirectory = host.getModuleType("nt", "_OBJECT_DIRECTORY");
    let objectDirectoryEntry = host.getModuleType("nt", "_OBJECT_DIRECTORY_ENTRY");
    let objectAddress = host.getModuleSymbol("nt", "ObpRootDirectoryObject", "_OBJECT_DIRECTORY*");

    //Pulling \Driver
    let SAM_SERVICE_STARTED = objectAddress.HashBuckets[36].address; 
    let SAM_SERVICE_STARTED_Directory = host.createTypedObject(SAM_SERVICE_STARTED, objectDirectoryEntry);
    let chaindirectoryentry = host.createTypedObject(SAM_SERVICE_STARTED_Directory.ChainLink.address, objectDirectoryEntry);
    let driverList = host.createTypedObject(chaindirectoryentry.Object.address, objectDirectory);
    let driverHashBucket = driverList.HashBuckets;
    for(var i = 0; i < 37; i++){
        let driverObject = host.createTypedObject(driverHashBucket[i].Object.address, driverObjectType);
        debugOutput(`Driver Name: ${driverObject.DriverName}\n`);
        debugOutput(`   Driver Address: ${driverHashBucket[i].Object.address}\n\n`);
        let ChainLink = driverHashBucket[i].ChainLink.address;
        while(ChainLink.toString(16) != 0x0){
            let chainLinkDirectory = host.createTypedObject(ChainLink, objectDirectoryEntry);
            driverObject = host.createTypedObject(chainLinkDirectory.Object.address, driverObjectType);
            debugOutput(`DriverName: ${driverObject.DriverName}\n`);
            debugOutput(`   Driver Address: ${chainLinkDirectory.Object.address}\n\n`);
            ChainLink = chainLinkDirectory.ChainLink.address;
        }
    }

    //Pulling \FileSystem
    let Ntfs = objectAddress.HashBuckets[23].address; 
    let NTFS_Directory = host.createTypedObject(Ntfs, objectDirectoryEntry);
    let FileSystem = host.createTypedObject(NTFS_Directory.ChainLink.address, objectDirectoryEntry);
    let FileSystemAddress = host.createTypedObject(FileSystem.Object.address, objectDirectory);
    let filesystemdriverHashBucket = FileSystemAddress.HashBuckets;
    for(var i = 0; i < 37; i++){
        if(filesystemdriverHashBucket[i].address.toString(16) != 0x0){
            let driverObjectaddress = filesystemdriverHashBucket[i].Object.address; 
             if(driverObjectaddress.toString(16) != 0x0){
                let driverObject = host.createTypedObject(filesystemdriverHashBucket[i].Object.address, driverObjectType);
                debugOutput(`Driver Name: ${driverObject.DriverName}\n`);
                    debugOutput(`   Driver Address: ${filesystemdriverHashBucket[i].Object.address}\n\n`);
                    let ChainLink = filesystemdriverHashBucket[i].ChainLink.address;
                    while(ChainLink.toString(16) != 0x0){
                        let chainLinkDirectory = host.createTypedObject(ChainLink, objectDirectoryEntry);
                        driverObject = host.createTypedObject(chainLinkDirectory.Object.address, driverObjectType);
                        debugOutput(`DriverName: ${driverObject.DriverName}\n`);
                        debugOutput(`   Driver Address: ${chainLinkDirectory.Object.address}\n\n`);
                        ChainLink = chainLinkDirectory.ChainLink.address;
                    }
                }
            }    
    }
    return 0;
}