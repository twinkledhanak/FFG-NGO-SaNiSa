import {Product} from '../models/product';


export class Order{
    Comments : string;
    MatchedSakhis : any[];
    Products : Map<string,{}>;
    deliveryAddress : string;
    getLastModifiedOn : string;
    isAdhocOrder : string;
    lastModifiedBy : string;
    orderId : string;
    orderStatus : string;
    orderType : string;
    placedBy : string;
    placedOn : string;
    sellerId : string;
    sellerStatus : string;
    totalAmount : number;

}