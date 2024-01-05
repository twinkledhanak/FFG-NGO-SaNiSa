const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mapsClient = require('@google/maps');

var sakhiIdList = []
var possibleSellerList = []
var deliveryAddress = ""
var productList = new Map()

admin.initializeApp(functions.config().firebase);

exports.findSakhiList = functions.database.ref('/Orders/{pushId}').onCreate(event=> {


            const order = event.data.val()
            const userId = order.placedBy
            // var writeFlag = false

            // dbRoot.child(`/Users/${placedBy}`).once('value').then(snap =>{
            // 	var userInfo = snap.val()
            // 	var userType = userInfo.userType
                
            // 	if(writeFlag)
            // 		return

            // 	if(userType==="Sakhi"){
            // 		writeFlag = true
            // 		order.sellerId = "Gruhudyog"
            // 		return event.data.ref.set(order)
            // 	}
        
            // })

            const dbRoot = event.data.ref.root
            
            const userListPromise = dbRoot.child("/Users").once('value')

            const deliveryAddress = order.deliveryAddress
            
            

            productMap = order.Products

            const sakhiListPromise = userListPromise.then(snap => {

                        snap.forEach(function(child){

                            if(child.val().userType==="Sakhi"){

                                var sakhiUid = child.key
                                console.log("SakhiId" + sakhiUid)
                                sakhiIdList.push(sakhiUid)

                            }
                        })

                        const sakhiInventoryRef = dbRoot.child("/Inventory")
                        return sakhiInventoryRef.once('value')

                    })

            const sakhiInventoryPromise = sakhiListPromise.then(snap => {

                                    var inventory = snap.val()
                                    console.log(inventory)		//inventory for all sakhis
                                    
                                    for(var i=0;i<sakhiIdList.length;i++){
                                        
                                        var sakhi = sakhiIdList[i]
                                        var possibleSellerFlag = false
                                        var sakhiSpecificInventory = inventory[sakhi].Products
                                        console.log(productsMap)
                                        
                                        for(var productKey in productsMap){

                                        
                                        console.log(productKey)
                                        //var orderQuantity = sakhiSpecificInventory[product.pid].qty
                                        
                                        console.log(productKey in sakhiSpecificInventory)
                                        if(productKey in sakhiSpecificInventory){
                                        
                                            var quantityInStock = sakhiSpecificInventory[productKey]
                                            console.log(quantityInStock)

                                            if(quantityInStock>=product.unitQuantity){
                                            possibleSellerFlag = true
                                            }
                                            else{
                                                possibleSellerFlag = false
                                            }
                                            
                                        }


                                    }
                                    if(possibleSellerFlag===true)
                                        possibleSellerList.push(id)
                                }
                                        console.log(possibleSellerList)
                                        return dbRoot.child("/Users").once('value')

                                })

            const sakhiAddressListPromise = sakhiInventoryPromise.then(snap => {

                                    var sakhiAddressList = {}

                                    for(var i=0;i<possibleSellerList.length;i++){
                                        var sakhiId = possibleSellerList[i]
                                        if(snap.hasChild(sakhiId)){
                                            var sakhi = snap.child(`/${sakhiId}`)
                                            var sakhiDetails = sakhi.val()
                                            var sakhiAddress = sakhiDetails.Addresses.Address1
                                            console.log(sakhiAddress)
                                            sakhiAddressList[sakhi.key] = String(sakhiAddress.addressLine1+" "+sakhiAddress.city+" "+sakhiAddress.pinCode)
                                            console.log(sakhiAddressList)
                                        }
                                    }
                                    
                                    if(Object.keys(sakhiAddressList).length===0){
                                        return(console.log("No Sakhi with required stock was found"))
                                        
                                    }
                                    else{
                                        return findDistance(deliveryAddress,sakhiAddressList)
                                    }
                                    
            })

        
            return sakhiAddressListPromise
				
						})

						function findDistance(clientAddress,sakhiAddressList){

							const idList = []
							const addressList = []
							const distanceList = {}
							const radius = 4100
							for(var k in sakhiAddressList){
								idList.push(k)
								addressList.push(sakhiAddressList[k])
							}

							var googleMapsClient = mapsClient.createClient({
								key: 'AIzaSyBqJIhIAMeZCEzGpS1_cD067AR8Vul72uM',
								Promise : Promise
							})

							googleMapsClient.distanceMatrix({
											
											
											origins: [clientAddress],
											destinations : addressList

											}).asPromise()
											  .then(function(response){

												console.log(response)
												jsonResp = response.json
												jsonRows = jsonResp.rows
												for(var j=0;j<jsonRows.length;j++){
													var tempRowObject = jsonRows[j].elements
													for(var i=0;i<tempRowObject.length;i++){
														var distance = tempRowObject[i].distance.value
														if(distance<=radius){
														distanceList[idList[i]] = distance
													}
													}
												}

												console.log(distanceList)
											
												return distanceList
												
											}).catch((err)=>{
												console.log(err)
											})
											
						}

